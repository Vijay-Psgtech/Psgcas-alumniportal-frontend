// src/pages/alumni/AlumniLogin.jsx
// ✅ FIXED:
//   1. Uses AuthContext login() — NavBar updates instantly without page refresh
//   2. Forgot password links to /alumni/forgot-password (not a broken #anchor)
//   3. Role-based redirect: admin → /alumni/dashboard, alumni → /alumni/profile
//   4. Password input has padding-right so text doesn't hide under eye toggle

import React, { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, AlertCircle, Eye, EyeOff } from "lucide-react";
import { authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const AlumniLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ FIX 1: get login() from context

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Valid email is required";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      setLoading(true);
      setErrors({});

      try {
        const response = await authAPI.login({ email, password });

        // Server sets HttpOnly cookie automatically — no token in response body
        const alumni = response.data.alumni;

        if (!alumni) {
          setErrors({ general: "Login failed: no user data received" });
          return;
        }

        // Seed AuthContext state; cookie is already set by the server
        await login(alumni);

        // Role-based redirect
        if (alumni.isAdmin) {
          navigate("/alumni/dashboard");
        } else if (alumni.isApproved) {
          navigate("/alumni/profile");
        } else {
          // Registered but pending admin approval
          navigate("/alumni/register");
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Invalid email or password";
        setErrors({ general: errorMessage });
        console.error("Login Error:", err);
      } finally {
        setLoading(false);
      }
    },
    [email, password, validateForm, navigate, login]
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,600&family=Outfit:wght@300;400;500;600&display=swap');

        .alumni-login-section {
          background: linear-gradient(165deg, #f8f5ee 0%, #fdfcf9 45%, #f2f4fa 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: 'Outfit', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .alumni-login-section::before {
          content: '';
          position: absolute;
          top: -200px;
          right: -200px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(201, 168, 76, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .alumni-login-section::after {
          content: '';
          position: absolute;
          bottom: -150px;
          left: -150px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(102, 126, 234, 0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .alumni-login-inner {
          max-width: 480px;
          width: 100%;
          position: relative;
          z-index: 2;
        }

        .login-card {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 16px;
          padding: 48px 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
          position: relative;
        }

        .login-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%);
          border-radius: 16px 16px 0 0;
        }

        .login-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .login-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: white;
        }

        .login-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: #0c0e1a;
          margin-bottom: 8px;
        }

        .login-subtitle {
          font-size: 14px;
          color: #666e80;
          font-weight: 300;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 12px;
          font-weight: 600;
          color: #0c0e1a;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-input-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .form-input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #e0e6f0;
          border-radius: 8px;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          color: #0c0e1a;
          transition: all 0.3s ease;
          background: #fafbfc;
          box-sizing: border-box;
        }

        /* ✅ FIX 4: Extra right padding so text doesn't hide under the eye button */
        .form-input.has-toggle {
          padding-right: 46px;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          color: #a0aec0;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .password-toggle:hover {
          color: #667eea;
        }

        .form-error {
          font-size: 12px;
          color: #dc2626;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .error-banner {
          background: #fee2e2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 12px 14px;
          color: #991b1b;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .login-button {
          padding: 13px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 46px;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .forgot-link {
          text-align: center;
          margin-top: -4px;
        }

        .forgot-link a {
          font-size: 13px;
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .forgot-link a:hover {
          color: #764ba2;
          text-decoration: underline;
        }

        .divider {
          height: 1px;
          background: #e2e8f0;
          margin: 24px 0;
          position: relative;
        }

        .divider-text {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 0 12px;
          font-size: 12px;
          color: #a0aec0;
          font-weight: 500;
        }

        .login-footer {
          text-align: center;
          font-size: 13px;
          color: #666e80;
        }

        .login-footer a {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }

        .login-footer a:hover {
          color: #764ba2;
        }

        .info-box {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
          border: 1px solid rgba(102, 126, 234, 0.2);
          border-radius: 8px;
          padding: 12px;
          margin-top: 20px;
          font-size: 12px;
          color: #0c0e1a;
        }

        .info-box p {
          margin: 6px 0;
          line-height: 1.5;
        }

        .info-title {
          font-weight: 600;
          color: #667eea;
          margin-bottom: 4px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 600px) {
          .login-card { padding: 32px 24px; }
          .login-title { font-size: 24px; }
        }
      `}</style>

      <motion.div
        className="alumni-login-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="alumni-login-inner">
          <motion.div className="login-card" variants={containerVariants} initial="hidden" animate="visible">

            {/* Header */}
            <div className="login-header">
              <motion.div
                className="login-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <LogIn size={32} />
              </motion.div>
              <h1 className="login-title">Alumni Login</h1>
              <p className="login-subtitle">Connect with your alumni community</p>
            </div>

            {/* Form */}
            <motion.form onSubmit={handleSubmit} className="login-form" variants={containerVariants}>

              {/* Error Banner */}
              {errors.general && (
                <motion.div
                  className="error-banner"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle size={16} />
                  {errors.general}
                </motion.div>
              )}

              {/* Email */}
              <motion.div className="form-group" variants={containerVariants}>
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
                {errors.email && (
                  <div className="form-error">
                    <AlertCircle size={14} /> {errors.email}
                  </div>
                )}
              </motion.div>

              {/* Password */}
              <motion.div className="form-group" variants={containerVariants}>
                <label className="form-label">Password *</label>
                <div className="form-input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input has-toggle" /* ✅ FIX 4: padding-right via class */
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <div className="form-error">
                    <AlertCircle size={14} /> {errors.password}
                  </div>
                )}
              </motion.div>

              {/* Submit */}
              <motion.button
                type="submit"
                className="login-button"
                disabled={loading}
                variants={containerVariants}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: "16px", height: "16px",
                      border: "2px solid white", borderTop: "2px solid transparent",
                      borderRadius: "50%", animation: "spin 0.8s linear infinite",
                    }} />
                    Signing in…
                  </>
                ) : (
                  <>
                    <LogIn size={18} /> Sign In
                  </>
                )}
              </motion.button>

              {/* ✅ FIX 5: Proper Link to forgot password page */}
              <div className="forgot-link">
                <Link to="/alumni/forgot-password">Forgot your password?</Link>
              </div>

            </motion.form>

            <div className="divider">
              <span className="divider-text">New here?</span>
            </div>

            <motion.div className="login-footer" variants={containerVariants}>
              Don't have an account?{" "}
              <Link to="/alumni/register">Create one now</Link>
            </motion.div>

            <motion.div className="info-box" variants={containerVariants}>
              <p className="info-title">✓ Account Approval Required</p>
              <p>Your account must be approved by our admin team before you can access the alumni network. You'll receive an email once approved.</p>
            </motion.div>

          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default AlumniLogin;