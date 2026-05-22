// src/pages/alumni/AlumniLogin.jsx
// ✅ FIXED: Reordered handlers before useEffect dependencies

import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, AlertCircle, Eye, EyeOff, Loader } from "lucide-react";
import { authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import usePageTitle from "../../hooks/usePageTitle";

const AlumniLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  usePageTitle("Sign In");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({ google: false, facebook: false });

  // ══════════════════════════════════════════════════════════════
  // ✅ FIXED: DEFINE HANDLERS FIRST (before useEffect that uses them)
  // ══════════════════════════════════════════════════════════════

  // ✅ Reset form fields
  const resetFields = useCallback(() => {
    setEmail("");
    setPassword("");
    setErrors({});
  }, []);

  // ✅ Validate email and password
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

  // ══════════════════════════════════════════════════════════════
  // GOOGLE LOGIN HANDLER - ✅ MOVED BEFORE useEffect
  // ══════════════════════════════════════════════════════════════
  const handleGoogleSignIn = useCallback(async (response) => {
    setSocialLoading((prev) => ({ ...prev, google: true }));
    setErrors({});

    try {
      // Send ID token to backend
      const backendResponse = await authAPI.socialLogin({
        provider: "google",
        idToken: response.credential,
      });

      console.log("✅ Google login response:", backendResponse.data);

      const user = backendResponse.data.user || backendResponse.data.alumni;

      if (!user) {
        console.error("❌ No user data in response:", backendResponse.data);
        setErrors({ general: "Login failed: no user data received" });
        setSocialLoading((prev) => ({ ...prev, google: false }));
        return;
      }

      await login(user);

      // Role-based redirect
      if (user.role === "admin" || user.role === "superadmin") {
        navigate("/admin/dashboard");
      } else if (user.isApproved) {
        navigate("/alumni/dashboard");
      } else {
        navigate("/alumni/register");
      }
    } catch (err) {
      console.error("❌ Google login error:", err);
      const errorMessage =
        err.response?.data?.message || "Google login failed. Please try again.";
      setErrors({ general: errorMessage });
      setSocialLoading((prev) => ({ ...prev, google: false }));
    }
  }, [navigate, login]);

  // ══════════════════════════════════════════════════════════════
  // FACEBOOK LOGIN HANDLER - ✅ MOVED BEFORE useEffect
  // ══════════════════════════════════════════════════════════════
  const handleFacebookLogin = useCallback(async () => {
    setSocialLoading((prev) => ({ ...prev, facebook: true }));
    setErrors({});

    try {
      FB.login(
        async (response) => {
          if (response.authResponse) {
            try {
              const backendResponse = await authAPI.socialLogin({
                provider: "facebook",
                accessToken: response.authResponse.accessToken,
              });

              console.log("✅ Facebook login response:", backendResponse.data);

              const user = backendResponse.data.user || backendResponse.data.alumni;

              if (!user) {
                console.error("❌ No user data in response:", backendResponse.data);
                setErrors({ general: "Login failed: no user data received" });
                setSocialLoading((prev) => ({ ...prev, facebook: false }));
                return;
              }

              await login(user);

              // Role-based redirect
              if (user.role === "admin" || user.role === "superadmin") {
                navigate("/admin/dashboard");
              } else if (user.isApproved) {
                navigate("/alumni/dashboard");
              } else {
                navigate("/alumni/register");
              }
            } catch (err) {
              console.error("❌ Facebook backend error:", err);
              const errorMessage =
                err.response?.data?.message || "Facebook login failed. Please try again.";
              setErrors({ general: errorMessage });
              setSocialLoading((prev) => ({ ...prev, facebook: false }));
            }
          } else {
            setErrors({ general: "Facebook login cancelled. Please try again." });
            setSocialLoading((prev) => ({ ...prev, facebook: false }));
          }
        },
        { scope: "public_profile,email" }
      );
    } catch (err) {
      console.error("❌ Facebook login error:", err);
      setErrors({ general: "Facebook login error. Please try again." });
      setSocialLoading((prev) => ({ ...prev, facebook: false }));
    }
  }, [navigate, login]);

  // ══════════════════════════════════════════════════════════════
  // EMAIL/PASSWORD LOGIN HANDLER
  // ══════════════════════════════════════════════════════════════
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setLoading(true);

      try {
        const response = await authAPI.login({ email, password });
        console.log("✅ Login response:", response.data);

        const user = response.data.user || response.data.alumni;

        if (!user) {
          setErrors({ general: "Login failed: no user data" });
          setLoading(false);
          return;
        }

        await login(user);

        // Role-based redirect
        if (user.role === "admin" || user.role === "superadmin") {
          navigate("/admin/dashboard");
        } else if (user.isApproved) {
          navigate("/alumni/dashboard");
        } else {
          navigate("/alumni/register");
        }
      } catch (err) {
        console.error("❌ Login error:", err);
        const errorMessage =
          err.response?.data?.message || "Login failed. Please check your credentials.";
        setErrors({ general: errorMessage });
        setLoading(false);
      }
    },
    [email, password, validateForm, login, navigate]
  );

  // ══════════════════════════════════════════════════════════════
  // ✅ GOOGLE SIGN-IN INITIALIZATION (NOW handleGoogleSignIn IS DEFINED)
  // ══════════════════════════════════════════════════════════════
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn, // ✅ NOW SAFE - handleGoogleSignIn is defined
        });
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          { theme: "outline", size: "large", width: "100%" }
        );
      }
    };

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    document.body.appendChild(script);

    return () => {
      // Cleanup
    };
  }, [handleGoogleSignIn]); // ✅ Safe now - handleGoogleSignIn is defined above

  // ══════════════════════════════════════════════════════════════
  // FACEBOOK SDK INITIALIZATION
  // ══════════════════════════════════════════════════════════════
  useEffect(() => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID,
        xfbml: true,
        version: "v18.0",
      });
    };

    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
    };
  }, []);

  const isFormDisabled = loading || socialLoading.google || socialLoading.facebook;

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Left Panel — Branding */}
          <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-linear-to-br from-[#667eea] to-[#764ba2] shadow-2xl p-8 text-center text-white">
            <img 
              src="/psgcas.png" 
              alt="PSG CAS Logo" 
              className="h-20 mb-6 opacity-90"
              loading="lazy"
              decoding="async"
            />
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
                  <AlertCircle className="mt-0.5 shrink-0" size={18} />
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
                  disabled={isFormDisabled}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:cursor-not-allowed"
                  required
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
                    disabled={isFormDisabled}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:cursor-not-allowed pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isFormDisabled}
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
                  disabled={isFormDisabled}
                  className="flex-1 px-5 py-2.5 rounded-lg font-semibold text-sm text-[#764ba2] border border-[#764ba2] hover:bg-[#764ba2]/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={isFormDisabled}
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

              {/* Divider */}
              <div className="relative pt-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-white text-gray-500 font-semibold">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Sign-In Button */}
              <div id="google-signin-button" className="w-full flex justify-center"></div>

              {/* Facebook Login Button */}
              <button
                type="button"
                onClick={handleFacebookLogin}
                disabled={isFormDisabled}
                className="w-full flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#0A66C2] disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg shadow-md shadow-[#1877F2]/20 hover:shadow-lg hover:shadow-[#1877F2]/30 font-semibold text-sm transition-all"
              >
                {socialLoading.facebook ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Sign In with Facebook
                  </>
                )}
              </button>

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
    </>
  );
};

export default AlumniLogin;