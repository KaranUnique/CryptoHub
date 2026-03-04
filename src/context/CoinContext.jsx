import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { CoinContext } from "./CoinContextInstance";
import apiClient from "@/utils/apiClient";
import { API_CONFIG } from "@/config/apiConfig";
export { CoinContext };

// Fallback data for when API fails completely
const getFallbackCoinData = () => {
  return [
    {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
      current_price: 43250.0,
      market_cap: 845000000000,
      market_cap_rank: 1,
      total_volume: 23450000000,
      high_24h: 44100.0,
      low_24h: 42800.0,
      price_change_percentage_24h: 1.2,
      market_cap_change_percentage_24h: 1.5,
      circulating_supply: 19500000,
      total_supply: 21000000,
      max_supply: 21000000,
      ath: 69045,
      ath_change_percentage: -37.4,
      ath_date: "2021-11-10T14:24:11.849Z",
      roi: null,
      last_updated: "2024-01-01T00:00:00.000Z",
    },
    {
      id: "ethereum",
      symbol: "eth",
      name: "Ethereum",
      current_price: 2280.5,
      market_cap: 274000000000,
      market_cap_rank: 2,
      total_volume: 12340000000,
      high_24h: 2350.0,
      low_24h: 2250.0,
      price_change_percentage_24h: -0.8,
      market_cap_change_percentage_24h: -0.5,
      circulating_supply: 120000000,
      total_supply: 120000000,
      max_supply: null,
      ath: 4878,
      ath_change_percentage: -53.2,
      ath_date: "2021-11-10T14:24:11.849Z",
      roi: null,
      last_updated: "2024-01-01T00:00:00.000Z",
    },
    {
      id: "binancecoin",
      symbol: "bnb",
      name: "BNB",
      current_price: 315.2,
      market_cap: 48000000000,
      market_cap_rank: 3,
      total_volume: 890000000,
      high_24h: 322.0,
      low_24h: 312.0,
      price_change_percentage_24h: 0.5,
      market_cap_change_percentage_24h: 0.8,
      circulating_supply: 152000000,
      total_supply: 200000000,
      max_supply: 200000000,
      ath: 686.31,
      ath_change_percentage: -54.1,
      ath_date: "2021-05-10T07:24:15.666Z",
      roi: null,
      last_updated: "2024-01-01T00:00:00.000Z",
    },
  ];
};

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

  const fetchCoinData = useCallback(
    async (curr) => {
      try {
        // Use CoinGecko's free tier without API key for better production compatibility
        // The proxy configuration in vercel.json handles routing to api.coingecko.com
        const baseParams = `vs_currency=${curr.name}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`;
        const url = `/api/coingecko/coins/markets?${baseParams}`;

        return apiClient.get(url, {
          // High priority — this is the main data feed for the whole app
          priority: 1,
          // Notify context when rate-limited so UI can show an indicator
          onRateLimited: handleRateLimited,
        });
      } catch (error) {
        // If API fails completely, return fallback data
        if (error?.isApiKeyError || error?.status === 403) {
          console.warn(
            "🔑 CoinGecko API key issue detected, using fallback data",
          );
          return getFallbackCoinData();
        }
        throw error; // Re-throw other errors
      }
    },
    [handleRateLimited],
  );

  const {
    data: allCoin = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["coins", currency.name],
    queryFn: () => fetchCoinData(currency),
    // These mirror the global defaults in main.jsx — kept here for
    // explicitness so the CoinContext behaviour is self-documenting.
    staleTime: API_CONFIG.QUERY.STALE_TIME, // 60 seconds
    gcTime: API_CONFIG.QUERY.GC_TIME, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: (failureCount, error) => {
      // Retry up to 3 times on failure
      if (failureCount < 3 && error?.status !== 403) {
        return true;
      }
      return false;
    },
  });

  // ---------------------------------------------------------
  // 2. FILTER LOGIC (Preserved from your original code)
  // ---------------------------------------------------------

  const filteredCoins = useMemo(() => {
    if (!Array.isArray(allCoin) || allCoin.length === 0) return [];

    // Only "all" selected
    if (selectedFilters.length === 1 && selectedFilters[0] === "all") {
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
            coin.price_change_percentage_24h > 0,
        )
        .sort(
          (a, b) =>
            b.price_change_percentage_24h - a.price_change_percentage_24h,
        )
        .slice(0, 20);
      result.push(...topGainers);
    }

    // Remove duplicates if a coin is in both lists
    return Array.from(new Map(result.map((coin) => [coin.id, coin])).values());
  }, [allCoin, selectedFilters]);

  // ---------------------------------------------------------
  // 3. CONTEXT VALUE
  // ---------------------------------------------------------

  const contextValue = useMemo(
    () => ({
      allCoin,
      filteredCoins,
      selectedFilters,
      setSelectedFilters,
      currency,
      setCurrency,
      isLoading,
      isError,
      isRateLimited, // true when a 429 is being handled
      errorMessage: error?.message,
    }),
    [
      allCoin,
      filteredCoins,
      selectedFilters,
      currency,
      isLoading,
      isError,
      isRateLimited,
      error,
    ],
  );

  return (
    <CoinContext.Provider value={contextValue}>
      {props.children}
    </CoinContext.Provider>
  );
};

export default CoinContextProvider;
