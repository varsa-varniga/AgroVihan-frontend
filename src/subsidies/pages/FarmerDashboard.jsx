// src/pages/FarmerDashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { schemesAPI, applicationsAPI, profileAPI } from "../services/api";
import Header from "../components/Common/Header";
import StatsCards from "../components/Dashboard/StatsCards";
import RecentApplications from "../components/Dashboard/RecentApplications";
import SchemeRecommendations from "../components/Dashboard/SchemeRecommendations";
import LoadingSpinner from "../components/Common/LoadingSpinner";

const FarmerDashboard = () => {
  const { farmer } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [recommendedSchemes, setRecommendedSchemes] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [statsResponse, applicationsResponse, schemesResponse] =
        await Promise.all([
          profileAPI.getStats(),
          applicationsAPI.getAll(),
          schemesAPI.getRecommended(),
        ]);

      setStats(statsResponse.data.stats);
      setApplications(applicationsResponse.data.applications || []);
      setRecommendedSchemes(schemesResponse.data.recommendations || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {farmer?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your financial empowerment dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recommended Schemes */}
          <div className="lg:col-span-2">
            <SchemeRecommendations
              schemes={recommendedSchemes}
              onApplySuccess={fetchDashboardData}
            />
          </div>

          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <RecentApplications applications={applications} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Find More Schemes
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Discover all available government schemes
            </p>
            <a
              href="/schemes"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Browse Schemes
            </a>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Complete Profile
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Increase your eligibility score
            </p>
            <a
              href="/profile"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Update Profile
            </a>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Track Applications
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Monitor your submitted applications
            </p>
            <a
              href="/applications"
              className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              View Applications
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard;
