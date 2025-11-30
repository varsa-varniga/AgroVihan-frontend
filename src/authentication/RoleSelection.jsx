// src/authentication/RoleSelection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fa",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          padding: "40px 50px",
          borderRadius: 16,
          background: "#ffffff",
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          textAlign: "center",
          width: 350,
        }}
      >
        <h2 style={{ marginBottom: 25, color: "#333" }}>
          Select Your Role
        </h2>

        <button
          onClick={() => navigate("/sprouter")}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: 10,
            border: "none",
            background: "#4CAF50",
            color: "white",
            fontSize: 16,
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          Sprouter
        </button>

        <button
          onClick={() => navigate("/cultivator")}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 10,
            border: "none",
            background: "#0A79DF",
            color: "white",
            fontSize: 16,
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          Cultivator
        </button>
      </div>
    </div>
  );
}
