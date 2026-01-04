import React, { useContext, useState, useEffect, useCallback } from "react";
import { CoinContext } from "../context/CoinContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
    { to: "/", label: "Home" },
    { to: "/pricing", label: "Pricing" },
    { to: "/blog", label: "Blog" },
    { to: "/features", label: "Features" },
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
        <ul>
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <li>{link.label}</li>
            </Link>
          ))}
          {currentUser && (
            <Link to="/dashboard">
              <li>Dashboard</li>
            </Link>
          )}
        </ul>
      )}

      <div className="nav-right">
        <div className="theme-toggle" onClick={toggleTheme}>
          <div className={`toggle-track ${isDark ? "dark" : "light"}`}>
            <div className="toggle-thumb"></div>
          </div>
        </div>

        <select onChange={(e) => {
          const currency = currencies.find(c => c.value === e.target.value);
          currencyHandler(currency);
        }}>
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="inr">INR</option>
        </select>

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
              <button className="login-btn">Sign up</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;