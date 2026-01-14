// BlogDetail.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './BlogDetail.css';

export default function BlogDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { post } = location.state || {};

  if (!post) {
    return (
      <div className="blog-detail-container">
        <div className="not-found">
          <h2>Article not found</h2>
          <button onClick={() => navigate('/blog')}>Back to Blog</button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="blog-detail-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <header className="article-header">
        <button className="back-button" onClick={() => navigate('/blog')}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 10H5M5 10L8.33333 6.66667M5 10L8.33333 13.3333" 
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Insights
        </button>
        
        <div className="article-badges">
          <span className="article-category" style={{ backgroundColor: post.badgeColor + '20', color: post.badgeColor }}>
            {post.category}
          </span>
          <span className="article-tag">
            {post.tag}
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <div className="article-hero">
        <motion.div 
          className="hero-image-container"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img src={post.image} alt={post.title} className="hero-image" />
          <div className="image-overlay" style={{ background: post.gradient }}></div>
        </motion.div>
        
        <div className="hero-content">
          <h1 className="article-title">{post.title}</h1>
          <p className="article-subtitle">{post.excerpt}</p>
          
          <div className="article-meta">
            <div className="meta-item">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 4.5V8.5L10 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>{post.readTime}</span>
            </div>
            <div className="meta-item">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2.5" y="2.5" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M5.5 1.5V3.5M10.5 1.5V3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2.5 6H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>{post.date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="article-content">
        {post.content ? (
          <>
            {/* Table of Contents */}
            <div className="table-of-contents">
              <h3>Table of Contents</h3>
              <ul>
                {post.content.toc.map((item, index) => (
                  <li key={index}>
                    <a href={`#section-${index}`}>{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sections */}
            <div className="article-sections">
              {post.content.sections.map((section, index) => (
                <motion.section 
                  key={index}
                  id={`section-${index}`}
                  className="article-section"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h2>{section.heading}</h2>
                  <p>{section.text}</p>
                  
                  {/* Example chart/visualization placeholder */}
                  <div className="section-visualization">
                    <div className="visualization-placeholder">
                      <svg width="100%" height="200" viewBox="0 0 400 200" fill="none">
                        <path d="M20,180 L80,120 L140,160 L200,100 L260,140 L320,80 L380,120" 
                          stroke={post.badgeColor} strokeWidth="3" strokeLinecap="round" fill="none"/>
                        <path d="M20,180 L80,120 L140,160 L200,100 L260,140 L320,80 L380,120" 
                          stroke={`url(#gradient-${post.id})`} strokeWidth="2" strokeLinecap="round" fill="none"/>
                        <defs>
                          <linearGradient id={`gradient-${post.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={post.badgeColor} stopOpacity="0.8"/>
                            <stop offset="100%" stopColor={post.badgeColor} stopOpacity="0.2"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <p className="visualization-caption">Figure {index + 1}: {section.heading} data visualization</p>
                  </div>
                </motion.section>
              ))}
            </div>
          </>
        ) : (
          <div className="coming-soon">
            <h3>Full article content coming soon</h3>
            <p>We're preparing the detailed analysis and visualizations for this report.</p>
          </div>
        )}

        {/* Related Articles */}
        <div className="related-articles">
          <h3>Related Insights</h3>
          <div className="related-grid">
          </div>
        </div>
      </div>
    </motion.div>
  );
}