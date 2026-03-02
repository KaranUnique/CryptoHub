import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { validateFirebaseConfig } from "./utils/firebaseValidation";

// Firebase initialization state
let app = null;
let auth = null;
let db = null;
let googleProvider = null;
let firebaseValidationResult = null;
let initializationError = null;

/**
 * Check if Firebase credentials are configured
 * Enhanced with validation utility
 */
const isFirebaseConfigured = () => {
  const configCheck = validateFirebaseConfig();
  return configCheck.isValid;
};

/**
 * Get detailed Firebase configuration status
 * @returns {Object} Validation result with details
 */
const getFirebaseConfigStatus = () => {
  return validateFirebaseConfig();
};

// Initialize Firebase if configured
if (isFirebaseConfigured()) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);

    // Set default persistence to local storage for login persistence across page refreshes
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      if (import.meta.env.DEV) {
        console.warn('Failed to set auth persistence:', error);
      }
      initializationError = {
        stage: 'persistence',
        error: error.message,
        code: error.code,
      };
    });

    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();

    // Log successful initialization in development
    if (import.meta.env.DEV) {
      console.log('✓ Firebase initialized successfully');
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Firebase initialization failed:', error);
    }
    initializationError = {
      stage: 'initialization',
      error: error.message,
      code: error.code,
      stack: error.stack,
    };
    
    // Clear partially initialized instances
    app = null;
    auth = null;
    db = null;
    googleProvider = null;
  }
} else {
  // Log configuration status with details
  const configStatus = validateFirebaseConfig();
  
  if (import.meta.env.DEV) {
    console.warn('⚠ Firebase not configured. Authentication features will be disabled.');
    
    if (configStatus.missingVars.length > 0) {
      console.warn('Missing environment variables:', configStatus.missingVars);
    }
    if (configStatus.placeholderVars.length > 0) {
      console.warn('Placeholder values detected in:', configStatus.placeholderVars);
    }
  }
  
  initializationError = {
    stage: 'configuration',
    details: configStatus,
  };
}

/**
 * Get Firebase initialization error if any
 * @returns {Object|null} Error details or null if no error
 */
const getInitializationError = () => {
  return initializationError;
};

/**
 * Check if Firebase is ready to use
 * @returns {boolean} True if Firebase is fully initialized and ready
 */
const isFirebaseReady = () => {
  return app !== null && auth !== null && db !== null;
};

export { 
  auth, 
  db, 
  googleProvider, 
  isFirebaseConfigured,
  getFirebaseConfigStatus,
  getInitializationError,
  isFirebaseReady,
};

export default app;
