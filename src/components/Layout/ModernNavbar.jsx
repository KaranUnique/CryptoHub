import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../../context/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiLock,
  FiUser,
  FiLogOut,
  FiMail,
  FiBookmark,
  FiMenu,
  FiX,
  FiChevronDown,
  FiHome,
  FiTrendingUp,
  FiBarChart2,
  FiBook,
  FiSettings,
} from "react-icons/fi";

function ModernNavbar() {
  const { currentUser, logout, isEmailProvider } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  const isDashboardPage = location.pathname === "/dashboard";

  /* -------------------- Handlers -------------------- */

  const handleDropdownEnter = (label) => {
    if (window.innerWidth > 1024) {
      setOpenDropdown(label);
    }
  };

  const handleDropdownLeave = () => {
    if (window.innerWidth > 1024) {
      setOpenDropdown(null);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate("/");
      closeMobileMenu();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [logout, navigate]);

  /* -------------------- Effects -------------------- */

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && navRef.current.contains(e.target)) return;
      if (openDropdown) setOpenDropdown(null);
      if (isProfileOpen) setIsProfileOpen(false);
      if (mobileOpenDropdown) setMobileOpenDropdown(null);
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        if (openDropdown) setOpenDropdown(null);
        if (isProfileOpen) setIsProfileOpen(false);
        if (mobileOpenDropdown) setMobileOpenDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openDropdown, isProfileOpen, mobileOpenDropdown, isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    setIsProfileOpen(false);
    setMobileOpenDropdown(null);
  }, [location.pathname]);

  const handleMobileDropdownClick = (label) => {
    setMobileOpenDropdown((prev) => (prev === label ? null : label));
  };

  /* -------------------- Nav Links -------------------- */

  const navLinks = [
    { to: "/", label: "Home", icon: FiHome },
    { to: "/pricing", label: "Pricing" },
    {
      label: "Markets",
      icon: FiTrendingUp,
      dropdown: [
        { to: "/new-listings", label: "New Listings", icon: FiBarChart2 },
        { to: "/trending", label: "Trending", icon: FiTrendingUp },
        { to: "/gainers", label: "Gainers" },
        { to: "/top-losers", label: "Top Losers" },
        { to: "/watchlist", label: "Watchlist", icon: FiBookmark },
      ],
    },
    { to: "/blog", label: "Insights", icon: FiBook },
    { to: "/features", label: "Features" },
  ];

  const authenticatedNavLinks = [
    ...navLinks,
    { to: "/leaderboard", label: "Leaderboard" },
  ];

  const isLinkActive = (to) => {
    if (!to) return false;
    if (to === "/") return location.pathname === "/";
    return (
      location.pathname === to ||
      location.pathname.startsWith(to + "/") ||
      location.pathname.startsWith(to)
    );
  };

  /* -------------------- JSX -------------------- */

  return (
    <nav
      ref={navRef}
      role="navigation"
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ${
        isDashboardPage ? "hidden" : ""
      } ${scrollY > 10 ? "shadow-2xl" : ""}`}
      style={{
        background: `rgba(17, 24, 39, ${Math.min(scrollY / 100, 0.7)})`,
        backdropFilter: `blur(${Math.min(scrollY / 20, 20)}px)`,
        borderBottom: `1px solid rgba(168, 85, 247, ${Math.min(scrollY / 100, 0.3)})`,
      }}
    >
      <div className="mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center gap-3 flex-shrink-0 group no-underline hover:no-underline"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/40 to-blue-500/40 backdrop-blur-md border border-purple-400/30 flex items-center justify-center group-hover:from-purple-500/60 group-hover:to-blue-500/60 transition-all duration-300 shadow-lg">
              <span className="text-lg font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                ₿
              </span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-lg bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
                CryptoHub
              </span>
              <span className="text-xs text-purple-300/60">
                Market Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          {!isDashboardPage && (
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {(currentUser ? authenticatedNavLinks : navLinks).map((link) => (
                <div
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() =>
                    link.dropdown && handleDropdownEnter(link.label)
                  }
                  onMouseLeave={handleDropdownLeave}
                >
                  {link.dropdown ? (
                    <>
                      <button
                        type="button"
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                          openDropdown === link.label
                            ? "bg-gradient-to-r from-purple-500/50 to-blue-500/50 text-white border border-purple-400/80 shadow-lg shadow-purple-500/20"
                            : "text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-blue-500/30 border border-purple-400/30 hover:border-purple-400/60"
                        }`}
                        aria-expanded={openDropdown === link.label}
                        aria-haspopup="true"
                      >
                        {link.icon && <link.icon className="w-4 h-4" />}
                        {link.label}
                        <FiChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            openDropdown === link.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Dropdown Menu */}
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 mt-3 w-56 rounded-2xl border overflow-hidden opacity-0 invisible transition-all duration-300 group-hover:opacity-100 group-hover:visible z-50 shadow-2xl shadow-purple-500/20 ${
                          openDropdown === link.label
                            ? "opacity-100 visible border-purple-400/60"
                            : "border-purple-400/30"
                        }`}
                        style={{
                          background: "rgba(17, 24, 39, 0.95)",
                          backdropFilter: "blur(25px)",
                        }}
                      >
                        {/* Gradient top */}
                        <div className="h-1.5 bg-gradient-to-r from-purple-500/0 via-purple-500/60 to-blue-500/0" />

                        <div className="p-2 space-y-0.5">
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.to}
                              to={item.to}
                              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 group/item"
                              onClick={closeMobileMenu}
                            >
                              {item.icon && (
                                <item.icon className="w-4 h-4 text-purple-400/70 group-hover/item:text-purple-300 transition-colors" />
                              )}
                              <span className="group-hover/item:translate-x-0.5 transition-transform">
                                {item.label}
                              </span>
                            </Link>
                          ))}
                        </div>

                        {/* Gradient bottom */}
                        <div className="h-1.5 bg-gradient-to-r from-purple-500/0 via-purple-500/60 to-blue-500/0" />
                      </div>
                    </>
                  ) : (
                    <Link
                      to={link.to}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 no-underline hover:no-underline ${
                        isLinkActive(link.to)
                          ? "bg-gradient-to-r from-purple-500/30 to-blue-500/30 text-white border border-purple-400/50"
                          : "text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-purple-400/30"
                      }`}
                      onClick={closeMobileMenu}
                      aria-current={isLinkActive(link.to) ? "page" : undefined}
                    >
                      {link.icon && <link.icon className="w-4 h-4" />}
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-3">
              {currentUser ? (
                <div className="relative">
                  <button
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/40 to-blue-500/40 backdrop-blur-md border border-purple-400/30 text-white flex items-center justify-center hover:from-purple-500/60 hover:to-blue-500/60 transition-all duration-300 shadow-lg overflow-hidden group"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    aria-label="User profile menu"
                    aria-expanded={isProfileOpen}
                  >
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                  </button>

                  {/* Profile Dropdown */}
                  <div
                    className={`absolute top-full right-0 mt-3 w-64 rounded-2xl border border-purple-400/30 overflow-hidden opacity-0 invisible transition-all duration-300 z-50 ${
                      isProfileOpen ? "opacity-100 visible" : ""
                    }`}
                    style={{
                      background: "rgba(17, 24, 39, 0.85)",
                      backdropFilter: "blur(20px)",
                    }}
                    role="menu"
                  >
                    {/* Gradient top */}
                    <div className="h-1 bg-gradient-to-r from-purple-500/0 via-purple-500/40 to-blue-500/0" />

                    {/* User Info */}
                    <div className="px-4 py-4 border-b border-purple-400/20">
                      <div className="flex items-center gap-3">
                        {currentUser.photoURL && (
                          <img
                            src={currentUser.photoURL}
                            alt="Profile"
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm truncate">
                            {currentUser.displayName || "User"}
                          </p>
                          <p className="text-purple-300/70 text-xs truncate">
                            {currentUser.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2 space-y-1">
                      {isEmailProvider() && (
                        <Link
                          to="/change-password"
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/10"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <FiLock className="w-4 h-4 text-purple-400/60" />
                          <span>Change Password</span>
                        </Link>
                      )}

                      <Link
                        to="/saved-insights"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/10"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiBookmark className="w-4 h-4 text-purple-400/60" />
                        <span>Saved Insights</span>
                      </Link>

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400/80 hover:text-red-300 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-red-500/10"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>

                    {/* Gradient bottom */}
                    <div className="h-1 bg-gradient-to-r from-purple-500/0 via-purple-500/40 to-blue-500/0" />
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg border border-purple-400/30 hover:border-purple-400/60 bg-white/5 hover:bg-white/10 transition-all duration-300 no-underline hover:no-underline"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2 text-sm font-bold text-white rounded-lg bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-500 hover:to-blue-500 transition-all duration-300 no-underline hover:no-underline shadow-lg hover:shadow-purple-500/50"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/5 transition-colors duration-300"
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6 text-white" />
              ) : (
                <FiMenu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && !isDashboardPage && (
        <div
          className="lg:hidden border-t border-purple-400/20"
          style={{
            background: "rgba(17, 24, 39, 0.6)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="px-6 py-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto">
            {(currentUser ? authenticatedNavLinks : navLinks).map((link) => (
              <div key={link.label}>
                {link.dropdown ? (
                  <>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white font-medium text-sm rounded-lg hover:bg-white/5 transition-all duration-200"
                      onClick={() => handleMobileDropdownClick(link.label)}
                      aria-expanded={mobileOpenDropdown === link.label}
                    >
                      <span className="flex items-center gap-2">
                        {link.icon && <link.icon className="w-4 h-4" />}
                        {link.label}
                      </span>
                      <FiChevronDown
                        className={`w-4 h-4 transition-transform ${
                          mobileOpenDropdown === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {mobileOpenDropdown === link.label && (
                      <div className="pl-4 space-y-1 mt-1 border-l-2 border-purple-400/30">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="flex items-center gap-2 px-4 py-2.5 text-gray-400 hover:text-white text-sm font-medium rounded-lg hover:bg-white/5 transition-all duration-200 no-underline hover:no-underline"
                            onClick={closeMobileMenu}
                          >
                            {item.icon && (
                              <item.icon className="w-4 h-4 text-purple-400/60" />
                            )}
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.to}
                    className={`flex items-center gap-2 px-4 py-3 font-medium text-sm rounded-lg transition-all duration-200 no-underline hover:no-underline ${
                      isLinkActive(link.to)
                        ? "bg-gradient-to-r from-purple-500/30 to-blue-500/30 text-white border border-purple-400/40"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                    onClick={closeMobileMenu}
                    aria-current={isLinkActive(link.to) ? "page" : undefined}
                  >
                    {link.icon && <link.icon className="w-4 h-4" />}
                    {link.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile Auth Buttons */}
            {!currentUser && (
              <div className="flex flex-col gap-2 pt-4 mt-4 border-t border-purple-400/20">
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-white font-semibold rounded-lg border border-purple-400/30 hover:border-purple-400/60 hover:bg-white/5 transition-all duration-300 text-center no-underline hover:no-underline text-sm"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2.5 text-white font-bold rounded-lg bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-500 hover:to-blue-500 transition-all duration-300 text-center no-underline hover:no-underline text-sm"
                  onClick={closeMobileMenu}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default ModernNavbar;
