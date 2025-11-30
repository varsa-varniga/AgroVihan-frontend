import { createContext, useContext, useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const auth = getAuth();

  const [firebaseUser, setFirebaseUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [mongoUser, setMongoUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [pendingRedirect, setPendingRedirect] = useState(false);

  const provider = new GoogleAuthProvider();

  // Enhanced Google Login with comprehensive error handling
  const signInWithGoogle = async (useRedirect = false) => {
    try {
      // Configure the provider for better UX
      provider.addScope("email");
      provider.addScope("profile");
      provider.setCustomParameters({
        prompt: "select_account",
        login_hint: "", // You can pre-fill email if available
      });

      let result;

      if (useRedirect) {
        // Use redirect method as fallback for popup blockers
        setPendingRedirect(true);
        await signInWithRedirect(auth, provider);
        return null; // User will be redirected away
      } else {
        // Try popup first (better UX)
        result = await signInWithPopup(auth, provider);
      }

      const user = result.user;
      const token = await user.getIdToken();

      // Sync with your backend
      await axios.post(
        "http://localhost:5000/api/auth/sync-google-user",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      );

      return user;
    } catch (err) {
      console.error("Google login failed:", err);

      // Enhanced error mapping with user-friendly messages
      const errorMap = {
        "auth/popup-blocked": {
          message:
            "Popup was blocked by your browser. Please allow popups or try the redirect method.",
          code: "popup-blocked",
        },
        "auth/popup-closed-by-user": {
          message: "Login was cancelled. Please try again.",
          code: "popup-closed",
        },
        "auth/network-request-failed": {
          message: "Network error. Please check your internet connection.",
          code: "network-error",
        },
        "auth/cancelled-popup-request": {
          message: "Login was cancelled. Please try again.",
          code: "cancelled",
        },
        "auth/unauthorized-domain": {
          message: "This domain is not authorized for authentication.",
          code: "unauthorized-domain",
        },
        "auth/operation-not-allowed": {
          message: "Google login is not enabled. Please contact support.",
          code: "not-enabled",
        },
        "auth/account-exists-with-different-credential": {
          message: "An account already exists with this email.",
          code: "account-exists",
        },
      };

      const errorInfo = errorMap[err.code] || {
        message: `Login failed: ${err.message || "Please try again."}`,
        code: "unknown",
      };

      // Create enhanced error with additional context
      const enhancedError = new Error(errorInfo.message);
      enhancedError.code = errorInfo.code;
      enhancedError.originalError = err;

      throw enhancedError;
    }
  };

  // Handle redirect result after user returns from Google
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          setPendingRedirect(false);
          const user = result.user;
          const token = await user.getIdToken();

          setFirebaseUser(user);
          setIdToken(token);

          // Sync with backend after redirect
          await axios.post(
            "http://localhost:5000/api/auth/sync-google-user",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        }
      } catch (error) {
        console.error("Redirect result error:", error);
        setPendingRedirect(false);

        // Store error for display when user returns
        sessionStorage.setItem(
          "authError",
          JSON.stringify({
            message: error.message,
            code: error.code,
          })
        );
      }
    };

    handleRedirectResult();
  }, [auth]);

  // Check for stored auth errors on component mount
  useEffect(() => {
    const storedError = sessionStorage.getItem("authError");
    if (storedError) {
      console.error("Stored auth error:", JSON.parse(storedError));
      sessionStorage.removeItem("authError");
    }
  }, []);

  // Existing auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setFirebaseUser(null);
        setIdToken(null);
        setMongoUser(null);
        setAuthLoading(false);
        return;
      }

      setFirebaseUser(user);

      try {
        const token = await user.getIdToken();
        setIdToken(token);

        const res = await axios.post(
          "http://localhost:5000/api/auth/sync-google-user",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            timeout: 10000,
          }
        );
        setMongoUser(res.data.user);
      } catch (err) {
        console.error("Sync error:", err.response?.data || err.message);

        // Even if sync fails, we still have Firebase auth
        // User can proceed with limited functionality
        setMongoUser({
          email: user.email,
          name: user.displayName,
          firebaseOnly: true,
        });
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // Check if we're in a redirect flow
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("redirect") === "true") {
      setPendingRedirect(true);
    }
  }, []);

  const value = {
    firebaseUser,
    idToken,
    mongoUser,
    authLoading,
    pendingRedirect,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
