import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase";
import { useAuth } from "./useAuth";
import toast from "react-hot-toast";

const WatchlistContext = createContext({
  watchlist: [],
  isInWatchlist: () => false,
  toggleWatchlist: () => {},
  clearWatchlist: () => {},
  loading: false,
});

export const useWatchlist = () => useContext(WatchlistContext);

const LOCAL_KEY = "cryptohub_watchlist";

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Load watchlist from localStorage on mount / user change
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Try Firestore first for logged-in users
        if (currentUser && isFirebaseConfigured() && db) {
          const ref = doc(db, "users", currentUser.uid);
          const snap = await getDoc(ref);
          if (snap.exists() && snap.data().watchlist) {
            setWatchlist(snap.data().watchlist);
            localStorage.setItem(LOCAL_KEY, JSON.stringify(snap.data().watchlist));
          } else {
            // Fallback to localStorage
            const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
            setWatchlist(local);
            // Persist to Firestore
            if (local.length > 0) {
              await setDoc(ref, { watchlist: local }, { merge: true });
            }
          }
        } else {
          const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
          setWatchlist(local);
        }
      } catch (err) {
        console.warn("Watchlist load error:", err);
        const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
        setWatchlist(local);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentUser]);

  // Persist helper
  const persist = useCallback(
    async (newList) => {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(newList));
      if (currentUser && isFirebaseConfigured() && db) {
        try {
          const ref = doc(db, "users", currentUser.uid);
          await updateDoc(ref, { watchlist: newList });
        } catch {
          // silent — local storage is the source of truth fallback
        }
      }
    },
    [currentUser],
  );

  const isInWatchlist = useCallback(
    (coinId) => watchlist.includes(coinId),
    [watchlist],
  );

  const toggleWatchlist = useCallback(
    async (coinId, coinName) => {
      let newList;
      if (watchlist.includes(coinId)) {
        newList = watchlist.filter((id) => id !== coinId);
        toast.success(`${coinName || coinId} removed from watchlist`);
      } else {
        newList = [...watchlist, coinId];
        toast.success(`${coinName || coinId} added to watchlist`);
      }
      setWatchlist(newList);
      await persist(newList);
    },
    [watchlist, persist],
  );

  const clearWatchlist = useCallback(async () => {
    setWatchlist([]);
    await persist([]);
    toast.success("Watchlist cleared");
  }, [persist]);

  const value = useMemo(
    () => ({ watchlist, isInWatchlist, toggleWatchlist, clearWatchlist, loading }),
    [watchlist, isInWatchlist, toggleWatchlist, clearWatchlist, loading],
  );

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

export default WatchlistContext;
