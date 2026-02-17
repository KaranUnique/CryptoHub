
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider, isFirebaseConfigured } from "../firebase";

const AuthContext = createContext({});

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


  //   verify recent authentication 
  const reauthenticateUser = useCallback(async (currentPassword) => {
    if (!isFirebaseConfigured() || !auth || !currentUser) {
      throw new Error(
        "Firebase is not configured. Please add Firebase credentials to use authentication."
      );
    }
    const user = auth.currentUser;
    // create credential with email and current password
    const credentials = EmailAuthProvider.credential(user.email, currentPassword);

    // Re-authenticate the user
    await reauthenticateWithCredential(user, credentials);
  }, [currentUser])


  // signup function
  const signup = useCallback(async (email, password, fullName) => {
    if (!isFirebaseConfigured() || !auth) {
      throw new Error(
        "Firebase is not configured. Please add Firebase credentials to use authentication."
      );
    }
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Send email verification before Firestore writes so offline errors do not block it
    await sendEmailVerification(user, {
      url: window.location.origin + "/dashboard",
      handleCodeInApp: false,
    });

    try {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        fullName: fullName,
        createdAt: serverTimestamp(),
        provider: "email",
      });

      // Initialize leaderboard entry for new user
      await setDoc(doc(db, "leaderboard", user.uid), {
        uid: user.uid,
        displayName: fullName,
        photoURL: null,
        score: 0,
        activitiesCount: 0,
        lastUpdated: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error saving user profile data:", error);
    }

    return userCredential;
  }, []);

  //   login function
  const login = useCallback(async (email, password) => {
    if (!isFirebaseConfigured() || !auth) {
      throw new Error(
        "Firebase is not configured. Please add Firebase credentials to use authentication."
      );
    }
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  }, []);

  //   login with google function
  const loginWithGoogle = useCallback(async () => {
    if (!isFirebaseConfigured() || !auth || !googleProvider) {
      throw new Error(
        "Firebase is not configured. Please add Firebase credentials to use authentication."
      );
    }
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;

    // Check if user document exists, if not create it
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

      // Initialize leaderboard entry for new user
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

  //   logout function
  const logout = useCallback(async () => {
    if (!isFirebaseConfigured() || !auth) {
      return;
    }
    await signOut(auth);
  }, []);

  //   change Password function
  const ChangePassword = useCallback(async (currentPassword, newPassword) => {
    if (!isFirebaseConfigured() || !auth || !auth.currentUser) {
      throw new Error('User  is Not Authenticated');
    }
    const user = auth.currentUser;

    // re-authenticate user
    await reauthenticateUser(currentPassword);

    // update Password
    await updatePassword(user, newPassword);

  }, [reauthenticateUser]);

  //   send email verification
  const sendVerificationEmail = useCallback(async () => {
    if (!isFirebaseConfigured() || !auth?.currentUser) {
      throw new Error('User is not authenticated');
    }

    await sendEmailVerification(auth.currentUser, {
      url: window.location.origin + '/dashboard',
      handleCodeInApp: false,
    });
  }, []);

  //   reload user and check verification status
  const reloadUserVerificationStatus = useCallback(async () => {
    if (!isFirebaseConfigured() || !auth?.currentUser) {
      throw new Error('User is not authenticated');
    }
    await auth.currentUser.reload();
    const user = auth.currentUser;
    // Update current user state with fresh data
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUser({
            ...user,
            fullName: userData.fullName,
          });
        } else {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setCurrentUser(user);
      }
    }

    return user.emailVerified;
  }, []);

  //   reset Password function
  const resetPassword = useCallback(async (email) => {
    if (!isFirebaseConfigured() || !auth) {
      throw new Error(
        "Firebase is not configured. Please add Firebase credentials to use authentication."
      );
    }
    await sendPasswordResetEmail(auth, email);
  }, []);

  //   check if user signed in with email/password
  const isEmailProvider = useCallback(() => {
    if (!auth?.currentUser) return false;

    // check if user has email/password as a  provider
    return auth.currentUser?.providerData?.some(
      (provider) => provider.providerId === 'password');
  }, []);

  //   Monitor auth state changes
  useEffect(() => {
    if (!isFirebaseConfigured() || !auth) {
      setLoading(false);
      return;
    }

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Set user immediately and stop loading - don't wait for Firestore
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        // Fetch additional user data from Firestore in the background
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("Fetched user data from Firestore:", userData);
            // Update user with ALL Firestore data so profile fields persist
            setCurrentUser({
              ...user,
              ...userData,
              photoURL: userData.photoURL || user.photoURL
            });

            // Initialize leaderboard entry if it doesn't exist (in background)
            const leaderboardDoc = await getDoc(
              doc(db, "leaderboard", user.uid)
            );
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
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // User is already set from Firebase auth, just log the error
        }
      }
    });
    return unsubscribe;
  }, []);

  //   update user profile function
  const updateUserProfile = useCallback(async (uid, data, imageFile = null) => {
    if (!isFirebaseConfigured() || !db) {
      throw new Error("Firebase is not configured.");
    }

    let photoURL = data.photoURL;

    // Handle Image Upload if file is provided
    if (imageFile) {
      try {
        console.log("Starting avatar processing...");

        // Step 1: Compress the image client-side using canvas (150x150 JPEG)
        const compressedBase64 = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              const MAX_SIZE = 150;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_SIZE) { height = Math.round(height * MAX_SIZE / width); width = MAX_SIZE; }
              } else {
                if (height > MAX_SIZE) { width = Math.round(width * MAX_SIZE / height); height = MAX_SIZE; }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);

              // Convert to base64 JPEG (quality 0.7 = ~10-20KB)
              const base64 = canvas.toDataURL('image/jpeg', 0.7);
              console.log("Image compressed, base64 length:", base64.length);
              URL.revokeObjectURL(img.src); // Clean up
              resolve(base64);
            } catch (canvasErr) {
              reject(canvasErr);
            }
          };
          img.onerror = () => {
            URL.revokeObjectURL(img.src);
            reject(new Error("Could not load the selected image."));
          };
          img.src = URL.createObjectURL(imageFile);
        });

        photoURL = compressedBase64;
        data.photoURL = photoURL;
        // Note: We store photoURL in Firestore only (not Firebase Auth)
        // because Auth's updateProfile rejects base64 strings

      } catch (error) {
        console.error("Error processing avatar:", error);
        throw new Error("Failed to process profile picture: " + (error.message || "Unknown error"));
      }
    }

    // Save to Firestore
    const userRef = doc(db, "users", uid);
    console.log("Saving profile data to Firestore...", Object.keys(data));
    await updateDoc(userRef, data);
    console.log("Profile saved to Firestore successfully.");

    // Update local state immediately
    setCurrentUser((prev) => ({
      ...prev,
      ...data,
      photoURL: photoURL || prev.photoURL,
      fullName: data.fullName || prev.fullName
    }));

    // If name or photo changed, update leaderboard too
    if (data.fullName || photoURL) {
      try {
        const leaderboardRef = doc(db, "leaderboard", uid);
        const leaderboardUpdate = {};
        if (data.fullName) leaderboardUpdate.displayName = data.fullName;
        if (photoURL) leaderboardUpdate.photoURL = photoURL;

        await updateDoc(leaderboardRef, leaderboardUpdate);
      } catch (error) {
        console.error("Failed to update leaderboard:", error);
      }
    }
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
      sendVerificationEmail,
      reloadUserVerificationStatus,
      updateUserProfile,
    }),
    [currentUser, loading, signup, login, loginWithGoogle, logout, ChangePassword, resetPassword, isEmailProvider, sendVerificationEmail, reloadUserVerificationStatus, updateUserProfile]
  );

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#0a0a0f'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(0, 243, 255, 0.2)',
            borderTop: '4px solid #00f3ff',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};


