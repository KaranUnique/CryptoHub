/**
 * Exponential Backoff Utility for CryptoHub
 *
 * Calculates retry delays for failed API requests using an exponential
 * backoff strategy with jitter to prevent the "thundering herd" problem
 * (many clients retrying at the exact same time after a failure).
 *
 * Strategy:
 *   delay = min(baseDelay × 2^attempt, maxDelay) + randomJitter
 *
 * Example delays (baseDelay=1000ms, maxDelay=30000ms):
 *   Attempt 1: ~1000ms  +  jitter
 *   Attempt 2: ~2000ms  +  jitter
 *   Attempt 3: ~4000ms  +  jitter
 *   Attempt 4: ~8000ms  +  jitter
 *   Attempt 5: ~16000ms +  jitter
 *   Attempt 6: ~30000ms +  jitter (capped)
 */

// ─── Configuration ────────────────────────────────────────────────
export const BACKOFF_CONFIG = {
  BASE_DELAY: 1000,       // 1 second base
  MAX_DELAY: 30000,       // 30 seconds max cap
  MAX_RETRIES: 5,         // Maximum retry attempts
  JITTER_RANGE: 500,      // Up to 500ms random jitter to spread retries
};

// ─── HTTP Status Codes that should NOT be retried ─────────────────
const NON_RETRYABLE_STATUSES = new Set([
  400, // Bad Request — won't succeed on retry
  401, // Unauthorized — needs user action
  403, // Forbidden — permissions issue
  404, // Not Found — resource doesn't exist
  422, // Unprocessable Entity
]);

// ─── Core Backoff Calculation ─────────────────────────────────────

/**
 * Calculate the delay (ms) for a given retry attempt.
 *
 * @param {number} attempt    - Current attempt number (0-indexed)
 * @param {number} baseDelay  - Starting delay in ms (default: 1000)
 * @param {number} maxDelay   - Maximum delay cap in ms (default: 30000)
 * @param {boolean} withJitter - Whether to add random jitter (default: true)
 * @returns {number} Delay in milliseconds
 */
export function calculateBackoff(
  attempt,
  baseDelay = BACKOFF_CONFIG.BASE_DELAY,
  maxDelay = BACKOFF_CONFIG.MAX_DELAY,
  withJitter = true
) {
  // Exponential: baseDelay × 2^attempt
  const exponential = baseDelay * Math.pow(2, attempt);

  // Cap at maxDelay
  const capped = Math.min(exponential, maxDelay);

  // Add random jitter to prevent thundering herd
  const jitter = withJitter
    ? Math.random() * BACKOFF_CONFIG.JITTER_RANGE
    : 0;

  return Math.floor(capped + jitter);
}

// ─── Retry Decision Logic ─────────────────────────────────────────

/**
 * Determine whether a failed request should be retried.
 *
 * @param {Error|object} error        - The error from the failed request
 * @param {number}       attemptNumber - How many retries have been attempted so far
 * @param {number}       maxRetries    - Max allowed retries (default: 5)
 * @returns {boolean} true if the request should be retried
 */
export function shouldRetry(
  error,
  attemptNumber,
  maxRetries = BACKOFF_CONFIG.MAX_RETRIES
) {
  // Hard limit on attempts
  if (attemptNumber >= maxRetries) return false;

  // Don't retry if no error object
  if (!error) return false;

  const status = error?.status || error?.response?.status;

  // Don't retry non-retryable HTTP errors
  if (status && NON_RETRYABLE_STATUSES.has(status)) return false;

  // Always retry on rate limit (429) — with appropriate delay
  if (status === 429) return true;

  // Retry on server errors (5xx)
  if (status >= 500 && status < 600) return true;

  // Retry on network errors (no status code means connection-level failure)
  if (!status && error?.message) {
    const msg = error.message.toLowerCase();
    if (
      msg.includes('network') ||
      msg.includes('fetch') ||
      msg.includes('timeout') ||
      msg.includes('connection') ||
      msg.includes('rate_limited')
    ) {
      return true;
    }
  }

  return false;
}

// ─── Retry-After Header Parser ─────────────────────────────────────

/**
 * Parse the delay to wait from a 429 response.
 * CoinGecko can return either:
 *   - Retry-After: <seconds>           (numeric)
 *   - Retry-After: <HTTP-date string>  (date format)
 *
 * @param {Response|Headers|object} responseOrHeaders - Fetch Response or Headers object
 * @returns {number} Wait time in milliseconds
 */
export function getRetryAfterDelay(responseOrHeaders) {
  let retryAfterValue = null;

  try {
    // Handle native fetch Response
    if (responseOrHeaders?.headers?.get) {
      retryAfterValue = responseOrHeaders.headers.get('Retry-After');
    }
    // Handle Headers object directly
    else if (responseOrHeaders?.get) {
      retryAfterValue = responseOrHeaders.get('Retry-After');
    }
    // Handle plain object (e.g., from error metadata)
    else if (responseOrHeaders?.retryAfter) {
      retryAfterValue = String(responseOrHeaders.retryAfter);
    }
  } catch {
    // If header parsing fails, fall back to default delay
  }

  if (!retryAfterValue) {
    // No header — use a safe default of 60 seconds for CoinGecko
    return 60000;
  }

  // Try parsing as a number of seconds
  const seconds = parseFloat(retryAfterValue);
  if (!isNaN(seconds)) {
    // Add a small buffer to avoid re-hitting the limit immediately
    return Math.ceil(seconds * 1000) + 500;
  }

  // Try parsing as an HTTP date string (e.g., "Sat, 28 Feb 2026 15:30:00 GMT")
  try {
    const retryDate = new Date(retryAfterValue);
    if (!isNaN(retryDate.getTime())) {
      const now = Date.now();
      const diff = retryDate.getTime() - now;
      return Math.max(diff + 500, 1000); // At least 1 second
    }
  } catch {
    // Ignore date parse failures
  }

  // Fallback: 60 seconds
  return 60000;
}

// ─── Convenience: Retry with Backoff Wrapper ──────────────────────

/**
 * Execute an async function with automatic exponential backoff retry.
 *
 * @param {Function} fn          - Async function to execute
 * @param {object}   options     - Optional config overrides
 * @param {number}   options.maxRetries   - Max retries (default: 5)
 * @param {number}   options.baseDelay    - Base delay ms (default: 1000)
 * @param {number}   options.maxDelay     - Max delay ms (default: 30000)
 * @param {Function} options.onRetry      - Callback(attemptNumber, delay, error) called before each retry
 * @returns {Promise<any>} Resolves with fn() result or rejects after all retries exhausted
 */
export async function withBackoff(fn, options = {}) {
  const {
    maxRetries = BACKOFF_CONFIG.MAX_RETRIES,
    baseDelay = BACKOFF_CONFIG.BASE_DELAY,
    maxDelay = BACKOFF_CONFIG.MAX_DELAY,
    onRetry = null,
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if we should retry
      if (!shouldRetry(error, attempt, maxRetries)) {
        throw error;
      }

      // Calculate how long to wait before next attempt
      let delay;

      // If the server told us when to retry (429 Retry-After), honour that
      if (error?.status === 429 || error?.response?.status === 429) {
        delay = getRetryAfterDelay(error?.response || error);
      } else {
        delay = calculateBackoff(attempt, baseDelay, maxDelay);
      }

      // Fire the onRetry callback so callers can show UI feedback
      if (typeof onRetry === 'function') {
        onRetry(attempt + 1, delay, error);
      }

      // Wait before the next attempt
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // All retries exhausted
  throw lastError;
}

export default withBackoff;
