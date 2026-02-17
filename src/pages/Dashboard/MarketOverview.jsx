import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { CoinContext } from "../../context/CoinContextInstance";
import "./MarketOverview.css";

const MarketOverview = () => {
  const { isDark } = useTheme();
  const { allCoin, currency } = useContext(CoinContext);
  const navigate = useNavigate();
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    if (allCoin && allCoin.length > 0) {
      // Get top 5 gainers
      const gainers = [...allCoin]
        .sort(
          (a, b) =>
            b.price_change_percentage_24h - a.price_change_percentage_24h,
        )
        .slice(0, 5);
      setTopGainers(gainers);

      // Get top 5 losers
      const losers = [...allCoin]
        .sort(
          (a, b) =>
            a.price_change_percentage_24h - b.price_change_percentage_24h,
        )
        .slice(0, 5);
      setTopLosers(losers);

      // Get top 10 by market cap
      const top = allCoin.slice(0, 10);
      setTrending(top);
    }
  }, [allCoin]);

  const formatPrice = (price) => {
    if (price == null) return "-";
    if (currency.symbol === "₹") {
      return `₹${price.toLocaleString()}`;
    } else if (currency.symbol === "€") {
      return `€${price.toLocaleString()}`;
    } else {
      return `$${price.toLocaleString()}`;
    }
  };

  return (
    <div className="market-overview-fullwidth">
      <div className="mb-10 w-full">
        <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
          <span className="bg-gradient-to-r from-[#00d9ff] to-[#00a8cc] bg-clip-text text-transparent">
            Market Overview
          </span>
          <svg
            className="inline-block ml-3 w-10 h-10 text-[#00d9ff]"
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
        </h1>
        <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Real-time cryptocurrency market insights
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6 w-full">
        {/* Top Gainers */}
        <div
          className={`rounded-2xl p-8 border transition-all duration-300 hover:shadow-2xl w-full ${isDark
            ? "bg-[#14141f] border-[rgba(255,255,255,0.08)] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
            : "bg-white border-gray-200 shadow-xl"
            }`}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[rgba(74,222,128,0.1)] border border-[rgba(74,222,128,0.2)] flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-green-400"
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
            <h2
              className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Top Gainers 24h
            </h2>
          </div>
          <div className="space-y-3">
            {topGainers.map((coin, index) => (
              <div
                key={coin.id}
                onClick={() => navigate(`/coin/${coin.id}`)}
                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${isDark
                  ? "bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)]"
                  : "bg-gray-50 hover:bg-gray-100"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-bold ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    #{index + 1}
                  </span>
                  <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                  <div>
                    <p
                      className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {coin.name}
                    </p>
                    <p
                      className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {formatPrice(coin.current_price)}
                    </p>
                  </div>
                </div>
                <span className="text-green-400 font-bold">
                  +{coin.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div
          className={`rounded-2xl p-8 border transition-all duration-300 hover:shadow-2xl w-full ${isDark
            ? "bg-[#14141f] border-[rgba(255,255,255,0.08)] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
            : "bg-white border-gray-200 shadow-xl"
            }`}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-red-400"
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
            <h2
              className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Top Losers 24h
            </h2>
          </div>
          <div className="space-y-3">
            {topLosers.map((coin, index) => (
              <div
                key={coin.id}
                onClick={() => navigate(`/coin/${coin.id}`)}
                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${isDark
                  ? "bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)]"
                  : "bg-gray-50 hover:bg-gray-100"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-bold ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    #{index + 1}
                  </span>
                  <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                  <div>
                    <p
                      className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {coin.name}
                    </p>
                    <p
                      className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {formatPrice(coin.current_price)}
                    </p>
                  </div>
                </div>
                <span className="text-red-400 font-bold">
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Cryptocurrencies */}
      <div
        className={`rounded-2xl p-8 border transition-all duration-300 hover:shadow-2xl w-full ${isDark
          ? "bg-[#14141f] border-[rgba(255,255,255,0.08)] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
          : "bg-white border-gray-200 shadow-xl"
          }`}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[rgba(0,217,255,0.1)] border border-[rgba(0,217,255,0.2)] flex items-center justify-center shadow-lg">
            <svg
              className="w-6 h-6 text-[#00d9ff]"
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
          <h2
            className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Top 10 by Market Cap
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {trending.map((coin) => (
            <div
              key={coin.id}
              onClick={() => navigate(`/coin/${coin.id}`)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${isDark
                ? "bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.03)]"
                : "bg-gray-50 hover:bg-gray-100"
                }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={coin.image} alt={coin.name} className="w-10 h-10" />
                <div className="flex-1">
                  <p
                    className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {coin.name}
                  </p>
                  <p
                    className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {coin.symbol.toUpperCase()}
                  </p>
                </div>
                <span
                  className={
                    (coin.price_change_percentage_24h || 0) > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
              <div className="space-y-1">
                <p
                  className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {formatPrice(coin.current_price)}
                </p>
                <p
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  MCap: {currency.symbol}
                  {(coin.market_cap ? (coin.market_cap / 1e9).toFixed(2) : "0.00")}B
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;
