import api from '../utils/api';

/**
 * Upload a markdown curriculum file
 * @param {File} file - The markdown file to upload
 * @returns {Promise<Object>} The uploaded curriculum data
 */
export const uploadCurriculum = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/api/curriculum/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * List all uploaded curricula
 * @returns {Promise<Array>} List of curriculum items
 */
export const listCurricula = async () => {
  const response = await api.get('/api/curriculum');
  return response.data;
};

/**
 * Get curriculum by ID
 * @param {number} curriculumId - The curriculum ID
 * @returns {Promise<Object>} The curriculum detail
 */
export const getCurriculum = async (curriculumId) => {
  const response = await api.get(`/api/curriculum/${curriculumId}`);
  return response.data;
};
