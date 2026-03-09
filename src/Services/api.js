// src/Services/api.js - UPDATED VERSION
// ✅ All alumni endpoints
// ✅ Authentication endpoints
// ✅ Donation endpoints
// ✅ Admin endpoints
// ✅ Proper error handling (including 401)
// ✅ Auto token injection with interceptors

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('🔧 API Service initializing...');
console.log(`📍 API Base URL: ${API_BASE}`);

// ═══════════════════════════════════════════════════════════════════════════════
// ✅ CREATE AXIOS INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('✅ Axios instance created');

// ═══════════════════════════════════════════════════════════════════════════════
// ✅ REQUEST INTERCEPTOR - Add token to every request
// ═══════════════════════════════════════════════════════════════════════════════

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`✅ Token added to ${config.method?.toUpperCase()} ${config.url}`);
      } else {
        console.warn(`⚠️ No token for ${config.method?.toUpperCase()} ${config.url}`);
      }
      
      return config;
    } catch (error) {
      console.error('❌ Request interceptor error:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

console.log('✅ Request interceptor configured');

// ═══════════════════════════════════════════════════════════════════════════════
// ✅ RESPONSE INTERCEPTOR - Handle errors & token expiry
// ═══════════════════════════════════════════════════════════════════════════════

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    // Log all errors for debugging
    if (error.response) {
      console.error(`❌ API Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error('❌ No response from API:', error.request);
    } else {
      console.error('❌ Error:', error.message);
    }

    // ✅ Handle 401 - Token invalid or expired
    if (error.response?.status === 401) {
      console.error('🔐 Token invalid or expired - logging out');
      
      // Clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('alumniUser');
      localStorage.removeItem('loginMethod');
      
      // Clear axios headers
      delete axiosInstance.defaults.headers.common['Authorization'];
      
      // Redirect to login
      if (window.location.pathname !== '/admin/login') {
        console.log('🔄 Redirecting to login...');
        window.location.href = '/admin/login';
      }
      
      return Promise.reject(error);
    }

    // ✅ Handle 400 - Bad request
    if (error.response?.status === 400) {
      console.error('❌ Bad request:', error.response?.data?.message || 'Invalid request');
      return Promise.reject(error);
    }

    // ✅ Handle 403 - Forbidden
    if (error.response?.status === 403) {
      console.error('🚫 Forbidden:', error.response?.data?.message || 'Access denied');
      return Promise.reject(error);
    }

    // ✅ Handle 500 - Server error
    if (error.response?.status === 500) {
      console.error('💥 Server error:', error.response?.data?.message || 'Internal server error');
      return Promise.reject(error);
    }

    // ✅ Handle network errors
    if (error.message === 'Network Error' || !error.response) {
      console.error('🌐 Network error - backend not responding');
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

console.log('✅ Response interceptor configured');

// ═══════════════════════════════════════════════════════════════════════════════
// ✅ ALUMNI API ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

export const alumniAPI = {
  // Get all alumni for directory
  getAllAlumni: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/api/alumni', { params });
      return response;
    } catch (error) {
      console.error('Error fetching all alumni:', error);
      throw error;
    }
  },

  // Get single alumni by ID
  getAlumniById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/alumni/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching alumni:', error);
      throw error;
    }
  },

  // Get notable/distinguished alumni
  getNotableAlumni: async () => {
    try {
      const response = await axiosInstance.get('/api/alumni/notable');
      return response;
    } catch (error) {
      console.error('Error fetching notable alumni:', error);
      throw error;
    }
  },

  // Get alumni with map data (coordinates)
  getMapData: async () => {
    try {
      const response = await axiosInstance.get('/api/alumni/map');
      return response;
    } catch (error) {
      console.error('Error fetching map data:', error);
      throw error;
    }
  },

  // Search alumni by name, email, or company
  searchAlumni: async (query) => {
    try {
      const response = await axiosInstance.get('/api/alumni/search', {
        params: { q: query },
      });
      return response;
    } catch (error) {
      console.error('Error searching alumni:', error);
      throw error;
    }
  },

  // Filter alumni by department
  getByDepartment: async (department) => {
    try {
      const response = await axiosInstance.get('/api/alumni/department', {
        params: { dept: department },
      });
      return response;
    } catch (error) {
      console.error('Error fetching alumni by department:', error);
      throw error;
    }
  },

  // Filter alumni by graduation year
  getByYear: async (year) => {
    try {
      const response = await axiosInstance.get('/api/alumni/year', {
        params: { year },
      });
      return response;
    } catch (error) {
      console.error('Error fetching alumni by year:', error);
      throw error;
    }
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ✅ AUTHENTICATION API ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

export const authAPI = {
  // Register new alumni
  register: async (userData) => {
    try {
      console.log('📝 Registering new alumni:', userData.email);
      const response = await axiosInstance.post('/api/auth/register', userData);
      return response;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },

  // Login ✅ FIXED: Now returns response with token & alumni
  login: async (email, password) => {
    try {
      console.log('🔐 Logging in:', email);
      const response = await axiosInstance.post('/api/auth/login', {
        email: email.trim(),
        password,
      });

      console.log('✅ Login successful');

      if (response.data.token) {
        console.log('✅ Token saved to localStorage');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('alumniUser', JSON.stringify(response.data.alumni));
        
        // Set default header for future requests
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }

      return response;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      console.log('👤 Fetching user profile');
      const response = await axiosInstance.get('/api/auth/profile');
      console.log('✅ Profile fetched successfully');
      return response;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    try {
      console.log('✏️ Updating profile');
      const response = await axiosInstance.put('/api/auth/profile', profileData);
      return response;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Logout
  logout: () => {
    console.log('👋 Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('alumniUser');
    localStorage.removeItem('loginMethod');
    delete axiosInstance.defaults.headers.common['Authorization'];
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ✅ DONATION API ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

export const donationAPI = {
  // Create donation
  createDonation: async (donationData) => {
    try {
      console.log('💰 Creating donation');
      const response = await axiosInstance.post('/api/donations', donationData);
      return response;
    } catch (error) {
      console.error('Error creating donation:', error);
      throw error;
    }
  },

  // Get all donations (admin)
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/api/donations');
      return response;
    } catch (error) {
      console.error('Error fetching donations:', error);
      throw error;
    }
  },

  // Get user's donations
  getMyDonations: async () => {
    try {
      const response = await axiosInstance.get('/api/donations/my-donations');
      return response;
    } catch (error) {
      console.error('Error fetching donations:', error);
      throw error;
    }
  },

  // Get single donation
  getDonation: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/donations/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching donation:', error);
      throw error;
    }
  },

  // Update donation (admin)
  updateDonation: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/api/donations/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error updating donation:', error);
      throw error;
    }
  },

  // Delete donation (admin)
  deleteDonation: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/donations/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting donation:', error);
      throw error;
    }
  },

  // Get donation statistics
  getDonationStats: async () => {
    try {
      const response = await axiosInstance.get('/api/donations/stats/all');
      return response;
    } catch (error) {
      console.error('Error fetching donation stats:', error);
      throw error;
    }
  },

  // Issue certificate
  issueCertificate: async (id) => {
    try {
      const response = await axiosInstance.post(`/api/donations/${id}/certificate`);
      return response;
    } catch (error) {
      console.error('Error issuing certificate:', error);
      throw error;
    }
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ✅ ADMIN API ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

export const adminAPI = {
  // Get dashboard statistics
  getStats: async () => {
    try {
      const response = await axiosInstance.get('/api/admin/stats');
      return response;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  },

  // Get all alumni (admin)
  getAllAlumni: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/api/admin/alumni', { params });
      return response;
    } catch (error) {
      console.error('Error fetching alumni:', error);
      throw error;
    }
  },

  // Approve alumni
  approveAlumni: async (id) => {
    try {
      const response = await axiosInstance.put(`/api/admin/alumni/${id}/approve`);
      return response;
    } catch (error) {
      console.error('Error approving alumni:', error);
      throw error;
    }
  },

  // Make alumni admin
  makeAlumniAdmin: async (id) => {
    try {
      const response = await axiosInstance.put(`/api/admin/alumni/${id}/make-admin`);
      return response;
    } catch (error) {
      console.error('Error making alumni admin:', error);
      throw error;
    }
  },

  // Delete alumni
  deleteAlumni: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/admin/alumni/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting alumni:', error);
      throw error;
    }
  },

  // ─── EVENTS ───────────────────────────────────────────────────────

  // Get events
  getEvents: async () => {
    try {
      const response = await axiosInstance.get('/api/admin/events');
      return response;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  // Create event
  createEvent: async (data) => {
    try {
      const response = await axiosInstance.post('/api/admin/events', data);
      return response;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Update event
  updateEvent: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/api/admin/events/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  // Delete event
  deleteEvent: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/admin/events/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  // ─── ALBUMS ───────────────────────────────────────────────────────

  // Get albums
  getAlbums: async () => {
    try {
      const response = await axiosInstance.get('/api/admin/albums');
      return response;
    } catch (error) {
      console.error('Error fetching albums:', error);
      throw error;
    }
  },

  // Get albums by year
  getAlbumsByYear: async (year) => {
    try {
      const response = await axiosInstance.get(`/api/admin/albums/${year}`);
      return response;
    } catch (error) {
      console.error('Error fetching albums by year:', error);
      throw error;
    }
  },

  // Create album
  createAlbum: async (year, data) => {
    try {
      const response = await axiosInstance.post(`/api/admin/albums/${year}`, data);
      return response;
    } catch (error) {
      console.error('Error creating album:', error);
      throw error;
    }
  },

  // Update album
  updateAlbum: async (year, id, data) => {
    try {
      const response = await axiosInstance.put(`/api/admin/albums/${year}/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error updating album:', error);
      throw error;
    }
  },

  // Delete album
  deleteAlbum: async (year, id) => {
    try {
      const response = await axiosInstance.delete(`/api/admin/albums/${year}/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting album:', error);
      throw error;
    }
  },

  // Add year
  addYear: async (year) => {
    try {
      const response = await axiosInstance.post(`/api/admin/albums/year/${year}`);
      return response;
    } catch (error) {
      console.error('Error adding year:', error);
      throw error;
    }
  },
};

console.log('✅ API Service fully initialized\n');

// ═══════════════════════════════════════════════════════════════════════════════
// ✅ DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default axiosInstance;