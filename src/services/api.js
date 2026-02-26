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

// ──────────────── Auth API ──────────────────────── //
export const authAPI = {
    register: (data) => api.post("/auth/register", data),
    login: (data) => api.post("/auth/login", data),
    getProfile: () => api.get("/auth/profile"),
    changePassword: (currentPassword, newPassword) => api.put("/auth/change-password", { currentPassword, newPassword }),
    forgotPassword: (email) => api.post("/auth/forgot-password", { email}),
    verifyOtp:      (email, otp)              => api.post("/auth/verify-otp", { email, otp }),
    resetPassword:  (email, otp, newPassword) => api.post("/auth/reset-password", { email, otp, newPassword }),
}


export default api;