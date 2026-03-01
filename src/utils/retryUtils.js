/**
 * Retry Utilities for Firebase Operations
 * 
 * Provides smart retry logic with exponential backoff for handling transient failures.
 * Designed specifically for Firebase operations that may fail due to temporary issues.
 */

/**
 * Determines if an error is transient (retry-able) or permanent
 * @param {Error} error - The error to check
 * @returns {boolean} - True if error is transient and should be retried
 */
export const isTransientError = (error) => {
  if (!error) return false;

  const errorCode = error.code || '';
  const errorMessage = (error.message || '').toLowerCase();

  // Network-related errors (definitely transient)
  const networkErrors = [
    'network-request-failed',
    'unavailable',
    'timeout',
    'offline',
    'connection',
  ];

  // Firebase-specific transient error codes
  const transientCodes = [
    'auth/network-request-failed',
    'auth/too-many-requests',
    'firestore/unavailable',
    'firestore/deadline-exceeded',
    'firestore/resource-exhausted',
    'storage/retry-limit-exceeded',
  ];

  // Check error code
  if (transientCodes.some(code => errorCode.includes(code))) {
    return true;
  }

  // Check error message
  if (networkErrors.some(keyword => errorMessage.includes(keyword))) {
    return true;
  }

  // HTTP status codes that are transient
  if (error.status) {
    const transientStatuses = [408, 429, 500, 502, 503, 504];
    if (transientStatuses.includes(error.status)) {
      return true;
    }
  }

  return false;
};

/**
 * Determines if an error is permanent (should not retry)
 * @param {Error} error - The error to check
 * @returns {boolean} - True if error is permanent and should not be retried
 */
export const isPermanentError = (error) => {
  if (!error) return false;

  const errorCode = error.code || '';

  // Firebase permanent error codes
  const permanentCodes = [
    'auth/email-already-in-use',
    'auth/invalid-email',
    'auth/user-not-found',
    'auth/wrong-password',
    'auth/weak-password',
    'auth/user-disabled',
    'permission-denied',
    'unauthenticated',
    'invalid-argument',
    'not-found',
  ];

  return permanentCodes.some(code => errorCode.includes(code));
};

/**
 * Calculates delay for exponential backoff
 * @param {number} attempt - Current attempt number (0-indexed)
 * @param {number} baseDelay - Base delay in milliseconds (default: 1000)
 * @param {number} maxDelay - Maximum delay in milliseconds (default: 30000)
 * @param {boolean} jitter - Add random jitter to prevent thundering herd (default: true)
 * @returns {number} - Delay in milliseconds
 */
export const calculateBackoffDelay = (
  attempt,
  baseDelay = 1000,
  maxDelay = 30000,
  jitter = true
) => {
  // Exponential backoff: baseDelay * 2^attempt
  let delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);

  // Add jitter (±25% randomness) to prevent all clients retrying at once
  if (jitter) {
    const jitterFactor = 0.25;
    const randomJitter = delay * jitterFactor * (Math.random() * 2 - 1);
    delay = Math.max(0, delay + randomJitter);
  }

  return Math.floor(delay);
};

/**
 * Delays execution for a specified time
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retries an async operation with exponential backoff
 * 
 * @param {Function} operation - Async function to retry
 * @param {Object} options - Retry configuration
 * @param {number} options.maxAttempts - Maximum number of retry attempts (default: 3)
 * @param {number} options.baseDelay - Base delay in ms (default: 1000)
 * @param {number} options.maxDelay - Maximum delay in ms (default: 30000)
 * @param {boolean} options.jitter - Add random jitter (default: true)
 * @param {Function} options.onRetry - Callback called before each retry (attempt, error) => void
 * @param {Function} options.shouldRetry - Custom function to determine if error should be retried
 * @returns {Promise<any>} - Result of the operation
 * @throws {Error} - Throws the last error if all retries fail
 */
export const retryWithBackoff = async (
  operation,
  options = {}
) => {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    jitter = true,
    onRetry = null,
    shouldRetry = isTransientError,
  } = options;

  let lastError;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      // Attempt the operation
      const result = await operation();
      return result;
    } catch (error) {
      lastError = error;

      // Check if this is the last attempt
      const isLastAttempt = attempt === maxAttempts - 1;
      
      // Check if error is permanent (should not retry)
      if (isPermanentError(error)) {
        throw error;
      }

      // Check if we should retry this error
      const shouldRetryError = shouldRetry(error);
      
      if (!shouldRetryError || isLastAttempt) {
        throw error;
      }

      // Calculate delay before retry
      const delayMs = calculateBackoffDelay(attempt, baseDelay, maxDelay, jitter);

      // Call onRetry callback if provided
      if (onRetry) {
        onRetry(attempt + 1, error, delayMs);
      }

      // Wait before retrying
      await delay(delayMs);
    }
  }

  // This should never be reached, but just in case
  throw lastError;
};

/**
 * Creates a retry wrapper for a function
 * Returns a new function that automatically retries on transient failures
 * 
 * @param {Function} fn - Function to wrap
 * @param {Object} retryOptions - Retry configuration (same as retryWithBackoff)
 * @returns {Function} - Wrapped function with retry logic
 */
export const withRetry = (fn, retryOptions = {}) => {
  return async (...args) => {
    return retryWithBackoff(
      () => fn(...args),
      retryOptions
    );
  };
};

/**
 * Retry configuration presets for common scenarios
 */
export const RetryPresets = {
  // Quick retry for fast operations (UI interactions)
  QUICK: {
    maxAttempts: 2,
    baseDelay: 500,
    maxDelay: 2000,
    jitter: true,
  },

  // Standard retry for most Firebase operations
  STANDARD: {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    jitter: true,
  },

  // Aggressive retry for critical operations
  AGGRESSIVE: {
    maxAttempts: 5,
    baseDelay: 1000,
    maxDelay: 30000,
    jitter: true,
  },

  // Patient retry for background operations
  PATIENT: {
    maxAttempts: 4,
    baseDelay: 2000,
    maxDelay: 60000,
    jitter: true,
  },

  // No retry (for operations that should fail fast)
  NONE: {
    maxAttempts: 1,
    baseDelay: 0,
    maxDelay: 0,
    jitter: false,
  },
};

/**
 * Example usage:
 * 
 * // Basic retry with defaults
 * const result = await retryWithBackoff(async () => {
 *   return await someFirebaseOperation();
 * });
 * 
 * // Retry with custom options
 * const result = await retryWithBackoff(
 *   async () => await someFirebaseOperation(),
 *   {
 *     maxAttempts: 5,
 *     baseDelay: 2000,
 *     onRetry: (attempt, error, delay) => {
 *       console.log(`Retry attempt ${attempt} after ${delay}ms`);
 *     }
 *   }
 * );
 * 
 * // Using presets
 * const result = await retryWithBackoff(
 *   async () => await someFirebaseOperation(),
 *   RetryPresets.AGGRESSIVE
 * );
 * 
 * // Wrap a function with retry logic
 * const loginWithRetry = withRetry(login, RetryPresets.STANDARD);
 * await loginWithRetry(email, password);
 */
