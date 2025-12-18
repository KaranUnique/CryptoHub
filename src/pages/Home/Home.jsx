//@@viewOn:imports
import React, { useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom'

import { CoinContext } from "../../context/CoinContext";
import "./Home.css";
import { PAGE_TEXT } from "../../constants/pages";
import { BUTTONS } from "../../constants/buttons";
import { buildCoinPath } from "../../constants/routes";
//@@viewOff:imports

const Home = () => {
  //@@viewOn:private
  const { allCoin, currency } = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);

  const [input, setInput] = useState("");

  const inputHandler = (event) => {
    setInput(event.target.value);
    if (event.target.value === "") {
      setDisplayCoin(allCoin);
    }
  };

  const searchHandler = async (event) => {
    event.preventDefault();
    const coins = await allCoin.filter((item) => {
      return item.name.toLowerCase().includes(input.toLowerCase());
    });
    setDisplayCoin(coins);
  };

  useEffect(() => {
    setDisplayCoin(allCoin);
  }, [allCoin]);
  //@@viewOff:private

  //@@viewOn:render
  return (
    <div className="home">
      <div className="hero">
        <h1 className="hero-title">{PAGE_TEXT.HOME.TITLE}</h1>
        <p className="hero-sub">
          {PAGE_TEXT.HOME.WELCOME}
        </p>
        <form className="hero-form" onSubmit={searchHandler} autoComplete="off">
          <input
            onChange={inputHandler}
            list="coinlist"
            value={input}
            type="text"
            placeholder={PAGE_TEXT.HOME.SEARCH_PLACEHOLDER}
            required
          />
          <datalist id="coinlist">
            {allCoin.map((item,index)=>(<option key={index} value={item.name}/>))}
          </datalist>
          <button type="submit">{BUTTONS.SEARCH}</button>
        </form>
      </div>
      <div className="crypto-table">
        <div className="table-layout">
          <p>{PAGE_TEXT.HOME.TABLE.RANK}</p>
          <p>{PAGE_TEXT.HOME.TABLE.COINS}</p>
          <p>{PAGE_TEXT.HOME.TABLE.PRICE}</p>
          <p style={{ textAlign: "center" }}>{PAGE_TEXT.HOME.TABLE.CHANGE_24H}</p>
          <p className="market-cap">{PAGE_TEXT.HOME.TABLE.MARKET_CAP}</p>
        </div>
        {displayCoin.slice(0, 10).map((item, index) => (
          <Link
          to={buildCoinPath(item.id)}
          className="table-layout" key={index}>
            <p>{item.market_cap_rank}</p>
            <div>
              <img src={item.image} alt={"description"}></img>
              <p>{item.name + " - " + item.symbol}</p>
            </div>
            <p>
              {currency.Symbol}
              {item.current_price.toLocaleString()}
            </p>
            <p
              className={item.price_change_percentage_24h > 0 ? "green" : "red"}
            >
              {Math.floor(item.price_change_percentage_24h * 100) / 100}
            </p>
            <p className="market-cap">
              {currency.Symbol}
              {item.market_cap.toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
  //@@viewOff:render
};

//@@viewOn:exports
export default Home;
//@@viewOff:exports
