import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// ✅ FIXED: Define API endpoints
const BANNER_API = `${API_BASE_URL}/banners`;
// ✅ IMPORTANT: Use /notification-scrolls for banner scrolling notifications
// NOT /notifications - that's for alumni notifications submission
const NOTIFICATION_SCROLL_API = `${API_BASE_URL}/notification-scrolls`;

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
  
  // ✅ NEW: Social Login (Google, Facebook)
  socialLogin: (data) => api.post("/auth/social-login", data),
  
  getProfile: () => api.get("/auth/profile"),
  changePassword: (currentPassword, newPassword) =>
    api.put("/auth/change-password", { currentPassword, newPassword }),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  verifyOtp: (email, otp) => api.post("/auth/verify-otp", { email, otp }),
  resetPassword: (email, otp, newPassword) =>
    api.post("/auth/reset-password", { email, otp, newPassword }),
};

// ✅ BANNER SERVICE - ONLY REAL DATA
export const bannerService = {
  async getActiveBanner() {
    try {
      const response = await fetch(`${BANNER_API}/active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });
 
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Banner fetched from API:', data);
        return { success: true, data: data.data || data };
      } else {
        console.warn('⚠️ Banner API returned status:', response.status);
        // ✅ NO MOCK DATA - return empty on error
        return { success: false, data: null };
      }
    } catch (error) {
      console.warn('⚠️ Banner API Error:', error.message);
      // ✅ NO MOCK DATA - return empty on error
      return { success: false, data: null };
    }
  },
 
  async updateBanner(bannerData) {
    try {
      const response = await api.put(`${BANNER_API}/${bannerData.id}`, bannerData);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update banner:', error.message);
      throw error;
    }
  },
 
  async createBanner(bannerData) {
    try {
      const response = await api.post(BANNER_API, bannerData);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create banner:', error.message);
      throw error;
    }
  },
 
  async deleteBanner(bannerId) {
    try {
      const response = await api.delete(`${BANNER_API}/${bannerId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to delete banner:', error.message);
      throw error;
    }
  },
 
  async setActiveBanner(bannerId) {
    try {
      const response = await api.patch(`${BANNER_API}/${bannerId}/set-active`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to set active banner:', error.message);
      throw error;
    }
  },
};

// ✅ NOTIFICATION SCROLL SERVICE - ONLY REAL DATA FROM ADMIN
export const notificationService = {
  // ✅ Get active notifications for banner display - ONLY REAL ADMIN DATA
  async getActiveNotifications() {
    try {
      const response = await fetch(`${NOTIFICATION_SCROLL_API}/active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });
 
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Real notifications fetched from API:', data);
        // ✅ ONLY REAL DATA - no mock fallback
        return { success: true, data: data.data || data || [] };
      } else {
        console.warn('⚠️ Notifications API returned status:', response.status);
        // ✅ NO MOCK DATA - return empty array
        return { success: false, data: [] };
      }
    } catch (error) {
      console.warn('⚠️ Notifications API Error:', error.message);
      // ✅ NO MOCK DATA - return empty array on error
      return { success: false, data: [] };
    }
  },
 
  // Get all notifications (admin)
  async getAllNotifications() {
    try {
      const response = await api.get(NOTIFICATION_SCROLL_API);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch notifications:', error.message);
      throw error;
    }
  },
 
  // Get single notification
  async getNotificationById(id) {
    try {
      const response = await api.get(`${NOTIFICATION_SCROLL_API}/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch notification:', error.message);
      throw error;
    }
  },
 
  // Create notification
  async createNotification(data) {
    try {
      const response = await api.post(NOTIFICATION_SCROLL_API, data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create notification:', error.message);
      throw error;
    }
  },
 
  // Update notification
  async updateNotification(id, data) {
    try {
      const response = await api.put(`${NOTIFICATION_SCROLL_API}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update notification:', error.message);
      throw error;
    }
  },
 
  // Delete notification
  async deleteNotification(id) {
    try {
      const response = await api.delete(`${NOTIFICATION_SCROLL_API}/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to delete notification:', error.message);
      throw error;
    }
  },
 
  // Toggle active status
  async toggleNotification(id) {
    try {
      const response = await api.patch(`${NOTIFICATION_SCROLL_API}/${id}/toggle-active`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to toggle notification:', error.message);
      throw error;
    }
  },
 
  // Track view
  async trackView(id) {
    try {
      const response = await api.patch(`${NOTIFICATION_SCROLL_API}/${id}/view`);
      return response.data;
    } catch (error) {
      console.error('⚠️ Failed to track view:', error.message);
    }
  },
 
  // Track dismiss
  async trackDismiss(id) {
    try {
      const response = await api.patch(`${NOTIFICATION_SCROLL_API}/${id}/dismiss`);
      return response.data;
    } catch (error) {
      console.error('⚠️ Failed to track dismiss:', error.message);
    }
  },
};

// ── CAMPAIGN SERVICE ───────────────────────────────────────────────────
export const campaignService = {
  // Fetch all campaigns
  getAll: (params = {}) => {
    console.log(`📤 Fetching all campaigns...`, params);
    return api
      .get("/campaigns", { params })
      .then((response) => {
        console.log("✅ Campaigns fetched successfully");
        return response;
      })
      .catch((error) => {
        console.error("❌ Failed to fetch campaigns:", error.message);
        throw error;
      });
  },

  // Fetch a single campaign
  getById: (campaignId) => {
    console.log(`📤 Fetching campaign ${campaignId}...`);
    return api
      .get(`/campaigns/${campaignId}`)
      .then((response) => {
        console.log(`✅ Campaign ${campaignId} fetched successfully`);
        return response;
      })
      .catch((error) => {
        console.error(
          `❌ Failed to fetch campaign ${campaignId}:`,
          error.message
        );
        throw error;
      });
  },

  // Create a new campaign
  create: (campaignData) => {
    console.log(`📤 Creating new campaign...`);
    return api
      .post("/campaigns", campaignData)
      .then((response) => {
        console.log("✅ Campaign created successfully");
        return response;
      })
      .catch((error) => {
        console.error("❌ Failed to create campaign:", error.message);
        throw error;
      });
  },

  // Update a campaign
  update: (campaignId, campaignData) => {
    console.log(`📤 Updating campaign ${campaignId}...`);
    return api
      .put(`/campaigns/${campaignId}`, campaignData)
      .then((response) => {
        console.log(`✅ Campaign ${campaignId} updated successfully`);
        return response;
      })
      .catch((error) => {
        console.error(
          `❌ Failed to update campaign ${campaignId}:`,
          error.message
        );
        throw error;
      });
  },

  // Delete a campaign
  delete: (campaignId) => {
    console.log(`📤 Deleting campaign ${campaignId}...`);
    return api
      .delete(`/campaigns/${campaignId}`)
      .then((response) => {
        console.log(`✅ Campaign ${campaignId} deleted successfully`);
        return response;
      })
      .catch((error) => {
        console.error(
          `❌ Failed to delete campaign ${campaignId}:`,
          error.message
        );
        throw error;
      });
  },

  // Get responses for a campaign
  getResponses: (campaignId, params = {}) => {
    console.log(
      `📤 Fetching responses for campaign ${campaignId}...`,
      params
    );
    return api
      .get(`/campaigns/${campaignId}/responses`, { params })
      .then((response) => {
        console.log(
          `✅ Responses for campaign ${campaignId} fetched successfully`
        );
        return response;
      })
      .catch((error) => {
        console.error(
          `❌ Failed to fetch responses for campaign ${campaignId}:`,
          error.message
        );
        throw error;
      });
  },

  // Submit a response
  submitResponse: (campaignId, responseData) => {
    console.log(`📤 Submitting response for campaign ${campaignId}...`);
    return api
      .post(`/campaigns/${campaignId}/responses`, responseData)
      .then((response) => {
        console.log(
          `✅ Response for campaign ${campaignId} submitted successfully`
        );
        return response;
      })
      .catch((error) => {
        console.error(
          `❌ Failed to submit response for campaign ${campaignId}:`,
          error.message
        );
        throw error;
      });
  },

  // Update a response
  updateResponse: (campaignId, responseId, responseData) => {
    console.log(
      `📤 Updating response ${responseId} for campaign ${campaignId}...`
    );
    return api
      .put(
        `/campaigns/${campaignId}/responses/${responseId}`,
        responseData
      )
      .then((response) => {
        console.log(
          `✅ Response ${responseId} for campaign ${campaignId} updated successfully`
        );
        return response;
      })
      .catch((error) => {
        console.error(
          `❌ Failed to update response ${responseId}:`,
          error.message
        );
        throw error;
      });
  },

  // Delete a response
  deleteResponse: (responseId) => {
    console.log(`📤 Deleting response ${responseId}...`);
    return api
      .delete(`/campaigns/response/${responseId}`)
      .then((response) => {
        console.log("✅ Response deleted successfully");
        return response;
      })
      .catch((error) => {
        console.error("❌ Failed to delete response:", error.message);
        throw error;
      });
  },

  // Export responses as CSV
  exportResponses: (campaignId, params = {}) => {
    console.log(`📥 Exporting responses for campaign ${campaignId}...`);
    return api
      .get(`/campaigns/${campaignId}/responses/export`, {
        params,
        responseType: "blob",
      })
      .catch((error) => {
        console.error("❌ Failed to export responses:", error.message);
        throw error;
      });
  },

  // Get campaign analytics
  getAnalytics: (campaignId) => {
    console.log(`📊 Fetching analytics for campaign ${campaignId}...`);
    return api
      .get(`/campaigns/${campaignId}/analytics`)
      .then((response) => {
        console.log("✅ Analytics fetched successfully");
        return response;
      })
      .catch((error) => {
        console.error("❌ Failed to fetch analytics:", error.message);
        throw error;
      });
  },
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
  getStats: (params) => api.get("/alumni/stats", { params }),
  getMapData: (params) => api.get("/alumni/map/data", { params }),
  getBatches: (params) => api.get("/alumni/batches", { params }),
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

// ── DEPARTMENTS API ──────────────────────────────────────────────
export const departmentAPI = {
  // Get all departments (admin view)
  getAllAdmin: (params) => api.get("/departments", { params }),
  
  // Get single department
  getById: (id) => api.get(`/departments/${id}`),
  
  // Create new department
  create: (data) => api.post("/departments", data),
  
  // Update department
  update: (id, data) => api.put(`/departments/${id}`, data),
  
  // Delete department
  delete: (id) => api.delete(`/departments/${id}`),
  
  // Toggle department status (active/inactive)
  updateStatus: (id, active) => api.patch(`/departments/${id}/status`, { active }),
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
  // 🔓 PUBLIC - Create new donation
  create: (data) => {
    console.log("📤 Creating donation...");
    return api.post("/donations", data);
  },

  // 🔓 PUBLIC - Verify Razorpay payment
  verifyRazorPay: (data) => {
    console.log("📤 Verifying Razorpay payment...");
    return api.post("/donations/verify-razorpay", data);
  },

  // 🔓 PUBLIC - Get donation history with filters (anyone can view)
  getHistory: (params) => {
    console.log("📡 Fetching donation history...", params);
    return api.get("/donations/history", { params });
  },

  // 🔓 PUBLIC - Get donation stats
  getStats: (params) => {
    console.log("📡 Fetching donation stats...");
    return api.get("/donations/stats", { params });
  },

  // 🔐 ADMIN - Get all donations
  getAll: () => {
    console.log("📡 Fetching all donations (admin)...");
    return api.get("/donations");
  },

  // 🔐 ADMIN - Get specific donation by ID
  getById: (id) => {
    console.log(`📡 Fetching donation ${id}...`);
    return api.get(`/donations/${id}`);
  },

  // 🔐 ADMIN - Update donation (notes, status, flags)
  update: (id, data) => {
    console.log(`📤 Updating donation ${id}...`);
    return api.put(`/donations/${id}`, data);
  },

  // 🔐 ADMIN - Update donation status
  updateStatus: (id, status) => {
    console.log(`📤 Updating donation ${id} status to ${status}...`);
    return api.put(`/donations/${id}/status`, { status });
  },

  // 🔐 ADMIN - Flag/Unflag donation
  flagDonation: (id, data) => {
    console.log(`📤 Updating flag status for donation ${id}...`);
    return api.put(`/donations/${id}/flag`, data);
  },

  // 🔐 ADMIN - Delete donation
  delete: (id) => {
    console.log(`📤 Deleting donation ${id}...`);
    return api.delete(`/donations/${id}`);
  },
};

// ── Admin Reports API ────────────────────────────────────────────────────────
export const adminReportsAPI = {
  fetchAlumniDataByYear: () => api.get("/reports/alumni-data-by-year"),
  fetchEventsDataByMonth: () => api.get("/reports/events-data-by-month"),
  fetchAlumniDataByDepartment: () =>
    api.get("/reports/alumni-data-by-department"),
};

// ── ✅ Notification API (Alumni Notifications) ───────────────────────────────────────────────
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

// ──────── ADMIN USERS API ──────────────────────────────────────────────────────
export const adminUsersAPI = {
  getAll: () => api.get("/users"),
  create: (data) => api.post("/users", data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default api;