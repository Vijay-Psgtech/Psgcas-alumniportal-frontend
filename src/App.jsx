// src/App.jsx - FULLY FIXED ROUTING
// ✅ Consistent route naming (/alumni/ prefix)
// ✅ All alumni features accessible
// ✅ Proper route guards

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { DataProvider } from "./context/dataConstants";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PremiumNavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import ScrollToTop from "./Components/Scrolltotop";
import ProtectedRoute from "./Components/ProtectedRoute";
import ProtectedAdminRoute from "./Components/ProtectedAdminRoute";

// ═══════════════════════════════════════════════════════════════════════
// PUBLIC PAGES
// ═══════════════════════════════════════════════════════════════════════
import HomePage from "./Components/Homepage";
import LeadershipPage from "./pages/LeadershipPage";
import NewsPage from "./pages/Newspage";
import ContactPage from "./sections/Contact";
import DonatePage from "./pages/DonatePage";

// ═══════════════════════════════════════════════════════════════════════
// EVENT PAGES
// ═══════════════════════════════════════════════════════════════════════
import CasEventsPage from "./pages/CasEventsPage";
import CasEventDetailPage from "./pages/CasEventDetailPage";
import UpcomingEventsPage from "./pages/UpcomingEventsPage";
import PastEventsPage from "./pages/PastEventsPage";
import ReunionsPage from "./pages/ReunionsPage";

// ═══════════════════════════════════════════════════════════════════════
// ALUMNI PAGES - All components
// ═══════════════════════════════════════════════════════════════════════
import AlumniLogin from "./pages/alumni/AlumniLogin";
import AlumniRegister from "./pages/alumni/AlumniRegistration";
import AlumniDashboard from "./pages/alumni/AlumniDashboard";
import AlumniDirectory from "./pages/alumni/AlumniDirectory";
import AlumniMap from "./pages/alumni/AlumniMap";
import AlumniDonations from "./pages/alumni/AlumniDonations";
import ForgotPassword from "./pages/alumni/ForgotPassword";

// ═══════════════════════════════════════════════════════════════════════
// ADMIN PAGES
// ═══════════════════════════════════════════════════════════════════════
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

// ═══════════════════════════════════════════════════════════════════════
// 🔐 AUTH ROUTE WRAPPERS
// ═══════════════════════════════════════════════════════════════════════

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <AppLoader />;

  if (!user) return children;

  if (user.isAdmin) return <Navigate to="/admin/dashboard" replace />;

  return <Navigate to="/alumni/dashboard" replace />;
};

const AdminPublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <AppLoader />;

  if (user?.isAdmin) return <Navigate to="/admin/dashboard" replace />;

  return children;
};

const AppLoader = () => (
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
        borderTop: "4px solid #667eea",
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
    <h1 style={{ fontSize: "72px", fontWeight: "700", color: "#1A3A52", marginBottom: "16px" }}>
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

/**
 * ✅ Main App Component with FIXED ROUTING
 */
function App() {
  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

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

      <DataProvider>
        <AuthProvider>
          <Router>
            <PremiumNavBar />
            <ScrollToTop />

            <div className="app-wrapper">
              <Routes>
                {/* ══════════════════════════════════════════════════════════════ */}
                {/* PUBLIC ROUTES */}
                {/* ══════════════════════════════════════════════════════════════ */}
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/leadership" element={<LeadershipPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/donate" element={<DonatePage />} />
                <Route path="/newsletter" element={<NewsPage />} />
                <Route path="/alumni/stories" element={<NewsPage />} />

                {/* EVENT ROUTES */}
                <Route path="/cas-events" element={<CasEventsPage />} />
                <Route path="/cas-events/:id" element={<CasEventDetailPage />} />
                <Route path="/upcoming-events" element={<UpcomingEventsPage />} />
                <Route path="/past-events" element={<PastEventsPage />} />
                <Route path="/reunions" element={<ReunionsPage />} />

                {/* ══════════════════════════════════════════════════════════════ */}
                {/* ALUMNI AUTH ROUTES (Public Only - only if NOT logged in) */}
                {/* ══════════════════════════════════════════════════════════════ */}
                <Route
                  path="/alumni/register"
                  element={
                    <PublicOnlyRoute>
                      <AlumniRegister />
                    </PublicOnlyRoute>
                  }
                />
                <Route
                  path="/alumni/login"
                  element={
                    <PublicOnlyRoute>
                      <AlumniLogin />
                    </PublicOnlyRoute>
                  }
                />
                <Route path="/alumni/forgot-password" element={<ForgotPassword />} />

                {/* ══════════════════════════════════════════════════════════════ */}
                {/* ALUMNI PROTECTED ROUTES (Auth Required) */}
                {/* ══════════════════════════════════════════════════════════════ */}
                <Route
                  path="/alumni/dashboard"   
                  element={
                    <ProtectedRoute>
                      <AlumniDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/alumni/profile"
                  element={      
                    <ProtectedRoute>
                      <AlumniDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/alumni/directory"
                  element={
                    <ProtectedRoute>
                      <AlumniDirectory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/alumni/map"
                  element={
                    <ProtectedRoute>
                      <AlumniMap />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/alumni/donations"
                  element={
                    <ProtectedRoute>
                      <AlumniDonations />
                    </ProtectedRoute>
                  }
                />

                {/* ══════════════════════════════════════════════════════════════ */}
                {/* ADMIN ROUTES */}
                {/* ══════════════════════════════════════════════════════════════ */}
                <Route
                  path="/admin"
                  element={
                    <AdminPublicOnlyRoute>
                      <AdminLogin />
                    </AdminPublicOnlyRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedAdminRoute>
                      <AdminDashboard />
                    </ProtectedAdminRoute>
                  }
                />

                {/* ══════════════════════════════════════════════════════════════ */}
                {/* 404 FALLBACK - Must be LAST */}
                {/* ══════════════════════════════════════════════════════════════ */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>

            <div className="footer-wrapper">
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </DataProvider>
    </>
  );
}

export default App;