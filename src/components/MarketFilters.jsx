import React, { useState } from 'react'
import { useContext } from "react";
import { CoinContext } from "../context/CoinContextInstance";
import "./MarketFilters.css";

const MarketFilters = () => {
  const { selectedFilters, setSelectedFilters } = useContext(CoinContext);
  const [open, setOpen] = useState(false);

  const toggleFilter = (filter) => {
    setSelectedFilters((prev) => {
      // If clicking "all", reset to all
      if (filter === "all") return ["all"];

      // If clicking the currently active filter, toggle off to "all"
      if (prev.includes(filter)) return ["all"];

      // Otherwise, switch to the new filter (single selection)
      return [filter];
    });
  };

  return (
    <div className="market-filters-wrapper">
      {/* Mobile toggle button */}
      <button className="filter-toggle" onClick={() => setOpen(!open)}>
        {open ? "✕ Filters" : "☰ Filters"}
      </button>

      <div className={`market-filters ${open ? "open" : "closed"}`}>
        <span className="filter-label">Filters:</span>

        <button
          className={`market-filter-btn ${selectedFilters.includes("all") ? "active" : ""}`}
          onClick={() => toggleFilter("all")}
        >
          All Coins
        </button>

        <button
          className={`market-filter-btn ${selectedFilters.includes("trending") ? "active" : ""}`}
          onClick={() => toggleFilter("trending")}
        >
          Trending
        </button>

        <button
          className={`market-filter-btn ${selectedFilters.includes("top_gainers") ? "active" : ""}`}
          onClick={() => toggleFilter("top_gainers")}
        >
          Top Gainers
        </button>
      </div>
    </div>
  )
}

export default MarketFilters