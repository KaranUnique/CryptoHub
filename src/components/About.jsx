import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-section fade-in">
      
      <h1 className="about-title-underline">About CryptoHub</h1>

      <p className="about-intro">
        CryptoHub is a comprehensive platform designed to provide users with
        real-time cryptocurrency market data, insightful analytics, and
        educational resources. Our goal is to empower both beginners and
        experienced traders with reliable tools to make informed decisions
        in the fast-moving digital asset ecosystem.
      </p>

      <h2 className="about-title-underline">Our Mission</h2>
      <p className="about-intro">
        Our mission is to simplify crypto market analysis by combining
        real-time data, intuitive design, and powerful visualization tools.
        We strive to make cryptocurrency accessible, transparent, and
        user-friendly for everyone.
      </p>

      <h2 className="about-title-underline">Key Features</h2>
      <div className="about-features-grid">
        <div className="about-feature-card">
          <span className="about-feature-icon">💹</span>
          Live cryptocurrency prices and market overviews
        </div>

        <div className="about-feature-card">
          <span className="about-feature-icon">📈</span>
          Interactive charts and advanced analytics
        </div>

        <div className="about-feature-card">
          <span className="about-feature-icon">📰</span>
          Latest crypto news and updates
        </div>

        <div className="about-feature-card">
          <span className="about-feature-icon">📚</span>
          Educational blogs and learning resources
        </div>

        <div className="about-feature-card">
          <span className="about-feature-icon">🏆</span>
          Leaderboard and community engagement tools
        </div>

        <div className="about-feature-card">
          <span className="about-feature-icon">🔒</span>
          Secure authentication and user management
        </div>
      </div>

      <h2 className="about-title-underline">Open Source & Community</h2>
      <p className="about-intro">
        CryptoHub is proudly open-source and welcomes contributors worldwide.
        We believe in collaboration, transparency, and continuous improvement.
        Community contributions help us evolve the platform and build a
        stronger crypto ecosystem together.
      </p>

      <h2 className="about-title-underline">Our Vision</h2>
      <p className="about-intro">
        We envision CryptoHub as a trusted, all-in-one crypto intelligence
        platform that bridges the gap between data complexity and user clarity.
        Whether you're just starting your crypto journey or actively trading,
        CryptoHub is built to support your growth.
      </p>

    </div>
  );
};

export default About;
