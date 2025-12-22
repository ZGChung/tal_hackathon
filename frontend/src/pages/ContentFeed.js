import React, { useState, useEffect } from 'react';
import RewrittenPostCard from '../components/Content/RewrittenPostCard';
import ComparisonView from '../components/Content/ComparisonView';
import { getFeed } from '../services/rednoteService';
import { rewriteText } from '../services/rewriteService';
import './ContentFeed.css';

const ContentFeed = () => {
  const [posts, setPosts] = useState([]);
  const [rewrittenPosts, setRewrittenPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comparingPost, setComparingPost] = useState(null);
  const [comparingRewriteData, setComparingRewriteData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAndRewrite = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch posts from RedNote feed
        const feedData = await getFeed();
        if (!isMounted) return;
        
        setPosts(feedData);

        // Rewrite each post
        const rewrittenData = await Promise.all(
          feedData.map(async (post) => {
            try {
              const rewriteData = await rewriteText(post.text);
              if (!isMounted) return null;
              return {
                post,
                rewriteData,
              };
            } catch (err) {
              console.error(`Failed to rewrite post ${post.id}:`, err);
              if (!isMounted) return null;
              // Return original post if rewrite fails
              return {
                post,
                rewriteData: {
                  original_text: post.text,
                  rewritten_text: post.text,
                  keywords_used: [],
                },
              };
            }
          })
        );

        if (isMounted) {
          // Filter out null items, but show all posts (even if not modified)
          const validPosts = rewrittenData.filter(
            (item) => item && item.rewriteData
          );
          
          setRewrittenPosts(validPosts);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load feed');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAndRewrite();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCompare = (post, rewriteData) => {
    setComparingPost(post);
    setComparingRewriteData(rewriteData);
  };

  const handleCloseComparison = () => {
    setComparingPost(null);
    setComparingRewriteData(null);
  };

  if (loading) {
    return (
      <div className="content-feed">
        <div className="feed-loading">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-feed">
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
    <div className="content-feed">
      <div className="feed-header">
        <h1>Rewritten Content</h1>
        <p className="feed-subtitle">Social media content rewritten based on curriculum</p>
      </div>
      <div className="rewritten-posts-list">
        {rewrittenPosts.length === 0 ? (
          <div className="post-list-empty">
            <p>No content available</p>
          </div>
        ) : (
          rewrittenPosts.map(({ post, rewriteData }) => (
            <RewrittenPostCard
              key={post.id}
              post={post}
              rewriteData={rewriteData}
              onCompare={handleCompare}
            />
          ))
        )}
      </div>
      {comparingPost && comparingRewriteData && (
        <ComparisonView
          post={comparingPost}
          rewriteData={comparingRewriteData}
          onClose={handleCloseComparison}
        />
      )}
    </div>
  );
};

export default ContentFeed;

