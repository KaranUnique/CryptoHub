import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return children;
  }

  // If user is not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Check if user needs email verification
  // Allow access to verification page itself
  const isVerificationPage = location.pathname === "/verify-email";
  
  // Check if user is using email/password provider (not Google/other OAuth)
  const isEmailPasswordUser = currentUser.providerData?.some(
    (provider) => provider.providerId === "password"
  );
  
  // Redirect to verification page if:
  // 1. User is using email/password authentication
  // 2. Email is not verified
  // 3. Not already on the verification page
  if (isEmailPasswordUser && !currentUser.emailVerified && !isVerificationPage) {
    return <Navigate to="/verify-email" />;
  }

  return children;
};

export default PrivateRoute;
