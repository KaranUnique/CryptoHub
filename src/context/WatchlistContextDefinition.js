import { createContext, useContext } from "react";

export const WatchlistContextDef = createContext({
  watchlist: [],
  isInWatchlist: () => false,
  toggleWatchlist: () => {},
  clearWatchlist: () => {},
  loading: false,
});

export const useWatchlist = () => useContext(WatchlistContextDef);

export default WatchlistContextDef;
