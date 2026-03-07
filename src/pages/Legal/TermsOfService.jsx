import React, { useEffect, useState } from 'react';
import './Legal.css';
import AOS from 'aos';

const TermsOfService = () => {
    const [activeSection, setActiveSection] = useState('acceptance');

    useEffect(() => {
        window.scrollTo(0, 0);
        AOS.refresh();
    }, []);

    const sections = [
        { id: 'acceptance', label: '1. Usage Agreement' },
        { id: 'disclaimer', label: '2. Risk Disclaimer' },
        { id: 'account', label: '3. User Governance' },
        { id: 'billing', label: '4. Commercial Terms' },
        { id: 'liability', label: '5. Liability Framework' }
    ];

    return (
        <div className="legal-container">
            <div className="legal-glow-1"></div>
            <div className="legal-glow-2"></div>

            <div className="legal-inner">
                <header className="legal-header-full" data-aos="fade-down">
                    <div className="legal-title-group">
                        <h1>Terms of Service</h1>
                        <p className="legal-meta">Governing the CryptoHub Elite Ecosystem</p>
                    </div>
                    <div className="legal-meta-badge">Effective March 2026</div>
                </header>

                <aside className="legal-sidebar">
                    <h4>Agreement TOC</h4>
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
                        <section id="acceptance" className="legal-section">
                            <div className="section-title-with-icon">
                                <div className="section-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                </div>
                                <h2>1. Institutional Usage Agreement</h2>
                            </div>
                            <p>
                                By engaging with <strong>CryptoHub</strong>, you enter into a binding legal contract with CryptoHub Analytics Hub. Accessing the platform constitutes your unconditional acceptance of these high-level governance terms.
                            </p>
                        </section>

                        <section id="disclaimer" className="legal-section">
                            <div className="section-title-with-icon">
                                <div className="section-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                </div>
                                <h2>2. Professional Financial Disclaimer</h2>
                            </div>
                            <div className="legal-quote">
                                <strong>STRICT POLICY:</strong> CryptoHub is a pure data analytics provider. We are NOT registered financial advisors. Current trends do not guarantee future performance.
                            </div>
                            <p>
                                All market intelligence, whale alerts, and AI-driven sentiment analysis are strictly for research purposes. You carry 100% liability for any capital deployed based on our data.
                            </p>
                        </section>

                        <section id="account" className="legal-section">
                            <div className="section-title-with-icon">
                                <div className="section-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
                                </div>
                                <h2>3. User Account Governance</h2>
                            </div>
                            <p>
                                To maintain the integrity of our elite trading environment, we enforce strict account rules:
                            </p>
                            <div className="legal-list">
                                <div className="legal-list-item">
                                    <div className="check-icon">✓</div>
                                    <div>
                                        <strong>KYC Maturity</strong>
                                        Users must be 18+ and provide valid institutional or personal verification if requested.
                                    </div>
                                </div>
                                <div className="legal-list-item">
                                    <div className="check-icon">✓</div>
                                    <div>
                                        <strong>Non-Scraping Policy</strong>
                                        Automated data extraction via unauthorized scripts will lead to immediate IP blacklisting.
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="billing" className="legal-section">
                            <div className="section-title-with-icon">
                                <div className="section-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                </div>
                                <h2>4. Commercial Subscriptions</h2>
                            </div>
                            <p>
                                Access to CryptoHub Pro (including predictive AI) is governed by recurring billing cycles. All payments are final unless specified by a 24-hour trial protection period.
                            </p>
                        </section>

                        <section id="liability" className="legal-section">
                            <div className="section-title-with-icon">
                                <div className="section-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                                </div>
                                <h2>5. Limitation of Liability</h2>
                            </div>
                            <p>
                                Under no legal theory shall CryptoHub be liable for system downtime, API latencies from exchange partners, or data inaccuracies during high-volatility market events.
                            </p>
                        </section>

                        <div className="legal-footer-note">
                            <p>Have legal inquiries or compliance requests?</p>
                            <a href="mailto:legal@cryptohub.com" className="contact-button">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                Legal Counsel Access
                            </a>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TermsOfService;
