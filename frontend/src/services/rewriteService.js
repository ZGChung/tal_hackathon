import api from '../utils/api';

/**
 * Rewrite text to incorporate curriculum keywords
 * @param {string} text - Text to be rewritten
 * @param {number} [curriculum_id] - Optional curriculum ID. Uses most recent if not provided
 * @returns {Promise<Object>} RewriteResponse with original_text, rewritten_text, and keywords_used
 */
export const rewriteText = async (text, curriculum_id) => {
  try {
    const requestBody = { text };
    if (curriculum_id !== undefined) {
      requestBody.curriculum_id = curriculum_id;
    }
    
    const response = await api.post('/api/rewrite', requestBody);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || '重写文本失败。请重试。'
    );
  }
};

