import api from '../utils/api';

/**
 * Get current user's preferences
 * @returns {Promise<Object>} The user's preferences
 * @throws {Error} If preferences not found (404) or other error
 */
export const getPreferences = async () => {
    try {
        const response = await api.get('/api/preferences');
        return response.data;
    } catch (error) {
        // Re-throw with status code preserved for proper handling
        if (error.response?.status === 404 || error.status === 404) {
            const notFoundError = new Error('Preferences not found');
            notFoundError.status = 404;
            notFoundError.response = error.response;
            throw notFoundError;
        }
        throw error;
    }
};

/**
 * Create new preferences
 * @param {Object} preferencesData - The preferences data
 * @param {Array<string>} preferencesData.focus_areas - List of focus areas
 * @param {Array<string>} preferencesData.keywords - List of keywords
 * @param {Array<string>} preferencesData.subject_preferences - List of subject preferences
 * @returns {Promise<Object>} The created preferences
 */
export const createPreferences = async (preferencesData) => {
    const response = await api.post('/api/preferences', preferencesData);
    return response.data;
};

/**
 * Update existing preferences
 * @param {number} preferencesId - The preferences ID
 * @param {Object} preferencesData - The updated preferences data
 * @param {Array<string>} preferencesData.focus_areas - List of focus areas
 * @param {Array<string>} preferencesData.keywords - List of keywords
 * @param {Array<string>} preferencesData.subject_preferences - List of subject preferences
 * @returns {Promise<Object>} The updated preferences
 */
export const updatePreferences = async (preferencesId, preferencesData) => {
    const response = await api.put(`/api/preferences/${preferencesId}`, preferencesData);
    return response.data;
};

/**
 * Delete preferences for current user
 * @returns {Promise<Object>} Success message
 */
export const deletePreferences = async () => {
    const response = await api.delete('/api/preferences');
    return response.data;
};
