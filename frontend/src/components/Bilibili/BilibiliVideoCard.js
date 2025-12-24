import React from 'react';
import './BilibiliVideoCard.css';

const BilibiliVideoCard = ({ video, onCompare }) => {
  return (
    <div className="bilibili-video-card" data-testid={`bilibili-video-card-${video.id}`}>
      <div className="video-card-header">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-description">{video.description}</p>
      </div>

      <div className="video-comparison-container">
        <div className="video-wrapper">
          <div className="video-label">原始</div>
          <div className="video-player-container" data-testid="video-original">
            <video
              src={video.original_video_url || undefined}
              controls
              className="video-player"
              poster=""
            >
              <div className="video-placeholder">
                <div className="placeholder-icon">▶️</div>
                <p>视频占位符 - 内容即将推出</p>
              </div>
            </video>
          </div>
        </div>

        <div className="video-wrapper">
          <div className="video-label">修改后</div>
          <div className="video-player-container" data-testid="video-modified">
            <video
              src={video.modified_video_url || undefined}
              controls
              className="video-player"
              poster=""
            >
              <div className="video-placeholder">
                <div className="placeholder-icon">▶️</div>
                <p>视频占位符 - 内容即将推出</p>
              </div>
            </video>
          </div>
        </div>
      </div>

      <div className="video-keywords-section">
        <h4 className="keywords-title">使用的关键词：</h4>
        <div className="keywords-list">
          {video.keywords_used && video.keywords_used.length > 0 ? (
            video.keywords_used.map((keyword, index) => (
              <span key={index} className="keyword-badge">
                {keyword}
              </span>
            ))
          ) : (
            <span className="no-keywords">暂无关键词</span>
          )}
        </div>
      </div>

      <div className="video-explanation">
        <p>{video.explanation}</p>
      </div>

      {onCompare && (
        <div className="video-card-footer">
          <button
            className="compare-button"
            onClick={() => onCompare(video)}
            data-testid="compare-button"
          >
            对比视频
          </button>
        </div>
      )}
    </div>
  );
};

export default BilibiliVideoCard;

