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
  getAllAlumni: () => api.get("/alumni"),
  getAlumniById: (id) => api.get(`/alumni/${id}`),
  updateProfile: (id, data) =>
    api.put(`/alumni/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  getStats: () => api.get("/alumni/stats/get-stats"),
  getMapData: () => api.get("/alumni/map/data"),
};

// ── ADMIN ────────────────────────────────────────────────────────
export const adminAPI = {
  // Dashboard stats
  getStats: () => api.get("/admin/dashboard/stats"),
  getAllAlumni: () => api.get("/admin/dashboard/alumni/all"),

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
  create: (data) => api.post("/albums", data),
  update: (id, data) => api.put(`/albums/${id}`, data),
  delete: (id) => api.delete(`/albums/${id}`),
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

export default api;
