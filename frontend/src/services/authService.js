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
    // The api interceptor returns an object with a 'message' property
    // It also includes 'data' with the original response data
    let errorMessage = 'Registration failed. Please try again.';
    
    // Check the transformed message first (from interceptor)
    if (error.message) {
      errorMessage = error.message;
    }
    // Fallback to original response detail
    else if (error.data?.detail) {
      errorMessage = error.data.detail;
    }
    // Fallback to original axios error structure
    else if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    }
    // Handle validation errors (422) which might have different structure
    else if (error.data && typeof error.data === 'object') {
      // Pydantic validation errors might be in error.data
      const detail = error.data.detail || JSON.stringify(error.data);
      errorMessage = Array.isArray(detail) ? detail.map(e => e.msg || e).join(', ') : detail;
    }
    
    console.error('Registration error details:', {
      message: error.message,
      data: error.data,
      response: error.response?.data,
      fullError: error
    }); // Debug log
    
    throw new Error(errorMessage);
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
    
    // Ensure response has the expected structure
    if (!response.data || !response.data.user) {
      console.error('Invalid login response:', response.data);
      throw new Error('Invalid response from server: missing user data');
    }
    
    // Ensure user object has role
    if (!response.data.user.role) {
      console.error('User object missing role:', response.data.user);
      throw new Error('Invalid user data: missing role');
    }
    
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

