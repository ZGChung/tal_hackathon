import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import RewrittenPostCard from '../components/Content/RewrittenPostCard';
import ComparisonView from '../components/Content/ComparisonView';
import { getFeed } from '../services/rednoteService';
import { rewriteText } from '../services/rewriteService';
import './ContentFeed.css';

const ContentFeed = ({ onBackToApps }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [rewrittenPosts, setRewrittenPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comparingPost, setComparingPost] = useState(null);
  const [comparingRewriteData, setComparingRewriteData] = useState(null);
  const [activeTopTab, setActiveTopTab] = useState('发现'); // 关注, 发现, 附近
  const [activeCategory, setActiveCategory] = useState('推荐'); // 推荐, 视频, 直播, 职场, 旅行, 艺术

  useEffect(() => {
    let isMounted = true;

    const fetchAndRewrite = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch posts from 小红书 feed
        const feedData = await getFeed();
        if (!isMounted) return;

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
          setError(err.message || '加载动态失败');
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

  const handleBackToApps = () => {
    if (onBackToApps) {
      onBackToApps();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
    <div className="rednote-app">
      {/* Global Buttons - Fixed at top, above all UI elements */}
      <div className="global-buttons">
        <button 
          onClick={handleBackToApps}
          className="global-btn back-btn"
        >
          ← 返回应用
        </button>
        <button 
          onClick={handleLogout}
          className="global-btn logout-btn"
        >
          退出登录
        </button>
      </div>

      {/* Top Navigation Tabs */}
      <div className="top-nav-tabs">
        <button 
          className={`nav-tab ${activeTopTab === '关注' ? 'active' : ''}`}
          onClick={() => setActiveTopTab('关注')}
        >
          关注
        </button>
        <button 
          className={`nav-tab ${activeTopTab === '发现' ? 'active' : ''}`}
          onClick={() => setActiveTopTab('发现')}
        >
          发现
        </button>
        <button 
          className={`nav-tab ${activeTopTab === '附近' ? 'active' : ''}`}
          onClick={() => setActiveTopTab('附近')}
        >
          附近
        </button>
        <div className="nav-search-icon">🔍</div>
      </div>

      {/* Category Navigation */}
      <div className="category-nav">
        <div className="category-scroll">
          <button 
            className={`category-tab ${activeCategory === '推荐' ? 'active' : ''}`}
            onClick={() => setActiveCategory('推荐')}
          >
            推荐
          </button>
          <button 
            className={`category-tab ${activeCategory === '视频' ? 'active' : ''}`}
            onClick={() => setActiveCategory('视频')}
          >
            视频
          </button>
          <button 
            className={`category-tab ${activeCategory === '直播' ? 'active' : ''}`}
            onClick={() => setActiveCategory('直播')}
          >
            直播
          </button>
          <button 
            className={`category-tab ${activeCategory === '职场' ? 'active' : ''}`}
            onClick={() => setActiveCategory('职场')}
          >
            职场
          </button>
          <button 
            className={`category-tab ${activeCategory === '旅行' ? 'active' : ''}`}
            onClick={() => setActiveCategory('旅行')}
          >
            旅行
          </button>
          <button 
            className={`category-tab ${activeCategory === '艺术' ? 'active' : ''}`}
            onClick={() => setActiveCategory('艺术')}
          >
            艺术
          </button>
          <button className="category-more">▼</button>
        </div>
      </div>

      {/* Main Content Feed */}
      <div className="content-feed-container">
        {loading ? (
          <div className="feed-loading">
            <div className="loading-spinner"></div>
            <p>加载中...</p>
          </div>
        ) : error ? (
          <div className="feed-error">
            <p>❌ {error}</p>
            <button onClick={() => window.location.reload()} className="retry-button">
              重试
            </button>
          </div>
        ) : (
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
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bottom-nav">
        <button className="bottom-nav-item active">
          <span className="nav-icon">🏠</span>
          <span className="nav-label">首页</span>
        </button>
        <button className="bottom-nav-item">
          <span className="nav-icon">🛒</span>
          <span className="nav-label">购物</span>
        </button>
        <button className="bottom-nav-item create-button">
          <span className="nav-icon">➕</span>
        </button>
        <button className="bottom-nav-item">
          <span className="nav-icon">💬</span>
          <span className="nav-label">消息</span>
          <span className="nav-badge">99+</span>
        </button>
        <button className="bottom-nav-item">
          <span className="nav-icon">👤</span>
          <span className="nav-label">我</span>
        </button>
      </div>

      {/* Comparison Modal */}
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

