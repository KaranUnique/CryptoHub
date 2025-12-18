//@@viewOn:imports
import React, { useContext } from "react";
import "./Navbar.css";

import { CoinContext } from "../context/CoinContext";
import { Link } from "react-router-dom";
import { APP } from "../constants/app";
import { ROUTES } from "../constants/routes";
import { NAV_TEXT } from "../constants/navigation";
import { BUTTONS } from "../constants/buttons";
import { CURRENCIES } from "../constants/currency";
//@@viewOff:imports


function Navbar() {
  //@@viewOn:private
  const { setCurrency } = useContext(CoinContext);

  const currencyHandler = (event) => {
    switch (event.target.value) {
      case CURRENCIES.USD.value: {
        setCurrency({ name: CURRENCIES.USD.name, Symbol: CURRENCIES.USD.Symbol });
        break;
      }
      case CURRENCIES.EUR.value: {
        setCurrency({ name: CURRENCIES.EUR.name, Symbol: CURRENCIES.EUR.Symbol });
        break;
      }
      case CURRENCIES.INR.value: {
        setCurrency({ name: CURRENCIES.INR.name, Symbol: CURRENCIES.INR.Symbol });
        break;
      }
      default: {
        setCurrency({ name: CURRENCIES.USD.name, Symbol: CURRENCIES.USD.Symbol });
        break;
      }
    }
  };
  //@@viewOff:private

  //@@viewOn:render
  return (
    <div className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Link
          to={ROUTES.HOME}
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span className="logo-text">{APP.TITLE}</span>
        </Link>
      </div>
      <ul>
        <Link to={ROUTES.HOME}><li>{NAV_TEXT.HOME}</li></Link>
        <Link to={ROUTES.PRICING}><li>{NAV_TEXT.PRICING}</li></Link>
        <Link to={ROUTES.BLOG}><li>{NAV_TEXT.BLOG}</li></Link>
        <Link to={ROUTES.FEATURES}><li>{NAV_TEXT.FEATURES}</li></Link>
      </ul>
      <div className="nav-right">
        <select onChange={currencyHandler}>
          <option value={CURRENCIES.USD.value}>{CURRENCIES.USD.label}</option>
          <option value={CURRENCIES.EUR.value}>{CURRENCIES.EUR.label}</option>
          <option value={CURRENCIES.INR.value}>{CURRENCIES.INR.label}</option>
        </select>
        <button className="signup-btn">{BUTTONS.SIGN_UP}</button>
      </div>
    </div>
  );
  //@@viewOff:render
}

//@@viewOn:exports
export default Navbar;
//@@viewOff:exports
