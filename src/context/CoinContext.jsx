import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CoinContext } from "./CoinContextInstance";

// Removed the export { CoinContext } from here to fix Vite Fast Refresh warning.
// Only the React component (Provider) should be exported from this file.

const CoinContextProvider = (props) => {
  const [selectedFilters, setSelectedFilters] = useState(["all"]);
  const [currency, setCurrency] = useState({
    name: "usd",
    symbol: "$",
  });

  // Function to fetch coin data from the CoinGecko API based on currency
  const fetchCoinData = async (curr) => { 
    const apiKey = import.meta.env.VITE_CG_API_KEY;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    };

    const url = apiKey
      ? `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${curr.name}&order=market_cap_desc&per_page=250&page=1&x_cg_demo_api_key=${apiKey}&sparkline=false&price_change_percentage=1h,24h,7d`
      : `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${curr.name}&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=1h,24h,7d`;

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  };

  // Using React Query to fetch and cache coin data automatically
  const {
    data: allCoin = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["coins", currency.name],
    queryFn: () => fetchCoinData(currency),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  // Memoizing the filtered coins list to optimize performance and prevent re-renders
  const filteredCoins = useMemo(() => {
    if (!Array.isArray(allCoin) || allCoin.length === 0) return [];

    if (selectedFilters.length === 1 && selectedFilters[0] === "all") {
      return allCoin;
    }

    let result = [];

    if (selectedFilters.includes("trending")) {
      const trendingCoins = [...allCoin]
        .sort((a, b) => b.total_volume - a.total_volume)
        .slice(0, 20);
      result.push(...trendingCoins);
    }

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

    return Array.from(new Map(result.map((coin) => [coin.id, coin])).values());
  }, [allCoin, selectedFilters]);

  // Providing the context values to be used by child components
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
      errorMessage: error?.message,
    }),
    [
      allCoin,
      filteredCoins,
      selectedFilters,
      currency,
      isLoading,
      isError,
      error,
    ],
  );

  return (
    <CoinContext.Provider value={contextValue}>
      {props.children}
    </CoinContext.Provider>
  );
};

// Export ONLY the provider component to ensure Fast Refresh works correctly
export default CoinContextProvider;