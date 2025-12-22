import React from 'react';
import './Loading.css';

const Loading = ({ message = '加载中...', size = 'medium', fullScreen = false }) => {
  const sizeClass = `loading-spinner-${size}`;
  const containerClass = fullScreen ? 'loading-fullscreen' : 'loading-container';

  return (
    <div className={containerClass}>
      <div className="loading-content">
        <div className={`loading-spinner ${sizeClass}`}></div>
        {message && <p className="loading-message">{message}</p>}
      </div>
    </div>
  );
};

export default Loading;

