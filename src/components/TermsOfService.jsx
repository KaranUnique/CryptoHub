import React from "react";
import "./TermsOfService.css";

const TermsOfService = () => {
  return (
    <div className="terms-wrapper">
      <div className="terms-card">
        <h1 className="main-title">Terms of Service</h1>
        <p className="last-updated">Last updated: January 2026</p>

        {[
          {
            title: "1. Introduction",
            content:
              "Welcome to CryptoHub. By accessing or using our website and services, you agree to follow these Terms of Service. Please read them carefully.",
          },
          {
            title: "2. Use of Our Services",
            content: (
              <ul>
                <li>You must be at least 18 years old to use our platform.</li>
                <li>You agree to provide accurate information.</li>
                <li>You are responsible for keeping login credentials secure.</li>
                <li>You agree not to misuse or harm the platform.</li>
              </ul>
            ),
          },
          {
            title: "3. Account Responsibilities",
            content:
              "You are fully responsible for all activities under your account. If you notice unauthorized access, contact us immediately.",
          },
          {
            title: "4. Intellectual Property",
            content:
              "All content including logos, text, graphics, and design belongs to CryptoHub and is protected by copyright laws.",
          },
          {
            title: "5. Payments and Subscriptions",
            content:
              "If you purchase premium services, you agree to pay the listed fees. Payments are non-refundable unless stated otherwise.",
          },
          {
            title: "6. Limitation of Liability",
            content:
              "CryptoHub provides cryptocurrency information for educational purposes only. We are not responsible for financial losses.",
          },
          {
            title: "7. Termination",
            content:
              "We reserve the right to suspend or terminate accounts that violate these terms.",
          },
          {
            title: "8. Changes to Terms",
            content:
              "We may update these Terms anytime. Continued use means you accept updated terms.",
          },
          {
            title: "9. Contact Us",
            content: (
              <>
                If you have questions, contact us at:
                <p className="email">support@cryptohub.com</p>
              </>
            ),
          },
        ].map((section, index) => (
          <div key={index} className="terms-section">
            <h2>{section.title}</h2>
            <div className="section-content">{section.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsOfService;
