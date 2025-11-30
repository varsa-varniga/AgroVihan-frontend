import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import LoadingSpinner from "../components/Common/LoadingSpinner";

const SubsidiesLayout = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeSubsidiesSession();
  }, []);

  const initializeSubsidiesSession = async () => {
    try {
      // Check if already authenticated
      const existingToken = localStorage.getItem("farmer_token");
      if (existingToken) {
        setLoading(false);
        return;
      }

      // Your existing auto-login logic here...
      const userData = getUserDataFromMainApp();

      if (!userData) {
        setError("No user session found");
        setLoading(false);
        return;
      }

      // Perform auto-login
      const response = await fetch(
        "http://localhost:5001/api/auth/auto-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userData.email,
            name: userData.name || "Sprouter User",
            phone: userData.phone || "+910000000000",
            district: userData.district || "Unknown District",
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("farmer_token", data.token);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Connecting to Financial Services..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Connection Failed
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Back to Main App
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default SubsidiesLayout;
