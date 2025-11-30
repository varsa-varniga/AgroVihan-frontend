// learningpathservice/database.js
const DatabaseService = {
  async loadUserProgress(email) {
    if (!email) {
      console.error("❌ Email is required for loadUserProgress");
      throw new Error("Email is required");
    }
    
    try {
      // Use the correct key format that matches what you're storing
      const key = `learningPathUser_${email}`;
      const value = localStorage.getItem(key);
      
      if (!value) {
        console.log(`📭 No user data found for email: ${email}`);
        return null;
      }
      
      const userData = JSON.parse(value);
      console.log(`✅ Loaded user data for: ${email}`, userData);
      return userData;
    } catch (error) {
      console.error("❌ Error loading user progress:", error);
      return null;
    }
  },

  async saveUserProgress(email, userData) {
    if (!email) {
      console.error("❌ Email is required for saveUserProgress");
      throw new Error("Email is required");
    }
    if (!userData) {
      console.error("❌ User data is required for saveUserProgress");
      throw new Error("User data is required");
    }
    
    try {
      // Use consistent key format
      const key = `learningPathUser_${email}`;
      localStorage.setItem(key, JSON.stringify(userData));
      console.log(`💾 Saved user data for: ${email}`, userData);
      return true;
    } catch (error) {
      console.error("❌ Error saving user progress:", error);
      return false;
    }
  },

  createNewUser(email) {
    console.log(`🆕 Creating new user for: ${email}`);
    return {
      email,
      fullName: email.split('@')[0], // Add default name
      language: null,
      farmTokens: 0,
      completedModules: [],
      currentModule: 1,
      badges: [],
      moduleProgress: {},
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
  },

  async updateLastLogin(email, userData) {
    if (!email || !userData) {
      console.error("❌ Email and user data required for updateLastLogin");
      return userData;
    }
    
    const updatedUser = {
      ...userData,
      lastLoginAt: new Date().toISOString(),
    };
    await this.saveUserProgress(email, updatedUser);
    return updatedUser;
  },

  async setLanguage(email, userData, language) {
    if (!email || !userData) {
      console.error("❌ Email and user data required for setLanguage");
      return userData;
    }
    
    const updatedUser = { 
      ...userData, 
      language,
      currentModule: userData.currentModule || 1
    };
    
    console.log(`🌐 Setting language to ${language} for: ${email}`);
    await this.saveUserProgress(email, updatedUser);
    return updatedUser;
  },

  // In database.js - update completeModule function
// In database.js - update completeModule function
async completeModule(email, userData, moduleId, tokensEarned, score) {
  console.log("🔍 completeModule called with:", { 
    email, 
    userData: userData ? "User data exists" : "No user data",
    moduleId, 
    tokensEarned, 
    score 
  });
  
  if (!email) {
    const errorMsg = "Email is required for completeModule. Received: " + email;
    console.error("❌", errorMsg);
    throw new Error(errorMsg);
  }
  
  if (!userData) {
    const errorMsg = "User data is required for completeModule. Check if user is properly logged in.";
    console.error("❌", errorMsg);
    throw new Error(errorMsg);
  }

  if (!moduleId) {
    console.error("❌ Module ID is required for completeModule");
    throw new Error("Module ID is required");
  }

  try {
    // Ensure all required fields exist with proper fallbacks
    const updatedUser = {
      ...userData,
      email: userData.email || email, // Ensure email is set
      farmTokens: (userData.farmTokens || 0) + (tokensEarned || 0),
      completedModules: [...new Set([...(userData.completedModules || []), moduleId])],
      currentModule: Math.max(userData.currentModule || 1, moduleId + 1),
      moduleProgress: {
        ...(userData.moduleProgress || {}),
        [moduleId]: {
          completed: true,
          score: score || 0,
          tokensEarned: tokensEarned || 0,
          completedAt: new Date().toISOString(),
        },
      },
    };

    console.log(`🎯 Completed module ${moduleId} for: ${email}`, {
      tokensEarned,
      score,
      totalTokens: updatedUser.farmTokens
    });

    // Add badge only when all modules are completed
    const totalModules = 7;
    if (updatedUser.completedModules.length === totalModules) {
      const finalBadge = userData.language === "tamil" ? "🏆 விவசாய மாஸ்டர்" : "🏆 Farming Master";
      updatedUser.badges = [...(userData.badges || []), finalBadge];
      console.log(`🏆 Awarded badge: ${finalBadge} to: ${email}`);
    }

    const saveResult = await this.saveUserProgress(email, updatedUser);
    if (!saveResult) {
      throw new Error("Failed to save user progress");
    }
    
    return updatedUser;
  } catch (error) {
    console.error("❌ Error in completeModule:", error);
    throw error;
  }
},

  async deleteUserData(email) {
    if (!email) {
      console.error("❌ Email is required for deleteUserData");
      throw new Error("Email is required");
    }
    
    try {
      const key = `learningPathUser_${email}`;
      localStorage.removeItem(key);
      console.log(`🗑️ Deleted user data for: ${email}`);
      return true;
    } catch (error) {
      console.error("❌ Error deleting user data:", error);
      return false;
    }
  },

  // Helper method to check if user exists
  async userExists(email) {
    if (!email) return false;
    
    try {
      const key = `learningPathUser_${email}`;
      const value = localStorage.getItem(key);
      return value !== null;
    } catch (error) {
      console.error("❌ Error checking if user exists:", error);
      return false;
    }
  },

  // Helper method to get all users (for debugging)
  getAllUsers() {
    const users = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('learningPathUser_')) {
        try {
          const userData = JSON.parse(localStorage.getItem(key));
          users.push(userData);
        } catch (error) {
          console.error(`❌ Error parsing user data for key: ${key}`, error);
        }
      }
    }
    return users;
  }
};

export default DatabaseService;