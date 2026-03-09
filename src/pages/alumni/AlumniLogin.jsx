// src/pages/auth/AlumniLogin.jsx
// ✅ BEAUTIFUL ALUMNI LOGIN PAGE
// With validation, error handling, and backend integration

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AlumniLogin = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);

    if (result.success) {
      navigate("/alumni-dashboard");
    } else {
      setError(result.error || "Login failed");
    }
    setIsLoading(false);
  };

  return (
    <>
      <style>{`
        .alumni-login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          font-family: 'Poppins', 'Inter', sans-serif;
        }

        .login-container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          max-width: 450px;
          width: 100%;
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

        .login-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }

        .login-logo {
          font-size: 48px;
          margin-bottom: 12px;
        }

        .login-title {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .login-subtitle {
          font-size: 14px;
          opacity: 0.9;
          font-weight: 400;
        }

        .login-body {
          padding: 40px 30px;
        }

        /* Form Group */
        .form-group {
          margin-bottom: 24px;
          animation: fadeIn 0.6s ease-out backwards;
        }

        .form-group:nth-child(1) { animation-delay: 0.1s; }
        .form-group:nth-child(2) { animation-delay: 0.2s; }

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
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: #f8f9fa;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .input-wrapper:focus-within {
          background: white;
          border-color: #667eea;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
        }

        .input-icon {
          padding: 0 14px;
          color: #999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .form-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 14px 0;
          font-size: 15px;
          color: #333;
          font-family: inherit;
        }

        .form-input::placeholder {
          color: #aaa;
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
        }

        .toggle-password:hover {
          color: #667eea;
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

        .error-banner svg {
          flex-shrink: 0;
          width: 18px;
          height: 18px;
        }

        /* Login Button */
        .login-button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
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
          margin-bottom: 20px;
          animation: fadeIn 0.6s ease-out 0.3s backwards;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.3);
        }

        .login-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-button svg {
          width: 18px;
          height: 18px;
        }

        /* Footer */
        .login-footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          animation: fadeIn 0.6s ease-out 0.4s backwards;
        }

        .login-footer-text {
          font-size: 14px;
          color: #666;
          margin-bottom: 12px;
        }

        .login-footer-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }

        .login-footer-link:hover {
          color: #764ba2;
        }

        .divider {
          text-align: center;
          margin: 20px 0;
          position: relative;
          color: #999;
          font-size: 12px;
        }

        .divider::before,
        .divider::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 45%;
          height: 1px;
          background: #e0e0e0;
        }

        .divider::before {
          left: 0;
        }

        .divider::after {
          right: 0;
        }

        @media (max-width: 480px) {
          .login-container {
            border-radius: 16px;
          }

          .login-header {
            padding: 30px 20px;
          }

          .login-title {
            font-size: 24px;
          }

          .login-body {
            padding: 30px 20px;
          }

          .form-input {
            padding: 12px 0;
          }
        }
      `}</style>

      <div className="alumni-login-wrapper">
        <div className="login-container">
          {/* Header */}
          <div className="login-header">
            <div className="login-logo">🎓</div>
            <h1 className="login-title">Alumni Login</h1>
            <p className="login-subtitle">
              Welcome back to PSG Alumni Network
            </p>
          </div>

          {/* Body */}
          <div className="login-body">
            {/* Error Banner */}
            {error && (
              <div className="error-banner">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin}>
              {/* Email Field */}
              <div className="form-group">
                <label className="form-label">📧 Email Address</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label className="form-label">🔐 Password</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                <LogIn size={18} />
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Footer */}
            <div className="login-footer">
              <p className="login-footer-text">
                Don't have an account?{" "}
                <Link to="/alumni-register" className="login-footer-link">
                  Register here
                </Link>
              </p>
              <p className="login-footer-text" style={{ fontSize: "12px" }}>
                <Link to="/" className="login-footer-link">
                  Back to Home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlumniLogin;