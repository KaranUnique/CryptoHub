//@@viewOn:imports
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Coin.css";
import { CoinContext } from "../../../context/CoinContext";
import LineChart from "../../../components/LineChart";
import { PAGE_TEXT } from "../../../constants/pages";
//@@viewOff:imports

const Coin = () => {
  //@@viewOn:private
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const { currency } = useContext(CoinContext);

  const fetchCoinData = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": import.meta.env.VITE_CG_API_KEY,
      },
    };

    fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, options)
      .then((res) => res.json())
      .then((res) => {
        setCoinData(res);
      })
      .catch((err) => console.error(err));
  };

  const fetchHistoricalData = async () => {
    if (!currency?.name) return; // don’t fetch until currency is ready

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": import.meta.env.VITE_CG_API_KEY,
      },
    };

    fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`,
      options
    )
      .then((res) => res.json())
      .then((res) => {
        setHistoricalData(res);
      })
      .catch((err) => console.error("History fetch error:", err));
  };

  useEffect(() => {
    fetchCoinData();
    fetchHistoricalData();
  }, [currency, coinId]);
  //@@viewOff:private

  //@@viewOn:render
  if (!coinData || !historicalData) {
    return (
      <div className="spinner">
        <div className="spin"></div>
      </div>
    );
  }

  return (
    <div className="coin">
      <div className="coin-left">
        <img className="coin-logo" src={coinData?.image?.large} alt={coinData?.name} />
        <div className="coin-name-below">
          {coinData?.name}
          <span className="coin-symbol"> ({coinData?.symbol?.toUpperCase()})</span>
        </div>
        <div className="coin-chart">
          <LineChart historicalData={historicalData} />
        </div>
      </div>
      <div className="coin-right">
        <div className="coin-info">
          <ul>
            <li>{PAGE_TEXT.COIN.MARKET_RANK}</li>
            <li>{coinData.market_cap_rank}</li>
          </ul>
          <ul>
            <li>{PAGE_TEXT.COIN.CURRENT_PRICE}</li>
            <li>
              {currency.Symbol}
              {coinData.market_data.current_price[currency.name].toLocaleString()}
            </li>
          </ul>
          <ul>
            <li>{PAGE_TEXT.COIN.MARKET_CAP}</li>
            <li>
              {currency.Symbol}
              {coinData.market_data.market_cap[currency.name].toLocaleString()}
            </li>
          </ul>
          <ul>
            <li>{PAGE_TEXT.COIN.HIGH_24H}</li>
            <li>
              {currency.Symbol}
              {coinData.market_data.high_24h[currency.name].toLocaleString()}
            </li>
          </ul>
          <ul>
            <li>{PAGE_TEXT.COIN.LOW_24H}</li>
            <li>
              {currency.Symbol}
              {coinData.market_data.low_24h[currency.name].toLocaleString()}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
  //@@viewOff:render
};

//@@viewOn:exports
export default Coin;
//@@viewOff:exports
