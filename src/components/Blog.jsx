import React, { useState } from "react";
import "./Blog.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { generateBlogPosts } from "../data/blogData";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Blog() {
  const navigate = useNavigate();
  const blogPosts = generateBlogPosts();
  const featuredPosts = blogPosts.filter(post => post.isFeatured);
  const regularPosts = blogPosts.filter(post => !post.isFeatured);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  // Calculate current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = regularPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(regularPosts.length / postsPerPage);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    const section = document.querySelector('.all-posts-section');
    if (section) {
      window.scrollTo({ top: section.offsetTop - 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="blog-page glassnode-style">
      <div className="blog-container">

        {/* Hero Section - Glassnode Inspired */}
        <section className="glassnode-hero">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="hero-badge">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#4559DC" strokeWidth="2" />
                <path d="M5 8L7 10L11 6" stroke="#4559DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>On-Chain Market Intelligence</span>
            </div>
            <h1 className="hero-title">
              Professional-Grade <span className="gradient-text">Insights</span>
            </h1>
            <p className="hero-subtitle">
              Your portal to contextualised market analysis, and cutting edge research
              for Bitcoin, Ethereum, DeFi and more. Access premium on-chain data and institutional-grade analysis.
            </p>
          </motion.div>
        </section>

        {/* Featured Reports */}
        <div className="featured-section">
          <h2 className="section-title">
            <svg width="20" height="20" viewBox="0 0 16 17" fill="none">
              <path d="M4.49365 4.58752C3.53115 6.03752 2.74365 7.70002 2.74365 9.25002C2.74365 10.6424 3.29678 11.9778 4.28134 12.9623C5.26591 13.9469 6.60127 14.5 7.99365 14.5C9.38604 14.5 10.7214 13.9469 11.706 12.9623C12.6905 11.9778 13.2437 10.6424 13.2437 9.25002C13.2437 6.00002 10.9937 3.50002 9.16865 1.68127L6.99365 6.25002L4.49365 4.58752Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Featured Reports
          </h2>

          <div className="featured-grid">
            {featuredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                className="featured-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.4 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                onClick={() => navigate(`/blog/${post.id}`, { state: { post } })}
              >
                <div className="card-image-container">
                  <div className="image-gradient-overlay" style={{ background: post.gradient }}></div>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="card-image"
                    loading="lazy"
                  />

                  <div className="image-badge" style={{ background: post.badgeColor }}>
                    {post.tag}
                  </div>
                </div>

                <div className="card-content">
                  <div className="card-header">
                    <span className="category-badge">{post.category}</span>
                    <div className="tag-indicator">
                      {post.tag === "Premium" ? (
                        <div className="premium-indicator">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <circle cx="6" cy="6" r="5" fill={post.badgeColor} stroke="white" strokeWidth="1" />
                            <path d="M3.5 6L5 7.5L8.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Premium
                        </div>
                      ) : (
                        <div className="free-indicator">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <circle cx="6" cy="6" r="5" fill={post.badgeColor} stroke="white" strokeWidth="1" />
                            <path d="M8 6H4M6 4V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                          Free
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="card-title">{post.title}</h3>
                  <p className="card-excerpt">{post.excerpt}</p>

                  <div className="card-footer">
                    <div className="meta-info">
                      <span className="date">{post.date}</span>
                      <span className="divider">•</span>
                      <span className="read-time">{post.readTime}</span>
                    </div>

                    <button className="read-btn">
                      Read
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3.5 8H12.5M12.5 8L9 4.5M12.5 8L9 11.5"
                          stroke="currentColor" strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* All Posts Grid */}
        <div className="all-posts-section">
          <div className="section-header">
            <h2>Latest Research & Analysis</h2>
            <p className="section-subtitle">Comprehensive reports and insights</p>
          </div>

          <div className="posts-grid">
            {currentPosts.map((post, index) => (
              <motion.article
                key={post.id}
                className="post-card"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: (index % 12) * 0.05, duration: 0.3 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                onClick={() => navigate(`/blog/${post.id}`, { state: { post } })}
              >
                <div className="post-image-container">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="post-image"
                    loading="lazy"
                  />
                  <div className="post-badge" style={{ background: post.badgeColor }}>
                    {post.tag}
                  </div>
                </div>

                <div className="post-content">
                  <div className="post-header">
                    <span className="post-category">{post.category}</span>
                    <span className="post-date">{post.date}</span>
                  </div>

                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-excerpt">{post.excerpt}</p>

                  <div className="post-footer">
                    <span className="post-read-time">{post.readTime}</span>
                    <div className="post-read-more">
                      Read Article
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 7H13M13 7L9 3M13 7L9 11"
                          stroke="currentColor" strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <button
                className="pagination-btn"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FiChevronLeft /> Previous
              </button>

              <div className="pagination-numbers">
                {totalPages <= 5 ? (
                  Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => paginate(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))
                ) : (
                  (() => {
                    const pages = [];
                    if (currentPage <= 3) {
                      for (let i = 1; i <= 5; i++) pages.push(i);
                    } else if (currentPage >= totalPages - 2) {
                      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
                    } else {
                      for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
                    }
                    return pages.map(pageNum => (
                      <button
                        key={pageNum}
                        className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => paginate(pageNum)}
                      >
                        {pageNum}
                      </button>
                    ));
                  })()
                )}
              </div>

              <button
                className="pagination-btn"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next <FiChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
