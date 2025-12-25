import React, { useState, useEffect } from 'react';
import { getPreferences, createPreferences, updatePreferences } from '../../services/preferencesService';
import './Admin.css';

const PreferencesForm = ({ onSaveSuccess }) => {
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
          '加载偏好设置失败';
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

      setMessage(`成功加载 ${templateName.replace('default_preferences_', '').replace('_', ' ')}！`);
      setMessageType('success');
    } catch (error) {
      setMessage('加载模板失败。请重试。');
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
        setMessage('偏好设置更新成功！');
      } else {
        // Create new preferences
        const response = await createPreferences(preferencesData);
        setPreferencesId(response.id);
        setMessage('偏好设置保存成功！');
      }
      setMessageType('success');

      // Notify parent component
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || '保存失败';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="admin-section">
        <h2>偏好设置</h2>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <h2>偏好设置</h2>

      {/* Template Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#555' }}>
          快速加载示例偏好：
        </label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => loadTemplate('default_preferences_children_language')}
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
            {loadingTemplate ? '加载中...' : '加载示例偏好（儿童语言学习）'}
          </button>
        </div>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '8px', marginBottom: 0 }}>
          点击按钮可快速加载针对12岁以下儿童的语言学习偏好设置（中国成语、中国古诗、英语词汇）。您可以在保存前修改它们。
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="focus-areas">重点领域（逗号分隔）</label>
          <input
            id="focus-areas"
            type="text"
            value={focusAreas}
            onChange={(e) => setFocusAreas(e.target.value)}
            placeholder="例如：STEM、艺术、体育"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="keywords">关键词（逗号分隔）</label>
          <input
            id="keywords"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="例如：创新、创造力、问题解决"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject-preferences">学科偏好（逗号分隔）</label>
          <input
            id="subject-preferences"
            type="text"
            value={subjectPreferences}
            onChange={(e) => setSubjectPreferences(e.target.value)}
            placeholder="例如：数学、科学、历史"
            disabled={loading}
          />
        </div>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? '保存中...' : '保存偏好设置'}
        </button>
      </form>
    </div>
  );
};

export default PreferencesForm;
