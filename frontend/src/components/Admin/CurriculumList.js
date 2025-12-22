import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { listCurricula } from '../../services/curriculumService';
import './Admin.css';

const CurriculumList = forwardRef((props, ref) => {
  const [curricula, setCurricula] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="admin-section">
        <h2>Curriculum List</h2>
        <p>Loading...</p>
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
      <h2>Curriculum List</h2>
      {curricula.length === 0 ? (
        <p>No curricula uploaded yet.</p>
      ) : (
        <div className="curriculum-list">
          {curricula.map((curriculum) => (
            <div key={curriculum.id} className="curriculum-item">
              <div className="curriculum-header">
                <h3>{curriculum.filename}</h3>
                <span className="curriculum-date">{formatDate(curriculum.created_at)}</span>
              </div>
              <div className="curriculum-keywords">
                <strong>Keywords:</strong>{' '}
                {curriculum.keywords && curriculum.keywords.length > 0 ? (
                  <span>{curriculum.keywords.join(', ')}</span>
                ) : (
                  <span className="no-keywords">No keywords extracted</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

CurriculumList.displayName = 'CurriculumList';

export default CurriculumList;
