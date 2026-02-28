import React from "react";
import "../styles/dashboard-theme.css"
import "./Home/Home.css"

const PrivacyPolicy = () => {
  return (
    <div className="main-card p-8 mx-auto my-12 max-w-5xl bg-card-bg shadow-lg rounded-xl">
      <h1 className="text-4xl font-bold text-primary mb-6">Privacy Policy</h1>

      <p className="text-base mb-6">
        CryptoHub ("we", "our", "us") operates the website
        https://crypto-hub-rosy.vercel.app/. This Privacy Policy explains how
        we collect, use, store, and protect your data when you use our platform.
        By using CryptoHub, you agree to the practices described in this policy.
      </p>

      <div className="space-y-8 text-sm leading-relaxed">

        <section>
          <h2 className="text-xl font-semibold text-secondary">1. Information We Collect</h2>
          <p>
            We collect two types of data:
            <br />• <strong>Non-personal data</strong> such as browser type, device,
            IP address, pages visited, and time spent on the site.
            <br />• <strong>Voluntarily provided data</strong> such as email address
            (if you sign up for alerts or newsletters in future versions).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">2. How Your Data Is Used</h2>
          <p>
            We use your data to:
            <br />• Operate and maintain CryptoHub
            <br />• Improve UI, performance, and security
            <br />• Analyze crypto-market interest and usage trends
            <br />• Provide optional notifications and updates
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">3. Cookies & Tracking</h2>
          <p>
            CryptoHub may use cookies, local storage, or analytics tools to
            remember user preferences, speed up the app, and analyze traffic.
            These never contain sensitive personal data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">4. Third-Party Services</h2>
          <p>
            CryptoHub uses third-party APIs (such as CoinGecko) to display
            cryptocurrency prices, charts, and market data. These providers may
            collect their own analytics data according to their privacy policies.
            We do not sell or trade your personal information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">5. Data Security</h2>
          <p>
            We use industry-standard security practices to protect your data.
            However, no internet transmission is 100% secure. You use CryptoHub
            at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">6. Data Retention</h2>
          <p>
            We retain data only as long as needed for analytics, legal
            compliance, or platform improvement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">7. User Rights</h2>
          <p>
            You have the right to request deletion, correction, or review of any
            personal data that we may hold.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">8. Changes to This Policy</h2>
          <p>
            We may update this policy at any time. Continued use of CryptoHub
            after updates indicates acceptance.
          </p>
        </section>

        <p className="italic text-xs text-muted">Last updated: January 2026</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
