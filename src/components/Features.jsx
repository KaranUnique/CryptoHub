import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "./Features.css";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const Features = () => {
  /* 
    Define coin data with brand-specific neon colors for the graph 
    BTC: Orange, ETH: Blue-Purple, SOL: Green, BNB: Yellow, ADA: Cyan Blue
  */
  const topCoins = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", color: "#F7931A" },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", color: "#627EEA" },
    { id: "solana", name: "Solana", symbol: "SOL", color: "#14F195" },
    { id: "binancecoin", name: "BNB", symbol: "BNB", color: "#F3BA2F" },
    { id: "cardano", name: "Cardano", symbol: "ADA", color: "#2979FF" },
  ];

  const [selectedCoin, setSelectedCoin] = useState(topCoins[0].id);
  const [days, setDays] = useState(1);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to get current coin object
  const currentCoin = topCoins.find(c => c.id === selectedCoin) || topCoins[0];

  useEffect(() => {
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

    fetchData();
  }, [selectedCoin, days]);

  const chartData = {
    labels: prices.map((price) =>
      days === 1
        ? new Date(price[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : new Date(price[0]).toLocaleDateString()
    ),
    datasets: [
      {
        label: `${currentCoin.name} (INR)`,
        data: prices.map((price) => price[1]),
        borderColor: currentCoin.color, // Use dynamic coin color
        backgroundColor: "transparent", // Will be overridden by gradient
        tension: 0.4,
        pointRadius: 0,
        fill: true,
        borderWidth: 2,
      },
    ],
  };

  // Helper to convert hex to rgba for gradient
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
      <div className="glow-spot top-right"></div>

      <div className="features-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Market <span className="text-gradient-purple">Intelligence</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Advanced charting and real-time data analysis.
        </motion.p>
      </div>

      <motion.div
        className="features-card glass-panel"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="features-controls">
          <div className="select-wrapper">
            <select
              value={selectedCoin}
              onChange={(e) => setSelectedCoin(e.target.value)}
              className="cosmic-select"
            >
              {topCoins.map((coin) => (
                <option key={coin.id} value={coin.id}>
                  {coin.name} ({coin.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className="select-wrapper">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="cosmic-select"
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
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
                    display: false
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    titleColor: '#f8fafc',
                    bodyColor: currentCoin.color,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: { family: 'Outfit', size: 14, weight: 'bold' },
                    bodyFont: { family: 'JetBrains Mono', size: 13 },
                    callbacks: {
                      label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                          label = 'Price: ';
                        }
                        if (context.parsed.y !== null) {
                          label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed.y);
                        }
                        return label;
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    ticks: {
                      color: '#64748b',
                      font: { family: 'JetBrains Mono', size: 11 },
                      maxTicksLimit: 6,
                      maxRotation: 0
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.03)',
                      drawBorder: false,
                    }
                  },
                  y: {
                    position: 'right',
                    ticks: {
                      color: '#64748b',
                      font: { family: 'JetBrains Mono', size: 11 },
                      callback: function (value) {
                        return '₹' + value.toLocaleString();
                      }
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.03)',
                      drawBorder: false,
                    }
                  }
                },
                interaction: {
                  mode: 'index',
                  intersect: false,
                },
                hover: {
                  mode: 'index',
                  intersect: false
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
      </motion.div>

      <div className="features-note">
        Powered by CoinGecko API · Real-time Market Data
      </div>
    </div>
  );
};

export default Features;
