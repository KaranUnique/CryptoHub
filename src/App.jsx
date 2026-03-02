import React, {
  useEffect,
  useContext,
  useRef,
  lazy,
  Suspense,
  useMemo,
  useState,
} from "react";
import Lenis from "lenis";
import Navbar from "@/components/Layout/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "@/pages/Home/Home";
import Footer from "@/components/Layout/Footer";
import PrivateRoute from "@/components/Auth/PrivateRoute";
import { AuthProvider } from "@/context/AuthProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { CoinContextProvider } from "@/context/CoinContext";
import Contributors from "@/components/Sections/Contributors";
import AOS from "aos";
import "aos/dist/aos.css";
import { CoinContext } from "@/context/CoinContextInstance";
import LoadingSpinner from "@/components/Common/LoadingSpinner";
import RouteLoadingFallback from "@/components/Common/RouteLoadingFallback";
import ErrorBoundary from "@/components/Common/ErrorBoundary";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "@/components/Layout/ScrollToTop";
import "./App.css";
import PageNotFound from "@/components/Common/PageNotFound";
import CryptoChatbot from "./CryptoChatbot/CryptoChatbot";
import Feedback from "./pages/Feedback";
import { validateFirebase, getFirebaseErrorInfo } from "@/utils/firebaseValidation";
import { auth, db } from "@/firebase";
import FirebaseError from "@/components/Common/FirebaseError";
import RateLimitIndicator from "@/components/Common/RateLimitIndicator";

// Lazy-loaded Auth Components (Phase 2: Code Splitting)
const Signup = lazy(() => import("@/components/Auth/Signup"));
const Login = lazy(() => import("@/components/Auth/Login"));
const ForgotPassword = lazy(() => import("@/components/Auth/ForgotPassword"));
const EmailVerification = lazy(() => import("@/components/Auth/EmailVerification"));

// Lazy-loaded Dashboard Components (Phase 3: Code Splitting)
const DashboardLayout = lazy(() => import("@/pages/Dashboard/DashboardLayout"));
const DashboardContent = lazy(() => import("@/pages/Dashboard/DashboardContent"));
const MarketOverview = lazy(() => import("@/pages/Dashboard/MarketOverview"));
const Leaderboard = lazy(() => import("@/components/Dashboard/Leaderboard"));
const ChangePassword = lazy(() => import("@/components/Auth/ChangePassword"));
const SavedInsights = lazy(() => import("@/pages/SavedInsights"));
const Profile = lazy(() => import("@/pages/Dashboard/Profile"));

// Lazy-loaded Page Components (Phase 4: Code Splitting)
const Pricing = lazy(() => import("@/components/Sections/Pricing"));
const Blog = lazy(() => import("@/components/Sections/Blog"));
const Features = lazy(() => import("@/components/Sections/Features"));
const BlogDetail = lazy(() => import("@/components/Sections/BlogDetail"));
const Contributors = lazy(() => import("@/components/Sections/Contributors"));
const ContactUs = lazy(() => import("@/components/Sections/ContactUs"));
const FAQ = lazy(() => import("@/components/Sections/FAQ"));
const About = lazy(() => import("@/components/Sections/About"));
const Feedback = lazy(() => import("./pages/Feedback"));

// Lazy-loaded Crypto Page Components (Phase 5: Code Splitting)
const TrendingCoins = lazy(() => import("@/pages/TrendingCoins"));
const NewListings = lazy(() => import("@/pages/NewListings"));
const TopGainers = lazy(() => import("./pages/TopGainers"));
const TopLosers = lazy(() => import("./pages/TopLosers"));
const ApiAccess = lazy(() => import("./pages/ApiAccess"));
const CoinWrapper = lazy(() => import("@/pages/Home/Coin/CoinWrapper"));
const AIBlogPage = lazy(() => import("./pages/AIBlog/AIBlogPage"));

// Lazy-loaded Legal Page Components (Phase 6: Code Splitting)
const PrivacyPolicy = lazy(() => import("@/components/Legal/PrivacyPolicy.jsx"));
const TermsOfService = lazy(() => import("@/components/Legal/TermsOfService.jsx"));
const CookiePolicy = lazy(() => import("@/components/Legal/CookiePolicy.jsx"));

const App = () => {
  const lenisRef = useRef(null);
  const { isLoading } = useContext(CoinContext);
  const location = useLocation();
  const [firebaseStatus, setFirebaseStatus] = useState({
    validated: false,
    hasError: false,
    errorInfo: null,
    showError: false,
    retrying: false,
    retryAttempt: 0,
  });

  // Firebase validation on app startup (Phase 5: App Startup Integration)
  useEffect(() => {
    const validateFirebaseOnStartup = async () => {
      try {
        const validationResult = await validateFirebase(
          { db, auth },
          {
            skipConnectivityTest: false,
            skipPermissionTest: true, // Skip on startup to avoid delays
          }
        );

        if (!validationResult.isValid) {
          // Extract first error from validation result
          const firstError = validationResult.errors[0];
          const errorType = firstError?.type || 'UNKNOWN';
          const errorMessages = {
            'NOT_CONFIGURED': 'Firebase is not configured. Please check your environment variables.',
            'INVALID_CONFIG': 'Firebase configuration is invalid. Please verify your credentials.',
            'CONNECTION_FAILED': 'Could not connect to Firebase. Please check your internet connection.',
            'NETWORK_ERROR': 'Network error connecting to Firebase. Please try again.',
            'SERVICE_UNAVAILABLE': 'Firebase service is temporarily unavailable.',
            'PERMISSION_DENIED': 'Permission denied accessing Firebase resources.',
            'UNKNOWN': 'An unknown error occurred with Firebase.'
          };
          
          const errorInfo = {
            title: errorType.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' '),
            message: errorMessages[errorType] || errorMessages['UNKNOWN'],
            userAction: 'You can still browse crypto data, but authentication features will be limited.',
            developerAction: 'Check Firebase configuration and network connectivity',
            code: errorType,
            context: 'App Initialization',
            details: validationResult
          };
          
          setFirebaseStatus({
            validated: true,
            hasError: true,
            errorInfo: errorInfo,
            showError: true,
          });

          // Log for developers
          if (import.meta.env.DEV) {
            console.warn("Firebase Validation Failed:", errorInfo);
            console.warn("Details:", validationResult.details);
          }
        } else {
          setFirebaseStatus({
            validated: true,
            hasError: false,
            errorInfo: null,
            showError: false,
          });

          if (import.meta.env.DEV) {
            console.log("✅ Firebase validated successfully");
          }
        }
      } catch (error) {
        const errorInfo = getFirebaseErrorInfo(error, "Firebase Validation");
        setFirebaseStatus({
          validated: true,
          hasError: true,
          errorInfo: errorInfo,
          showError: true,
        });
        
        if (import.meta.env.DEV) {
          console.error("Firebase validation error:", errorInfo);
        }
      }
    };

    validateFirebaseOnStartup();
  }, []);

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

  // Handle Firebase error retry (Phase 6: Retry Mechanisms)
  const handleFirebaseRetry = async () => {
    setFirebaseStatus((prev) => ({ 
      ...prev, 
      showError: false, 
      retrying: true,
      retryAttempt: 0 
    }));
    
    // Re-run validation with retry tracking
    try {
      const validationResult = await validateFirebase(
        { db, auth },
        { 
          skipConnectivityTest: false, 
          skipPermissionTest: true,
          useRetry: true // Enable retry in validation
        }
      );

      if (!validationResult.isValid) {
        // Extract first error from validation result
        const firstError = validationResult.errors[0];
        const errorType = firstError?.type || 'UNKNOWN';
        const errorMessages = {
          'NOT_CONFIGURED': 'Firebase is not configured. Please check your environment variables.',
          'INVALID_CONFIG': 'Firebase configuration is invalid. Please verify your credentials.',
          'CONNECTION_FAILED': 'Could not connect to Firebase. Please check your internet connection.',
          'NETWORK_ERROR': 'Network error connecting to Firebase. Please try again.',
          'SERVICE_UNAVAILABLE': 'Firebase service is temporarily unavailable.',
          'PERMISSION_DENIED': 'Permission denied accessing Firebase resources.',
          'UNKNOWN': 'An unknown error occurred with Firebase.'
        };
        
        const errorInfo = {
          title: errorType.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' '),
          message: errorMessages[errorType] || errorMessages['UNKNOWN'],
          userAction: 'You can still browse crypto data, but authentication features will be limited.',
          developerAction: 'Check Firebase configuration and network connectivity',
          code: errorType,
          context: 'App Initialization',
          details: validationResult
        };
        
        setFirebaseStatus({
          validated: true,
          hasError: true,
          errorInfo: errorInfo,
          showError: true,
          retrying: false,
          retryAttempt: 0,
        });
      } else {
        setFirebaseStatus({
          validated: true,
          hasError: false,
          errorInfo: null,
          showError: false,
          retrying: false,
          retryAttempt: 0,
        });
      }
    } catch (error) {
      const errorInfo = getFirebaseErrorInfo(error, "Firebase Validation");
      setFirebaseStatus({
        validated: true,
        hasError: true,
        errorInfo: errorInfo,
        showError: true,
        retrying: false,
        retryAttempt: 0,
      });
    }
  };

  // Dismiss Firebase error and continue with degraded features
  const handleFirebaseDismiss = () => {
    setFirebaseStatus((prev) => ({ ...prev, showError: false }));
  };

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
      {/* Firebase Error Display (Phase 5: App Startup Integration) */}
      {firebaseStatus.showError && firebaseStatus.errorInfo && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}>
          <FirebaseError
            errorInfo={firebaseStatus.errorInfo}
            severity="warning"
            onRetry={handleFirebaseRetry}
            onDismiss={handleFirebaseDismiss}
            showDeveloperInfo={import.meta.env.DEV}
          />
        </div>
      )}
      <ThemeProvider>
        <AuthProvider>
          <div className="app">
            {isLoading && !isDashboard && <LoadingSpinner />}
            <div
              className={
                isDashboard ? "app-dashboard-container" : "app-container"
              }
            >
              {!isDashboard && <Navbar />}
              <ErrorBoundary fallbackMessage="We're sorry, something went wrong loading this page. Please refresh or try again later.">
                <Suspense fallback={<RouteLoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogDetail />} />
                    <Route path="/blog/article/:id" element={<BlogDetail />} />
                    <Route path="/ai-blog" element={<AIBlogPage />} />
                    <Route path="/trending" element={<TrendingCoins />} />
                    <Route path="/new-listings" element={<NewListings />} />
                    <Route path="/top-losers" element={<TopLosers />} />
                    <Route path="/api-access" element={<ApiAccess />} />

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
                      <Route path="/market-overview" element={<MarketOverview />} />
                      <Route path="/leaderboard" element={<Leaderboard />} />
                      <Route path="/change-password" element={<ChangePassword />} />
                      <Route path="/saved-insights" element={<SavedInsights />} />
                      <Route path="/profile" element={<Profile />} />
                    </Route>
                    <Route path="/coin/:coinId" element={<CoinWrapper />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/contactus" element={<ContactUs />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/feedback" element={<Feedback />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/cookies" element={<CookiePolicy />} />
                    <Route path="*" element={<PageNotFound />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </div>
            <ScrollToTop lenis={lenisRef.current} />
            <CryptoChatbot />
            <RateLimitIndicator />
          </CoinContextProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
