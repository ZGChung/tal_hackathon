import React, { useState } from 'react';
import './ComparisonView.css';

const ComparisonView = ({ post, rewriteData, onClose }) => {
  const [viewMode, setViewMode] = useState('side-by-side'); // 'side-by-side' or 'toggle'

  return (
    <div className="comparison-view-overlay" data-testid="comparison-view">
      <div className="comparison-view-container">
        <div className="comparison-header">
          <h2>内容对比</h2>
          <button className="close-button" onClick={onClose} data-testid="close-button">
            ✕
          </button>
        </div>

        <div className="view-mode-toggle">
          <button
            className={viewMode === 'side-by-side' ? 'active' : ''}
            onClick={() => setViewMode('side-by-side')}
          >
            并排对比
          </button>
          <button
            className={viewMode === 'toggle' ? 'active' : ''}
            onClick={() => setViewMode('toggle')}
          >
            切换查看
          </button>
        </div>

        {viewMode === 'side-by-side' ? (
          <div className="side-by-side-view">
            <div className="comparison-panel original-panel">
              <div className="panel-header">
                <span className="panel-label">原文</span>
              </div>
              <div className="panel-content">
                <p className="comparison-text">{rewriteData.original_text}</p>
              </div>
            </div>
            <div className="comparison-panel rewritten-panel">
              <div className="panel-header">
                <span className="panel-label">改写后</span>
              </div>
              <div className="panel-content">
                <p className="comparison-text">{rewriteData.rewritten_text}</p>
              </div>
            </div>
          </div>
        ) : (
          <ToggleView originalText={rewriteData.original_text} rewrittenText={rewriteData.rewritten_text} />
        )}

        <div className="keywords-section">
          <h3>使用的关键词</h3>
          <div className="keywords-list">
            {rewriteData.keywords_used && rewriteData.keywords_used.length > 0 ? (
              rewriteData.keywords_used.map((keyword, index) => (
                <span key={index} className="keyword-tag">
                  {keyword}
                </span>
              ))
            ) : (
              <span className="no-keywords">无关键词</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ToggleView = ({ originalText, rewrittenText }) => {
  const [showOriginal, setShowOriginal] = useState(true);

  return (
    <div className="toggle-view">
      <div className="toggle-controls">
        <button
          className={showOriginal ? 'active' : ''}
          onClick={() => setShowOriginal(true)}
        >
          原文
        </button>
        <button
          className={!showOriginal ? 'active' : ''}
          onClick={() => setShowOriginal(false)}
        >
          改写后
        </button>
      </div>
      <div className="toggle-content">
        <p className="comparison-text">
          {showOriginal ? originalText : rewrittenText}
        </p>
      </div>
    </div>
  );
};

export default ComparisonView;

