// src/pages/alumni/AlumniProfile.jsx - BEAUTIFUL PROFESSIONAL DESIGN
// ✅ Premium UI/UX
// ✅ Smooth animations
// ✅ Refined typography & colors
// ✅ Professional layout

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import "./AlumniProfile.css";

const AlumniProfile = () => {
  const navigate = useNavigate();
  const { user, token, logout, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [success, setSuccess] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ✅ Load profile from database
  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (authLoading) return;
        if (!token) {
          navigate("/alumni/login", { replace: true });
          return;
        }

        setLoading(true);
        setError(null);

        const response = await axios.get(`${API_BASE}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        });

        const profileData = response.data.alumni || response.data.user || response.data;
        if (!profileData) throw new Error("No profile data in response");

        setProfile(profileData);
        setEditData(profileData);
      } catch (err) {
        console.error("❌ Profile load error:", err);

        if (err.response?.status === 401) {
          setError("Your session has expired. Please login again.");
          setTimeout(() => {
            logout();
            navigate("/alumni/login", { replace: true });
          }, 2000);
        } else if (err.response?.status === 404) {
          setError("Profile not found. Please complete your registration.");
        } else {
          const errorMsg = err.response?.data?.message || err.message || "Failed to load profile";
          setError(errorMsg);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token, authLoading, navigate, logout, API_BASE]);

  // ✅ Update profile in database
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await axios.put(
        `${API_BASE}/api/auth/profile`,
        editData,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        }
      );

      const updatedProfile = response.data.alumni || response.data.user || response.data;
      setProfile(updatedProfile);
      setEditData(updatedProfile);
      setEditMode(false);
      setSuccess("✅ Profile updated successfully!");

      localStorage.setItem("user", JSON.stringify(updatedProfile));

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("❌ Profile update error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to update profile";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle logout
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // ✅ Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Loading auth
  if (authLoading) {
    return (
      <div className="alumni-profile-wrapper">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!token) {
    return (
      <div className="alumni-profile-wrapper">
        <div className="auth-error-container">
          <h2>Please log in to view your profile</h2>
          <button 
            onClick={() => navigate("/alumni/login")}
            className="btn btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Loading profile
  if (loading) {
    return (
      <div className="alumni-profile-wrapper">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Error and no profile
  if (error && !profile) {
    return (
      <div className="alumni-profile-wrapper">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Profile</h3>
          <p>{error}</p>
          <div className="error-actions">
            <button 
              onClick={() => window.location.reload()}
              className="btn btn-secondary"
            >
              Reload
            </button>
            <button 
              onClick={handleLogout}
              className="btn btn-danger"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No profile data
  if (!profile) {
    return (
      <div className="alumni-profile-wrapper">
        <div className="empty-state">
          <h2>No profile data found</h2>
          <p>Please complete your registration</p>
          <button 
            onClick={() => navigate("/alumni/register")}
            className="btn btn-primary"
          >
            Complete Registration
          </button>
        </div>
      </div>
    );
  }

  // Profile loaded
  return (
    <div className="alumni-profile-wrapper">
      <div className="profile-container">
        
        {/* Header Section */}
        <div className="profile-header">
          <div className="header-content">
            <div className="profile-avatar">
              {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
            </div>
            <div className="header-text">
              <h1>{profile.firstName} {profile.lastName}</h1>
              <p className="email">{profile.email}</p>
              <div className="status-badge" data-status={profile.isApproved ? "approved" : "pending"}>
                {profile.isApproved ? "✓ Verified Alumni" : "⏳ Pending Approval"}
              </div>
            </div>
          </div>

          {!editMode && (
            <div className="header-actions">
              <button
                onClick={() => setEditMode(true)}
                className="btn btn-primary"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-outline"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Messages */}
        {error && (
          <div className="message error-message animate-slideDown">
            <span className="icon">✕</span>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="message success-message animate-slideDown">
            <span className="icon">✓</span>
            <p>{success}</p>
          </div>
        )}

        {!editMode ? (
          // VIEW MODE
          <div className="profile-content">
            {/* Personal Information */}
            <section className="profile-section">
              <h2 className="section-title">Personal Information</h2>
              <div className="info-grid info-grid-2">
                <div className="info-field">
                  <label>First Name</label>
                  <p>{profile.firstName}</p>
                </div>
                <div className="info-field">
                  <label>Last Name</label>
                  <p>{profile.lastName}</p>
                </div>
              </div>

              <div className="info-grid info-grid-2">
                <div className="info-field">
                  <label>Phone</label>
                  <p>{profile.phone || "—"}</p>
                </div>
                <div className="info-field">
                  <label>Country</label>
                  <p>{profile.country || "—"}</p>
                </div>
              </div>

              <div className="info-grid info-grid-2">
                <div className="info-field">
                  <label>City</label>
                  <p>{profile.city || "—"}</p>
                </div>
                <div className="info-field">
                  <label>Email</label>
                  <p>{profile.email}</p>
                </div>
              </div>
            </section>

            {/* Professional Information */}
            <section className="profile-section">
              <h2 className="section-title">Professional Information</h2>
              <div className="info-grid info-grid-2">
                <div className="info-field">
                  <label>Department</label>
                  <p>{profile.department || "—"}</p>
                </div>
                <div className="info-field">
                  <label>Graduation Year</label>
                  <p>{profile.graduationYear || "—"}</p>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-field">
                  <label>Company</label>
                  <p>{profile.company || "—"}</p>
                </div>
              </div>
            </section>
          </div>
        ) : (
          // EDIT MODE
          <form onSubmit={handleUpdateProfile} className="profile-form">
            {/* Personal Information */}
            <section className="form-section">
              <h2 className="section-title">Personal Information</h2>
              
              <div className="form-grid form-grid-2">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={editData.firstName || ""}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={editData.lastName || ""}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid form-grid-2">
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={editData.phone || ""}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email (Read-only)</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editData.email || ""}
                    disabled
                    className="form-input form-input-disabled"
                  />
                </div>
              </div>

              <div className="form-grid form-grid-2">
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={editData.country || ""}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={editData.city || ""}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>
            </section>

            {/* Professional Information */}
            <section className="form-section">
              <h2 className="section-title">Professional Information</h2>
              
              <div className="form-grid form-grid-2">
                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={editData.department || ""}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="graduationYear">Graduation Year</label>
                  <input
                    type="number"
                    id="graduationYear"
                    name="graduationYear"
                    value={editData.graduationYear || ""}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="company">Company</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={editData.company || ""}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>
            </section>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-large"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setEditData(profile);
                }}
                className="btn btn-outline btn-large"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AlumniProfile;