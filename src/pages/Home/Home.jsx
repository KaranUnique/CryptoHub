import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import { CoinContext } from "../../context/CoinContext";
import { Link } from "react-router-dom";
import { FiFilter } from "react-icons/fi";
import LoadingSpinner from "../../components/LoadingSpinner";

const Home = () => {
  const { allCoin, currency, isLoading } = useContext(CoinContext);

const Home = () => {
  const { allCoin, currency } = useContext(CoinContext);

  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const inputHandler = (e) => {
    setInput(e.target.value);
    if (e.target.value === "") setDisplayCoin(allCoin);
  };

  const searchHandler = (e) => {
    e.preventDefault();
    setDisplayCoin(
      allCoin.filter((item) =>
        item.name.toLowerCase().includes(input.toLowerCase())
      )
    );
  };

  const applyFilters = () => {
    let filtered = [...allCoin];

    if (minPrice)
      filtered = filtered.filter(
        (coin) => coin.current_price >= Number(minPrice)
      );

    if (maxPrice)
      filtered = filtered.filter(
        (coin) => coin.current_price <= Number(maxPrice)
      );

    setDisplayCoin(filtered);
    setShowFilters(false);
  };

  const loadMoreHandler = () => {
    setVisibleCount(prev => prev + 5);
  };

  useEffect(() => {
    setDisplayCoin(allCoin);
  }, [allCoin]);

  // Show loading spinner if data is loading
  if (isLoading && allCoin.length === 0) {
    return (
      <div className="home">
        <div className="hero">
          <h1 data-aos="fade-in" className="hero-title">Discover & Track Crypto Instantly</h1>
          <p data-aos="fade-in" className="hero-sub">
            Welcome to CryptoHub — your gateway to real-time prices, trending coins, and powerful analytics. Search any coin and start exploring the world of crypto!
          </p>
          <div className="search-wrapper">
            <form className="hero-form" onSubmit={searchHandler} autoComplete="off">
              <input
                onChange={inputHandler}
                list="coinlist"
                value={input}
                type="text"
                placeholder="Search for a coin..."
                required
                disabled={isLoading}
              />
              <datalist id="coinlist">
                {allCoin && allCoin.map((item, index) => (<option key={index} value={item.name} />))}
              </datalist>
              <button type="submit" disabled={isLoading}>Search</button>
              <button
                type="button"
                className="filter-btn"
                onClick={() => setShowFilters(!showFilters)}
                disabled={isLoading}
              >
                <FiFilter size={20} />
              </button>
            </form>
          </div>
        </div>
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      </div>
    );
  }
  useEffect(() => {
    setDisplayCoin(allCoin);
  }, [allCoin]);

  return (
    <div className="home">
      <div className="hero">
        <h1 data-aos="fade-in" className="hero-title">Discover & Track Crypto Instantly</h1>
        <p data-aos="fade-in" className="hero-sub">
          Welcome to CryptoHub — your gateway to real-time prices, trending coins, and powerful analytics.
        <h1 className="hero-title">Discover & Track Crypto Instantly</h1>
        <p className="hero-sub">
          Welcome to CryptoHub — your gateway to real-time prices, trending coins,
          and powerful analytics.
        </p>

        <div className="search-wrapper">
          <form className="hero-form" onSubmit={searchHandler}>
            <input
              value={input}
              onChange={inputHandler}
              list="coinlist"
              placeholder="Search for a coin..."
              required
              disabled={isLoading}
            />

            <datalist id="coinlist">
              {allCoin?.map((c, i) => (
                <option key={i} value={c.name} />
              ))}
            </datalist>

            <button type="submit" disabled={isLoading}>Search</button>
            <button type="submit">Search</button>

            <button
              type="button"
              className="filter-btn"
              onClick={() => setShowFilters(!showFilters)}
              disabled={isLoading}
            >
              <FiFilter size={20} />
            </button>
          </form>

          {showFilters && (
            <div className="filter-panel right">
              

              <div className="filter-group">
                <label>Min Price</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label>Max Price</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              <div className="filter-actions">
                <button onClick={applyFilters}>Apply</button>
                <button
                  className="reset"
                  onClick={() => setShowFilters(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="crypto-table">
        <div className="table-layout">
          <p>#</p>
          <p>Coins</p>
          <p>Price</p>
          <p style={{ textAlign: "center" }}>24h Change</p>
          <p className="market-cap">Market Cap</p>
        </div>

        {displayCoin.slice(0, visibleCount).map((item, index) => (
          <Link
            to={`/coin/${item.id}`}
            className="table-layout"
            key={index}
            data-aos="fade-up"
          >
            <p>{item.market_cap_rank}</p>
            <div>
              <img src={item.image} alt={item.name} width="40" height="40"></img>
              <p>{item.name + " - " + item.symbol}</p>
            </div>
            <p>{currency.Symbol}{item.current_price.toLocaleString()}</p>
            <p className={item.price_change_percentage_24h > 0 ? "green" : "red"}>
              {item.price_change_percentage_24h.toFixed(2)}
            </p>
            <p className="market-cap">
              {currency.Symbol}{item.market_cap.toLocaleString()}
            </p>
          </Link>
        ))}

        {/* Load More Button */}
        {visibleCount < displayCoin.length && (
          <div className="load-more">
            <button onClick={() => setVisibleCount(visibleCount + 10)}>
              Load More
            </button>
          </div>
        )}
      </div>
      
      {isLoading && allCoin.length > 0 ? (
        <div className="table-loading">
          <p>Refreshing data...</p>
          <div className="mini-spinner"></div>
        </div>
      ) : (
        <div className="crypto-table">
          <div data-aos="fade-up" className="table-layout">
            <p>#</p>
            <p>Coins</p>
            <p>Price</p>
            <p style={{ textAlign: "center" }}>24h Change</p>
            <p className="market-cap">Market Cap</p>
          </div>
          
          {displayCoin.slice(0, visibleCount).map((item, index) => (
            <Link
              to={`/coin/${item.id}`}
              className="table-layout"
              key={index}
              data-aos="fade-up"
            >
              <p>{item.market_cap_rank}</p>
              <div>
                <img src={item.image} alt={item.name} />
                <p>{item.name + " - " + item.symbol}</p>
              </div>
              <p>
                {currency.Symbol}
                {item.current_price.toLocaleString()}
              </p>
              <p
                className={item.price_change_percentage_24h > 0 ? "green" : "red"}
              >
                {Math.floor(item.price_change_percentage_24h * 100) / 100}%
              </p>
              <p className="market-cap">
                {currency.Symbol}
                {item.market_cap.toLocaleString()}
              </p>
            </Link>
          ))}
          
          {/* LOAD MORE BUTTON */}
          {visibleCount < displayCoin.length && (
            <div className="load-more">
              <button onClick={loadMoreHandler}>Load More</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
