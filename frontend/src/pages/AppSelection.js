import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './AppSelection.css';

const AppSelection = ({ onAppSelect }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedApp, setSelectedApp] = useState('rednote');

  const apps = [
    {
      id: 'rednote',
      name: 'RedNote',
      description: '小红书 - 发现美好生活',
      icon: '📱',
      available: true,
    },
    {
      id: 'weibo',
      name: 'Weibo',
      description: '微博 - 随时随地发现新鲜事',
      icon: '🐦',
      available: false,
    },
    {
      id: 'douyin',
      name: 'Douyin',
      description: '抖音 - 记录美好生活',
      icon: '🎬',
      available: false,
    },
    {
      id: 'zhihu',
      name: 'Zhihu',
      description: '知乎 - 有问题，就会有答案',
      icon: '💡',
      available: false,
    },
    {
      id: 'bilibili',
      name: 'Bilibili',
      description: '哔哩哔哩 - 你感兴趣的视频都在B站',
      icon: '📺',
      available: false,
    },
  ];

  const handleAppSelect = (appId) => {
    if (appId === 'rednote') {
      setSelectedApp(appId);
      if (onAppSelect) {
        onAppSelect(appId);
      } else {
        navigate('/dashboard', { state: { selectedApp: appId } });
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-selection">
      <div className="app-selection-header">
        <div>
          <h1>Content Rewriter Dashboard</h1>
          <p className="welcome-text">Welcome, {user?.username}!</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="app-selection-content">
        <h2>Select a Platform</h2>
        <p className="subtitle">Choose a social media platform to view rewritten content</p>
        
        <div className="apps-grid">
          {apps.map((app) => (
            <div
              key={app.id}
              className={`app-card ${app.available ? 'available' : 'unavailable'} ${selectedApp === app.id ? 'selected' : ''}`}
              onClick={() => app.available && handleAppSelect(app.id)}
            >
              <div className="app-icon">{app.icon}</div>
              <div className="app-info">
                <h3>{app.name}</h3>
                <p>{app.description}</p>
              </div>
              {app.available ? (
                <div className="app-status available-badge">Available</div>
              ) : (
                <div className="app-status coming-soon-badge">Coming Soon</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppSelection;

