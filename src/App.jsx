import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ScrolltoTop from "./components/ScrolltoTop";
import AuthEventHandler from "./components/AuthEventHandler";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import useAutoLogout from "./hooks/useAutoLogout";

import PremiumNavBar from "./components/NavBar";

// ═══════════════════════════════════════════════════════════════════════
// PUBLIC PAGES
// ═══════════════════════════════════════════════════════════════════════
const HomePage = lazy(() => import("./components/Homepage"));
const LeadershipPage = lazy(() => import("./pages/LeadershipPage"));
const NewsPage = lazy(() => import("./pages/Newspage"));
const ContactPage = lazy(() => import("./sections/Contact"));

// ═══════════════════════════════════════════════════════════════════════
// ALUMNI PAGES - All components
// ═══════════════════════════════════════════════════════════════════════
const AlumniRegistration = lazy(() => import("./pages/alumni/AlumniRegistration"));
const AlumniLogin = lazy(() => import("./pages/alumni/AlumniLogin"));
const ForgotPassword = lazy(() => import("./pages/alumni/ForgotPassword"));
const AlumniProfile = lazy(() => import("./pages/alumni/AlumniProfile"));
const AlumniDirectory = lazy(() => import("./pages/alumni/AlumniDirectory"));
const AlumniMap = lazy(() => import("./pages/alumni/AlumniMap"));

// ═══════════════════════════════════════════════════════════════════════
// ADMIN PAGES
// ═══════════════════════════════════════════════════════════════════════
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));


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
  useAutoLogout();

  return (
    <>
      <AuthEventHandler />
      <PremiumNavBar />
      <ScrolltoTop />
      <Suspense fallback={<AppLoader />}>
        <Routes>
          
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/leadership" element={<LeadershipPage />} />
          <Route path="/newsletter" element={<NewsPage />} />
          <Route path="/alumni/stories" element={<NewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* ALUMNI AUTH */}
          <Route path="alumni/register" element={<PublicOnlyRoute><AlumniRegistration /></PublicOnlyRoute>} />
          <Route path="alumni/login" element={<PublicOnlyRoute><AlumniLogin /></PublicOnlyRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ALUMNI PROTECTED */}
          <Route path="alumni/profile" element={<ProtectedRoute><AlumniProfile /></ProtectedRoute>} />
          <Route path="alumni/directory" element={<ProtectedRoute><AlumniDirectory /></ProtectedRoute>} />
          <Route path="alumni/map" element={<ProtectedRoute><AlumniMap /></ProtectedRoute>} />


          {/* ADMIN */}
          <Route path="admin" element={<AdminPublicOnlyRoute><AdminLogin /></AdminPublicOnlyRoute>} />
          <Route path="admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
        </Routes>
      </Suspense>
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