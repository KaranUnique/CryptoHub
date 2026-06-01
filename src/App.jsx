import React, { useEffect, useContext, useRef, Suspense, useMemo } from "react";
import Lenis from "lenis";
import Navbar from "@/components/Layout/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "@/pages/Home/Home";
import CoinWrapper from "@/pages/Home/Coin/CoinWrapper";
import Footer from "@/components/Layout/Footer";
import Pricing from "@/components/Sections/Pricing";
import Blog from "@/components/Sections/Blog";
import Features from "@/components/Sections/Features";
import Signup from "@/components/Auth/Signup";
import Login from "@/components/Auth/Login";
import EmailVerification from "@/components/Auth/EmailVerification";
import BlogDetail from "@/components/Sections/BlogDetail";
import DashboardLayout from "@/pages/Dashboard/DashboardLayout";
import DashboardContent from "@/pages/Dashboard/DashboardContent";
import MarketOverview from "@/pages/Dashboard/MarketOverview";
import Leaderboard from "@/components/Dashboard/Leaderboard";
import ChangePassword from "@/components/Auth/ChangePassword";
import SavedInsights from "@/pages/SavedInsights";
import Profile from "@/pages/Dashboard/Profile";
import ForgotPassword from "@/components/Auth/ForgotPassword";
import PrivateRoute from "@/components/Auth/PrivateRoute";
import { AuthProvider } from "@/context/AuthProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import Contributors from "@/components/Sections/Contributors";
import AOS from "aos";
import "aos/dist/aos.css";
import { CoinContext } from "@/context/CoinContextInstance";
import LoadingSpinner from "@/components/Common/LoadingSpinner";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "@/components/Layout/ScrollToTop";
import PrivacyPolicy from "@/components/Legal/PrivacyPolicy.jsx";
import TermsOfService from "@/components/Legal/TermsOfService.jsx";
import CookiePolicy from "@/components/Legal/CookiePolicy.jsx";
import "./App.css";
import ContactUs from "@/components/Sections/ContactUs";
import FAQ from "@/components/Sections/FAQ";
import PageNotFound from "@/components/Common/PageNotFound";
import About from "@/components/Sections/About";
import CryptoChatbot from "./CryptoChatbot/CryptoChatbot";
import Feedback from "./pages/Feedback";
import PortfolioExportPage from "./pages/Dashboard/PortfolioExportPage";

import TrendingCoins from "@/pages/TrendingCoins";
import NewListings from "@/pages/NewListings";
import TopGainers from "./pages/TopGainers";
import TopLosers from "./pages/TopLosers";
import ApiAccess from "./pages/ApiAccess";
import AIBlogPage from "./pages/AIBlog/AIBlogPage";
import TermsConditions from "./pages/TermsConditions";
import Watchlist from "./pages/Watchlist";
import { WatchlistProvider } from "@/context/WatchlistContext";

const App = () => {
  const lenisRef = useRef(null);
  const { isLoading } = useContext(CoinContext);
  const location = useLocation();

  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.08,
      wheelMultiplier: 1,
      smoothTouch: false,
    });

    lenisRef.current = lenis;

    let animationFrameId;

    const raf = (time) => {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    };

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const dashboardRoutes = useMemo(
    () => [
      "/dashboard",
      "/leaderboard",
      "/market-overview",
      "/change-password",
      "/saved-insights",
      "/profile",
      "/portfolio-export",
    ],
    [],
  );

  const authRoutes = useMemo(
    () => ["/login", "/signup", "/forgot-password", "/verify-email"],
    [],
  );

  const isDashboard = dashboardRoutes.includes(location.pathname);
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
          <WatchlistProvider>
            <div className="app">
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
                  <Route path="/blog/:slug" element={<BlogDetail />} />
                  <Route path="/blog/article/:id" element={<BlogDetail />} />
                  <Route
                    path="/ai-blog"
                    element={
                      <Suspense
                        fallback={
                          <div
                            style={{
                              minHeight: "100vh",
                              background: "#0a0a0a",
                            }}
                          />
                        }
                      >
                        <AIBlogPage />
                      </Suspense>
                    }
                  />
                  <Route path="/trending" element={<TrendingCoins />} />
                  <Route path="/new-listings" element={<NewListings />} />
                  <Route path="/top-losers" element={<TopLosers />} />
                  <Route path="/api-access" element={<ApiAccess />} />
                  <Route path="/watchlist" element={<Watchlist />} />

                  <Route path="/gainers" element={<TopGainers />} />

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
                  <Route
                    element={
                      <PrivateRoute>
                        <DashboardLayout />
                      </PrivateRoute>
                    }
                  >
                    <Route path="/dashboard" element={<DashboardContent />} />
                    <Route
                      path="/market-overview"
                      element={<MarketOverview />}
                    />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route
                      path="/change-password"
                      element={<ChangePassword />}
                    />
                    <Route path="/saved-insights" element={<SavedInsights />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route
                      path="/portfolio-export"
                      element={<PortfolioExportPage />}
                    />
                  </Route>
                  <Route path="/coin/:coinId" element={<CoinWrapper />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsConditions />} />
                  <Route path="/contactus" element={<ContactUs />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/cookies" element={<CookiePolicy />} />
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </div>
              {!isDashboard && !isAuthPage && <Footer />}
            </div>
            <ScrollToTop lenis={lenisRef.current} />
            <CryptoChatbot />
          </WatchlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
