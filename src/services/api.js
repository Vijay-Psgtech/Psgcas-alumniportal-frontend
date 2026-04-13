import axios from "axios";

// ────────────────────────────────────────────────────────────────────────────
// API CONFIGURATION
// ────────────────────────────────────────────────────────────────────────────

// Get API base URL from environment, with fallback to localhost
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

console.log("🔌 API Base URL:", API_BASE_URL);

// ────────────────────────────────────────────────────────────────────────────
// AXIOS INSTANCE
// ────────────────────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: true,
});

// ────────────────────────────────────────────────────────────────────────────
// RESPONSE INTERCEPTOR — Handle errors globally
// ────────────────────────────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const message = error.response?.data?.message || error.message;

    console.error("❌ API Error:", { status, url, message });

    // Handle 401 Unauthorized
    if (status === 401) {
      // Cookie is already expired/invalid on the server side.
      // Dispatch event so AuthContext / protected routes can react.
      window.dispatchEvent(
        new CustomEvent("auth:logout", { detail: { url } })
      );
    }

    // Handle 403 Forbidden
    if (status === 403) {
      window.dispatchEvent(new CustomEvent("auth:forbidden"));
    }

    // Handle network errors
    if (error.code === "ECONNABORTED") {
      console.error("❌ Request timeout - server not responding");
    }

    if (error.code === "ERR_NETWORK") {
      console.error(
        "❌ Network error - cannot connect to",
        API_BASE_URL
      );
    }

    return Promise.reject(error);
  }
);

// ────────────────────────────────────────────────────────────────────────────
// EXPORT API BASE URL
// ────────────────────────────────────────────────────────────────────────────

// FIX: Add proper fallback for API_BASE
const getAPIBase = () => {
  const url = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || API_BASE_URL;
  if (!url || url === "http://localhost:5000/api") {
    return "http://localhost:5000";
  }
  return url.replace("/api", "");
};

export const API_BASE = getAPIBase();

// ────────────────────────────────────────────────────────────────────────────
// AUTH API
// ────────────────────────────────────────────────────────────────────────────

export const authAPI = {
  // Register new alumni
  register: (data) =>
    api.post("/auth/register", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Login with email and password
  login: (data) => api.post("/auth/login", data),

  // Get current user profile
  getProfile: () => api.get("/auth/profile"),

  // Change password
  changePassword: (currentPassword, newPassword) =>
    api.put("/auth/change-password", {
      currentPassword,
      newPassword,
    }),

  // Forgot password - request OTP
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),

  // Verify OTP
  verifyOtp: (email, otp) => api.post("/auth/verify-otp", { email, otp }),

  // Reset password with OTP
  resetPassword: (email, otp, newPassword) =>
    api.post("/auth/reset-password", { email, otp, newPassword }),
};

// ────────────────────────────────────────────────────────────────────────────
// ✅ DEPARTMENTS API - DYNAMIC DEPARTMENTS MANAGEMENT
// ────────────────────────────────────────────────────────────────────────────
 
export const departmentAPI = {
  // Get all active departments (PUBLIC)
  getAll: () => {
    console.log("📡 Fetching all active departments...");
    return api.get("/departments");
  },
 
  // Get departments by programme type and funding type (PUBLIC)
  getByType: (programmeType, fundingType) => {
    console.log(`📡 Fetching departments (${programmeType}, ${fundingType})...`);
    return api.get(`/departments/${programmeType}/${fundingType}`);
  },
 
  // Get all departments including inactive (ADMIN ONLY)
  getAllAdmin: () => {
    console.log("📡 Fetching all departments (admin)...");
    return api.get("/departments/admin/all");
  },
 
  // Create new department (ADMIN ONLY)
  create: (data) => {
    console.log("📤 Creating department:", data);
    return api.post("/departments", data).then((response) => {
      console.log("✅ Department created:", response.data);
      return response;
    }).catch((error) => {
      console.error("❌ Department creation failed:", error.response?.data || error.message);
      throw error;
    });
  },
 
  // Update department (ADMIN ONLY)
  update: (id, data) => {
    console.log(`📤 Updating department ${id}:`, data);
    return api.put(`/departments/${id}`, data).then((response) => {
      console.log("✅ Department updated:", response.data);
      return response;
    }).catch((error) => {
      console.error("❌ Department update failed:", error.response?.data || error.message);
      throw error;
    });
  },
 
  // Delete department (ADMIN ONLY)
  delete: (id) => {
    console.log(`📤 Deleting department ${id}...`);
    return api.delete(`/departments/${id}`).then((response) => {
      console.log("✅ Department deleted:", response.data);
      return response;
    }).catch((error) => {
      console.error("❌ Department deletion failed:", error.response?.data || error.message);
      throw error;
    });
  },
 
  // Toggle department active/inactive status (ADMIN ONLY)
  toggleStatus: (id) => {
    console.log(`📤 Toggling status for department ${id}...`);
    return api.patch(`/departments/${id}/toggle`).then((response) => {
      console.log("✅ Department status toggled:", response.data);
      return response;
    }).catch((error) => {
      console.error("❌ Status toggle failed:", error.response?.data || error.message);
      throw error;
    });
  },
};

// ────────────────────────────────────────────────────────────────────────────
// ALUMNI API
// ────────────────────────────────────────────────────────────────────────────

export const alumniAPI = {
  // Get all alumni
  getAllAlumni: (params) => api.get("/alumni", { params }),

  // Get alumni by ID
  getAlumniById: (id) => api.get(`/alumni/${id}`),

  // Update alumni profile
  updateProfile: (id, data) =>
    api.put(`/alumni/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Get alumni statistics
  getStats: () => api.get("/alumni/stats"),

  // Get map data for alumni locations
  getMapData: () => api.get("/alumni/map/data"),

  // Get all batch years
  getBatches: () => api.get("/alumni/batches"),

  // Get alumni by batch year
  getByBatch: (params) => api.get("/alumni/batch-wise", { params }),

  // ✅ ALUMNI CHAPTERS API
  // Get all chapters
  getChapters: (params) => api.get("/alumni/chapters", { params }),

  // Get specific chapter details
  getChapter: (id) => api.get(`/alumni/chapters/${id}`),

  // Create new chapter
  createChapter: (data) =>
    api.post("/alumni/chapters", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Update chapter
  updateChapter: (id, data) =>
    api.put(`/alumni/chapters/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Delete chapter
  deleteChapter: (id) => api.delete(`/alumni/chapters/${id}`),

  // Join a chapter
  joinChapter: (id) => api.post(`/alumni/chapters/${id}/join`),

  // Leave a chapter
  leaveChapter: (id) => api.delete(`/alumni/chapters/${id}/leave`),

  // Get chapter members
  getChapterMembers: (id) => api.get(`/alumni/chapters/${id}/members`),

  // Search chapters by category
  getChaptersByCategory: (category, params) =>
    api.get(`/alumni/chapters/category/${category}`, { params }),

  // Get user's chapters (chapters I've joined)
  getMyChapters: () => api.get("/alumni/chapters/my-chapters"),
};

// ────────────────────────────────────────────────────────────────────────────
// ADMIN API
// ────────────────────────────────────────────────────────────────────────────

export const adminAPI = {
  // Dashboard statistics
  getStats: () => api.get("/admin/dashboard/stats"),

  // Get all alumni
  getAllAlumni: () => api.get("/admin/dashboard/alumni/all"),

  // Get pending alumni approvals
  getPendingAlumni: () => api.get("/admin/pending"),

  // Approve alumni
  approveAlumni: (id) => api.put(`/admin/approve/${id}`),

  // Reject alumni
  rejectAlumni: (id) => api.put(`/admin/reject/${id}`),

  // Make alumni an admin
  makeAlumniAdmin: (id) => api.put(`/admin/make-admin/${id}`),

  // Get all donations
  getAllDonations: () => api.get("/admin/dashboard/donations/all"),
};


// ────────────────────────────────────────────────────────────────────────────
// SUB ADMIN API 
//

export const subAdminAPI = {
  // ── SUPER ADMIN: Manage sub-admins ──
  getAll: () => api.get("/sub-admin/all"),
  create: (data) => api.post("/sub-admin/create", data),
  promote: (alumniId, data) => api.put(`/sub-admin/promote/${alumniId}`, data),
  update: (id, data) => api.put(`/sub-admin/${id}`, data),
  revoke: (id) => api.delete(`/sub-admin/${id}`),
 
  // ── SUB-ADMIN: Scoped department operations ──
  getDepartmentStats: () => api.get("/sub-admin/my-department/stats"),
  getDepartmentAlumni: (status = "all") =>
    api.get("/sub-admin/my-department/alumni", { params: { status } }),
  getDepartmentAlumniById: (alumniId) =>
    api.get(`/sub-admin/my-department/alumni/${alumniId}`),
  approve: (alumniId) =>
    api.put(`/sub-admin/my-department/alumni/${alumniId}/approve`),
  reject: (alumniId) =>
    api.delete(`/sub-admin/my-department/alumni/${alumniId}/reject`),
};



// ────────────────────────────────────────────────────────────────────────────
// EVENTS API
// ────────────────────────────────────────────────────────────────────────────

export const eventsAPI = {
  // Get all events with optional filters
  getAll: (params) => api.get("/events", { params }),

  // Get event by ID
  getById: (id) => api.get(`/events/${id}`),

  // Create new event
  create: (data) =>
    api.post("/events", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Update event
  update: (id, data) =>
    api.put(`/events/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Delete event
  delete: (id) => api.delete(`/events/${id}`),
};

// ────────────────────────────────────────────────────────────────────────────
// ALBUMS API
// ────────────────────────────────────────────────────────────────────────────

export const albumsAPI = {
  // Get all albums
  getAll: () => api.get("/albums"),

  // Get albums by year
  getByYear: (year) => api.post(`/albums/${year}`),

  // Create new album
  create: (data) =>
    api.post("/albums", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Update album
  update: (id, data) =>
    api.put(`/albums/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Delete album
  delete: (id) => api.delete(`/albums/${id}`),
};

// ────────────────────────────────────────────────────────────────────────────
// NEWSLETTER API
// ────────────────────────────────────────────────────────────────────────────

export const newsLetterAPI = {
  // Get all newsletters
  getAll: () => api.get("/newsletters"),

  // Get newsletter by ID
  getById: (id) => api.get(`/newsletters/${id}`),

  // Create new newsletter
  create: (data) =>
    api.post("/newsletters", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Update newsletter
  update: (id, data) =>
    api.put(`/newsletters/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Delete newsletter
  delete: (id) => api.delete(`/newsletters/${id}`),
};

// ────────────────────────────────────────────────────────────────────────────
// DONATION API
// ────────────────────────────────────────────────────────────────────────────

export const donationAPI = {
  // Get all donations (admin)
  getAll: () => api.get("/donations"),

  // Get my donations
  getMine: () => api.get("/donations/mine"),

  // Create new donation
  create: (data) => api.post("/donations", data),
};

// ────────────────────────────────────────────────────────────────────────────
// ADMIN REPORTS API
// ────────────────────────────────────────────────────────────────────────────

export const adminReportsAPI = {
  // Get alumni data grouped by year
  fetchAlumniDataByYear: () => api.get("/reports/alumni-data-by-year"),

  // Get events data grouped by month
  fetchEventsDataByMonth: () => api.get("/reports/events-data-by-month"),
};

// ────────────────────────────────────────────────────────────────────────────
// NOTIFICATION API
// ────────────────────────────────────────────────────────────────────────────

export const notificationAPI = {
  // Alumni: Submit a new notification (with optional file attachment)
  submit: (data) => api.post("/notifications", data),

  // Alumni: Get approved notifications visible to me
  getMyNotifications: () => api.get("/notifications"),

  // Alumni: Get my own submitted notifications (all statuses)
  getMySubmissions: () => api.get("/notifications/mine"),

  // Admin: Get all notifications, optionally filter by status
  adminGetAll: (status) =>
    api.get("/notifications/admin/all", {
      params: status ? { status } : {},
    }),

  // Admin: Approve notification
  adminApprove: (id, adminNote = "") =>
    api.put(`/notifications/admin/${id}/approve`, { adminNote }),

  // Admin: Reject notification with reason
  adminReject: (id, reason) =>
    api.put(`/notifications/admin/${id}/reject`, { reason }),

  // Admin: Delete notification
  adminDelete: (id) => api.delete(`/notifications/admin/${id}`),
};

// ────────────────────────────────────────────────────────────────────────────
// EXPORT DEFAULT API INSTANCE
// ────────────────────────────────────────────────────────────────────────────

export default api;