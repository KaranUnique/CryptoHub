import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ForgotPassword.css";
import { motion } from "framer-motion";
import { FiMail, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { notifyError, notifySuccess } from "../utils/notify";

function ForgotPassword() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({});
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      setErrors({});

      try {
        await resetPassword(email);
        setEmailSent(true);
        notifySuccess("Password reset email sent! Check your inbox.");
        
        // Redirect to login after 5 seconds
        setTimeout(() => navigate("/login"), 5000);
      } catch (error) {
        console.error("Password reset error:", error);

        let errorMessage = "Failed to send reset email. Please try again.";

        if (error.code === "auth/user-not-found") {
          // For security, we still show success message even if user not found
          setEmailSent(true);
          notifySuccess("If an account exists with this email, a reset link has been sent.");
          setTimeout(() => navigate("/login"), 5000);
          return;
        } else if (error.code === "auth/too-many-requests") {
          errorMessage = "Too many requests. Please try again later.";
        } else if (error.code === "auth/network-request-failed") {
          errorMessage = "Network error. Please check your connection.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email address.";
        }

        notifyError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-container">
      {/* Background Orbs */}
      <div className="auth-orb orb-top-left"></div>
      <div className="auth-orb orb-bottom-right"></div>

      <motion.div
        className="glass-panel auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {!emailSent ? (
          <>
            <div className="auth-header">
              <h1 className="auth-title">Forgot Password?</h1>
              <p className="auth-subtitle">
                No worries! Enter your email and we'll send you reset instructions.
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-with-icon">
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Ex. satoshi@bitcoin.org"
                    value={email}
                    onChange={handleChange}
                    className={`auth-input ${errors.email ? "input-error" : ""}`}
                    disabled={loading}
                    autoComplete="email"
                    autoFocus
                  />
                </div>
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <button type="submit" className="btn-neon w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <div className="back-to-login">
                <Link to="/login" className="back-link">
                  <FiArrowLeft />
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          </>
        ) : (
          <div className="success-state">
            <div className="success-icon">
              <FiCheckCircle />
            </div>
            <h2 className="success-title">Check Your Email</h2>
            <p className="success-message">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            <p className="success-note">
              Didn't receive the email? Check your spam folder or{" "}
              <button
                onClick={() => setEmailSent(false)}
                className="resend-link"
              >
                try again
              </button>
            </p>
            <div className="redirect-message">
              Redirecting to login in 5 seconds...
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
