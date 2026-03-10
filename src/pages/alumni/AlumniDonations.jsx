// src/pages/alumni/AlumniDonations.jsx
// ✅ ALUMNI DONATIONS PAGE
// Make donations & view history

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Heart, LogOut, ChevronLeft, Check, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { donationAPI } from "../../services/api";

const AlumniDonations = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [donationAmount, setDonationAmount] = useState("");
  const [purpose, setPurpose] = useState("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [donations, setDonations] = useState([]);
  const [loadingDonations, setLoadingDonations] = useState(true);

  const donationPurposes = [
    { id: "general", label: "General Fund", description: "Support PSG overall" },
    { id: "scholarship", label: "Scholarship", description: "Student scholarships" },
    { id: "infrastructure", label: "Infrastructure", description: "Building improvements" },
    { id: "research", label: "Research", description: "Research initiatives" },
  ];

  const donationTiers = [
    { amount: 1000, label: "Friend", emoji: "💚" },
    { amount: 5000, label: "Supporter", emoji: "💙" },
    { amount: 10000, label: "Patron", emoji: "💜" },
    { amount: 50000, label: "Benefactor", emoji: "🌟" },
  ];

  useEffect(() => {
    loadDonationHistory();
  }, []);

  const loadDonationHistory = async () => {
    try {
      const response = await donationAPI.getMyDonations();
      setDonations(response.data?.data || []);
    } catch (err) {
      console.error("Failed to load donations:", err);
    } finally {
      setLoadingDonations(false);
    }
  };

  const handleDonation = async (e) => {
    e.preventDefault();
    
    if (!donationAmount || Number(donationAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await donationAPI.createDonation({
        amount: Number(donationAmount),
        purpose,
        anonymousDonation: false,
      });

      if (response.data) {
        setSuccess(true);
        setDonationAmount("");
        setPurpose("general");
        
        // Reload donations
        setTimeout(() => {
          loadDonationHistory();
          setSuccess(false);
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Donation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const totalDonated = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <>
      <style>{`
        .alumni-donations-wrapper {
          min-height: 100vh;
          background: #f5f7fa;
          font-family: 'Poppins', 'Inter', sans-serif;
        }

        .donations-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 25px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
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

        .header-title {
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

        .donations-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 30px;
        }

        /* Form Section */
        .donation-form-section {
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        }

        .section-title {
          font-size: 22px;
          font-weight: 700;
          color: #1e3c72;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .amount-input {
          width: 100%;
          padding: 14px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 15px;
          font-family: inherit;
          transition: all 0.3s;
        }

        .amount-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        /* Donation Tiers */
        .donation-tiers {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .tier-btn {
          padding: 16px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          background: white;
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
          font-weight: 600;
          font-size: 13px;
        }

        .tier-btn:hover {
          border-color: #667eea;
          background: #f8f9fa;
        }

        .tier-btn.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-color: #667eea;
        }

        .tier-emoji {
          font-size: 20px;
          display: block;
          margin-bottom: 6px;
        }

        /* Purpose Select */
        .purpose-select {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .purpose-option {
          padding: 14px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
        }

        .purpose-option:hover {
          border-color: #667eea;
        }

        .purpose-option.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .purpose-label {
          font-weight: 600;
          font-size: 13px;
          margin-bottom: 4px;
        }

        .purpose-desc {
          font-size: 11px;
          opacity: 0.8;
        }

        /* Error/Success Messages */
        .alert {
          padding: 14px;
          border-radius: 10px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
        }

        .alert-error {
          background: #fee;
          border: 2px solid #fcc;
          color: #c33;
        }

        .alert-success {
          background: #efe;
          border: 2px solid #cfc;
          color: #3c3;
        }

        /* Submit Button */
        .donate-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .donate-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.3);
        }

        .donate-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Sidebar - Stats */
        .donation-stats {
          background: white;
          border-radius: 16px;
          padding: 25px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
          height: fit-content;
          position: sticky;
          top: 20px;
        }

        .stat-box {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #e0e0e0;
        }

        .stat-box:last-child {
          border-bottom: none;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 800;
          color: #667eea;
          margin-bottom: 6px;
        }

        .stat-label {
          font-size: 12px;
          color: #999;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        /* Donation History */
        .history-section {
          margin-top: 40px;
          padding-top: 30px;
          border-top: 2px solid #e0e0e0;
        }

        .history-title {
          font-size: 18px;
          font-weight: 700;
          color: #1e3c72;
          margin-bottom: 20px;
        }

        .donation-item {
          padding: 16px;
          background: #f8f9fa;
          border-radius: 10px;
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .donation-info {
          flex: 1;
        }

        .donation-purpose {
          font-weight: 600;
          color: #1e3c72;
          margin-bottom: 4px;
        }

        .donation-date {
          font-size: 12px;
          color: #999;
        }

        .donation-sum {
          text-align: right;
        }

        .donation-amount {
          font-size: 16px;
          font-weight: 700;
          color: #667eea;
        }

        .empty-history {
          text-align: center;
          padding: 30px 20px;
          color: #999;
          font-size: 14px;
        }

        @media (max-width: 1024px) {
          .donations-container {
            grid-template-columns: 1fr;
          }

          .donation-stats {
            position: static;
          }

          .donation-tiers {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 768px) {
          .donations-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }

          .donation-tiers {
            grid-template-columns: repeat(2, 1fr);
          }

          .purpose-select {
            grid-template-columns: 1fr;
          }

          .donation-form-section {
            padding: 20px;
          }
        }
      `}</style>

      <div className="alumni-donations-wrapper">
        {/* Header */}
        <div className="donations-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate("/alumni-dashboard")}>
              <ChevronLeft size={16} />
              Back
            </button>
            <div className="header-title">❤️ Support PSG</div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Content */}
        <div className="donations-container">
          {/* Form Section */}
          <div className="donation-form-section">
            <div className="section-title">
              <Heart size={24} />
              Make a Donation
            </div>

            {error && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                <Check size={18} />
                Thank you for your generous donation!
              </div>
            )}

            <form onSubmit={handleDonation}>
              {/* Amount Input */}
              <div className="form-group">
                <label className="form-label">💰 Donation Amount</label>
                <input
                  type="number"
                  className="amount-input"
                  placeholder="Enter amount in ₹"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {/* Donation Tiers */}
              <div className="form-group">
                <label className="form-label">Quick Select</label>
                <div className="donation-tiers">
                  {donationTiers.map((tier) => (
                    <button
                      key={tier.amount}
                      type="button"
                      className={`tier-btn ${donationAmount === String(tier.amount) ? "active" : ""}`}
                      onClick={() => setDonationAmount(String(tier.amount))}
                      disabled={loading}
                    >
                      <span className="tier-emoji">{tier.emoji}</span>
                      ₹{tier.amount.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Purpose */}
              <div className="form-group">
                <label className="form-label">🎯 Donation Purpose</label>
                <div className="purpose-select">
                  {donationPurposes.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`purpose-option ${purpose === p.id ? "active" : ""}`}
                      onClick={() => setPurpose(p.id)}
                      disabled={loading}
                    >
                      <div className="purpose-label">{p.label}</div>
                      <div className="purpose-desc">{p.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="donate-btn" disabled={loading || !donationAmount}>
                <Heart size={18} />
                {loading ? "Processing..." : "Donate Now"}
              </button>
            </form>

            {/* Donation History */}
            {donations.length > 0 && (
              <div className="history-section">
                <div className="history-title">📋 Your Donations</div>
                {donations.map((donation, idx) => (
                  <motion.div
                    key={idx}
                    className="donation-item"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="donation-info">
                      <div className="donation-purpose">
                        {donationPurposes.find(p => p.id === donation.purpose)?.label || "Donation"}
                      </div>
                      <div className="donation-date">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="donation-sum">
                      <div className="donation-amount">₹{donation.amount.toLocaleString()}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {donations.length === 0 && !loadingDonations && (
              <div className="history-section">
                <div className="history-title">📋 Your Donations</div>
                <div className="empty-history">
                  No donations yet. Make your first donation above!
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Stats */}
          <div className="donation-stats">
            <div className="stat-box">
              <div className="stat-value">{donations.length}</div>
              <div className="stat-label">Total Donations</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">₹{totalDonated.toLocaleString()}</div>
              <div className="stat-label">Total Amount</div>
            </div>
            <div className="stat-box">
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🙏</div>
              <div className="stat-label">Thank You!</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlumniDonations;