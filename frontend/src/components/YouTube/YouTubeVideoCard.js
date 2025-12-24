import React from 'react';
import './YouTubeVideoCard.css';

const YouTubeVideoCard = ({ video, onCompare }) => {
  return (
    <div className="youtube-video-card" data-testid={`youtube-video-card-${video.id}`}>
      <div className="video-card-header">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-description">{video.description}</p>
      </div>

      <div className="video-comparison-container">
        <div className="video-wrapper">
          <div className="video-label">Original</div>
          <div className="video-player-container" data-testid="video-original">
            <video
              src={video.original_video_url || undefined}
              controls
              className="video-player"
              poster=""
            >
              <div className="video-placeholder">
                <div className="placeholder-icon">▶️</div>
                <p>Video placeholder - Content coming soon</p>
              </div>
            </video>
          </div>
        </div>

        <div className="video-wrapper">
          <div className="video-label">Modified</div>
          <div className="video-player-container" data-testid="video-modified">
            <video
              src={video.modified_video_url || undefined}
              controls
              className="video-player"
              poster=""
            >
              <div className="video-placeholder">
                <div className="placeholder-icon">▶️</div>
                <p>Video placeholder - Content coming soon</p>
              </div>
            </video>
          </div>
        </div>
      </div>

      <div className="video-keywords-section">
        <h4 className="keywords-title">Keywords Used:</h4>
        <div className="keywords-list">
          {video.keywords_used && video.keywords_used.length > 0 ? (
            video.keywords_used.map((keyword, index) => (
              <span key={index} className="keyword-badge">
                {keyword}
              </span>
            ))
          ) : (
            <span className="no-keywords">No keywords available</span>
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
            Compare Videos
          </button>
        </div>
      )}
    </div>
  );
};

export default YouTubeVideoCard;

