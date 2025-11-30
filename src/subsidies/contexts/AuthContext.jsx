// src/contexts/AuthContext.jsx - COMPLETE FIX
import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


export const AuthProvider = ({ children }) => {
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("farmer_token");
      if (token) {
        const response = await authAPI.getProfile();
        setFarmer(response.data.user);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("farmer_token");
    } finally {
      setLoading(false);
    }
  };

  // src/contexts/AuthContext.jsx - Update login function
  const login = async (credentials) => {
    try {
      console.log("🔐 Attempting login:", credentials.email);
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;

      localStorage.setItem("farmer_token", token);
      setFarmer(user);

      console.log("✅ Login successful:", user);

      // Force navigation after state update
      window.location.href = "/"; // This ensures navigation happens

      return { success: true };
    } catch (error) {
      console.error("❌ Login error:", error);
      const message = error.response?.data?.message || "Login failed";
      return { success: false, error: message };
    }
  };
  const register = async (userData) => {
    try {
      console.log("📝 Attempting registration:", userData.email);

      const registerData = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        district: userData.district,
        language: userData.language || "ta",
        role: "sprouter",
      };

      const response = await authAPI.register(registerData);
      const { token, user } = response.data;

      console.log("✅ Registration successful:", user);

      localStorage.setItem("farmer_token", token);
      setFarmer(user);

      return { success: true };
    } catch (error) {
      console.error("❌ Registration failed:", error);
      const message = error.response?.data?.message || "Registration failed";
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem("farmer_token");
    setFarmer(null);
  };

  const value = {
    farmer,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!farmer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
