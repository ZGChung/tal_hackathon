import api from '../utils/api';

/**
 * Register a new user
 * @param {string} username - Username
 * @param {string} password - Password
 * @param {string} role - Role (Student or Admin)
 * @returns {Promise} Registration response
 */
export const register = async (username, password, role) => {
  try {
    const response = await api.post('/api/auth/register', {
      username,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 'Registration failed. Please try again.'
    );
  }
};

/**
 * Login user
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise} Login response with token and user
 */
export const login = async (username, password) => {
  try {
    const response = await api.post('/api/auth/login', {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    // The api interceptor returns an object with a 'message' property
    // Extract the message from the error object
    let errorMessage = 'Invalid credentials. Please try again.';
    
    if (error.message) {
      errorMessage = error.message;
    } else if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    // If the message suggests the user doesn't exist, provide helpful guidance
    if (errorMessage.toLowerCase().includes('incorrect username') || 
        errorMessage.toLowerCase().includes('invalid credentials')) {
      errorMessage = 'Invalid username or password. If you haven\'t registered yet, please register first.';
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Get current user
 * @returns {Promise} Current user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/auth/me');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 'Failed to get user information.'
    );
  }
};

