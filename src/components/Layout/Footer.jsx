import React, { useState } from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaGithub,
  FaTwitter,
  FaDiscord,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaApplePay,
  FaGooglePay,
} from "react-icons/fa";
import { FiSend } from "react-icons/fi";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const currentYear = new Date().getFullYear();

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setStatus("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setStatus("Subscribing...");

    // Simulated API call
    setTimeout(() => {
      setStatus("Successfully subscribed to CryptoHub Insights!");
      setEmail("");
      setIsSubmitting(false);
      setTimeout(() => setStatus(""), 3000);
    }, 1500);
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Main Grid */}
        <div className="footer-main">
          {/* Brand */}
          <div className="footer-brand">
            <h2 className="footer-logo">
              Crypto<span>Hub</span>.
            </h2>
            <p>
              Real-time crypto tracking, advanced analytics, market insights &
              portfolio tools.
            </p>

            <div className="payment-methods">
              <FaCcVisa className="payment-icon" />
              <FaCcMastercard className="payment-icon" />
              <FaCcPaypal className="payment-icon" />
              <FaApplePay className="payment-icon" />
              <FaGooglePay className="payment-icon" />
            </div>
          </div>

          {/* Markets */}
          <div className="footer-links">
            <h4>Markets</h4>
            <ul>
              <li>
                <Link to="/trending">Trending Coins</Link>
              </li>
              <li>
                <Link to="/gainers">Top Gainers</Link>
              </li>
              <li>
                <Link to="/top-losers">Top Losers</Link>
              </li>
              <li>
                <Link to="/new-listings">New Listings</Link>
              </li>
            </ul>
          </div>

          {/* Product */}
          <div className="footer-links">
            <h4>Product</h4>
            <ul>
              <li>
                <Link to="/features">Features</Link>
              </li>
              <li>
                <Link to="/pricing">Pricing</Link>
              </li>
              <li>
                <Link to="/portfolio">Portfolio</Link>
              </li>
              <li>
                <Link to="/api-access">API Access</Link>
              </li>
              <li>
                <Link to="/feedback">Feedback</Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-links">
            <h4>Company</h4>
            <ul>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contactus">Contact Us</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
              <li>
                <Link to="/contributors">Contributors</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-newsletter">
            <h4>Newsletter</h4>
            <p>Weekly crypto insights & market updates</p>

            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                aria-label="Email address"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting || !email}
                aria-label="Subscribe"
              >
                {isSubmitting ? "..." : <FiSend />}
              </button>
            </form>

            {status && (
              <p
                className={`status-message ${status.includes("Success") ? "success" : "error"}`}
              >
                {status}
              </p>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom-section">
          <div className="social-links">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="https://github.com/KaranUnique/CryptoHub"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://discord.gg"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
            >
              <FaDiscord />
            </a>
          </div>

          <div className="footer-bottom">
            <p>
              <Link to="/privacy">Privacy Policy</Link> |{" "}
              <Link to="/terms">Terms of Service</Link> |{" "}
              <Link to="/cookies">Cookies</Link> |{" "}
              <Link to="/contactus">Contact Us</Link>
            </p>
            <p>© {currentYear} CryptoHub. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
