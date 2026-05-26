import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import CoinContextProvider from "./context/CoinContext";
import { AuthProvider } from "./context/AuthProvider";
import { ThemeProvider } from "./context/ThemeContext";
import { LeaderboardProvider } from "./context/LeaderboardContext";
import { HelmetProvider } from "react-helmet-async";
// 1. Import React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 2. Create the client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <ThemeProvider>
        <AuthProvider>
          <LeaderboardProvider>
            {/* 3. Wrap everything with QueryClientProvider */}
            <QueryClientProvider client={queryClient}>
              <CoinContextProvider>
                <HelmetProvider>
                  <App />
                </HelmetProvider>
              </CoinContextProvider>
            </QueryClientProvider>
          </LeaderboardProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
