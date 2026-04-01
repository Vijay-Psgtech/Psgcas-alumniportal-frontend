import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ScrolltoTop from "./components/ScrolltoTop";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

import PremiumNavBar from "./components/NavBar";
import Footer from "./components/Footer";

// ═══════════════════════════════════════════════════════════════════════
// PUBLIC PAGES
// ═══════════════════════════════════════════════════════════════════════
const HomePage = lazy(() => import("./components/Homepage"));
const LeadershipPage = lazy(() => import("./pages/LeadershipPage"));
const NewsPage = lazy(() => import("./pages/Newspage"));
const NewsDetailPage = lazy(() => import("./pages/NewsDetailPage"));
const ContactPage = lazy(() => import("./sections/Contact"));
const DonatePage = lazy(() => import("./pages/DonatePage"));

// ═══════════════════════════════════════════════════════════════════════
// EVENT PAGES
// ═══════════════════════════════════════════════════════════════════════
const CasEventsPage = lazy(() => import("./pages/CasEventsPage"));
const CasEventDetailPage = lazy(() => import("./pages/CasEventDetailPage"));
const UpcomingEventsPage = lazy(() => import("./pages/UpcomingEventsPage"));
const PastEventsPage = lazy(() => import("./pages/PastEventsPage"));
const ReunionsPage = lazy(() => import("./pages/ReunionsPage"));

// ═══════════════════════════════════════════════════════════════════════
// ALUMNI PAGES - All components
// ═══════════════════════════════════════════════════════════════════════
const AlumniRegistration = lazy(
  () => import("./pages/alumni/AlumniRegistration"),
);
const AlumniLogin = lazy(() => import("./pages/alumni/AlumniLogin"));
const ForgotPassword = lazy(() => import("./pages/alumni/ForgotPassword"));
const AlumniProfile = lazy(() => import("./pages/alumni/AlumniProfile"));
const AlumniDirectory = lazy(() => import("./pages/alumni/AlumniDirectory"));
const AlumniMap = lazy(() => import("./pages/alumni/AlumniMap"));
const AlumniDonations = lazy(() => import("./pages/alumni/AlumniDonations"));

// ═══════════════════════════════════════════════════════════════════════
// ADMIN PAGES
// ═══════════════════════════════════════════════════════════════════════
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminEvents = lazy(() => import("./pages/admin/AdminEvents"));
const AlumniUsers = lazy(() => import("./pages/admin/AlumniUsersList"));
const AdminNewsLetter = lazy(() => import("./pages/admin/AdminNewsLetter"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports"));

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
  if (user?.isAdmin && user?.isApproved)
    return <Navigate to="/admin/dashboard" replace />;
  return children;
};

// ── Full-screen spinner while AuthContext verifies the token ──────
const AppLoader = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "16px",
      background: "#f8f5ee",
      fontFamily: "Outfit, sans-serif",
    }}
  >
    <div
      style={{
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        border: "3px solid #e2e8f0",
        borderTop: "3px solid #c9a84c",
        animation: "spin 0.8s linear infinite",
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const NotFoundPage = () => (
  <div
    style={{
      minHeight: "calc(100vh - 70px)",
      marginTop: "70px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #E8F1F8 0%, #F0F5FB 100%)",
      padding: "40px 20px",
      textAlign: "center",
    }}
  >
    <h1
      style={{
        fontSize: "72px",
        fontWeight: "700",
        color: "#1A3A52",
        marginBottom: "16px",
      }}
    >
      404
    </h1>
    <p style={{ fontSize: "18px", color: "#4b5563", marginBottom: "24px" }}>
      Page Not Found
    </p>
    <a
      href="/"
      style={{
        padding: "12px 28px",
        background: "#667eea",
        color: "white",
        borderRadius: "8px",
        textDecoration: "none",
        fontWeight: "600",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => (e.target.style.background = "#764ba2")}
      onMouseLeave={(e) => (e.target.style.background = "#667eea")}
    >
      Go Back Home
    </a>
  </div>
);

export default function App() {
  return (
    <>
      <style>{`

        html,
        body {
          margin: 0;
          padding: 0;
          font-family: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #374151;
          background: #F9FAFB;
        }

        #root {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: #F9FAFB;
        }

        .app-wrapper {
          flex: 1;
          width: 100%;
        }

        .footer-wrapper {
          margin-top: auto;
          width: 100%;
        }

        html {
          scroll-behavior: smooth;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #F3F4F6;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #667eea, #764ba2);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #667eea;
        }

        ::selection {
          background: #667eea;
          color: white;
        }

        ::-moz-selection {
          background: #667eea;
          color: white;
        }
      `}</style>

      <BrowserRouter>
        <PremiumNavBar />
        <ScrolltoTop />
        <Suspense fallback={<AppLoader />}>
          <div className="app-wrapper">
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/leadership" element={<LeadershipPage />} />
              <Route path="/newsletter" element={<NewsPage />} />
              <Route path="/news/:id" element={<NewsDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/donate" element={<DonatePage />} />

              {/* EVENT ROUTES */}
              <Route path="/cas-events" element={<CasEventsPage />} />
              <Route path="/cas-events/:id" element={<CasEventDetailPage />} />
              <Route path="/upcoming-events" element={<UpcomingEventsPage />} />
              <Route path="/past-events" element={<PastEventsPage />} />
              <Route path="/reunions" element={<ReunionsPage />} />

              {/* ALUMNI AUTH */}
              <Route
                path="alumni/register"
                element={
                  <PublicOnlyRoute>
                    <AlumniRegistration />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="alumni/login"
                element={
                  <PublicOnlyRoute>
                    <AlumniLogin />
                  </PublicOnlyRoute>
                }
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* ALUMNI PROTECTED */}
              <Route
                path="alumni/profile"
                element={
                  <ProtectedRoute>
                    <AlumniProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="alumni/directory"
                element={
                  <ProtectedRoute>
                    <AlumniDirectory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="alumni/map"
                element={
                  <ProtectedRoute>
                    <AlumniMap />
                  </ProtectedRoute>
                }
              />

              <Route
                path="alumni/donations"
                element={
                  <ProtectedRoute>
                    <AlumniDonations />
                  </ProtectedRoute>
                }
              />

              {/* ADMIN */}
              <Route
                path="admin"
                element={
                  <AdminPublicOnlyRoute>
                    <AdminLogin />
                  </AdminPublicOnlyRoute>
                }
              />
              <Route
                path="admin/dashboard"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />

              <Route
                path="admin/events"
                element={
                  <ProtectedAdminRoute>
                    <AdminEvents />
                  </ProtectedAdminRoute>
                }
              />

              <Route
                path="admin/newsletters"
                element={
                  <ProtectedAdminRoute>
                    <AdminNewsLetter />
                  </ProtectedAdminRoute>
                }
              />

              <Route
                path="admin/users"
                element={
                  <ProtectedAdminRoute>
                    <AlumniUsers />
                  </ProtectedAdminRoute>
                }
              />

              <Route
                path="admin/reports"
                element={
                  <ProtectedAdminRoute>
                    <AdminReports />
                  </ProtectedAdminRoute>
                }
              />

              {/* 404 FALLBACK - Must be LAST */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
          <div className="footer-wrapper">
            <Footer />
          </div>
        </Suspense>
      </BrowserRouter>
    </>
  );
}
