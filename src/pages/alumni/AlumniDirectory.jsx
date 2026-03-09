// src/pages/alumni/AlumniDirectory.jsx
// ✅ COMPLETE ALUMNI DIRECTORY WITH BACKEND

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, X, Mail, Linkedin, LogOut, ChevronLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { alumniAPI } from "../../Services/api";

const AlumniDirectory = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [alumniData, setAlumniData] = useState({
    alumni: [],
    departments: [],
    years: [],
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // ✅ Load all alumni from backend API
  useEffect(() => {
    const loadAlumni = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await alumniAPI.getAllAlumni();
        const alumni = response.data.data?.alumni || response.data?.alumni || [];

        const uniqueDepartments = [
          ...new Set(alumni.map((a) => a.department)),
        ].filter(Boolean).sort();

        const uniqueYears = [
          ...new Set(alumni.map((a) => a.graduationYear)),
        ].sort((a, b) => b - a);

        setAlumniData({
          alumni,
          departments: uniqueDepartments,
          years: uniqueYears,
        });
      } catch (err) {
        console.error("Error loading alumni:", err);
        setError(err.response?.data?.message || "Failed to load alumni");
      } finally {
        setLoading(false);
      }
    };

    loadAlumni();
  }, []);

  // ✅ Filter alumni
  const filteredAlumni = useMemo(() => {
    let filtered = alumniData.alumni;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.firstName.toLowerCase().includes(term) ||
          a.lastName.toLowerCase().includes(term) ||
          a.email.toLowerCase().includes(term) ||
          (a.currentCompany && a.currentCompany.toLowerCase().includes(term))
      );
    }

    if (filterDepartment) {
      filtered = filtered.filter((a) => a.department === filterDepartment);
    }

    if (filterYear) {
      filtered = filtered.filter(
        (a) => Number(a.graduationYear) === Number(filterYear)
      );
    }

    return filtered;
  }, [searchTerm, filterDepartment, filterYear, alumniData.alumni]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setFilterDepartment("");
    setFilterYear("");
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <style>{`
        .alumni-directory-wrapper {
          min-height: 100vh;
          background: #f5f7fa;
          font-family: 'Poppins', 'Inter', sans-serif;
        }

        /* Welcome Header */
        .welcome-banner {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
        }

        .welcome-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .welcome-text h2 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .welcome-text h2 span {
          color: #ffd700;
        }

        .welcome-text p {
          font-size: 14px;
          opacity: 0.9;
        }

        .btn-logout {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }

        .btn-logout:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
        }

        /* Directory Section */
        .directory-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .directory-inner {
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        }

        .directory-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .directory-title {
          font-size: 32px;
          font-weight: 800;
          color: #1e3c72;
          margin-bottom: 12px;
        }

        .directory-subtitle {
          font-size: 15px;
          color: #666;
        }

        /* Filters Card */
        .filters-card {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 32px;
        }

        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: white;
          border-radius: 10px;
          border: 2px solid #e0e0e0;
          margin-bottom: 20px;
          transition: all 0.3s;
        }

        .search-wrapper:focus-within {
          border-color: #667eea;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
        }

        .search-icon {
          padding: 0 14px;
          color: #999;
        }

        .search-input {
          flex: 1;
          padding: 14px 0;
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
          font-family: inherit;
        }

        .search-input::placeholder {
          color: #aaa;
        }

        .filter-controls {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .filter-select {
          padding: 10px 14px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          background: white;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .filter-select:hover {
          border-color: #667eea;
        }

        .filter-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .btn-clear {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 14px;
          background: #fee;
          color: #c33;
          border: 2px solid #fcc;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          transition: all 0.3s;
        }

        .btn-clear:hover {
          background: #fdd;
        }

        /* Loading State */
        .loading-message {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e0e0e0;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Error Banner */
        .error-banner {
          background: #fee;
          border: 2px solid #fcc;
          border-radius: 10px;
          padding: 16px;
          margin-bottom: 24px;
          color: #c33;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* Alumni Count */
        .alumni-count {
          color: #666;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .alumni-count strong {
          color: #667eea;
          font-weight: 700;
        }

        /* Alumni Grid */
        .alumni-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .alumni-card {
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.4s ease;
          cursor: pointer;
        }

        .alumni-card:hover {
          border-color: #667eea;
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.15);
          transform: translateY(-8px);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
        }

        .card-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
        }

        .card-name-section h3 {
          font-size: 16px;
          font-weight: 700;
          color: #1e3c72;
          margin-bottom: 4px;
        }

        .card-email {
          font-size: 12px;
          color: #999;
        }

        .card-body {
          padding: 20px;
        }

        .card-info-group {
          margin-bottom: 16px;
        }

        .info-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .info-value {
          font-size: 13px;
          color: #333;
          font-weight: 500;
        }

        .company-name {
          display: block;
          font-weight: 700;
          color: #667eea;
        }

        .card-location {
          font-size: 12px;
          color: #666;
          padding: 8px 12px;
          background: #f8f9fa;
          border-radius: 6px;
          display: inline-block;
        }

        .card-footer {
          display: flex;
          gap: 10px;
          padding: 16px 20px;
          border-top: 1px solid #e0e0e0;
          background: #f8f9fa;
        }

        .btn-action {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.3s;
          text-decoration: none;
        }

        .btn-linkedin {
          background: #0077b5;
          color: white;
        }

        .btn-linkedin:hover {
          background: #005885;
        }

        .btn-email {
          background: #667eea;
          color: white;
        }

        .btn-email:hover {
          background: #764ba2;
        }

        /* No Results */
        .no-results {
          text-align: center;
          padding: 60px 20px;
          color: #666;
          font-size: 15px;
        }

        @media (max-width: 768px) {
          .welcome-content {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
          }

          .directory-inner {
            padding: 20px;
          }

          .alumni-grid {
            grid-template-columns: 1fr;
          }

          .filter-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-select {
            width: 100%;
          }
        }
      `}</style>

      <div className="alumni-directory-wrapper">
        {/* Welcome Header */}
        {user && (
          <motion.div
            className="welcome-banner"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="welcome-content">
              <div className="welcome-text">
                <h2>Welcome back, <span>{user.firstName}! 👋</span></h2>
                <p>Connect with fellow alumni from around the world</p>
              </div>
              <motion.button
                onClick={handleLogout}
                className="btn-logout"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut size={16} />
                Logout
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Directory Section */}
        <motion.div
          className="directory-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="directory-inner">
            {/* Header */}
            <motion.div
              className="directory-header"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <h1 className="directory-title">Alumni Directory</h1>
              <p className="directory-subtitle">
                Find and connect with accomplished alumni from around the world
              </p>
            </motion.div>

            {/* Filters */}
            <motion.div
              className="filters-card"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {/* Search */}
              <div className="search-wrapper">
                <Search className="search-icon" size={18} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search alumni"
                />
              </div>

              {/* Filter Controls */}
              <div className="filter-controls">
                <Filter size={16} style={{ color: "#a0aec0" }} />
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Departments</option>
                  {alumniData.departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>

                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Graduation Years</option>
                  {alumniData.years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                {(searchTerm || filterDepartment || filterYear) && (
                  <motion.button
                    className="btn-clear"
                    onClick={handleClearFilters}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={14} />
                    Clear Filters
                  </motion.button>
                )}
              </div>
            </motion.div>

            {/* Loading State */}
            {loading && (
              <div className="loading-message">
                <div className="spinner"></div>
                <p>🔍 Loading alumni directory...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <motion.div
                className="error-banner"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span>⚠️</span>
                {error}
              </motion.div>
            )}

            {/* Alumni Count */}
            {!loading && !error && (
              <motion.div
                className="alumni-count"
                initial="hidden"
                animate="visible"
                variants={itemVariants}
              >
                Showing <strong>{filteredAlumni.length}</strong> of{" "}
                <strong>{alumniData.alumni.length}</strong> alumni
                {searchTerm && ` matching "${searchTerm}"`}
              </motion.div>
            )}

            {/* Alumni Grid */}
            {!loading && !error && filteredAlumni.length > 0 && (
              <motion.div
                className="alumni-grid"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                {filteredAlumni.map((alumnus) => (
                  <motion.div
                    key={alumnus._id}
                    className="alumni-card"
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                  >
                    <div className="card-header">
                      <div className="card-avatar">
                        {alumnus.firstName?.charAt(0)}
                        {alumnus.lastName?.charAt(0)}
                      </div>
                      <div className="card-name-section">
                        <h3>
                          {alumnus.firstName} {alumnus.lastName}
                        </h3>
                        <p className="card-email">{alumnus.email}</p>
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="card-info-group">
                        <span className="info-label">Department & Year</span>
                        <span className="info-value">
                          {alumnus.department} • {alumnus.graduationYear}
                        </span>
                      </div>

                      {alumnus.currentCompany && (
                        <div className="card-info-group">
                          <span className="info-label">Professional</span>
                          <span className="info-value">
                            <span className="company-name">
                              {alumnus.jobTitle || "Professional"}
                            </span>
                            {alumnus.currentCompany}
                          </span>
                        </div>
                      )}

                      {alumnus.city && (
                        <div className="card-location">
                          📍 {alumnus.city}, {alumnus.country}
                        </div>
                      )}
                    </div>

                    <div className="card-footer">
                      {alumnus.linkedin && (
                        <a
                          href={alumnus.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-action btn-linkedin"
                        >
                          <Linkedin size={14} />
                          LinkedIn
                        </a>
                      )}
                      <a
                        href={`mailto:${alumnus.email}`}
                        className="btn-action btn-email"
                      >
                        <Mail size={14} />
                        Email
                      </a>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* No Results */}
            {!loading && !error && filteredAlumni.length === 0 && (
              <motion.div
                className="no-results"
                initial="hidden"
                animate="visible"
                variants={itemVariants}
              >
                <p>No alumni found matching your criteria. Try adjusting your filters!</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AlumniDirectory;