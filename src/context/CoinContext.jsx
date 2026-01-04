import { createContext, useEffect, useState, useCallback, useMemo } from "react";

export const CoinContext = createContext();

export const CoinContextProvider = (props) => {
  const [allCoin, setAllCoin] = useState([]);
  const [currency, setCurrency] = useState({
    name: "usd",
    Symbol: "$",
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllCoin = async () => {
    setIsLoading(true);
    
  const fetchAllCoin = useCallback(async () => {
    const apiKey = import.meta.env.VITE_CG_API_KEY;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    };

    // Add API key as query parameter if available
    const url = apiKey
      ? `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}&x_cg_demo_api_key=${apiKey}`
      : `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}`;

    fetch(url, options)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API Error: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        if (Array.isArray(res)) {
          setAllCoin(res);
        } else {
          console.error("Invalid API response:", res);
          setAllCoin([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch coins:", err);
        setAllCoin([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currency.name]);

  useEffect(() => {
    fetchAllCoin();
  }, [fetchAllCoin]);

  const contextValue = useMemo(() => ({
    allCoin,
    currency,
    setCurrency,
    isLoading,
  };
  
  }), [allCoin, currency]);
  return (
    <CoinContext.Provider value={contextValue}>
      {props.children}
    </CoinContext.Provider>
  );
};