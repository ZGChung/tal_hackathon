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
        setError(err.response?.data?.detail || err.message || '加载偏好设置失败');
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
      setError(err.response?.data?.detail || err.message || '删除偏好设置失败');
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
        <h2>偏好列表</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>加载偏好设置中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-section">
        <h2>偏好列表</h2>
        <div className="message error">{error}</div>
        <button onClick={fetchPreferences}>重试</button>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="admin-section">
        <h2>偏好列表</h2>
        <div className="empty-state">
          <p>尚未设置任何偏好。</p>
          <p className="empty-state-hint">前往"偏好设置"标签页创建您的偏好设置。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <h2>偏好列表</h2>
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
              重点领域
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
            <p className="no-items">未指定重点领域</p>
          )}
        </div>

        <div className="preferences-section">
          <div className="preferences-section-header">
            <h3>
              <span className="section-icon">🔑</span>
              关键词
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
            <p className="no-items">未指定关键词</p>
          )}
        </div>

        <div className="preferences-section">
          <div className="preferences-section-header">
            <h3>
              <span className="section-icon">📚</span>
              学科偏好
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
            <p className="no-items">未指定学科偏好</p>
          )}
        </div>

        <div className="preferences-meta">
          <p className="preferences-id">偏好设置 ID：{preferences.id}</p>
          <div className="preferences-actions">
            {showConfirm ? (
              <div className="delete-confirmation">
                <span className="delete-confirm-text">确认删除偏好设置？</span>
                <button
                  type="button"
                  className="delete-confirm-btn"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? '删除中...' : '确认'}
                </button>
                <button
                  type="button"
                  className="delete-cancel-btn"
                  onClick={cancelDelete}
                  disabled={deleting}
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="delete-btn"
                onClick={handleDelete}
                disabled={deleting}
                title="删除偏好设置"
              >
                🗑️ 删除偏好设置
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

