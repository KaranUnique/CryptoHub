import React, { useState } from "react";
import "./Feedback.css";

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "general",
    rating: 0,
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRating = (value) => {
    setFormData({ ...formData, rating: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.message.trim()) return;

    setLoading(true);

    // simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);

      setFormData({
        name: "",
        email: "",
        category: "general",
        rating: 0,
        message: "",
      });
    }, 1200);
  };

  return (
    <div className="feedback-container">
      <div className="feedback-card">
        <h2 className="feedback-title">💬 Share Your Feedback</h2>
        <p className="feedback-subtitle">
          Help us improve CryptoHub with your valuable feedback.
        </p>

        {submitted && (
          <div className="feedback-success">
            🎉 Thanks! Your feedback helps us improve.
          </div>
        )}

        <form onSubmit={handleSubmit} className="feedback-form">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Your Name (Optional)"
            value={formData.name}
            onChange={handleChange}
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Your Email (Optional)"
            value={formData.email}
            onChange={handleChange}
          />

          {/* Category */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="feedback-select"
          >
            <option value="general">General Feedback</option>
            <option value="bug">Report a Bug</option>
            <option value="feature">Feature Request</option>
            <option value="ui">UI/UX Suggestion</option>
          </select>

          {/* Rating */}
          <div className="feedback-rating">
            <span>Rate your experience:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${
                  formData.rating >= star ? "active" : ""
                }`}
                onClick={() => handleRating(star)}
              >
                ★
              </span>
            ))}
          </div>

          {/* Message */}
          <textarea
            name="message"
            placeholder="Your Feedback *"
            required
            rows="5"
            value={formData.message}
            onChange={handleChange}
          />

          {/* Submit */}
          <button
            type="submit"
            className="feedback-button"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;