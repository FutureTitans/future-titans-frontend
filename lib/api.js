import axios from 'axios';
import { getAuthToken, getRefreshToken, setAuthToken, removeAuthToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5006/api';
const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:3002/api';
const CORE_API_URL = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:3003/api';
const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:5003/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const authApi = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const coreApi = axios.create({
  baseURL: CORE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const chatApi = axios.create({
  baseURL: CHAT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

authApi.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

coreApi.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

chatApi.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          setAuthToken(response.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          removeAuthToken();
          if (window.location.pathname.startsWith('/association')) {
            window.location.href = '/association/login';
          } else if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/admin/login';
          } else {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error.response?.data || error.message);
  }
);

authApi.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        try {
          const response = await axios.post(`${AUTH_API_URL}/auth/refresh`, { refreshToken });
          setAuthToken(response.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return authApi(originalRequest);
        } catch (refreshError) {
          removeAuthToken();
          if (window.location.pathname.startsWith('/association')) {
            window.location.href = '/association/login';
          } else if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/admin/login';
          } else {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error.response?.data || error.message);
  }
);

coreApi.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        try {
          const response = await axios.post(`${AUTH_API_URL}/auth/refresh`, { refreshToken });
          setAuthToken(response.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return coreApi(originalRequest);
        } catch (refreshError) {
          removeAuthToken();
          if (window.location.pathname.startsWith('/association')) {
            window.location.href = '/association/login';
          } else if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/admin/login';
          } else {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error.response?.data || error.message);
  }
);

chatApi.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        try {
          const response = await axios.post(`${AUTH_API_URL}/auth/refresh`, { refreshToken });
          setAuthToken(response.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return chatApi(originalRequest);
        } catch (refreshError) {
          removeAuthToken();
          if (window.location.pathname.startsWith('/association')) {
            window.location.href = '/association/login';
          } else if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/admin/login';
          } else {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error.response?.data || error.message);
  }
);

// Auth Endpoints
export const auth = {
  signup: (data) => authApi.post('/auth/signup', data),
  login: (data) => authApi.post('/auth/login', data),
  logout: () => authApi.post('/auth/logout'),
  refreshToken: (refreshToken) => authApi.post('/auth/refresh', { refreshToken }),
  getProfile: () => authApi.get('/auth/profile'),
  checkCompletionStatus: () => authApi.get('/auth/completion-status'),
  updateProfile: (data) => {
    const hasFile = Object.values(data).some(val => typeof File !== 'undefined' && val instanceof File);
    if (hasFile) {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });
      return authApi.put('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return authApi.put('/auth/profile', data);
  },
  forgotPassword: (data) => authApi.post('/auth/forgot-password', data),
  resetPassword: (data) => authApi.post('/auth/reset-password', data),
};

// Payment Endpoints
export const payment = {
  initiatePayment: () => api.post('/payment/initiate'),
  verifyPayment: (data) => api.post('/payment/verify', data),
  getPaymentStatus: () => api.get('/payment/status'),
};

// Module Endpoints
export const modules = {
  getAll: () => coreApi.get('/modules'),
  getById: (id) => coreApi.get(`/modules/${id}`),
  getChapter: (moduleId, chapterId) => coreApi.get(`/modules/${moduleId}/chapters/${chapterId}`),
  trackTime: (moduleId, seconds) => coreApi.post(`/modules/${moduleId}/track-time`, { seconds }),
  create: (data) => coreApi.post('/modules', data),
  update: (id, data) => coreApi.put(`/modules/${id}`, data),
  delete: (id) => coreApi.delete(`/modules/${id}`),
  publish: (id) => coreApi.post(`/modules/${id}/publish`),
  createChapter: (moduleId, data) => coreApi.post(`/modules/${moduleId}/chapters`, data),
  updateChapter: (moduleId, chapterId, data) => coreApi.put(`/modules/${moduleId}/chapters/${chapterId}`, data),
  deleteChapter: (moduleId, chapterId) => coreApi.delete(`/modules/${moduleId}/chapters/${chapterId}`),
  reorderChapters: (moduleId, data) => coreApi.post(`/modules/${moduleId}/reorder-chapters`, data),
};

// AI Chat Endpoints
export const aiChat = {
  sendMessage: (moduleId, chapterId, message) =>
    chatApi.post(`/chat/${moduleId}/chapters/${chapterId}/message`, { message }),
  getChatHistory: (moduleId, chapterId) => chatApi.get(`/chat/${moduleId}/chapters/${chapterId}/history`),
  finishChapterChat: (moduleId, chapterId) => chatApi.post(`/chat/${moduleId}/chapters/${chapterId}/finish`),
  completeChapter: (moduleId, chapterId) => chatApi.post(`/chat/${moduleId}/chapters/${chapterId}/complete`),
  getSSI: () => chatApi.get('/chat/ssi'),
  getReport: () => chatApi.get('/chat/report'),
  getStudentChats: (studentId) => chatApi.get(`/chat/admin/student/${studentId}/chats`),
  overrideSSI: (chatId, data) => chatApi.put(`/chat/admin/chat/${chatId}/override-ssi`, data),
  // Global SURGE chat (module-agnostic)
  sendGlobalMessage: (message) => chatApi.post('/chat/global/message', { message }),
  getGlobalHistory: () => chatApi.get('/chat/global/history'),
  // Rate limit status
  getRateLimitStatus: () => chatApi.get('/chat/rate-limit-status'),
};

// Submission Endpoints
export const submission = {
  saveDraft: (data) => api.post('/submission/draft', data),
  submit: (data) => api.post('/submission/submit', data),
  get: () => api.get('/submission'),
  update: (id, data) => api.put(`/submission/${id}`, data),
  getAll: (filters) => api.get('/submission/admin/all', { params: filters }),
  getDetails: (id) => api.get(`/submission/admin/${id}`),
  score: (id, data) => api.put(`/submission/admin/${id}/score`, data),
  downloadFile: (id, fileType) => api.get(`/submission/admin/${id}/download/${fileType}`),
};

// Admin Endpoints
export const admin = {
  getDashboard: () => coreApi.get('/admin/dashboard'),
  getStudents: (filters) => coreApi.get('/admin/students', { params: filters }),
  getStudentDetail: (studentId) => coreApi.get(`/admin/students/${studentId}`),
  updateStudentStatus: (studentId, data) => coreApi.put(`/admin/students/${studentId}`, data),
  tagStudent: (studentId, data) => coreApi.post(`/admin/students/${studentId}/tag`, data),
  deleteStudent: (studentId) => coreApi.delete(`/admin/students/${studentId}`),
  getAnalytics: () => coreApi.get('/admin/analytics'),
  exportStudents: () => coreApi.get('/admin/export/students'),
  // School slug management
  getSchoolSlugs: () => coreApi.get('/admin/slugs'),
  createSchoolSlug: (data) => coreApi.post('/admin/slugs', data),
  updateSchoolSlug: (slugId, data) => coreApi.put(`/admin/slugs/${slugId}`, data),
  deleteSchoolSlug: (slugId) => coreApi.delete(`/admin/slugs/${slugId}`),
  getStudentsBySlug: (slug) => coreApi.get(`/admin/slugs/${slug}/students`),
  reviewSchoolProof: (slugId, data) => coreApi.put(`/admin/slugs/${slugId}/proof`, data),
  // SMTP Configuration
  getSMTPConfig: () => coreApi.get('/admin/smtp-config'),
  updateSMTPConfig: (data) => coreApi.put('/admin/smtp-config', data),
  testSMTPConfig: (data) => coreApi.post('/admin/smtp-config/test', data),
  // Chat Settings (message limit & reset hours)
  getChatSettings: () => coreApi.get('/admin/chat-settings'),
  updateChatSettings: (data) => coreApi.put('/admin/chat-settings', data),
};

// Achievement Endpoints
export const achievements = {
  getAll: () => coreApi.get('/achievements'),
};

// School POC Endpoints
export const schoolPoc = {
  login: (data) => coreApi.post('/school-poc/login', data),
  getDashboard: () => coreApi.get('/school-poc/dashboard'),
};

export default api;

