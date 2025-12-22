import React from 'react';
import './PostCard.css';

const PostCard = ({ post }) => {
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
    <div className="post-card" data-testid="post-card">
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
      </div>
      
      <div className="post-content">
        <p className="post-text">{post.text}</p>
        {post.image_url && (
          <div className="post-image-container">
            <img
              src={post.image_url}
              alt="Post"
              className="post-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400?text=Image';
              }}
            />
          </div>
        )}
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
      </div>
    </div>
  );
};

export default PostCard;

