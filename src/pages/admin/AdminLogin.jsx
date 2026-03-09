// src/pages/admin/AdminLogin.jsx - FIXED VERSION
// ✅ Proper error handling
// ✅ Correct redirect logic after login
// ✅ Clear debug logs

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../Services/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "admin@psgarts.edu",
    password: "Admin@123",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ Check if already logged in (redirect if admin)
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    console.log("\n📍 AdminLogin.jsx - useEffect running");
    console.log("Loading:", loading);
    console.log("Authenticated:", isAuthenticated);
    console.log("User:", user);
    console.log("User.isAdmin:", user?.isAdmin);

    if (!loading) {
      if (isAuthenticated && user?.isAdmin) {
        console.log("✅ Already logged in as admin - redirecting to dashboard");
        navigate("/admin/dashboard", { replace: true });
      } else if (isAuthenticated && user) {
        console.log("❌ Logged in as non-admin - redirecting to alumni");
        navigate("/alumni/dashboard", { replace: true });
      }
    }
  }, [loading, isAuthenticated, user, navigate]);

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ Handle form submission
  // ═══════════════════════════════════════════════════════════════════════════
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("\n🔐 === ADMIN LOGIN FORM SUBMIT ===");
      console.log("Email:", formData.email);
      console.log("Password length:", formData.password.length);

      // ✅ Call login API
      const response = await authAPI.login(formData.email, formData.password);

      console.log("✅ Login API response received");
      console.log("Response data:", response.data);
      console.log("Token:", response.data.token?.substring(0, 20) + "...");
      console.log("Alumni data:", response.data.alumni);
      console.log("isAdmin flag:", response.data.alumni?.isAdmin);

      // ✅ Check if response has required fields
      if (!response.data.token || !response.data.alumni) {
        throw new Error("Invalid response from server - missing token or alumni data");
      }

      // ✅ Check if user is admin
      if (!response.data.alumni.isAdmin) {
        console.log("❌ User is not an admin");
        setError("This account does not have admin privileges");
        setIsLoading(false);
        return;
      }

      console.log("✅ Admin verified - login successful");
      console.log("✅ AuthContext should now have user with isAdmin: true");

      // ✅ Wait a moment for AuthContext to update, then redirect
      setTimeout(() => {
        console.log("🔄 Redirecting to /admin/dashboard...");
        navigate("/admin/dashboard", { replace: true });
      }, 500);

    } catch (err) {
      console.error("❌ Login error:", err);

      const errorMsg = 
        err.response?.data?.message || 
        err.message || 
        "Login failed. Please check your credentials.";

      setError(errorMsg);
      setIsLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ Show loading state during auth check
  // ═══════════════════════════════════════════════════════════════════════════
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          fontFamily: "'Poppins', 'Inter', sans-serif",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "4px solid rgba(255, 255, 255, 0.2)",
            borderTop: "4px solid white",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ color: "white", fontWeight: "600", fontSize: "16px" }}>
          Verifying session...
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ Login form UI
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div
      style={{
        minHeight: "100vh",
        marginTop: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        fontFamily: "'Poppins', 'Inter', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          padding: "40px 32px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#0c0e1a",
              marginBottom: "8px",
            }}
          >
            Admin Login
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Enter your credentials to access the admin dashboard
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "24px",
              color: "#991b1b",
              fontSize: "14px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "18px" }}>⚠️</span>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email field */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "700",
                color: "#374151",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "8px",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "'Poppins', 'Inter', sans-serif",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
                background: "#f9fafb",
                opacity: isLoading ? 0.6 : 1,
                cursor: isLoading ? "not-allowed" : "auto",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea";
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password field */}
          <div style={{ marginBottom: "28px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "700",
                color: "#374151",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "8px",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "'Poppins', 'Inter', sans-serif",
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  background: "#f9fafb",
                  opacity: isLoading ? 0.6 : 1,
                  cursor: isLoading ? "not-allowed" : "auto",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#d1d5db";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontSize: "16px",
                  opacity: isLoading ? 0.6 : 0.6,
                }}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "14px 16px",
              background: isLoading
                ? "#d1d5db"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "700",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 10px 20px rgba(102, 126, 234, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            {isLoading ? (
              <>
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTop: "2px solid white",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Logging in...
              </>
            ) : (
              <>🔐 Login to Dashboard</>
            )}
          </button>
        </form>

        {/* Info note */}
        <div
          style={{
            marginTop: "24px",
            padding: "12px 14px",
            background: "#f0f4ff",
            border: "1px solid #d6e0ff",
            borderRadius: "8px",
            fontSize: "12px",
            color: "#4f46e5",
            lineHeight: "1.5",
          }}
        >
          <strong>Demo Credentials:</strong>
          <br />
          Email: admin@psgarts.edu
          <br />
          Password: Admin@123
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;