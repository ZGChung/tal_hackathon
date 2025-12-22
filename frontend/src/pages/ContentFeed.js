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
          // Filter out posts that weren't actually modified
          const modifiedPosts = rewrittenData.filter(
            (item) => item && item.rewriteData && 
            item.rewriteData.original_text !== item.rewriteData.rewritten_text &&
            item.rewriteData.keywords_used && item.rewriteData.keywords_used.length > 0
          );
          
          setRewrittenPosts(modifiedPosts);
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
          <p>加载中...</p>
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
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-feed">
      <div className="feed-header">
        <h1>改写内容</h1>
        <p className="feed-subtitle">基于课程大纲改写的社交媒体内容</p>
      </div>
      <div className="rewritten-posts-list">
        {rewrittenPosts.length === 0 ? (
          <div className="post-list-empty">
            <p>暂无内容</p>
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

