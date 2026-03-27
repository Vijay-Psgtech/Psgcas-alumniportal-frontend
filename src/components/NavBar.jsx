// src/Components/NavBar.jsx - TRANSPARENT STYLE
// ✅ Modern glassmorphism design with transparent background
// Features: Role-based navigation, Transparent/clean aesthetic, Blue accent

"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Heart,
  Settings,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from ".././assets/Images/1280.png";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [navVisible, setNavVisible] = useState(true);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [alumniOpen, setAlumniOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileDiscoverOpen, setMobileDiscoverOpen] = useState(false);
  const [mobileEventsOpen, setMobileEventsOpen] = useState(false);
  const [mobileAlumniOpen, setMobileAlumniOpen] = useState(false);

  const navRef = useRef(null);
  const userMenuRef = useRef(null);

  // ✅ Navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      { label: "Home", path: "/" },
      { label: "Leadership", path: "/leadership" },
      { label: "Newsletter", path: "/newsletter" },
      {
        label: "Events",
        submenu: [
          { label: "Current Events", path: "/cas-events" },
          { label: "Upcoming Events", path: "/upcoming-events" },
          { label: "Past Events", path: "/past-events" },
          { label: "Reunions", path: "/reunions" },
        ],
      },
      {
        label: "Find Alumni",
        submenu: [
          {
            label: "Alumni Directory",
            path: "/alumni/directory",
            requireAuth: true,
          },
          // { label: "Success Stories", path: "/alumni/stories" },
          { label: "Alumni Map", path: "/alumni/map", requireAuth: true },
        ],
      },

      { label: "Contact", path: "/contact" },
    ];

    if (user?.isAdmin) {
      baseItems.push({
        label: "Admin",
        submenu: [
          { label: "Dashboard", path: "/admin/dashboard" },
          { label: "Events", path: "/admin/events" },
          { label: "Users", path: "/admin/users" },
          { label: "Reports", path: "/admin/reports" },
        ],
      });
    }

    return baseItems;
  };

  const navItems = getNavItems();

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 30);
      setNavVisible(!(current > lastScroll && current > 100));
      setLastScroll(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setDiscoverOpen(false);
        setEventsOpen(false);
        setAlumniOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setUserMenuOpen(false);
    setIsOpen(false);
    navigate("/");
  }, [logout, navigate]);

  const closeAllMenus = useCallback(() => {
    setIsOpen(false);
    setDiscoverOpen(false);
    setEventsOpen(false);
    setAlumniOpen(false);
    setMobileDiscoverOpen(false);
    setMobileEventsOpen(false);
    setMobileAlumniOpen(false);
  }, []);

  const isDropdownOpen = (label) => {
    if (label === "Find Alumni") return discoverOpen;
    if (label === "Events") return eventsOpen;
    if (label === "Admin") return alumniOpen;
    return false;
  };

  const toggleDropdown = (label) => {
    if (label === "Find Alumni") setDiscoverOpen((p) => !p);
    if (label === "Events") setEventsOpen((p) => !p);
    if (label === "Admin") setAlumniOpen((p) => !p);
  };

  const toggleMobileDropdown = (label) => {
    if (label === "Find Alumni") setMobileDiscoverOpen((p) => !p);
    if (label === "Events") setMobileEventsOpen((p) => !p);
    if (label === "Admin") setMobileAlumniOpen((p) => !p);
  };

  const isMobileDropdownOpen = (label) => {
    if (label === "Find Alumni") return mobileDiscoverOpen;
    if (label === "Events") return mobileEventsOpen;
    if (label === "Admin") return mobileAlumniOpen;
    return false;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');

        :root {
          --primary: #3b82f6;
          --primary-light: #60a5fa;
          --text-primary: #1a1f3a;
          --text-secondary: #4b5563;
          --border: rgba(59, 130, 246, 0.15);
          --bg-light: rgba(255, 255, 255, 0.7);
          --bg-lighter: rgba(255, 255, 255, 0.5);
        }

        .psg-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
        }

        .navbar-hidden {
          transform: translateY(-100%);
        }

        .navbar-bg {
          position: absolute;
          inset: 0;
          background: ${
            scrolled ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.4)"
          };
          backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(59, 130, 246, 0.12);
          transition: all 0.4s ease;
        }

        .navbar-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #3b82f6, transparent);
          opacity: 0.3;
        }

        .navbar-container {
          max-width: 1340px;
          margin: 0 auto;
          padding: 0 32px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 2;
        }

        /* LOGO */
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .logo-img-wrapper {
          width: 198px;
          height: 68px;
          border-radius: 10px;
          border: 1px solid rgba(59, 130, 246, 0.25);
          background: rgba(59, 130, 246, 0.08);
          padding: 3px;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .navbar-logo:hover .logo-img-wrapper {
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: 0 0 18px rgba(59, 130, 246, 0.15);
        }

        .logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 4px;
        }

        .logo-text {
          line-height: 1.15;
        }

        .logo-main {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 15px;
          background: linear-gradient(134deg, #2563eb 0%, #3b82f6 50%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 0.01em;
        }

        .logo-sub {
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6b7280;
        }

        /* DESKTOP MENU */
        .navbar-menu {
          display: flex;
          align-items: center;
          gap: 32px;
          list-style: none;
        }

        .menu-item {
          position: relative;
        }

        .menu-link {
          position: relative;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-primary);
          text-decoration: none;
          padding: 10px 0;
          padding-bottom: 3px;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: color 0.25s ease;
          font-family: 'Outfit', sans-serif;
        }

        .menu-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #2563eb, #3b82f6);
          transition: width 0.32s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 2px;
        }

        .menu-link:hover,
        .menu-link.active {
          color: var(--primary);
        }

        .menu-link:hover::after,
        .menu-link.active::after {
          width: 100%;
        }

        .chevron-icon {
          transition: transform 0.3s ease;
        }

        .chevron-open {
          transform: rotate(180deg);
        }

        /* DROPDOWN */
        .dropdown-panel {
          position: absolute;
          top: calc(100% + 18px);
          left: 50%;
          transform: translateX(-50%) scaleY(0.88) translateY(-10px);
          transform-origin: top center;
          width: 210px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(59, 130, 246, 0.15);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
          opacity: 0;
          pointer-events: none;
          transition: all 0.22s ease;
          backdrop-filter: blur(20px);
          z-index: 1000;
        }

        .dropdown-panel.open {
          opacity: 1;
          pointer-events: auto;
          transform: translateX(-50%) scaleY(1) translateY(0);
        }

        .dropdown-bar {
          height: 2px;
          background: linear-gradient(90deg, #2563eb, #3b82f6);
        }

        .dropdown-item {
          display: block;
          padding: 11px 18px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.2s ease;
          border-left: 2px solid transparent;
          font-family: 'Outfit', sans-serif;
        }

        .dropdown-item:hover,
        .dropdown-item.active-dd {
          color: var(--primary);
          background: rgba(59, 130, 246, 0.08);
          border-left-color: rgba(59, 130, 246, 0.5);
        }

        /* ACTIONS */
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-ghost {
          padding: 8px 20px;
          border: 1px solid rgba(59, 130, 246, 0.25);
          border-radius: 7px;
          background: rgba(255, 255, 255, 0.3);
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.28s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .btn-ghost:hover {
          border-color: rgba(59, 130, 246, 0.4);
          color: var(--primary);
          background: rgba(59, 130, 246, 0.08);
        }

        .btn-blue {
          padding: 9px 22px;
          border: none;
          border-radius: 7px;
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .btn-blue:hover {
          box-shadow: 0 6px 25px rgba(59, 130, 246, 0.4);
          transform: translateY(-2px);
        }

        /* USER MENU */
        .user-btn {
          display: flex;
          align-items: center;
          gap: 9px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.15);
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .user-btn:hover {
          background: rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
          color: #ffffff;
          transition: box-shadow 0.3s ease;
          flex-shrink: 0;
        }

        .user-btn:hover .user-avatar {
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.4);
        }

        .user-name {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
          line-height: 1.2;
          text-align: left;
        }

        .user-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 225px;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(59, 130, 246, 0.12);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(20px);
          animation: dropFadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1001;
        }

        @keyframes dropFadeIn {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .user-dropdown-header {
          padding: 14px 18px 12px;
          border-bottom: 1px solid rgba(59, 130, 246, 0.08);
        }

        .ud-label {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 3px;
        }

        .ud-name {
          font-size: 14px;
          font-weight: 600;
          color: #1a1f3a;
        }

        .ud-role {
          font-size: 11px;
          color: #6b7280;
          margin-top: 2px;
        }

        .ud-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 18px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: var(--text-secondary);
          text-decoration: none;
          border-left: 2px solid transparent;
          transition: all 0.2s ease;
          background: none;
          border-right: none;
          border-top: none;
          border-bottom: none;
          width: 100%;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
        }

        .ud-item:hover {
          color: var(--primary);
          background: rgba(59, 130, 246, 0.08);
          border-left-color: rgba(59, 130, 246, 0.5);
        }

        .ud-item.danger {
          color: #dc2626;
        }

        .ud-item.danger:hover {
          color: #dc2626;
          background: rgba(220, 38, 38, 0.08);
          border-left-color: rgba(220, 38, 38, 0.5);
        }

        .ud-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.12), transparent);
          margin: 4px 0;
        }

        /* HAMBURGER */
        .hamburger {
          display: none;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.25);
          border-radius: 8px;
          padding: 8px;
          color: var(--primary);
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .hamburger:hover {
          border-color: rgba(59, 130, 246, 0.4);
          background: rgba(59, 130, 246, 0.08);
        }

        /* MOBILE MENU */
        .mobile-panel {
          display: none;
          background: rgba(255, 255, 255, 0.8);
          border-top: 1px solid rgba(59, 130, 246, 0.12);
          backdrop-filter: blur(20px);
          padding: 8px 24px 28px;
          animation: mobileIn 0.25s ease;
        }

        @keyframes mobileIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .m-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 0;
          font-size: 15px;
          font-weight: 500;
          color: var(--text-secondary);
          border-bottom: 1px solid rgba(59, 130, 246, 0.08);
          text-decoration: none;
          background: none;
          border-left: none;
          border-right: none;
          border-top: none;
          width: 100%;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          transition: color 0.2s ease;
        }

        .m-link:hover,
        .m-link.active {
          color: var(--primary);
        }

        .m-submenu {
          overflow: hidden;
          transition: max-height 0.35s ease;
          padding-left: 16px;
          border-left: 1px solid rgba(59, 130, 246, 0.12);
          margin-left: 6px;
          margin-top: 4px;
          margin-bottom: 4px;
        }

        .m-sub-link {
          display: block;
          padding: 10px 0;
          font-size: 13.5px;
          font-weight: 400;
          color: var(--text-secondary);
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 0.2s ease;
          font-family: 'Outfit', sans-serif;
        }

        .m-sub-link:hover {
          color: var(--primary);
        }

        .m-user-card {
          margin: 18px 0 12px;
          padding: 14px 16px;
          border-radius: 10px;
          background: rgba(59, 130, 246, 0.08);
          border: 1px solid rgba(59, 130, 246, 0.12);
        }

        .m-btn-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 18px;
          border-top: 1px solid rgba(59, 130, 246, 0.08);
          padding-top: 18px;
        }

        .m-btn {
          padding: 12px;
          border-radius: 9px;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-align: center;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.25s ease;
          border: none;
          width: 100%;
        }

        .m-btn-blue {
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .m-btn-ghost {
          background: rgba(255, 255, 255, 0.3);
          color: var(--text-primary);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .m-btn-ghost:hover {
          border-color: rgba(59, 130, 246, 0.35);
          color: var(--primary);
          background: rgba(59, 130, 246, 0.08);
        }

        .m-btn-danger {
          background: rgba(220, 38, 38, 0.08);
          color: #dc2626;
          border: 1px solid rgba(220, 38, 38, 0.15);
        }

        .m-btn-danger:hover {
          background: rgba(220, 38, 38, 0.12);
          color: #dc2626;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .navbar-menu,
          .navbar-actions {
            display: none;
          }

          .hamburger {
            display: flex;
          }

          .mobile-panel {
            display: block;
          }

          .navbar-container {
            padding: 0 20px;
          }
        }

        @media (max-width: 640px) {
          .logo-img-wrapper {
            width: 40px;
            height: 40px;
          }

          .logo-main {
            font-size: 14px;
          }

          .logo-sub {
            font-size: 8px;
          }
        }
      `}</style>

      <nav
        className={`psg-navbar ${!navVisible ? "navbar-hidden" : ""}`}
        ref={navRef}
      >
        <div className="navbar-glow"></div>
        <div className="navbar-bg"></div>

        <div className="navbar-container">
          {/* LOGO */}
          <Link to="/" className="navbar-logo">
            <div className="logo-img-wrapper">
              <img src={Logo} alt="PSG Logo" className="logo-img" />
            </div>
            <div className="logo-text">
              <div className="logo-main">PSG ARTS Alumni</div>
              <div className="logo-sub">Foundation</div>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <ul className="navbar-menu">
            {navItems.map((item) =>
              item.submenu ? (
                <li key={item.label} className="menu-item">
                  <button
                    className={`menu-link ${isDropdownOpen(item.label) ? "active" : ""}`}
                    onClick={() => toggleDropdown(item.label)}
                  >
                    {item.label}
                    <ChevronDown
                      size={13}
                      className={`chevron-icon ${isDropdownOpen(item.label) ? "chevron-open" : ""}`}
                    />
                  </button>
                  <div
                    className={`dropdown-panel ${isDropdownOpen(item.label) ? "open" : ""}`}
                  >
                    <div className="dropdown-bar" />
                    <div style={{ padding: "6px 0" }}>
                      {item.submenu
                        .filter((sub) => !sub.requireAuth || user)
                        .map((sub) => (
                          <NavLink
                            key={sub.path}
                            to={sub.path}
                            onClick={() => closeAllMenus()}
                            className={({ isActive }) =>
                              `dropdown-item ${isActive ? "active-dd" : ""}`
                            }
                          >
                            {sub.label}
                          </NavLink>
                        ))}
                    </div>
                  </div>
                </li>
              ) : (
                <li key={item.path} className="menu-item">
                  <NavLink
                    to={item.path}
                    onClick={() => closeAllMenus()}
                    className={({ isActive }) =>
                      `menu-link ${isActive ? "active" : ""}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>

          {/* DESKTOP ACTIONS */}
          <div className="navbar-actions">
            {user ? (
              <div style={{ position: "relative" }} ref={userMenuRef}>
                <button
                  className="user-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="user-avatar">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </div>
                  <div>
                    <div className="user-name">{user.firstName}</div>
                  </div>
                  <ChevronDown
                    size={13}
                    className={`chevron-icon ${userMenuOpen ? "chevron-open" : ""}`}
                  />
                </button>

                {userMenuOpen && (
                  <div className="user-dropdown">
                    <div className="dropdown-bar" />
                    <div className="user-dropdown-header">
                      <div className="ud-label">Signed in as</div>
                      <div className="ud-name">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="ud-role">
                        {user.isAdmin ? "Admin User" : "Alumni Member"}
                      </div>
                    </div>
                    <div style={{ padding: "6px 0" }}>
                      <NavLink
                        to="/alumni/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="ud-item"
                      >
                        <User size={14} />
                        My Profile
                      </NavLink>
                      <NavLink
                        to="/alumni/donations"
                        onClick={() => setUserMenuOpen(false)}
                        className="ud-item"
                      >
                        <Heart size={14} />
                        My Donations
                      </NavLink>
                      {user.isAdmin && (
                        <>
                          <div className="ud-divider" />
                          <NavLink
                            to="/admin/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="ud-item"
                          >
                            <LayoutDashboard size={14} />
                            Admin Dashboard
                          </NavLink>
                          <NavLink
                            to="/admin/events"
                            onClick={() => setUserMenuOpen(false)}
                            className="ud-item"
                          >
                            <Calendar size={14} />
                            Manage Events
                          </NavLink>
                          <NavLink
                            to="/admin/users"
                            onClick={() => setUserMenuOpen(false)}
                            className="ud-item"
                          >
                            <Users size={14} />
                            Users
                          </NavLink>
                          <NavLink
                            to="/admin/reports"
                            onClick={() => setUserMenuOpen(false)}
                            className="ud-item"
                          >
                            <FileText size={14} />
                            Reports
                          </NavLink>
                        </>
                      )}
                      <div className="ud-divider" />
                      <button onClick={handleLogout} className="ud-item danger">
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/alumni/login" className="btn-ghost">
                  Sign In
                </Link>
                <Link to="/donate" className="btn-blue">
                  Donate
                </Link>
              </>
            )}
          </div>

          {/* HAMBURGER */}
          <button
            className="hamburger"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="mobile-panel">
            {navItems.map((item) =>
              item.submenu ? (
                <div key={item.label}>
                  <button
                    className="m-link"
                    onClick={() => toggleMobileDropdown(item.label)}
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      className={`chevron-icon ${isMobileDropdownOpen(item.label) ? "chevron-open" : ""}`}
                    />
                  </button>
                  <div
                    className="m-submenu"
                    style={{
                      maxHeight: isMobileDropdownOpen(item.label)
                        ? "300px"
                        : "0",
                    }}
                  >
                    {item.submenu
                      .filter((sub) => !sub.requireAuth || user)
                      .map((sub) => (
                        <NavLink
                          key={sub.path}
                          to={sub.path}
                          onClick={() => closeAllMenus()}
                          className="m-sub-link"
                        >
                          {sub.label}
                        </NavLink>
                      ))}
                  </div>
                </div>
              ) : (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => closeAllMenus()}
                  className={({ isActive }) =>
                    `m-link ${isActive ? "active" : ""}`
                  }
                >
                  {item.label}
                </NavLink>
              ),
            )}

            {user ? (
              <>
                <div className="m-user-card">
                  <div className="ud-label">Signed in as</div>
                  <div className="ud-name">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="ud-role">
                    {user.isAdmin ? "Admin User" : "Alumni Member"}
                  </div>
                </div>

                <NavLink
                  to="/alumni/profile"
                  onClick={() => closeAllMenus()}
                  className="m-link"
                >
                  <User size={15} />
                  My Profile
                </NavLink>

                <NavLink
                  to="/alumni/donations"
                  onClick={() => closeAllMenus()}
                  className="m-link"
                >
                  <Heart size={15} />
                  My Donations
                </NavLink>

                {user.isAdmin && (
                  <>
                    <NavLink
                      to="/admin/dashboard"
                      onClick={() => closeAllMenus()}
                      className="m-link"
                    >
                      <LayoutDashboard size={15} />
                      Admin Dashboard
                    </NavLink>
                    <NavLink
                      to="/admin/events"
                      onClick={() => closeAllMenus()}
                      className="m-link"
                    >
                      <Calendar size={15} />
                      Manage Events
                    </NavLink>
                  </>
                )}

                <div className="m-btn-group">
                  <button
                    onClick={() => {
                      handleLogout();
                      closeAllMenus();
                    }}
                    className="m-btn m-btn-danger"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="m-btn-group">
                <Link
                  to="/alumni/login"
                  onClick={() => closeAllMenus()}
                  className="m-btn m-btn-ghost"
                >
                  Alumni Login
                </Link>
                <Link
                  to="/donate"
                  onClick={() => closeAllMenus()}
                  className="m-btn m-btn-blue"
                >
                  Donate Now
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
