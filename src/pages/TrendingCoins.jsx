
import React, { useEffect, useState } from "react";
import { getTrending } from "../CryptoChatbot/coinGeckoService";
import { Link } from "react-router-dom";
import { FiTrendingUp, FiBarChart2 } from "react-icons/fi";
import "./TrendingCoins.css";

const COINS_PER_PAGE = 15;

const TrendingCoins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    async function fetchTrendingCoins() {
      setLoading(true);
      setError(null);
      try {
        const data = await getTrending();
        // Map trending data to match previous UI expectations
        setCoins(
          (data || []).map((c) => ({
            id: c.id,
            name: c.name,
            symbol: c.symbol,
            image: c.thumb,
            market_cap_rank: c.marketCapRank,
            price_btc: c.priceBtc,
          }))
        );
      } catch {
        setError("Failed to fetch trending coins.");
      } finally {
        setLoading(false);
      }
    }
    fetchTrendingCoins();
  }, []);

  // No 24h change, volume, or USD price in trending API, so stats and table columns are limited
  const COINS_PER_PAGE = 7;
  const totalPages = Math.ceil(coins.length / COINS_PER_PAGE);
  const sortedCoins = coins.slice().sort((a, b) => {
    if (!a.market_cap_rank) return 1;
    if (!b.market_cap_rank) return -1;
    return a.market_cap_rank - b.market_cap_rank;
  });
  const paginatedCoins = sortedCoins.slice((page - 1) * COINS_PER_PAGE, page * COINS_PER_PAGE);

  return (
    <div className="top-losers-container">
      <section className="tl-hero">
        <div className="tl-hero-glow"></div>
        <div className="tl-hero-glow-secondary"></div>
        <div className="tl-hero-content">
          <div className="tl-hero-badge" style={{ color: "#38bdf8", borderColor: "#38bdf8", background: "rgba(56,189,248,0.15)" }}>
            <FiTrendingUp className="badge-icon" />
            <span>Trending Coins</span>
          </div>
          <h1 className="tl-hero-title">
            <span className="tl-title-red" style={{ background: "linear-gradient(135deg, #38bdf8, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Biggest</span>
            <br />
            <span className="tl-title-orange" style={{ background: "linear-gradient(135deg, #a78bfa, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>24h Trending Coins</span>
          </h1>
          <p className="tl-hero-subtitle">
            Track the most popular coins in the last 24 hours. Discover what's hot, spot momentum, and stay informed on market trends.
          </p>
          <div className="tl-hero-stats">
            <div className="tl-stat-card glass-card">
              <span className="stat-icon" style={{ color: "#38bdf8" }}><FiTrendingUp /></span>
              <div className="stat-info">
                <span className="stat-value">{coins.length}</span>
                <span className="stat-label">Coins Trending</span>
              </div>
            </div>
            <div className="tl-stat-card glass-card">
              <span className="stat-icon" style={{ color: "#a78bfa" }}><FiBarChart2 /></span>
              <div className="stat-info">
                <span className="stat-value">Live</span>
                <span className="stat-label">Real-time Data</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Trending Coins Highlight Section */}
      {!loading && !error && sortedCoins.length > 0 && (
        <section style={{ display: "flex", justifyContent: "center", gap: 32, margin: "32px 0" }}>
          {sortedCoins.slice(0, 3).map((coin, idx) => (
            <Link
              to={`/coin/${coin.id}`}
              key={coin.id}
              style={{
                background: idx === 0 ? "rgba(34,211,238,0.18)" : idx === 1 ? "rgba(168,139,250,0.18)" : "rgba(244,114,182,0.18)",
                border: "2px solid #22d3ee",
                borderRadius: 20,
                boxShadow: "0 4px 32px 0 rgba(34,211,238,0.10)",
                padding: 24,
                minWidth: 220,
                maxWidth: 260,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textDecoration: "none",
                color: "#fff",
                position: "relative",
                transition: "transform 0.2s",
                zIndex: 2,
                marginTop: idx === 1 ? -16 : 0,
                marginBottom: idx === 1 ? 16 : 0,
              }}
            >
              <div style={{ position: "absolute", top: 12, left: 16, fontWeight: 700, color: "#22d3ee", fontSize: 18 }}>
                #{idx + 1}
              </div>
              <img src={coin.image} alt={coin.name} style={{ width: 64, height: 64, borderRadius: "50%", marginBottom: 12, border: "2px solid #818cf8", background: "#18192b" }} />
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>{coin.name}</div>
              <div style={{ color: "#a5f3fc", fontSize: 15, marginBottom: 8 }}>{coin.symbol.toUpperCase()}</div>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 6 }}>Rank: {coin.market_cap_rank || '-'}</div>
              <div style={{ color: "#4ade80", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{coin.price_btc ? `${coin.price_btc.toFixed(8)} BTC` : '-'}</div>
            </Link>
          ))}
        </section>
      )}

      {/* Sort Bar (visual only, no sorting for trending) */}
      <section className="tl-controls">
        <div className="tl-sort-bar glass-panel">
          <span className="sort-label">Sort by:</span>
          <div className="sort-options">
            <button className="sort-btn active">Trending</button>
            <button className="sort-btn" disabled>Market Cap</button>
            <button className="sort-btn" disabled>Price</button>
            <button className="sort-btn" disabled>Rank</button>
          </div>
        </div>
      </section>



      {/* Table Section */}
      <section className="tl-market-section">
        {loading && (
          <div className="tl-loading">
            <div className="tl-spinner"></div>
            <p>Fetching trending coins...</p>
          </div>
        )}
        {error && (
          <div className="tl-error glass-panel">
            <p>{error}</p>
            <p>Please try again later.</p>
          </div>
        )}
        {!loading && !error && (
          <div className="tl-table-container glass-panel">
            <div className="tl-table-header">
              <div className="tl-col-rank">#</div>
              <div className="tl-col-name">Coin</div>
              <div className="tl-col-symbol">Symbol</div>
              <div className="tl-col-mcap">Market Cap</div>
              <div className="tl-col-price">Price (BTC)</div>
              <div className="tl-col-rank">Rank</div>
            </div>
            <div className="tl-table-body">
              {paginatedCoins.length > 0 ? (
                paginatedCoins.map((coin, index) => (
                  <Link to={`/coin/${coin.id}`} className="tl-table-row" key={coin.id}>
                    <div className="tl-col-rank">{(page - 1) * COINS_PER_PAGE + index + 1}</div>
                    <div className="tl-col-name" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <img src={coin.image} alt={coin.name} className="tl-coin-icon" style={{ width: 36, height: 36, borderRadius: "50%" }} />
                      <span>{coin.name}</span>
                    </div>
                    <div className="tl-col-symbol">{coin.symbol}</div>
                    <div className="tl-col-mcap">{coin.market_cap_rank ? `#${coin.market_cap_rank}` : '-'}</div>
                    <div className="tl-col-price">{coin.price_btc ? `${coin.price_btc.toFixed(8)} BTC` : '-'}</div>
                    <div className="tl-col-rank">{coin.market_cap_rank || '-'}</div>
                  </Link>
                ))
              ) : (
                <div className="tl-empty">
                  <p>No trending coins found.</p>
                </div>
              )}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="tl-pagination">
                <button
                  className="tl-page-btn"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Prev
                </button>
                <div className="tl-page-numbers">
                  {totalPages <= 5
                    ? Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        className={`tl-page-num ${page === num ? "active" : ""}`}
                        onClick={() => setPage(num)}
                      >
                        {num}
                      </button>
                    ))
                    : (() => {
                      const pages = [];
                      if (page <= 3) {
                        for (let i = 1; i <= 5; i++) pages.push(i);
                      } else if (page >= totalPages - 2) {
                        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
                      } else {
                        for (let i = page - 2; i <= page + 2; i++) pages.push(i);
                      }
                      return pages.map((num) => (
                        <button
                          key={num}
                          className={`tl-page-num ${page === num ? "active" : ""}`}
                          onClick={() => setPage(num)}
                        >
                          {num}
                        </button>
                      ));
                    })()}
                </div>
                <button
                  className="tl-page-btn"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default TrendingCoins;
