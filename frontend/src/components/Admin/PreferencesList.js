import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { getPreferences, deletePreferences } from '../../services/preferencesService';
import './Admin.css';

const PreferencesList = forwardRef((props, ref) => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchPreferences = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getPreferences();
      setPreferences(data);
    } catch (err) {
      const status = err.response?.status || err.status;
      if (status === 404) {
        // No preferences yet - this is expected
        setPreferences(null);
      } else {
        setError(err.response?.data?.detail || err.message || 'Failed to load preferences');
      }
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchPreferences,
  }));

  useEffect(() => {
    fetchPreferences();
  }, []);

  const handleDelete = async () => {
    if (!showConfirm) {
      // First click - show confirmation
      setShowConfirm(true);
      return;
    }

    // Second click - confirm deletion
    setDeleting(true);
    setError('');

    try {
      await deletePreferences();
      // Clear preferences after deletion
      setPreferences(null);
      setShowConfirm(false);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to delete preferences');
      setShowConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  if (loading) {
    return (
      <div className="admin-section">
        <h2>Preferences List</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading preferences...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-section">
        <h2>Preferences List</h2>
        <div className="message error">{error}</div>
        <button onClick={fetchPreferences}>Retry</button>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="admin-section">
        <h2>Preferences List</h2>
        <div className="empty-state">
          <p>No preferences have been set yet.</p>
          <p className="empty-state-hint">Go to the "Preferences" tab to create your preferences.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <h2>Preferences List</h2>
      {error && (
        <div className="message error" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      <div className="preferences-card">
        <div className="preferences-section">
          <div className="preferences-section-header">
            <h3>
              <span className="section-icon">🎯</span>
              Focus Areas
            </h3>
          </div>
          {preferences.focus_areas && preferences.focus_areas.length > 0 ? (
            <div className="preferences-tags">
              {preferences.focus_areas.map((area, index) => (
                <span key={index} className="preference-tag focus-tag">
                  {area}
                </span>
              ))}
            </div>
          ) : (
            <p className="no-items">No focus areas specified</p>
          )}
        </div>

        <div className="preferences-section">
          <div className="preferences-section-header">
            <h3>
              <span className="section-icon">🔑</span>
              Keywords
            </h3>
          </div>
          {preferences.keywords && preferences.keywords.length > 0 ? (
            <div className="preferences-tags">
              {preferences.keywords.map((keyword, index) => (
                <span key={index} className="preference-tag keyword-tag">
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <p className="no-items">No keywords specified</p>
          )}
        </div>

        <div className="preferences-section">
          <div className="preferences-section-header">
            <h3>
              <span className="section-icon">📚</span>
              Subject Preferences
            </h3>
          </div>
          {preferences.subject_preferences && preferences.subject_preferences.length > 0 ? (
            <div className="preferences-tags">
              {preferences.subject_preferences.map((subject, index) => (
                <span key={index} className="preference-tag subject-tag">
                  {subject}
                </span>
              ))}
            </div>
          ) : (
            <p className="no-items">No subject preferences specified</p>
          )}
        </div>

        <div className="preferences-meta">
          <p className="preferences-id">Preferences ID: {preferences.id}</p>
          <div className="preferences-actions">
            {showConfirm ? (
              <div className="delete-confirmation">
                <span className="delete-confirm-text">Delete preferences?</span>
                <button
                  type="button"
                  className="delete-confirm-btn"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Confirm'}
                </button>
                <button
                  type="button"
                  className="delete-cancel-btn"
                  onClick={cancelDelete}
                  disabled={deleting}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="delete-btn"
                onClick={handleDelete}
                disabled={deleting}
                title="Delete preferences"
              >
                🗑️ Delete Preferences
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

PreferencesList.displayName = 'PreferencesList';

export default PreferencesList;

