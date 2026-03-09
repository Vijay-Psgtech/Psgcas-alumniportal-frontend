// src/Components/ProtectedAdminRoute.jsx
// ✅ PROTECTED ADMIN ROUTE COMPONENT
// Prevents unauthorized access to admin routes
// Only allows admin users to access

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedAdminRoute - Only accessible by authenticated admin users
 * 
 * Features:
 * - ✅ Checks if user is authenticated
 * - ✅ Checks if user is admin
 * - ✅ Shows loader while checking auth
 * - ✅ Redirects to login if not authenticated
 * - ✅ Redirects to alumni dashboard if not admin
 */
const ProtectedAdminRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loader while auth is being verified
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
            border: "4px solid rgba(102, 126, 234, 0.2)",
            borderTop: "4px solid white",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ color: "white", fontWeight: "600", fontSize: "16px" }}>
          Loading...
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // ❌ Not authenticated - redirect to admin login
  if (!isAuthenticated || !user) {
    return <Navigate to="/admin" replace />;
  }

  // ❌ Not an admin - redirect to alumni dashboard
  if (!user.isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // ✅ Authenticated admin user - show the route
  return children;
};

export default ProtectedAdminRoute;