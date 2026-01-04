import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "./Features.css";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const Features = () => {
  // Top 5 coins
  const topCoins = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
    { id: "ethereum", name: "Ethereum", symbol: "ETH" },
    { id: "solana", name: "Solana", symbol: "SOL" },
    { id: "binancecoin", name: "BNB", symbol: "BNB" },
    { id: "cardano", name: "Cardano", symbol: "ADA" },
  ];

  const [selectedCoin, setSelectedCoin] = useState(topCoins[0].id);
  const [days, setDays] = useState(1);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedCoin, days]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${selectedCoin}/market_chart?vs_currency=inr&days=${days}`
      );
      const data = await res.json();
      setPrices(data.prices || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: prices.map((price) =>
      days === 1
        ? new Date(price[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : new Date(price[0]).toLocaleDateString()
    ),
    datasets: [
      {
        label: `${topCoins.find(coin => coin.id === selectedCoin)?.name || selectedCoin} (INR)`,
        data: prices.map((price) => price[1]),
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.15)",
        tension: 0.4,
        pointRadius: 0,
        fill: true,
        borderWidth: 3,
      },
    ],
  };

  const timeRanges = [
    { value: 1, label: "24 Hours" },
    { value: 7, label: "7 Days" },
    { value: 30, label: "1 Month" },
    { value: 90, label: "3 Months" },
    { value: 365, label: "1 Year" },
  ];

  return (
    <div className="features-container">
      {/* HEADER */}
      <div className="features-header">
        <h2 className="features-title">Top 5 Crypto Charts</h2>

        <div className="features-controls">
          {/* Coin Selector */}
          <div className="select-wrapper">
            <select
              value={selectedCoin}
              onChange={(e) => setSelectedCoin(e.target.value)}
            >
              {topCoins.map((coin) => (
                <option key={coin.id} value={coin.id}>
                  {coin.name} ({coin.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Time Range Selector */}
          <div className="select-wrapper">
            <select value={days} onChange={(e) => setDays(Number(e.target.value))}>
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* CARD */}
      <div className="features-card">
        {loading ? (
          <div className="features-loading">
            <div className="loader"></div>
            <p className="loading-text">Loading {topCoins.find(c => c.id === selectedCoin)?.name} chart...</p>
          </div>
        ) : prices.length === 0 ? (
          <div className="no-data">
            <h3>No data available</h3>
            <p>Please try a different coin or time range</p>
          </div>
        ) : (
          <div className="chart-wrapper">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: '#ffffff',
                      font: { size: 16, weight: 'bold' }
                    }
                  }
                },
                scales: {
                  x: {
                    ticks: { color: '#b8b8b8' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                  },
                  y: {
                    ticks: { color: '#b8b8b8' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                  }
                }
              }}
            />
          </div>
        )}
      </div>

      {/* TOP 5 COINS DISPLAY */}
      <div className="top-coins-display">
        <h3 className="top-coins-title">Top 5 Coins</h3>
        <div className="coins-grid">
          {topCoins.map((coin) => (
            <div
              key={coin.id}
              className={`coin-item ${selectedCoin === coin.id ? 'active' : ''}`}
              onClick={() => setSelectedCoin(coin.id)}
            >
              <span className="coin-symbol">{coin.symbol}</span>
              <span className="coin-name">{coin.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER NOTE */}
      <p className="features-note">
        Data powered by CoinGecko API · Prices in INR (₹) · Real-time charts
      </p>
    </div>
  );
};

export default Features;
