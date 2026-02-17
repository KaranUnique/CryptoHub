
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { collection, query, orderBy, limit, onSnapshot, doc, setDoc, getDoc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase";
import { useAuth } from "./AuthContext";

const LeaderboardContext = createContext({});

export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error("useLeaderboard must be used within a LeaderboardProvider");
  }
  return context;
};

export const LeaderboardProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard data
  useEffect(() => {
    if (!isFirebaseConfigured() || !db) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "leaderboard"),
      orderBy("score", "desc"),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leaderboardData = [];
      snapshot.forEach((doc) => {
        leaderboardData.push({ id: doc.id, ...doc.data() });
      });
      setLeaderboard(leaderboardData);
      setLoading(false);

      // Find current user's rank
      if (currentUser) {
        const userIndex = leaderboardData.findIndex(entry => entry.uid === currentUser.uid);
        setUserRank(userIndex !== -1 ? userIndex + 1 : null);
      }
    }, (error) => {
      console.error("Error fetching leaderboard:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Initialize user leaderboard entry
  const initializeUserLeaderboard = useCallback(async (uid, displayName, photoURL) => {
    if (!isFirebaseConfigured() || !db) {
      return;
    }
    try {
      const leaderboardRef = doc(db, "leaderboard", uid);
      const leaderboardDoc = await getDoc(leaderboardRef);

      if (!leaderboardDoc.exists()) {
        await setDoc(leaderboardRef, {
          uid: uid,
          displayName: displayName || "Anonymous",
          photoURL: photoURL || null,
          score: 0,
          activitiesCount: 0,
          lastUpdated: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error initializing leaderboard:", error);
    }
  }, []);

  // Update user score
  const updateUserScore = useCallback(async (uid, points) => {
    if (!uid || !isFirebaseConfigured() || !db) return;

    try {
      const leaderboardRef = doc(db, "leaderboard", uid);
      await updateDoc(leaderboardRef, {
        score: increment(points),
        activitiesCount: increment(1),
        lastUpdated: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating score:", error);
    }
  }, []);

  // Award points based on activity type
  const awardPoints = useCallback(async (activityType) => {
    if (!currentUser) return;

    const pointsMap = {
      "coin_view": 1,
      "portfolio_add": 5,
      "portfolio_update": 2,
      "dashboard_visit": 1,
      "search": 1,
      "chart_view": 2,
      "price_alert": 3,
    };

    const points = pointsMap[activityType] || 1;
    await updateUserScore(currentUser.uid, points);
  }, [currentUser, updateUserScore]);

  const value = useMemo(() => ({
    leaderboard,
    userRank,
    loading,
    initializeUserLeaderboard,
    updateUserScore,
    awardPoints,
  }), [leaderboard, userRank, loading, initializeUserLeaderboard, updateUserScore, awardPoints]);

  return (
    <LeaderboardContext.Provider value={value}>
      {children}
    </LeaderboardContext.Provider>
  );
};


