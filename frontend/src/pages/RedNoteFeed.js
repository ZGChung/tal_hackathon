import React, { useState, useEffect } from 'react';
import PostList from '../components/Post/PostList';
import { getFeed } from '../services/rednoteService';
import './RedNoteFeed.css';

const RedNoteFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        setError(null);
        const feedData = await getFeed();
        setPosts(feedData);
      } catch (err) {
        setError(err.message || '加载动态失败');
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="rednote-feed">
        <div className="feed-loading">
          <div className="loading-spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rednote-feed">
        <div className="feed-error">
          <p>❌ {error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rednote-feed">
      <div className="feed-header">
        <h1>小红书</h1>
        <p className="feed-subtitle">发现美好生活</p>
      </div>
      <PostList posts={posts} />
    </div>
  );
};

export default RedNoteFeed;

