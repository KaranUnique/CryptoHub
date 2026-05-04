import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Feedback.css";

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "general",
    rating: 0,
    message: "",
    anonymous: false,
  });

  const [errors, setErrors] = useState({});
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRating = (value) => {
    setFormData({ ...formData, rating: value });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.message.trim()) {
      newErrors.message = "Feedback message is required";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (formData.rating === 0) {
      newErrors.rating = "Please rate your experience";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);

      setFormData({
        name: "",
        email: "",
        category: "general",
        rating: 0,
        message: "",
        anonymous: false,
      });

      setTimeout(() => setSubmitted(false), 3000);
    }, 1200);
  };

  return (
    <div className="feedback-container">
      <motion.div
        className="feedback-card glass-panel"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="feedback-title">💬 Share Your Feedback</h2>
        <p className="feedback-subtitle">
          Help us improve your crypto experience.
        </p>

        {/* SUCCESS MESSAGE */}
        {submitted && (
          <motion.div
            className="feedback-success"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            🎉 Thank you! Your feedback matters.
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="feedback-form">

          {/* NAME */}
          {!formData.anonymous && (
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
            />
          )}

          {/* EMAIL */}
          {!formData.anonymous && (
            <>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <span className="error">{errors.email}</span>
              )}
            </>
          )}

          {/* ANONYMOUS */}
          <label className="checkbox">
            <input
              type="checkbox"
              name="anonymous"
              checked={formData.anonymous}
              onChange={handleChange}
            />
            Submit anonymously
          </label>

          {/* CATEGORY */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="general">General</option>
            <option value="bug">Bug Report</option>
            <option value="feature">Feature Request</option>
            <option value="ui">UI/UX</option>
          </select>

          {/* RATING */}
          <div className="feedback-rating">
            <span>Rate your experience:</span>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.span
                  key={star}
                  className={`star ${
                    (hoverRating || formData.rating) >= star ? "active" : ""
                  }`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleRating(star)}
                  whileHover={{ scale: 1.3 }}
                >
                  ★
                </motion.span>
              ))}
            </div>
          </div>
          {errors.rating && <span className="error">{errors.rating}</span>}

          {/* MESSAGE */}
          <textarea
            name="message"
            placeholder="Your Feedback *"
            rows="5"
            maxLength="300"
            value={formData.message}
            onChange={handleChange}
          />
          <div className="char-count">
            {formData.message.length}/300
          </div>
          {errors.message && (
            <span className="error">{errors.message}</span>
          )}

          {/* SUBMIT */}
          <motion.button
            type="submit"
            className="feedback-button"
            disabled={loading}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Feedback;