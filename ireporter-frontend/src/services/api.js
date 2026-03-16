import axios from 'axios';

// API URL - uses environment variable if available, otherwise localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 if it's NOT a login/register request
    const url = error.config?.url || '';
    const isAuthRequest = url.includes('/users/login') || url.includes('/users/register');
    
    if (error.response?.status === 401 && !isAuthRequest) {
      // Token expired or invalid - clear and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;