import React, { useContext, useState, useEffect, useCallback } from "react";
import { CoinContext } from "../context/CoinContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoHomeOutline, IoPricetagsOutline, IoNewspaperOutline, IoRocketOutline, IoGridOutline, IoTrophyOutline, IoMenu, IoClose } from "react-icons/io5";
import "./Navbar.css";

function Navbar() {
  const { setCurrency } = useContext(CoinContext);
  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState({ label: "USD", value: "usd", symbol: "$" });

  const isDashboardPage = location.pathname === "/dashboard";

  const currencies = [
    { label: "USD", value: "usd", symbol: "$" },
    { label: "EUR", value: "eur", symbol: "€" },
    { label: "INR", value: "inr", symbol: "₹" },
  ];

  const currencyHandler = useCallback((currency) => {
    setSelectedCurrency(currency);
    setCurrency({ name: currency.value, Symbol: currency.symbol });
    setIsCurrencyOpen(false);
  }, [setCurrency]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate("/");
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  }, [logout, navigate]);

  useEffect(() => {
    if (isDark) {
      document.body.removeAttribute("data-theme");
    } else {
      document.body.setAttribute("data-theme", "light");
    }
  }, [isDark]);

  const navLinks = [
    { to: "/", label: "Home", icon: <IoHomeOutline /> },
    { to: "/pricing", label: "Pricing", icon: <IoPricetagsOutline /> },
    { to: "/blog", label: "Blog", icon: <IoNewspaperOutline /> },
    { to: "/features", label: "Features", icon: <IoRocketOutline /> },
  ];

  const authenticatedNavLinks = [
    ...navLinks,
    { to: "/dashboard", label: "Dashboard", icon: <IoGridOutline /> },
    { to: "/leaderboard", label: "Leaderboard", icon: <IoTrophyOutline /> },
  ];

  return (
    <div className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Link
          to={"/"}
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <img
            src="/crypto-logo.png"
            alt="CryptoHub Logo"
            className="navbar-logo"
          />
          <span className="logo-text">CryptoHub</span>
        </Link>
      </div>

      {!isDashboardPage && (
        <>
          {/* Desktop Menu */}
          <ul className="nav-links desktop-only">
            {(currentUser ? authenticatedNavLinks : navLinks).map((link) => (
              <li key={link.to} className={`nav-item ${location.pathname === link.to ? "active" : ""}`}>
                <Link to={link.to} className="nav-link">
                  <span className="nav-icon">{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="nav-right">
        <div className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
          <div className={`toggle-track ${isDark ? "dark" : "light"}`}>
            <div className="toggle-thumb"></div>
          </div>
        </div>

        <select
          className="currency-select"
          onChange={(e) => {
            const currency = currencies.find(c => c.value === e.target.value);
            currencyHandler(currency);
          }}
        >
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="inr">INR</option>
        </select>

        <div className="desktop-auth">
          {currentUser ? (
            <>
              <div className="user-info">
                <span className="user-email">{currentUser.email}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="login-btn">Login</button>
              </Link>
              <Link to="/signup">
                <button className="signup-btn">Sign up</button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          {!isDashboardPage && (currentUser ? authenticatedNavLinks : navLinks).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`mobile-nav-item ${location.pathname === link.to ? "active" : ""}`}
            >
              <span className="mobile-nav-icon">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </ul>

        <div className="mobile-auth">
          {currentUser ? (
            <button onClick={handleLogout} className="logout-btn full-width">Logout</button>
          ) : (
            <div className="mobile-auth-buttons">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="login-btn full-width">Login</button>
              </Link>
              <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="signup-btn full-width">Sign up</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;