import React, { useContext, useEffect, useState, useMemo } from "react";
import "./Home.css";
import { CoinContext } from "../../context/CoinContextInstance";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiArrowUpRight,
  FiArrowDownRight,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
} from "react-icons/fi";
import { motion } from "framer-motion";
import MarketFilters from "../../components/Dashboard/MarketFilters";
import { useWatchlist } from "../../context/WatchlistContext";

const Home = () => {
  const { allCoin, filteredCoins, currency } = useContext(CoinContext);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // =========================
  // 🔍 SMART SEARCH (Debounce)
  // =========================
  useEffect(() => {
    const delay = setTimeout(() => {
      if (!input) {
        setDisplayCoin(filteredCoins);
      } else {
        const filtered = filteredCoins.filter((coin) =>
          coin.name.toLowerCase().includes(input.toLowerCase())
        );
        setDisplayCoin(filtered);
      }
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(delay);
  }, [input, filteredCoins]);

  // =========================
  // 🎯 FILTER LOGIC
  // =========================
  const applyFilters = () => {
    let filtered = [...filteredCoins];

    if (minPrice) {
      filtered = filtered.filter(
        (coin) => coin.current_price >= Number(minPrice)
      );
    }

    if (maxPrice) {
      filtered = filtered.filter(
        (coin) => coin.current_price <= Number(maxPrice)
      );
    }

    setDisplayCoin(filtered);
    setShowFilters(false);
    setCurrentPage(1);
  };

  useEffect(() => {
    setDisplayCoin(filteredCoins);
  }, [filteredCoins]);

  // =========================
  // 📊 GLOBAL STATS
  // =========================
  const totalMarketCap = useMemo(
    () => allCoin?.reduce((sum, c) => sum + c.market_cap, 0) || 0,
    [allCoin]
  );

  const avgChange = useMemo(
    () =>
      allCoin?.reduce(
        (sum, c) => sum + c.price_change_percentage_24h,
        0
      ) / (allCoin?.length || 1),
    [allCoin]
  );

  // =========================
  // 🔥 TRENDING COINS
  // =========================
  const trendingCoins = useMemo(() => {
    return [...(displayCoin || [])]
      .sort(
        (a, b) =>
          b.price_change_percentage_24h -
          a.price_change_percentage_24h
      )
      .slice(0, 5);
  }, [displayCoin]);

  // =========================
  // 📄 PAGINATION
  // =========================
  const totalPages = Math.ceil((displayCoin.length || 0) / itemsPerPage);

  const currentCoins = displayCoin.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const section = document.querySelector(".market-section");
      if (section) {
        window.scrollTo({
          top: section.offsetTop - 100,
          behavior: "smooth",
        });
      }
    }
  };

  // =========================
  // 🧱 SKELETON UI
  // =========================
  const SkeletonRows = () => (
    <div className="skeleton-container">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="skeleton-row" />
      ))}
    </div>
  );

  return (
    <div className="home-container">

      {/* ================= HERO ================= */}
      <section className="cosmic-hero">
        <div className="hero-content">
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            🚀 Crypto Universe
          </motion.h1>

          <p>Explore real-time blockchain data</p>

          {/* SEARCH */}
          <div className="search-bar-cosmic glass-panel">
            <FiSearch />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search Tokens..."
            />
            <button onClick={() => setShowFilters(!showFilters)}>
              <FiFilter />
            </button>
          </div>

          {/* FILTER PANEL */}
          {showFilters && (
            <div className="filters-box">
              <input
                type="number"
                placeholder="Min Price"
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max Price"
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              <button onClick={applyFilters}>Apply</button>
            </div>
          )}
        </div>
      </section>

      {/* ================= GLOBAL STATS ================= */}
      <section className="global-stats glass-panel">
        <div className="stat-card">
          <h4>Market Cap</h4>
          <p>{currency.symbol}{totalMarketCap.toLocaleString()}</p>
        </div>

        <div className="stat-card">
          <h4>Avg Change</h4>
          <p className={avgChange > 0 ? "positive" : "negative"}>
            {avgChange.toFixed(2)}%
          </p>
        </div>

        <div className="stat-card">
          <h4>Total Coins</h4>
          <p>{allCoin?.length}</p>
        </div>
      </section>

      {/* ================= TRENDING ================= */}
      <section className="trending-section glass-panel">
        <h3>🔥 Trending</h3>

        <div className="trending-list">
          {trendingCoins.map((coin) => (
            <Link key={coin.id} to={`/coin/${coin.id}`}>
              <img src={coin.image} alt="" />
              <span>{coin.symbol.toUpperCase()}</span>
              <span className="positive">
                +{coin.price_change_percentage_24h.toFixed(2)}%
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= MARKET TABLE ================= */}
      <section className="market-section">
        <div className="section-header">
          <h2>Market Overview</h2>
          <MarketFilters />
        </div>

        <div className="table-container">

          {/* HEADER */}
          <div className="table-header">
            <div>#</div>
            <div>Name</div>
            <div>Price</div>
            <div>24h</div>
            <div>Market Cap</div>
          </div>

          {/* BODY */}
          {!allCoin || allCoin.length === 0 ? (
            <SkeletonRows />
          ) : currentCoins.length === 0 ? (
            <div className="no-data">No coins found</div>
          ) : (
            currentCoins.map((item) => (
              <motion.div
                key={item.id}
                className="table-row"
                whileHover={{ scale: 1.02 }}
              >
                <div>{item.market_cap_rank}</div>

                <Link to={`/coin/${item.id}`}>
                  <img src={item.image} />
                  {item.name}
                </Link>

                <div>
                  {currency.symbol}
                  {item.current_price.toLocaleString()}
                </div>

                <div
                  className={
                    item.price_change_percentage_24h > 0
                      ? "positive"
                      : "negative"
                  }
                >
                  {item.price_change_percentage_24h > 0 ? (
                    <FiArrowUpRight />
                  ) : (
                    <FiArrowDownRight />
                  )}
                  {item.price_change_percentage_24h.toFixed(2)}%
                </div>

                <div>
                  {currency.symbol}
                  {item.market_cap.toLocaleString()}
                </div>
              </motion.div>
            ))
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <FiChevronLeft />
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* BACK TO TOP */}
      <button
        className="back-to-top"
        onClick={() =>
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
      >
        ↑
      </button>
    </div>
  );
};

export default Home;