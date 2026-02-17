import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMail, FiRefreshCw, FiCheckCircle } from "react-icons/fi";
import { notifyError, notifySuccess, notifyInfo } from "../utils/notify";
import "./EmailVerification.css";

function EmailVerification() {
  const { currentUser, sendVerificationEmail, reloadUserVerificationStatus, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      await sendVerificationEmail();
      notifySuccess("Verification email sent! Please check your inbox.");
    } catch (error) {
      console.error("Error sending verification email:", error);
      
      let errorMessage = "Failed to send verification email. Please try again.";
      
      if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please wait a few minutes before trying again.";
      }
      
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    setCheckingStatus(true);
    try {
      const isVerified = await reloadUserVerificationStatus();
      
      if (isVerified) {
        notifySuccess("Email verified successfully! Redirecting to dashboard...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        notifyInfo("Email not verified yet. Please check your inbox and click the verification link.");
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
      notifyError("Failed to check verification status. Please try again.");
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      notifyError("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="email-verification-page">
      <div className="email-verification-container">
        <div className="email-verification-icon">
          <FiMail />
        </div>
        
        <h1 className="email-verification-title">Verify Your Email</h1>
        
        <p className="email-verification-message">
          We've sent a verification email to:
        </p>
        
        <p className="email-verification-email">
          {currentUser?.email}
        </p>
        
        <p className="email-verification-instructions">
          Please check your inbox and click the verification link to activate your account.
          Don't forget to check your spam folder if you don't see the email.
        </p>
        
        <div className="email-verification-actions">
          <button
            onClick={handleCheckVerification}
            disabled={checkingStatus}
            className="btn-primary email-verification-btn"
          >
            {checkingStatus ? (
              <>
                <FiRefreshCw className="spinning" />
                Checking...
              </>
            ) : (
              <>
                <FiCheckCircle />
                I've Verified My Email
              </>
            )}
          </button>
          
          <button
            onClick={handleResendEmail}
            disabled={loading}
            className="btn-secondary email-verification-btn"
          >
            {loading ? (
              <>
                <FiRefreshCw className="spinning" />
                Sending...
              </>
            ) : (
              <>
                <FiMail />
                Resend Verification Email
              </>
            )}
          </button>
        </div>
        
        <div className="email-verification-footer">
          <p className="email-verification-help">
            Need help? <a href="/contactus">Contact Support</a>
          </p>
          
          <button onClick={handleLogout} className="btn-text">
            Sign out and use a different account
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;
