import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GLogin() {
  const navigate = useNavigate();
  const { signInWithGoogle, pendingRedirect } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRedirectOption, setShowRedirectOption] = useState(false);

  // Show loading state if redirect is in progress
  useEffect(() => {
    if (pendingRedirect) {
      setLoading(true);
      setError("Completing login... Please wait.");
    }
  }, [pendingRedirect]);

  const handleGoogleLogin = async (useRedirect = false) => {
    setError("");
    setLoading(true);
    setShowRedirectOption(false);

    try {
      const user = await signInWithGoogle(useRedirect);

      // If using redirect, we don't get user immediately
      if (!useRedirect && user) {
        navigate("/select-role");
      }
      // If using redirect, the page will reload after auth
    } catch (err) {
      console.error("Login error:", err);

      if (err.code === "popup-blocked") {
        setError(err.message);
        setShowRedirectOption(true);
      } else {
        setError(err.message);
      }

      setLoading(false);
    }
  };

  const handleRedirectLogin = () => {
    handleGoogleLogin(true);
  };

  const clearError = () => {
    setError("");
    setShowRedirectOption(false);
  };

  // Show different UI if redirect is in progress
  if (pendingRedirect) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: "#f5f5f5",
          padding: "20px",
        }}
      >
        <div
          style={{
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0px 0px 20px rgba(0,0,0,0.1)",
            backgroundColor: "white",
            minWidth: "320px",
            maxWidth: "400px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                border: "3px solid #f3f3f3",
                borderTop: "3px solid #4285F4",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginRight: "15px",
              }}
            ></div>
            <h2 style={{ margin: 0, color: "#333" }}>Completing Login</h2>
          </div>

          <p style={{ color: "#666", lineHeight: "1.5" }}>
            Please wait while we complete your login. You will be redirected
            automatically.
          </p>

          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#e3f2fd",
              borderRadius: "8px",
              border: "1px solid #bbdefb",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#1976d2",
                textAlign: "left",
              }}
            >
              <strong>Note:</strong> If you're not redirected automatically,
              check that you completed the Google login process.
            </p>
          </div>
        </div>

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <div
        style={{
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0px 0px 20px rgba(0,0,0,0.1)",
          backgroundColor: "white",
          minWidth: "320px",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#333" }}>Login / Sign Up</h2>

        {error && (
          <div
            style={{
              backgroundColor: "#ffebee",
              border: "1px solid #f44336",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "20px",
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "8px",
              }}
            >
              <strong style={{ color: "#d32f2f" }}>⚠️ Login Issue</strong>
              <button
                onClick={clearError}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ×
              </button>
            </div>
            <div
              style={{
                color: "#d32f2f",
                fontSize: "14px",
                lineHeight: "1.4",
              }}
            >
              {error}
            </div>
          </div>
        )}

        <button
          style={{
            background: "#4285F4",
            color: "white",
            padding: "12px 24px",
            borderRadius: "6px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            width: "100%",
            fontSize: "16px",
            fontWeight: "500",
            marginBottom: "16px",
            opacity: loading ? 0.7 : 1,
            transition: "all 0.3s ease",
          }}
          onClick={() => handleGoogleLogin(false)}
          disabled={loading}
          onMouseOver={(e) => {
            if (!loading) e.target.style.backgroundColor = "#3367D6";
          }}
          onMouseOut={(e) => {
            if (!loading) e.target.style.backgroundColor = "#4285F4";
          }}
        >
          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid transparent",
                  borderTop: "2px solid white",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
              Signing in...
            </div>
          ) : (
            "Login with Google"
          )}
        </button>

        {showRedirectOption && (
          <div
            style={{
              marginTop: "20px",
              paddingTop: "20px",
              borderTop: "1px solid #eee",
            }}
          >
            <p
              style={{ fontSize: "14px", color: "#666", marginBottom: "12px" }}
            >
              Popup blocked? Try this instead:
            </p>
            <button
              onClick={handleRedirectLogin}
              style={{
                background: "#34A853",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                width: "100%",
                fontWeight: "500",
              }}
            >
              Login with Redirect
            </button>
            <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
              This will redirect you to Google and back
            </p>
          </div>
        )}

        <div
          style={{
            marginTop: "20px",
            padding: "12px",
            backgroundColor: "#f8f9fa",
            borderRadius: "6px",
            fontSize: "12px",
            color: "#666",
            textAlign: "left",
          }}
        >
          <strong>Tip:</strong> If popups are blocked, allow them in your
          browser settings or use the redirect option.
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
