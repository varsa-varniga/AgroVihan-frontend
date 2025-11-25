// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

// Land Leasing - Updated imports based on actual file structure
import LandHome from "./landleasing/LandHome.jsx";
// Remove Explore import since file doesn't exist
import ListYourLand from "./landleasing/landlist/ListYourLand.jsx";
import FileExplorerDemo from "./landleasing/FileExplorerDemo/FileExplorerDemo.jsx";
import DashboardHome from "./landleasing/dashboard/Home.jsx";
import MyLease from "./landleasing/dashboard/MyLease.jsx";
import SavedLand from "./landleasing/dashboard/SavedLand.jsx";
import Document from "./landleasing/dashboard/Document.jsx";
import ViewAgreement from "./landleasing/dashboard/ViewAgreement.jsx";
import Explore from "./landleasing/pages/Explore.jsx";

// Layout
import Layout from "./layout/Layout.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC PAGES */}
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

        {/* AUTH */}
        <Route path="/login" element={<AuthSystem />} />
        <Route path="/glogin" element={<GLogin />} />
        <Route path="/select-role" element={<RoleSelection />} />

        {/* DASHBOARDS */}
        <Route path="/sprouter" element={<SprouterDashboard />} />
        <Route path="/cultivator" element={<CultivatorDashboard />} />

        {/* LAND LEASING */}
        <Route path="/land-leasing" element={<LandHome />} />
        {/* Remove /explore route since Explore.jsx doesn't exist */}
        <Route path="/list-land" element={<ListYourLand />} />
        <Route path="/file-explorer" element={<FileExplorerDemo />} />
          <Route path="/explore" element={<Explore />} />
          
        
        {/* Dashboard shell with nested routes */}
        <Route path="/dashboard" element={<DashboardHome />}>
          <Route index element={<MyLease />} />            {/* /dashboard */}
          <Route path="saved" element={<SavedLand />} />   {/* /dashboard/saved */}
          <Route path="documents" element={<Document />} />{/* /dashboard/documents */}
          
        </Route>

        <Route path="/view-agreement" element={<ViewAgreement />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;