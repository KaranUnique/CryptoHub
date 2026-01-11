import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';

const Footer = () => {

  const currentYear = new Date().getFullYear(); // dynamically fetch current year
  
  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        <div className="footer-top">
          {/* Brand Column */}
          <div className="footer-col brand-col">
            <h2 className="footer-logo">CryptoHub.</h2>
            <p>The world's most accurate real-time crypto tracking and analytics platform.</p>
          </div>

          {/* Links Columns */}
          <div className="footer-col">
            <h4>Market</h4>
            <ul>
              <li><Link to="/">Trending Coins</Link></li>
              <li><Link to="/">Top Gainers</Link></li>
              <li><Link to="/">New Listings</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><Link to="/">Help Center</Link></li>
              <li><Link to="/">Contact Us</Link></li>
              <li><Link to="/">FAQ</Link></li>
            </ul>
          </div>

          {/* Social Column */}
          <div className="footer-col">
            <h4>Community</h4>
            <div className="social-icons">
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaGithub /></a>
            </div>
          </div>
        </div>

        {/* Copyright Line */}
        <div className="footer-bottom">
          <p>
            Copyright © {currentYear}, CryptoHub - All Rights Reserved.
          </p>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;