import React, { useState } from 'react';
import './VideoComparison.css';

const VideoComparison = ({ video, onClose }) => {
  const [viewMode, setViewMode] = useState('side-by-side'); // 'side-by-side' or 'toggle'
  const [toggleVideo, setToggleVideo] = useState('original'); // 'original' or 'modified'

  return (
    <div className="video-comparison-modal" data-testid="video-comparison-modal">
      <div className="video-comparison-content">
        <div className="comparison-header">
          <h2 className="comparison-title">{video.title}</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close comparison"
          >
            ✕
          </button>
        </div>

        <div className="view-mode-toggle">
          <button
            className={`toggle-btn ${viewMode === 'side-by-side' ? 'active' : ''}`}
            onClick={() => setViewMode('side-by-side')}
          >
            并排显示
          </button>
          <button
            className={`toggle-btn ${viewMode === 'toggle' ? 'active' : ''}`}
            onClick={() => setViewMode('toggle')}
          >
            切换视图
          </button>
        </div>

        {viewMode === 'side-by-side' ? (
          <div className="side-by-side-videos">
            <div className="comparison-video-wrapper">
              <div className="comparison-video-label">原始视频</div>
              <div className="comparison-video-container" data-testid="video-original">
                <video
                  src={video.original_video_url || undefined}
                  controls
                  className="comparison-video-player"
                >
                  <div className="video-placeholder">
                    <div className="placeholder-icon">▶️</div>
                    <p>视频占位符 - 内容即将推出</p>
                  </div>
                </video>
              </div>
            </div>

            <div className="comparison-video-wrapper">
              <div className="comparison-video-label">修改后视频</div>
              <div className="comparison-video-container" data-testid="video-modified">
                <video
                  src={video.modified_video_url || undefined}
                  controls
                  className="comparison-video-player"
                >
                  <div className="video-placeholder">
                    <div className="placeholder-icon">▶️</div>
                    <p>视频占位符 - 内容即将推出</p>
                  </div>
                </video>
              </div>
            </div>
          </div>
        ) : (
          <div className="toggle-video-view">
            <div className="toggle-controls">
              <button
                className={`toggle-video-btn ${toggleVideo === 'original' ? 'active' : ''}`}
                onClick={() => setToggleVideo('original')}
              >
                显示原始
              </button>
              <button
                className={`toggle-video-btn ${toggleVideo === 'modified' ? 'active' : ''}`}
                onClick={() => setToggleVideo('modified')}
              >
                显示修改后
              </button>
            </div>
            <div className="toggle-video-container">
              {toggleVideo === 'original' ? (
                <div className="comparison-video-container" data-testid="video-original">
                  <video
                    src={video.original_video_url || undefined}
                    controls
                    className="comparison-video-player"
                  >
                    <div className="video-placeholder">
                      <div className="placeholder-icon">▶️</div>
                      <p>视频占位符 - 内容即将推出</p>
                    </div>
                  </video>
                </div>
              ) : (
                <div className="comparison-video-container" data-testid="video-modified">
                  <video
                    src={video.modified_video_url || undefined}
                    controls
                    className="comparison-video-player"
                  >
                    <div className="video-placeholder">
                      <div className="placeholder-icon">▶️</div>
                      <p>视频占位符 - 内容即将推出</p>
                    </div>
                  </video>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="comparison-keywords">
          <h3 className="comparison-keywords-title">使用的关键词：</h3>
          <div className="comparison-keywords-list">
            {video.keywords_used && video.keywords_used.length > 0 ? (
              video.keywords_used.map((keyword, index) => (
                <span key={index} className="comparison-keyword-badge">
                  {keyword}
                </span>
              ))
            ) : (
              <span className="no-keywords">暂无关键词</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoComparison;

