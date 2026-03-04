import React, { useState, useContext, useMemo, useCallback } from "react";
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
import apiClient from "../utils/apiClient";
import "./NewListings.css";

const fetchNewListings = async (currency) => {
  // Use rate-limited apiClient to prevent 429 errors
  // Fetch pages sequentially to respect rate limits
  const pages = [1, 2, 3];
  const results = [];

  for (const page of pages) {
    const params = new URLSearchParams({
      vs_currency: currency,
      order: "market_cap_asc",
      per_page: "100",
      page: page.toString(),
      sparkline: "false",
      price_change_percentage: "24h,7d",
    });

    const url = `/api/coingecko/coins/markets?${params.toString()}`;
    const data = await apiClient.get(url);
    results.push(data);
  }
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
  const sortedCoins = useMemo(() => {
    if (!newCoins || newCoins.length === 0) return [];
    const copy = [...newCoins];
    switch (sortBy) {
      case "newest":
        return copy.sort((a, b) => new Date(b.atl_date) - new Date(a.atl_date));
      case "price_high":
        return copy.sort((a, b) => b.current_price - a.current_price);
      case "price_low":
        return copy.sort((a, b) => a.current_price - b.current_price);
      case "change_high":
        return copy.sort(
          (a, b) =>
            (b.price_change_percentage_24h || 0) -
            (a.price_change_percentage_24h || 0),
        );
      case "volume":
        return copy.sort(
          (a, b) => (b.total_volume || 0) - (a.total_volume || 0),
        );
      default:
        return copy;
    }
  }, [newCoins, sortBy]);

  // Pagination (memoized)
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(sortedCoins.length / itemsPerPage)),
    [sortedCoins.length],
  );
  const currentCoins = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedCoins.slice(start, start + itemsPerPage);
  }, [sortedCoins, currentPage, itemsPerPage]);

  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [totalPages],
  );

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

  // Memoized row component to reduce re-renders
  const CoinRow = useCallback(
    React.memo(({ coin, index }) => {
      const changeVal = Number(coin.price_change_percentage_24h) || 0;
      const changeClass =
        changeVal > 0 ? "positive" : changeVal < 0 ? "negative" : "neutral";
      const changeSign = changeVal > 0 ? "+" : "";
      return (
        <motion.div
          key={coin.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.03 }}
        >
          <Link to={`/coin/${coin.id}`} className="nl-table-row">
            <div className="nl-col-rank">
              {(currentPage - 1) * itemsPerPage + index + 1}
            </div>
            <div className="nl-col-name">
              <img src={coin.image} alt={coin.name} className="nl-coin-icon" />
              <div className="nl-coin-info">
                <span className="nl-coin-symbol">
                  {coin.symbol.toUpperCase()}
                </span>
                <span className="nl-coin-fullname">{coin.name}</span>
              </div>
            </div>
            <div className={`nl-col-price ${changeClass}`}>
              {currency.Symbol || currency.symbol}
              {coin.current_price < 0.01
                ? coin.current_price.toFixed(6)
                : coin.current_price.toLocaleString()}
            </div>
            <div className={`nl-col-change ${changeClass}`}>
              {changeVal > 0 ? <FiArrowUpRight /> : <FiArrowDownRight />}
              {changeSign}
              {Math.abs(changeVal).toFixed(2)}%
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
              <span className="date-badge">{formatDate(coin.atl_date)}</span>
            </div>
          </Link>
        </motion.div>
      );
    }),
    [currency, currentPage, itemsPerPage],
  );

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
                  {
                    newCoins.filter(
                      (c) => (c.price_change_percentage_24h || 0) > 0,
                    ).length
                  }
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

      {/* Top 5 Coins Card Section */}
      {!isLoading && !isError && newCoins.length > 0 && (
        <section className="nl-top3-section">
          <h2 className="nl-top3-title">Top 4 New Coins</h2>
          <div className="nl-top3-cards">
            {newCoins
              .slice()
              .sort((a, b) => (b.market_cap || 0) - (a.market_cap || 0))
              .slice(0, 4)
              .map((coin, idx) => (
                <Link to={`/coin/${coin.id}`} className="nl-top3-card glass-card" key={coin.id}>
                  <div className="nl-top3-rank">#{idx + 1}</div>
                  <img src={coin.image} alt={coin.name} className="nl-top3-icon" />
                  <div className="nl-top3-info">
                    <div className="nl-top3-symbol">{coin.symbol.toUpperCase()}</div>
                    <div className="nl-top3-name">{coin.name}</div>
                    <div className="nl-top3-price">
                      {currency.Symbol || currency.symbol}
                      {coin.current_price < 0.01
                        ? coin.current_price.toFixed(6)
                        : coin.current_price.toLocaleString()}
                    </div>
                    <div className="nl-top3-mcap">
                      Market Cap: {currency.Symbol || currency.symbol}{formatNumber(coin.market_cap)}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      )}

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
                  <CoinRow key={coin.id} coin={coin} index={index} />
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
                          className={`nl-page-num ${currentPage === num ? "active" : ""
                            }`}
                            onClick={() => handlePageChange(num)}
                          >
                            {num}
                          </button>
                        ),
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
                          className={`nl-page-num ${currentPage === num ? "active" : ""
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
