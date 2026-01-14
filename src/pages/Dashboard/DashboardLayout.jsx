import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const DashboardLayout = () => {
    const { currentUser, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const getFirstName = () => {
        if (currentUser?.fullName) {
            return currentUser.fullName.split(" ")[0];
        }
        return currentUser?.email?.split("@")[0] || "User";
    };

    const handleLogout = useCallback(async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Failed to log out:", error);
            alert("Failed to log out. Please try again.");
        }
    }, [logout, navigate]);

    const navigationItems = [
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            label: "Dashboard",
            path: "/dashboard"
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
            ),
            label: "Market Overview",
            path: "/market-overview"
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
            ),
            label: "Leaderboard",
            path: "/leaderboard"
        },
    ];

    return (
        <div className={`min-h-screen flex ${isDark ? 'bg-[#0a0a1a]' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
            <aside
                className={`fixed lg:sticky top-0 left-0 h-screen transition-all duration-300 z-50 ${sidebarOpen ? "w-72" : "w-0 lg:w-20"
                    } overflow-hidden ${isDark
                        ? 'bg-[rgba(10,10,26,0.95)] border-[rgba(0,217,255,0.1)]'
                        : 'bg-white border-gray-200'
                    } backdrop-blur-2xl border-r shadow-2xl`}
            >
                <div className="flex flex-col h-full p-5">
                    <div className="flex items-center justify-between mb-8">
                        {sidebarOpen && (
                            <div className="flex items-center gap-3">
                                <img
                                    src="/crypto-logo.png"
                                    alt="CryptoHub"
                                    className="h-10 w-10 rounded-full object-cover border-2 border-[rgba(0,217,255,0.5)] shadow-lg transition-all duration-300 hover:scale-110"
                                />
                                <h1 className="text-xl font-extrabold bg-gradient-to-r from-[#00d9ff] to-[#00a8cc] bg-clip-text text-transparent">
                                    CryptoHub
                                </h1>
                            </div>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={`p-2.5 rounded-lg transition-all duration-200 ${isDark
                                ? 'hover:bg-[rgba(0,217,255,0.1)]'
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            <span className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                {sidebarOpen ? "◀" : "▶"}
                            </span>
                        </button>
                    </div>

                    {sidebarOpen && (
                        <div className={`mb-6 p-4 rounded-xl border transition-all duration-200 ${isDark
                            ? 'bg-[rgba(255,255,255,0.03)] border-[rgba(0,217,255,0.2)] hover:border-[rgba(0,217,255,0.4)]'
                            : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 hover:border-purple-300'
                            }`}>
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00d9ff] to-[#00a8cc] flex items-center justify-center text-2xl font-bold shadow-lg ring-4 ring-[rgba(0,217,255,0.12)] text-[#0a0a1a]">
                                    {getFirstName().charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-bold truncate text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {getFirstName()}
                                    </p>
                                    <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {currentUser?.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <nav className="flex-1 space-y-1.5">
                        {navigationItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${location.pathname === item.path
                                    ? "bg-gradient-to-r from-[#00d9ff] to-[#00a8cc] text-[#0a0a1a] shadow-lg shadow-cyan-500/25 font-bold"
                                    : isDark
                                        ? "text-gray-300 hover:bg-[rgba(0,217,255,0.1)] hover:text-[#00d9ff]"
                                        : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                                    } ${!sidebarOpen && "justify-center"}`}
                            >
                                <span className={sidebarOpen ? "" : ""}>{item.icon}</span>
                                {sidebarOpen && <span>{item.label}</span>}
                            </button>
                        ))}
                    </nav>

                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium border ${isDark
                            ? 'bg-red-900/20 hover:bg-red-900/30 text-red-400 border-red-600/30 hover:border-red-500/50'
                            : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300'
                            } ${!sidebarOpen && "justify-center"}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <main className="flex-1 overflow-auto">
                <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`lg:hidden mb-6 p-3 rounded-xl transition-all duration-200 ${isDark
                            ? 'bg-[rgba(0,217,255,0.1)] hover:bg-[rgba(0,217,255,0.2)]'
                            : 'bg-white hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        <span className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>☰</span>
                    </button>

                    {/* Child routes will render here */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
