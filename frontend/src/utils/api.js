import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Request error (before request is sent)
    return Promise.reject({
      message: 'Network error: Failed to send request',
      originalError: error,
    });
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors (no response from server)
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return Promise.reject({
          message: 'Request timeout: Server took too long to respond',
          originalError: error,
        });
      }
      if (error.message === 'Network Error') {
        const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        return Promise.reject({
          message: `Network error: Unable to connect to server at ${baseURL}. Please ensure the backend is running on port 8000.`,
          originalError: error,
        });
      }
      return Promise.reject({
        message: 'Network error: Unable to reach server',
        originalError: error,
      });
    }

    // Handle HTTP error responses
    const status = error.response.status;
    const data = error.response.data;

    if (status === 401) {
      // Token expired or invalid, clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject({
        message: 'Authentication failed: Please log in again',
        status,
        data,
        originalError: error,
      });
    }

    if (status === 403) {
      return Promise.reject({
        message: data?.detail || 'Access forbidden: You do not have permission',
        status,
        data,
        originalError: error,
      });
    }

    if (status === 404) {
      return Promise.reject({
        message: data?.detail || 'Resource not found',
        status,
        data,
        originalError: error,
      });
    }

    if (status === 422) {
      return Promise.reject({
        message: data?.detail || 'Validation error: Please check your input',
        status,
        data,
        originalError: error,
      });
    }

    if (status >= 500) {
      return Promise.reject({
        message: data?.detail || 'Server error: Please try again later',
        status,
        data,
        originalError: error,
      });
    }

    // Generic error handling
    return Promise.reject({
      message: data?.detail || error.message || 'An unexpected error occurred',
      status,
      data,
      originalError: error,
    });
  }
);

export default api;

