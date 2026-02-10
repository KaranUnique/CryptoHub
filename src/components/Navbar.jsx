import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiLock, FiUser, FiLogOut, FiMail } from "react-icons/fi";
import "./Navbar.css";

function Navbar() {
  const { currentUser, logout, isEmailProvider } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
 

  const isDashboardPage = location.pathname === "/dashboard";

  /* -------------------- Handlers -------------------- */

  const handleDropdownEnter = (label) => {
    setOpenDropdown(label);
  };

  const handleDropdownLeave = () => {
    setOpenDropdown(null);
    };

  const handleDropdownClick = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest(".dropdown-container")) {
        setOpenDropdown(null);
      }
      if (isProfileOpen && !event.target.closest('.profile-menu-container')) {
        setIsProfileOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        if (openDropdown) setOpenDropdown(null);
        if (isProfileOpen) setIsProfileOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [openDropdown, isProfileOpen]);

  /* -------------------- Nav Links -------------------- */

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/pricing", label: "Pricing" },
    { to: "/blog", label: "Insights" },
    { to: "/features", label: "Features" },
    {
      label: "More",
      dropdown: [
        { to: "/contributors", label: "Contributors" },
        { to: "/contactus", label: "Contact Us" },
        { to: "/faq", label: "FAQ" },
      ],
    },
  ];

  const authenticatedNavLinks = [
    ...navLinks,
    { to: "/dashboard", label: "Dashboard" },
    { to: "/leaderboard", label: "Leaderboard" },
  ];

  const linksToRender = currentUser ? authenticatedNavLinks : navLinks;

  /* -------------------- JSX -------------------- */

  return (
    <nav
      data-theme={theme}
      className={`navbar ${scrolled ? "scrolled" : ""} ${
        isMobileMenuOpen ? "has-mobile-menu" : ""
      } ${isDashboardPage ? "is-dashboard" : ""}`}
    >
      <div className="navbar-content">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="/crypto-logo.png" alt="CryptoHub" className="logo-img" />
          <span className="logo-text">CryptoHub</span>
        </Link>

        {/* Desktop Menu */}
        {!isDashboardPage && (
          <ul className="navbar-menu">
            {linksToRender.map((link) => (
              <li
                key={link.label}
                className="navbar-item"
                onMouseEnter={() => link.dropdown && handleDropdownEnter(link.label)}
                onMouseLeave={handleDropdownLeave}
              >
                {link.dropdown ? (
                  <>
                    <button
                      type="button"
                      className="navbar-link dropdown-trigger"
                      onClick={() => handleDropdownClick(link.label)}
                      role="button"
                      aria-expanded={openDropdown === link.label}
                      aria-haspopup="true"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleDropdownClick(link.label);
                        }
                      }}
                    >
                      {link.label}
                    </button>

                    <ul
                      className={`dropdown-menu ${openDropdown === link.label ? "show" : ""}`}
                      role="menu"
                      aria-label={`${link.label} submenu`}
                    >
                      {link.dropdown.map((item) => (
                        <li key={item.to} role="none">
                          <Link
                            to={item.to}
                            className="dropdown-link"
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
                    className={`navbar-link ${location.pathname === link.to ? "active" : ""}`}
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Right Actions */}
        <div className="navbar-actions">
          <div className="desktop-auth">
            {currentUser ? (
              <div className="profile-menu-container">
                <button 
                  className="profile-icon-btn"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  aria-label="User profile menu"
                  aria-expanded={isProfileOpen}
                >
                  <FiUser />
                </button>
                
                <div className={`profile-dropdown ${isProfileOpen ? 'show' : ''}`}>
                  <div className="profile-dropdown-header">
                    <FiMail className="profile-icon" />
                    <span className="profile-email">{currentUser.email}</span>
                  </div>
                  
                  <div className="profile-dropdown-divider"></div>
                  
                  <div className="profile-dropdown-items">
                    {isEmailProvider() && (
                      <Link
                        to="/change-password"
                        className="profile-dropdown-item"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiLock />
                        <span>Change Password</span>
                      </Link>
                    )}
                    
                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }} 
                      className="profile-dropdown-item logout-item"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
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

          {/* Mobile Toggle */}
          <button
            className={`navbar-toggle ${
              isMobileMenuOpen ? "active" : ""
            }`}
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && !isDashboardPage && (
        <div className="mobile-menu">
          <ul className="mobile-menu-list">
            {(currentUser ? authenticatedNavLinks : navLinks).map((link) => (
              <li key={link.label} className="mobile-menu-item">
                {link.dropdown ? (
                  <>
                    <span 
                      className="mobile-menu-link"
                      onClick={() => handleDropdownClick(link.label)}
                    >
                      {link.label}
                    </span>
                    {openDropdown === link.label && (
                      <ul className="mobile-dropdown-menu">
                        {link.dropdown.map((item) => (
                          <li key={item.to}>
                            <Link
                              to={item.to}
                              className="mobile-dropdown-link"
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
                    className={`mobile-menu-link ${
                      location.pathname === link.to ? "active" : ""
                    }`}
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
            <div className="mobile-auth">
              <Link
                to="/login"
                className="navbar-btn navbar-btn-login"
                onClick={closeMobileMenu}
              >
                LOGIN
              </Link>
              <Link
                to="/signup"
                className="navbar-btn navbar-btn-signup"
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
