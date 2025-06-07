// API Service to handle HTTP requests
import axios from 'axios';
import Cookies from 'js-cookie';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default configs
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,     
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `JWT ${localStorage.getItem('access')}`,
    'X-CSRFToken': Cookies.get('Inject') || '',
    // 'Cookie' : `sessionid=${Cookies.get('Inject') || ''}`
  },
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Try refreshing token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refresh: refreshToken });
          localStorage.setItem('token', data.access);
          api.defaults.headers.common.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        }
      } catch (err) {
        // If refresh fails, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;