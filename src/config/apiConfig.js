/**
 * API Configuration for CryptoHub
 *
 * Central place for all tuneable API parameters.
 * Change values here to affect the entire app's API behaviour.
 *
 * CoinGecko Free Tier limits:
 *   - Demo Key:    ~30 calls/min
 *   - No Key:      ~10-30 calls/min (shared public pool)
 */

export const API_CONFIG = {
  // ─── Rate Limiting ──────────────────────────────────────────────
  RATE_LIMIT: {
    MAX_REQUESTS_PER_MINUTE: 25,  // Conservative — below CoinGecko's 30/min cap
    MAX_CONCURRENT: 3,            // Max simultaneous in-flight requests
    MIN_INTERVAL: 2400,           // ~2.4s between dispatches (60000ms / 25 reqs)
  },

  // ─── Retry / Backoff ────────────────────────────────────────────
  RETRY: {
    MAX_RETRIES: 5,               // Max retry attempts per request
    BASE_DELAY: 1000,             // 1 second initial retry delay
    MAX_DELAY: 30000,             // 30 second maximum retry delay
    JITTER_RANGE: 500,            // Up to 500ms random jitter per retry
  },

  // ─── Caching ────────────────────────────────────────────────────
  CACHE: {
    TTL: 60000,                   // 60 seconds — cache considered fresh
    STALE_TTL: 5 * 60 * 1000,    // 5 minutes — stale but still usable
    OFFLINE_TTL: 24 * 60 * 60 * 1000, // 24 hours — last resort offline data
  },

  // ─── React Query ────────────────────────────────────────────────
  QUERY: {
    STALE_TIME: 60000,            // 1 min before React Query refetches
    GC_TIME: 5 * 60 * 1000,      // 5 min before unused queries are garbage collected
    RETRY_COUNT: 3,               // React Query level retries (separate from backoff)
  },

  // ─── Request Timeout ────────────────────────────────────────────
  REQUEST: {
    TIMEOUT: 15000,               // 15 second request timeout
  },
};

export default API_CONFIG;
