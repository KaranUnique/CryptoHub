import React, { useState, useCallback } from "react";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const DashboardLayout = () => {
    const { currentUser, logout } = useAuth();
    const { isDark } = useTheme();
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            label: "Home",
            path: "/"
        },
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
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
            ),
            label: "Saved Insights",
            path: "/saved-insights"
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            label: "Pricing",
            path: "/pricing"
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            ),
            label: "Insights",
            path: "/blog"
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            label: "Features",
            path: "/features"
        },
    ];

    return (
        <div className={`min-h-screen flex ${isDark ? 'bg-[#0a0a1a]' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
            <aside
                className={`fixed lg:sticky top-0 left-0 h-screen transition-all duration-300 z-50 ${sidebarOpen ? "w-72" : "w-0 lg:w-20"
                    } overflow-hidden ${isDark
                        ? 'bg-[#0f0f1f] border-[rgba(255,255,255,0.08)]'
                        : 'bg-white border-gray-200'
                    } backdrop-blur-2xl border-r shadow-2xl`}
            >
                <div className="flex flex-col h-full p-5">
                    <div className="flex items-center justify-between mb-8">
                        {sidebarOpen && (
                            <Link to="/" className="flex items-center gap-3 cursor-pointer hover:opacity-90" style={{ textDecoration: 'none' }}>
                                <img
                                    src="/crypto-logo.png"
                                    alt="CryptoHub"
                                    className="h-10 w-10 rounded-full object-cover border-2 border-[rgba(0,217,255,0.3)] shadow-lg transition-all duration-300 hover:scale-110"
                                />
                                <h1 className="text-xl font-extrabold text-[#00d9ff] hover:text-[#00f3ff] transition-colors duration-200" style={{ margin: 0 }}>
                                    CryptoHub
                                </h1>
                            </Link>
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
                        <Link to="/profile" className={`block mb-6 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${location.pathname === '/profile'
                            ? "bg-[rgba(0,217,255,0.1)] text-[#00d9ff] border border-[rgba(0,217,255,0.2)]"
                            : isDark
                                ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)] hover:border-[rgba(0,217,255,0.2)]'
                                : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 hover:border-purple-300'
                            }`} style={{ textDecoration: 'none' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00d9ff] to-[#00a8cc] flex items-center justify-center text-2xl font-bold shadow-lg ring-4 ring-[rgba(0,217,255,0.1)] text-[#0a0a1a] overflow-hidden">
                                    {currentUser?.photoURL ? (
                                        <img
                                            src={currentUser.photoURL}
                                            alt={getFirstName()}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        getFirstName().charAt(0).toUpperCase()
                                    )}
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
                        </Link>
                    )}

                    <nav className="flex-1 space-y-1.5">
                        {navigationItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${location.pathname === item.path
                                    ? "bg-[rgba(0,217,255,0.1)] text-[#00d9ff] border border-[rgba(0,217,255,0.2)]"
                                    : isDark
                                        ? "text-gray-300 hover:bg-[rgba(0,217,255,0.05)] hover:text-[#00d9ff]"
                                        : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                                    } ${!sidebarOpen && "justify-center"}`}
                            >
                                <span className={sidebarOpen ? "" : ""}>{item.icon}</span>
                                {sidebarOpen && <span>{item.label}</span>}
                            </button>
                        ))}
                    </nav>

                    {sidebarOpen && (
                        <div className="mt-auto space-y-3">
                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium border ${isDark
                                    ? 'bg-red-900/20 hover:bg-red-900/30 text-red-400 border-red-600/30 hover:border-red-500/50'
                                    : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Logout</span>
                            </button>
                        </div>
                    )}

                    {/* Collapsed State Logout Icon */}
                    {!sidebarOpen && (
                        <button
                            onClick={handleLogout}
                            className={`w-full flex items-center justify-center p-3 rounded-xl transition-all duration-200 border ${isDark
                                ? 'bg-red-900/20 hover:bg-red-900/30 text-red-400 border-red-600/30 hover:border-red-500/50'
                                : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    )}
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
