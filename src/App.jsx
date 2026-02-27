import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ScrolltoTop from "./components/ScrolltoTop";

import AlumniRegistration from "./pages/alumni/AlumniRegistration";
import AlumniLogin from "./pages/alumni/AlumniLogin";
import ForgotPassword from "./pages/alumni/ForgotPassword";

import AdminLogin from "./pages/admin/AdminLogin";

// ── Redirects logged-in ALUMNI away from login/register ──────────
const PublicOnlyRoute = ({ children }) => {
  const { user, authLoading } = useAuth();
  console.log("PublicOnlyRoute - user:", user, "authLoading:", authLoading);
  if (authLoading) return <AppLoader />;
  if (!user) return children;
  if (user.isAdmin) return <Navigate to="/admin/dashboard" replace />;
  if (user.isApproved) return <Navigate to="/alumni/profile" replace />;
  return children; // pending alumni can still see registration page
};

// ── Redirects logged-in ADMIN away from admin login ──────────────
const AdminPublicOnlyRoute = ({ children }) => {
  const { user, authLoading } = useAuth();
  if (authLoading) return <AppLoader />;
  if (user?.isAdmin && user?.isApproved) return <Navigate to="/admin/dashboard" replace />;
  return children;
};


// ── Full-screen spinner while AuthContext verifies the token ──────
const AppLoader = () => (
  <div style={{
    minHeight: "100vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: "16px",
    background: "#f8f5ee", fontFamily: "Outfit, sans-serif",
  }}>
    <div style={{
      width: "44px", height: "44px", borderRadius: "50%",
      border: "3px solid #e2e8f0", borderTop: "3px solid #c9a84c",
      animation: "spin 0.8s linear infinite",
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

function AppRoutes() {
  return (
    <>
      <ScrolltoTop />
      <Routes>
       
        {/* ALUMNI AUTH */}
        <Route path="alumni/register" element={<PublicOnlyRoute><AlumniRegistration /></PublicOnlyRoute>} />
        <Route path="alumni/login"    element={<PublicOnlyRoute><AlumniLogin /></PublicOnlyRoute>} />
        <Route path="alumni/forgot-password" element={<ForgotPassword />} />

        {/* ADMIN */}
        <Route path="admin" element={<AdminPublicOnlyRoute><AdminLogin /></AdminPublicOnlyRoute>} />

      </Routes>
    </>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}