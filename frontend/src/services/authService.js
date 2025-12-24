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
    let errorMessage = '注册失败。请重试。';
    
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
    
    // Check if response exists and has data
    if (!response || !response.data) {
      console.error('No response data received:', response);
      throw new Error('服务器无响应');
    }
    
    const data = response.data;
    
    // Check if this is actually an error response (shouldn't happen but be defensive)
    if (data.detail || data.error) {
      throw new Error(data.detail || data.error || '登录失败');
    }
    
    // Ensure response has the expected structure
    if (!data.user) {
      console.error('Invalid login response - missing user field:', {
        hasAccessToken: !!data.access_token,
        hasTokenType: !!data.token_type,
        hasUser: !!data.user,
        fullData: data
      });
      throw new Error('服务器响应无效：缺少用户数据');
    }
    
    // Ensure user object has required fields
    if (!data.user.role) {
      console.error('User object missing role:', data.user);
      throw new Error('用户数据无效：缺少角色');
    }
    
    // Return the data (which should be { access_token, token_type, user })
    return data;
  } catch (error) {
    // The api interceptor transforms errors, so check multiple sources
    let errorMessage = '凭据无效。请重试。';
    
    // Check error message first (from our validation or interceptor)
    if (error.message) {
      // Don't override our specific error messages
      if (error.message.includes('Invalid response from server') || 
          error.message.includes('Invalid user data')) {
        throw error; // Re-throw our validation errors as-is
      }
      errorMessage = error.message;
    } 
    // Check response data
    else if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } 
    // Check transformed error data
    else if (error.data?.detail) {
      errorMessage = error.data.detail;
    }
    
    // Provide helpful guidance for credential errors
    if (errorMessage.toLowerCase().includes('incorrect username') || 
        errorMessage.toLowerCase().includes('invalid credentials') ||
        errorMessage.toLowerCase().includes('authentication failed')) {
      errorMessage = '用户名或密码无效。请检查您的凭据。';
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
      error.response?.data?.detail || '获取用户信息失败。'
    );
  }
};

