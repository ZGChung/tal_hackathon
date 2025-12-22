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
        setError(err.message || 'Failed to load feed');
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
          <p>Loading...</p>
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
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rednote-feed">
      <div className="feed-header">
        <h1>RedNote</h1>
        <p className="feed-subtitle">Discover Beautiful Life</p>
      </div>
      <PostList posts={posts} />
    </div>
  );
};

export default RedNoteFeed;

