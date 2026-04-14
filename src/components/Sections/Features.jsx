import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "./Features.css";
import { motion } from "framer-motion";
import { Zap, TrendingUp, Lock, Bolt, Globe, Brain } from "lucide-react";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
);
import { topCoins } from "../../config/coins";

const Features = () => {
  const [selectedCoin, setSelectedCoin] = useState(topCoins[0].id);
  const [days, setDays] = useState(7);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentCoin =
    topCoins.find((c) => c.id === selectedCoin) || topCoins[0];

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${selectedCoin}/market_chart?vs_currency=inr&days=${days}`,
      );
      const data = await res.json();
      setPrices(data.prices || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setPrices([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCoin, days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const features = [
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: "Real-Time Analytics",
      description:
        "Track cryptocurrency prices with live market data updates every second.",
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: "Advanced Charting",
      description:
        "Professional-grade charts with multiple timeframes and technical indicators.",
    },
    {
      icon: <Lock className="w-10 h-10" />,
      title: "Secure Trading",
      description:
        "Enterprise-grade encryption and security protocols for your assets.",
    },
    {
      icon: <Bolt className="w-10 h-10" />,
      title: "Lightning Fast",
      description:
        "Millisecond-level data processing with optimized performance.",
    },
    {
      icon: <Globe className="w-10 h-10" />,
      title: "Global Coverage",
      description: "Access 10,000+ cryptocurrencies from markets worldwide.",
    },
    {
      icon: <Brain className="w-10 h-10" />,
      title: "AI Insights",
      description:
        "Machine learning predictions and market sentiment analysis.",
    },
  ];

  const chartData = {
    labels: prices.map((price) =>
      days === 1
        ? new Date(price[0]).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : new Date(price[0]).toLocaleDateString(),
    ),
    datasets: [
      {
        label: `${currentCoin.name} (INR)`,
        data: prices.map((price) => price[1]),
        borderColor: currentCoin.color,
        backgroundColor: currentCoin.color + "15",
        tension: 0.5,
        pointRadius: 0,
        pointHoverRadius: 8,
        fill: true,
        borderWidth: 3,
      },
    ],
  };

  const timeRanges = [
    { value: 1, label: "24H" },
    { value: 7, label: "7D" },
    { value: 30, label: "1M" },
    { value: 90, label: "3M" },
    { value: 365, label: "1Y" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 py-20 px-4 sm:px-8">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-[100px] animate-pulse pointer-events-none"></div>
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/20 rounded-full filter blur-[100px] animate-pulse pointer-events-none"
        style={{ animationDelay: "1s" }}
      ></div>

      <section className="relative z-10 max-w-4xl mx-auto text-center mb-16 pt-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 mb-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/40 rounded-full backdrop-blur-md hover:border-purple-500/60 transition-all duration-300">
            <span className="text-xl animate-spin">✨</span>
            <span className="font-semibold text-white">
              Premium Market Intelligence
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 text-white leading-tight">
            Advanced{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent animate-pulse">
              Market Intelligence
            </span>{" "}
            Platform
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Real-time analytics, professional charting, and AI-powered insights
            for modern crypto traders and investors
          </p>
        </motion.div>
      </section>

      <section className="relative z-10 mb-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="group relative p-6 sm:p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-2xl backdrop-blur-xl hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 transition-all duration-300 rounded-2xl"></div>

              <div className="relative z-10 w-16 h-16 flex items-center justify-center bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-xl mb-4 group-hover:scale-110 group-hover:from-purple-600/50 group-hover:to-pink-600/50 transition-all duration-300">
                <div className="text-purple-300 group-hover:text-purple-100 transition-colors duration-300">
                  {feature.icon}
                </div>
              </div>

              <h3 className="relative z-10 text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="relative z-10 text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>

              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-purple-500 to-transparent group-hover:w-full transition-all duration-300"></div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="relative z-10 mb-20">
        <motion.div
          className="flex justify-between items-center mb-8 flex-wrap gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
              Price Analytics
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mt-2">
              Real-time market data with multi-timeframe analysis
            </p>
          </div>
          <div className="px-5 py-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Live Data
          </div>
        </motion.div>

        <motion.div
          className="p-6 sm:p-8 bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-purple-500/20 rounded-3xl backdrop-blur-xl shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                Select Coin
              </label>
              <select
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value)}
                className="w-full px-4 py-3 bg-gradient-to-r from-slate-900/80 to-slate-950/80 backdrop-blur-lg border-2 border-purple-500/40 rounded-lg text-white font-semibold focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:border-purple-500/60"
              >
                {topCoins.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                Timeframe
              </label>
              <div className="flex flex-wrap gap-2">
                {timeRanges.map((range) => (
                  <button
                    key={range.value}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
                      days === range.value
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50"
                        : "bg-white/5 border border-white/10 text-gray-300 hover:border-purple-500/40 hover:bg-white/10"
                    }`}
                    onClick={() => setDays(range.value)}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-96 sm:h-[550px] bg-gradient-to-b from-black/20 to-transparent border border-purple-500/10 rounded-2xl p-4 overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                <p className="text-gray-400">
                  Loading {currentCoin.name} data...
                </p>
              </div>
            ) : prices.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <h3 className="text-white font-bold">No data available</h3>
                <p className="text-gray-400 text-sm">
                  Please try a different coin or time range
                </p>
              </div>
            ) : (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      mode: "index",
                      intersect: false,
                      backgroundColor: "rgba(15, 23, 42, 0.98)",
                      titleColor: "#f8fafc",
                      bodyColor: currentCoin.color,
                      borderColor: currentCoin.color + "80",
                      borderWidth: 1,
                      padding: 14,
                      cornerRadius: 12,
                      titleFont: { family: "Outfit", size: 15, weight: "bold" },
                      bodyFont: { family: "JetBrains Mono", size: 13 },
                      callbacks: {
                        label: (ctx) =>
                          `Price: ₹${ctx.parsed.y.toLocaleString()}`,
                      },
                    },
                  },
                  scales: {
                    x: {
                      ticks: { color: "#64748b", maxTicksLimit: 8 },
                      grid: {
                        color: "rgba(255, 255, 255, 0.05)",
                        drawBorder: false,
                      },
                    },
                    y: {
                      position: "right",
                      ticks: {
                        color: "#64748b",
                        callback: (v) =>
                          "₹" + (v / 1000).toFixed(v > 100000 ? 0 : 1) + "K",
                      },
                      grid: {
                        color: "rgba(255, 255, 255, 0.05)",
                        drawBorder: false,
                      },
                    },
                  },
                  interaction: { mode: "index", intersect: false },
                  hover: { mode: "index", intersect: false },
                }}
              />
            )}
          </div>

          <motion.div
            className="mt-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
              Popular Cryptocurrencies
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 max-w-4xl mx-auto">
              {topCoins.map((coin, idx) => (
                <motion.div
                  key={coin.id}
                  className={`p-4 rounded-xl backdrop-blur-lg cursor-pointer transition-all duration-300 border ${
                    selectedCoin === coin.id
                      ? "bg-gradient-to-br from-purple-600/50 to-pink-600/50 border-purple-500 shadow-lg shadow-purple-500/50"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/40"
                  }`}
                  onClick={() => setSelectedCoin(coin.id)}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                      {coin.symbol}
                    </div>
                    <h4 className="text-white font-bold text-sm">
                      {coin.name}
                    </h4>
                    <div className="mt-2 inline-block bg-gradient-to-r from-amber-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      #{idx + 1}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative z-10 my-20">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { number: "10,000+", label: "Cryptocurrencies" },
            { number: "24/7", label: "Live Data Updates" },
            { number: "<100ms", label: "Latency" },
            { number: "100%", label: "Uptime SLA" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className="p-4 sm:p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-2xl text-center hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1"
              variants={itemVariants}
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-semibold uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <div className="relative z-10 text-center mt-20 pt-12 border-t border-purple-500/20">
        <p className="text-gray-500 text-xs sm:text-sm font-medium tracking-wider">
          Powered by CoinGecko API • Enterprise-Grade Cryptocurrency
          Intelligence
        </p>
      </div>
    </div>
  );
};

export default Features;
