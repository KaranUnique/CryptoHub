import React from "react";
import "../styles/dashboard-theme.css";
import "./Home/Home.css"

const TermsConditions = () => {
  return (
    <div className="main-card p-8 mx-auto my-12 max-w-5xl bg-card-bg shadow-lg rounded-xl">
      <h1 className="text-4xl font-bold text-primary mb-6">Terms & Conditions</h1>

      <div className="space-y-8 text-sm leading-relaxed">

        <section>
          <h2 className="text-xl font-semibold text-secondary">1. Acceptance of Terms</h2>
          <p>
            By accessing or using CryptoHub, you agree to be legally bound by
            these Terms. If you do not agree, you must not use the website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">2. Platform Purpose</h2>
          <p>
            CryptoHub provides cryptocurrency market information, charts, and
            analytics. It does NOT provide financial, legal, or investment advice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">3. User Responsibilities</h2>
          <p>
            You agree not to:
            <br />• Use CryptoHub for illegal activity
            <br />• Attempt to hack, scrape, or overload servers
            <br />• Use data for misleading or fraudulent trading
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">4. Crypto Market Risk Disclaimer</h2>
          <p>
            Cryptocurrency prices are extremely volatile. CryptoHub is not
            responsible for any financial losses resulting from reliance on
            displayed data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">5. Third-Party Data</h2>
          <p>
            CryptoHub displays data from third-party APIs. We do not guarantee
            accuracy, uptime, or correctness of this data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">6. Intellectual Property</h2>
          <p>
            All code, UI, logos, branding, and designs are owned by CryptoHub.
            You may not copy, resell, or redistribute without permission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">7. Limitation of Liability</h2>
          <p>
            CryptoHub is provided “as-is”. We are not liable for financial loss,
            trading errors, downtime, or API failures.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary">8. Modifications</h2>
          <p>
            We may modify these Terms at any time. Continued use after changes
            means you accept them.
          </p>
        </section>

        <p className="italic text-xs text-muted">Effective date: January 2026</p>
      </div>
    </div>
  );
};

export default TermsConditions;
