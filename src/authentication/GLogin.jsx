// src/authentication/GLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { googleSignIn, emailLogin } from "../firebase";

export default function GLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Google Login
  const handleGoogleLogin = async () => {
    setError("");
    try {
      const { user } = await googleSignIn();
      console.log("Google User:", user);
      navigate("/select-role"); // Navigate to role selection
    } catch (err) {
      console.error(err);
      setError("Google login failed: " + err.message);
    }
  };

  // Email/Password Login
  const handleEmailLogin = async () => {
    setError("");
    try {
      const userCredential = await emailLogin(email, password);
      console.log("Email User:", userCredential.user);
      navigate("/select-role");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      backgroundColor: "#f5f5f5"
    }}>
      <div style={{
        padding: 40,
        borderRadius: 12,
        boxShadow: "0px 0px 20px rgba(0,0,0,0.1)",
        backgroundColor: "white",
        minWidth: 320,
        textAlign: "center"
      }}>
        <h2>Login / Sign Up</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ padding: 8, width: "100%", margin: "10px 0" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ padding: 8, width: "100%", margin: "10px 0" }}
        />

        <button
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            border: "1px solid black",
            cursor: "pointer",
            width: "100%",
            margin: "10px 0"
          }}
          onClick={handleEmailLogin}
        >
          Login
        </button>

        <hr style={{ margin: "20px 0" }} />

        <button
          style={{
            background: "#4285F4",
            color: "white",
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            width: "100%"
          }}
          onClick={handleGoogleLogin}
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}
