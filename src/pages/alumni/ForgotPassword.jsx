// src/pages/alumni/ForgotPassword.jsx
// PSG Arts Alumni - Password Reset
// 3-step process: Email → Verification Code → New Password

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: Password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  // Step 1: Submit Email
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      // TODO: Replace with your actual API call
      // const response = await authAPI.forgotPassword({ email });
      
      // Mock for development
      console.log("📧 Reset link sent to:", email);
      setSuccess("Check your email for a reset code");
      setTimeout(() => {
        setStep(2);
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Code
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!code || code.length < 4) {
        setError("Please enter a valid code");
        setLoading(false);
        return;
      }

      // TODO: Replace with your actual API call
      // const response = await authAPI.verifyResetCode({ email, code });
      
      // Mock for development
      console.log("✓ Code verified:", code);
      setSuccess("Code verified! Now create a new password");
      setTimeout(() => {
        setStep(3);
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      // TODO: Replace with your actual API call
      // const response = await authAPI.resetPassword({
      //   email,
      //   code,
      //   newPassword: password
      // });
      
      // Mock for development
      console.log("🔐 Password reset successful");
      setSuccess("Password reset successful! Redirecting to login...");
      
      setTimeout(() => {
        navigate("/alumni/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError("");
      setSuccess("");
    } else {
      navigate("/alumni/login");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Inter:wght@300;400;500;600&display=swap');

        .psg-forgot-password {
          background: linear-gradient(135deg, #E8F1F8 0%, #F0F5FB 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .psg-forgot-password::before {
          content: '';
          position: absolute;
          top: -200px;
          right: -200px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(46, 95, 138, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .psg-forgot-inner {
          max-width: 480px;
          width: 100%;
          position: relative;
          z-index: 2;
        }

        .psg-forgot-card {
          background: white;
          border: 1px solid rgba(46, 95, 138, 0.1);
          border-radius: 16px;
          padding: 48px 40px;
          box-shadow: 0 10px 40px rgba(46, 95, 138, 0.08);
          position: relative;
        }

        .psg-forgot-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #1A3A52 0%, #2E5F8A 100%);
          border-radius: 16px 16px 0 0;
        }

        .psg-forgot-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .psg-forgot-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #1A3A52 0%, #2E5F8A 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: white;
        }

        .psg-forgot-title {
          font-family: 'Sora', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #1A3A52;
          margin-bottom: 8px;
        }

        .psg-forgot-subtitle {
          font-size: 14px;
          color: #4B5563;
          font-weight: 400;
        }

        .psg-progress-steps {
          display: flex;
          justify-content: space-between;
          margin-bottom: 32px;
          position: relative;
        }

        .psg-progress-steps::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 0;
          right: 0;
          height: 2px;
          background: #E5E7EB;
          z-index: 0;
        }

        .psg-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          position: relative;
          z-index: 1;
        }

        .psg-step-number {
          width: 40px;
          height: 40px;
          background: white;
          border: 2px solid #D1D5DB;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #4B5563;
          margin-bottom: 8px;
          transition: all 0.3s ease;
        }

        .psg-step.active .psg-step-number {
          background: #1A3A52;
          color: white;
          border-color: #1A3A52;
        }

        .psg-step.completed .psg-step-number {
          background: #166534;
          color: white;
          border-color: #166534;
        }

        .psg-step-label {
          font-size: 11px;
          color: #9CA3AF;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .psg-step.active .psg-step-label,
        .psg-step.completed .psg-step-label {
          color: #1A3A52;
        }

        .psg-form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .psg-form-label {
          font-size: 12px;
          font-weight: 600;
          color: #1A3A52;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .psg-form-input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #D1D5DB;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #1A3A52;
          transition: all 0.3s ease;
          background: #F9FAFB;
        }

        .psg-form-input:focus {
          outline: none;
          border-color: #2E5F8A;
          background: white;
          box-shadow: 0 0 0 3px rgba(46, 95, 138, 0.1);
        }

        .psg-form-input::placeholder {
          color: #9CA3AF;
        }

        .psg-error-banner {
          background: #FEE2E2;
          border: 1px solid #FECACA;
          border-radius: 8px;
          padding: 12px 14px;
          color: #991B1B;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .psg-success-banner {
          background: #DCFCE7;
          border: 1px solid #BBFBDC;
          border-radius: 8px;
          padding: 12px 14px;
          color: #166534;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .psg-forgot-button {
          padding: 13px 20px;
          background: linear-gradient(135deg, #1A3A52 0%, #2E5F8A 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
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
          width: 100%;
        }

        .psg-forgot-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(46, 95, 138, 0.3);
        }

        .psg-forgot-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .psg-back-link {
          text-align: center;
          margin-top: 20px;
        }

        .psg-back-link a {
          color: #2E5F8A;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          transition: color 0.2s;
        }

        .psg-back-link a:hover {
          color: #1A3A52;
          text-decoration: underline;
        }

        @media (max-width: 600px) {
          .psg-forgot-card {
            padding: 32px 24px;
          }

          .psg-forgot-title {
            font-size: 24px;
          }

          .psg-progress-steps {
            margin-bottom: 24px;
          }

          .psg-step-label {
            display: none;
          }
        }
      `}</style>

      <motion.div
        className="psg-forgot-password"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="psg-forgot-inner">
          <motion.div
            className="psg-forgot-card"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header */}
            <div className="psg-forgot-header">
              <motion.div
                className="psg-forgot-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Mail size={32} />
              </motion.div>
              <h1 className="psg-forgot-title">Reset Password</h1>
              <p className="psg-forgot-subtitle">
                {step === 1 && "Enter your email to reset your password"}
                {step === 2 && "Enter the code sent to your email"}
                {step === 3 && "Create a new password"}
              </p>
            </div>

            {/* Progress Steps */}
            <div className="psg-progress-steps">
              <div className={`psg-step ${step >= 1 ? "active" : ""} ${step > 1 ? "completed" : ""}`}>
                <div className="psg-step-number">
                  {step > 1 ? <CheckCircle size={20} /> : "1"}
                </div>
                <div className="psg-step-label">Email</div>
              </div>
              <div className={`psg-step ${step >= 2 ? "active" : ""} ${step > 2 ? "completed" : ""}`}>
                <div className="psg-step-number">
                  {step > 2 ? <CheckCircle size={20} /> : "2"}
                </div>
                <div className="psg-step-label">Code</div>
              </div>
              <div className={`psg-step ${step >= 3 ? "active" : ""}`}>
                <div className="psg-step-number">3</div>
                <div className="psg-step-label">Password</div>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <motion.div className="psg-error-banner" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            {/* Success Banner */}
            {success && (
              <motion.div className="psg-success-banner" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <CheckCircle size={16} />
                {success}
              </motion.div>
            )}

            {/* Step 1: Email */}
            {step === 1 && (
              <motion.form onSubmit={handleEmailSubmit} variants={containerVariants}>
                <motion.div className="psg-form-group" variants={containerVariants}>
                  <label className="psg-form-label">Email Address *</label>
                  <input
                    type="email"
                    className="psg-form-input"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  className="psg-forgot-button"
                  disabled={loading}
                  variants={containerVariants}
                >
                  {loading ? (
                    <>
                      <div style={{ width: "16px", height: "16px", border: "2px solid white", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Code
                      <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}

            {/* Step 2: Verification Code */}
            {step === 2 && (
              <motion.form onSubmit={handleCodeSubmit} variants={containerVariants}>
                <motion.div className="psg-form-group" variants={containerVariants}>
                  <label className="psg-form-label">Verification Code *</label>
                  <input
                    type="text"
                    className="psg-form-input"
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    maxLength="6"
                    required
                  />
                  <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>
                    Check your email for the code
                  </p>
                </motion.div>

                <motion.button
                  type="submit"
                  className="psg-forgot-button"
                  disabled={loading}
                  variants={containerVariants}
                >
                  {loading ? (
                    <>
                      <div style={{ width: "16px", height: "16px", border: "2px solid white", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Code
                      <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <motion.form onSubmit={handlePasswordSubmit} variants={containerVariants}>
                <motion.div className="psg-form-group" variants={containerVariants}>
                  <label className="psg-form-label">New Password *</label>
                  <input
                    type="password"
                    className="psg-form-input"
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </motion.div>

                <motion.div className="psg-form-group" variants={containerVariants}>
                  <label className="psg-form-label">Confirm Password *</label>
                  <input
                    type="password"
                    className="psg-form-input"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  className="psg-forgot-button"
                  disabled={loading}
                  variants={containerVariants}
                >
                  {loading ? (
                    <>
                      <div style={{ width: "16px", height: "16px", border: "2px solid white", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                      Resetting...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <CheckCircle size={16} />
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}

            {/* Back Button */}
            <div className="psg-back-link">
              <button
                onClick={handleBack}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2E5F8A",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                ← {step > 1 ? "Back" : "Back to Login"}
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default ForgotPassword;