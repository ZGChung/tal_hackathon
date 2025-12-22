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
      error.response?.data?.detail || 'Failed to fetch feed. Please try again.'
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
      error.response?.data?.detail || 'Failed to fetch post. Please try again.'
    );
  }
};

