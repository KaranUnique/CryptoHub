import React, { useEffect, useContext } from "react";
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
import ChangePassword from "./components/ChangePassword";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Contributors from "./components/Contributors";
import AOS from "aos";
import "aos/dist/aos.css";
import { CoinContext } from "./context/CoinContext";
import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";


const App = () => {
  const { isLoading } = useContext(CoinContext);
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <>
    <Toaster
  position="top-center"
  toastOptions={{
    style: {
      background: "rgba(15, 15, 25, 0.9)",
      color: "#fff",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(139, 92, 246, 0.3)",
      borderRadius: "12px",
    },
    success: {
      iconTheme: {
        primary: "#22c55e",
        secondary: "#0f0f19",
      },
    },
    error: {
      iconTheme: {
        primary: "#ef4444",
        secondary: "#0f0f19",
      },
    },
  }}
/>
      <ThemeProvider>
        <AuthProvider>
          <div className="app">
            {/* Loading Spinner - will show when isLoading is true */}
            {isLoading && !isDashboard && <LoadingSpinner />}

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
               <Route path="/contributors" element={<Contributors />} />

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
                 <Route
                    path="/change-password"
                    element={
                      <PrivateRoute>
                        <ChangePassword />
                      </PrivateRoute>
                    }
                    />
              </Routes>
                {!isDashboard && <Footer />}
              </div>
              <ScrollToTop />
          </AuthProvider>
        </ThemeProvider>
   </>
  );
};

export default App;