import React, { useContext, useState, useEffect } from "react";
import "./Navbar.css";

import { CoinContext } from "../context/CoinContext";
import { Link } from "react-router-dom";

function Navbar() {
  const { setCurrency } = useContext(CoinContext);

  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("cryptohub-theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  const currencyHandler = (event) => {
    switch (event.target.value) {
      case "usd": {
        setCurrency({ name: "usd", Symbol: "$" });
        break;
      }
      case "eur": {
        setCurrency({ name: "eur", Symbol: "€" });
        break;
      }
      case "inr": {
        setCurrency({ name: "inr", Symbol: "₹" });
        break;
      }
      default: {
        setCurrency({ name: "usd", Symbol: "$" });
        break;
      }
    }
  };

  useEffect(() => {
    if (isDark) {
      document.body.removeAttribute("data-theme");
      localStorage.setItem("cryptohub-theme", "dark");
    } else {
      document.body.setAttribute("data-theme", "light");
      localStorage.setItem("cryptohub-theme", "light");
    }
  }, [isDark]);

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
      <ul>
        <Link to={"/"}>
          <li>Home</li>
        </Link>
        <Link to={"/pricing"}>
          <li>Pricing</li>
        </Link>
        <Link to={"/blog"}>
          <li>Blog</li>
        </Link>
        <Link to={"/features"}>
          <li>Features</li>
        </Link>
      </ul>
      <div className="nav-right">
        <div className="theme-toggle" onClick={() => setIsDark(!isDark)}>
          <div className={`toggle-track ${isDark ? "dark" : "light"}`}>
            <div className="toggle-thumb"></div>
          </div>
        </div>
        <select onChange={currencyHandler}>
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="inr">INR</option>
        </select>
        <Link to="/login">
          <button className="login-btn">Login</button>
        </Link>
                <Link to="/signup">
          <button className="signup-btn">Sign up</button>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
