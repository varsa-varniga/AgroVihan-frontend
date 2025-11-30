import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Sprout,
  ChevronRight,
  Menu,
  X,
  BookOpen,
  Brain,
  Wallet,
  Home,
  Cpu,
  Users,
  ShoppingBag,
  Leaf,
  FileText,
  LogOut,
  Check,
  ArrowRight,
  Edit,
  Save,
  ArrowLeft,
} from "lucide-react";

// Import the LearningPathWrapper component (you'll need to create this or adjust the path)
import LearningPathWrapper from "../learningpathcomponents/App";
import SmartFarmingDashboard from "../farmingcalender/SmartFarmingDashboard";

const CultivatorDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFeature, setActiveFeature] = useState("dashboard");
  const [isEditing, setIsEditing] = useState(false);
  const [editProfileData, setEditProfileData] = useState({});
  const [profileData, setProfileData] = useState(null);
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  // Sprouter dashboard la irukka data vaangi Cultivator dashboard la use pannurom
  useEffect(() => {
    const sprouterData = localStorage.getItem("sprouterData");
    if (sprouterData) {
      setProfileData(JSON.parse(sprouterData));
    }
  }, []);

  const dashboardFeatures = [
    {
      id: "dashboard",
      icon: BookOpen,
      label: "Dashboard",
      desc: "Overview & Analytics",
      color: "#3b82f6",
    },
    {
      id: "profile",
      icon: User,
      label: "Profile",
      desc: "Personal Information",
      color: "#8b5cf6",
    },
    {
      id: "learning",
      icon: BookOpen,
      label: "Learning Path",
      desc: "Structured learning modules",
      color: "#3b82f6",
    },
    {
      id: "ai",
      icon: Brain,
      label: "Farmer Readiness AI",
      desc: "AI-powered assessment",
      color: "#a855f7",
    },
    {
      id: "financial",
      icon: Wallet,
      label: "Financial Empower",
      desc: "Financial tools & schemes",
      color: "#22c55e",
    },
    {
      id: "land",
      icon: Home,
      label: "Land Leasing Hub",
      desc: "Find or lease land",
      color: "#f97316",
    },
    {
      id: "soil",
      icon: Sprout,
      label: "Soil Connect",
      desc: "Soil testing & analysis",
      color: "#10b981",
    },
    {
      id: "smart",
      icon: Cpu,
      label: "Smart Farming",
      desc: "IoT & precision farming",
      color: "#06b6d4",
    },
    {
      id: "community",
      icon: Users,
      label: "Crop Circle",
      desc: "Connect with farmers",
      color: "#ec4899",
    },
    {
      id: "market",
      icon: ShoppingBag,
      label: "Farm Market",
      desc: "Buy & sell products",
      color: "#14b8a6",
    },
    {
      id: "carbon",
      icon: Leaf,
      label: "Carbon Credit",
      desc: "Earn from carbon credits",
      color: "#84cc16",
    },
    {
      id: "posts",
      icon: FileText,
      label: "Posts",
      desc: "Share knowledge",
      color: "#6366f1",
    },
  ];

  // Get current user data
  const getCurrentUser = () => {
    const mainUser = localStorage.getItem("currentUser");
    if (mainUser) {
      return JSON.parse(mainUser);
    }

    const sprouterData = localStorage.getItem("sprouterData");
    if (sprouterData) {
      const sprouter = JSON.parse(sprouterData);
      return {
        email: sprouter.email,
        name: sprouter.fullName,
      };
    }

    const learningPathUser = sessionStorage.getItem("learningPathUser");
    if (learningPathUser) {
      return JSON.parse(learningPathUser);
    }

    return null;
  };

  // Initialize Learning Path
  const initializeLearningPath = (language) => {
    console.log("🚀 Initializing Learning Path with language:", language);

    const mainUser = localStorage.getItem("currentUser");
    const sprouterData = localStorage.getItem("sprouterData");

    let userData;

    if (mainUser) {
      try {
        userData = JSON.parse(mainUser);
        if (userData && userData.email && userData.email !== "") {
          console.log("📱 Valid user from main auth:", userData);
        } else {
          throw new Error("Invalid user data in mainUser");
        }
      } catch (error) {
        console.error("❌ Error parsing mainUser:", error);
        userData = null;
      }
    }

    if (!userData && sprouterData) {
      try {
        const sprouter = JSON.parse(sprouterData);
        if (sprouter && sprouter.email && sprouter.email !== "") {
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
          console.log("🌱 Valid user from sprouter data:", userData);
        }
      } catch (error) {
        console.error("❌ Error parsing sprouterData:", error);
      }
    }

    if (!userData) {
      userData = {
        email: "guest@agrovihan.com",
        name: "Guest User",
        fullName: "Guest User",
        phone: "",
        farmTokens: 0,
        completedModules: [],
        currentModule: 1,
        moduleProgress: {},
        badges: [],
      };
      console.log("👤 Using guest user data");
    }

    const learningPathUser = {
      email: userData.email,
      fullName: userData.fullName || userData.name,
      language: language,
      phone: userData.phone || "",
      farmTokens: userData.farmTokens || 0,
      completedModules: userData.completedModules || [],
      currentModule: userData.currentModule || 1,
      moduleProgress: userData.moduleProgress || {},
      badges: userData.badges || [],
    };

    console.log("💾 Storing learning path user:", learningPathUser);

    sessionStorage.setItem("currentUserEmail", learningPathUser.email);
    sessionStorage.setItem(
      "learningPathUser",
      JSON.stringify(learningPathUser)
    );

    setActiveFeature("learning-path-active");
    console.log("✅ Learning path initialized successfully");
  };

  const handleFeatureClick = (featureId) => {
    setActiveFeature(featureId);
    setIsEditing(false);

    if (featureId === "land") {
      navigate("/land-leasing");
      return;
    }

    if (featureId === "soil") {
      navigate("/soil-connect");
      return;
    }

    if (featureId === "market") {
      navigate("/ecom");
      return;
    }

    if (featureId === "posts") {
      navigate("/postharvest");
      return;
    }

    if (featureId === "community") {
      navigate("/cropcircle/select-crop");
      return;
    }

    if (featureId === "profile") {
      setActiveFeature("profile");
      return;
    }

    if (featureId === "learning") {
      setShowLanguageSelection(true);
      return;
    }

    if (featureId === "carbon") {
      navigate("/carbon-credit");
      return;
    }

    if (featureId === "financial") {
      navigate("/financial-empower");
      return;
    }

    if (featureId === "smart") {
      // Navigate to Smart Farming
      setActiveFeature("smart-farming");
      return;
    }

    console.log(`Feature clicked: ${featureId}`);
  };

  // Language Selection Modal
  const LanguageSelectionModal = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "32px",
          maxWidth: "500px",
          width: "90%",
          textAlign: "center",
        }}
      >
        <h2
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}
        >
          Choose Your Learning Language
        </h2>
        <p style={{ color: "#6b7280", marginBottom: "24px" }}>
          Select your preferred language for the learning path
        </p>

        <div style={{ display: "grid", gap: "16px" }}>
          <button
            onClick={() => {
              setSelectedLanguage("tamil");
              setShowLanguageSelection(false);
              initializeLearningPath("tamil");
            }}
            style={{
              padding: "16px",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              backgroundColor: "white",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "#f59e0b";
              e.target.style.backgroundColor = "#fffbeb";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "#e5e7eb";
              e.target.style.backgroundColor = "white";
            }}
          >
            <span style={{ fontSize: "24px" }}>🇮🇳</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: "bold" }}>தமிழ்</div>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>Tamil</div>
            </div>
          </button>

          <button
            onClick={() => {
              setSelectedLanguage("english");
              setShowLanguageSelection(false);
              initializeLearningPath("english");
            }}
            style={{
              padding: "16px",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              backgroundColor: "white",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "#3b82f6";
              e.target.style.backgroundColor = "#eff6ff";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "#e5e7eb";
              e.target.style.backgroundColor = "white";
            }}
          >
            <span style={{ fontSize: "24px" }}>🌍</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: "bold" }}>English</div>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>English</div>
            </div>
          </button>
        </div>

        <button
          onClick={() => setShowLanguageSelection(false)}
          style={{
            marginTop: "16px",
            padding: "8px 16px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            backgroundColor: "white",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const handleEditProfile = () => {
    setEditProfileData({ ...profileData });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditProfileData({});
  };

  const handleSaveProfile = () => {
    setProfileData({ ...editProfileData });
    localStorage.setItem("sprouterData", JSON.stringify(editProfileData));
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleBackToDashboard = () => {
    setActiveFeature("dashboard");
    setIsEditing(false);
  };

  // Profile Component
  const ProfilePage = () => (
    <div
      style={{
        padding: "32px",
        maxWidth: "800px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      <button
        onClick={handleBackToDashboard}
        style={{
          position: "absolute",
          top: "32px",
          right: "32px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 16px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          backgroundColor: "white",
          color: "#374151",
          fontSize: "14px",
          fontWeight: "500",
          cursor: "pointer",
          transition: "all 0.2s",
          zIndex: 10,
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </button>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "32px",
            paddingBottom: "24px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background:
                  "linear-gradient(to bottom right, #4ade80, #16a34a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: "32px",
                boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
              }}
            >
              {profileData?.fullName
                ? profileData.fullName.charAt(0).toUpperCase()
                : "C"}
            </div>
            <div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#1f2937",
                  margin: "0 0 4px 0",
                }}
              >
                {profileData?.fullName || "Cultivator User"}
              </h2>
              <p
                style={{
                  color: "#6b7280",
                  margin: "0 0 8px 0",
                  fontSize: "14px",
                }}
              >
                Registered Cultivator
              </p>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  backgroundColor: "#f0fdf4",
                  color: "#16a34a",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                <Check size={12} />
                <span>Verified Member</span>
              </div>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={handleEditProfile}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                backgroundColor: "white",
                color: "#374151",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              <Edit size={16} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        <div style={{ display: "grid", gap: "24px" }}>
          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: "16px",
                paddingBottom: "8px",
                borderBottom: "2px solid #f3f4f6",
              }}
            >
              Personal Information
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "16px",
              }}
            >
              <InfoField
                label="Full Name"
                value={
                  isEditing ? editProfileData.fullName : profileData?.fullName
                }
              />
              <InfoField
                label="Phone Number"
                value={isEditing ? editProfileData.phone : profileData?.phone}
              />
              <InfoField
                label="Aadhaar Last 4"
                value={
                  isEditing
                    ? editProfileData.aadhaarLast4
                    : profileData?.aadhaarLast4
                }
              />
              <InfoField
                label="Email"
                value={isEditing ? editProfileData.email : profileData?.email}
              />
            </div>
          </div>

          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: "16px",
                paddingBottom: "8px",
                borderBottom: "2px solid #f3f4f6",
              }}
            >
              Address Details
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "16px",
              }}
            >
              <InfoField
                label="Village/Town"
                value={
                  isEditing ? editProfileData.village : profileData?.village
                }
              />
              <InfoField
                label="District"
                value={
                  isEditing ? editProfileData.district : profileData?.district
                }
              />
              <InfoField
                label="State"
                value={isEditing ? editProfileData.state : profileData?.state}
              />
              <InfoField
                label="Pincode"
                value={
                  isEditing ? editProfileData.pincode : profileData?.pincode
                }
              />
            </div>
          </div>

          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: "16px",
                paddingBottom: "8px",
                borderBottom: "2px solid #f3f4f6",
              }}
            >
              Land Information
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "16px",
              }}
            >
              <InfoField
                label="Land Size"
                value={
                  isEditing ? editProfileData.landSize : profileData?.landSize
                }
                suffix="acres"
              />
              <InfoField
                label="Land Type"
                value={
                  isEditing ? editProfileData.landType : profileData?.landType
                }
              />
              <InfoField
                label="Soil Type"
                value={
                  isEditing ? editProfileData.soilType : profileData?.soilType
                }
              />
            </div>
          </div>

          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: "16px",
                paddingBottom: "8px",
                borderBottom: "2px solid #f3f4f6",
              }}
            >
              Financial & Experience
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "16px",
              }}
            >
              <InfoField
                label="Income Range"
                value={
                  isEditing
                    ? editProfileData.incomeRange
                    : profileData?.incomeRange
                }
              />
              <InfoField
                label="Farming Experience"
                value={
                  isEditing
                    ? editProfileData.experience
                    : profileData?.experience
                }
              />
              <InfoField
                label="Main Crops"
                value={
                  isEditing ? editProfileData.mainCrops : profileData?.mainCrops
                }
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "32px",
              paddingTop: "24px",
              borderTop: "1px solid #e5e7eb",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={handleCancelEdit}
              style={{
                padding: "10px 20px",
                border: "1px solid #d1d5db",
                color: "#374151",
                fontWeight: "500",
                borderRadius: "8px",
                backgroundColor: "white",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                background: "linear-gradient(to right, #22c55e, #059669)",
                color: "white",
                fontWeight: "500",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <Save size={16} />
              <span>Update Profile</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Helper component for info fields
  const InfoField = ({ label, value, suffix = "" }) => (
    <div>
      <p
        style={{
          fontSize: "12px",
          color: "#6b7280",
          fontWeight: "500",
          margin: "0 0 4px 0",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: "14px",
          color: "#1f2937",
          fontWeight: "500",
          margin: 0,
          wordBreak: "break-word",
        }}
      >
        {value} {suffix && value ? suffix : ""}
      </p>
    </div>
  );

  // If language selection is shown
  if (showLanguageSelection) {
    return <LanguageSelectionModal />;
  }

  // If learning path is active
  if (activeFeature === "learning-path-active") {
    return (
      <div style={{ height: "100vh" }}>
        <LearningPathWrapper
          user={profileData}
          onBackToDashboard={() => {
            setActiveFeature("dashboard");
            setSelectedLanguage(null);
          }}
        />
      </div>
    );
  }

  if (activeFeature === "smart-farming") {
    return (
      <SmartFarmingDashboard
        onBackToDashboard={() => setActiveFeature("dashboard")}
      />
    );
  }

  // Loading state
  if (!profileData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  // ✅ DIRECT DASHBOARD - No registration form
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#f9fafb",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? "320px" : "0",
          transition: "width 0.3s",
          backgroundColor: "white",
          borderRight: "1px solid #e5e7eb",
          overflowX: "hidden",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            padding: "24px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "40px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background:
                      "linear-gradient(to bottom right, #4ade80, #16a34a)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Sprout size={24} color="white" />
                </div>
                <div>
                  <h1
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: 0,
                    }}
                  >
                    AgroVihan
                  </h1>
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
                    Cultivator Portal
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  padding: "4px",
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: sidebarOpen ? "block" : "none",
                }}
              >
                <X size={16} color="#6b7280" />
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              {dashboardFeatures.map((feature, idx) => {
                const Icon = feature.icon;
                const isActive = activeFeature === feature.id;
                return (
                  <button
                    key={idx}
                    onClick={() => handleFeatureClick(feature.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "14px 16px",
                      borderRadius: "12px",
                      border: "none",
                      backgroundColor: isActive ? "#f3f4f6" : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: feature.color,
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} color="white" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontWeight: "600",
                          color: "#1f2937",
                          fontSize: "14px",
                          margin: 0,
                        }}
                      >
                        {feature.label}
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          margin: 0,
                        }}
                      >
                        {feature.desc}
                      </p>
                    </div>
                    <ChevronRight size={16} color="#9ca3af" />
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("sprouterData");
              window.location.reload();
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              marginTop: "auto",
              color: "#dc2626",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
        <div
          style={{
            backgroundColor: "white",
            borderBottom: "1px solid #e5e7eb",
            padding: "20px 32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  style={{
                    padding: "8px",
                    backgroundColor: "transparent",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  <Menu size={24} color="#4b5563" />
                </button>
              )}
              <div>
                <h1
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#1f2937",
                    margin: 0,
                  }}
                >
                  {activeFeature === "profile"
                    ? "My Profile"
                    : "Cultivator Dashboard"}
                </h1>
                <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
                  {activeFeature === "profile"
                    ? "Manage your personal information"
                    : `Welcome back, ${profileData?.fullName}!`}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                backgroundColor: "#f0fdf4",
                padding: "8px 16px",
                borderRadius: "9999px",
                border: "1px solid #dcfce7",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(to bottom right, #4ade80, #16a34a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                {profileData?.fullName
                  ? profileData.fullName.charAt(0).toUpperCase()
                  : "C"}
              </div>
              <div>
                <p
                  style={{
                    fontWeight: "600",
                    color: "#1f2937",
                    fontSize: "14px",
                    margin: 0,
                  }}
                >
                  {profileData?.fullName}
                </p>
                <p style={{ fontSize: "12px", color: "#16a34a", margin: 0 }}>
                  Cultivator
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Moving Text Banner */}
        <div
          style={{
            marginBottom: "3px",
            padding: "2px",
            backgroundColor: "#fef3c7",
            border: "0.5px solid #f59e0b",
            borderRadius: "15px",
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 4px 6px rgba(245, 158, 11, 0.2)",
          }}
        >
          <div
            style={{
              whiteSpace: "nowrap",
              animation: "scrollText 45s linear infinite",
              fontSize: "18px",
              fontWeight: "700",
              color: "#92400e",
              padding: "8px 0",
            }}
          >
            🎉 Congratulations! You are promoted to Mentor - Share your
            knowledge with fellow farmers! 🎉
          </div>
        </div>

        {/* Render different content based on active feature */}
        {activeFeature === "profile" ? (
          <ProfilePage />
        ) : (
          <div style={{ padding: "32px" }}>
            {/* Welcome Banner */}
            <div
              style={{
                background:
                  "linear-gradient(to right, #22c55e, #16a34a, #059669)",
                borderRadius: "24px",
                padding: "32px",
                marginBottom: "32px",
                color: "white",
                boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
              }}
            >
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                🌾 Welcome to Your Cultivator Journey!
              </h2>
              <p
                style={{
                  color: "#dcfce7",
                  marginBottom: "24px",
                  lineHeight: "1.6",
                  fontSize: "16px",
                }}
              >
                You're now a registered Cultivator! Access learning modules,
                connect with experts, and grow your farming skills. Start
                exploring the features below to maximize your agricultural
                potential.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <span
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                  }}
                >
                  🎯 Personalized Learning
                </span>
                <span
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                  }}
                >
                  🤝 Community Support
                </span>
                <span
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                  }}
                >
                  📈 Growth Tracking
                </span>
              </div>
            </div>

            {/* Features Grid */}
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "24px",
              }}
            >
              Explore Cultivator Features
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "24px",
              }}
            >
              {dashboardFeatures
                .filter((f) => f.id !== "dashboard" && f.id !== "profile")
                .map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleFeatureClick(feature.id)}
                      style={{
                        backgroundColor: "white",
                        borderRadius: "16px",
                        padding: "24px",
                        border: "1px solid #f3f4f6",
                        cursor: "pointer",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <div
                        style={{
                          width: "56px",
                          height: "56px",
                          backgroundColor: feature.color,
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "16px",
                        }}
                      >
                        <Icon size={28} color="white" />
                      </div>
                      <h4
                        style={{
                          fontWeight: "bold",
                          color: "#1f2937",
                          marginBottom: "8px",
                          fontSize: "18px",
                        }}
                      >
                        {feature.label}
                      </h4>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          marginBottom: "16px",
                          lineHeight: "1.5",
                        }}
                      >
                        {feature.desc}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: feature.color,
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        <span>Explore</span>
                        <ArrowRight size={16} style={{ marginLeft: "8px" }} />
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Quick Stats */}
            <div style={{ marginTop: "48px" }}>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#1f2937",
                  marginBottom: "24px",
                }}
              >
                Your Progress
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: "8px",
                    }}
                  >
                    Registration Date
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#1f2937",
                    }}
                  >
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: "8px",
                    }}
                  >
                    Land Size
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#1f2937",
                    }}
                  >
                    {profileData?.landSize
                      ? `${profileData.landSize} acres`
                      : "Not set"}
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: "8px",
                    }}
                  >
                    Status
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#16a34a",
                    }}
                  >
                    Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add CSS for scrolling animation */}
      <style>
        {`
          @keyframes scrollText {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
    </div>
  );
};

export default CultivatorDashboard;
