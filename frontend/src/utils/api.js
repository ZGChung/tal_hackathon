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
            message: '网络错误：发送请求失败',
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
                    message: '请求超时：服务器响应时间过长',
                    originalError: error,
                });
            }
            if (error.message === 'Network Error') {
                const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
                return Promise.reject({
                    message: `网络错误：无法连接到服务器 ${baseURL}。请确保后端在端口 8000 上运行。`,
                    originalError: error,
                });
            }
            return Promise.reject({
                message: '网络错误：无法连接到服务器',
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
                message: '身份验证失败：请重新登录',
                status,
                data,
                originalError: error,
            });
        }

        if (status === 403) {
            return Promise.reject({
                message: data?.detail || '访问被禁止：您没有权限',
                status,
                data,
                originalError: error,
            });
        }

        if (status === 404) {
            return Promise.reject({
                message: data?.detail || '资源未找到',
                status,
                data,
                originalError: error,
            });
        }

        if (status === 422) {
            return Promise.reject({
                message: data?.detail || '验证错误：请检查您的输入',
                status,
                data,
                originalError: error,
            });
        }

        if (status >= 500) {
            return Promise.reject({
                message: data?.detail || '服务器错误：请稍后重试',
                status,
                data,
                originalError: error,
            });
        }

        // Generic error handling
        return Promise.reject({
            message: data?.detail || error.message || '发生了意外错误',
            status,
            data,
            originalError: error,
        });
    }
);

export default api;

