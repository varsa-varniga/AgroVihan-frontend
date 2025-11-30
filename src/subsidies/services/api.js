// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('farmer_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('farmer_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// In services/api.js - Add better error handling
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => {
    console.log('Sending registration data:', data);
    return api.post('/auth/register', data);
  },
  getProfile: () => api.get('/auth/me'),
};

export const schemesAPI = {
  getAll: (params) => api.get('/schemes', { params }),
  getRecommended: () => api.post('/schemes/recommend'),
  getById: (id) => api.get(`/schemes/${id}`),
  checkEligibility: (id) => api.get(`/schemes/check-eligibility/${id}`),
};

export const applicationsAPI = {
  create: (data) => api.post('/applications', data),
  getAll: () => api.get('/applications'),
  getById: (id) => api.get(`/applications/${id}`),
  track: (applicationId) => api.get(`/applications/track/${applicationId}`),
};

export const profileAPI = {
  update: (data) => api.put('/users/profile', data),
  updateDocuments: (data) => api.post('/users/profile/documents', data),
  getStats: () => api.get('/users/stats'),
};

export const ocrAPI = {
  processDocument: (formData) => api.post('/ocr/process-document', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  autoFillProfile: (formData) => api.post('/ocr/auto-fill-profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};



export default api;