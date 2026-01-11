import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiLock, FiMenu, FiX } from "react-icons/fi";
import "./Navbar.css";

function Navbar() {
  const { currentUser, logout, isEmailProvider } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isDashboardPage = location.pathname === "/dashboard";

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate("/");
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  }, [logout, navigate]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/pricing", label: "Pricing" },
    { to: "/blog", label: "Insights" },
    { to: "/features", label: "Features" },
    { to: "/contributors", label: "Contributors" },
  ];

  const authenticatedNavLinks = [
    ...navLinks,
    { to: "/dashboard", label: "Dashboard" },
    { to: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <nav 
      className={`navbar ${scrolled ? "scrolled" : ""} ${isMobileMenuOpen ? "has-mobile-menu" : ""} ${isDashboardPage ? "is-dashboard" : ""}`}
    >
      <div className="navbar-content">
        {/* Brand/Logo Section */}
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <div className="navbar-logo-icon">
            <img src="/crypto-logo.png" alt="CryptoHub" className="logo-img" />
          </div>
          <span className="logo-text">CryptoHub</span>
        </Link>

        {/* Desktop Navigation Menu */}
        {!isDashboardPage && (
          <ul className="navbar-menu desktop-only">
            {(currentUser ? authenticatedNavLinks : navLinks).map((link) => (
              <li key={link.to} className="navbar-item">
                <Link 
                  to={link.to} 
                  className={`navbar-link ${location.pathname === link.to ? "active" : ""}`}
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Right Side Actions - Desktop */}
        <div className="navbar-actions desktop-only">
          {currentUser ? (
            <div className="user-menu">
              <span className="user-email">{currentUser.email}</span>
              {isEmailProvider() && (
                <Link to="/change-password" className="icon-btn" title="Change Password">
                  <FiLock />
                </Link>
              )}
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="navbar-btn navbar-btn-login">
                LOGIN
              </Link>
              <Link to="/signup" className="navbar-btn navbar-btn-signup">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggle mobile-only"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          {!isDashboardPage && (currentUser ? authenticatedNavLinks : navLinks).map((link) => (
            <li key={link.to} className="mobile-nav-item">
              <Link
                to={link.to}
                onClick={closeMobileMenu}
                className={`mobile-nav-link ${location.pathname === link.to ? "active" : ""}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mobile-controls">
          <div className="mobile-control-item" onClick={toggleTheme}>
            <span>Theme</span>
            <div className={`toggle-track ${theme === 'dark' ? "dark" : "light"}`}>
              <div className="toggle-thumb"></div>
            </div>
          </div>
        </div>

        <div className="mobile-auth">
          {currentUser ? (
            <>
              {isEmailProvider() && (
                <Link to="/change-password" className="mobile-change-password" onClick={closeMobileMenu}>
                  <FiLock /> Change Password
                </Link>
              )}
              <button onClick={handleLogout} className="logout-btn full-width">
                Logout
              </button>
            </>
          ) : (
            <div className="mobile-auth-buttons">
              <Link to="/login" onClick={closeMobileMenu}>
                <button className="login-btn full-width">LOGIN</button>
              </Link>
              <Link to="/signup" onClick={closeMobileMenu}>
                <button className="signup-btn full-width">Get Started</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;