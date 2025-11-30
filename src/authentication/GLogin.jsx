import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GLogin() {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/select-role");
    } catch (err) {
      console.error(err);
      setError("Google login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          padding: 40,
          borderRadius: 12,
          boxShadow: "0px 0px 20px rgba(0,0,0,0.1)",
          backgroundColor: "white",
          minWidth: 320,
          textAlign: "center",
        }}
      >
        <h2>Login / Sign Up</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <hr style={{ margin: "20px 0" }} />

        <button
          style={{
            background: "#4285F4",
            color: "white",
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            width: "100%",
          }}
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login with Google"}
        </button>
      </div>
    </div>
  );
}
