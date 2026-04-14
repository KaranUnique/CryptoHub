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
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const { currentUser, logout, isEmailProvider } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState(null);

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

  const toggleProfile = (e) => {
    e.stopPropagation();
    setIsProfileOpen(!isProfileOpen);
    setOpenDropdown(null);
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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // If click is inside the navbar, ignore — allow internal controls to handle state
      if (navRef.current && navRef.current.contains(e.target)) return;

      // Clicked outside navbar — close everything
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
  }, [openDropdown, isProfileOpen]);

  // Close menus when the route changes
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
    { to: "/", label: "Home" },
    { to: "/pricing", label: "Pricing" },
    {
      label: "Markets",
      dropdown: [
        { to: "/new-listings", label: "New Listings" },
        { to: "/trending", label: "Trending" },
        { to: "/gainers", label: "Gainers" },
        { to: "/top-losers", label: "Top Losers" },
        { to: "watchlist", label: "Watchlist" },
      ],
    },
    { to: "/blog", label: "Insights" },
    { to: "/features", label: "Features" },
    {
      label: "more",
      dropdown: [
        { to: "/about", label: "About" },
        { to: "/contributors", label: "Contributors" },
        { to: "/contactus", label: "Contact Us" },
        { to: "/faq", label: "FAQ" },
      ],
    },
  ];

  const authenticatedNavLinks = [
    ...navLinks,
    { to: "/watchlist", label: "Watchlist" },
    { to: "/dashboard", label: "Dashboard" },
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
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 bg-purple-900/40 backdrop-blur-xl shadow-xl border-b border-purple-400/20 ${
        isDashboardPage ? "hidden" : ""
      }`}
    >
      <div className="flex items-center justify-between h-20 px-8 max-w-7xl mx-auto w-full">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 flex-shrink-0 no-underline hover:no-underline group"
        >
          <img
            src="/crypto-logo.png"
            alt="CryptoHub"
            className="w-10 h-10 object-contain"
          />
          <span className="font-bold text-lg text-white hidden sm:inline-block">
            CryptoHub
          </span>
        </Link>

        {/* Desktop Menu */}
        {!isDashboardPage && (
          <ul className="hidden lg:flex items-center gap-8 flex-1 justify-center list-none p-0 m-0">
            {(currentUser ? authenticatedNavLinks : navLinks).map((link) => (
              <li
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
                      className="px-4 py-2 text-white font-medium text-sm transition-all duration-300 flex items-center gap-2 group rounded-lg bg-purple-600/30 hover:bg-purple-500/40 border border-purple-400/40 hover:border-purple-400/60 backdrop-blur-sm"
                      onClick={() => handleMobileDropdownClick(link.label)}
                      aria-expanded={openDropdown === link.label}
                      aria-haspopup="true"
                    >
                      {link.label}
                      <FiChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                    </button>
                    <ul
                      className={`absolute left-0 mt-2 min-w-max bg-purple-900/50 backdrop-blur-xl border border-purple-400/30 rounded-lg opacity-0 invisible transition-all duration-200 group-hover:opacity-100 group-hover:visible list-none p-2 m-0 shadow-lg ${
                        openDropdown === link.label ? "opacity-100 visible" : ""
                      }`}
                      role="menu"
                    >
                      {link.dropdown.map((item) => (
                        <li key={item.to} role="none">
                          <Link
                            to={item.to}
                            className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-purple-500/20 text-sm font-medium rounded transition-colors duration-200"
                            role="menuitem"
                            onClick={closeMobileMenu}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    to={link.to}
                    className={`text-sm font-medium transition-colors duration-300 no-underline hover:no-underline ${
                      isLinkActive(link.to)
                        ? "text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                    onClick={closeMobileMenu}
                    aria-current={isLinkActive(link.to) ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-4">
            {currentUser ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  className="w-8 h-8 rounded-full bg-purple-600/40 backdrop-blur-sm border border-purple-400/50 text-white flex items-center justify-center hover:bg-purple-500/50 transition-all duration-300 overflow-hidden"
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
                    <FiUser className="w-4 h-4" />
                  )}
                </button>

                <div
                  className={`absolute top-full right-0 min-w-60 bg-purple-900/50 backdrop-blur-xl border border-purple-400/30 rounded-lg mt-2 overflow-hidden opacity-0 invisible transition-all duration-200 z-50 shadow-lg ${
                    isProfileOpen ? "opacity-100 visible" : ""
                  }`}
                  role="menu"
                >
                  {/* Header */}
                  <div className="px-4 py-3 bg-purple-600/20 border-b border-purple-400/20 flex items-center gap-2 backdrop-blur-sm">
                    <FiMail className="w-4 h-4 text-purple-300" />
                    <span className="text-white/90 text-xs font-medium truncate">
                      {currentUser.email}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="p-1">
                    {isEmailProvider() && (
                      <Link
                        to="/change-password"
                        className="flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white text-xs rounded transition-colors duration-200 hover:bg-purple-500/20"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiLock className="w-3 h-3" />
                        <span>Change Password</span>
                      </Link>
                    )}

                    <Link
                      to="/saved-insights"
                      className="flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white text-xs rounded transition-colors duration-200 hover:bg-cyan-500/20"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FiBookmark className="w-3 h-3" />
                      <span>Saved Insights</span>
                    </Link>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 text-xs rounded transition-colors duration-200 hover:bg-red-600/20"
                    >
                      <FiLogOut className="w-3 h-3" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 text-white font-semibold rounded-lg border-2 border-purple-400/60 hover:border-purple-400/80 hover:bg-purple-500/20 backdrop-blur-sm transition-all duration-300 no-underline hover:no-underline text-sm"
                >
                  Contribute
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 text-white font-bold rounded-lg bg-gradient-to-r from-purple-600/80 to-purple-500/80 hover:from-purple-500 hover:to-purple-400 backdrop-blur-sm transition-all duration-300 no-underline hover:no-underline text-sm shadow-lg hover:shadow-purple-600/40"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden flex flex-col gap-1 p-2 rounded-lg transition-colors duration-300"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation"
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span
              className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
            />
            <span
              className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && !isDashboardPage && (
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className="fixed top-20 left-0 right-0 w-full bg-purple-900/40 backdrop-blur-xl border-b border-purple-400/20 z-40 shadow-lg"
          aria-hidden={!isMobileMenuOpen}
        >
          <ul className="list-none p-4 m-0">
            {(currentUser ? authenticatedNavLinks : navLinks).map((link) => (
              <li key={link.label} className="border-b border-purple-400/15">
                {link.dropdown ? (
                  <>
                    <button
                      type="button"
                      className="w-full text-left px-4 py-3 text-gray-300 hover:text-white font-medium text-sm transition-colors duration-200 hover:bg-purple-500/20 flex items-center justify-between rounded backdrop-blur-sm"
                      onClick={() => handleMobileDropdownClick(link.label)}
                      aria-expanded={mobileOpenDropdown === link.label}
                      aria-controls={`mobile-submenu-${link.label}`}
                    >
                      {link.label}
                      <FiChevronDown
                        className={`w-4 h-4 transition-transform ${
                          mobileOpenDropdown === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {mobileOpenDropdown === link.label && (
                      <ul
                        id={`mobile-submenu-${link.label}`}
                        className="list-none p-2 m-0 bg-black/20"
                      >
                        {link.dropdown.map((item) => (
                          <li key={item.to}>
                            <Link
                              to={item.to}
                              className="block px-4 py-2 text-gray-400 hover:text-white text-xs font-medium rounded transition-colors duration-200 hover:bg-purple-500/20"
                              onClick={closeMobileMenu}
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.to}
                    className={`block px-4 py-3 font-medium text-sm rounded transition-colors duration-200 no-underline hover:no-underline ${
                      isLinkActive(link.to)
                        ? "text-white"
                        : "text-gray-300 hover:text-white hover:bg-purple-500/15"
                    }`}
                    aria-current={isLinkActive(link.to) ? "page" : undefined}
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Auth Buttons */}
          {!currentUser && (
            <div className="flex flex-col gap-2 p-4 border-t border-purple-400/15">
              <Link
                to="/login"
                className="w-full px-4 py-2 text-white font-semibold rounded-lg border-2 border-purple-400/60 hover:border-purple-400/80 hover:bg-purple-500/20 backdrop-blur-sm transition-all duration-300 text-center no-underline hover:no-underline text-sm"
                onClick={closeMobileMenu}
              >
                Contribute
              </Link>
              <Link
                to="/signup"
                className="w-full px-4 py-2 text-white font-bold rounded-lg bg-gradient-to-r from-purple-600/80 to-purple-500/80 hover:from-purple-500 hover:to-purple-400 backdrop-blur-sm transition-all duration-300 text-center no-underline hover:no-underline text-sm"
                onClick={closeMobileMenu}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
