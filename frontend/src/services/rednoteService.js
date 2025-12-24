import api from '../utils/api';

/**
 * Get feed of RedNote posts
 * @returns {Promise<Array>} Array of post objects
 */
export const getFeed = async () => {
  try {
    const response = await api.get('/api/rednote/feed');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || '获取动态失败。请重试。'
    );
  }
};

/**
 * Get a single RedNote post by ID
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} Post object
 */
export const getPost = async (postId) => {
  try {
    const response = await api.get(`/api/rednote/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || '获取帖子失败。请重试。'
    );
  }
};

