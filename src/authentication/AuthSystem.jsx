// src/authentication/AuthSystem.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function AuthSystem() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 30, textAlign: "center" }}>
      <button
        style={{
          background: "green",
          color: "white",
          padding: "12px 25px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "18px",
          marginTop: "1px"
        }}
        onClick={() => navigate("/glogin")}
      >
        Login / Sign Up
      </button>
    </div>
  );
}
