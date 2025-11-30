import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import "./App.css";

// Public pages
import AboutUs from "./landingpage/AboutUs.jsx";
import HeroPage from "./landingpage/Heropage.jsx";
import Welcome from "./landingpage/Welcome.jsx";
import Climate from "./landingpage/Climate.jsx";
import Disease from "./landingpage/Disease.jsx";
import Fertilizer from "./landingpage/Fertilizer.jsx";
import Carbon from "./landingpage/Carbon_credit.jsx";
import Chat from "./landingpage/Chat.jsx";
import Hubs from "./landingpage/Hubs.jsx";

// Authentication
import AuthSystem from "./authentication/AuthSystem.jsx";
import GLogin from "./authentication/GLogin.jsx";
import RoleSelection from "./authentication/RoleSelection.jsx";
import SprouterDashboard from "./authentication/SprouterDashboard.jsx";
import CultivatorDashboard from "./authentication/CultivatorDashboard.jsx";

// Land Leasing
import LandHome from "./landleasing/LandHome.jsx";
import ListYourLand from "./landleasing/landlist/ListYourLand.jsx";
import FileExplorerDemo from "./landleasing/FileExplorerDemo/FileExplorerDemo.jsx";
import DashboardHome from "./landleasing/dashboard/Home.jsx";
import MyLease from "./landleasing/dashboard/MyLease.jsx";
import SavedLand from "./landleasing/dashboard/SavedLand.jsx";
import Document from "./landleasing/dashboard/Document.jsx";
import ViewAgreement from "./landleasing/dashboard/ViewAgreement.jsx";
import Explore from "./landleasing/pages/Explore.jsx";

// Soil Connect & Ecommerce
import SoilConnect from "./soilconnect/SoilConnect.jsx";
import Ecom from "./ecommerce/Ecom.jsx";

// Carbon Credit
import FarmerCarbonCreditCalculator from "./carboncredit/CarbonCreditMonetization.jsx";

// Learning Path
import LearningPathApp from "./learningpathcomponents/App.jsx";

// Layout
import Layout from "./layout/Layout.jsx";

// CropCircle Components
import ProtectedRoute from "./cropcircle/components/ProtectedRoute";
import BottomNav from "./cropcircle/components/BottomNav";
import theme from "./cropcircle/theme/theme";

// CropCircle Pages
import FeedPage from "./cropcircle/pages/FeedPage";
import ProfilePage from "./cropcircle/pages/ProfilePage";
import UserFeedPage from "./cropcircle/pages/UserFeedPage";
import SelectCrop from "./cropcircle/pages/SelectCrop.jsx";
import NotificationsPage from "./cropcircle/pages/NotificationsPage";

// Post Harvest
import PostHome from "./postharvest/PostHome.jsx";
import Alerts from "./postharvest/Alerts.jsx";
import MandiPrice from "./postharvest/MandiPrice.jsx";
import NearbyTransport from "./postharvest/NearbyTransport.jsx";
import GrainType from "./postharvest/GrainType.jsx";
import Aggregator from "./postharvest/Aggregator.jsx";

// Auth Context
import { AuthProvider } from "./context/AuthContext";


//ageopulse
import AgroPulse from "./agropulse/Farm_readinessAI.jsx";



 
// Subsidies Components
import SubsidiesDashboard from "./subsidies/SubsidiesDahboard.jsx";
import SchemeBrowser from "./subsidies/pages/SchemeBrowser.jsx";
import Applications from "./subsidies/pages/Applications.jsx";
import Profile from "./subsidies/pages/Profile.jsx";

// Auth Contexts
import { AuthProvider as SubsidiesAuthProvider } from "./subsidies/contexts/AuthContext"; // Subsidies auth

const ProtectedLayout = ({ children }) => (
  <>
    {children}
    <BottomNav />
  </>
);

// Subsidies Auth Wrapper Component
const SubsidiesAuthWrapper = ({ children }) => {
  return <SubsidiesAuthProvider>{children}</SubsidiesAuthProvider>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
       <BrowserRouter>
  <Routes>
    {/* PUBLIC ROUTES WITH NAVBAR & FOOTER */}
    <Route element={<Layout />}>
      <Route path="/" element={<HeroPage />} />
      <Route
        path="/features"
        element={
          <>
            <Welcome />
            <Climate />
            <Disease />
            <Fertilizer />
            <Carbon />
            <Chat />
            <Hubs />
          </>
        }
      />
      <Route path="/about" element={<AboutUs />} />
    </Route>

    {/* FEATURE ROUTES WITHOUT NAVBAR */}
    <Route path="/carbon-credit" element={<FarmerCarbonCreditCalculator />} />
    <Route path="/learning-path" element={<LearningPathApp />} />

    {/* DASHBOARDS */}
    <Route path="/sprouter" element={<SprouterDashboard />} />
    <Route path="/cultivator" element={<CultivatorDashboard />} />

    {/* AGROPULSE */}
    <Route path="/ai" element={<AgroPulse />} />

    {/* LAND LEASING */}
    <Route path="/land-leasing" element={<LandHome />} />
    <Route path="/list-land" element={<ListYourLand />} />
    <Route path="/file-explorer" element={<FileExplorerDemo />} />
    <Route path="/explore" element={<Explore />} />

    {/* SOIL CONNECT & ECOM */}
    <Route path="/soil-connect" element={<SoilConnect />} />
    <Route path="/ecom" element={<Ecom />} />

    {/* POST HARVEST HUB */}
    <Route path="/postharvest" element={<PostHome />} />
    <Route path="/postharvest/alerts" element={<Alerts />} />
    <Route path="/postharvest/mandi-prices" element={<MandiPrice />} />
    <Route path="/postharvest/transport" element={<NearbyTransport />} />
    <Route path="/postharvest/grains" element={<GrainType />} />
    <Route path="/postharvest/aggregator" element={<Aggregator />} />

    {/* AUTH ROUTES */}
    <Route path="/login" element={<AuthSystem />} />
    <Route path="/glogin" element={<GLogin />} />
    <Route path="/select-role" element={<RoleSelection />} />

    {/* CROPCIRCLE ROUTES */}
    <Route path="/cropcircle" element={<Navigate to="/cropcircle/login" replace />} />
    <Route path="/cropcircle/login" element={<AuthSystem />} />
    <Route path="/cropcircle/select-crop" element={<SelectCrop />} />

    <Route
      path="/cropcircle/home"
      element={
        <ProtectedRoute>
          <ProtectedLayout>
            <FeedPage />
          </ProtectedLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/cropcircle/notifications"
      element={
        <ProtectedRoute>
          <ProtectedLayout>
            <NotificationsPage />
          </ProtectedLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/cropcircle/profile"
      element={
        <ProtectedRoute>
          <ProtectedLayout>
            <ProfilePage />
          </ProtectedLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/cropcircle/profile/:userId/feed"
      element={
        <ProtectedRoute>
          <ProtectedLayout>
            <UserFeedPage />
          </ProtectedLayout>
        </ProtectedRoute>
      }
    />

    {/* SUBSIDIES ROUTES WITH THEIR OWN AUTH PROVIDER */}
    <Route
      path="/financial-empower"
      element={
        <SubsidiesAuthWrapper>
          <SubsidiesDashboard />
        </SubsidiesAuthWrapper>
      }
    />
    <Route
      path="/schemes"
      element={
        <SubsidiesAuthWrapper>
          <SchemeBrowser />
        </SubsidiesAuthWrapper>
      }
    />
    <Route
      path="/applications"
      element={
        <SubsidiesAuthWrapper>
          <Applications />
        </SubsidiesAuthWrapper>
      }
    />
    <Route
      path="/profile"
      element={
        <SubsidiesAuthWrapper>
          <Profile />
        </SubsidiesAuthWrapper>
      }
    />

    {/* CATCH-ALL */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</BrowserRouter>

      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
