import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase";
import { useAuth } from "./useAuth";
import { getFirebaseErrorInfo } from "../utils/firebaseValidation";
import { notifyError, notifySuccess } from "../utils/notify";

const LeaderboardContext = createContext({});

export const LeaderboardProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch leaderboard data
  useEffect(() => {
    if (!isFirebaseConfigured() || !db) {
      setLoading(false);
      setError(null); // Not an error if Firebase is not configured
      return;
    }

    const q = query(
      collection(db, "leaderboard"),
      orderBy("score", "desc"),
      limit(100),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const leaderboardData = [];
        snapshot.forEach((doc) => {
          leaderboardData.push({ id: doc.id, ...doc.data() });
        });
        setLeaderboard(leaderboardData);
        setLoading(false);
        setError(null);

        // Find current user's rank
        if (currentUser) {
          const userIndex = leaderboardData.findIndex(
            (entry) => entry.uid === currentUser.uid,
          );
          setUserRank(userIndex !== -1 ? userIndex + 1 : null);
        }
      },
      (error) => {
        const errorInfo = getFirebaseErrorInfo(error, "Leaderboard Fetch");
        if (import.meta.env.DEV) {
          console.error("Error fetching leaderboard:", errorInfo);
        }
        setError(errorInfo);
        setLoading(false);
        // Don't show toast for leaderboard fetch errors as they're non-critical
      },
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Initialize user leaderboard entry
  const initializeUserLeaderboard = useCallback(
    async (uid, displayName, photoURL) => {
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
        const errorInfo = getFirebaseErrorInfo(error, "Leaderboard Initialization");
        if (import.meta.env.DEV) {
          console.error("Error initializing leaderboard:", errorInfo);
        }
        // Silent failure - leaderboard is not critical for app functionality
      }
    },
    [],
  );

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
      const errorInfo = getFirebaseErrorInfo(error, "Score Update");
      if (import.meta.env.DEV) {
        console.error("Error updating score:", errorInfo);
      }
      // Silent failure - score updates are not critical
    }
  }, []);

  // Award points based on activity type
  const awardPoints = useCallback(
    async (activityType) => {
      if (!currentUser) return;

      const pointsMap = {
        coin_view: 1,
        portfolio_add: 5,
        portfolio_update: 2,
        dashboard_visit: 1,
        search: 1,
        chart_view: 2,
        price_alert: 3,
      };

      const points = pointsMap[activityType] || 1;
      await updateUserScore(currentUser.uid, points);
    },
    [currentUser, updateUserScore],
  );

  const value = useMemo(
    () => ({
      leaderboard,
      userRank,
      loading,
      error,
      initializeUserLeaderboard,
      updateUserScore,
      awardPoints,
    }),
    [
      leaderboard,
      userRank,
      loading,
      error,
      initializeUserLeaderboard,
      updateUserScore,
      awardPoints,
    ],
  );

  return (
    <LeaderboardContext.Provider value={value}>
      {children}
    </LeaderboardContext.Provider>
  );
};

export default LeaderboardContext;
