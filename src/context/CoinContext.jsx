import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CoinContext } from "./CoinContextInstance";
export { CoinContext };

export const CoinContextProvider = (props) => {
  const [selectedFilters, setSelectedFilters] = useState(["all"]);
  const [currency, setCurrency] = useState({
    name: "usd",
    Symbol: "$",
  });

  // ---------------------------------------------------------
  // 1. DATA FETCHING (Replaced manual fetch with TanStack Query)
  // ---------------------------------------------------------

  const fetchCoinData = async (curr) => {
    const apiKey = import.meta.env.VITE_CG_API_KEY;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    };

    // Add API key if available
    const url = apiKey
      ? `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${curr.name}&x_cg_demo_api_key=${apiKey}`
      : `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${curr.name}&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h`;

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  };

  const { data: allCoin = [], isLoading, isError, error } = useQuery({
    queryKey: ["coins", currency.name], // Unique key for caching
    queryFn: () => fetchCoinData(currency),
    staleTime: 60000, // Cache data for 60 seconds
    refetchOnWindowFocus: false,
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
    errorMessage: error?.message,
  }), [allCoin, filteredCoins, selectedFilters, currency, isLoading, isError, error]);

  return (
    <CoinContext.Provider value={contextValue}>
      {props.children}
    </CoinContext.Provider>
  );
};

export default CoinContextProvider;