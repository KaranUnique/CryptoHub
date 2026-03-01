/**
 * Firebase Validation Utility
 * 
 * Provides comprehensive validation for Firebase configuration,
 * connectivity, and permissions with user-friendly error messages.
 */

import { collection, getDocs, addDoc, deleteDoc, doc, query, limit } from "firebase/firestore";
import { retryWithBackoff, RetryPresets } from "./retryUtils";

// Firebase Error Types
export const FirebaseErrorType = {
  NOT_CONFIGURED: 'NOT_CONFIGURED',
  INVALID_CONFIG: 'INVALID_CONFIG',
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN: 'UNKNOWN',
};

// User-friendly error messages
export const FirebaseErrorMessages = {
  [FirebaseErrorType.NOT_CONFIGURED]: {
    title: "Firebase Not Configured",
    message: "Authentication features are currently unavailable. Please contact support if you need to use login or user features.",
    userAction: "You can still browse crypto data without logging in.",
    developerAction: "Add Firebase credentials to .env file",
  },
  [FirebaseErrorType.INVALID_CONFIG]: {
    title: "Firebase Configuration Error",
    message: "There's a problem with the Firebase setup. Our team has been notified.",
    userAction: "Please try again later or browse without authentication.",
    developerAction: "Check Firebase credentials in .env - they may be invalid",
  },
  [FirebaseErrorType.CONNECTION_FAILED]: {
    title: "Connection Failed",
    message: "We couldn't connect to the authentication service. This might be a temporary issue.",
    userAction: "Please check your internet connection and try again.",
    developerAction: "Verify Firebase project settings and network connectivity",
  },
  [FirebaseErrorType.PERMISSION_DENIED]: {
    title: "Permission Denied",
    message: "You don't have permission to perform this action.",
    userAction: "Please ensure you're logged in with the correct account.",
    developerAction: "Check Firebase security rules - they may be too restrictive",
  },
  [FirebaseErrorType.SERVICE_UNAVAILABLE]: {
    title: "Service Temporarily Unavailable",
    message: "The authentication service is currently unavailable. We're working to restore it.",
    userAction: "Please try again in a few minutes.",
    developerAction: "Check Firebase status dashboard for service outages",
  },
  [FirebaseErrorType.NETWORK_ERROR]: {
    title: "Network Error",
    message: "We're having trouble connecting to our servers.",
    userAction: "Please check your internet connection and try again.",
    developerAction: "Check network connectivity and firewall settings",
  },
  [FirebaseErrorType.UNKNOWN]: {
    title: "Something Went Wrong",
    message: "An unexpected error occurred. Our team has been notified.",
    userAction: "Please try again. If the problem persists, contact support.",
    developerAction: "Check console for detailed error logs",
  },
};

/**
 * Validates Firebase environment configuration
 * @returns {Object} Validation result with status and missing variables
 */
export const validateFirebaseConfig = () => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  const missingVars = requiredVars.filter(
    (varName) => !import.meta.env[varName]
  );

  const emptyVars = requiredVars.filter(
    (varName) => import.meta.env[varName] && import.meta.env[varName].trim() === ''
  );

  const placeholderVars = requiredVars.filter(
    (varName) => {
      const value = import.meta.env[varName];
      return value && (
        value.includes('your-') || 
        value.includes('YOUR_') || 
        value.includes('placeholder')
      );
    }
  );

  const isValid = missingVars.length === 0 && emptyVars.length === 0 && placeholderVars.length === 0;

  return {
    isValid,
    missingVars,
    emptyVars,
    placeholderVars,
    allVarsPresent: missingVars.length === 0,
    hasValidValues: emptyVars.length === 0 && placeholderVars.length === 0,
  };
};

/**
 * Tests Firebase connectivity by attempting to read from Firestore
 * @param {Object} db - Firestore database instance
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 * @param {boolean} useRetry - Whether to retry on transient failures (default: true)
 * @returns {Promise<Object>} Test result with status and details
 */
export const testFirebaseConnectivity = async (db, timeout = 10000, useRetry = true) => {
  if (!db) {
    return {
      success: false,
      errorType: FirebaseErrorType.NOT_CONFIGURED,
      message: "Firestore instance not initialized",
    };
  }

  const performConnectivityTest = async () => {
    // Create a promise that rejects after timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timeout')), timeout)
    );

    // Try to query a non-existent collection (minimal data transfer)
    const testQuery = query(collection(db, "_connection_test_"), limit(1));
    const queryPromise = getDocs(testQuery);

    // Race between query and timeout
    await Promise.race([queryPromise, timeoutPromise]);
  };

  try {
    if (useRetry) {
      // Retry with quick preset for connectivity tests
      await retryWithBackoff(
        performConnectivityTest,
        {
          ...RetryPresets.QUICK,
          onRetry: (attempt, error, delay) => {
            if (import.meta.env.DEV) {
              console.log(`Retrying Firebase connectivity test (attempt ${attempt}) after ${delay}ms...`);
            }
          }
        }
      );
    } else {
      await performConnectivityTest();
    }

    return {
      success: true,
      message: "Firebase connection successful",
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Firebase connectivity test failed:", error);
    }

    // Determine error type
    let errorType = FirebaseErrorType.UNKNOWN;
    
    if (error.message === 'Connection timeout') {
      errorType = FirebaseErrorType.CONNECTION_FAILED;
    } else if (error.code === 'permission-denied') {
      errorType = FirebaseErrorType.PERMISSION_DENIED;
    } else if (error.code === 'unavailable') {
      errorType = FirebaseErrorType.SERVICE_UNAVAILABLE;
    } else if (error.code === 'failed-precondition' || error.code === 'invalid-argument') {
      errorType = FirebaseErrorType.INVALID_CONFIG;
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      errorType = FirebaseErrorType.NETWORK_ERROR;
    }

    return {
      success: false,
      errorType,
      error: error.message,
      code: error.code,
    };
  }
};

/**
 * Tests Firestore write permissions with a temporary document
 * @param {Object} db - Firestore database instance
 * @param {string} userId - Optional user ID for user-specific permissions
 * @returns {Promise<Object>} Test result with read/write status
 */
export const testFirestorePermissions = async (db, userId = null) => {
  if (!db) {
    return {
      canRead: false,
      canWrite: false,
      errorType: FirebaseErrorType.NOT_CONFIGURED,
    };
  }

  const results = {
    canRead: false,
    canWrite: false,
    canDelete: false,
    errors: [],
  };

  // Test read permissions
  try {
    const testQuery = query(collection(db, "_permission_test_"), limit(1));
    await getDocs(testQuery);
    results.canRead = true;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Firestore read test failed:", error.message);
    }
    results.errors.push({ operation: 'read', error: error.message, code: error.code });
    
    if (error.code === 'permission-denied') {
      results.errorType = FirebaseErrorType.PERMISSION_DENIED;
    }
  }

  // Test write permissions (only if read succeeded or we want comprehensive test)
  try {
    const testDoc = await addDoc(collection(db, "_permission_test_"), {
      test: true,
      timestamp: new Date().toISOString(),
      userId: userId || 'anonymous',
    });
    results.canWrite = true;
    results.testDocId = testDoc.id;

    // Test delete permissions
    try {
      await deleteDoc(doc(db, "_permission_test_", testDoc.id));
      results.canDelete = true;
    } catch (deleteError) {
      if (import.meta.env.DEV) {
        console.warn("Firestore delete test failed:", deleteError.message);
      }
      results.errors.push({ 
        operation: 'delete', 
        error: deleteError.message, 
        code: deleteError.code 
      });
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Firestore write test failed:", error.message);
    }
    results.errors.push({ operation: 'write', error: error.message, code: error.code });
    
    if (error.code === 'permission-denied') {
      results.errorType = FirebaseErrorType.PERMISSION_DENIED;
    }
  }

  return results;
};

/**
 * Comprehensive Firebase validation
 * Runs all validation checks and returns consolidated results
 * @param {Object} firebase - Object containing { db, auth, app }
 * @param {Object} options - Validation options
 * @param {boolean} options.skipPermissionTest - Skip permission tests (default: false)
 * @param {number} options.timeout - Timeout for connectivity test (default: 10000)
 * @param {boolean} options.useRetry - Use retry logic for transient failures (default: true)
 * @returns {Promise<Object>} Complete validation results
 */
export const validateFirebase = async (
  { db, auth, app },
  options = {}
) => {
  const {
    skipPermissionTest = false,
    timeout = 10000,
    useRetry = true,
    skipConnectivityTest = false,
  } = options;

  const results = {
    timestamp: new Date().toISOString(),
    isValid: false,
    config: null,
    connectivity: null,
    permissions: null,
    errors: [],
    warnings: [],
  };

  // Step 1: Validate configuration
  results.config = validateFirebaseConfig();
  
  if (!results.config.isValid) {
    results.errors.push({
      type: FirebaseErrorType.NOT_CONFIGURED,
      details: results.config,
    });
  }

  // Step 2: Test connectivity (only if config is valid and not skipped)
  if (!skipConnectivityTest && results.config.isValid && db) {
    results.connectivity = await testFirebaseConnectivity(db, timeout, useRetry);
    
    if (!results.connectivity.success) {
      results.errors.push({
        type: results.connectivity.errorType,
        details: results.connectivity,
      });
    }
  } else if (!db) {
    results.warnings.push({
      type: 'initialization',
      message: 'Firestore instance not initialized',
    });
  }

  // Step 3: Test permissions (optional, can be slow)
  if (!skipPermissionTest && results.connectivity?.success) {
    results.permissions = await testFirestorePermissions(db);
    
    if (results.permissions.errorType) {
      results.errors.push({
        type: results.permissions.errorType,
        details: results.permissions,
      });
    } else if (!results.permissions.canRead && !results.permissions.canWrite) {
      results.warnings.push({
        type: 'permissions',
        message: 'Limited Firestore permissions detected',
        details: results.permissions,
      });
    }
  }

  // Determine overall validity
  results.isValid = 
    results.config.isValid &&
    (skipConnectivityTest || results.connectivity?.success === true) &&
    results.errors.length === 0;

  return results;
};

/**
 * Gets user-friendly error message for a Firebase error
 * @param {Error} error - Firebase error object
 * @param {string} context - Context where error occurred (e.g., 'login', 'signup')
 * @returns {Object} Error information with user-friendly message
 */
export const getFirebaseErrorInfo = (error, context = 'general') => {
  // Determine error type
  let errorType = FirebaseErrorType.UNKNOWN;
  
  if (!error) {
    return FirebaseErrorMessages[errorType];
  }

  // Firebase auth errors
  if (error.code?.startsWith('auth/')) {
    if (error.code === 'auth/network-request-failed') {
      errorType = FirebaseErrorType.NETWORK_ERROR;
    } else if (error.code === 'auth/too-many-requests') {
      errorType = FirebaseErrorType.SERVICE_UNAVAILABLE;
    } else if (error.code.includes('invalid') || error.code.includes('wrong')) {
      errorType = FirebaseErrorType.INVALID_CONFIG;
    }
  }
  
  // Firestore errors
  else if (error.code === 'permission-denied') {
    errorType = FirebaseErrorType.PERMISSION_DENIED;
  } else if (error.code === 'unavailable') {
    errorType = FirebaseErrorType.SERVICE_UNAVAILABLE;
  } else if (error.code === 'failed-precondition') {
    errorType = FirebaseErrorType.INVALID_CONFIG;
  }
  
  // Network errors
  else if (error.message?.includes('network') || error.message?.includes('fetch')) {
    errorType = FirebaseErrorType.NETWORK_ERROR;
  }

  const errorInfo = FirebaseErrorMessages[errorType];
  
  return {
    ...errorInfo,
    originalError: error.message,
    code: error.code,
    context,
  };
};

export default {
  validateFirebaseConfig,
  testFirebaseConnectivity,
  testFirestorePermissions,
  validateFirebase,
  getFirebaseErrorInfo,
  FirebaseErrorType,
  FirebaseErrorMessages,
};
