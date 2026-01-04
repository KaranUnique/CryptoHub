import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Coin from "./pages/Home/Coin/Coin";
import Footer from "./components/Footer";
import Pricing from "./components/Pricing";
import Blog from "./components/Blog";
import Features from "./components/Features";
import Signup from "./components/Signup";
import Login from "./components/Login";
import BlogDetail from "./components/BlogDetail";
import Dashboard from "./pages/Dashboard/Dashboard";
import Leaderboard from "./components/Leaderboard";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import AOS from "aos";
import "aos/dist/aos.css";

const App = () => {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="app">
          {!isDashboard && <Navbar />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/coin/:coinId" element={<Coin />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/features" element={<Features />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/leaderboard"
              element={
                <PrivateRoute>
                  <Leaderboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
          {!isDashboard && <Footer />}
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
