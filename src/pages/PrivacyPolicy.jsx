import React from "react";
import {
  Shield,
  Database,
  Cookie,
  Share2,
  Lock,
  Clock,
  Users,
  FileText,
} from "lucide-react";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      items: [
        "Non-personal data (browser type, device, IP address, pages visited)",
        "Voluntarily provided data (email, user preferences)",
        "Analytics data from your interactions with our platform",
      ],
    },
    {
      icon: Share2,
      title: "How Your Data Is Used",
      items: [
        "Operate and maintain CryptoHub",
        "Improve UI, performance, and security",
        "Analyze crypto-market interest and usage trends",
        "Provide notifications and personalized updates",
      ],
    },
    {
      icon: Cookie,
      title: "Cookies & Tracking",
      items: [
        "Remember user preferences and settings",
        "Speed up application performance",
        "Analyze traffic patterns and user behavior",
        "Never contain sensitive personal information",
      ],
    },
    {
      icon: Share2,
      title: "Third-Party Services",
      items: [
        "Integration with CoinGecko APIs for cryptocurrency data",
        "Third-party providers may collect their own analytics data",
        "We do not sell or trade your personal information",
        "Third-party services bound by their privacy policies",
      ],
    },
    {
      icon: Lock,
      title: "Data Security",
      items: [
        "Industry-standard encryption protocols",
        "Secure data transmission and storage",
        "Regular security audits and updates",
        "No internet transmission is 100% secure",
      ],
    },
    {
      icon: Clock,
      title: "Data Retention",
      items: [
        "Data retained only as long as necessary",
        "Regular cleanup of analytical data",
        "Compliance with legal requirements",
        "Platform improvement and service optimization",
      ],
    },
    {
      icon: Users,
      title: "Your Rights",
      items: [
        "Right to request data deletion",
        "Right to access your personal information",
        "Right to correct inaccurate data",
        "Right to review how your data is used",
      ],
    },
    {
      icon: FileText,
      title: "Changes to This Policy",
      items: [
        "We may update this policy at any time",
        "Continued use indicates acceptance of changes",
        "Major updates will be communicated to users",
        "Check back regularly for the latest version",
      ],
    },
  ];

  return (
    <div className="privacy-policy-wrapper">
      {/* Header Section */}
      <div className="privacy-header-section">
        <div className="privacy-header-content">
          <div className="privacy-header-icon">
            <Shield className="w-16 h-16" />
          </div>
          <h1 className="privacy-main-title">Privacy Policy</h1>
          <p className="privacy-last-updated">Last updated: January 2026</p>
          <p className="privacy-intro-text">
            CryptoHub is committed to protecting your privacy. This Privacy
            Policy explains how we collect, use, store, and protect your data
            when you use our platform. By using CryptoHub, you agree to the
            practices described in this policy.
          </p>
        </div>
      </div>

      {/* Intro Cards */}
      <div className="privacy-intro-cards">
        <div className="intro-card">
          <div className="intro-card-icon">
            <Shield className="w-8 h-8" />
          </div>
          <h3>Your Privacy Matters</h3>
          <p>We prioritize your data security and privacy above all else</p>
        </div>
        <div className="intro-card">
          <div className="intro-card-icon">
            <Lock className="w-8 h-8" />
          </div>
          <h3>Secure & Encrypted</h3>
          <p>Industry-standard encryption for all your information</p>
        </div>
        <div className="intro-card">
          <div className="intro-card-icon">
            <Users className="w-8 h-8" />
          </div>
          <h3>Your Control</h3>
          <p>You have full control over your data and its usage</p>
        </div>
      </div>

      {/* Main Sections */}
      <div className="privacy-sections-grid">
        {sections.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <div key={index} className="privacy-card">
              <div className="privacy-card-header">
                <div className="privacy-card-icon">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h2 className="privacy-card-title">{section.title}</h2>
              </div>

              <div className="privacy-card-content">
                <ul className="privacy-items-list">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="privacy-item">
                      <span className="privacy-bullet">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Section */}
      <div className="privacy-footer-section">
        <div className="privacy-footer-content">
          <h2>Questions About Our Privacy Policy?</h2>
          <p>
            If you have any questions, concerns, or requests regarding this
            Privacy Policy, please contact us.
          </p>
          <div className="privacy-contact-info">
            <p>
              <strong>Email:</strong> privacy@cryptohub.com
            </p>
            <p>
              <strong>Website:</strong> https://crypto-hub-rosy.vercel.app/
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
