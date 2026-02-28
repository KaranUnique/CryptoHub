import React, { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowDownRight,
  FiChevronLeft,
  FiChevronRight,
  FiTrendingDown,
  FiBarChart2,
  FiAlertTriangle,
} from "react-icons/fi";
import { CoinContext } from "../context/CoinContextInstance";
import "./TopLosers.css";

const fetchTopLosers = async (currency) => {
  const apiKey = import.meta.env.VITE_CG_API_KEY;

  // Fetch 3 pages of coins (250 total) to get a broad pool, then sort by worst 24h change
  const pages = [1, 2, 3];
  const results = await Promise.all(
    pages.map(async (page) => {
      const baseUrl = `/api/coingecko/coins/markets`;
      const params = new URLSearchParams({
        vs_currency: currency,
        order: "market_cap_desc",
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
    }),
  );

  const allCoins = results.flat();

  // Filter coins with negative 24h change, remove duplicates
  const uniqueCoins = Array.from(
    new Map(allCoins.map((coin) => [coin.id, coin])).values(),
  );

  // Sort by worst 24h price change ascending (biggest losers first)
  return uniqueCoins
    .filter(
      (coin) =>
        coin.current_price > 0 && coin.price_change_percentage_24h !== null,
    )
    .sort(
      (a, b) =>
        (a.price_change_percentage_24h || 0) -
        (b.price_change_percentage_24h || 0),
    );
};

const TopLosers = () => {
  const { currency } = useContext(CoinContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("change_worst");
  const itemsPerPage = 15;

  const {
    data: losers = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["topLosers", currency.name],
    queryFn: () => fetchTopLosers(currency.name),
    staleTime: 120000,
    refetchOnWindowFocus: false,
  });

  // Sorting logic
  const sortedCoins = [...losers].sort((a, b) => {
    switch (sortBy) {
      case "change_worst":
        return (
          (a.price_change_percentage_24h || 0) -
          (b.price_change_percentage_24h || 0)
        );
      case "change_7d":
        return (
          (a.price_change_percentage_7d_in_currency || 0) -
          (b.price_change_percentage_7d_in_currency || 0)
        );
      case "price_high":
        return b.current_price - a.current_price;
      case "price_low":
        return a.current_price - b.current_price;
      case "volume":
        return (b.total_volume || 0) - (a.total_volume || 0);
      case "mcap":
        return (b.market_cap || 0) - (a.market_cap || 0);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedCoins.length / itemsPerPage);
  const currentCoins = sortedCoins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatNumber = (num) => {
    if (!num) return "N/A";
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toLocaleString();
  };

  const totalNegative = losers.filter(
    (c) => (c.price_change_percentage_24h || 0) < 0,
  ).length;

  const avgLoss =
    losers.length > 0
      ? (
        losers
          .filter((c) => (c.price_change_percentage_24h || 0) < 0)
          .reduce((sum, c) => sum + (c.price_change_percentage_24h || 0), 0) /
        (totalNegative || 1)
      ).toFixed(2)
      : "0.00";

  return (
    <div className="top-losers-container">
      {/* Hero Section */}
      <section className="tl-hero">
        <div className="tl-hero-glow"></div>
        <div className="tl-hero-glow-secondary"></div>

        <motion.div
          className="tl-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="tl-hero-badge">
            <FiTrendingDown className="badge-icon" />
            <span>Top Losers</span>
          </div>

          <h1 className="tl-hero-title">
            <span className="tl-title-red">Biggest</span>
            <br />
            <span className="tl-title-orange">24h Losers</span>
          </h1>

          <p className="tl-hero-subtitle">
            Track the largest price drops in the last 24 hours. Identify
            volatility, spot potential rebounds, and stay informed on market
            downturns.
          </p>

          <div className="tl-hero-stats">
            <div className="tl-stat-card glass-card">
              <FiAlertTriangle className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">{totalNegative}</span>
                <span className="stat-label">Coins Down</span>
              </div>
            </div>
            <div className="tl-stat-card glass-card">
              <FiTrendingDown className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">{avgLoss}%</span>
                <span className="stat-label">Avg Loss (24h)</span>
              </div>
            </div>
            <div className="tl-stat-card glass-card">
              <FiBarChart2 className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">Live</span>
                <span className="stat-label">Real-time Data</span>
              </div>
            </div>
          </div>
        </motion.div>

      </section>

      {/* Top 3 Losers Highlight Cards */}
      <section className="tl-highlight-section">
        <div className="tl-highlight-title">Top 5 Losers</div>
        <div className="tl-highlight-cards">
          {(() => {
            // Take the 6 coins with the worst 24h loss, then sort those by market cap rank
            const worstSix = sortedCoins
              .filter((coin) => coin.market_cap_rank)
              .slice(0, 5)
              .sort((a, b) => a.market_cap_rank - b.market_cap_rank);
            return worstSix.map((coin, idx) => (
              <motion.div
                key={coin.id}
                className="tl-highlight-card glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link to={`/coin/${coin.id}`} className="tl-highlight-link">
                  <div className="tl-highlight-rank">#{coin.market_cap_rank}</div>
                  <img src={coin.image} alt={coin.name} className="tl-highlight-img" />
                  <div className="tl-highlight-info">
                    <div className="tl-highlight-symbol">{coin.symbol.toUpperCase()}</div>
                    <div className="tl-highlight-name">{coin.name}</div>
                    <div className="tl-highlight-price">
                      {currency.Symbol || currency.symbol}
                      {coin.current_price < 0.01
                        ? coin.current_price.toFixed(6)
                        : coin.current_price.toLocaleString()}
                    </div>
                    <div className="tl-highlight-loss">
                      <FiArrowDownRight className="loss-icon" />
                      {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </div>
                  </div>
                </Link>
              </motion.div>
            ));
          })()}
        </div>
      </section>

      {/* Sort Controls */}
      <section className="tl-controls">
        <div className="tl-sort-bar glass-panel">
          <span className="sort-label">Sort by:</span>
          <div className="sort-options">
            {[
              { key: "change_worst", label: "Worst 24h" },
              { key: "change_7d", label: "Worst 7d" },
              { key: "price_high", label: "Price High" },
              { key: "price_low", label: "Price Low" },
              { key: "volume", label: "Volume" },
              { key: "mcap", label: "Market Cap" },
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
      <section className="tl-market-section">
        {isLoading && (
          <div className="tl-loading">
            <div className="tl-spinner"></div>
            <p>Fetching top losers...</p>
          </div>
        )}

        {isError && (
          <div className="tl-error glass-panel">
            <p>Failed to load top losers: {error?.message}</p>
            <p>Please try again later.</p>
          </div>
        )}

        {!isLoading && !isError && (
          <motion.div
            className="tl-table-container glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="tl-table-header">
              <div className="tl-col-rank">#</div>
              <div className="tl-col-name">Coin</div>
              <div className="tl-col-price">Price</div>
              <div className="tl-col-change">24h Change</div>
              <div className="tl-col-change7d">7d Change</div>
              <div className="tl-col-volume">Volume</div>
              <div className="tl-col-mcap">Market Cap</div>
            </div>

            <div className="tl-table-body">
              {currentCoins.length > 0 ? (
                currentCoins.map((coin, index) => {
                  const change24h = coin.price_change_percentage_24h || 0;
                  const change7d =
                    coin.price_change_percentage_7d_in_currency || 0;
                  return (
                    <motion.div
                      key={coin.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                    >
                      <Link to={`/coin/${coin.id}`} className="tl-table-row">
                        <div className="tl-col-rank">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </div>
                        <div className="tl-col-name">
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="tl-coin-icon"
                          />
                          <div className="tl-coin-info">
                            <span className="tl-coin-symbol">
                              {coin.symbol.toUpperCase()}
                            </span>
                            <span className="tl-coin-fullname">
                              {coin.name}
                            </span>
                          </div>
                        </div>
                        <div className="tl-col-price">
                          {currency.Symbol || currency.symbol}
                          {coin.current_price < 0.01
                            ? coin.current_price.toFixed(6)
                            : coin.current_price.toLocaleString()}
                        </div>
                        <div className="tl-col-change negative">
                          <FiArrowDownRight />
                          {Math.abs(change24h).toFixed(2)}%
                        </div>
                        <div
                          className={`tl-col-change7d ${change7d >= 0 ? "positive" : "negative"
                            }`}
                        >
                          {Math.abs(change7d).toFixed(2)}%
                        </div>
                        <div className="tl-col-volume">
                          {currency.Symbol || currency.symbol}
                          {formatNumber(coin.total_volume)}
                        </div>
                        <div className="tl-col-mcap">
                          {currency.Symbol || currency.symbol}
                          {formatNumber(coin.market_cap)}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })
              ) : (
                <div className="tl-empty">
                  <p>No loser data found.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="tl-pagination">
                <button
                  className="tl-page-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <FiChevronLeft /> Prev
                </button>

                <div className="tl-page-numbers">
                  {totalPages <= 5
                    ? Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (num) => (
                        <button
                          key={num}
                          className={`tl-page-num ${currentPage === num ? "active" : ""
                            }`}
                          onClick={() => handlePageChange(num)}
                        >
                          {num}
                        </button>
                      ),
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
                          className={`tl-page-num ${currentPage === num ? "active" : ""
                            }`}
                          onClick={() => handlePageChange(num)}
                        >
                          {num}
                        </button>
                      ));
                    })()}
                </div>

                <button
                  className="tl-page-btn"
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

export default TopLosers;
