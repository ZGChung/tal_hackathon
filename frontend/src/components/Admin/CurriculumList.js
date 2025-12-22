import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { listCurricula, deleteCurriculum } from '../../services/curriculumService';
import './Admin.css';

const CurriculumList = forwardRef((props, ref) => {
  const [curricula, setCurricula] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchCurricula = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listCurricula();
      setCurricula(data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to load curricula');
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchCurricula,
  }));

  useEffect(() => {
    fetchCurricula();
  }, []);

  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatFilename = (filename) => {
    // Remove .md extension and convert underscores/hyphens to spaces
    return filename
      .replace(/\.md$/i, '')
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleDelete = async (curriculumId, filename) => {
    if (deleteConfirmId !== curriculumId) {
      // First click - show confirmation
      setDeleteConfirmId(curriculumId);
      return;
    }

    // Second click - confirm deletion
    setDeletingId(curriculumId);
    setDeleteConfirmId(null);
    setError('');

    try {
      await deleteCurriculum(curriculumId);
      // Refresh the list
      await fetchCurricula();
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to delete curriculum');
    } finally {
      setDeletingId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  if (loading) {
    return (
      <div className="admin-section">
        <h2>Curriculum List</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading curricula...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-section">
        <h2>Curriculum List</h2>
        <div className="message error">{error}</div>
        <button onClick={fetchCurricula}>Retry</button>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div className="curriculum-list-header">
        <h2>Curriculum List</h2>
        <span className="curriculum-count">{curricula.length} {curricula.length === 1 ? 'curriculum' : 'curricula'}</span>
      </div>
      {curricula.length === 0 ? (
        <div className="empty-state">
          <p>No curricula uploaded yet.</p>
          <p className="empty-state-hint">Upload a curriculum using the "Curriculum Upload" tab.</p>
        </div>
      ) : (
        <div className="curriculum-list">
          {curricula.map((curriculum) => {
            const isExpanded = expandedItems.has(curriculum.id);
            const keywords = curriculum.keywords || [];
            const displayKeywords = isExpanded ? keywords : keywords.slice(0, 10);
            const hasMoreKeywords = keywords.length > 10;

            const isDeleting = deletingId === curriculum.id;
            const isConfirming = deleteConfirmId === curriculum.id;

            return (
              <div key={curriculum.id} className="curriculum-card">
                <div className="curriculum-card-header">
                  <div className="curriculum-title-section">
                    <h3 className="curriculum-title">{formatFilename(curriculum.filename)}</h3>
                    <span className="curriculum-filename">{curriculum.filename}</span>
                  </div>
                  <div className="curriculum-meta">
                    <span className="curriculum-date">
                      <span className="meta-icon">📅</span>
                      {formatDate(curriculum.created_at)}
                    </span>
                    <span className="keyword-count">
                      <span className="meta-icon">🏷️</span>
                      {keywords.length} keywords
                    </span>
                  </div>
                </div>
                
                {keywords.length > 0 ? (
                  <div className="curriculum-keywords-section">
                    <div className="keywords-label">
                      <strong>Keywords:</strong>
                    </div>
                    <div className="keywords-container">
                      {displayKeywords.map((keyword, index) => (
                        <span key={index} className="keyword-tag">
                          {keyword}
                        </span>
                      ))}
                      {hasMoreKeywords && !isExpanded && (
                        <span className="keyword-more-indicator">
                          +{keywords.length - 10} more
                        </span>
                      )}
                    </div>
                    <div className="keywords-actions">
                      {hasMoreKeywords && (
                        <button
                          type="button"
                          className="toggle-keywords-btn"
                          onClick={() => toggleExpand(curriculum.id)}
                        >
                          {isExpanded ? 'Show Less' : `Show All ${keywords.length} Keywords`}
                        </button>
                      )}
                      {isConfirming ? (
                        <div className="delete-confirmation">
                          <span className="delete-confirm-text">Delete?</span>
                          <button
                            type="button"
                            className="delete-confirm-btn"
                            onClick={() => handleDelete(curriculum.id, curriculum.filename)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? 'Deleting...' : 'Confirm'}
                          </button>
                          <button
                            type="button"
                            className="delete-cancel-btn"
                            onClick={cancelDelete}
                            disabled={isDeleting}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => handleDelete(curriculum.id, curriculum.filename)}
                          disabled={isDeleting || deleteConfirmId !== null}
                          title="Delete curriculum"
                        >
                          🗑️ Delete
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="curriculum-keywords-section">
                    <span className="no-keywords">No keywords extracted</span>
                    <div className="keywords-actions">
                      {isConfirming ? (
                        <div className="delete-confirmation">
                          <span className="delete-confirm-text">Delete?</span>
                          <button
                            type="button"
                            className="delete-confirm-btn"
                            onClick={() => handleDelete(curriculum.id, curriculum.filename)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? 'Deleting...' : 'Confirm'}
                          </button>
                          <button
                            type="button"
                            className="delete-cancel-btn"
                            onClick={cancelDelete}
                            disabled={isDeleting}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => handleDelete(curriculum.id, curriculum.filename)}
                          disabled={isDeleting || deleteConfirmId !== null}
                          title="Delete curriculum"
                        >
                          🗑️ Delete
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

CurriculumList.displayName = 'CurriculumList';

export default CurriculumList;
