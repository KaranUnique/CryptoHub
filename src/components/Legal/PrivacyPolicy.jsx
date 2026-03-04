import React from "react";
import { Link } from "react-router-dom";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-wrapper">
      <div className="privacy-container">

        <header className="privacy-header">
          <h1>Privacy Policy</h1>
          <p className="effective-date">Effective: January 22, 2026</p>
          <p className="intro">
            CryptoHub is committed to protecting your privacy. This policy
            explains how we collect, use, and safeguard your information while
            providing cryptocurrency tracking, wallets, and analytics services.
          </p>
        </header>

        {[
          {
            title: "1. Information We Collect",
            content: (
              <>
                <h4>Personal Information</h4>
                <ul>
                  <li>Name, email, username & password</li>
                  <li>KYC data (ID, address proof)</li>
                  <li>Wallet public addresses</li>
                  <li>Payment details for subscriptions</li>
                </ul>

                <h4>Automatically Collected</h4>
                <ul>
                  <li>IP, browser, device & cookies</li>
                  <li>Transaction data from connected wallets</li>
                </ul>
              </>
            ),
          },
          {
            title: "2. How We Use Your Information",
            content: (
              <ul>
                <li>Portfolio tracking & analytics</li>
                <li>Fraud detection & encryption security</li>
                <li>KYC/AML compliance</li>
                <li>Product improvements & marketing</li>
              </ul>
            ),
          },
          {
            title: "3. Sharing Your Information",
            content: (
              <ul>
                <li>Trusted service providers</li>
                <li>Legal authorities when required</li>
                <li>Internal affiliates</li>
                <li>We never sell your personal data</li>
              </ul>
            ),
          },
          {
            title: "4. Data Security",
            content: (
              <p>
                We use AES-256 encryption, secure servers, and strict access
                control policies. Private keys and seed phrases are never stored.
              </p>
            ),
          },
          {
            title: "5. Your Rights",
            content: (
              <ul>
                <li>Access, update, or delete your data</li>
                <li>GDPR rights (EEA/UK)</li>
                <li>CCPA rights (California)</li>
                <li>Opt-out of marketing & cookies</li>
              </ul>
            ),
          },
          {
            title: "6. Cookies & Tracking",
            content: (
              <p>
                Essential cookies for functionality and optional analytics
                cookies with user consent.
              </p>
            ),
          },
          {
            title: "7. Children's Privacy",
            content: (
              <p>
                Our services are not intended for children under 13.
              </p>
            ),
          },
          {
            title: "8. International Transfers",
            content: (
              <p>
                Data may be processed internationally with appropriate legal
                safeguards.
              </p>
            ),
          },
          {
            title: "9. Policy Updates",
            content: (
              <p>
                Any changes will be posted here with updated effective dates.
              </p>
            ),
          },
        ].map((section, index) => (
          <section key={index} className="privacy-card">
            <h2>{section.title}</h2>
            <div className="card-content">{section.content}</div>
          </section>
        ))}

        <footer className="privacy-footer">
          <p>
            Contact: privacy@cryptohub.com |{" "}
            <Link to="/terms" className="footer-link">
              Terms of Service
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;