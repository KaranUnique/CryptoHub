import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { notifyError, notifySuccess } from "../utils/notify";

function Login() {
  const navigate = useNavigate();
  const { login, currentUser, loginWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
        const userCredential = await login(formData.email, formData.password);
        const user = userCredential.user;

        // Check if email is verified
        if (!user.emailVerified) {
          notifyInfo("Please verify your email address to continue.");
          setTimeout(() => navigate("/verify-email"), 1500);
          return;
        }

        notifySuccess("Logged in successfully");
        setTimeout(() => navigate("/dashboard"), 1500);
      } catch (error) {
        console.error("Login error:", error);

        let errorMessage = "Failed to login. Please try again.";

        if (error.code === "auth/invalid-credential") {
          errorMessage = "Invalid email or password";
        } else if (error.code === "auth/user-not-found") {
          errorMessage = "No account found with this email";
        } else if (error.code === "auth/wrong-password") {
          errorMessage = "Incorrect password";
        } else if (error.code === "auth/too-many-requests") {
          errorMessage = "Too many failed attempts. Please try again later";
        } else if (error.code === "auth/network-request-failed") {
          errorMessage = "Network error. Please check your connection";
        }

        notifyError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrors({});

    try {
      await loginWithGoogle();
      notifySuccess("Logged in successfully with Google");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      console.error("Google login error:", error);
      let errorMessage = "Failed to login with Google. Please try again.";

      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Login cancelled";
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
      {/* Background Orbs */}
      <div className="auth-orb orb-top-left"></div>
      <div className="auth-orb orb-bottom-right"></div>

      <motion.div
        className="glass-panel auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Access your <span className="text-gradient-cyan">CryptoHub</span> Dashboard
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
                value={formData.email}
                onChange={handleChange}
                className={`auth-input ${errors.email ? "input-error" : ""}`}
                disabled={loading}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <FiLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={`auth-input ${errors.password ? "input-error" : ""}`}
                disabled={loading}
                autoComplete="current-password"
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
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" disabled={loading} />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn-neon w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="divider">
            <span>OR CONTINUE WITH</span>
          </div>

          <button
            type="button"
            className="google-signin-btn glass-card"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="google-icon" />
            Google Account
          </button>
        </form>
        <div className="auth-footer">
          <p>
            New to CryptoHub?{" "}
            <Link to="/signup" className="auth-link text-gradient-cyan">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;