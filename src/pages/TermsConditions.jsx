import React, { useState } from "react";
import "./TermsConditions.css";

const TermsConditions = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const sections = [
    {
      id: 1,
      tag: "ACCEPT",
      title: "Acceptance of Terms",
      content:
        "By accessing or using CryptoHub, you agree to be legally bound by these Terms & Conditions. If you do not agree with any part of this agreement, you must not use the website or any of its services.",
    },
    {
      id: 2,
      tag: "PURPOSE",
      title: "Platform Purpose & Disclaimer",
      content:
        "CryptoHub provides cryptocurrency market information, real-time charts, and analytics tools. We explicitly do NOT provide financial, legal, or investment advice. All data is for informational purposes only. Always conduct your own research before making any financial decisions.",
    },
    {
      id: 3,
      tag: "CONDUCT",
      title: "User Responsibilities & Conduct",
      content:
        "You agree not to: (a) Use CryptoHub for illegal activities or money laundering; (b) Attempt to hack, exploit, scrape, or overload our servers; (c) Use our data for misleading or fraudulent trading; (d) Transmit malware, spam, or harmful content; (e) Reverse engineer or attempt to access source code.",
    },
    {
      id: 4,
      tag: "RISK",
      title: "Cryptocurrency Market Risk Disclaimer",
      content:
        "Cryptocurrency prices are extremely volatile and subject to rapid fluctuations. CryptoHub is not responsible for any financial losses, trading errors, or investment decisions resulting from reliance on displayed market data. Market conditions can change instantly, and past performance does not guarantee future results.",
    },
    {
      id: 5,
      tag: "API",
      title: "Third-Party Data & APIs",
      content:
        "CryptoHub displays data from third-party APIs including CoinGecko, TradingView, and other market data providers. We do not guarantee the accuracy, completeness, or timeliness of this data. We are not liable for service interruptions, data delays, or API failures from third parties.",
    },
    {
      id: 6,
      tag: "IP",
      title: "Intellectual Property Rights",
      content:
        "All code, UI designs, logos, branding, graphics, and original content are the exclusive property of CryptoHub or our licensed partners. You may not copy, resell, redistribute, modify, or create derivative works without explicit written permission. Unauthorized use may result in legal action.",
    },
    {
      id: 7,
      tag: "LIABILITY",
      title: "Limitation of Liability",
      content:
        "CryptoHub is provided AS-IS without warranties of any kind. We are not liable for financial losses, trading errors, system downtime, API failures, data breaches, or indirect damages. Use our platform at your own risk. We maintain reasonable security practices but cannot guarantee 100% protection.",
    },
    {
      id: 8,
      tag: "CHANGES",
      title: "Site Modifications & Termination",
      content:
        "We reserve the right to modify these Terms at any time without prior notice. Continued use of CryptoHub after changes means you accept the updated terms. We also reserve the right to suspend or terminate your access if you violate these terms or engage in prohibited conduct.",
    },
    {
      id: 9,
      tag: "PROHIBIT",
      title: "Prohibited Activities",
      content:
        "Prohibited activities include but are not limited to: market manipulation, wash trading, pump-and-dump schemes, using bots to exploit our services, creating multiple accounts to bypass restrictions, harassment, and transmission of malicious code. Violators may face permanent account suspension and legal action.",
    },
    {
      id: 10,
      tag: "UPTIME",
      title: "Service Availability & Uptime",
      content:
        "While we strive to maintain 99.9% uptime, CryptoHub does not guarantee uninterrupted service. We may perform maintenance, updates, or security patches at any time. We are not liable for losses due to temporary unavailability or service interruptions.",
    },
  ];

  return (
    <div className="terms-wrapper">
      <div className="terms-glow-1"></div>
      <div className="terms-glow-2"></div>
      <div className="terms-glow-3"></div>
      <div className="terms-grid-overlay"></div>

      <div className="terms-hero">
        <div className="terms-hero-content">
          <div className="terms-badge">
            <span className="terms-badge-dot"></span>
            Legal Document
          </div>
          <div className="terms-hero-icon-wrap">
            <svg className="terms-hero-icon" width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7V12C3 16.55 6.84 20.74 12 22C17.16 20.74 21 16.55 21 12V7L12 2Z" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12L11 14L15 10" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="terms-hero-title">
            Terms &amp; <span className="terms-hero-gradient">Conditions</span>
          </h1>
          <p className="terms-hero-meta">
            Last updated: <strong>March 2026</strong> &nbsp;&middot;&nbsp; Effective immediately
          </p>
          <p className="terms-hero-description">
            Welcome to CryptoHub. These Terms &amp; Conditions govern your use of
            our platform. By accessing or using CryptoHub, you accept and agree
            to be bound by these terms in their entirety.
          </p>
          <div className="terms-stats-row">
            <div className="terms-stat">
              <span className="terms-stat-value">10</span>
              <span className="terms-stat-label">Sections</span>
            </div>
            <div className="terms-stat-divider"></div>
            <div className="terms-stat">
              <span className="terms-stat-value">2026</span>
              <span className="terms-stat-label">Last updated</span>
            </div>
            <div className="terms-stat-divider"></div>
            <div className="terms-stat">
              <span className="terms-stat-value">v2.0</span>
              <span className="terms-stat-label">Version</span>
            </div>
          </div>
        </div>
      </div>

      <div className="terms-container">
        <div className="terms-toc-card">
          <div className="terms-toc-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="terms-toc-header-icon">
              <path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h2 className="terms-toc-title">Quick Navigation</h2>
          </div>
          <div className="terms-toc-grid">
            {sections.map((section) => (
              <button
                key={section.id}
                className="terms-toc-btn"
                onClick={() => {
                  document
                    .getElementById("section-" + section.id)
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
              >
                <span className="terms-toc-num">
                  {String(section.id).padStart(2, "0")}
                </span>
                <span className="terms-toc-label">{section.title}</span>
                <span className="terms-toc-arrow">&#8594;</span>
              </button>
            ))}
          </div>
        </div>

        <div className="terms-accordion">
          {sections.map((section, index) => (
            <div
              key={section.id}
              id={"section-" + section.id}
              className="terms-accordion-item"
              style={{ animationDelay: index * 0.07 + "s" }}
            >
              <button
                className={"terms-accordion-header" + (expandedSection === section.id ? " active" : "")}
                onClick={() => toggleSection(section.id)}
              >
                <div className="terms-acc-left">
                  <span className="terms-acc-num">
                    {String(section.id).padStart(2, "0")}
                  </span>
                  <span className="terms-acc-tag">{section.tag}</span>
                  <span className="terms-acc-title">{section.title}</span>
                </div>
                <svg
                  className={"terms-acc-chevron" + (expandedSection === section.id ? " rotated" : "")}
                  width="18" height="18" viewBox="0 0 24 24" fill="none"
                >
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className={"terms-accordion-body" + (expandedSection === section.id ? " open" : "")}>
                <div className="terms-accordion-content">
                  <p>{section.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="terms-alert-card">
          <div className="terms-alert-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18C1.64 18.31 1.55 18.66 1.55 19.01C1.55 19.36 1.64 19.7 1.83 20C2.01 20.3 2.27 20.55 2.58 20.72C2.89 20.89 3.24 20.98 3.59 20.98H20.41C20.76 20.98 21.11 20.89 21.42 20.72C21.73 20.55 21.99 20.3 22.17 20C22.36 19.7 22.45 19.36 22.45 19.01C22.45 18.66 22.36 18.31 22.18 18L13.71 3.86C13.53 3.56 13.27 3.31 12.96 3.14C12.65 2.97 12.3 2.89 11.95 2.91C11.6 2.93 11.26 3.04 10.96 3.23C10.67 3.42 10.43 3.68 10.29 3.86Z" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="terms-alert-body">
            <h3 className="terms-alert-title">Important Notice</h3>
            <p className="terms-alert-text">
              These Terms &amp; Conditions are subject to change at any time. We
              encourage you to review them periodically. Your continued use of
              CryptoHub constitutes your acceptance of any changes. For
              questions, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
