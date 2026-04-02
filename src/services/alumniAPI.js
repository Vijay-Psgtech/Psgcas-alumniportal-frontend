// src/services/alumniAPI.js
// ✅ Alumni API Service - Chapters & Other Alumni Endpoints

import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const alumniAPI = axios.create({
  baseURL: `${API_BASE}/api/alumni`,
  withCredentials: true, // Send cookies with requests
});

// Interceptor for error handling
alumniAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or not authenticated
      console.warn("⚠️ Unauthorized - redirecting to login");
    }
    return Promise.reject(error);
  }
);

/* ─────────────────────────────────────────
   CHAPTERS ENDPOINTS
───────────────────────────────────────── */

export const chaptersAPI = {
  // Get all approved chapters
  getChapters: () =>
    alumniAPI.get("/chapters"),

  // Get chapter by ID
  getChapterById: (id) =>
    alumniAPI.get(`/chapters/${id}`),

  // Create chapter (pending approval)
  createChapter: (formData) =>
    alumniAPI.post("/chapters", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Update chapter
  updateChapter: (id, formData) =>
    alumniAPI.put(`/chapters/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Delete chapter
  deleteChapter: (id) =>
    alumniAPI.delete(`/chapters/${id}`),

  // Join/Leave chapter
  toggleChapterMembership: (id) =>
    alumniAPI.post(`/chapters/${id}/toggle-membership`),
};

/* ─────────────────────────────────────────
   ADMIN CHAPTERS ENDPOINTS
───────────────────────────────────────── */

export const adminChaptersAPI = {
  // Get pending chapters
  getPendingChapters: () =>
    alumniAPI.get("/chapters/admin/pending"),

  // Get all chapters with status
  getAllChapters: () =>
    alumniAPI.get("/chapters/admin/all"),

  // Approve chapter
  approveChapter: (id) =>
    alumniAPI.post(`/chapters/${id}/approve`),

  // Reject chapter
  rejectChapter: (id, reason) =>
    alumniAPI.post(`/chapters/${id}/reject`, { reason }),
};

/* ─────────────────────────────────────────
   OTHER ALUMNI ENDPOINTS
───────────────────────────────────────── */

export const alumniAPI_service = {
  // Profile
  getProfile: () => alumniAPI.get("/profile"),
  updateProfile: (data) => alumniAPI.put("/profile", data),

  // Chapters (alias for easy access)
  chapters: chaptersAPI,
};

export default {
  chaptersAPI,
  adminChaptersAPI,
  alumniAPI_service,
};