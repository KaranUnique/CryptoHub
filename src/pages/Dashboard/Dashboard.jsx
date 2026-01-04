import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      path: "/dashboard",
      active: true
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      label: "Blog",
      path: "/blog"
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      label: "Features",
      path: "/features"
    },
  ];

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-gradient-to-br from-[#0a0118] via-[#0f0828] to-[#001529]' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen transition-all duration-300 z-50 ${sidebarOpen ? "w-72" : "w-0 lg:w-20"
          } overflow-hidden ${isDark
            ? 'bg-[rgba(15,8,40,0.98)] border-[rgba(121,39,255,0.15)]'
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
                  className="h-10 w-10 rounded-full object-cover border-2 border-[rgba(121,39,255,0.5)] shadow-lg transition-all duration-300 hover:scale-110"
                />
                <h1 className="text-xl font-extrabold bg-gradient-to-r from-[#7927ff] to-[#2193b0] bg-clip-text text-transparent">
                  CryptoHub
                </h1>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2.5 rounded-lg transition-all duration-200 ${isDark
                ? 'hover:bg-[rgba(121,39,255,0.15)]'
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
              ? 'bg-gradient-to-br from-[rgba(121,39,255,0.12)] to-[rgba(33,147,176,0.08)] border-[rgba(121,39,255,0.2)] hover:border-[rgba(121,39,255,0.4)]'
              : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 hover:border-purple-300'
              }`}>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7927ff] to-[#2193b0] flex items-center justify-center text-2xl font-bold shadow-lg ring-4 ring-[rgba(121,39,255,0.12)]">
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
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${item.active
                  ? "bg-gradient-to-r from-[#7927ff] to-[#2193b0] text-white shadow-lg shadow-purple-500/25"
                  : isDark
                    ? "text-gray-300 hover:bg-[rgba(121,39,255,0.1)] hover:text-white"
                    : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                  } ${!sidebarOpen && "justify-center"}`}
              >
                <span className={sidebarOpen ? "" : ""}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          {sidebarOpen && (
            <div className={`mb-4 p-3 rounded-xl border ${isDark
              ? 'bg-[rgba(121,39,255,0.08)] border-[rgba(121,39,255,0.15)]'
              : 'bg-gray-50 border-gray-200'
              }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Theme
                </span>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${isDark
                  ? 'bg-[rgba(121,39,255,0.15)] hover:bg-[rgba(121,39,255,0.25)] text-white'
                  : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-200'
                  }`}
              >
                <span className="text-lg">{isDark ? "🌙" : "☀️"}</span>
                <span className="flex-1 text-left font-medium">{isDark ? "Dark" : "Light"}</span>
                <span className="text-sm opacity-70">Toggle</span>
              </button>
            </div>
          )}

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
              ? 'bg-[rgba(121,39,255,0.15)] hover:bg-[rgba(121,39,255,0.25)]'
              : 'bg-white hover:bg-gray-100 border border-gray-200'
              }`}
          >
            <span className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>☰</span>
          </button>

          <div className="mb-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 leading-tight">
              <span className="bg-gradient-to-r from-[#7927ff] via-[#9945ff] to-[#2193b0] bg-clip-text text-transparent">
                {greeting}, {getFirstName()}!
              </span>
              <span className="inline-block ml-3 text-5xl">👋</span>
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Welcome back to your crypto dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            <div className={`xl:col-span-2 rounded-2xl p-8 border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isDark
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
                  Portfolio Overview
                </h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-5 rounded-xl border transition-all duration-200 hover:scale-105 ${isDark
                  ? 'bg-gradient-to-br from-[rgba(121,39,255,0.12)] to-[rgba(121,39,255,0.04)] border-[rgba(121,39,255,0.2)]'
                  : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'
                  }`}>
                  <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Value</p>
                  <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>$0.00</p>
                </div>
                <div className={`p-5 rounded-xl border transition-all duration-200 hover:scale-105 ${isDark
                  ? 'bg-gradient-to-br from-[rgba(33,147,176,0.12)] to-[rgba(33,147,176,0.04)] border-[rgba(33,147,176,0.2)]'
                  : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
                  }`}>
                  <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Assets</p>
                  <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>0</p>
                </div>
                <div className={`p-5 rounded-xl border transition-all duration-200 hover:scale-105 ${isDark
                  ? 'bg-gradient-to-br from-[rgba(74,222,128,0.12)] to-[rgba(74,222,128,0.04)] border-[rgba(74,222,128,0.2)]'
                  : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
                  }`}>
                  <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>24h Profit</p>
                  <p className="text-3xl font-bold text-green-400">+0.00%</p>
                </div>
                <div className={`p-5 rounded-xl border transition-all duration-200 hover:scale-105 ${isDark
                  ? 'bg-gradient-to-br from-[rgba(251,191,36,0.12)] to-[rgba(251,191,36,0.04)] border-[rgba(251,191,36,0.2)]'
                  : 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200'
                  }`}>
                  <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Watchlist</p>
                  <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>0</p>
                </div>
              </div>
            </div>

            <div className={`xl:col-span-1 rounded-2xl p-8 border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isDark
              ? 'bg-[rgba(15,8,40,0.6)] backdrop-blur-xl border-[rgba(121,39,255,0.15)] shadow-[0_8px_32px_0_rgba(121,39,255,0.12)]'
              : 'bg-white border-gray-200 shadow-xl'
              }`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7927ff] to-[#2193b0] flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    onClick={() => alert('Change Password feature coming soon!')}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 font-medium border ${isDark
                      ? 'bg-[rgba(121,39,255,0.1)] hover:bg-[rgba(121,39,255,0.2)] text-purple-400 border-purple-600/30 hover:border-purple-500/50'
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
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
