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
      description: 'RedNote - Discover Beautiful Life',
      icon: '📱',
      available: true,
    },
    {
      id: 'weibo',
      name: 'Weibo',
      description: 'Weibo - Discover Fresh Content Anytime',
      icon: '🐦',
      available: false,
    },
    {
      id: 'douyin',
      name: 'Douyin',
      description: 'Douyin - Record Beautiful Moments',
      icon: '🎬',
      available: false,
    },
    {
      id: 'zhihu',
      name: 'Zhihu',
      description: 'Zhihu - Questions Lead to Answers',
      icon: '💡',
      available: false,
    },
    {
      id: 'bilibili',
      name: 'Bilibili',
      description: 'Bilibili - All Videos You Love Are Here',
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

