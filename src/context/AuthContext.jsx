/* eslint-disable react-refresh/only-export-components */
import React, { useContext, useState, useEffect, useMemo, useCallback } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider, isFirebaseConfigured } from "../firebase";
import { AuthContext } from "./contexts";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const reauthenticateUser = useCallback(async (currentPassword) => {
    if (!isFirebaseConfigured() || !auth || !currentUser) {
      throw new Error(
        "Firebase is not configured. Please add Firebase credentials to use authentication."
      );
    }
    const user = auth.currentUser;
    const credentials = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credentials);
  }, [currentUser]);

  const signup = useCallback(async (email, password, fullName) => {
    if (!isFirebaseConfigured() || !auth) {
      throw new Error(
        "Firebase is not configured. Please add Firebase credentials to use authentication."
      );
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      fullName: fullName,
      createdAt: serverTimestamp(),
      provider: "email",
    });

    await setDoc(doc(db, "leaderboard", user.uid), {
      uid: user.uid,
      displayName: fullName,
      photoURL: null,
      score: 0,
      activitiesCount: 0,
      lastUpdated: serverTimestamp(),
    });

    return userCredential;
  }, []);

  const login = useCallback(async (email, password) => {
    if (!isFirebaseConfigured() || !auth) {
      throw new Error(
        "Firebase is not configured. Please add Firebase credentials to use authentication."
      );
    }
    await setPersistence(auth, browserSessionPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    if (!isFirebaseConfigured() || !auth || !googleProvider) {
      throw new Error(
        "Firebase is not configured. Please add Firebase credentials to use authentication."
      );
    }
    await setPersistence(auth, browserSessionPersistence);
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        fullName: user.displayName || "Google User",
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        provider: "google",
      });

      await setDoc(doc(db, "leaderboard", user.uid), {
        uid: user.uid,
        displayName: user.displayName || "Google User",
        photoURL: user.photoURL,
        score: 0,
        activitiesCount: 0,
        lastUpdated: serverTimestamp(),
      });
    }

    return userCredential;
  }, []);

  const logout = useCallback(async () => {
    if (!isFirebaseConfigured() || !auth) {
      return;
    }
    await signOut(auth);
  }, []);

  const ChangePassword = useCallback(async (currentPassword, newPassword) => {
    if (!isFirebaseConfigured() || !auth || !auth.currentUser) {
      throw new Error("User is Not Authenticated");
    }
    const user = auth.currentUser;
    await reauthenticateUser(currentPassword);
    await updatePassword(user, newPassword);
  }, [reauthenticateUser]);

  const resetPassword = useCallback(async (email) => {
    if (!isFirebaseConfigured() || !auth) {
      throw new Error(
        "Firebase is not configured. Please add Firebase credentials to use authentication."
      );
    }
    await sendPasswordResetEmail(auth, email);
  }, []);

  const isEmailProvider = useCallback(() => {
    if (!auth?.currentUser) return false;
    return auth.currentUser.providerData.some((provider) => provider.providerId === "password");
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured() || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser({ ...user, fullName: userData.fullName });

            const leaderboardDoc = await getDoc(doc(db, "leaderboard", user.uid));
            if (!leaderboardDoc.exists()) {
              await setDoc(doc(db, "leaderboard", user.uid), {
                uid: user.uid,
                displayName: userData.fullName || user.displayName || "User",
                photoURL: user.photoURL || null,
                score: 0,
                activitiesCount: 0,
                lastUpdated: serverTimestamp(),
              });
            }
          } else {
            setCurrentUser(user);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      signup,
      login,
      loginWithGoogle,
      logout,
      ChangePassword,
      resetPassword,
      isEmailProvider,
    }),
    [currentUser, loading, signup, login, loginWithGoogle, logout, ChangePassword, resetPassword, isEmailProvider]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// AuthContext object is exported from `src/context/contexts.js` to satisfy fast-refresh rule.
