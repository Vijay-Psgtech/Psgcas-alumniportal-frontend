// src/pages/alumni/AlumniLogin.jsx
// ✅ FIXED:
//   1. Uses AuthContext login() — NavBar updates instantly without page refresh
//   2. Forgot password links to /alumni/forgot-password (not a broken #anchor)
//   3. Role-based redirect: admin → /alumni/dashboard, alumni → /alumni/profile
//   4. Password input has padding-right so text doesn't hide under eye toggle

import React, { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
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
        const errorMessage =
          err.response?.data?.message || "Invalid email or password";
        setErrors({ general: errorMessage });
        console.error("Login Error:", err);
      } finally {
        setLoading(false);
      }
    },
    [email, password, validateForm, navigate, login],
  );

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Left Panel - Branding */}
          <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-white shadow-2xl p-8 text-center">
            <img src="/psgcas.png" alt="Logo" className="h-20 mb-6" />
            <h2 className="text-2xl font-bold text-blue-800">Welcome Back!</h2>
            <p className="text-sm font-semibold text-gray-600 mt-4">
              Sign in to connect with your alumni network and stay updated.
            </p>
          </div>

          {/* Right Panel - Login Form */}
          <div className="w-full md:w-1/2 p-8">
            <div className="flex flex-col items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mb-2">
                <LogIn className="text-blue-700" size={32} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Login</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.general && (
                <div className="flex items-center bg-red-100 text-red-700 p-3 rounded">
                  <AlertCircle className="mr-2" size={20} />
                  <span>{errors.general}</span>
                </div>
              )}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <span
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}

              {/* Submit */}
              <div className="flex justify-between items-center text-sm">
                <button type="button" className="text-blue-600 hover:underline">
                  <Link to="/alumni/forgot-password">Forgot Password?</Link>
                </button>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={resetFields}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg shadow"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </div>
              <div className="text-center text-sm text-gray-600 mt-6">
                Don’t have an account?{" "}
                <a
                  href="/alumni/register"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Create one
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlumniLogin;
