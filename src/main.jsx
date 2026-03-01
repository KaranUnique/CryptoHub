import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CoinContextProvider } from "./context/CoinContext";
import { AuthProvider } from "./context/AuthProvider";
import { ThemeProvider } from "./context/ThemeContext";
import { LeaderboardProvider } from "./context/LeaderboardContext";
import { HelmetProvider } from 'react-helmet-async';
// 1. Import React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// 2. Import centralized API config for consistent cache/retry settings
import { API_CONFIG } from './config/apiConfig';

// 3. Create the client with rate-limit-aware retry and caching configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // How long (ms) data is considered fresh — no refetch during this window
      staleTime: API_CONFIG.QUERY.STALE_TIME,           // 60 seconds

      // How long (ms) inactive query data stays in memory before garbage collection
      gcTime: API_CONFIG.QUERY.GC_TIME,                 // 5 minutes

      // Do NOT refetch just because the user switches back to the browser tab.
      // This prevents bursts of API calls on tab focus which can trigger rate limits.
      refetchOnWindowFocus: false,

      // Do NOT refetch on reconnect — stale cache is shown instead.
      // The user can manually refresh if needed.
      refetchOnReconnect: false,

      // Smart retry function — respects rate limit and auth errors
      retry: (failureCount, error) => {
        // Never retry on these — they won't succeed regardless of attempts
        const nonRetryableStatuses = new Set([400, 401, 403, 404, 422]);
        const status = error?.status || error?.response?.status;

        if (status && nonRetryableStatuses.has(status)) return false;

        // For 429 (rate limited), let our apiClient's exponential backoff handle it.
        // React Query should NOT add its own retries on top.
        if (status === 429) return false;

        // For everything else (network errors, 5xx) — retry up to configured limit
        return failureCount < API_CONFIG.QUERY.RETRY_COUNT;  // 3 retries
      },

      // Exponential backoff for React Query's own retry delays
      // (complements the backoff inside apiClient.js)
      retryDelay: (attemptIndex) => {
        const base = API_CONFIG.RETRY.BASE_DELAY;          // 1000ms
        const max  = API_CONFIG.RETRY.MAX_DELAY;           // 30000ms
        return Math.min(base * Math.pow(2, attemptIndex), max);
      },
    },

    mutations: {
      // Mutations (write operations) — retry once on network error only
      retry: (failureCount, error) => {
        const status = error?.status || error?.response?.status;
        if (status && status < 500) return false; // Don't retry client errors
        return failureCount < 1;
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AuthProvider>
          <LeaderboardProvider>
            {/* 4. Wrap everything with QueryClientProvider */}
            <QueryClientProvider client={queryClient}>
              <CoinContextProvider>
                <HelmetProvider>
                  <App />
                </HelmetProvider>
              </CoinContextProvider>
            </QueryClientProvider>
          </LeaderboardProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);