import React, { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CoinContext } from "../context/CoinContextInstance";
import { useWatchlist } from "../context/WatchlistContext";
import "./Watchlist.css";

const Watchlist = () => {
  const { allCoin, currency } = useContext(CoinContext);
  const { watchlist, toggleWatchlist, clearWatchlist, loading } = useWatchlist();
  const [sortKey, setSortKey] = useState("market_cap");
  const [sortDir, setSortDir] = useState("desc");
  const [search, setSearch] = useState("");

  const watchlistCoins = useMemo(() => {
    if (!allCoin || allCoin.length === 0) return [];
    let coins = allCoin.filter((c) => watchlist.includes(c.id));

    if (search.trim()) {
      const q = search.toLowerCase();
      coins = coins.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.symbol.toLowerCase().includes(q),
      );
    }

    coins.sort((a, b) => {
      let valA, valB;
      switch (sortKey) {
        case "name":
          return sortDir === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case "price":
          valA = a.current_price || 0;
          valB = b.current_price || 0;
          break;
        case "change_24h":
          valA = a.price_change_percentage_24h || 0;
          valB = b.price_change_percentage_24h || 0;
          break;
        case "market_cap":
        default:
          valA = a.market_cap || 0;
          valB = b.market_cap || 0;
          break;
      }
      return sortDir === "asc" ? valA - valB : valB - valA;
    });

    return coins;
  }, [allCoin, watchlist, search, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortIcon = (key) => {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " \u25B2" : " \u25BC";
  };

  const formatNum = (n) => {
    if (n == null) return "—";
    if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
    if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(2) + "K";
    return n.toLocaleString();
  };

  const sym = currency?.Symbol || "$";

  // Stats
  const totalValue = watchlistCoins.reduce(
    (s, c) => s + (c.market_cap || 0),
    0,
  );
  const avgChange =
    watchlistCoins.length > 0
      ? watchlistCoins.reduce(
          (s, c) => s + (c.price_change_percentage_24h || 0),
          0,
        ) / watchlistCoins.length
      : 0;
  const gainers = watchlistCoins.filter(
    (c) => (c.price_change_percentage_24h || 0) > 0,
  ).length;
  const losers = watchlistCoins.filter(
    (c) => (c.price_change_percentage_24h || 0) < 0,
  ).length;

  return (
    <div className="wl-wrapper">
      <div className="wl-glow-1"></div>
      <div className="wl-glow-2"></div>
      <div className="wl-grid-overlay"></div>

      {/* Hero Section */}
      <section className="wl-hero">
        <div className="wl-hero-content">
          <div className="wl-badge">
            <span className="wl-badge-dot"></span>
            Personal Tracker
          </div>
          <div className="wl-hero-icon-wrap">
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#00d4ff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <h1 className="wl-hero-title">
            My <span className="wl-gradient-text">Watchlist</span>
          </h1>
          <p className="wl-hero-subtitle">
            Track your favorite cryptocurrencies in one place. Add coins from
            any page and monitor their performance in real time.
          </p>

          {/* Stats */}
          <div className="wl-stats-row">
            <div className="wl-stat">
              <span className="wl-stat-value">{watchlist.length}</span>
              <span className="wl-stat-label">Coins Tracked</span>
            </div>
            <div className="wl-stat-divider"></div>
            <div className="wl-stat">
              <span
                className={
                  "wl-stat-value " +
                  (avgChange >= 0 ? "wl-positive" : "wl-negative")
                }
              >
                {avgChange >= 0 ? "+" : ""}
                {avgChange.toFixed(2)}%
              </span>
              <span className="wl-stat-label">Avg 24h Change</span>
            </div>
            <div className="wl-stat-divider"></div>
            <div className="wl-stat">
              <span className="wl-stat-value wl-positive">{gainers}</span>
              <span className="wl-stat-label">Gainers</span>
            </div>
            <div className="wl-stat-divider"></div>
            <div className="wl-stat">
              <span className="wl-stat-value wl-negative">{losers}</span>
              <span className="wl-stat-label">Losers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="wl-container">
        {/* Toolbar */}
        <div className="wl-toolbar">
          <div className="wl-search-wrap">
            <svg
              className="wl-search-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21L16.65 16.65" />
            </svg>
            <input
              className="wl-search"
              type="text"
              placeholder="Search your watchlist..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {watchlist.length > 0 && (
            <button className="wl-clear-btn" onClick={clearWatchlist}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6H5H21" />
                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" />
              </svg>
              Clear All
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="wl-empty-state">
            <div className="wl-spinner"></div>
            <p>Loading your watchlist...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && watchlist.length === 0 && (
          <div className="wl-empty-state">
            <div className="wl-empty-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h2 className="wl-empty-title">Your watchlist is empty</h2>
            <p className="wl-empty-text">
              Start adding cryptocurrencies by clicking the star icon on any
              coin card across the platform.
            </p>
            <Link to="/" className="wl-browse-btn">
              Browse Coins
            </Link>
          </div>
        )}

        {/* No search results */}
        {!loading &&
          watchlist.length > 0 &&
          watchlistCoins.length === 0 &&
          search.trim() && (
            <div className="wl-empty-state">
              <p className="wl-empty-text">
                No coins match &quot;{search}&quot; in your watchlist.
              </p>
            </div>
          )}

        {/* Table */}
        {!loading && watchlistCoins.length > 0 && (
          <div className="wl-table-wrap">
            <table className="wl-table">
              <thead>
                <tr>
                  <th className="wl-th wl-th-star"></th>
                  <th className="wl-th wl-th-rank">#</th>
                  <th
                    className="wl-th wl-th-name wl-sortable"
                    onClick={() => handleSort("name")}
                  >
                    Coin{sortIcon("name")}
                  </th>
                  <th
                    className="wl-th wl-th-price wl-sortable"
                    onClick={() => handleSort("price")}
                  >
                    Price{sortIcon("price")}
                  </th>
                  <th
                    className="wl-th wl-th-change wl-sortable"
                    onClick={() => handleSort("change_24h")}
                  >
                    24h %{sortIcon("change_24h")}
                  </th>
                  <th
                    className="wl-th wl-th-mcap wl-sortable"
                    onClick={() => handleSort("market_cap")}
                  >
                    Market Cap{sortIcon("market_cap")}
                  </th>
                  <th className="wl-th wl-th-vol">Volume (24h)</th>
                </tr>
              </thead>
              <tbody>
                {watchlistCoins.map((coin) => {
                  const change = coin.price_change_percentage_24h || 0;
                  const isPositive = change >= 0;
                  return (
                    <tr key={coin.id} className="wl-row">
                      <td className="wl-td wl-td-star">
                        <button
                          className="wl-star-btn active"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleWatchlist(coin.id, coin.name);
                          }}
                          title="Remove from watchlist"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="#eab308"
                            stroke="#eab308"
                            strokeWidth="1.5"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        </button>
                      </td>
                      <td className="wl-td wl-td-rank">
                        {coin.market_cap_rank || "—"}
                      </td>
                      <td className="wl-td wl-td-name">
                        <Link
                          to={"/coin/" + coin.id}
                          className="wl-coin-link"
                        >
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="wl-coin-img"
                            loading="lazy"
                          />
                          <div className="wl-coin-info">
                            <span className="wl-coin-name">{coin.name}</span>
                            <span className="wl-coin-symbol">
                              {coin.symbol?.toUpperCase()}
                            </span>
                          </div>
                        </Link>
                      </td>
                      <td className="wl-td wl-td-price">
                        {sym}
                        {coin.current_price?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 6,
                        }) || "—"}
                      </td>
                      <td
                        className={
                          "wl-td wl-td-change " +
                          (isPositive ? "wl-positive" : "wl-negative")
                        }
                      >
                        {isPositive ? "+" : ""}
                        {change.toFixed(2)}%
                      </td>
                      <td className="wl-td wl-td-mcap">
                        {sym}
                        {formatNum(coin.market_cap)}
                      </td>
                      <td className="wl-td wl-td-vol">
                        {sym}
                        {formatNum(coin.total_volume)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary card */}
        {!loading && watchlistCoins.length > 0 && (
          <div className="wl-summary-card">
            <div className="wl-summary-item">
              <span className="wl-summary-label">Total Market Cap</span>
              <span className="wl-summary-value">
                {sym}
                {formatNum(totalValue)}
              </span>
            </div>
            <div className="wl-summary-divider"></div>
            <div className="wl-summary-item">
              <span className="wl-summary-label">Coins Tracked</span>
              <span className="wl-summary-value">{watchlistCoins.length}</span>
            </div>
            <div className="wl-summary-divider"></div>
            <div className="wl-summary-item">
              <span className="wl-summary-label">Performance</span>
              <span
                className={
                  "wl-summary-value " +
                  (avgChange >= 0 ? "wl-positive" : "wl-negative")
                }
              >
                {avgChange >= 0 ? "+" : ""}
                {avgChange.toFixed(2)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
