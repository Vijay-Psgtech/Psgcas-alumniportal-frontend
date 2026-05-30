import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");

const stripApiSuffix = (url) => url.replace(/\/api\/?$/, "");

export const API_BASE = stripApiSuffix(
  import.meta.env.VITE_API_URL || "http://localhost:5000/api",
);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const message = error.response?.data?.message || error.message;

    console.error("API Error:", { status, url, message });

    if (status === 401) {
      window.dispatchEvent(new CustomEvent("auth:logout", { detail: { url } }));
    }

    if (status === 403) {
      window.dispatchEvent(new CustomEvent("auth:forbidden"));
    }

    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  register: (data) =>
    api.post("/auth/register", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  login: (data) => api.post("/auth/login", data),
  socialLogin: (data) => api.post("/auth/social-login", data),
  getProfile: () => api.get("/auth/profile"),
  changePassword: (currentPassword, newPassword) =>
    api.put("/auth/change-password", { currentPassword, newPassword }),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  verifyOtp: (email, otp) => api.post("/auth/verify-otp", { email, otp }),
  resetPassword: (email, otp, newPassword) =>
    api.post("/auth/reset-password", { email, otp, newPassword }),
};

// Banner Service
export const bannerService = {
  async getActiveBanner() {
    try {
      const response = await api.get("/banners/active");
      return { success: true, data: response.data?.data || response.data };
    } catch (error) {
      console.warn("Banner API Error:", error.message);
      return { success: false, data: null };
    }
  },

  async getAllBanners() {
    const response = await api.get("/banners");
    return response.data;
  },

  async createBanner(bannerData) {
    const response = await api.post("/banners", bannerData);
    return response.data;
  },

  async updateBanner(bannerData) {
    const bannerId = bannerData._id || bannerData.id;
    const response = await api.put(`/banners/${bannerId}`, bannerData);
    return response.data;
  },

  async deleteBanner(bannerId) {
    const response = await api.delete(`/banners/${bannerId}`);
    return response.data;
  },

  async setActiveBanner(bannerId) {
    const response = await api.patch(`/banners/${bannerId}/set-active`);
    return response.data;
  },
};

// Notification Scroll Service
export const notificationService = {
  async getActiveNotifications() {
    try {
      const response = await api.get("/notification-scrolls/active");
      return { success: true, data: response.data?.data || [] };
    } catch (error) {
      console.warn("Notifications API Error:", error.message);
      return { success: false, data: [] };
    }
  },

  async getAllNotifications() {
    const response = await api.get("/notification-scrolls");
    return response.data;
  },

  async getNotificationById(id) {
    const response = await api.get(`/notification-scrolls/${id}`);
    return response.data;
  },

  async createNotification(data) {
    const response = await api.post("/notification-scrolls", data);
    return response.data;
  },

  async updateNotification(id, data) {
    const response = await api.put(`/notification-scrolls/${id}`, data);
    return response.data;
  },

  async deleteNotification(id) {
    const response = await api.delete(`/notification-scrolls/${id}`);
    return response.data;
  },

  async toggleNotification(id) {
    const response = await api.patch(`/notification-scrolls/${id}/toggle-active`);
    return response.data;
  },

  async trackView(id) {
    try {
      const response = await api.patch(`/notification-scrolls/${id}/view`);
      return response.data;
    } catch (error) {
      console.warn("Failed to track notification view:", error.message);
      return null;
    }
  },

  async trackDismiss(id) {
    try {
      const response = await api.patch(`/notification-scrolls/${id}/dismiss`);
      return response.data;
    } catch (error) {
      console.warn("Failed to track notification dismiss:", error.message);
      return null;
    }
  },
};

// Campaign Service
export const campaignService = {
  getAll: (params = {}) => api.get("/campaigns", { params }),
  getById: (campaignId) => api.get(`/campaigns/${campaignId}`),
  create: (campaignData) => api.post("/campaigns", campaignData),
  update: (campaignId, campaignData) =>
    api.put(`/campaigns/${campaignId}`, campaignData),
  delete: (campaignId) => api.delete(`/campaigns/${campaignId}`),
  getResponses: (campaignId, params = {}) =>
    api.get(`/campaigns/${campaignId}/responses`, { params }),
  submitResponse: (campaignId, responseData) =>
    api.post(`/campaigns/${campaignId}/respond`, responseData),
  updateResponse: (_campaignId, responseId, responseData) =>
    api.put(`/campaigns/response/${responseId}/status`, responseData),
  deleteResponse: (responseId) => api.delete(`/campaigns/response/${responseId}`),
  publishResponse: (responseId, title) =>
    api.post(`/campaigns/response/${responseId}/publish`, { title }),
  exportResponses: (campaignId, params = {}) =>
    api.get(`/campaigns/${campaignId}/responses/export`, {
      params,
      responseType: "blob",
    }),
  getAnalytics: (campaignId) => api.get(`/campaigns/${campaignId}/analytics`),
};

export const campaignsAPI = campaignService;

// Alumni API
export const alumniAPI = {
  getAllAlumni: (params) => api.get("/alumni", { params }),
  getAlumniById: (id) => api.get(`/alumni/${id}`),
  updateProfile: (id, data) =>
    api.put(`/alumni/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getStats: (params) => api.get("/alumni/stats", { params }),
  getMapData: (params) => api.get("/alumni/map/data", { params }),
  getBatches: (params) => api.get("/alumni/batches", { params }),
  getByBatch: (params) => api.get("/alumni/batch-wise", { params }),

  getChapters: (params) => api.get("/alumni/chapters", { params }),
  getChapter: (id) => api.get(`/alumni/chapters/${id}`),
  createChapter: (data) =>
    api.post("/alumni/chapters", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateChapter: (id, data) =>
    api.put(`/alumni/chapters/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteChapter: (id) => api.delete(`/alumni/chapters/${id}`),
  joinChapter: (id) => api.post(`/alumni/chapters/${id}/join`),
  leaveChapter: (id) => api.delete(`/alumni/chapters/${id}/leave`),
  getChapterMembers: (id) => api.get(`/alumni/chapters/${id}/members`),
  getChaptersByCategory: (category, params) =>
    api.get(`/alumni/chapters/category/${category}`, { params }),
  getMyChapters: () => api.get("/alumni/chapters/my-chapters"),
};

// Departments API
export const departmentAPI = {
  getAll: (params) => api.get("/departments", { params }),
  getAllAdmin: (params) => api.get("/departments/admin/all", { params }),
  getById: (id) =>
    api.get("/departments/admin/all").then((response) => {
      const departments = response.data?.data?.departments || [];
      const department = departments.find((item) => item._id === id || item.id === id);

      return {
        ...response,
        data: {
          ...response.data,
          data: { department },
        },
      };
    }),
  getByType: (programmeType, fundingType) =>
    api.get(`/departments/${programmeType}/${fundingType}`),
  create: (data) => api.post("/departments", data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
  toggleStatus: (id) => api.patch(`/departments/${id}/toggle`),
  updateStatus: (id) => api.patch(`/departments/${id}/toggle`),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get("/admin/dashboard/stats"),
  getAllAlumni: (params) => api.get("/admin/dashboard/alumni/all", { params }),
  getPendingAlumni: () => api.get("/admin/pending"),
  approveAlumni: (id) => api.put(`/admin/approve/${id}`),
  rejectAlumni: (id) => api.put(`/admin/reject/${id}`),
  getAllDonations: () => api.get("/admin/dashboard/donations/all"),
};

// Events API
export const eventsAPI = {
  getAll: (params) => api.get("/events", { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) =>
    api.post("/events", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, data) =>
    api.put(`/events/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/events/${id}`),
};

// Albums API
export const albumsAPI = {
  getAll: () => api.get("/albums"),
  getByYear: (year) => api.get(`/albums/year/${year}`),
  create: (data) =>
    api.post("/albums", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, data) =>
    api.put(`/albums/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/albums/${id}`),
};

// Newsletter API
export const newsLetterAPI = {
  getAll: () => api.get("/newsletters"),
  getById: (id) => api.get(`/newsletters/${id}`),
  getByCategory: (category) => api.get(`/newsletters/category/${category}`),
  create: (data) =>
    api.post("/newsletters", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, data) =>
    api.put(`/newsletters/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/newsletters/${id}`),
};

// Donation API
export const donationAPI = {
  create: (data) => api.post("/donations", data),
  verifyRazorPay: (data) => api.post("/donations/verify-razorpay", data),
  getHistory: (params) => api.get("/donations/history", { params }),
  getStats: (params) => api.get("/donations/stats", { params }),
  getAll: () => api.get("/donations"),
  getById: (id) => api.get(`/donations/${id}`),
  update: (id, data) => api.put(`/donations/${id}`, data),
  updateStatus: (id, status) => api.put(`/donations/${id}/status`, { status }),
  flagDonation: (id, data) => api.put(`/donations/${id}/flag`, data),
  delete: (id) => api.delete(`/donations/${id}`),
};

// Admin Reports API
export const adminReportsAPI = {
  fetchAlumniDataByYear: () => api.get("/reports/alumni-data-by-year"),
  fetchAlumniDataByDepartment: () => api.get("/reports/alumni-data-by-department"),
};

// Alumni Notifications API
export const notificationAPI = {
  submit: (data) =>
    api.post("/notifications", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getMyNotifications: () => api.get("/notifications"),
  getMySubmissions: () => api.get("/notifications/mine"),
  adminGetAll: (status) =>
    api.get("/notifications/admin/all", { params: status ? { status } : {} }),
  adminApprove: (id, adminNote = "") =>
    api.put(`/notifications/admin/${id}/approve`, { adminNote }),
  adminReject: (id, reason) =>
    api.put(`/notifications/admin/${id}/reject`, { reason }),
  adminDelete: (id) => api.delete(`/notifications/admin/${id}`),
};

// Admin Users API
export const adminUsersAPI = {
  getAll: () => api.get("/users"),
  create: (data) => api.post("/users", data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default api;
