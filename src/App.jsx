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
        <Route path="/sprouter" element={<CultivatorDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
