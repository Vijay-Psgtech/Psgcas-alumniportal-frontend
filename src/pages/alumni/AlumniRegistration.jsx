// src/pages/auth/AlumniRegister.jsx
// ✅ ALUMNI REGISTRATION PAGE
// Complete form with validation and backend

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AlumniRegister = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    graduationYear: "",
    currentCompany: "",
    jobTitle: "",
    city: "",
    country: "",
    linkedin: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const departments = [
    "Computer Science",
    "Electronics Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Electrical Engineering",
    "Architecture",
    "Management",
    "Other",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError("First name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!formData.department) {
      setError("Please select a department");
      return false;
    }
    if (!formData.graduationYear) {
      setError("Please select graduation year");
      return false;
    }
    if (!formData.city) {
      setError("City is required");
      return false;
    }
    if (!formData.country) {
      setError("Country is required");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const result = await register(formData);

    if (result.success) {
      navigate("/alumni-dashboard");
    } else {
      setError(result.error || "Registration failed");
    }
    setIsLoading(false);
  };

  return (
    <>
      <style>{`
        .alumni-register-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
          font-family: 'Poppins', 'Inter', sans-serif;
        }

        .register-container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .register-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 35px 30px;
          text-align: center;
        }

        .register-title {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .register-subtitle {
          font-size: 14px;
          opacity: 0.9;
        }

        .register-body {
          padding: 40px 30px;
          max-height: 70vh;
          overflow-y: auto;
        }

        .register-body::-webkit-scrollbar {
          width: 6px;
        }

        .register-body::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .register-body::-webkit-scrollbar-thumb {
          background: #667eea;
          border-radius: 10px;
        }

        /* Error Banner */
        .error-banner {
          background: #fee;
          border: 2px solid #fcc;
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #c33;
          font-size: 14px;
          animation: shake 0.5s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        /* Form Grid */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .form-grid.full {
          grid-template-columns: 1fr;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          animation: fadeIn 0.5s ease-out backwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .form-label {
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: #f8f9fa;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .input-wrapper:focus-within {
          background: white;
          border-color: #667eea;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
        }

        .input-icon {
          padding: 0 12px;
          color: #999;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .form-input,
        .form-select {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 12px 0 12px 4px;
          font-size: 14px;
          color: #333;
          font-family: inherit;
        }

        .form-input::placeholder,
        .form-select {
          color: #aaa;
        }

        .form-select {
          cursor: pointer;
        }

        .form-select option {
          background: white;
          color: #333;
        }

        .toggle-password {
          padding: 0 12px;
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
          flex-shrink: 0;
        }

        .toggle-password:hover {
          color: #667eea;
        }

        /* Submit Button */
        .register-button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          text-transform: uppercase;
          margin-top: 20px;
        }

        .register-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.3);
        }

        .register-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Footer */
        .register-footer {
          text-align: center;
          padding: 20px 30px 30px;
          border-top: 1px solid #e0e0e0;
          font-size: 14px;
          color: #666;
        }

        .register-footer a {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          margin-left: 4px;
        }

        .register-footer a:hover {
          color: #764ba2;
        }

        @media (max-width: 480px) {
          .register-container {
            border-radius: 16px;
          }

          .register-header {
            padding: 25px 20px;
          }

          .register-title {
            font-size: 24px;
          }

          .register-body {
            padding: 25px 20px;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .form-input,
          .form-select {
            padding: 10px 0;
          }
        }
      `}</style>

      <div className="alumni-register-wrapper">
        <div className="register-container">
          {/* Header */}
          <div className="register-header">
            <h1 className="register-title">Join Our Alumni</h1>
            <p className="register-subtitle">Create your PSG Alumni account</p>
          </div>

          {/* Body */}
          <div className="register-body">
            {error && (
              <div className="error-banner">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <form onSubmit={handleRegister}>
              {/* Name Fields */}
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">👤 First Name *</label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      className="form-input"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">👤 Last Name *</label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      className="form-input"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="form-grid full">
                <div className="form-group">
                  <label className="form-label">📧 Email Address *</label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password Fields */}
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">🔐 Password *</label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-input"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">🔐 Confirm Password *</label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      className="form-input"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowConfirm(!showConfirm)}
                      disabled={isLoading}
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Academic Info */}
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">📚 Department *</label>
                  <div className="input-wrapper">
                    <select
                      name="department"
                      className="form-select"
                      value={formData.department}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">🎓 Graduation Year *</label>
                  <div className="input-wrapper">
                    <select
                      name="graduationYear"
                      className="form-select"
                      value={formData.graduationYear}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    >
                      <option value="">Select Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">💼 Company</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      name="currentCompany"
                      className="form-input"
                      placeholder="Current Company"
                      value={formData.currentCompany}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">👔 Job Title</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      name="jobTitle"
                      className="form-input"
                      placeholder="Your Position"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">📍 City *</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      name="city"
                      className="form-input"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">🌍 Country *</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      name="country"
                      className="form-input"
                      placeholder="Country"
                      value={formData.country}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="form-grid full">
                <div className="form-group">
                  <label className="form-label">🔗 LinkedIn Profile</label>
                  <div className="input-wrapper">
                    <input
                      type="url"
                      name="linkedin"
                      className="form-input"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="register-button"
                disabled={isLoading}
              >
                <ArrowRight size={18} />
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="register-footer">
            Already have an account?
            <Link to="/alumni-login">Login here</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlumniRegister;