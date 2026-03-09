// src/Services/axiosConfig.js - API CLIENT WITH TOKEN HANDLING
// ✅ Automatically adds token to all requests
// ✅ Handles 401 errors and redirects to login
// ✅ Sets up base URL and default headers

import axios from "axios";

// ✅ Get API base URL from environment or use default
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,   // ✅ FIXED HERE 
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});
// ═══════════════════════════════════════════════════════════════
// ✅ REQUEST INTERCEPTOR - Add token to every request
// ═══════════════════════════════════════════════════════════════
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request setup errors
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════════════════════════
// ✅ RESPONSE INTERCEPTOR - Handle responses and errors
// ═══════════════════════════════════════════════════════════════
api.interceptors.response.use(
  // ✅ Success response
  (response) => {
    return response;
  },
  // ✅ Error response
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    // Handle 401 Unauthorized - token expired or invalid
    if (status === 401) {
      console.warn("Token expired or invalid - logging out");
      
      // Clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("alumniUser");

      // Remove auth header
      delete api.defaults.headers.common["Authorization"];

      // Redirect to login page
      if (window.location.pathname !== "/alumni/login") {
        window.location.href = "/alumni/login";
      }
    }
    
    // Handle 403 Forbidden - user doesn't have permission
    if (status === 403) {
      console.warn("Access forbidden:", message);
    }

    // Handle 404 Not Found
    if (status === 404) {
      console.warn("Resource not found:", message);
    }

    // Handle 500 Server Error
    if (status === 500) {
      console.error("Server error:", message);
    }

    // Log error details for debugging
    console.error("API Error:", {
      status,
      message,
      url: error.config?.url,
      method: error.config?.method,
    });

    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════════════════════════
// ✅ API METHODS - Common requests
// ═══════════════════════════════════════════════════════════════

// GET request
export const apiGet = (url, config = {}) => {
  return api.get(url, config);
};

// POST request
export const apiPost = (url, data = {}, config = {}) => {
  return api.post(url, data, config);
};

// PUT request
export const apiPut = (url, data = {}, config = {}) => {
  return api.put(url, data, config);
};

// PATCH request
export const apiPatch = (url, data = {}, config = {}) => {
  return api.patch(url, data, config);
};

// DELETE request
export const apiDelete = (url, config = {}) => {
  return api.delete(url, config);
};

// ═══════════════════════════════════════════════════════════════
// ✅ AUTH METHODS - Authentication endpoints
// ═══════════════════════════════════════════════════════════════

export const authAPI = {
  login: (email, password) =>
    api.post("/api/auth/login", { email, password }),

  register: (userData) =>
    api.post("/api/auth/register", userData),

  getProfile: () =>
    api.get("/api/auth/profile"),

  updateProfile: (profileData) =>
    api.put("/api/auth/profile", profileData),

  logout: () =>
    api.post("/api/auth/logout"),

  refreshToken: () =>
    api.post("/api/auth/refresh"),

  verifyToken: () =>
    api.get("/api/auth/verify"),
};

// ═══════════════════════════════════════════════════════════════
// ✅ ALUMNI METHODS - Alumni endpoints
// ═══════════════════════════════════════════════════════════════

export const alumniAPI = {
  getDirectory: (params = {}) =>
    api.get("/api/alumni/directory", { params }),

  getProfile: (alumniId) =>
    api.get(`/api/alumni/${alumniId}`),

  updateProfile: (alumniId, data) =>
    api.put(`/api/alumni/${alumniId}`, data),

  getStories: (params = {}) =>
    api.get("/api/alumni/stories", { params }),

  getMap: () =>
    api.get("/api/alumni/map"),
};

// ═══════════════════════════════════════════════════════════════
// ✅ EVENTS METHODS - Events endpoints
// ═══════════════════════════════════════════════════════════════

export const eventsAPI = {
  getAll: () =>
    api.get("/api/events"),

  getUpcoming: () =>
    api.get("/api/events/upcoming"),

  getPast: () =>
    api.get("/api/events/past"),

  getById: (eventId) =>
    api.get(`/api/events/${eventId}`),

  register: (eventId, data = {}) =>
    api.post(`/api/events/${eventId}/register`, data),

  cancelRegistration: (eventId) =>
    api.delete(`/api/events/${eventId}/register`),
};

// ═══════════════════════════════════════════════════════════════
// ✅ DONATIONS METHODS - Donations endpoints
// ═══════════════════════════════════════════════════════════════

export const donationsAPI = {
  getAll: () =>
    api.get("/api/donations"),

  getMyDonations: () =>
    api.get("/api/donations/my"),

  create: (donationData) =>
    api.post("/api/donations", donationData),

  getById: (donationId) =>
    api.get(`/api/donations/${donationId}`),
};

// ═══════════════════════════════════════════════════════════════
// ✅ Export default api instance
// ═══════════════════════════════════════════════════════════════

export default api;