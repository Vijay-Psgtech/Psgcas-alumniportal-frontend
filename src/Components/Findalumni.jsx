import React, { useState } from "react";
import { Search, Users, Zap, MapPin, Share2, ChevronRight } from "lucide-react";

const FindAlumni = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filters = [
    { id: "all", label: "All Alumni", icon: Users },
    { id: "nearby", label: "Near You", icon: MapPin },
    { id: "interests", label: "Your Interests", icon: Zap },
  ];

  const features = [
    {
      id: 1,
      title: "Connect with Batch Mates",
      description: "Find and reconnect with your classmates from PSG Arts",
      icon: "👥",
    },
    {
      id: 2,
      title: "Alumni Near You",
      description: "Discover alumni living in your city or area",
      icon: "📍",
    },
    {
      id: 3,
      title: "Shared Interests",
      description: "Find alumni with similar professional goals and hobbies",
      icon: "⚡",
    },
  ];

  return (
    <>
      <style>{`
        .find-alumni-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 40px 20px;
        }

        .find-alumni-main {
          width: 100%;
          max-width: 900px;
        }

        /* Header Section */
        .find-alumni-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .find-alumni-header-title {
          font-size: 32px;
          font-weight: 800;
          color: #1e3c72;
          margin-bottom: 12px;
          letter-spacing: -1px;
          font-family: 'Poppins', sans-serif;
        }

        .find-alumni-header-subtitle {
          font-size: 16px;
          color: #666;
          font-weight: 400;
          font-family: 'Inter', sans-serif;
        }

        /* Search Bar */
        .search-container {
          position: relative;
          margin-bottom: 32px;
          animation: slideInSearch 0.6s ease-out 0.1s backwards;
        }

        @keyframes slideInSearch {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: white;
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .search-wrapper:focus-within {
          border-color: #2a5298;
          box-shadow: 0 12px 40px rgba(42, 82, 152, 0.15);
        }

        .search-icon {
          position: absolute;
          left: 16px;
          color: #999;
          pointer-events: none;
        }

        .search-input {
          flex: 1;
          padding: 16px 16px 16px 48px;
          border: none;
          outline: none;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          background: transparent;
        }

        .search-input::placeholder {
          color: #aaa;
        }

        /* Filter Tabs */
        .filter-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 40px;
          animation: slideInSearch 0.6s ease-out 0.2s backwards;
          flex-wrap: wrap;
        }

        .filter-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          color: #666;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
          position: relative;
        }

        .filter-tab:hover {
          border-color: #2a5298;
          color: #2a5298;
        }

        .filter-tab.active {
          background: linear-gradient(135deg, #2a5298, #3d6fcc);
          color: white;
          border-color: #2a5298;
          box-shadow: 0 8px 20px rgba(42, 82, 152, 0.2);
        }

        .filter-tab svg {
          width: 16px;
          height: 16px;
        }

        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          animation: slideInSearch 0.6s ease-out 0.3s backwards;
        }

        .feature-card {
          background: white;
          border-radius: 16px;
          padding: 32px 28px;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #2a5298, #7e57c2);
          transition: left 0.4s ease;
        }

        .feature-card:hover::before {
          left: 0;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 16px 40px rgba(42, 82, 152, 0.12);
          border-color: rgba(42, 82, 152, 0.1);
        }

        .feature-icon {
          font-size: 48px;
          margin-bottom: 16px;
          display: inline-block;
          animation: bounce 2s ease-in-out infinite;
        }

        .feature-card:nth-child(2) .feature-icon {
          animation-delay: 0.2s;
        }

        .feature-card:nth-child(3) .feature-icon {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .feature-title {
          font-size: 18px;
          font-weight: 700;
          color: #1e3c72;
          margin-bottom: 10px;
          font-family: 'Poppins', sans-serif;
        }

        .feature-description {
          font-size: 14px;
          color: #777;
          line-height: 1.6;
          font-family: 'Inter', sans-serif;
        }

        /* CTA Button */
        .cta-section {
          text-align: center;
          margin-top: 48px;
          animation: slideInSearch 0.6s ease-out 0.4s backwards;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 40px;
          background: linear-gradient(135deg, #2a5298, #3d6fcc);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Poppins', sans-serif;
          box-shadow: 0 10px 30px rgba(42, 82, 152, 0.2);
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(42, 82, 152, 0.3);
        }

        .cta-button:active {
          transform: translateY(-1px);
        }

        .cta-button svg {
          width: 18px;
          height: 18px;
        }

        /* Stats Counter */
        .stats-highlight {
          background: linear-gradient(135deg, rgba(42, 82, 152, 0.05), rgba(126, 87, 194, 0.05));
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 32px;
          display: flex;
          justify-content: space-around;
          text-align: center;
          animation: slideInSearch 0.6s ease-out 0.15s backwards;
        }

        .stat-item {
          flex: 1;
        }

        .stat-number {
          font-size: 28px;
          font-weight: 800;
          color: #2a5298;
          font-family: 'Poppins', sans-serif;
        }

        .stat-label {
          font-size: 12px;
          color: #666;
          font-weight: 600;
          margin-top: 4px;
          font-family: 'Inter', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @media(max-width: 768px) {
          .find-alumni-header-title {
            font-size: 24px;
          }

          .find-alumni-header-subtitle {
            font-size: 14px;
          }

          .filter-tabs {
            gap: 8px;
          }

          .filter-tab {
            padding: 8px 16px;
            font-size: 12px;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .feature-card {
            padding: 24px 20px;
          }

          .stats-highlight {
            flex-direction: column;
            gap: 16px;
          }

          .cta-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="find-alumni-wrapper">
        <div className="find-alumni-main">
          {/* Header */}
          <div className="find-alumni-header">
            <div className="find-alumni-header-title">🔍 Find Fellow CASians</div>
            <div className="find-alumni-header-subtitle">
              Discover and connect with the PSG Alumni Network
            </div>
          </div>

          {/* Stats Highlight */}
          {/* <div className="stats-highlight">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Active Alumni</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Cities Connected</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5K+</div>
              <div className="stat-label">Monthly Events</div>
            </div>
          </div> */}

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search alumni by name, batch, or profession..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            {filters.map((filter) => {
              const IconComponent = filter.icon;
              return (
                <button
                  key={filter.id}
                  className={`filter-tab ${selectedFilter === filter.id ? 'active' : ''}`}
                  onClick={() => setSelectedFilter(filter.id)}
                >
                  <IconComponent size={16} />
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* Features Grid */}
          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-title">{feature.title}</div>
                <div className="feature-description">{feature.description}</div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="cta-section">
            <button className="cta-button">
              <Share2 size={18} />
              Start Connecting Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FindAlumni;