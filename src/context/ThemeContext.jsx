import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

// Create and export the context object separately to avoid Vite Fast Refresh warnings
export const ThemeContext = createContext();

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

  // Helper to persist arbitrary data (e.g., watchlist) – can be used by other components
  const setPersistedItem = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to persist ${key}:`, e);
    }
  };
      setPersistedItem,

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      toggleTheme,
      setTheme,
    }),
    [theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Removed `export default ThemeContext;` 
// Now, components should import ThemeProvider for wrapping, and ThemeContext for useContext.