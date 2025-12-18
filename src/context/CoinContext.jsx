//@@viewOn:imports
import { createContext, useEffect, useState } from "react";
//@@viewOff:imports

// eslint-disable-next-line react-refresh/only-export-components
export const CoinContext = createContext();

export const CoinContextProvider = (props) => {
  //@@viewOn:private
  const [allCoin, setAllCoin] = useState([]);
  const [currency, setCurrency] = useState({
    name: "usd",
    Symbol: "$",
  });

  const fetchAllCoin = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": import.meta.env.VITE_CG_API_KEY,
      },
    };

    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}`,
      options
    )
      .then((res) => res.json())
      .then((res) => setAllCoin(res))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchAllCoin();
  }, [currency]);

  const contextValue = {
    allCoin,
    currency,
    setCurrency,
  };
  //@@viewOff:private

  //@@viewOn:render
  return (
    <CoinContext.Provider value={contextValue}>
      {props.children}
    </CoinContext.Provider>
  );
  //@@viewOff:render
};
