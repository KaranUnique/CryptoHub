"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const sections = [
  {
    id: "cookies",
    title: "What Are Cookies?",
    content:
      "Cookies are small text files stored on your device when you visit a website. They help improve your browsing experience by remembering preferences and providing better functionality.",
  },
  {
    id: "usage",
    title: "How We Use Cookies",
    list: [
      "Remember user preferences",
      "Improve website performance",
      "Analyze traffic and usage patterns",
      "Enhance website security",
    ],
  },
  {
    id: "types",
    title: "Types of Cookies We Use",
    list: [
      "Essential Cookies – Required for core functionality.",
      "Analytics Cookies – Help us understand user behavior.",
      "Performance Cookies – Improve speed and responsiveness.",
    ],
  },
  {
    id: "manage",
    title: "Managing Cookies",
    content:
      "You can control or disable cookies through your browser settings. However, disabling cookies may affect certain features of the website.",
  },
  {
    id: "contact",
    title: "Contact Us",
    content:
      "If you have questions about our Cookie Policy, please contact us at support@cryptohub.com.",
  },
];

const CookiePolicy = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-slate-950 text-gray-200 min-h-screen relative">

      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-50 transition-all duration-200"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Hero Section */}
      <div className="relative py-24 px-6 text-center bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold text-white mb-6"
        >
          🍪 Cookie Policy
        </motion.h1>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Transparency matters. This policy explains how we use cookies to
          enhance your experience and protect your privacy.
        </p>

        <p className="text-sm text-gray-500 mt-4">
          Last Updated: January 2026
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Sidebar Navigation */}
        <div className="md:col-span-1">
          <div className="sticky top-24 space-y-4 border-l border-white/10 pl-6">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="group relative block text-gray-400 hover:text-white transition duration-300"
              >
                <span className="absolute -left-6 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top rounded-full"></span>

                <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">
                  {section.title}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="md:col-span-3 space-y-16">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-xl transition-all duration-300 hover:border-purple-500/40 hover:shadow-purple-500/10"
            >
              <h2 className="text-3xl font-semibold text-white mb-6">
                {index + 1}. {section.title}
              </h2>

              {section.content && (
                <p className="text-gray-300 leading-relaxed">
                  {section.content}
                </p>
              )}

              {section.list && (
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                  {section.list.map((item, i) => (
                    <li
                      key={i}
                      className="hover:text-purple-300 transition-colors duration-200"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-10 border-t border-white/10 text-gray-500 text-sm">
        © 2026 CryptoHub. All rights reserved.
      </div>
    </div>
  );
};

export default CookiePolicy;