import React from "react";
import PropTypes from "prop-types";
import "./FirebaseError.css";

/**
 * FirebaseError Component
 * 
 * Displays user-friendly Firebase error messages with retry functionality.
 * Integrates with the validation utility to show contextual error information.
 */
const FirebaseError = ({
  errorInfo,
  onRetry,
  onDismiss,
  severity = "error",
  showDeveloperInfo = false,
}) => {
  if (!errorInfo) return null;

  const { title, message, userAction, developerAction, originalError, code, context } = errorInfo;

  // Determine icon and styling based on severity
  const getSeverityConfig = () => {
    switch (severity) {
      case "warning":
        return {
          icon: "⚠️",
          className: "firebase-error-warning",
          label: "Warning",
        };
      case "info":
        return {
          icon: "ℹ️",
          className: "firebase-error-info",
          label: "Information",
        };
      case "error":
      default:
        return {
          icon: "❌",
          className: "firebase-error-error",
          label: "Error",
        };
    }
  };

  const severityConfig = getSeverityConfig();

  return (
    <div className={`firebase-error-container ${severityConfig.className}`} role="alert" aria-live="assertive">
      <div className="firebase-error-card">
        {/* Header */}
        <div className="firebase-error-header">
          <div className="firebase-error-icon">
            <span className="firebase-error-icon-symbol">{severityConfig.icon}</span>
          </div>
          <div className="firebase-error-header-content">
            <h3 className="firebase-error-title">{title || "Firebase Error"}</h3>
            {context && (
              <span className="firebase-error-context">During: {context}</span>
            )}
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="firebase-error-dismiss"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          )}
        </div>

        {/* Main Message */}
        <div className="firebase-error-body">
          <p className="firebase-error-message">{message}</p>
          
          {userAction && (
            <div className="firebase-error-user-action">
              <strong>What you can do:</strong>
              <p>{userAction}</p>
            </div>
          )}
        </div>

        {/* Developer Information (shown in development mode) */}
        {showDeveloperInfo && (developerAction || originalError || code) && (
          <details className="firebase-error-developer-details">
            <summary className="firebase-error-developer-summary">
              Developer Information
            </summary>
            <div className="firebase-error-developer-content">
              {developerAction && (
                <div className="firebase-error-developer-action">
                  <strong>Fix:</strong>
                  <p>{developerAction}</p>
                </div>
              )}
              {code && (
                <div className="firebase-error-code">
                  <strong>Error Code:</strong> <code>{code}</code>
                </div>
              )}
              {originalError && (
                <div className="firebase-error-original">
                  <strong>Original Error:</strong>
                  <pre className="firebase-error-stack">{originalError}</pre>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Action Buttons */}
        <div className="firebase-error-actions">
          {onRetry && (
            <button
              onClick={onRetry}
              className="firebase-error-btn firebase-error-btn-primary"
            >
              <span className="firebase-error-btn-icon">🔄</span>
              Try Again
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="firebase-error-btn firebase-error-btn-secondary"
            >
              Continue Without Auth
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

FirebaseError.propTypes = {
  errorInfo: PropTypes.shape({
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
    userAction: PropTypes.string,
    developerAction: PropTypes.string,
    originalError: PropTypes.string,
    code: PropTypes.string,
    context: PropTypes.string,
  }),
  onRetry: PropTypes.func,
  onDismiss: PropTypes.func,
  severity: PropTypes.oneOf(["error", "warning", "info"]),
  showDeveloperInfo: PropTypes.bool,
};

export default FirebaseError;
