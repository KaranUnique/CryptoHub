import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CoinDetail.css";
import { CoinContext } from "../../../context/CoinContextInstance";
import LineChart from "../../../components/Dashboard/LineChart";
import NewsPanel from "../../../components/Dashboard/NewsPanel";
import { useWatchlist } from "../../../context/WatchlistContext";

const Coin = () => {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const [coindata, setCoinData] = useState(null);
  const [historicaldata, setHistoricalData] = useState(null);
  const [coinLoading, setCoinLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("7"); // Default 7 days
  const { currency } = useContext(CoinContext);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  // Fetch coin data (separate from historical data)
  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const data = await apiClient.get(`/api/coingecko/coins/${coinId}`);
        setCoinData(data);
        setCoinLoading(false);
      } catch (err) {
        setCoinLoading(false);
        console.error("Error fetching coin data:", err);
      }
    };

    // Add a small delay to avoid immediate rate limiting
    const timer = setTimeout(fetchCoinData, 300);
    return () => clearTimeout(timer);
  }, [coinId]);

  // Fetch historical data based on selected timeframe
  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!currency?.name) return;

      try {
        const url = `/api/coingecko/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=${timeframe}&interval=daily`;
        const data = await apiClient.get(url);
        setHistoricalData(data);
        setHistoryLoading(false);
      } catch (err) {
        setHistoryLoading(false);
        console.error("History fetch error:", err);
      }
    };

    // Add delay to prevent rapid API calls when switching timeframes
    const timer = setTimeout(fetchHistoricalData, 500);
    return () => clearTimeout(timer);
  }, [currency, coinId, timeframe]);

  // Calculate sentiment based on price change
  const calculateSentiment = () => {
    if (!coindata?.market_data?.price_change_percentage_24h)
      return { text: "Neutral", percentage: 50, isPositive: null };

    const change = coindata.market_data.price_change_percentage_24h;
    const isPositive = change > 0;
    const percentage = Math.min(Math.abs(change) * 10 + 50, 95);

    return {
      text: isPositive ? "Bullish" : "Bearish",
      percentage: isPositive ? percentage : 100 - percentage,
      isPositive,
    };
  };

  const sentiment = coindata ? calculateSentiment() : null;

  // Loading state
  if (coinLoading || historyLoading) {
    return (
      <div className="coin-loader">
        <div className="spin"></div>
        <p>Loading coin data...</p>
      </div>
    );
  }

  // Empty / error state
  if (!coindata || !historicaldata) {
    return (
      <div className="coin-loader">
        <p>No data available right now. Please try again later.</p>
      </div>
    );
  }

  // Price range position (0–100 %)
  const rangePos = (() => {
    if (!coindata?.market_data) return 50;
    const { high_24h, low_24h, current_price } = coindata.market_data;
    const high = high_24h[currency.name];
    const low = low_24h[currency.name];
    const cur = current_price[currency.name];
    if (high === low) return 50;
    return Math.round(((cur - low) / (high - low)) * 100);
  })();

  const isPositive = coindata?.market_data?.price_change_percentage_24h >= 0;

  return (
    <div className="coin-page">
      {/* ── Back button ── */}
      <button className="coin-back-btn" onClick={() => navigate(-1)}>
        <svg
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* ── Hero header ── */}
      <div className="coin-hero">
        <div className="coin-hero-inner">
          <img
            className="coin-logo"
            src={coindata?.image?.large}
            alt={coindata?.name}
          />
          <div className="coin-hero-info">
            <div className="coin-name-row">
              <span className="coin-name-text">{coindata?.name}</span>
              <span className="coin-symbol-badge">
                {coindata?.symbol?.toUpperCase()}
              </span>
              {coindata?.market_cap_rank && (
                <span className="coin-rank-badge">
                  Rank #{coindata.market_cap_rank}
                </span>
              )}
              <button
                className={`coin-watchlist-btn ${isInWatchlist(coinId) ? 'active' : ''}`}
                onClick={() => toggleWatchlist(coinId, coindata?.name)}
                title={isInWatchlist(coinId) ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isInWatchlist(coinId) ? '#eab308' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {isInWatchlist(coinId) ? 'Watchlisted' : 'Add to Watchlist'}
              </button>
            </div>
            <div className="coin-price-row">
              <span className="coin-current-price">
                {currency.Symbol}
                {coindata.market_data.current_price[
                  currency.name
                ].toLocaleString()}
              </span>
              <span
                className={`price-change-pill ${isPositive ? "positive" : "negative"}`}
              >
                {isPositive ? "▲" : "▼"}&nbsp;
                {Math.abs(
                  coindata.market_data.price_change_percentage_24h,
                ).toFixed(2)}
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="coin-layout">
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Chart */}
          <div className="coin-card coin-chart-card">
            <div className="coin-chart-top">
              <span className="coin-card-title">Price Chart</span>
              <div className="timeframe-selector">
                {[
                  { label: "7d", val: "7" },
                  { label: "14d", val: "14" },
                  { label: "30d", val: "30" },
                ].map(({ label, val }) => (
                  <button
                    key={val}
                    className={`timeframe-btn ${timeframe === val ? "active" : ""}`}
                    onClick={() => setTimeframe(val)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="coin-chart">
              <LineChart historicaldata={historicaldata} />
            </div>
          </div>

          {/* 24h Price Range */}
          <div className="coin-card price-range-card">
            <div className="price-range-label">24h Price Range</div>
            <div className="price-range-track">
              <div
                className="price-range-thumb"
                style={{ left: `${rangePos}%` }}
              />
            </div>
            <div className="price-range-ends">
              <span className="range-low">
                Low: {currency.Symbol}
                {coindata.market_data.low_24h[currency.name].toLocaleString()}
              </span>
              <span className="range-high">
                High: {currency.Symbol}
                {coindata.market_data.high_24h[currency.name].toLocaleString()}
              </span>
            </div>
          </div>

          {/* Sentiment */}
          {sentiment && (
            <div className="coin-card sentiment-card-wrap">
              <div className="sentiment-header">
                <span className="sentiment-title">Market Sentiment</span>
                <span
                  className={`sentiment-status-badge ${
                    sentiment.isPositive
                      ? "bullish"
                      : sentiment.isPositive === false
                        ? "bearish"
                        : "neutral"
                  }`}
                >
                  {sentiment.text}
                </span>
              </div>
              <div className="sentiment-bar-labels">
                <span className="bear">Bearish</span>
                <span className="bull">Bullish</span>
              </div>
              <div className="sentiment-track">
                <div
                  className={`sentiment-dot ${
                    sentiment.isPositive
                      ? "bullish"
                      : sentiment.isPositive === false
                        ? "bearish"
                        : "neutral"
                  }`}
                  style={{ left: `${sentiment.percentage}%` }}
                />
              </div>
              <div className="sentiment-sub">Based on 24h price movement</div>
            </div>
          )}

          {/* News */}
          <div className="coin-card news-wrapper">
            <NewsPanel coinId={coinId} coinName={coindata?.name} />
          </div>
        </div>

        {/* Right column – metric cards */}
        <div className="metrics-panel">
          <div className="metrics-section-title">Market Data</div>

          <div className="metric-card highlight">
            <div className="metric-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="metric-content">
              <span className="metric-label">Current Price</span>
              <span className="metric-value highlight-price">
                {currency.Symbol}
                {coindata.market_data.current_price[
                  currency.name
                ].toLocaleString()}
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            </div>
            <div className="metric-content">
              <span className="metric-label">Market Cap Rank</span>
              <span className="metric-value rank">
                #{coindata.market_cap_rank}
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="metric-content">
              <span className="metric-label">Market Cap</span>
              <span className="metric-value">
                {currency.Symbol}
                {coindata.market_data.market_cap[
                  currency.name
                ].toLocaleString()}
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div className="metric-content">
              <span className="metric-label">Fully Diluted Valuation</span>
              <span className="metric-value">
                {coindata.market_data.fully_diluted_valuation?.[currency.name]
                  ? `${currency.Symbol}${coindata.market_data.fully_diluted_valuation[currency.name].toLocaleString()}`
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <div className="metric-content">
              <span className="metric-label">Total Volume (24h)</span>
              <span className="metric-value">
                {currency.Symbol}
                {coindata.market_data.total_volume[
                  currency.name
                ].toLocaleString()}
              </span>
            </div>
          </div>

          <div className="metrics-section-title">Price Extremes</div>

          <div className="metric-card">
            <div className="metric-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>
            </div>
            <div className="metric-content">
              <span className="metric-label">24h High</span>
              <span className="metric-value high">
                {currency.Symbol}
                {coindata.market_data.high_24h[currency.name].toLocaleString()}
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div className="metric-content">
              <span className="metric-label">24h Low</span>
              <span className="metric-value low">
                {currency.Symbol}
                {coindata.market_data.low_24h[currency.name].toLocaleString()}
              </span>
            </div>
          </div>

          <div className="metrics-section-title">Supply</div>

          <div className="metric-card">
            <div className="metric-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div className="metric-content">
              <span className="metric-label">Circulating Supply</span>
              <span className="metric-value">
                {coindata.market_data.circulating_supply?.toLocaleString() ||
                  "N/A"}
                <span className="supply-symbol">
                  &nbsp;{coindata.symbol?.toUpperCase()}
                </span>
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div className="metric-content">
              <span className="metric-label">Max Supply</span>
              <span className="metric-value">
                {coindata.market_data.max_supply ? (
                  <>
                    {coindata.market_data.max_supply.toLocaleString()}
                    <span className="supply-symbol">
                      &nbsp;{coindata.symbol?.toUpperCase()}
                    </span>
                  </>
                ) : (
                  "Unlimited"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coin;
