import React from "react";
import "./Blog.css";
import { useNavigate } from "react-router-dom";
import { blogPosts } from "../data/blogData";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Blog() {
  const navigate = useNavigate();

  return (
    <div className="blog-page">
      <div className="glow-spot top-left"></div>

      <div className="blog-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Cosmic <span className="text-gradient-cyan">Insights</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Navigate the blockchain universe with expert guides and news.
        </motion.p>
      </div>

      <div className="blog-grid">
        {blogPosts.map((post, idx) => (
          <motion.div
            key={idx}
            className="blog-card glass-panel p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            onClick={() => navigate(`/blog/${idx}`)}
          >
            <div className="card-top">
              <span className="blog-category">{post.category}</span>
              <span className="blog-date">{post.date}</span>
            </div>

            <h3 className="blog-title-card">{post.title}</h3>
            <p className="blog-excerpt">{post.excerpt}</p>

            <div className="read-more cursor-pointer">
              Read Article <span className="arrow">→</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
