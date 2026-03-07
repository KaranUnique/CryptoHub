import React, { useEffect, useState } from 'react';
import './Legal.css';
import AOS from 'aos';

const PrivacyPolicy = () => {
    const [activeSection, setActiveSection] = useState('data-collection');

    useEffect(() => {
        window.scrollTo(0, 0);
        AOS.refresh();
    }, []);

    const sections = [
        { id: 'data-collection', label: '1. Data Collection' },
        { id: 'usage', label: '2. Usage & Persona' },
        { id: 'security', label: '3. Security Protocol' },
        { id: 'third-party', label: '4. Third Party Partners' },
        { id: 'rights', label: '5. Your Rights' }
    ];

    return (
        <div className="legal-container">
            <div className="legal-glow-1"></div>
            <div className="legal-glow-2"></div>

            <div className="legal-inner">
                <header className="legal-header-full" data-aos="fade-down">
                    <div className="legal-title-group">
                        <h1>Privacy Policy</h1>
                        <p className="legal-meta">Institutional Grade Data Protection</p>
                    </div>
                    <div className="legal-meta-badge">v2.4 • Updated March 2026</div>
                </header>

                <aside className="legal-sidebar">
                    <h4>Document Sections</h4>
                    <nav className="sidebar-nav">
                        {sections.map(section => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className={`sidebar-link ${activeSection === section.id ? 'active' : ''}`}
                                onClick={() => setActiveSection(section.id)}
                            >
                                {section.label}
                            </a>
                        ))}
                    </nav>
                </aside>

                <main className="legal-main-content" data-aos="fade-up">
                    <div className="legal-body">
                        <section id="data-collection" className="legal-section">
                            <div className="section-title-with-icon">
                                <div className="section-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                </div>
                                <h2>1. Data Collection Strategy</h2>
                            </div>
                            <p>
                                At <strong>CryptoHub</strong>, we operate with a strict "Minimal Data Footprint" policy. We only collect essential metadata required to power your real-time tracking experience.
                            </p>
                            <div className="legal-list">
                                <div className="legal-list-item">
                                    <div className="check-icon">✓</div>
                                    <div>
                                        <strong>Identity Authentication</strong>
                                        Email and authentication tokens secured via Tier-1 providers.
                                    </div>
                                </div>
                                <div className="legal-list-item">
                                    <div className="check-icon">✓</div>
                                    <div>
                                        <strong>Portfolio Metadata</strong>
                                        Public wallet addresses for real-time net-worth calculation.
                                    </div>
                                </div>
                                <div className="legal-list-item">
                                    <div className="check-icon">✓</div>
                                    <div>
                                        <strong>Preference Tracking</strong>
                                        Non-sensitive settings (Currency, Theme, Watchlists) for UI session persistence.
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="usage" className="legal-section">
                            <div className="section-title-with-icon">
                                <div className="section-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                </div>
                                <h2>2. Information Lifecycle</h2>
                            </div>
                            <p>
                                Collected data powers our proprietary AI models, providing you with high-precision market alerts and sentiment scores.
                            </p>
                            <div className="legal-quote">
                                "Our revenue model is based on premium features, not data harvesting. Your financial privacy is 100% non-negotiable."
                            </div>
                        </section>

                        <section id="security" className="legal-section">
                            <div className="section-title-with-icon">
                                <div className="section-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                </div>
                                <h2>3. Security Protocol</h2>
                            </div>
                            <p>
                                We utilize military-grade <strong>AES-256 encryption</strong> for all stored data. Our infrastructure is hosted on ISO 27001 certified data centers with 24/7 proactive threat monitoring.
                            </p>
                        </section>

                        <section id="third-party" className="legal-section">
                            <div className="section-title-with-icon">
                                <div className="section-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                </div>
                                <h2>4. Institutional Partners</h2>
                            </div>
                            <p>
                                We partner exclusively with top-tier financial data providers (CoinGecko, Binance) and secure authentication handlers (Firebase). No data is shared with third-party advertisers.
                            </p>
                        </section>

                        <section id="rights" className="legal-section">
                            <div className="section-title-with-icon">
                                <div className="section-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                </div>
                                <h2>5. Sovereign Data Rights</h2>
                            </div>
                            <p>
                                You retain full ownership of your data. You may download your entire profile or request immediate, permanent deletion of all account data with a single request.
                            </p>
                        </section>

                        <div className="legal-footer-note">
                            <p>Need specialized privacy assistance?</p>
                            <a href="mailto:privacy@cryptohub.com" className="contact-button">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                Contact Privacy Team
                            </a>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
