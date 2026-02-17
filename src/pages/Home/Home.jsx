import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import { CoinContext } from "../../context/CoinContextInstance";
import { Link } from "react-router-dom";
import { FiSearch, FiArrowUpRight, FiArrowDownRight, FiFilter, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";
import MarketFilters from "../../components/MarketFilters";

const Home = () => {
  const { allCoin, filteredCoins, currency } = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const inputHandler = (e) => {
    setInput(e.target.value);
    if (e.target.value === "") {
      setDisplayCoin(filteredCoins);
    }
    setCurrentPage(1); // Reset to first page on search
  };

  const searchHandler = (e) => {
    e.preventDefault();
    if (input && filteredCoins) {
      setDisplayCoin(
        filteredCoins.filter((item) =>
          item.name.toLowerCase().includes(input.toLowerCase())
        )
      );
    } else {
      setDisplayCoin(filteredCoins);
    }
    setCurrentPage(1); // Reset to first page on search
  };

  const applyFilters = () => {
    let filtered = [...filteredCoins];
    if (minPrice) filtered = filtered.filter((coin) => coin.current_price >= Number(minPrice));
    if (maxPrice) filtered = filtered.filter((coin) => coin.current_price <= Number(maxPrice));
    setDisplayCoin(filtered);
    setShowFilters(false);
    setCurrentPage(1); // Reset to first page on filter
  };

  useEffect(() => {
    setDisplayCoin(filteredCoins);
  }, [filteredCoins]);

  // Pagination Logic
  const totalPages = Math.ceil((displayCoin.length || 0) / itemsPerPage);
  const currentCoins = displayCoin.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const section = document.querySelector('.market-section');
      if (section) {
        window.scrollTo({ top: section.offsetTop - 100, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="home-container">
      {/* -------------------------------------------
        COSMIC HERO SECTION
        -------------------------------------------
      */}
      <section className="cosmic-hero">
        <div className="hero-glow-center"></div>
        <div className="hero-planet"></div>

        {/* Floating Elements (Orbitals) */}
        <motion.div
          className="orbital-element orb-1 glass-card"
          animate={{ y: [0, -15, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span>Bitcoin</span>
          <span className="text-gradient-cyan" style={{ color: '#00f5ff' }}>+5.2%</span>
        </motion.div>

        <motion.div
          className="orbital-element orb-2 glass-card"
          animate={{ y: [0, 20, 0], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <span>Ethereum</span>
          <span className="text-gradient-cyan" style={{ color: '#00f5ff' }}>+1.5%</span>
        </motion.div>

        <motion.div
          className="orbital-element orb-3 glass-card"
          animate={{ y: [0, 25, 0], x: [0, -10, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <span>Solana</span>
          <span className="text-gradient-cyan" style={{ color: '#00f5ff' }}>+8.5%</span>
        </motion.div>

        <motion.div
          className="orbital-element orb-4 glass-card"
          animate={{ y: [0, -20, 0], x: [0, 15, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          <span>Cardano</span>
          <span style={{ color: '#ff4d6d' }}>-2.1%</span>
        </motion.div>

        <motion.div
          className="orbital-element orb-5 glass-card"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <span>BNB</span>
          <span className="text-gradient-cyan" style={{ color: '#00f5ff' }}>+1.2%</span>
        </motion.div>

        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="title-purple">Sailing The Seas Of</span> <br />
            <span className="title-cyan">Crypto Universe</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Explore real-time data across the blockchain galaxy.
          </motion.p>

          <motion.div
            className="search-orbit-container"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <form className="search-bar-cosmic glass-panel" onSubmit={searchHandler}>
              <FiSearch className="search-icon" />
              <input
                value={input}
                onChange={inputHandler}
                list="coinlist"
                placeholder="Search Tokens..."
              />
              <button type="button" className="filter-trigger" onClick={() => setShowFilters(!showFilters)} aria-label="Filter markets">
                <FiFilter />
              </button>
            </form>

            {showFilters && (
              <motion.div
                className="cosmic-filters glass-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <input type="number" placeholder="Min Price" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                <input type="number" placeholder="Max Price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                <button className="btn-neon-purple" onClick={applyFilters}>Apply</button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* -------------------------------------------
        MARKET DATA SECTION
        -------------------------------------------
      */}
      <section className="market-section">
        <div className="section-header">
          <h2>Market Overview</h2>
          <div className="market-actions">
            <div className="live-indicator">
              <span className="dot-pulse"></span>
              Live Updates
            </div>
            <MarketFilters />
          </div>
        </div>

        <div className="table-container glass-panel-home">
          <div className="table-header">
            <div className="col-rank">#</div>
            <div className="col-name">Asset</div>
            <div className="col-price">Price</div>
            <div className="col-change">24h Change</div>
            <div className="col-mcap">Market Cap</div>
          </div>

          <div className="table-body">
            {currentCoins && currentCoins.length > 0 ? (
              currentCoins.map((item, index) => (
                <Link to={`/coin/${item.id}`} className="table-row" key={item.id}>
                  <div className="col-rank">{item.market_cap_rank}</div>
                  <div className="col-name">
                    <img src={item.image} alt={item.name} className="coin-icon" />
                    <div className="coin-info">
                      <span className="coin-symbol">{item.symbol.toUpperCase()}</span>
                      <span className="coin-fullname">{item.name}</span>
                    </div>
                  </div>
                  <div className="col-price">
                    {currency.Symbol || currency.symbol}{item.current_price.toLocaleString()}
                  </div>
                  <div className={`col-change ${item.price_change_percentage_24h > 0 ? "positive" : "negative"}`}>
                    {item.price_change_percentage_24h > 0 ? <FiArrowUpRight /> : <FiArrowDownRight />}
                    {Math.abs(item.price_change_percentage_24h).toFixed(2)}%
                  </div>
                  <div className="col-mcap">
                    {currency.Symbol || currency.symbol}{item.market_cap.toLocaleString()}
                  </div>
                </Link>
              ))
            ) : (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: '#fff',
                fontSize: '1.1rem'
              }}>
                {allCoin && allCoin.length === 0 ? 'Loading crypto data...' : 'No coins found. Try adjusting your filters.'}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FiChevronLeft /> Previous
              </button>

              <div className="pagination-numbers">
                {totalPages <= 5 ? (
                  // Show all pages if 5 or fewer
                  Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))
                ) : (
                  // Logic to show a window of pages
                  (() => {
                    const pages = [];
                    if (currentPage <= 3) {
                      for (let i = 1; i <= 5; i++) pages.push(i);
                    } else if (currentPage >= totalPages - 2) {
                      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
                    } else {
                      for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
                    }
                    return pages.map(pageNum => (
                      <button
                        key={pageNum}
                        className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    ));
                  })()
                )}
              </div>

              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next <FiChevronRight />
              </button>
            </div>
          )}
        </div>
      </section>

      <datalist id="coinlist">
        {allCoin?.map((c, i) => (
          <option key={i} value={c.name} />
        ))}
      </datalist>
    </div>
  );
};

export default Home;