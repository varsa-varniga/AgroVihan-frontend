// src/components/Common/Header.jsx - FIXED VERSION
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Bell,
  Globe,
  ArrowLeft,
} from "lucide-react";

const Header = () => {
  const { farmer, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState("ta");

  // ✅ FIXED: Direct navigation without reload
  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const navigation = [
    {
      name: "Dashboard",
      path: "/financial-empower",
      icon: "📊",
    },
    {
      name: "Schemes",
      path: "/schemes",
      icon: "💰",
    },
    {
      name: "Applications",
      path: "/applications",
      icon: "📋",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "👤",
    },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Back Button */}
          <div className="flex items-center space-x-4">
            {/* ✅ ADDED: Back to Main Dashboard Button */}
            <button
              onClick={() => navigate("/sprouter")}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
              title="Back to Sprouter Dashboard"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>

            <div className="flex-shrink-0 flex items-center border-l pl-4">
              <span className="text-2xl mr-2">🌾</span>
              <span className="text-xl font-bold text-gray-900">AgroVihan</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <button
              onClick={() => setLanguage(language === "en" ? "ta" : "en")}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title={
                language === "en" ? "Switch to Tamil" : "Switch to English"
              }
            >
              <Globe className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <span className="ml-2 text-gray-700 hidden sm:block">
                  {farmer?.name}
                </span>
              </button>

              {menuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      onClick={() => handleNavigation("/profile")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="mr-3 h-4 w-4" />
                      Your Profile
                    </button>
                    <button
                      onClick={() => handleNavigation("/sprouter")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ArrowLeft className="mr-3 h-4 w-4" />
                      Main Dashboard
                    </button>
                    <button
                      onClick={logout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center w-full px-3 py-2 text-base font-medium rounded-md ${
                    location.pathname === item.path
                      ? "text-green-600 bg-green-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
