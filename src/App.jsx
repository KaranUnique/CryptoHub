import React, { useEffect, useContext, useRef } from "react";
import Lenis from "lenis";
import Navbar from "@/components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "@/pages/Home/Home";
import CoinWrapper from "@/pages/Home/Coin/CoinWrapper";
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";
import Blog from "@/components/Blog";
import Features from "@/components/Features";
import Signup from "@/components/Signup";
import Login from "@/components/Login";
import EmailVerification from "@/components/EmailVerification";
import BlogDetail from "@/components/BlogDetail";
import DashboardLayout from "@/pages/Dashboard/DashboardLayout";
import DashboardContent from "@/pages/Dashboard/DashboardContent";
import MarketOverview from "@/pages/Dashboard/MarketOverview";
import Leaderboard from "@/components/Leaderboard";
import ChangePassword from "@/components/ChangePassword";
import SavedInsights from "@/pages/SavedInsights";
import Profile from "@/pages/Dashboard/Profile";
import ForgotPassword from "@/components/ForgotPassword";
import PrivateRoute from "@/components/PrivateRoute";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Contributors from "@/components/Contributors";
import AOS from "aos";
import "aos/dist/aos.css";
import { CoinContext } from "@/context/CoinContextInstance";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "@/components/ScrollToTop";
import PrivacyPolicy from "@/components/PrivacyPolicy.jsx";
import TermsOfService from "@/components/TermsOfService.jsx";
import CookiePolicy from "@/components/CookiePolicy.jsx";
import "./App.css";
import ContactUs from "./components/ContactUs";
import FAQ from "./components/FAQ";
import PageNotFound from "./components/PageNotFound";
import About from "./components/About";
import CryptoChatbot from "./CryptoChatbot/CryptoChatbot";
import Feedback from "./pages/Feedback";
import TrendingCoins from "@/pages/TrendingCoins";
import NewListings from "@/pages/NewListings";


const App = () => {

  const lenisRef = useRef(null)
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.08,
      wheelMultiplier: 1,
      smoothTouch: false,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const { isLoading } = useContext(CoinContext);
  const location = useLocation();
  const isDashboard =
    location.pathname === "/dashboard" ||
    location.pathname === "/leaderboard" ||
    location.pathname === "/market-overview" ||
    location.pathname === "/change-password" ||
    location.pathname === "/saved-insights";

  const authRoutes = ["/login", "/signup", "/forgot-password", "/verify-email"];
  const isAuthPage = authRoutes.includes(location.pathname);

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

            <div
              className={
                isDashboard ? "app-dashboard-container" : "app-container"
              }
            >
              {!isDashboard && <Navbar />}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/blog" element={<Blog />} />
                {/* Blog detail route supporting both slug and id patterns */}
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/blog/article/:id" element={<BlogDetail />} />
                <Route path="/trending" element={<TrendingCoins />} />
                <Route path="/new-listings" element={<NewListings />} />

                <Route path="/features" element={<Features />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/verify-email"
                  element={
                    <PrivateRoute>
                      <EmailVerification />
                    </PrivateRoute>
                  }
                />
                <Route path="/contributors" element={<Contributors />} />

                {/* Dashboard Layout with nested routes - all share the same sidebar */}
                <Route
                  element={
                    <PrivateRoute>
                      <DashboardLayout />
                    </PrivateRoute>
                  }
                >
                  <Route path="/dashboard" element={<DashboardContent />} />
                  <Route path="/market-overview" element={<MarketOverview />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/change-password" element={<ChangePassword />} />
                  <Route path="/saved-insights" element={<SavedInsights />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>

                {/* Coin route - accessible to all but shows sidebar if logged in */}
                <Route path="/coin/:coinId" element={<CoinWrapper />} />

                {/* Add 404 Route if you implemented it earlier */}
                {/* <Route path="*" element={<NotFound />} /> */}

                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/contactus" element={<ContactUs />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/feedback" element={<Feedback />} />

                {/* About Section */}
                <Route path="/about" element={<About />} />

                {/* Page Not Found */}
                <Route path="*" element={<PageNotFound />} />



                <Route path="/cookies" element={<CookiePolicy />} />
              </Routes>
            </div>
            {!isDashboard && !isAuthPage && <Footer />}
          </div>
          <ScrollToTop lenis={lenisRef.current} />
          <CryptoChatbot />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
