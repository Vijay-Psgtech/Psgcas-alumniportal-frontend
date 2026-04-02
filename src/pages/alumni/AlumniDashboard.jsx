// src/pages/alumni/AlumniDashboard.jsx
// ✅ UPDATED — Notification system integrated

import React, { useState, useEffect } from "react";
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
  Bell,
  Send,
} from "lucide-react";
import { motion } from "framer-motion";
import SendNotification from "./SendNotification";
import NotificationInbox from "./NotificationInbox";
import { notificationAPI } from "../../services/api";

const AlumniDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [showSendModal, setShowSendModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notification count on mount
  useEffect(() => {
    notificationAPI.getMyNotifications()
      .then((res) => setUnreadCount(res.data.count || 0))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navigationItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "directory", label: "Alumni Directory", icon: Users, path: "/alumni/directory" },
    { id: "map", label: "Alumni Map", icon: Map, path: "/alumni/map" },
    { id: "donations", label: "Donations", icon: Heart, path: "/alumni/donations" },
    { id: "profile", label: "My Profile", icon: User, path: "/alumni/profile" },
    { id: "notifications", label: "Notifications", icon: Bell, path: null },
  ];

  const handleNavClick = (item) => {
    setActiveTab(item.id);
    if (item.id === "notifications") {
      setShowNotifications(true);
    } else if (item.path) {
      navigate(item.path);
    }
    setSidebarOpen(false);
  };

  return (
    <>
      <style>{`

        .dashboard-wrapper {
          display: flex;
          height: 100vh;
          background: #f5f7fa;
          font-family: 'Poppins', 'Inter', sans-serif;
        }

        /* ── Sidebar ─────────────────────────────────────────── */
        .dashboard-sidebar {
          width: 280px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0px 0;
          overflow-y: auto;
          position: fixed;
          left: 0; top: 0;
          height: 100vh;
          z-index: 1000;
          transition: transform 0.3s ease;
        }

        .dashboard-sidebar.closed { transform: translateX(-100%); }

        .sidebar-header {
          padding: 0 20px 30px;
          text-align: center;
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }

        .sidebar-logo { font-size: 32px; margin-bottom: 10px; }
        .sidebar-title { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
        .sidebar-subtitle { font-size: 12px; opacity: 0.8; }

        .sidebar-nav { padding: 20px 0; }

        .nav-item {
          padding: 16px 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255,255,255,0.8);
          transition: all 0.3s ease;
          font-weight: 500;
          position: relative;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.1);
          color: white;
          padding-left: 24px;
        }

        .nav-item.active {
          background: rgba(255,255,255,0.15);
          color: white;
          border-left: 4px solid #ffd700;
          padding-left: 16px;
        }

        .nav-item svg { width: 20px; height: 20px; flex-shrink: 0; }

        .nav-badge {
          margin-left: auto;
          padding: 2px 8px;
          background: #ffd700;
          color: #1a1a2e;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          min-width: 22px;
          text-align: center;
        }

        .sidebar-logout {
          position: absolute;
          bottom: 20px;
          width: calc(100% - 40px);
          margin: 0 20px;
          padding: 12px;
          background: rgba(255,255,255,0.15);
          color: white;
          border: 2px solid rgba(255,255,255,0.3);
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
          background: rgba(255,255,255,0.25);
          border-color: rgba(255,255,255,0.5);
        }

        /* ── Main ────────────────────────────────────────────── */
        .dashboard-main {
          margin-left: 280px;
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: margin-left 0.3s ease;
        }

        .dashboard-main.full-width { margin-left: 0; }

        /* ── Top Bar ─────────────────────────────────────────── */
        .dashboard-topbar {
          background: white;
          padding: 16px 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 100;
          gap: 16px;
        }

        .topbar-left { display: flex; align-items: center; gap: 20px; }
        .topbar-title { font-size: 22px; font-weight: 700; color: #1e3c72; }

        .topbar-right { display: flex; align-items: center; gap: 14px; }

        /* Send Notification CTA */
        .btn-send-notif {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s;
          font-family: 'Poppins', 'Inter', sans-serif;
          box-shadow: 0 4px 14px rgba(102,126,234,0.35);
          white-space: nowrap;
        }

        .btn-send-notif:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(102,126,234,0.45);
        }

        /* Bell icon button */
        .btn-bell {
          position: relative;
          width: 42px; height: 42px;
          border-radius: 12px;
          background: #f1f5f9;
          border: 1.5px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .btn-bell:hover { background: #e0e7ff; color: #667eea; }

        .btn-bell-dot {
          position: absolute;
          top: 7px; right: 7px;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #ef4444;
          border: 2px solid white;
        }

        .user-greeting { text-align: right; }
        .user-name { font-size: 14px; font-weight: 600; color: #1e3c72; }
        .user-status { font-size: 12px; color: #666; }

        .user-avatar {
          width: 42px; height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 16px;
          flex-shrink: 0;
        }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          color: #667eea;
          cursor: pointer;
          font-size: 24px;
        }

        /* ── Content ─────────────────────────────────────────── */
        .dashboard-content {
          flex: 1;
          overflow-y: auto;
          padding: 36px 40px;
        }

        .welcome-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 40px;
          color: white;
          margin-bottom: 36px;
          box-shadow: 0 10px 40px rgba(102,126,234,0.2);
        }

        .welcome-heading { font-size: 28px; font-weight: 800; margin-bottom: 10px; }
        .welcome-text { font-size: 14px; opacity: 0.9; max-width: 500px; line-height: 1.6; }

        /* Send Notification Banner — inside content area */
        .notif-banner {
          background: white;
          border: 1.5px solid #e0e7ff;
          border-radius: 16px;
          padding: 22px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 36px;
          box-shadow: 0 2px 12px rgba(102,126,234,0.08);
        }

        .notif-banner-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .notif-banner-icon {
          width: 48px; height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(102,126,234,0.12), rgba(118,75,162,0.12));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #667eea;
          flex-shrink: 0;
        }

        .notif-banner-title { font-size: 16px; font-weight: 700; color: #0f172a; }
        .notif-banner-desc { font-size: 13px; color: #64748b; margin-top: 2px; }

        .quick-access-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .quick-access-card {
          background: white;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .quick-access-card::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: left 0.4s ease;
        }

        .quick-access-card:hover::before { left: 0; }
        .quick-access-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 30px rgba(102,126,234,0.15);
          border-color: rgba(102,126,234,0.1);
        }

        .card-icon {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1));
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          color: #667eea;
        }

        .card-title { font-size: 17px; font-weight: 700; color: #1e3c72; margin-bottom: 8px; }
        .card-description { font-size: 13px; color: #666; line-height: 1.5; }

        /* Notification Overlay */
        .notif-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10,12,28,0.5);
          backdrop-filter: blur(6px);
          z-index: 1050;
          display: flex;
          justify-content: flex-end;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .notif-panel {
          width: 100%;
          max-width: 560px;
          height: 100vh;
          background: #f8fafc;
          box-shadow: -8px 0 40px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          animation: slideLeft 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes slideLeft {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }

        .notif-panel-header {
          padding: 24px 28px;
          background: white;
          border-bottom: 1px solid #f0f2f8;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .notif-panel-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          font-family: 'Poppins', 'Inter', sans-serif;
        }

        .notif-panel-close {
          width: 36px; height: 36px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
        }

        .notif-panel-close:hover { background: #fee2e2; color: #dc2626; }

        .notif-panel-body {
          flex: 1;
          overflow-y: auto;
          padding: 24px 28px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .dashboard-sidebar { width: 100%; transform: translateX(-100%); }
          .dashboard-sidebar.open { transform: translateX(0); }
          .dashboard-main { margin-left: 0; }
          .menu-toggle { display: block; }
          .dashboard-content { padding: 20px; }
          .welcome-card { padding: 24px; }
          .welcome-heading { font-size: 22px; }
          .quick-access-grid { grid-template-columns: 1fr; }
          .topbar-right { gap: 10px; }
          .user-greeting { display: none; }
          .btn-send-notif span { display: none; }
          .notif-panel { max-width: 100%; }
        }
      `}</style>

      <div className="dashboard-wrapper">
        {/* ── Sidebar ──────────────────────────────────────── */}
        <div className={`dashboard-sidebar ${!sidebarOpen ? "closed" : ""}`}>
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
                onClick={() => handleNavClick(item)}
              >
                <item.icon size={20} />
                {item.label}
                {item.id === "notifications" && unreadCount > 0 && (
                  <span className="nav-badge">{unreadCount}</span>
                )}
              </div>
            ))}
          </div>

          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* ── Main ─────────────────────────────────────────── */}
        <div className={`dashboard-main ${!sidebarOpen ? "" : "full-width"}`}>
          {/* Top Bar */}
          <div className="dashboard-topbar">
            <div className="topbar-left">
              <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="topbar-title">Dashboard</div>
            </div>

            <div className="topbar-right">
              {/* Send Notification CTA */}
              <button className="btn-send-notif" onClick={() => setShowSendModal(true)}>
                <Send size={15} />
                <span>Send Notification</span>
              </button>

              {/* Bell */}
              <button className="btn-bell" onClick={() => setShowNotifications(true)}>
                <Bell size={18} />
                {unreadCount > 0 && <span className="btn-bell-dot" />}
              </button>

              <div className="user-greeting">
                <div className="user-name">{user?.firstName} {user?.lastName}</div>
                <div className="user-status">Alumni Member</div>
              </div>
              <div className="user-avatar">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="dashboard-content">
            <motion.div
              className="welcome-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="welcome-heading">Welcome back, {user?.firstName}! 👋</div>
              <div className="welcome-text">
                You're connected to the PSG Alumni Network. Explore the directory, find fellow alumni, donate to the institution, and stay connected with your batch.
              </div>
            </motion.div>

            {/* Notification Banner */}
            <motion.div
              className="notif-banner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              <div className="notif-banner-left">
                <div className="notif-banner-icon">
                  <Bell size={22} />
                </div>
                <div>
                  <div className="notif-banner-title">Notify Your Network</div>
                  <div className="notif-banner-desc">
                    Send announcements to your batch or to all alumni — admin approved before publishing.
                  </div>
                </div>
              </div>
              <button className="btn-send-notif" onClick={() => setShowSendModal(true)}>
                <Send size={14} />
                Compose
              </button>
            </motion.div>

            {/* Quick Access Cards */}
            <div className="quick-access-grid">
              {[
                { icon: Users, title: "Alumni Directory", desc: "Browse and connect with thousands of alumni worldwide", path: "/alumni/directory", delay: 0.1 },
                { icon: Map, title: "Alumni Map", desc: "Discover alumni in your city and around the globe", path: "/alumni/map", delay: 0.2 },
                { icon: Heart, title: "Make a Donation", desc: "Support PSG and make a difference in students' lives", path: "/alumni/donations", delay: 0.3 },
                { icon: Bell, title: "Notifications", desc: "View announcements and messages from the alumni community", path: null, delay: 0.4, onClick: () => setShowNotifications(true) },
              ].map(({ icon: Icon, title, desc, path, delay, onClick }) => (
                <motion.div
                  key={title}
                  className="quick-access-card"
                  onClick={onClick || (() => path && navigate(path))}
                  whileHover={{ y: -6 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay }}
                >
                  <div className="card-icon"><Icon size={22} /></div>
                  <div className="card-title">{title}</div>
                  <div className="card-description">{desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Send Notification Modal ──────────────────────────── */}
      {showSendModal && (
        <SendNotification
          onClose={() => setShowSendModal(false)}
          onSuccess={() => {
            setShowSendModal(false);
            // Refresh count
            notificationAPI.getMyNotifications()
              .then((res) => setUnreadCount(res.data.count || 0))
              .catch(() => {});
          }}
        />
      )}

      {/* ── Notification Inbox Panel ─────────────────────────── */}
      {showNotifications && (
        <div className="notif-overlay" onClick={() => setShowNotifications(false)}>
          <div className="notif-panel" onClick={(e) => e.stopPropagation()}>
            <div className="notif-panel-header">
              <div className="notif-panel-title">🔔 Notifications</div>
              <button className="notif-panel-close" onClick={() => setShowNotifications(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="notif-panel-body">
              <NotificationInbox />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlumniDashboard;