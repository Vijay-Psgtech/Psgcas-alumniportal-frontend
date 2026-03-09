// src/pages/alumni/AlumniMap.jsx
// ✅ ALUMNI LOCATION MAP
// Shows alumni grouped by country/city

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, Building2, LogOut, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { alumniAPI } from "../../Services/api";

const AlumniMap = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mapData, setMapData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    try {
      setLoading(true);
      const response = await alumniAPI.getMapData();
      const alumni = response.data.data?.alumni || [];
      
      // Group by country
      const grouped = {};
      alumni.forEach((person) => {
        const country = person.country || "Unknown";
        if (!grouped[country]) {
          grouped[country] = [];
        }
        grouped[country].push(person);
      });

      setMapData(grouped);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load map data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const countries = Object.keys(mapData).sort();
  const selectedAlumni = selectedCountry ? mapData[selectedCountry] : [];

  return (
    <>
      <style>{`
        .alumni-map-wrapper {
          min-height: 100vh;
          background: #f5f7fa;
          font-family: 'Poppins', 'Inter', sans-serif;
        }

        .map-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 25px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .map-header-left {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .back-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 8px 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          transition: all 0.3s;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .map-header-title {
          font-size: 24px;
          font-weight: 700;
        }

        .logout-btn {
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

        .logout-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .map-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 20px;
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 30px;
        }

        .map-sidebar {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
          height: fit-content;
          position: sticky;
          top: 20px;
        }

        .sidebar-title {
          font-size: 18px;
          font-weight: 700;
          color: #1e3c72;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .country-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 500px;
          overflow-y: auto;
        }

        .country-item {
          padding: 12px 14px;
          background: #f8f9fa;
          border: 2px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          font-size: 13px;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .country-item:hover {
          background: #f0f1f5;
          border-color: #667eea;
          color: #667eea;
        }

        .country-item.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-color: #667eea;
        }

        .country-count {
          font-size: 12px;
          opacity: 0.7;
          margin-left: auto;
          background: rgba(102, 126, 234, 0.15);
          padding: 2px 8px;
          border-radius: 12px;
          font-weight: 600;
        }

        .country-item.active .country-count {
          background: rgba(255, 255, 255, 0.3);
        }

        .map-content {
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
          min-height: 600px;
        }

        .content-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e0e0e0;
        }

        .content-title {
          font-size: 22px;
          font-weight: 700;
          color: #1e3c72;
        }

        .content-badge {
          background: #667eea;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .alumni-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .alumni-item {
          padding: 18px;
          background: #f8f9fa;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          transition: all 0.3s;
        }

        .alumni-item:hover {
          border-color: #667eea;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.12);
          transform: translateY(-4px);
        }

        .alumni-name {
          font-weight: 700;
          color: #1e3c72;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .alumni-info {
          font-size: 12px;
          color: #666;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }

        .alumni-info svg {
          width: 14px;
          height: 14px;
          color: #667eea;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #999;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 400px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e0e0e0;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .map-container {
            grid-template-columns: 1fr;
          }

          .map-sidebar {
            position: static;
          }

          .country-list {
            flex-direction: row;
            overflow-x: auto;
            max-height: auto;
          }

          .country-item {
            white-space: nowrap;
            flex-shrink: 0;
          }
        }

        @media (max-width: 768px) {
          .map-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }

          .map-container {
            padding: 20px;
            gap: 20px;
          }

          .alumni-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="alumni-map-wrapper">
        {/* Header */}
        <div className="map-header">
          <div className="map-header-left">
            <button className="back-btn" onClick={() => navigate("/alumni-dashboard")}>
              <ChevronLeft size={16} />
              Back
            </button>
            <div className="map-header-title">📍 Alumni Around the World</div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Content */}
        <div className="map-container">
          {/* Sidebar - Country List */}
          <div className="map-sidebar">
            <div className="sidebar-title">
              <MapPin size={20} />
              Countries
            </div>
            <div className="country-list">
              {countries.map((country) => (
                <motion.div
                  key={country}
                  className={`country-item ${selectedCountry === country ? "active" : ""}`}
                  onClick={() => setSelectedCountry(country)}
                  whileHover={{ x: 4 }}
                >
                  <span>{country}</span>
                  <span className="country-count">{mapData[country].length}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="map-content">
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : error ? (
              <div className="empty-state">
                <div className="empty-icon">⚠️</div>
                <p>{error}</p>
              </div>
            ) : selectedCountry ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="content-header">
                  <MapPin size={24} />
                  <span className="content-title">{selectedCountry}</span>
                  <span className="content-badge">
                    {selectedAlumni.length} Alumni
                  </span>
                </div>

                <div className="alumni-list">
                  {selectedAlumni.map((alumni, idx) => (
                    <motion.div
                      key={idx}
                      className="alumni-item"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className="alumni-name">
                        {alumni.firstName} {alumni.lastName}
                      </div>
                      {alumni.city && (
                        <div className="alumni-info">
                          <MapPin size={14} />
                          {alumni.city}
                        </div>
                      )}
                      {alumni.currentCompany && (
                        <div className="alumni-info">
                          <Building2 size={14} />
                          {alumni.currentCompany}
                        </div>
                      )}
                      {alumni.jobTitle && (
                        <div className="alumni-info">
                          <Users size={14} />
                          {alumni.jobTitle}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🌍</div>
                <p>Select a country to view alumni</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AlumniMap;