/**
 * Centralized API Client for CryptoHub — CoinGecko Integration
 *
 * Combines:
 *  - Rate limiting   (via coinGeckoRateLimiter)
 *  - Exponential backoff with Retry-After header support
 *  - Two-tier in-memory caching (fresh → stale → offline)
 *  - Request deduplication (same URL = same in-flight promise)
 *  - Request timeout (AbortController)
 *  - Metrics exposed to window.__CRYPTOHUB_API_METRICS for DevTools inspection
 *
 * Usage:
 *   import apiClient from '@/utils/apiClient';
 *   const data = await apiClient.get('/api/coingecko/coins/markets?vs_currency=usd');
 */

import { coinGeckoRateLimiter } from "./rateLimiter";
import {
  shouldRetry,
  calculateBackoff,
  getRetryAfterDelay,
} from "./exponentialBackoff";
import { API_CONFIG } from "../config/apiConfig";

// ─── Two-Tier Cache ───────────────────────────────────────────────
/**
 * cache entry shape:
 *  { data, timestamp, staleAt, offlineAt }
 */
const cache = new Map();

function getCacheEntry(key) {
  return cache.get(key) || null;
}

function setCacheEntry(key, data) {
  const now = Date.now();
  cache.set(key, {
    data,
    timestamp: now,
    staleAt: now + API_CONFIG.CACHE.TTL,
    offlineAt: now + API_CONFIG.CACHE.OFFLINE_TTL,
  });
}

/**
 * Returns:
 *  'fresh'   — data within TTL, use directly
 *  'stale'   — data past TTL but within STALE_TTL, usable + should revalidate
 *  'offline' — very old but still better than nothing
 *  null      — no valid cache entry
 */
function getCacheStatus(key) {
  const entry = getCacheEntry(key);
  if (!entry) return null;
  const now = Date.now();
  if (now < entry.staleAt) return "fresh";
  if (now < entry.offlineAt) return "stale";
  return "offline";
}

// ─── In-flight Request Deduplication ─────────────────────────────
// If the same URL is already in-flight, callers share the same Promise
const inFlight = new Map();

// ─── Metrics ──────────────────────────────────────────────────────
const metrics = {
  totalRequests: 0,
  cacheHits: 0,
  cacheMisses: 0,
  rateLimitHits: 0,
  retries: 0,
  errors: 0,
  timeouts: 0,
};

// Expose metrics to the browser console for debugging:
//   console.table(window.__CRYPTOHUB_API_METRICS)
if (typeof window !== "undefined") {
  window.__CRYPTOHUB_API_METRICS = metrics;
}

// ─── Core Fetch with Timeout ──────────────────────────────────────

/**
 * Wraps native fetch with an AbortController timeout.
 *
 * @param {string} url
 * @param {object} options - Standard fetch options
 * @param {number} timeout - Ms before the request is aborted
 * @returns {Promise<Response>}
 */
async function fetchWithTimeout(
  url,
  options = {},
  timeout = API_CONFIG.REQUEST.TIMEOUT,
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error.name === "AbortError") {
      metrics.timeouts++;
      const timeoutError = new Error("Request timeout");
      timeoutError.isTimeout = true;
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

// ─── Core Request with Backoff ────────────────────────────────────

/**
 * Execute a single HTTP GET with retry + exponential backoff.
 * Does NOT touch the rate limiter (that wraps this function from outside).
 *
 * @param {string} url
 * @param {object} fetchOptions - Headers etc.
 * @param {Function} onRetry - Optional callback(attempt, delay, error)
 * @returns {Promise<any>} Parsed JSON response
 */
async function executeWithBackoff(url, fetchOptions = {}, onRetry = null) {
  let lastError;

  for (let attempt = 0; attempt <= API_CONFIG.RETRY.MAX_RETRIES; attempt++) {
    try {
      const response = await fetchWithTimeout(url, fetchOptions);

      // Handle HTTP 403 — Forbidden (API key issue or invalid endpoint)
      if (response.status === 403) {
        const forbiddenError = new Error(
          "API_KEY_INVALID: CoinGecko API key is invalid or missing permissions",
        );
        forbiddenError.status = 403;
        forbiddenError.isApiKeyError = true;
        throw forbiddenError;
      }

      // Handle HTTP 429 — Rate Limited
      if (response.status === 429) {
        metrics.rateLimitHits++;
        const retryDelay = getRetryAfterDelay(response);
        const retryError = new Error("RATE_LIMITED");
        retryError.status = 429;
        retryError.retryDelay = retryDelay;

        if (!shouldRetry(retryError, attempt)) throw retryError;

        if (typeof onRetry === "function") {
          onRetry(attempt + 1, retryDelay, retryError);
        }

        metrics.retries++;
        await new Promise((res) => setTimeout(res, retryDelay));
        continue;
      }

      // Handle other non-OK responses
      if (!response.ok) {
        const httpError = new Error(
          `HTTP ${response.status}: ${response.statusText}`,
        );
        httpError.status = response.status;

        if (!shouldRetry(httpError, attempt)) throw httpError;

        const delay = calculateBackoff(attempt);
        if (typeof onRetry === "function") {
          onRetry(attempt + 1, delay, httpError);
        }

        metrics.retries++;
        await new Promise((res) => setTimeout(res, delay));
        lastError = httpError;
        continue;
      }

      // Success — parse JSON
      return await response.json();
    } catch (error) {
      lastError = error;

      // Don't retry non-retryable errors
      if (!shouldRetry(error, attempt)) throw error;

      const delay = error.retryDelay || calculateBackoff(attempt);

      if (typeof onRetry === "function") {
        onRetry(attempt + 1, delay, error);
      }

      metrics.retries++;
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  metrics.errors++;
  throw lastError || new Error("Request failed after all retries");
}

// ─── Public API Client ────────────────────────────────────────────

const apiClient = {
  /**
   * Perform a rate-limited, cached, deduplicated GET request.
   *
   * @param {string}  url            - Full URL or path (e.g., '/api/coingecko/...')
   * @param {object}  options
   * @param {object}  options.headers        - Additional HTTP headers
   * @param {boolean} options.skipCache      - Force bypass cache (default: false)
   * @param {boolean} options.allowStale     - Use stale cache while revalidating (default: true)
   * @param {number}  options.priority       - Queue priority 0=normal, 1=high (default: 0)
   * @param {Function} options.onRetry       - Called(attempt, delay, error) before each retry
   * @param {Function} options.onRateLimited - Called when 429 received
   * @returns {Promise<any>} Parsed JSON data
   */
  async get(url, options = {}) {
    const {
      headers = {},
      skipCache = false,
      allowStale = true,
      priority = 0,
      onRetry = null,
      onRateLimited = null,
    } = options;

    // Add API key to headers if available
    if (import.meta.env.VITE_COINGECKO_API_KEY) {
      headers["x-cg-demo-api-key"] = import.meta.env.VITE_COINGECKO_API_KEY;
    }

    metrics.totalRequests++;

    // ① Check cache first
    if (!skipCache) {
      const cacheStatus = getCacheStatus(url);
      const entry = getCacheEntry(url);

      if (cacheStatus === "fresh") {
        metrics.cacheHits++;
        return entry.data;
      }

      if (cacheStatus === "stale" && allowStale) {
        metrics.cacheHits++;
        // Return stale data immediately AND revalidate in background
        this._revalidate(url, headers, priority, onRetry);
        return entry.data;
      }

      if (cacheStatus === "offline") {
        // Network offline — return very old data rather than failing
        if (!navigator.onLine) {
          metrics.cacheHits++;
          return entry.data;
        }
        // Online but very stale — fall through to fetch
      }
    }

    metrics.cacheMisses++;

    // ② Deduplicate: if this URL is already in-flight, reuse that Promise
    if (inFlight.has(url)) {
      return inFlight.get(url);
    }

    // ③ Enqueue in the rate limiter
    const requestPromise = coinGeckoRateLimiter.enqueue(
      async () => {
        const retryHandler = (attempt, delay, error) => {
          if (error?.status === 429 && typeof onRateLimited === "function") {
            onRateLimited(delay);
          }
          if (typeof onRetry === "function") {
            onRetry(attempt, delay, error);
          }
        };

        const fetchOptions = {
          method: "GET",
          headers: {
            accept: "application/json",
            ...headers,
          },
        };

        const data = await executeWithBackoff(url, fetchOptions, retryHandler);

        // Store in cache on success
        setCacheEntry(url, data);

        return data;
      },
      url, // Key for deduplication in the queue
      priority,
    );

    // Track in-flight map and clean up when done
    inFlight.set(url, requestPromise);
    requestPromise.finally(() => inFlight.delete(url));

    return requestPromise;
  },

  /**
   * Background revalidation — silently refresh stale cache without
   * blocking the caller (stale-while-revalidate pattern).
   */
  _revalidate(url, headers, priority, onRetry) {
    coinGeckoRateLimiter
      .enqueue(
        async () => {
          const fetchOptions = {
            method: "GET",
            headers: { accept: "application/json", ...headers },
          };
          const data = await executeWithBackoff(url, fetchOptions, onRetry);
          setCacheEntry(url, data);
          return data;
        },
        `revalidate:${url}`,
        priority - 1, // Lower priority than fresh requests
      )
      .catch(() => {
        // Background revalidation failures are silent
      });
  },

  /**
   * Manually invalidate a cached URL so the next call always fetches fresh.
   * @param {string} url
   */
  invalidateCache(url) {
    cache.delete(url);
  },

  /**
   * Clear the entire cache.
   */
  clearCache() {
    cache.clear();
  },

  /**
   * Returns current metrics snapshot.
   * Access in DevTools: window.__CRYPTOHUB_API_METRICS
   */
  getMetrics() {
    return {
      ...metrics,
      rateLimiter: coinGeckoRateLimiter.getMetrics(),
      cacheSize: cache.size,
      inFlightCount: inFlight.size,
    };
  },

  /**
   * Log a summary of metrics to the browser console.
   * Call from DevTools: import('@/utils/apiClient').then(m => m.default.logMetrics())
   */
  logMetrics() {
    const m = this.getMetrics();
    console.group("🔵 CryptoHub API Client Metrics");
    console.table({
      "Total Requests": m.totalRequests,
      "Cache Hits": m.cacheHits,
      "Cache Misses": m.cacheMisses,
      "Rate Limit Hits": m.rateLimitHits,
      Retries: m.retries,
      Errors: m.errors,
      Timeouts: m.timeouts,
      "Cache Size": m.cacheSize,
      "In-Flight": m.inFlightCount,
    });
    console.log("Rate Limiter:", m.rateLimiter);
    console.groupEnd();
  },
};

export default apiClient;
export { cache, metrics };
