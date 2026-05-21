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

const mockNotifications = [
  {
    id: "1",
    type: "success",
    title: "Welcome to PSG Alumni!",
    message: "Join 12K+ alumni members connecting across 35+ countries.",
  },
  {
    id: "2",
    type: "info",
    title: "Upcoming Event",
    message: "Join our networking session next month - early bird registration open!",
  },
  {
    id: "3",
    type: "warning",
    title: "Limited Spots Available",
    message: "Only 50 seats left for the Global Summit 2024. Register now!",
  },
  {
    id: "4",
    type: "trending",
    title: "Featured Alumni Story",
    message: "Read how our alumni members are making impact globally",
  },
];

const mockBannerData = {
  id: "default-banner",
  title: "Connect, Grow & Lead Together",
  description:
    "Join an exclusive global community where PSG Arts alumni collaborate, mentor, and create opportunities for lifelong success.",
  subtitle: "Welcome to Excellence",
  backgroundImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&h=900&fit=crop",
  features: [
    { icon: "Users", text: "12K+ Alumni Connected" },
    { icon: "Globe", text: "35+ Countries" },
    { icon: "Sparkles", text: "200+ Annual Events" },
  ],
  primaryButtonText: "Join Now",
  secondaryButtonText: "Learn More",
  isActive: true,
  updatedAt: new Date().toISOString(),
};

const CACHE_PREFIX = 'psg_alumni_';
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes



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

export const cacheService = {
  /**
   * Get cached data by key
   * @param {string} key - Cache key
   * @returns {any|null} - Cached data or null if expired/not found
   */
  get(key) {
    try {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      const cached = localStorage.getItem(cacheKey);

      if (!cached) return null;

      const { data, timestamp, duration } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > duration;

      if (isExpired) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  /**
   * Set cache data
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} duration - Cache duration in milliseconds (default: 5 min)
   * @returns {boolean} - Success status
   */
  set(key, data, duration = DEFAULT_CACHE_DURATION) {
    try {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      const cacheData = {
        data,
        timestamp: Date.now(),
        duration,
      };

      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  },

  /**
   * Clear cache by key
   * @param {string} key - Cache key
   * @returns {boolean} - Success status
   */
  clear(key) {
    try {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      localStorage.removeItem(cacheKey);
      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  },

  /**
   * Clear all cached data
   * @returns {boolean} - Success status
   */
  clearAll() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Cache clear all error:', error);
      return false;
    }
  },

  /**
   * Check if cache exists and is valid
   * @param {string} key - Cache key
   * @returns {boolean} - Cache validity status
   */
  has(key) {
    return this.get(key) !== null;
  },

  /**
   * Get all cached data
   * @returns {Object} - All cached data
   */
  getAll() {
    try {
      const result = {};
      const keys = Object.keys(localStorage);

      keys.forEach((key) => {
        if (key.startsWith(CACHE_PREFIX)) {
          const cleanKey = key.replace(CACHE_PREFIX, '');
          const data = this.get(cleanKey);
          if (data) {
            result[cleanKey] = data;
          }
        }
      });

      return result;
    } catch (error) {
      console.error('Cache get all error:', error);
      return {};
    }
  },
};

// ✅ BANNER SERVICE
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
        console.warn('⚠️ Banner API returned:', response.status);
        return { success: false, data: mockBannerData };
      }
    } catch (error) {
      console.warn('⚠️ Banner API Error - using mock data:', error.message);
      return { success: false, data: mockBannerData };
    }
  },

  async updateBanner(bannerData) {
    try {
      const response = await fetch(`${BANNER_API}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bannerData),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      }
      return { success: false, error: 'Failed to update banner' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// ✅ NOTIFICATION SCROLL SERVICE (for banner scrolling notifications)
export const notificationService = {
  async getActiveNotifications() {
    try {
      console.log('📡 Fetching notifications from:', NOTIFICATION_SCROLL_API + '/active');
      
      const response = await fetch(`${NOTIFICATION_SCROLL_API}/active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Notifications fetched from API:', data);
        // Handle both wrapped and unwrapped response
        const notificationData = data.data || data;
        return { success: true, data: Array.isArray(notificationData) ? notificationData : [notificationData] };
      } else {
        console.warn('⚠️ Notification API returned:', response.status);
        return { success: false, data: mockNotifications };
      }
    } catch (error) {
      console.warn('⚠️ Notification API Error - using mock data:', error.message);
      return { success: false, data: mockNotifications };
    }
  },

  async createNotification(notificationData) {
    try {
      const response = await fetch(`${NOTIFICATION_SCROLL_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      }
      return { success: false, error: 'Failed to create notification' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async updateNotification(id, notificationData) {
    try {
      const response = await fetch(`${NOTIFICATION_SCROLL_API}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      }
      return { success: false, error: 'Failed to update notification' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async deleteNotification(id) {
    try {
      const response = await fetch(`${NOTIFICATION_SCROLL_API}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return { success: true };
      }
      return { success: false, error: 'Failed to delete notification' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
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
    console.log(
      `📡 Fetching departments (${programmeType}, ${fundingType})...`,
    );
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
    return api
      .post("/departments", data)
      .then((response) => {
        console.log("✅ Department created:", response.data);
        return response;
      })
      .catch((error) => {
        console.error(
          "❌ Department creation failed:",
          error.response?.data || error.message,
        );
        throw error;
      });
  },

  // Update department (ADMIN ONLY)
  update: (id, data) => {
    console.log(`📤 Updating department ${id}:`, data);
    return api
      .put(`/departments/${id}`, data)
      .then((response) => {
        console.log("✅ Department updated:", response.data);
        return response;
      })
      .catch((error) => {
        console.error(
          "❌ Department update failed:",
          error.response?.data || error.message,
        );
        throw error;
      });
  },

  // Delete department (ADMIN ONLY)
  delete: (id) => {
    console.log(`📤 Deleting department ${id}...`);
    return api
      .delete(`/departments/${id}`)
      .then((response) => {
        console.log("✅ Department deleted:", response.data);
        return response;
      })
      .catch((error) => {
        console.error(
          "❌ Department deletion failed:",
          error.response?.data || error.message,
        );
        throw error;
      });
  },

  // Toggle department active/inactive status (ADMIN ONLY)
  toggleStatus: (id) => {
    console.log(`📤 Toggling status for department ${id}...`);
    return api
      .patch(`/departments/${id}/toggle`)
      .then((response) => {
        console.log("✅ Department status toggled:", response.data);
        return response;
      })
      .catch((error) => {
        console.error(
          "❌ Status toggle failed:",
          error.response?.data || error.message,
        );
        throw error;
      });
  },
};

// ────────────────────────────────────────────────────────────────────────────
// ✅ CAMPAIGNS API - CAMPAIGN MANAGEMENT & RESPONSES
// ────────────────────────────────────────────────────────────────────────────
export const campaignsAPI = {
  // Get all campaigns
  getAll: (params) => {
    console.log("📡 Fetching all campaigns...");
    return api.get("/campaigns", { params }).catch((error) => {
      console.error("❌ Failed to fetch campaigns:", error.message);
      throw error;
    });
  },

  // Get single campaign by ID
  getById: (id) => {
    console.log(`📡 Fetching campaign ${id}...`);
    return api.get(`/campaigns/${id}`).catch((error) => {
      console.error(`❌ Failed to fetch campaign ${id}:`, error.message);
      throw error;
    });
  },

  // Create new campaign
  create: (data) => {
    console.log("📤 Creating campaign...", data.title);
    return api
      .post("/campaigns", data)
      .then((response) => {
        console.log("✅ Campaign created:", response.data.campaignId);
        return response;
      })
      .catch((error) => {
        console.error("❌ Campaign creation failed:", error.message);
        throw error;
      });
  },

  // Update campaign
  update: (id, data) => {
    console.log(`📤 Updating campaign ${id}...`);
    return api
      .put(`/campaigns/${id}`, data)
      .then((response) => {
        console.log("✅ Campaign updated:", id);
        return response;
      })
      .catch((error) => {
        console.error(`❌ Campaign update failed:`, error.message);
        throw error;
      });
  },

  // Delete campaign
  delete: (id) => {
    console.log(`📤 Deleting campaign ${id}...`);
    return api
      .delete(`/campaigns/${id}`)
      .then((response) => {
        console.log("✅ Campaign deleted:", id);
        return response;
      })
      .catch((error) => {
        console.error(`❌ Campaign deletion failed:`, error.message);
        throw error;
      });
  },

  // ── CAMPAIGN RESPONSES ──

  // Submit response to campaign
  submitResponse: (campaignId, data) => {
    console.log(`📤 Submitting response to campaign ${campaignId}...`);
    return api
      .post(`/campaigns/${campaignId}/respond`, data)
      .then((response) => {
        console.log("✅ Response submitted successfully");
        return response;
      })
      .catch((error) => {
        console.error("❌ Failed to submit response:", error.message);
        throw error;
      });
  },

  // Get all responses for a campaign
  getResponses: (campaignId, params = {}) => {
    console.log(`📡 Fetching responses for campaign ${campaignId}...`, params);
    return api
      .get(`/campaigns/${campaignId}/responses`, { params })
      .then((response) => {
        console.log(
          `✅ Fetched ${response.data.count || 0} responses from campaign`,
        );
        return response;
      })
      .catch((error) => {
        console.error(
          `❌ Failed to fetch responses for campaign ${campaignId}:`,
          error.message,
        );
        throw error;
      });
  },

  // Get single response
  getResponse: (responseId) => {
    console.log(`📡 Fetching response ${responseId}...`);
    return api.get(`/campaigns/response/${responseId}`).catch((error) => {
      console.error(`❌ Failed to fetch response:`, error.message);
      throw error;
    });
  },

  // Update response status
  updateResponseStatus: (responseId, data) => {
    console.log(`📤 Updating response ${responseId} status...`);
    return api
      .put(`/campaigns/response/${responseId}/status`, data)
      .then((response) => {
        console.log("✅ Response status updated");
        return response;
      })
      .catch((error) => {
        console.error("❌ Failed to update response status:", error.message);
        throw error;
      });
  },

  // Publish response as story
  publishResponse: (responseId, title) => {
    console.log(`📤 Publishing response ${responseId} as story...`);
    return api
      .post(`/campaigns/response/${responseId}/publish`, { title })
      .then((response) => {
        console.log("✅ Response published successfully");
        return response;
      })
      .catch((error) => {
        console.error("❌ Failed to publish response:", error.message);
        throw error;
      });
  },

  // Delete response
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
  getFilters: () => api.get("/alumni/filters"),

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

// ──────────── Contact API ──────────────────────────────────────────────────────
export const contactAPI = {
  submitMessage: (data) =>
    api.post("/contact", data),
};

export default api;