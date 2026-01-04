import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

const ActivityContext = createContext({});

// eslint-disable-next-line react-refresh/only-export-components
export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivity must be used within an ActivityProvider");
  }
  return context;
};

export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const savedActivities = localStorage.getItem("cryptohub-activities");
    if (savedActivities) {
      try {
        setActivities(JSON.parse(savedActivities));
      } catch (error) {
        console.error("Error loading activities:", error);
        setActivities([]);
      }
    }
  }, []);

  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem("cryptohub-activities", JSON.stringify(activities));
    }
  }, [activities]);

  const addActivity = useCallback((activity) => {
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newActivity = {
      ...activity,
      id: uniqueId,
      timestamp: new Date().toISOString(),
    };

    setActivities((prev) => {
      const updated = [newActivity, ...prev].slice(0, 10);
      return updated;
    });
  }, []);

  const clearActivities = useCallback(() => {
    setActivities([]);
    localStorage.removeItem("cryptohub-activities");
  }, []);

  const value = useMemo(() => ({
    activities, addActivity, clearActivities,
  }), [activities, addActivity, clearActivities]);

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
};

export default ActivityContext;
