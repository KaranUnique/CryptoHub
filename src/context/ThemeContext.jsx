
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("cryptohub-theme");
    return savedTheme || "dark";
  });

  useEffect(() => {
    requestAnimationFrame(() => {
      localStorage.setItem("cryptohub-theme", theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
    });
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(() => ({
    theme,
    isDark: theme === "dark",
    toggleTheme,
    setTheme,
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};


