import React, { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowUpRight,
  FiArrowDownRight,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiClock,
  FiTrendingUp,
} from "react-icons/fi";
import { CoinContext } from "../context/CoinContextInstance";
import "./NewListings.css";

const fetchNewListings = async (currency) => {
  const apiKey = import.meta.env.VITE_CG_API_KEY;

  // Fetch page 2-3 of coins ordered by market cap (these are smaller / newer coins)
  // combined with volume sorting to find recently active new coins
  const pages = [1, 2, 3];
  const results = await Promise.all(
    pages.map(async (page) => {
      const baseUrl = `https://api.coingecko.com/api/v3/coins/markets`;
      const params = new URLSearchParams({
        vs_currency: currency,
        order: "market_cap_asc",
        per_page: "100",
        page: page.toString(),
        sparkline: "false",
        price_change_percentage: "24h,7d",
      });
      if (apiKey) params.append("x_cg_demo_api_key", apiKey);

      const response = await fetch(`${baseUrl}?${params.toString()}`, {
        method: "GET",
        headers: { accept: "application/json" },
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return response.json();
    })
  );

  // Combine all pages and sort by ATL date (newest ATL date = most recently listed)
  const allCoins = results.flat();

  // Filter and sort: coins with recent ATL dates are typically newly listed
  const withAtlDate = allCoins
    .filter((coin) => coin.atl_date && coin.current_price > 0)
    .sort((a, b) => new Date(b.atl_date) - new Date(a.atl_date));

  // Remove duplicates
  const uniqueCoins = Array.from(
    new Map(withAtlDate.map((coin) => [coin.id, coin])).values()
  );

  return uniqueCoins;
};

const NewListings = () => {
  const { currency } = useContext(CoinContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const itemsPerPage = 15;

  const {
    data: newCoins = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["newListings", currency.name],
    queryFn: () => fetchNewListings(currency.name),
    staleTime: 120000,
    refetchOnWindowFocus: false,
  });

  // Sorting logic
  const sortedCoins = [...newCoins].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.atl_date) - new Date(a.atl_date);
      case "price_high":
        return b.current_price - a.current_price;
      case "price_low":
        return a.current_price - b.current_price;
      case "change_high":
        return (
          (b.price_change_percentage_24h || 0) -
          (a.price_change_percentage_24h || 0)
        );
      case "volume":
        return (b.total_volume || 0) - (a.total_volume || 0);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedCoins.length / itemsPerPage);
  const currentCoins = sortedCoins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatNumber = (num) => {
    if (!num) return "N/A";
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toLocaleString();
  };

  return (
    <div className="new-listings-container">
      {/* Hero Section */}
      <section className="new-listings-hero">
        <div className="nl-hero-glow"></div>
        <div className="nl-hero-glow-secondary"></div>

        <motion.div
          className="nl-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="nl-hero-badge">
            <FiStar className="badge-icon" />
            <span>New Listings</span>
          </div>

          <h1 className="nl-hero-title">
            <span className="nl-title-purple">Discover Newly</span>
            <br />
            <span className="nl-title-cyan">Listed Coins</span>
          </h1>

          <p className="nl-hero-subtitle">
            Stay ahead of the market. Explore the latest cryptocurrency listings
            and find emerging opportunities before they go mainstream.
          </p>

          <div className="nl-hero-stats">
            <div className="nl-stat-card glass-card">
              <FiClock className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">{newCoins.length}+</span>
                <span className="stat-label">New Coins</span>
              </div>
            </div>
            <div className="nl-stat-card glass-card">
              <FiTrendingUp className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">
                  {newCoins.filter((c) => (c.price_change_percentage_24h || 0) > 0).length}
                </span>
                <span className="stat-label">Gainers (24h)</span>
              </div>
            </div>
            <div className="nl-stat-card glass-card">
              <FiStar className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">Live</span>
                <span className="stat-label">Real-time Data</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Sort Controls */}
      <section className="nl-controls">
        <div className="nl-sort-bar glass-panel">
          <span className="sort-label">Sort by:</span>
          <div className="sort-options">
            {[
              { key: "newest", label: "Newest" },
              { key: "price_high", label: "Price High" },
              { key: "price_low", label: "Price Low" },
              { key: "change_high", label: "Top Gainers" },
              { key: "volume", label: "Volume" },
            ].map((opt) => (
              <button
                key={opt.key}
                className={`sort-btn ${sortBy === opt.key ? "active" : ""}`}
                onClick={() => {
                  setSortBy(opt.key);
                  setCurrentPage(1);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Coins Table */}
      <section className="nl-market-section">
        {isLoading && (
          <div className="nl-loading">
            <div className="nl-spinner"></div>
            <p>Fetching newly listed coins...</p>
          </div>
        )}

        {isError && (
          <div className="nl-error glass-panel">
            <p>Failed to load new listings: {error?.message}</p>
            <p>Please try again later.</p>
          </div>
        )}

        {!isLoading && !isError && (
          <motion.div
            className="nl-table-container glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="nl-table-header">
              <div className="nl-col-rank">#</div>
              <div className="nl-col-name">Coin</div>
              <div className="nl-col-price">Price</div>
              <div className="nl-col-change">24h Change</div>
              <div className="nl-col-volume">Volume</div>
              <div className="nl-col-mcap">Market Cap</div>
              <div className="nl-col-date">Listed</div>
            </div>

            <div className="nl-table-body">
              {currentCoins.length > 0 ? (
                currentCoins.map((coin, index) => (
                  <motion.div
                    key={coin.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                  >
                    <Link
                      to={`/coin/${coin.id}`}
                      className="nl-table-row"
                    >
                      <div className="nl-col-rank">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </div>
                      <div className="nl-col-name">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="nl-coin-icon"
                        />
                        <div className="nl-coin-info">
                          <span className="nl-coin-symbol">
                            {coin.symbol.toUpperCase()}
                          </span>
                          <span className="nl-coin-fullname">{coin.name}</span>
                        </div>
                      </div>
                      <div className="nl-col-price">
                        {currency.Symbol || currency.symbol}
                        {coin.current_price < 0.01
                          ? coin.current_price.toFixed(6)
                          : coin.current_price.toLocaleString()}
                      </div>
                      <div
                        className={`nl-col-change ${
                          (coin.price_change_percentage_24h || 0) > 0
                            ? "positive"
                            : "negative"
                        }`}
                      >
                        {(coin.price_change_percentage_24h || 0) > 0 ? (
                          <FiArrowUpRight />
                        ) : (
                          <FiArrowDownRight />
                        )}
                        {Math.abs(
                          coin.price_change_percentage_24h || 0
                        ).toFixed(2)}
                        %
                      </div>
                      <div className="nl-col-volume">
                        {currency.Symbol || currency.symbol}
                        {formatNumber(coin.total_volume)}
                      </div>
                      <div className="nl-col-mcap">
                        {currency.Symbol || currency.symbol}
                        {formatNumber(coin.market_cap)}
                      </div>
                      <div className="nl-col-date">
                        <span className="date-badge">
                          {formatDate(coin.atl_date)}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="nl-empty">
                  <p>No newly listed coins found.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="nl-pagination">
                <button
                  className="nl-page-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <FiChevronLeft /> Prev
                </button>

                <div className="nl-page-numbers">
                  {totalPages <= 5
                    ? Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (num) => (
                          <button
                            key={num}
                            className={`nl-page-num ${
                              currentPage === num ? "active" : ""
                            }`}
                            onClick={() => handlePageChange(num)}
                          >
                            {num}
                          </button>
                        )
                      )
                    : (() => {
                        const pages = [];
                        if (currentPage <= 3) {
                          for (let i = 1; i <= 5; i++) pages.push(i);
                        } else if (currentPage >= totalPages - 2) {
                          for (let i = totalPages - 4; i <= totalPages; i++)
                            pages.push(i);
                        } else {
                          for (
                            let i = currentPage - 2;
                            i <= currentPage + 2;
                            i++
                          )
                            pages.push(i);
                        }
                        return pages.map((num) => (
                          <button
                            key={num}
                            className={`nl-page-num ${
                              currentPage === num ? "active" : ""
                            }`}
                            onClick={() => handlePageChange(num)}
                          >
                            {num}
                          </button>
                        ));
                      })()}
                </div>

                <button
                  className="nl-page-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next <FiChevronRight />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default NewListings;
