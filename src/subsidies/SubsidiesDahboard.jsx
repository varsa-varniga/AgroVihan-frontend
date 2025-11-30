// src/subsidies/SubsidiesDashboard.jsx - OPTIMIZED VERSION
import React, { useEffect, useState } from "react";
import FarmerDashboard from "./pages/FarmerDashboard";

const SubsidiesDashboard = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // ✅ INSTANT CHECK - No loading delay
    const token = localStorage.getItem("farmer_token");
    const userData = getUserDataFromMainApp();

    if (token && userData) {
      // Already authenticated - show immediately
      setIsReady(true);
    } else if (userData && userData.email) {
      // Need to auto-login but don't show loading - just do it
      autoLoginSilently(userData);
    } else {
      // No user data at all - redirect
      console.warn("No user session found");
      window.location.href = "/sprouter";
    }
  }, []);

  const getUserDataFromMainApp = () => {
    const mainUser = localStorage.getItem("currentUser");
    const sprouterData = localStorage.getItem("sprouterData");

    if (mainUser) {
      try {
        return JSON.parse(mainUser);
      } catch (e) {
        console.error("Error parsing mainUser:", e);
      }
    }

    if (sprouterData) {
      try {
        const sprouter = JSON.parse(sprouterData);
        return {
          email: sprouter.email,
          name: sprouter.fullName,
          phone: sprouter.phone,
          district: sprouter.district,
        };
      } catch (e) {
        console.error("Error parsing sprouterData:", e);
      }
    }

    return null;
  };

  const autoLoginSilently = async (userData) => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/auth/auto-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userData.email,
            name: userData.name || "Sprouter User",
            phone: userData.phone || "+910000000000",
            district: userData.district || "Unknown",
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("farmer_token", data.token);
        setIsReady(true);
      } else {
        console.error("Auto-login failed:", data.message);
        window.location.href = "/sprouter";
      }
    } catch (error) {
      console.error("Auto-login error:", error);
      window.location.href = "/sprouter";
    }
  };

  // ✅ NO LOADING SPINNER - Just show dashboard immediately
  // If not ready yet, show a minimal placeholder that looks like the dashboard
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Skeleton header that looks like the actual header */}
        <div className="h-16 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex space-x-4">
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Skeleton content that looks like the dashboard */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Welcome text skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>

          {/* Stats cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>

          {/* Content skeleton */}
          <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <FarmerDashboard />;
};

export default SubsidiesDashboard;
