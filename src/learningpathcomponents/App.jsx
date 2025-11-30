// learningpathcomponents/App.js
import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import Login from "./login";
import LanguageSelection from "./LanguageSelection";
import DatabaseService from "../learningpathservice/database";

function App() {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFromMainApp, setIsFromMainApp] = useState(false);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      console.log("🔍 Checking existing session...");

      // FIRST: Check if user comes from main app (Sprouter or main auth)
      const storedUser = sessionStorage.getItem("learningPathUser");
      console.log("Stored user from session:", storedUser);

      if (storedUser) {
        setIsFromMainApp(true);
        const userData = JSON.parse(storedUser);
        console.log("✅ User from main app:", userData);

        // Initialize user with all required fields
        const tempUser = {
          email: userData.email,
          fullName: userData.fullName || userData.name || "User",
          language: userData.language || null,
          phone: userData.phone || "",
          farmTokens: userData.farmTokens || 0,
          completedModules: userData.completedModules || [],
          currentModule: userData.currentModule || 1,
          moduleProgress: userData.moduleProgress || {},
          badges: userData.badges || [],
        };

        setUser(tempUser);
        setLanguage(userData.language);

        // Load existing progress if available
        if (userData.email) {
          const existingProgress = await DatabaseService.loadUserProgress(
            userData.email
          );

          if (existingProgress) {
            const mergedUser = {
              ...tempUser,
              ...existingProgress,
              language: existingProgress.language || userData.language || null,
            };
            console.log("🔄 Merged user:", mergedUser);
            setUser(mergedUser);
            setLanguage(mergedUser.language);
          } else {
            // Save the initialized user
            await DatabaseService.saveUserProgress(userData.email, tempUser);
            console.log("🆕 New user saved:", tempUser);
          }
        }
        return;
      }

      // SECOND: Check if user data exists in localStorage from main auth
      const mainUser = localStorage.getItem("currentUser");
      const sprouterData = localStorage.getItem("sprouterData");

      if (mainUser || sprouterData) {
        setIsFromMainApp(true);
        let userData;

        if (mainUser) {
          userData = JSON.parse(mainUser);
        } else if (sprouterData) {
          const sprouter = JSON.parse(sprouterData);
          userData = {
            email: sprouter.email,
            name: sprouter.fullName,
            fullName: sprouter.fullName,
            phone: sprouter.phone || "",
            farmTokens: sprouter.farmTokens || 0,
            completedModules: sprouter.completedModules || [],
            currentModule: sprouter.currentModule || 1,
            moduleProgress: sprouter.moduleProgress || {},
            badges: sprouter.badges || [],
          };
        }

        console.log("✅ User from localStorage:", userData);

        // Store in session for learning path
        const learningPathUser = {
          email: userData.email,
          fullName: userData.fullName || userData.name,
          language: userData.language || null,
          phone: userData.phone || "",
          farmTokens: userData.farmTokens || 0,
          completedModules: userData.completedModules || [],
          currentModule: userData.currentModule || 1,
          moduleProgress: userData.moduleProgress || {},
          badges: userData.badges || [],
        };

        sessionStorage.setItem(
          "learningPathUser",
          JSON.stringify(learningPathUser)
        );

        // Set user immediately for main app users
        const tempUser = {
          email: userData.email,
          fullName: userData.fullName || userData.name,
          language: userData.language || null,
          phone: userData.phone || "",
          farmTokens: userData.farmTokens || 0,
          completedModules: userData.completedModules || [],
          currentModule: userData.currentModule || 1,
          moduleProgress: userData.moduleProgress || {},
          badges: userData.badges || [],
        };

        setUser(tempUser);
        setLanguage(userData.language);

        // Load existing progress if available
        if (userData.email) {
          const existingProgress = await DatabaseService.loadUserProgress(
            userData.email
          );

          if (existingProgress) {
            const mergedUser = {
              ...tempUser,
              ...existingProgress,
              language: existingProgress.language || userData.language,
            };
            setUser(mergedUser);
            setLanguage(mergedUser.language);
          } else {
            // Save the initialized user
            await DatabaseService.saveUserProgress(userData.email, tempUser);
            console.log("🆕 New user saved from localStorage:", tempUser);
          }
        }
        return;
      }

      // THIRD: For direct learning path access
      const storedEmail = sessionStorage.getItem("currentUserEmail");

      if (storedEmail) {
        const userData = await DatabaseService.loadUserProgress(storedEmail);
        if (userData) {
          setUser(userData);
          if (userData.language) {
            setLanguage(userData.language);
          }
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Error checking session:", error);
      setUser(null);
    }
  };

  const handleLoginSuccess = async (email) => {
    try {
      let userData = await DatabaseService.loadUserProgress(email);

      if (userData) {
        setUser(userData);
        if (userData.language) {
          setLanguage(userData.language);
        }
      } else {
        userData = DatabaseService.createNewUser(email);
        await DatabaseService.saveUserProgress(email, userData);
        setUser(userData);
        setLanguage(null);
      }

      sessionStorage.setItem("currentUserEmail", email);
    } catch (error) {
      console.error("❌ Error during login:", error);
    }
  };

  // In App.js - update the handleLanguageSelect function
  const handleLanguageSelect = async (selectedLanguage) => {
    console.log("🌐 handleLanguageSelect called with:", selectedLanguage);
    console.log("👤 Current user:", user);

    if (!user) {
      console.error("❌ No user available for language selection");
      return;
    }

    try {
      console.log("📧 User email:", user.email);
      const updatedUser = await DatabaseService.setLanguage(
        user.email,
        user,
        selectedLanguage
      );

      console.log("✅ Language set successfully:", updatedUser);
      setUser(updatedUser);
      setLanguage(selectedLanguage);

      const storedUser = sessionStorage.getItem("learningPathUser");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.language = selectedLanguage;
        sessionStorage.setItem("learningPathUser", JSON.stringify(userData));
        console.log("💾 Updated session storage with language");
      }
    } catch (error) {
      console.error("❌ Error setting language:", error);
    }
  };

  const recoverUserData = async () => {
    console.log("🔄 Attempting user data recovery in App...");

    // Try to get user from sessionStorage
    const storedUser = sessionStorage.getItem("learningPathUser");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData && userData.email && userData.email !== "") {
          console.log("📦 Recovered valid user from session:", userData);
          setUser(userData);
          if (userData.language) {
            setLanguage(userData.language);
          }
          return userData;
        }
      } catch (error) {
        console.error("❌ Error parsing stored user:", error);
      }
    }

    // Try to get from localStorage as fallback
    const currentUser = localStorage.getItem("currentUser");
    const sprouterData = localStorage.getItem("sprouterData");

    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        if (userData && userData.email && userData.email !== "") {
          console.log("📦 Recovered valid user from localStorage:", userData);

          const completeUser = {
            email: userData.email,
            fullName: userData.fullName || userData.name || "User",
            language: userData.language || language,
            phone: userData.phone || "",
            farmTokens: userData.farmTokens || 0,
            completedModules: userData.completedModules || [],
            currentModule: userData.currentModule || 1,
            moduleProgress: userData.moduleProgress || {},
            badges: userData.badges || [],
          };

          setUser(completeUser);
          if (completeUser.language) {
            setLanguage(completeUser.language);
          }
          sessionStorage.setItem(
            "learningPathUser",
            JSON.stringify(completeUser)
          );
          return completeUser;
        }
      } catch (error) {
        console.error("❌ Error parsing currentUser:", error);
      }
    }

    console.error("❌ User recovery failed in App");
    return null;
  };

  const handleLogout = () => {
    sessionStorage.removeItem("currentUserEmail");
    sessionStorage.removeItem("learningPathUser");
    setUser(null);
    setLanguage(null);
    setIsFromMainApp(false);
  };

  const handleUserUpdate = (updatedUser) => {
    console.log("🔄 handleUserUpdate called with:", updatedUser);

    // Validate user data before updating
    if (updatedUser && updatedUser.email && updatedUser.email !== "") {
      setUser(updatedUser);
      // Also update session storage
      sessionStorage.setItem("learningPathUser", JSON.stringify(updatedUser));
      console.log("✅ User updated successfully");
    } else {
      console.error("❌ Invalid user data in handleUserUpdate:", updatedUser);
      // Attempt to recover valid user data
      recoverUserData();
    }
  };

  console.log(
    "🎯 Rendering App - User:",
    !!user,
    "Language:",
    language,
    "From Main App:",
    isFromMainApp
  );

  // If user comes from main app, NEVER show login - go directly to language selection or dashboard
  if (isFromMainApp && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Learning Path...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* For main app users: Skip login completely */}
      {isFromMainApp ? (
        !language ? (
          <LanguageSelection onLanguageSelect={handleLanguageSelect} />
        ) : (
          <Dashboard
            user={user}
            language={language}
            onLogout={handleLogout}
            onUserUpdate={handleUserUpdate}
          />
        )
      ) : (
        // For direct access to learning path: Show normal flow
        <>
          {!user ? (
            <Login onLoginSuccess={handleLoginSuccess} />
          ) : !language ? (
            <LanguageSelection onLanguageSelect={handleLanguageSelect} />
          ) : (
            <Dashboard
              user={user}
              language={language}
              onLogout={handleLogout}
              onUserUpdate={handleUserUpdate}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
