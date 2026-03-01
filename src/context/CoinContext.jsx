import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { CoinContext } from "./CoinContextInstance";
import apiClient from "@/utils/apiClient";
import { API_CONFIG } from "@/config/apiConfig";
export { CoinContext };

export const CoinContextProvider = (props) => {
  const [selectedFilters, setSelectedFilters] = useState(["all"]);
  const [currency, setCurrency] = useState({
    name: "usd",
    Symbol: "$",
  });
  // Tracks whether we are currently being rate-limited (shown in UI indicator)
  const [isRateLimited, setIsRateLimited] = useState(false);

  // ---------------------------------------------------------
  // 1. DATA FETCHING — routes through apiClient for:
  //    - Rate limiting  (25 req/min queue)
  //    - Exponential backoff + Retry-After header support
  //    - Two-tier caching (fresh 60s / stale 5min / offline 24hr)
  //    - Request deduplication
  // ---------------------------------------------------------

  // Called by apiClient when a 429 response is received
  const handleRateLimited = useCallback((retryDelayMs) => {
    setIsRateLimited(true);
    // Clear the rate-limit flag once the retry delay has elapsed
    setTimeout(() => setIsRateLimited(false), retryDelayMs + 500);
  }, []);

  const fetchCoinData = useCallback(async (curr) => {
    const apiKey = import.meta.env.VITE_CG_API_KEY;

    // Build the proxied URL (/api/coingecko → https://api.coingecko.com/api/v3)
    // Using the Vite proxy defined in vite.config.js keeps the API key
    // server-side and routes through our rate limiter correctly.
    const baseParams = `vs_currency=${curr.name}&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h`;
    const url = apiKey
      ? `/api/coingecko/coins/markets?${baseParams}&x_cg_demo_api_key=${apiKey}`
      : `/api/coingecko/coins/markets?${baseParams}`;

    return apiClient.get(url, {
      // High priority — this is the main data feed for the whole app
      priority: 1,
      // Notify context when rate-limited so UI can show an indicator
      onRateLimited: handleRateLimited,
    });
  }, [handleRateLimited]);

  const { data: allCoin = [], isLoading, isError, error } = useQuery({
    queryKey: ["coins", currency.name],
    queryFn: () => fetchCoinData(currency),
    // These mirror the global defaults in main.jsx — kept here for
    // explicitness so the CoinContext behaviour is self-documenting.
    staleTime: API_CONFIG.QUERY.STALE_TIME,       // 60 seconds
    gcTime:    API_CONFIG.QUERY.GC_TIME,          // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // ---------------------------------------------------------
  // 2. FILTER LOGIC (Preserved from your original code)
  // ---------------------------------------------------------

  const filteredCoins = useMemo(() => {
    if (!Array.isArray(allCoin) || allCoin.length === 0) return [];

    // Only "all" selected
    if (
      selectedFilters.length === 1 &&
      selectedFilters[0] === "all"
    ) {
      return allCoin;
    }

    let result = [];

    // Trending (Top 20 by Volume)
    if (selectedFilters.includes("trending")) {
      const trendingCoins = [...allCoin]
        .sort((a, b) => b.total_volume - a.total_volume)
        .slice(0, 20);
      result.push(...trendingCoins);
    }

    // Top Gainers (Top 20 by 24h Change)
    if (selectedFilters.includes("top_gainers")) {
      const topGainers = [...allCoin]
        .filter(
          (coin) =>
            coin.price_change_percentage_24h !== null &&
            coin.price_change_percentage_24h > 0
        )
        .sort(
          (a, b) =>
            b.price_change_percentage_24h -
            a.price_change_percentage_24h
        )
        .slice(0, 20);
      result.push(...topGainers);
    }

    // Remove duplicates if a coin is in both lists
    return Array.from(
      new Map(result.map((coin) => [coin.id, coin])).values()
    );
  }, [allCoin, selectedFilters]);

  // ---------------------------------------------------------
  // 3. CONTEXT VALUE
  // ---------------------------------------------------------

  const contextValue = useMemo(() => ({
    allCoin,
    filteredCoins,
    selectedFilters,
    setSelectedFilters,
    currency,
    setCurrency,
    isLoading,
    isError,
    isRateLimited,                 // true when a 429 is being handled
    errorMessage: error?.message,
  }), [allCoin, filteredCoins, selectedFilters, currency, isLoading, isError, isRateLimited, error]);

  return (
    <CoinContext.Provider value={contextValue}>
      {props.children}
    </CoinContext.Provider>
  );
};

export default CoinContextProvider;