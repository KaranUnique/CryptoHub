import { useContext, useState, useEffect, useRef } from "react";
import { CoinContext } from "@/context/CoinContextInstance";
import { coinGeckoRateLimiter } from "@/utils/rateLimiter";

/**
 * RateLimitIndicator
 *
 * A non-intrusive status badge that appears in the bottom-left corner
 * whenever CoinGecko API requests are being rate-limited or queued.
 *
 * - Reads `isRateLimited` from CoinContext (set by apiClient when a 429 occurs)
 * - Polls the rateLimiter singleton every 500ms for live queue depth
 * - Auto-hides 2 seconds after both flags clear
 * - Uses CSS transitions for a smooth fade-in / fade-out
 */
const RateLimitIndicator = () => {
  const { isRateLimited } = useContext(CoinContext);

  // Live queue metrics — polled on a short interval
  const [queueDepth, setQueueDepth] = useState(0);
  const [activeRequests, setActiveRequests] = useState(0);

  // Controls actual DOM visibility (delayed hide allows CSS fade-out)
  const [mounted, setMounted] = useState(false);
  // Controls CSS opacity/transform transition
  const [show, setShow] = useState(false);

  const hideTimerRef = useRef(null);

  // ─── Poll queue depth ────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const metrics = coinGeckoRateLimiter.getMetrics();
      setQueueDepth(metrics.queueDepth);
      setActiveRequests(metrics.activeRequests);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // ─── Show / hide logic ───────────────────────────────────────────
  const isActive = isRateLimited || queueDepth > 0 || activeRequests > 1;

  useEffect(() => {
    clearTimeout(hideTimerRef.current);

    if (isActive) {
      // Mount first, then trigger the CSS transition on the next frame
      setMounted(true);
      requestAnimationFrame(() => setShow(true));
    } else {
      // Start fade-out, then unmount after transition completes
      setShow(false);
      hideTimerRef.current = setTimeout(() => setMounted(false), 600);
    }

    return () => clearTimeout(hideTimerRef.current);
  }, [isActive]);

  if (!mounted) return null;

  // ─── Status label ────────────────────────────────────────────────
  const getStatusText = () => {
    if (isRateLimited) return "Rate limited — retrying…";
    if (queueDepth > 0) return `${queueDepth} request${queueDepth > 1 ? "s" : ""} queued`;
    return "Fetching data…";
  };

  const getStatusColor = () => {
    if (isRateLimited) return "#f59e0b"; // amber — warning
    return "#6366f1";                    // indigo — normal activity
  };

  const statusColor = getStatusColor();

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={getStatusText()}
      style={{
        position: "fixed",
        bottom: "1.25rem",
        left: "1.25rem",
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.4rem 0.75rem",
        background: "rgba(15, 15, 25, 0.92)",
        border: `1px solid ${statusColor}55`,
        borderRadius: "9999px",
        backdropFilter: "blur(12px)",
        boxShadow: `0 0 12px ${statusColor}33`,
        fontSize: "0.72rem",
        fontFamily: "inherit",
        color: "#e2e8f0",
        userSelect: "none",
        pointerEvents: "none",
        // CSS transition for smooth appear / disappear
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(0.5rem)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      {/* Animated dot */}
      <span
        style={{
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          background: statusColor,
          flexShrink: 0,
          animation: isRateLimited
            ? "rli-pulse 1.2s ease-in-out infinite"
            : "rli-spin 1s linear infinite",
        }}
      />

      {/* Status text */}
      <span style={{ color: statusColor, fontWeight: 600 }}>
        {getStatusText()}
      </span>

      {/* Queue depth badge (only when multiple requests are waiting) */}
      {queueDepth > 1 && (
        <span
          style={{
            background: `${statusColor}22`,
            border: `1px solid ${statusColor}55`,
            borderRadius: "9999px",
            padding: "0 0.4rem",
            fontSize: "0.65rem",
            color: statusColor,
            fontWeight: 700,
          }}
        >
          {activeRequests} active
        </span>
      )}

      {/* Keyframe animations injected once via a <style> tag */}
      <style>{`
        @keyframes rli-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.75); }
        }
        @keyframes rli-spin {
          from { box-shadow: 0 0 0 0 ${statusColor}88; }
          to   { box-shadow: 0 0 0 5px ${statusColor}00; }
        }
      `}</style>
    </div>
  );
};

export default RateLimitIndicator;
