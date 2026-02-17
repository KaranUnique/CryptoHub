import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Signup.css";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { notifyError, notifySuccess } from "../utils/notify";

function Signup() {
  const navigate = useNavigate();
  const { signup, currentUser, loginWithGoogle } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
        await signup(formData.email, formData.password, formData.fullName);
        notifySuccess("Account created! Please check your email to verify your account.");
        setTimeout(() => navigate("/verify-email"), 1500);
      } catch (error) {
        console.error("Signup error:", error);

        // Handle Firebase auth errors
        let errorMessage = "Failed to create account. Please try again.";

        if (error.code === "auth/email-already-in-use") {
          errorMessage = "This email is already registered. Please login instead.";
        } else if (error.code === "auth/weak-password") {
          errorMessage = "Password is too weak. Please use a stronger password.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email address.";
        } else if (error.code === "auth/network-request-failed") {
          errorMessage = "Network error. Please check your connection.";
        }

        notifyError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setErrors({});

    try {
      await loginWithGoogle();
      notifySuccess("Signed up successfully with Google");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      console.error("Google signup error:", error);
      let errorMessage = "Failed to sign up with Google. Please try again.";

      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign up cancelled";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection";
      }

      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-orb orb-top-left"></div>
      <div className="auth-orb orb-bottom-right"></div>

      <motion.div
        className="glass-panel auth-card signup-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Join <span className="text-gradient-purple">CryptoHub</span> and start tracking today
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <div className="input-with-icon">
              <FiUser className="input-icon" />
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Ex. John Doe"
                value={formData.fullName}
                onChange={handleChange}
                className={`auth-input ${errors.fullName ? "input-error" : ""}`}
                disabled={loading}
                autoComplete="name"
              />
            </div>
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <FiMail className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Ex. satoshi@bitcoin.org"
                value={formData.email}
                onChange={handleChange}
                className={`auth-input ${errors.email ? "input-error" : ""}`}
                disabled={loading}
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <FiLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className={`auth-input ${errors.password ? "input-error" : ""}`}
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-with-icon">
              <FiLock className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`auth-input ${errors.confirmPassword ? "input-error" : ""}`}
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <div className="terms-checkbox">
            <input type="checkbox" id="terms" required disabled={loading} />
            <label htmlFor="terms">
              I agree to the{" "}
              <Link to="/terms" className="terms-link">Terms of Service</Link>{" "}
              and{" "}
              <Link to="/privacy" className="terms-link">Privacy Policy</Link>
            </label>
          </div>

          <button type="submit" className="btn-neon-purple w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="divider">
            <span>OR REGISTER WITH</span>
          </div>

          <button
            type="button"
            className="google-signin-btn glass-card"
            onClick={handleGoogleSignup}
            disabled={loading}
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="google-icon" />
            Google Account
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link text-gradient-purple">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Signup;