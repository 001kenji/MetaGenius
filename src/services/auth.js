// src/services/auth.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Setup axios instance with default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization header interceptor
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

// Handle response interceptor for common error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Login a user
 * @param {string} email User's email
 * @param {string} password User's password
 * @returns {Promise} Promise with user data and token
 */
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login/', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to login. Please check your credentials.';
  }
};

/**
 * Register a new user
 * @param {string} name User's full name
 * @param {string} email User's email
 * @param {string} password User's password
 * @returns {Promise} Promise with user data and token
 */
export const registerUser = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register/', { name, email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Registration failed. Please try again.';
  }
};

/**
 * Logout the current user
 * @returns {Promise} Promise indicating success or failure
 */
export const logoutUser = async () => {
  try {
    await api.post('/auth/logout/');
    return true;
  } catch (error) {
    throw error.response?.data?.detail || 'Logout failed';
  }
};

/**
 * Get current user information
 * @returns {Promise} Promise with user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me/');
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to fetch user data';
  }
};

/**
 * Update user profile
 * @param {Object} userData User data to update
 * @returns {Promise} Promise with updated user data
 */
export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/auth/profile/', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to update profile';
  }
};

/**
 * Connect a social account (Google, Facebook, etc.)
 * @param {string} provider Name of the social provider (google, facebook, etc.)
 * @param {Object} data Provider-specific data (credential for Google, etc.)
 * @returns {Promise} Promise with user data and token
 */
export const connectSocialAccount = async (provider, data) => {
  try {
    const response = await api.post(`/auth/social/${provider}/`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || `Failed to authenticate with ${provider}`;
  }
};