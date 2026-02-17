import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Coin.css";
import { CoinContext } from "../../../context/CoinContextInstance";
import LineChart from "../../../components/LineChart";
import NewsPanel from "../../../components/NewsPanel";

const Coin = () => {
  const { coinId } = useParams();
  const [coindata, setCoinData] = useState(null);
  const [historicaldata, setHistoricalData] = useState(null);
  const [coinLoading, setCoinLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("7"); // Default 7 days
  const { currency } = useContext(CoinContext);

  // Fetch coin data (separate from historical data)
  useEffect(() => {
    const fetchCoinData = async () => {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": import.meta.env.VITE_CG_API_KEY,
        },
      };

      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}`,
          options,
        );

        if (response.status === 429) {
          console.error(
            "Rate limit exceeded. Please wait a moment and refresh.",
          );
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
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

      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": import.meta.env.VITE_CG_API_KEY,
        },
      };

      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=${timeframe}&interval=daily`,
          options,
        );

        if (response.status === 429) {
          console.error(
            "Rate limit exceeded. Please wait a moment before changing timeframes.",
          );
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Historical data:", data);
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

  return (
    <div className="coin">
      <div data-aos="fade-right" className="coin-left">
        {/* Header Section with Logo and Name */}
        <div className="coin-header">
          <img
            className="coin-logo"
            src={coindata?.image?.large}
            alt={coindata?.name}
          />
          <div className="coin-name-section">
            <div className="coin-name-below">
              {coindata?.name}
              <span className="coin-symbol">
                {" "}
                ({coindata?.symbol?.toUpperCase()})
              </span>
            </div>
            <div className="coin-price-badge">
              {currency.Symbol}
              {coindata.market_data.current_price[
                currency.name
              ].toLocaleString()}
              <span
                className={`price-change ${coindata.market_data.price_change_percentage_24h >= 0 ? "positive" : "negative"}`}
              >
                {coindata.market_data.price_change_percentage_24h?.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Timeframe Toggle for Chart */}
        <div className="timeframe-selector">
          <button
            className={`timeframe-btn ${timeframe === "7" ? "active" : ""}`}
            onClick={() => setTimeframe("7")}
          >
            7d
          </button>
          <button
            className={`timeframe-btn ${timeframe === "14" ? "active" : ""}`}
            onClick={() => setTimeframe("14")}
          >
            14d
          </button>
          <button
            className={`timeframe-btn ${timeframe === "30" ? "active" : ""}`}
            onClick={() => setTimeframe("30")}
          >
            30d
          </button>
        </div>

        {/* Chart Section */}
        <div className="coin-chart">
          <LineChart historicaldata={historicaldata} />
        </div>

        {/* Sentiment Indicator */}
        {sentiment && (
          <div className="sentiment-section">
            <h3 className="section-title">Market Sentiment</h3>
            <div className="sentiment-card">
              <div className="sentiment-bar-container">
                <div className="sentiment-labels">
                  <span className="bearish-label">Bearish</span>
                  <span className="bullish-label">Bullish</span>
                </div>
                <div className="sentiment-bar">
                  <div
                    className={`sentiment-indicator ${sentiment.isPositive ? "bullish" : "bearish"}`}
                    style={{ left: `${sentiment.percentage}%` }}
                  >
                    <span className="sentiment-value">
                      {sentiment.percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div
                    className="sentiment-bar-fill bullish-fill"
                    style={{ width: `${sentiment.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="sentiment-status">
                <span
                  className={
                    sentiment.isPositive ? "status-bullish" : "status-bearish"
                  }
                >
                  {sentiment.text}
                </span>
                <span className="sentiment-subtext">
                  Based on 24h price movement
                </span>
              </div>
            </div>
          </div>
        )}

        {/* News Panel */}
        <NewsPanel coinId={coinId} coinName={coindata?.name} />
      </div>

      {/* Right Side - Enhanced Metrics */}
      <div data-aos="fade-left" className="coin-right">
        {/* Primary Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-card primary-metric">
            <div className="metric-icon">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
              <span className="metric-value">
                {currency.Symbol}
                {coindata.market_data.current_price[
                  currency.name
                ].toLocaleString()}
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
              <span className="metric-value rank-badge">
                #{coindata.market_cap_rank}
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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

          <div className="metric-card">
            <div className="metric-icon">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>
            </div>
            <div className="metric-content">
              <span className="metric-label">24 Hour High</span>
              <span className="metric-value high-value">
                {currency.Symbol}
                {coindata.market_data.high_24h[currency.name].toLocaleString()}
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div className="metric-content">
              <span className="metric-label">24 Hour Low</span>
              <span className="metric-value low-value">
                {currency.Symbol}
                {coindata.market_data.low_24h[currency.name].toLocaleString()}
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
                  {" "}
                  {coindata.symbol?.toUpperCase()}
                </span>
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
                {coindata.market_data.max_supply?.toLocaleString() ||
                  "Unlimited"}
                {coindata.market_data.max_supply && (
                  <span className="supply-symbol">
                    {" "}
                    {coindata.symbol?.toUpperCase()}
                  </span>
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
