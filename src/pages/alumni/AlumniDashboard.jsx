// src/pages/alumni/AlumniDashboard.jsx
// ✅ UPDATED - Uses consistent /alumni/ routing

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Map,
  Heart,
  User,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react";
import { motion } from "framer-motion";

const AlumniDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navigationItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    {
      id: "directory",
      label: "Alumni Directory",
      icon: Users,
      path: "/alumni/directory",
    },
    { id: "map", label: "Alumni Map", icon: Map, path: "/alumni/map" },
    { id: "donations", label: "Donations", icon: Heart, path: "/alumni/donations" },
    { id: "profile", label: "My Profile", icon: User, path: "/alumni/profile" },
  ];

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .dashboard-wrapper {
          display: flex;
          height: 100vh;
          background: #f5f7fa;
          font-family: 'Poppins', 'Inter', sans-serif;
        }

        /* Sidebar */
        .dashboard-sidebar {
          width: 280px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px 0;
          overflow-y: auto;
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          z-index: 1000;
          transition: transform 0.3s ease;
        }

        .dashboard-sidebar.closed {
          transform: translateX(-100%);
        }

        .sidebar-header {
          padding: 0 20px 30px;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .sidebar-logo {
          font-size: 32px;
          margin-bottom: 10px;
        }

        .sidebar-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .sidebar-subtitle {
          font-size: 12px;
          opacity: 0.8;
        }

        .sidebar-nav {
          padding: 20px 0;
        }

        .nav-item {
          padding: 16px 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          font-weight: 500;
          position: relative;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          padding-left: 24px;
        }

        .nav-item.active {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border-left: 4px solid #ffd700;
          padding-left: 16px;
        }

        .nav-item svg {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .sidebar-logout {
          position: absolute;
          bottom: 20px;
          width: calc(100% - 40px);
          margin: 0 20px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: center;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .sidebar-logout:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.5);
        }

        /* Main Content */
        .dashboard-main {
          margin-left: 280px;
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: margin-left 0.3s ease;
        }

        .dashboard-main.full-width {
          margin-left: 0;
        }

        /* Top Bar */
        .dashboard-topbar {
          background: white;
          padding: 20px 30px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 100;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .topbar-title {
          font-size: 24px;
          font-weight: 700;
          color: #1e3c72;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .user-greeting {
          text-align: right;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: #1e3c72;
        }

        .user-status {
          font-size: 12px;
          color: #666;
        }

        .user-avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 18px;
        }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          color: #667eea;
          cursor: pointer;
          font-size: 24px;
        }

        /* Content Area */
        .dashboard-content {
          flex: 1;
          overflow-y: auto;
          padding: 40px;
        }

        /* Welcome Card */
        .welcome-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 40px;
          color: white;
          margin-bottom: 40px;
          box-shadow: 0 10px 40px rgba(102, 126, 234, 0.2);
          animation: slideIn 0.6s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .welcome-heading {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }

        .welcome-text {
          font-size: 15px;
          opacity: 0.9;
          max-width: 500px;
        }

        /* Quick Access Grid */
        .quick-access-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          animation: staggerChildren 0.6s ease-out;
        }

        @keyframes staggerChildren {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .quick-access-card {
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .quick-access-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: left 0.4s ease;
        }

        .quick-access-card:hover::before {
          left: 0;
        }

        .quick-access-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.15);
          border-color: rgba(102, 126, 234, 0.1);
        }

        .card-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          color: #667eea;
        }

        .card-icon svg {
          width: 24px;
          height: 24px;
        }

        .card-title {
          font-size: 18px;
          font-weight: 700;
          color: #1e3c72;
          margin-bottom: 8px;
        }

        .card-description {
          font-size: 14px;
          color: #666;
          line-height: 1.5;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .dashboard-sidebar {
            width: 100%;
            transform: translateX(-100%);
          }

          .dashboard-sidebar.open {
            transform: translateX(0);
          }

          .dashboard-main {
            margin-left: 0;
          }

          .dashboard-main.full-width {
            margin-left: 0;
          }

          .menu-toggle {
            display: block;
          }

          .dashboard-content {
            padding: 20px;
          }

          .welcome-card {
            padding: 25px;
          }

          .welcome-heading {
            font-size: 24px;
          }

          .quick-access-grid {
            grid-template-columns: 1fr;
          }

          .topbar-right {
            gap: 12px;
          }

          .user-greeting {
            display: none;
          }
        }
      `}</style>

      <div className="dashboard-wrapper">
        {/* Sidebar */}
        <div
          className={`dashboard-sidebar ${!sidebarOpen ? "closed" : ""}`}
          style={{ transform: sidebarOpen ? "translateX(0)" : "" }}
        >
          <div className="sidebar-header">
            <div className="sidebar-logo">🎓</div>
            <div className="sidebar-title">Alumni Hub</div>
            <div className="sidebar-subtitle">PSG Alumni Network</div>
          </div>

          <div className="sidebar-nav">
            {navigationItems.map((item) => (
              <div
                key={item.id}
                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(item.id);
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
              >
                <item.icon size={20} />
                {item.label}
              </div>
            ))}
          </div>

          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className={`dashboard-main ${!sidebarOpen ? "" : "full-width"}`}>
          {/* Top Bar */}
          <div className="dashboard-topbar">
            <div className="topbar-left">
              <button
                className="menu-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="topbar-title">Dashboard</div>
            </div>

            <div className="topbar-right">
              <div className="user-greeting">
                <div className="user-name">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="user-status">Alumni Member</div>
              </div>
              <div className="user-avatar">
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="dashboard-content">
            {/* Welcome Card */}
            <motion.div
              className="welcome-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="welcome-heading">
                Welcome back, {user?.firstName}! 👋
              </div>
              <div className="welcome-text">
                You're now connected to the PSG Alumni Network. Explore the
                directory, find fellow alumni, donate to the institution, and
                stay connected with your batch.
              </div>
            </motion.div>

            {/* Quick Access Cards */}
            <div className="quick-access-grid">
              <motion.div
                className="quick-access-card"
                onClick={() => navigate("/alumni/directory")}
                whileHover={{ y: -8 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="card-icon">
                  <Users size={24} />
                </div>
                <div className="card-title">Alumni Directory</div>
                <div className="card-description">
                  Browse and connect with thousands of alumni worldwide
                </div>
              </motion.div>

              <motion.div
                className="quick-access-card"
                onClick={() => navigate("/alumni/map")}
                whileHover={{ y: -8 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="card-icon">
                  <Map size={24} />
                </div>
                <div className="card-title">Alumni Map</div>
                <div className="card-description">
                  Discover alumni in your city and around the globe
                </div>
              </motion.div>

              <motion.div
                className="quick-access-card"
                onClick={() => navigate("/alumni/donations")}
                whileHover={{ y: -8 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="card-icon">
                  <Heart size={24} />
                </div>
                <div className="card-title">Make a Donation</div>
                <div className="card-description">
                  Support PSG and make a difference in students' lives
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlumniDashboard;