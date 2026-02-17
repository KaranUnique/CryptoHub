import React, { useState } from "react";
import "./Feedback.css"; // reuse existing theme styling

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.message.trim()) return;

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
  <div className="feedback-container">
    <div className="feedback-card">
      <h2 className="feedback-title">Share Your Feedback</h2>

      {submitted && (
        <div className="feedback-success">
          ✅ Thank you! Your feedback has been submitted.
        </div>
      )}

      <form onSubmit={handleSubmit} className="feedback-form">
        <input
          type="text"
          name="name"
          placeholder="Your Name (Optional)"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email (Optional)"
          value={formData.email}
          onChange={handleChange}
        />

        <textarea
          name="message"
          placeholder="Your Feedback *"
          required
          rows="5"
          value={formData.message}
          onChange={handleChange}
        />

        <button type="submit" className="feedback-button">
          Submit Feedback
        </button>
      </form>
    </div>
  </div>
);
};

export default Feedback;
