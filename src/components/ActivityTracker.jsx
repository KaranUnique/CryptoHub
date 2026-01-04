import React, { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useActivity } from "../context/ActivityContext";
import { useLeaderboard } from "../context/LeaderboardContext";

const ActivityTracker = () => {
  const location = useLocation();
  const { addActivity } = useActivity();
  const { awardPoints } = useLeaderboard();
  const trackedPathsRef = useRef(new Set());

  const trackActivity = useCallback((path) => {
    const pathKey = path;

    if (trackedPathsRef.current.has(pathKey)) {
      return;
    }

    let activity = null;
    let activityType = null;

    if (path === "/") {
      activity = {
        icon: "🏠",
        title: "Viewed Market",
        description: "Explored cryptocurrency market overview",
        type: "info",
      };
      activityType = "dashboard_visit";
    } else if (path === "/pricing") {
      activity = {
        icon: "💎",
        title: "Checked Pricing",
        description: "Viewed pricing plans",
        type: "info",
      };
      activityType = "dashboard_visit";
    } else if (path === "/blog") {
      activity = {
        icon: "📰",
        title: "Read Blog",
        description: "Browsed blog articles",
        type: "info",
      };
      activityType = "dashboard_visit";
    } else if (path === "/features") {
      activity = {
        icon: "✨",
        title: "Explored Features",
        description: "Viewed platform features",
        type: "info",
      };
      activityType = "dashboard_visit";
    } else if (path.startsWith("/coin/")) {
      const coinId = path.split("/")[2];
      activity = {
        icon: "🪙",
        title: "Viewed Coin",
        description: `Checked ${coinId.toUpperCase()} details`,
        type: "info",
      };
      activityType = "coin_view";
    } else if (path.startsWith("/blog/")) {
      activity = {
        icon: "📄",
        title: "Read Article",
        description: "Read a blog post",
        type: "info",
      };
      activityType = "dashboard_visit";
    } else if (path === "/dashboard") {
      activityType = "dashboard_visit";
    }

    if (activity && !["/login", "/signup"].includes(path)) {
      trackedPathsRef.current.add(pathKey);
      addActivity(activity);
    }

    if (activityType) {
      awardPoints(activityType);
    }
  }, [addActivity, awardPoints]);

  useEffect(() => {
    trackActivity(location.pathname);
  }, [location.pathname, trackActivity]);

  return null;
};

export default ActivityTracker;
