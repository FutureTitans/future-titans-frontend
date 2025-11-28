import axios from 'axios';
import { getAuthToken, getRefreshToken, setAuthToken, removeAuthToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5006/api';

const api = axios.create({
  baseURL: API_URL,
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
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error.response?.data || error.message);
  }
);

// Auth Endpoints
export const auth = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  getProfile: () => api.get('/auth/profile'),
  checkCompletionStatus: () => api.get('/auth/completion-status'),
  updateProfile: (data) => api.put('/auth/profile', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// Payment Endpoints
export const payment = {
  initiatePayment: () => api.post('/payment/initiate'),
  verifyPayment: (data) => api.post('/payment/verify', data),
  getPaymentStatus: () => api.get('/payment/status'),
};

// Module Endpoints
export const modules = {
  getAll: () => api.get('/modules'),
  getById: (id) => api.get(`/modules/${id}`),
  getChapter: (moduleId, chapterId) => api.get(`/modules/${moduleId}/chapters/${chapterId}`),
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'mentorProfilePicture' && data[key] instanceof File) {
        formData.append('mentorProfilePicture', data[key]);
      } else if (key !== 'mentorProfilePicture') {
        formData.append(key, data[key]);
      }
    });
    return api.post('/modules', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'mentorProfilePicture' && data[key] instanceof File) {
        formData.append('mentorProfilePicture', data[key]);
      } else if (key !== 'mentorProfilePicture') {
        formData.append(key, data[key]);
      }
    });
    return api.put(`/modules/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id) => api.delete(`/modules/${id}`),
  publish: (id) => api.post(`/modules/${id}/publish`),
  createChapter: (moduleId, data) => api.post(`/modules/${moduleId}/chapters`, data),
  updateChapter: (moduleId, chapterId, data) => api.put(`/modules/${moduleId}/chapters/${chapterId}`, data),
  deleteChapter: (moduleId, chapterId) => api.delete(`/modules/${moduleId}/chapters/${chapterId}`),
  reorderChapters: (moduleId, data) => api.post(`/modules/${moduleId}/reorder-chapters`, data),
};

// AI Chat Endpoints
export const aiChat = {
  sendMessage: (moduleId, chapterId, message) =>
    api.post(`/chat/${moduleId}/chapters/${chapterId}/message`, { message }),
  getChatHistory: (moduleId, chapterId) => api.get(`/chat/${moduleId}/chapters/${chapterId}/history`),
  finishChapterChat: (moduleId, chapterId) => api.post(`/chat/${moduleId}/chapters/${chapterId}/finish`),
  completeChapter: (moduleId, chapterId) => api.post(`/chat/${moduleId}/chapters/${chapterId}/complete`),
  getSSI: () => api.get('/chat/ssi'),
  getReport: () => api.get('/chat/report'),
  getStudentChats: (studentId) => api.get(`/chat/admin/student/${studentId}/chats`),
  overrideSSI: (chatId, data) => api.put(`/chat/admin/chat/${chatId}/override-ssi`, data),
  // Global SURGE chat (module-agnostic)
  sendGlobalMessage: (message) => api.post('/chat/global/message', { message }),
  getGlobalHistory: () => api.get('/chat/global/history'),
};

// Submission Endpoints
export const submission = {
  saveDraft: (data) => api.post('/submission/draft', data),
  submit: (formData) => api.post('/submission/submit', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  get: () => api.get('/submission'),
  update: (id, data) => api.put(`/submission/${id}`, data),
  getAll: (filters) => api.get('/submission/admin/all', { params: filters }),
  getDetails: (id) => api.get(`/submission/admin/${id}`),
  score: (id, data) => api.put(`/submission/admin/${id}/score`, data),
  downloadFile: (id, fileType) => api.get(`/submission/admin/${id}/download/${fileType}`),
};

// Admin Endpoints
export const admin = {
  getDashboard: () => api.get('/admin/dashboard'),
  getStudents: (filters) => api.get('/admin/students', { params: filters }),
  getStudentDetail: (studentId) => api.get(`/admin/students/${studentId}`),
  updateStudentStatus: (studentId, data) => api.put(`/admin/students/${studentId}`, data),
  tagStudent: (studentId, data) => api.post(`/admin/students/${studentId}/tag`, data),
  deleteStudent: (studentId) => api.delete(`/admin/students/${studentId}`),
  getAnalytics: () => api.get('/admin/analytics'),
  exportStudents: () => api.get('/admin/export/students'),
  // School slug management
  getSchoolSlugs: () => api.get('/admin/slugs'),
  createSchoolSlug: (data) => api.post('/admin/slugs', data),
  updateSchoolSlug: (slugId, data) => api.put(`/admin/slugs/${slugId}`, data),
  deleteSchoolSlug: (slugId) => api.delete(`/admin/slugs/${slugId}`),
  getStudentsBySlug: (slug) => api.get(`/admin/slugs/${slug}/students`),
};

export default api;

