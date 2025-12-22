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
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    setFetching(true);
    setMessage(''); // Clear any previous messages
    setMessageType('');
    try {
      const data = await getPreferences();
      setPreferencesId(data.id);
      setFocusAreas(data.focus_areas?.join(', ') || '');
      setKeywords(data.keywords?.join(', ') || '');
      setSubjectPreferences(data.subject_preferences?.join(', ') || '');
    } catch (error) {
      // 404 is expected if preferences don't exist yet - don't show error
      // Only show error for other status codes (500, network errors, etc.)
      const status = error.response?.status || error.status || error.data?.status;
      const isNotFound = status === 404 || 
                        error.message?.includes('not found') || 
                        error.message?.includes('Preferences not found');
      
      if (!isNotFound) {
        // Only show error for non-404 errors
        const errorMsg = error.response?.data?.detail || 
                       error.data?.detail || 
                       error.message || 
                       'Failed to load preferences';
        setMessage(errorMsg);
        setMessageType('error');
      }
      // For 404, just leave the form empty - no error message needed
      // This is the normal state when preferences haven't been created yet
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

  const loadTemplate = async (templateName) => {
    setLoadingTemplate(true);
    setMessage('');
    setMessageType('');
    
    try {
      const response = await fetch(`/${templateName}.json`);
      if (!response.ok) {
        throw new Error('Failed to load template');
      }
      const data = await response.json();
      
      // Populate form fields with template data
      setFocusAreas(data.focus_areas?.join(', ') || '');
      setKeywords(data.keywords?.join(', ') || '');
      setSubjectPreferences(data.subject_preferences?.join(', ') || '');
      
      setMessage(`Loaded ${templateName.replace('example_preferences_', 'template ')} successfully!`);
      setMessageType('success');
    } catch (error) {
      setMessage('Failed to load template. Please try again.');
      setMessageType('error');
      console.error('Error loading template:', error);
    } finally {
      setLoadingTemplate(false);
    }
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
      
      {/* Template Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#555' }}>
          Load Predefined Templates:
        </label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => loadTemplate('example_preferences_1')}
            disabled={loadingTemplate}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loadingTemplate ? 'not-allowed' : 'pointer',
              opacity: loadingTemplate ? 0.6 : 1,
              fontSize: '14px'
            }}
          >
            {loadingTemplate ? 'Loading...' : 'STEM Template'}
          </button>
          <button
            type="button"
            onClick={() => loadTemplate('example_preferences_2')}
            disabled={loadingTemplate}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loadingTemplate ? 'not-allowed' : 'pointer',
              opacity: loadingTemplate ? 0.6 : 1,
              fontSize: '14px'
            }}
          >
            {loadingTemplate ? 'Loading...' : 'Arts Template'}
          </button>
          <button
            type="button"
            onClick={() => loadTemplate('example_preferences_3')}
            disabled={loadingTemplate}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loadingTemplate ? 'not-allowed' : 'pointer',
              opacity: loadingTemplate ? 0.6 : 1,
              fontSize: '14px'
            }}
          >
            {loadingTemplate ? 'Loading...' : 'Holistic Template'}
          </button>
        </div>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '8px', marginBottom: 0 }}>
          Click a template button to load predefined preferences. You can modify them before saving.
        </p>
      </div>

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
