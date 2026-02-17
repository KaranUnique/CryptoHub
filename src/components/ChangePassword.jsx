import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./ChangePassword.css";
import { notifyError, notifySuccess } from "../utils/notify";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI states

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // auth functions
  const { ChangePassword, isEmailProvider } = useAuth();

  const navigate = useNavigate();

  // Check if user can change password (only email/password users)
  if (!isEmailProvider()) {
    return (
      <div className="change-password-container">
        <div className="change-password-card">
          <h2>Change Password</h2>
          <div className="info-message">
            Password change is only available for email/password accounts.
            <br />
            <br />
            You signed in with Google. Please manage your password through your
            Google account.
          </div>
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    // Reset previous errors
    setError("");

    // Check if all fields are filled
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return false;
    }
    // Check new password length
    if (newPassword.length < 6) {
      setError("New Password must be at Least 6 characters long.");
      return false;
    }
    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setError("New Password does not match.");
      return false;
    }
    // Check if new password is different from current password
    if (currentPassword === newPassword) {
      setError("New password must be different from current password.");
      return false;
    }

    return true;
  };
  // submit handler

  const handleSubmit = async (e) => {
    e.preventDefault();

    // clear previous messages
    setError("");


    // validate form before API Call
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await ChangePassword(currentPassword, newPassword);
      notifySuccess("Password changed successfully.");
      setTimeout(() => navigate("/dashboard"), 1500);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Failed to change password. ", err);
      let message = "failed to change password .please try again.";

      // Handle specific Firebase errors
      if (err.code === "auth/wrong-password") {
        message = "Current password is incorrect.";
      } else if (err.code === "auth/weak-password") {
        message = "New password is too weak. Please use a stronger password.";
      } else if (err.code === "auth/requires-recent-login") {
        message = "Session expired. Please log out and log in again.";
      } else if (err.code === "auth/too-many-requests") {
        message = "Too many attempts. Please try again later.";
      }
      else if (err.code === "auth/invalid-credential") {
        message = "Invalid credentials provided.";
      }
      else {
        message = err.message || "Failed to change password. Please try again.";
      }
      notifyError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <h2>Change Password</h2>
        <p className="subtitle">Update your account password</p>


        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Current Password Field */}
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <div className="input-wrapper">
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                tabIndex={-1}
                aria-label={showCurrentPassword ? "Hide password" : "Show password"}
              >
                {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* New Password Field */}
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="input-wrapper">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowNewPassword(!showNewPassword)}
                tabIndex={-1}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Changing Password..." : "Change Password"}
          </button>
        </form>

        {/* Back Link */}
        <div className="back-link">
          <button
            type="button"
            className="link-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
