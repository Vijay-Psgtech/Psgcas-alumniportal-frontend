// src/pages/alumni/AlumniLogin.jsx
// FIXED: Proper role verification and redirect logic

import React, { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, AlertCircle, Eye, EyeOff, Loader } from "lucide-react";
import { authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const AlumniLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const resetFields = useCallback(() => {
    setEmail("");
    setPassword("");
    setErrors({});
  }, []);

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

        // Log the alumni object for debugging
        console.log("Login successful. Alumni data:", alumni);
        console.log("User role:", alumni.role);
        console.log("Is Admin:", alumni.isAdmin);
        console.log("Is SubAdmin:", alumni.isSubAdmin);

        // Seed AuthContext state; cookie is already set by the server
        await login(alumni);

        // ── ROLE-BASED REDIRECT WITH PROPER CHECKS ───────────────────────────────────
        // Priority order:
        //   1. Super-admin  (isAdmin: true)        → /admin/dashboard
        //   2. Sub-admin    (role: "subAdmin")     → /sub-admin/dashboard
        //   3. Approved alumni                     → /alumni/profile
        //   4. Pending alumni                      → /alumni/register (shows pending message)

        // SUPER ADMIN CHECK
        if (alumni.isAdmin === true) {
          console.log("Redirecting to Admin Dashboard");
          navigate("/admin/dashboard", { replace: true });
        }
        // SUB ADMIN CHECK (Check both role and isSubAdmin for compatibility)
        else if (alumni.role === "subAdmin" || alumni.isSubAdmin === true) {
          console.log("Redirecting to Sub-Admin Dashboard");
          navigate("/sub-admin/dashboard", { replace: true });
        }
        // APPROVED ALUMNI CHECK
        else if (alumni.isApproved === true) {
          console.log("Redirecting to Alumni Profile");
          navigate("/alumni/profile", { replace: true });
        }
        // PENDING ALUMNI CHECK
        else {
          console.log("Redirecting to Register (Pending Approval)");
          // Registered but pending super/sub-admin approval
          navigate("/alumni/register", { replace: true, state: { pending: true } });
        }
      } catch (err) {
        console.error("Login Error:", err);
        const errorMessage =
          err.response?.data?.message || "Invalid email or password";
        
        // Handle specific error cases
        if (err.response?.status === 401) {
          setErrors({ general: "Invalid credentials. Please try again." });
        } else if (err.response?.status === 429) {
          setErrors({ general: "Too many login attempts. Please try again later." });
        } else if (err.response?.status === 500) {
          setErrors({ general: "Server error. Please try again later." });
        } else {
          setErrors({ general: errorMessage });
        }
      } finally {
        setLoading(false);
      }
    },
    [email, password, validateForm, navigate, login],
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Left Panel — Branding */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-br from-[#667eea] to-[#764ba2] shadow-2xl p-8 text-center text-white">
          <img src="/psgcas.png" alt="Logo" className="h-20 mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-sm font-semibold opacity-90">
            Sign in to connect with your alumni network and stay updated.
          </p>
          <div className="mt-8 space-y-3 text-sm">
            <div className="flex items-center gap-2 justify-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">✓</div>
              <span>Connect with fellow alumni</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">✓</div>
              <span>Share your experiences</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">✓</div>
              <span>Access exclusive events</span>
            </div>
          </div>
        </div>

        {/* Right Panel — Login Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full mb-2">
              <LogIn className="text-blue-700" size={32} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Login</h2>
            <p className="text-xs text-gray-500 mt-1">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* General Error */}
            {errors.general && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg animate-in">
                <AlertCircle className="mt-0.5 flex-shrink-0" size={18} />
                <div className="flex-1">
                  <p className="font-medium text-sm">{errors.general}</p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:cursor-not-allowed pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition disabled:opacity-50"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end pt-2">
              <Link 
                to="/forgot-password" 
                className="text-[#764ba2] hover:text-[#667eea] text-xs font-semibold hover:underline transition"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between gap-3 pt-6">
              <button
                type="button"
                onClick={resetFields}
                disabled={loading}
                className="flex-1 px-5 py-2.5 rounded-lg font-semibold text-sm text-[#764ba2] border border-[#764ba2] hover:bg-[#764ba2]/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-[#667eea] hover:bg-[#764ba2] disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg shadow-md shadow-[#667eea]/20 hover:shadow-lg hover:shadow-[#764ba2]/20 font-semibold text-sm transition-all"
              >
                {loading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    Sign In
                  </>
                )}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center text-xs text-gray-600 mt-6 pt-4 border-t border-gray-200">
              Don't have an account?{" "}
              <Link
                to="/alumni/register"
                className="text-[#667eea] font-semibold hover:text-[#764ba2] hover:underline transition"
              >
                Create one now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AlumniLogin;