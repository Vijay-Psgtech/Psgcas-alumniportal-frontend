import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: true,
});

// RESPONSE INTERCEPTOR — handle 401/403 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const message = error.response?.data?.message || error.message;

    console.error("❌ API Error:", { status, url, message });

    if (status === 401) {
      // Cookie is already expired/invalid on the server side.
      // Dispatch event so AuthContext / protected routes can react.
      window.dispatchEvent(new CustomEvent("auth:logout", { detail: { url } }));
    }

    if (status === 403) {
      window.dispatchEvent(new CustomEvent("auth:forbidden"));
    }

    return Promise.reject(error);
  },
);

// ──────────────── API_BASE ──────────────────────── //
export const API_BASE = import.meta.env.VITE_API_URL.replace("/api", "");

// ──────────────── Auth API ──────────────────────── //
export const authAPI = {
  register: (data) =>
    api.post("/auth/register", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  login: (data) => api.post("/auth/login", data),
  getProfile: () => api.get("/auth/profile"),
  changePassword: (currentPassword, newPassword) =>
    api.put("/auth/change-password", { currentPassword, newPassword }),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  verifyOtp: (email, otp) => api.post("/auth/verify-otp", { email, otp }),
  resetPassword: (email, otp, newPassword) =>
    api.post("/auth/reset-password", { email, otp, newPassword }),
};

// ── ALUMNI ───────────────────────────────────────────────────────
export const alumniAPI = {
  getAllAlumni: (params) => api.get("/alumni", { params }),
  getAlumniById: (id) => api.get(`/alumni/${id}`),
  updateProfile: (id, data) =>
    api.put(`/alumni/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  getStats: () => api.get("/alumni/stats"),
  getMapData: () => api.get("/alumni/map/data"),
  getBatches: () => api.get("/alumni/batches"),
  getByBatch: (params) => api.get("/alumni/batch-wise", { params }),
  // ✅ ALUMNI CHAPTERS API
  getChapters: (params) => api.get("/alumni/chapters", { params }),
  getChapter: (id) => api.get(`/alumni/chapters/${id}`),
  createChapter: (data) =>
    api.post("/alumni/chapters", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  updateChapter: (id, data) =>
    api.put(`/alumni/chapters/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  deleteChapter: (id) => api.delete(`/alumni/chapters/${id}`),
  joinChapter: (id) => api.post(`/alumni/chapters/${id}/join`),
  leaveChapter: (id) => api.delete(`/alumni/chapters/${id}/leave`),
  getChapterMembers: (id) => api.get(`/alumni/chapters/${id}/members`),
  // Search chapters by category
  getChaptersByCategory: (category, params) =>
    api.get(`/alumni/chapters/category/${category}`, { params }),

  // Get user's chapters (chapters I've joined)
  getMyChapters: () => api.get("/alumni/chapters/my-chapters"),
};

// ── ADMIN ────────────────────────────────────────────────────────
export const adminAPI = {
  // Dashboard stats
  getStats: () => api.get("/admin/dashboard/stats"),
  getAllAlumni: (params) => api.get("/admin/dashboard/alumni/all", { params }),
  // Alumni approval & management
  getPendingAlumni: () => api.get("/admin/pending"),
  approveAlumni: (id) => api.put(`/admin/approve/${id}`),
  rejectAlumni: (id) => api.put(`/admin/reject/${id}`),
  makeAlumniAdmin: (id) => api.put(`/admin/make-admin/${id}`),

  // Donations
  getAllDonations: () => api.get("/admin/dashboard/donations/all"),
};

// ── Events API ────────────────────────────────────────────────────────
export const eventsAPI = {
  getAll: (params) => api.get("/events", { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) =>
    api.post("/events", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  update: (id, data) =>
    api.put(`/events/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  delete: (id) => api.delete(`/events/${id}`),
};

// ── Albums API ────────────────────────────────────────────────────────
export const albumsAPI = {
  getAll: () => api.get("/albums"),
  getByYear: (year) => api.post(`/albums/${year}`),
  create: (data) =>
    api.post("/albums", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  update: (id, data) =>
    api.put(`/albums/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  delete: (id) => api.delete(`/albums/${id}`),
};

// ── NewsLetter API ────────────────────────────────────────────────────────
export const newsLetterAPI = {
  getAll: () => api.get("/newsletters"),
  getById: (id) => api.get(`/newsletters/${id}`),
  create: (data) =>
    api.post("/newsletters", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  update: (id, data) =>
    api.put(`/newsletters/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  delete: (id) => api.delete(`/newsletters/${id}`),
};

// ── Donation API ────────────────────────────────────────────────────────
export const donationAPI = {
  getAll: () => api.get("/donaions"),
  getMine: () => api.get("/donations/mine"),
  create: (data) => api.post("/donations", data),
};

// ── Donation API ────────────────────────────────────────────────────────
export const adminReportsAPI = {
  fetchAlumniDataByYear: () => api.get("/reports/alumni-data-by-year"),
  fetchEventsDataByMonth: () => api.get("/reports/events-data-by-month"),
};

// ── ✅ Notification API ───────────────────────────────────────────────
export const notificationAPI = {
  // Alumni: submit a new notification (with optional file attachment)
  submit: (data) =>
    api.post("/notifications", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Alumni: get approved notifications visible to me
  getMyNotifications: () => api.get("/notifications"),

  // Alumni: see my own submitted notifications (all statuses)
  getMySubmissions: () => api.get("/notifications/mine"),

  // Admin: get all notifications, optionally filter by status
  adminGetAll: (status) =>
    api.get("/notifications/admin/all", { params: status ? { status } : {} }),

  // Admin: approve
  adminApprove: (id, adminNote = "") =>
    api.put(`/notifications/admin/${id}/approve`, { adminNote }),

  // Admin: reject with reason
  adminReject: (id, reason) =>
    api.put(`/notifications/admin/${id}/reject`, { reason }),

  // Admin: delete
  adminDelete: (id) => api.delete(`/notifications/admin/${id}`),
};

export default api;
