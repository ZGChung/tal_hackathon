import React, { useState, useEffect } from 'react';
import { getPreferences, createPreferences, updatePreferences } from '../../services/preferencesService';
import './Admin.css';

const PreferencesForm = () => {
  const [focusAreas, setFocusAreas] = useState('');
  const [keywords, setKeywords] = useState('');
  const [subjectPreferences, setSubjectPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [preferencesId, setPreferencesId] = useState(null);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    setFetching(true);
    try {
      const data = await getPreferences();
      setPreferencesId(data.id);
      setFocusAreas(data.focus_areas?.join(', ') || '');
      setKeywords(data.keywords?.join(', ') || '');
      setSubjectPreferences(data.subject_preferences?.join(', ') || '');
    } catch (error) {
      if (error.response?.status !== 404) {
        setMessage(error.response?.data?.detail || error.message || 'Failed to load preferences');
        setMessageType('error');
      }
      // 404 is expected if preferences don't exist yet
    } finally {
      setFetching(false);
    }
  };

  const parseList = (value) => {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    const preferencesData = {
      focus_areas: parseList(focusAreas),
      keywords: parseList(keywords),
      subject_preferences: parseList(subjectPreferences),
    };

    try {
      if (preferencesId) {
        // Update existing preferences
        await updatePreferences(preferencesId, preferencesData);
        setMessage('Preferences updated successfully!');
      } else {
        // Create new preferences
        const response = await createPreferences(preferencesData);
        setPreferencesId(response.id);
        setMessage('Preferences saved successfully!');
      }
      setMessageType('success');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || 'Save failed';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="admin-section">
        <h2>Preferences</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <h2>Preferences</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="focus-areas">Focus Areas (comma-separated)</label>
          <input
            id="focus-areas"
            type="text"
            value={focusAreas}
            onChange={(e) => setFocusAreas(e.target.value)}
            placeholder="e.g., STEM, Arts, Sports"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="keywords">Keywords (comma-separated)</label>
          <input
            id="keywords"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g., innovation, creativity, problem-solving"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject-preferences">Subject Preferences (comma-separated)</label>
          <input
            id="subject-preferences"
            type="text"
            value={subjectPreferences}
            onChange={(e) => setSubjectPreferences(e.target.value)}
            placeholder="e.g., Mathematics, Science, History"
            disabled={loading}
          />
        </div>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
      </form>
    </div>
  );
};

export default PreferencesForm;
