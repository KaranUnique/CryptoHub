import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { CoinContext } from "../../context/CoinContextInstance";

const DashboardContent = () => {
    const { currentUser } = useAuth();
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 18) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");
    }, []);

    const getFirstName = () => {
        if (currentUser?.fullName) {
            return currentUser.fullName.split(" ")[0];
        }
        return currentUser?.email?.split("@")[0] || "User";
    };

    return (
        <>
            <div className="mb-10">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 leading-tight">
                    <span className="bg-gradient-to-r from-[#00d9ff] to-[#00a8cc] bg-clip-text text-transparent">
                        {greeting}, {getFirstName()}!
                    </span>
                    <svg className="inline-block ml-3 w-12 h-12 text-[#00d9ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                    </svg>
                </h1>
                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Welcome back to your crypto dashboard
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                <div className={`xl:col-span-2 rounded-2xl p-8 border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isDark
                    ? 'bg-[#14141f] border-[rgba(255,255,255,0.08)] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]'
                    : 'bg-white border-gray-200 shadow-xl'
                    }`}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-[rgba(0,217,255,0.1)] border border-[rgba(0,217,255,0.2)] flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-[#00d9ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Portfolio Overview
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className={`p-5 rounded-xl border transition-all duration-200 hover:scale-105 ${isDark
                            ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)]'
                            : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'
                            }`}>
                            <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Value</p>
                            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>$0.00</p>
                        </div>
                        <div className={`p-5 rounded-xl border transition-all duration-200 hover:scale-105 ${isDark
                            ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)]'
                            : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
                            }`}>
                            <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Assets</p>
                            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>0</p>
                        </div>
                        <div className={`p-5 rounded-xl border transition-all duration-200 hover:scale-105 ${isDark
                            ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)]'
                            : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
                            }`}>
                            <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>24h Profit</p>
                            <p className="text-3xl font-bold text-green-400">+0.00%</p>
                        </div>
                        <div className={`p-5 rounded-xl border transition-all duration-200 hover:scale-105 ${isDark
                            ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)]'
                            : 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200'
                            }`}>
                            <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Watchlist</p>
                            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>0</p>
                        </div>
                    </div>
                </div>

                <div className={`xl:col-span-1 rounded-2xl p-8 border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isDark
                    ? 'bg-[#14141f] border-[rgba(255,255,255,0.08)] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]'
                    : 'bg-white border-gray-200 shadow-xl'
                    }`}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-[rgba(0,217,255,0.1)] border border-[rgba(0,217,255,0.2)] flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-[#00d9ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Account
                        </h2>
                    </div>
                    <div className="space-y-4">
                        <div className={`pb-4 border-b ${isDark ? 'border-[rgba(255,255,255,0.06)]' : 'border-gray-200'}`}>
                            <p className={`text-sm mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Email</p>
                            <p className={`font-semibold truncate ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                                {currentUser?.email}
                            </p>
                        </div>
                        <div className={`pb-4 border-b ${isDark ? 'border-[rgba(255,255,255,0.06)]' : 'border-gray-200'}`}>
                            <p className={`text-sm mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Status</p>
                            <span className="inline-flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1.5 rounded-lg text-sm font-medium">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                Active
                            </span>
                        </div>
                        <div className={`pb-4 border-b ${isDark ? 'border-[rgba(255,255,255,0.06)]' : 'border-gray-200'}`}>
                            <p className={`text-sm mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Member Since</p>
                            <p className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                                {currentUser?.metadata?.creationTime
                                    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                    : "N/A"}
                            </p>
                        </div>
                        <div className="pt-2">
                            <button
                                onClick={() => navigate('/change-password')}
                                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 font-medium border ${isDark
                                    ? 'bg-[rgba(0,217,255,0.1)] hover:bg-[rgba(0,217,255,0.15)] text-[#00d9ff] border-[rgba(0,217,255,0.2)] hover:border-[rgba(0,217,255,0.3)]'
                                    : 'bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200 hover:border-purple-300'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                <span>Change Password</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Market Overview Widget */}
            <MarketOverviewWidget isDark={isDark} navigate={navigate} />
        </>
    );
};

// Market Overview Widget Component
const MarketOverviewWidget = ({ isDark, navigate }) => {
    const { allCoin, currency } = useContext(CoinContext);
    const [topGainers, setTopGainers] = useState([]);
    const [topCoins, setTopCoins] = useState([]);

    useEffect(() => {
        if (Array.isArray(allCoin) && allCoin.length > 0) {
            // Get top 3 gainers
            const gainers = [...allCoin]
                .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
                .slice(0, 3);
            setTopGainers(gainers);

            // Get top 5 coins by market cap
            const topByMarketCap = allCoin.slice(0, 5);
            setTopCoins(topByMarketCap);
        }
    }, [allCoin]);

    return (
        <div className={`rounded-2xl p-8 border transition-all duration-300 ${isDark
            ? 'bg-[#14141f] border-[rgba(255,255,255,0.08)]'
            : 'bg-white border-gray-200 shadow-xl'
            }`}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[rgba(0,217,255,0.1)] border border-[rgba(0,217,255,0.2)] flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-[#00d9ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                    </div>
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Market Overview
                    </h2>
                </div>
                <button
                    onClick={() => navigate('/market-overview')}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${isDark
                        ? 'bg-[rgba(0,217,255,0.1)] hover:bg-[rgba(0,217,255,0.15)] text-[#00d9ff] border border-[rgba(0,217,255,0.2)]'
                        : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-600 border border-cyan-200'
                        }`}
                >
                    View All →
                </button>
            </div>

            {/* Top Gainers */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2c1.5 3 4 5 4 8 0 2.21-1.79 4-4 4s-4-1.79-4-4c0-3 2.5-5 4-8zm0 20c-3.31 0-6-2.69-6-6 0-1.5.5-3 1.5-4.25.5 1.25 1.5 2.25 2.5 2.75v.5c0 1.1.9 2 2 2s2-.9 2-2v-.5c1-.5 2-1.5 2.5-2.75C18.5 13 19 14.5 19 16c0 3.31-2.69 6-6 6z" />
                    </svg>
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Top Gainers (24h)
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {topGainers.map((coin) => (
                        <div
                            key={coin.id}
                            onClick={() => navigate(`/coin/${coin.id}`)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:scale-105 ${isDark
                                ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)] hover:border-[rgba(0,217,255,0.2)]'
                                : 'bg-gray-50 border-gray-200 hover:border-cyan-300'
                                }`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                                <div>
                                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {coin.name}
                                    </p>
                                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                                        {coin.symbol.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                            <p className="text-green-400 text-xl font-bold">
                                +{coin.price_change_percentage_24h?.toFixed(2)}%
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Coins */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-[#00d9ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Top Cryptocurrencies
                    </h3>
                </div>
                <div className="space-y-3">
                    {topCoins.map((coin, index) => (
                        <div
                            key={coin.id}
                            onClick={() => navigate(`/coin/${coin.id}`)}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${isDark
                                ? 'hover:bg-[rgba(0,217,255,0.05)]'
                                : 'hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`text-sm font-bold w-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    #{index + 1}
                                </span>
                                <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                                <div>
                                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {coin.name}
                                    </p>
                                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                                        {coin.symbol.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {currency.Symbol}{coin.current_price?.toLocaleString()}
                                </p>
                                <p className={`text-sm ${(coin.price_change_percentage_24h || 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {(coin.price_change_percentage_24h || 0) > 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;

