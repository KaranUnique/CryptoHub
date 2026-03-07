import React, { useEffect, useState } from 'react';
import './Legal.css';
import AOS from 'aos';

const CookiePolicy = () => {
    const [activeSection, setActiveSection] = useState('what-are-cookies');

    useEffect(() => {
        window.scrollTo(0, 0);
        AOS.refresh();
    }, []);

    const sections = [
        { id: 'what-are-cookies', label: '1. Definition' },
        { id: 'types', label: '2. Cookie Taxonomy' },
        { id: 'management', label: '3. User Controls' },
        { id: 'consent', label: '4. Persistent Consent' }
    ];

    return (
        <div className="legal-container">
            <div className="legal-glow-1"></div>
            <div className="legal-glow-2"></div>

            <div className="legal-inner">
                <header className="legal-header-full" data-aos="fade-down">
                    <div className="legal-title-group">
                        <h1>Cookie Policy</h1>
                        <p className="legal-meta">Optimizing the Elite Analytics Experience</p>
                    </div>
                    <div className="legal-meta-badge">Updated March 2026</div>
                </header>

                <aside className="legal-sidebar">
                    <h4>Policy Roadmap</h4>
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
                        <section id="what-are-cookies" className="legal-section">
                            <div className="section-title-with-icon">
                                <div className="section-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10"></path></svg>
                                </div>
                                <h2>1. High-Performance Session Persistence</h2>
                            </div>
                            <p>
                                <strong>CryptoHub</strong> utilizes advanced persistent identifiers to maintain your high-speed session states. These small data units ensure that your personalized analytics environment remains intact across device swaps.
                            </p>
                        </section>

                        <section id="types" className="legal-section">
                            <div className="section-title-with-icon">
                                <div className="section-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                                </div>
                                <h2>2. Cookie Taxonomy</h2>
                            </div>
                            <div className="legal-list">
                                <div className="legal-list-item">
                                    <div className="check-icon">✓</div>
                                    <div>
                                        <strong>Core Essentials</strong>
                                        Strictly necessary for secure authentication and API heartbeat tracking.
                                    </div>
                                </div>
                                <div className="legal-list-item">
                                    <div className="check-icon">✓</div>
                                    <div>
                                        <strong>Environmental Preferences</strong>
                                        Capturing your preferred Display Currency, Timezones, and Charting styles.
                                    </div>
                                </div>
                                <div className="legal-list-item">
                                    <div className="check-icon">✓</div>
                                    <div>
                                        <strong>Analytical Metadata</strong>
                                        Anonymous heatmaps that help us optimize low-latency data delivery paths.
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="management" className="legal-section">
                            <div className="section-title-with-icon">
                                <div className="section-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </div>
                                <h2>3. Sovereign User Controls</h2>
                            </div>
                            <p>
                                You have full control over your browser-side data. While you can opt to disable identifiers, doing so will degrade the predictive performance of your AI dashboards.
                            </p>
                            <div className="legal-quote">
                                "Zero Intrusive Tracking: We strictly forbid the use of third-party advertising cookies within the CryptoHub ecosystem."
                            </div>
                        </section>

                        <section id="consent" className="legal-section">
                            <div className="section-title-with-icon">
                                <div className="section-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                                </div>
                                <h2>4. Affirmative Consent</h2>
                            </div>
                            <p>
                                Continued engagement with our real-time protocols implies your affirmative consent to these persistent identifiers. Privacy settings can be reset at any time via browser-level cleared cache events.
                            </p>
                        </section>

                        <div className="legal-footer-note">
                            <p>Want to review your data preferences?</p>
                            <a href="mailto:support@cryptohub.com" className="contact-button">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                                Preference Controller
                            </a>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CookiePolicy;
