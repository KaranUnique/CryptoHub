"use client";

import React from "react";
import { motion } from "framer-motion";
import "./CookiePolicy.css";

const sections = [
  {
    title: "1. What Are Cookies?",
    content:
      "Cookies are small text files stored on your device when you visit a website. They help improve your browsing experience by remembering preferences and providing better functionality.",
  },
  {
    title: "2. How We Use Cookies",
    list: [
      "To remember user preferences",
      "To improve website performance",
      "To analyze traffic and usage patterns",
      "To enhance security",
    ],
  },
  {
    title: "3. Types of Cookies We Use",
    list: [
      "Essential Cookies – Required for basic functionality.",
      "Analytics Cookies – Help us understand user behavior.",
      "Performance Cookies – Improve speed and performance.",
    ],
  },
  {
    title: "4. Managing Cookies",
    content:
      "You can control or disable cookies through your browser settings. However, disabling cookies may affect certain features of the website.",
  },
  {
    title: "5. Contact Us",
    content:
      "If you have questions about our Cookie Policy, please contact us at support@cryptohub.com.",
  },
];

const CookiePolicy = () => {
  return (
    <div className="cookie-wrapper">
      <motion.div
        className="main-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header Card */}
        <div className="header-card">
          <h1>🍪 Cookie Policy</h1>
          <p>Last Updated: January 2026</p>
        </div>

        {/* Section Cards */}
        <div className="sections">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              className="section-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <h2>{section.title}</h2>

              {section.content && <p>{section.content}</p>}

              {section.list && (
                <ul>
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CookiePolicy;
