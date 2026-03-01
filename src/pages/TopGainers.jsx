import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getGainersLosers } from "../CryptoChatbot/coinGeckoService";
import "./TopGainers.css";

const TopGainers = () => {
  const [gainers, setGainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("best24h");
  const coinsPerPage = 10;
  const tableRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGainers() {
      setLoading(true);
      setError(null);
      try {
        const { gainers } = await getGainersLosers("inr", 50);
        setGainers(gainers || []);
      } catch (err) {
        setError("Failed to fetch market data.");
      } finally {
        setLoading(false);
      }
    }
    fetchGainers();
  }, []);

  // Sorting logic
  const sortedGainers = [...gainers];
  if (sortType === "best24h") {
    sortedGainers.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
  } else if (sortType === "best7d") {
    sortedGainers.sort((a, b) => b.price_change_percentage_7d_in_currency - a.price_change_percentage_7d_in_currency);
  } else if (sortType === "priceHigh") {
    sortedGainers.sort((a, b) => b.current_price - a.current_price);
  } else if (sortType === "priceLow") {
    sortedGainers.sort((a, b) => a.current_price - b.current_price);
  } else if (sortType === "volume") {
    sortedGainers.sort((a, b) => b.total_volume - a.total_volume);
  } else if (sortType === "marketCap") {
    sortedGainers.sort((a, b) => b.market_cap - a.market_cap);
  }

  const totalPages = Math.ceil(sortedGainers.length / coinsPerPage);
  const paginatedGainers = sortedGainers.slice(
    (currentPage - 1) * coinsPerPage,
    currentPage * coinsPerPage
  );

  const avgChange =
    gainers.reduce((acc, coin) => acc + coin.price_change_percentage_24h, 0) /
    (gainers.length || 1);

  return (
    <div className="page-wrapper">

      {/* HERO */}
      <section className="hero">
        <div className="hero-pill">🚀 Top Gainers</div>

        <h1 className="hero-title">
          Biggest <span>24h Gainers</span>
        </h1>

        <p className="hero-sub">
          Track the largest price surges in the last 24 hours. Identify
          volatility and market momentum in real time.
        </p>

        <div className="stats">
          <div className="stat">
            <div className="stat-number">{gainers.length}</div>
            <div className="stat-label">Coins Up</div>
          </div>

          <div className="stat">
            <div className="stat-number positive">
              +{avgChange.toFixed(2)}%
            </div>
            <div className="stat-label">Avg Gain (24H)</div>
          </div>

          <div className="stat">
            <div className="stat-number live-dot">Live</div>
            <div className="stat-label">Real-Time Data</div>
          </div>
        </div>
      </section>

      {/* SORT BAR */}
      <div className="sort-bar">
        <span>Sort by:</span>
        <button
          className={"pill" + (sortType === "best24h" ? " active" : "")}
          onClick={() => { setSortType("best24h"); setCurrentPage(1); }}
        >
          Best 24h
        </button>
        <button
          className={"pill" + (sortType === "best7d" ? " active" : "")}
          onClick={() => { setSortType("best7d"); setCurrentPage(1); }}
        >
          Best 7d
        </button>
        <button
          className={"pill" + (sortType === "priceHigh" ? " active" : "")}
          onClick={() => { setSortType("priceHigh"); setCurrentPage(1); }}
        >
          Price High
        </button>
        <button
          className={"pill" + (sortType === "priceLow" ? " active" : "")}
          onClick={() => { setSortType("priceLow"); setCurrentPage(1); }}
        >
          Price Low
        </button>
        <button
          className={"pill" + (sortType === "volume" ? " active" : "")}
          onClick={() => { setSortType("volume"); setCurrentPage(1); }}
        >
          Volume
        </button>
        <button
          className={"pill" + (sortType === "marketCap" ? " active" : "")}
          onClick={() => { setSortType("marketCap"); setCurrentPage(1); }}
        >
          Market Cap
        </button>
      </div>

      {/* TABLE */}
      <section className="table-section" ref={tableRef}>
        {loading && <div className="loading">Loading market data...</div>}
        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Coin</th>
                  <th>Price</th>
                  <th>24H Change</th>
                  <th>7D Change</th>
                  <th>Volume</th>
                  <th>Market Cap</th>
                </tr>
              </thead>

              <tbody>
                {paginatedGainers.map((coin, idx) => (
                  <tr
                    key={coin.id}
                    onClick={() => navigate(`/coin/${coin.id}`)}
                  >
                    <td style={{paddingLeft: "30px"}}>{(currentPage - 1) * coinsPerPage + idx + 1}</td>

                    <td className="coin-cell">
                      <img src={coin.image} alt={coin.name} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                      <div>
                        <div className="coin-symbol" style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{coin.symbol.toUpperCase()}</div>
                        <div className="coin-name" style={{ fontWeight: 600, fontSize: '0.85rem', color: '#a3a3a3' }}>
                          <a href={`/coin/${coin.id}`} style={{ color: '#a3a3a3', textDecoration: 'underline', fontWeight: 600 }}>{coin.name}</a>
                        </div>
                      </div>
                    </td>

                    <td>
                      ₹{coin.current_price.toLocaleString("en-IN")}
                    </td>

                    <td>
                      <span className={
                        coin.price_change_percentage_24h >= 0
                          ? "change-badge positive"
                          : "change-badge negative"
                      }>
                        {coin.price_change_percentage_24h >= 0 ? "+" : ""}
                        {coin.price_change_percentage_24h?.toFixed(2)}%
                      </span>
                    </td>

                    <td>
                      <span className={
                        coin.price_change_percentage_7d_in_currency >= 0
                          ? "change-badge positive"
                          : "change-badge negative"
                      }>
                        {coin.price_change_percentage_7d_in_currency >= 0 ? "+" : ""}
                        {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%
                      </span>
                    </td>

                    <td>
                      ₹{coin.total_volume?.toLocaleString("en-IN")}
                    </td>

                    <td>
                      ₹{coin.market_cap?.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="pagination pagination-modern">
              <button
                className="pagination-btn" disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                &lt; Prev
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  className={"pagination-btn page-number" + (currentPage === idx + 1 ? " active" : "")}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next &gt;
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default TopGainers;