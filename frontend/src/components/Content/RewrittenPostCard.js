import React from 'react';
import './RewrittenPostCard.css';

const RewrittenPostCard = ({ post, rewriteData, onCompare }) => {
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format numbers (e.g., 1234 -> 1.2k)
  const formatNumber = (num) => {
    if (num < 1000) return num.toString();
    if (num < 10000) return `${(num / 1000).toFixed(1)}k`;
    return `${(num / 1000).toFixed(1)}k`;
  };

  return (
    <div className="rewritten-post-card" data-testid="rewritten-post-card">
      <div className="post-header">
        <div className="post-avatar">
          <div className="avatar-placeholder">
            {post.author ? post.author.charAt(0) : 'U'}
          </div>
        </div>
        <div className="post-author-info">
          <div className="post-author">{post.author}</div>
          <div className="post-timestamp">{formatTimestamp(post.timestamp)}</div>
        </div>
        <div className="rewritten-badge">Rewritten</div>
      </div>
      
      <div className="post-content">
        <p className="post-text">{rewriteData.rewritten_text}</p>
        <div className="post-image-container">
          {post.image_url ? (
            <img
              src={post.image_url}
              alt="Post"
              className="post-image"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/400x300/ff6b9d/ffffff?text=${encodeURIComponent(post.author || 'Post')}`;
              }}
            />
          ) : (
            <img
              src={`https://via.placeholder.com/400x300/ff6b9d/ffffff?text=${encodeURIComponent(post.author || 'Post')}`}
              alt="Post placeholder"
              className="post-image"
            />
          )}
        </div>
      </div>
      
      <div className="post-footer">
        <div className="post-stat">
          <span className="stat-icon">❤️</span>
          <span className="stat-count">{formatNumber(post.likes || 0)}</span>
        </div>
        {post.comments !== undefined && (
          <div className="post-stat">
            <span className="stat-icon">💬</span>
            <span className="stat-count">{formatNumber(post.comments)}</span>
          </div>
        )}
        {post.shares !== undefined && (
          <div className="post-stat">
            <span className="stat-icon">🔗</span>
            <span className="stat-count">{formatNumber(post.shares)}</span>
          </div>
        )}
        <button
          className="compare-button"
          onClick={() => onCompare(post, rewriteData)}
          data-testid="compare-button"
        >
          Compare Original
        </button>
      </div>
    </div>
  );
};

export default RewrittenPostCard;

