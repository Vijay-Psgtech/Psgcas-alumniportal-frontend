// src/context/AuthContext.jsx - UPDATED VERSION
// ✅ Works with your existing api.js
// ✅ Proper token management
// ✅ Fixes 401 handling
// ✅ Supports both regular users and admins

import React, { createContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../Services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ INITIALIZE AUTH ON APP LOAD
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("\n🔍 === INITIALIZING AUTH ===");

        // ✅ STEP 1: Check for saved token
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("alumniUser");

        if (!savedToken) {
          console.log("⚠️ No token in localStorage");
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        console.log("✅ Token found in localStorage");

        // ✅ STEP 2: Set token in state
        setToken(savedToken);

        // ✅ STEP 3: Try to use saved user data
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            console.log("✅ User data parsed:", parsedUser.email);
            setUser(parsedUser);
            setIsAuthenticated(true);
            setLoading(false);
            return;
          } catch (err) {
            console.warn("⚠️ Invalid user data in localStorage:", err);
            localStorage.removeItem("alumniUser");
          }
        }

        // ✅ STEP 4: Verify token with backend if no saved user
        console.log("📡 Verifying token with backend...");
        try {
          const response = await authAPI.getProfile();

          if (response.data?.alumni) {
            console.log("✅ Profile verified:", response.data.alumni.email);
            setUser(response.data.alumni);
            localStorage.setItem("alumniUser", JSON.stringify(response.data.alumni));
            setIsAuthenticated(true);
          } else {
            console.log("❌ No alumni data in response");
            localStorage.removeItem("token");
            localStorage.removeItem("alumniUser");
            setIsAuthenticated(false);
          }
        } catch (err) {
          console.error("❌ Profile verification failed:", err.message);

          // If 401, token is invalid
          if (err.response?.status === 401) {
            console.log("🔐 Token invalid, clearing auth");
            localStorage.removeItem("token");
            localStorage.removeItem("alumniUser");
          }

          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("❌ Auth initialization error:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("alumniUser");
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
        console.log("✅ Auth initialization complete\n");
      }
    };

    initializeAuth();
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ LOGIN FUNCTION - For both regular users and admins
  // ═══════════════════════════════════════════════════════════════════════════

  const login = useCallback(async (email, password) => {
    try {
      console.log("\n🔐 === LOGIN FUNCTION ===");
      setError("");

      // ✅ STEP 1: Call login API
      console.log("📡 Calling login API...");
      const response = await authAPI.login(email, password);

      console.log("✅ Login response received");

      // ✅ STEP 2: Extract token and user data
      const { token: loginToken, alumni: loginUser } = response.data;

      if (!loginToken || !loginUser) {
        throw new Error("Invalid response from server");
      }

      console.log("✅ Token extracted:", loginToken.substring(0, 20) + "...");
      console.log("✅ User data extracted:", loginUser.email);

      // ✅ STEP 3: Update state
      setToken(loginToken);
      setUser(loginUser);
      setIsAuthenticated(true);

      // ✅ STEP 4: Save to localStorage (already done by api.js, but ensure it's there)
      localStorage.setItem("token", loginToken);
      localStorage.setItem("alumniUser", JSON.stringify(loginUser));
      localStorage.setItem("loginMethod", "backend");

      console.log("✅ Auth state updated");
      console.log("✅ LOGIN SUCCESSFUL\n");

      return { success: true, data: loginUser };
    } catch (err) {
      console.error("❌ Login error:", err.message);

      const errorMsg = err.response?.data?.message || err.message || "Login failed";
      setError(errorMsg);
      setIsAuthenticated(false);

      // Clear any partial data
      localStorage.removeItem("token");
      localStorage.removeItem("alumniUser");

      return { success: false, error: errorMsg };
    }
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ REGISTER FUNCTION
  // ═══════════════════════════════════════════════════════════════════════════

  const register = useCallback(async (userData) => {
    try {
      console.log("\n📝 === REGISTER FUNCTION ===");
      setError("");

      const response = await authAPI.register(userData);

      if (response.data?.token) {
        const newUser = response.data.alumni || response.data.user || userData;
        newUser.isAdmin = false; // New registrations are not admin

        setToken(response.data.token);
        setUser(newUser);
        setIsAuthenticated(false); // Need admin approval
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("alumniUser", JSON.stringify(newUser));

        console.log("✅ Registration successful");
        return { success: true, data: newUser };
      }
    } catch (err) {
      console.error("❌ Registration error:", err);

      const errorMsg = err.response?.data?.message || "Registration failed";
      setError(errorMsg);
      setIsAuthenticated(false);

      return { success: false, error: errorMsg };
    }
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ LOGOUT FUNCTION
  // ═══════════════════════════════════════════════════════════════════════════

  const logout = useCallback(() => {
    console.log("\n👋 === LOGOUT FUNCTION ===");

    setUser(null);
    setToken(null);
    setError("");
    setIsAuthenticated(false);

    localStorage.removeItem("token");
    localStorage.removeItem("alumniUser");
    localStorage.removeItem("loginMethod");

    authAPI.logout();

    console.log("✅ Logout successful\n");
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ UPDATE PROFILE FUNCTION
  // ═══════════════════════════════════════════════════════════════════════════

  const updateProfile = useCallback(async (profileData) => {
    try {
      console.log("\n✏️ === UPDATE PROFILE ===");
      setError("");

      const response = await authAPI.updateProfile(profileData);

      if (response.data?.alumni || response.data) {
        const updatedUser = response.data.alumni || response.data;

        setUser(updatedUser);
        localStorage.setItem("alumniUser", JSON.stringify(updatedUser));

        console.log("✅ Profile updated");
        return { success: true, data: updatedUser };
      }
    } catch (err) {
      console.error("❌ Update profile error:", err);

      const errorMsg = err.response?.data?.message || "Update failed";
      setError(errorMsg);

      return { success: false, error: errorMsg };
    }
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ CLEAR ERROR FUNCTION
  // ═══════════════════════════════════════════════════════════════════════════

  const clearError = useCallback(() => {
    setError("");
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ CONTEXT VALUE
  // ═══════════════════════════════════════════════════════════════════════════

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ✅ CUSTOM HOOK - useAuth
// ═══════════════════════════════════════════════════════════════════════════

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export default AuthContext;