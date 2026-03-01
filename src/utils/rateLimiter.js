/**
 * RateLimiter - Request Queue & Rate Limiting Utility for CryptoHub
 *
 * Ensures CoinGecko API calls never exceed configured rate limits.
 * Uses a FIFO queue with request deduplication, concurrency control,
 * and real-time metrics tracking.
 *
 * CoinGecko Free Tier Limit: 10-30 calls/min
 * Default config is conservative at 25 calls/min.
 */

// ─── Default Configuration ────────────────────────────────────────
const DEFAULT_CONFIG = {
  maxRequestsPerMinute: 25,   // Stay comfortably under CoinGecko's 30/min limit
  maxConcurrent: 3,           // Up to 3 in-flight requests at once
  minInterval: 2400,          // ms between consecutive requests (60000/25)
};

// ─── RateLimiter Class ────────────────────────────────────────────
class RateLimiter {
  /**
   * @param {object} config - Optional overrides for rate limit settings
   */
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    // Internal state
    this._queue = [];                  // Pending request objects
    this._activeCount = 0;             // Requests currently in-flight
    this._requestTimestamps = [];      // Timestamps of recent requests (for per-minute check)
    this._processing = false;          // Whether the queue loop is running
    this._pendingKeys = new Set();     // Keys of requests already in the queue (dedup)

    // Metrics (exposed for monitoring/debugging)
    this.metrics = {
      queued: 0,
      completed: 0,
      failed: 0,
      deduplicated: 0,
      cacheHits: 0,
      rateLimitHits: 0,
    };
  }

  // ─── Public API ──────────────────────────────────────────────────

  /**
   * Enqueue a request function, deduplicating by key.
   *
   * @param {Function} fn      - Async function that performs the request
   * @param {string}   key     - Unique key for this request (used for dedup)
   * @param {number}   priority - Higher priority = processed sooner (default: 0)
   * @returns {Promise<any>} Resolves/rejects when the request completes
   */
  enqueue(fn, key, priority = 0) {
    // Deduplication: if an identical key is already queued, return same pending promise
    if (this._pendingKeys.has(key)) {
      this.metrics.deduplicated++;

      // Find and reuse the existing queued item's promise
      const existing = this._queue.find((item) => item.key === key);
      if (existing) {
        return existing.promise;
      }
    }

    // Create a promise that resolves/rejects when fn() is called
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });

    const requestItem = {
      fn,
      key,
      priority,
      promise,
      resolve,
      reject,
      queuedAt: Date.now(),
    };

    // Insert in priority order (higher priority first)
    const insertIndex = this._queue.findIndex((item) => item.priority < priority);
    if (insertIndex === -1) {
      this._queue.push(requestItem);
    } else {
      this._queue.splice(insertIndex, 0, requestItem);
    }

    this._pendingKeys.add(key);
    this.metrics.queued++;

    // Kick off the processing loop if it isn't running
    if (!this._processing) {
      this._startProcessing();
    }

    return promise;
  }

  /**
   * Returns current metrics snapshot.
   * Useful for DevTools panel / debug console.
   */
  getMetrics() {
    return {
      ...this.metrics,
      queueDepth: this._queue.length,
      activeRequests: this._activeCount,
      pendingKeys: [...this._pendingKeys],
    };
  }

  /**
   * Clears the entire queue, rejecting all pending promises.
   * Call on unmount or logout to avoid ghost requests.
   */
  clearQueue(reason = 'Queue cleared') {
    const items = [...this._queue];
    this._queue = [];
    this._pendingKeys.clear();
    this._processing = false;

    items.forEach((item) => {
      item.reject(new Error(reason));
    });
  }

  // ─── Private Methods ─────────────────────────────────────────────

  /**
   * Main processing loop. Runs until the queue is empty.
   */
  async _startProcessing() {
    this._processing = true;

    while (this._queue.length > 0) {
      // Respect concurrency limit
      if (this._activeCount >= this.config.maxConcurrent) {
        await this._sleep(100); // Spin-wait until a slot frees up
        continue;
      }

      // Respect per-minute rate limit
      const canProceed = this._checkRateLimit();
      if (!canProceed) {
        const waitTime = this._getWaitTime();
        await this._sleep(waitTime);
        continue;
      }

      // Dequeue the next item
      const item = this._queue.shift();
      if (!item) break;

      this._pendingKeys.delete(item.key);
      this._activeCount++;
      this._recordRequest();

      // Execute asynchronously (don't await here — allows concurrency)
      this._executeRequest(item);

      // Enforce minimum interval between sequential dispatches
      await this._sleep(this.config.minInterval / this.config.maxConcurrent);
    }

    this._processing = false;
  }

  /**
   * Executes a single request item and resolves/rejects its promise.
   */
  async _executeRequest(item) {
    try {
      const result = await item.fn();
      item.resolve(result);
      this.metrics.completed++;
    } catch (error) {
      // Track rate limit responses specifically
      if (error?.message === 'RATE_LIMITED' || error?.status === 429) {
        this.metrics.rateLimitHits++;
      }
      item.reject(error);
      this.metrics.failed++;
    } finally {
      this._activeCount--;
    }
  }

  /**
   * Check whether we're within the per-minute request limit.
   */
  _checkRateLimit() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Prune timestamps older than 1 minute
    this._requestTimestamps = this._requestTimestamps.filter(
      (ts) => ts > oneMinuteAgo
    );

    return this._requestTimestamps.length < this.config.maxRequestsPerMinute;
  }

  /**
   * Calculate how many ms until we can make another request.
   */
  _getWaitTime() {
    if (this._requestTimestamps.length === 0) return 0;

    const oldest = this._requestTimestamps[0];
    const resetAt = oldest + 60000;
    return Math.max(0, resetAt - Date.now()) + 100; // +100ms buffer
  }

  /**
   * Record that a request was made at this instant.
   */
  _recordRequest() {
    this._requestTimestamps.push(Date.now());
  }

  /**
   * Simple promise-based sleep.
   */
  _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ─── Singleton Export ─────────────────────────────────────────────
// The entire app shares one rate limiter instance for CoinGecko calls.
const coinGeckoRateLimiter = new RateLimiter({
  maxRequestsPerMinute: 25,
  maxConcurrent: 3,
  minInterval: 2400,
});

export { RateLimiter, coinGeckoRateLimiter };
export default coinGeckoRateLimiter;
