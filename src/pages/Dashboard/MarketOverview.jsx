import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { CoinContext } from "../../context/CoinContext";

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
                .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
                .slice(0, 5);
            setTopGainers(gainers);

            // Get top 5 losers
            const losers = [...allCoin]
                .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
                .slice(0, 5);
            setTopLosers(losers);

            // Get top 10 by market cap
            const top = allCoin.slice(0, 10);
            setTrending(top);
        }
    }, [allCoin]);

    const formatPrice = (price) => {
        if (currency.symbol === "₹") {
            return `₹${price.toLocaleString()}`;
        } else if (currency.symbol === "€") {
            return `€${price.toLocaleString()}`;
        } else {
            return `$${price.toLocaleString()}`;
        }
    };

    return (
        <>
            <div className="mb-10">
                <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
                    <span className="bg-gradient-to-r from-[#7927ff] via-[#9945ff] to-[#2193b0] bg-clip-text text-transparent">
                        Market Overview
                    </span>
                    <span className="inline-block ml-3 text-4xl">📊</span>
                </h1>
                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Real-time cryptocurrency market insights
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                {/* Top Gainers */}
                <div className={`rounded-2xl p-8 border transition-all duration-300 hover:shadow-2xl ${isDark
                    ? 'bg-[rgba(15,8,40,0.6)] backdrop-blur-xl border-[rgba(121,39,255,0.15)] shadow-[0_8px_32px_0_rgba(121,39,255,0.12)]'
                    : 'bg-white border-gray-200 shadow-xl'
                    }`}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Top Gainers 24h
                        </h2>
                    </div>
                    <div className="space-y-3">
                        {topGainers.map((coin, index) => (
                            <div
                                key={coin.id}
                                onClick={() => navigate(`/coin/${coin.id}`)}
                                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${isDark
                                    ? 'bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)]'
                                    : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        #{index + 1}
                                    </span>
                                    <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                                    <div>
                                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {coin.name}
                                        </p>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
                <div className={`rounded-2xl p-8 border transition-all duration-300 hover:shadow-2xl ${isDark
                    ? 'bg-[rgba(15,8,40,0.6)] backdrop-blur-xl border-[rgba(121,39,255,0.15)] shadow-[0_8px_32px_0_rgba(121,39,255,0.12)]'
                    : 'bg-white border-gray-200 shadow-xl'
                    }`}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                            </svg>
                        </div>
                        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Top Losers 24h
                        </h2>
                    </div>
                    <div className="space-y-3">
                        {topLosers.map((coin, index) => (
                            <div
                                key={coin.id}
                                onClick={() => navigate(`/coin/${coin.id}`)}
                                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${isDark
                                    ? 'bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)]'
                                    : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        #{index + 1}
                                    </span>
                                    <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                                    <div>
                                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {coin.name}
                                        </p>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
            <div className={`rounded-2xl p-8 border transition-all duration-300 hover:shadow-2xl ${isDark
                ? 'bg-[rgba(15,8,40,0.6)] backdrop-blur-xl border-[rgba(121,39,255,0.15)] shadow-[0_8px_32px_0_rgba(121,39,255,0.12)]'
                : 'bg-white border-gray-200 shadow-xl'
                }`}>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7927ff] to-[#2193b0] flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Top 10 by Market Cap
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trending.map((coin) => (
                        <div
                            key={coin.id}
                            onClick={() => navigate(`/coin/${coin.id}`)}
                            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${isDark
                                ? 'bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)]'
                                : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <img src={coin.image} alt={coin.name} className="w-10 h-10" />
                                <div className="flex-1">
                                    <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {coin.name}
                                    </p>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {coin.symbol.toUpperCase()}
                                    </p>
                                </div>
                                <span className={coin.price_change_percentage_24h > 0 ? "text-green-400" : "text-red-400"}>
                                    {coin.price_change_percentage_24h?.toFixed(2)}%
                                </span>
                            </div>
                            <div className="space-y-1">
                                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {formatPrice(coin.current_price)}
                                </p>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    MCap: {currency.symbol}{(coin.market_cap / 1e9).toFixed(2)}B
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default MarketOverview;
