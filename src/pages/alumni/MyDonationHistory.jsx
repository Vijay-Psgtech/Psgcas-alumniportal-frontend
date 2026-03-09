// src/pages/alumni/MyDonationHistory.jsx
// Protected route — approved alumni only.
// Alumni can view ONLY their own donation history.
// Admin can view all donations from the AdminDashboard.

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { donationAPI } from "../../Services/api";
import "./alumni.css";

const MyDonationHistory = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ total: 0, count: 0 });

  // ── Get current alumni user from localStorage ──
  const alumniUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("alumniUser"));
    } catch {
      return null;
    }
  })();

  // ── Load donations from real API ──
  useEffect(() => {
    const loadDonations = async () => {
      try {
        setLoading(true);

        // ✅ Real API call — backend filters by JWT token's userId
        const res = await donationAPI.getMyDonations();
        const data = res.data.donations || [];

        // Calculate stats from real data
        const completed = data.filter((d) => d.status === "completed");
        const totalINR = completed
          .filter((d) => d.currency === "INR")
          .reduce((sum, d) => sum + d.amount, 0);

        setDonations(data);
        setStats({ total: totalINR, count: data.length });
      } catch (err) {
        console.error("Error loading donations:", err);
        if (err.response?.status === 401) {
          navigate("/alumni/login");
        } else {
          setError(
            err.response?.data?.message || "Failed to load donation history"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadDonations();
  }, [navigate]);

  // ── Status badge renderer ──
  const getStatusBadge = (status) => {
    const config = {
      completed: { background: "#dcfce7", color: "#166534", label: "✓ Completed" },
      pending:   { background: "#fef9c3", color: "#854d0e", label: "⏳ Pending"   },
      failed:    { background: "#fee2e2", color: "#991b1b", label: "✕ Failed"    },
      refunded:  { background: "#e0f2fe", color: "#075985", label: "↩ Refunded"  },
    };
    const s = config[status] || config.pending;
    return (
      <span
        style={{
          background: s.background,
          color: s.color,
          padding: "3px 10px",
          borderRadius: "12px",
          fontSize: "0.78rem",
          fontWeight: 600,
        }}
      >
        {s.label}
      </span>
    );
  };

  const formatCurrency = (amount, currency) =>
    currency === "INR"
      ? `₹${amount.toLocaleString("en-IN")}`
      : `$${amount.toLocaleString("en-US")}`;

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  // ── Loading state ──
  if (loading) {
    return (
      <div className="alumni-container">
        <p>Loading your donation history...</p>
      </div>
    );
  }

  // ── Main render ──
  return (
    <div className="alumni-container">

      {/* Header */}
      <div className="directory-header">
        <h1>My Donation History</h1>
        <p className="subtitle">
          Welcome, <strong>{alumniUser?.firstName}</strong> — thank you for
          supporting PSG Tech!
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Summary Cards */}
      <div style={gridThree}>
        <div className="stat-card" style={cardStyle("#eff6ff", "#1d4ed8")}>
          <div style={{ fontSize: "1.8rem", fontWeight: 700 }}>{stats.count}</div>
          <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>Total Donations</div>
        </div>
        <div className="stat-card" style={cardStyle("#f0fdf4", "#15803d")}>
          <div style={{ fontSize: "1.8rem", fontWeight: 700 }}>
            ₹{stats.total.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>
            Total Contributed (INR)
          </div>
        </div>
        <div className="stat-card" style={cardStyle("#fdf4ff", "#7e22ce")}>
          <div style={{ fontSize: "1.8rem", fontWeight: 700 }}>
            {donations.filter((d) => d.status === "completed").length}
          </div>
          <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>
            Successful Payments
          </div>
        </div>
      </div>

      {/* Donate Again CTA */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <Link to="/donate">
          <button className="btn-submit" style={{ maxWidth: "200px" }}>
            + Donate Again
          </button>
        </Link>
      </div>

      {/* Donations Table */}
      {donations.length === 0 ? (
        <div className="no-results">
          <p>You haven't made any donations yet.</p>
          <Link to="/donate">
            <button className="btn-submit" style={{ marginTop: "16px" }}>
              Make Your First Donation
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Method</th>
                <th style={thStyle}>Transaction ID</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Message</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation, idx) => (
                <tr
                  key={donation._id}
                  style={{
                    background: idx % 2 === 0 ? "#fff" : "#f8fafc",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <td style={tdStyle}>{formatDate(donation.donatedAt)}</td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>
                    {formatCurrency(donation.amount, donation.currency)}
                  </td>
                  <td style={tdStyle}>{donation.paymentMethod}</td>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "0.8rem" }}>
                    {donation.transactionId || "—"}
                  </td>
                  <td style={tdStyle}>{getStatusBadge(donation.status)}</td>
                  <td
                    style={{
                      ...tdStyle,
                      color: "#64748b",
                      fontStyle: donation.message ? "normal" : "italic",
                    }}
                  >
                    {donation.message || "No message"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Privacy Note */}
      <p style={{ marginTop: "24px", fontSize: "0.8rem", color: "#94a3b8", textAlign: "center" }}>
        🔒 Only you can see your donation history. Admins can view all donations
        from the Admin Dashboard.
      </p>
    </div>
  );
};

// ── Styles ──────────────────────────────────────────────────────────────────

const gridThree = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "16px",
  marginBottom: "32px",
};

const cardStyle = (bg, color) => ({
  background: bg,
  border: `1px solid ${color}22`,
  borderRadius: "12px",
  padding: "20px",
  textAlign: "center",
  color,
});

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
};

const thStyle = {
  padding: "12px 16px",
  textAlign: "left",
  fontSize: "0.8rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "#475569",
  borderBottom: "2px solid #e2e8f0",
};

const tdStyle = {
  padding: "14px 16px",
  fontSize: "0.9rem",
  color: "#1e293b",
};

export default MyDonationHistory;