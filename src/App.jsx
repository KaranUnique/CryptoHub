//@@viewOn:imports
import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home/Home";
import Coin from "./pages/Home/Coin/Coin";
import Footer from "./components/Footer";
import Pricing from "./components/Pricing";
import Blog from "./components/Blog";
import Features from "./components/Features";
import { ROUTES } from "./constants/routes";
//@@viewOff:imports

const App = () => {
  //@@viewOn:render
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.COIN} element={<Coin />} />
        <Route path={ROUTES.PRICING} element={<Pricing />} />
        <Route path={ROUTES.BLOG} element={<Blog />} />
        <Route path={ROUTES.FEATURES} element={<Features />} />
      </Routes>
      <Footer />
    </div>
  );
  //@@viewOff:render
};

//@@viewOn:exports
export default App;
//@@viewOff:exports
