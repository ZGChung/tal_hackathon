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
      name: '小红书',
      description: '小红书 - 发现美好生活',
      icon: '📱',
      available: true,
    },
    {
      id: 'weibo',
      name: '微博',
      description: '微博 - 随时随地发现新鲜内容',
      icon: '🐦',
      available: false,
    },
    {
      id: 'douyin',
      name: '抖音',
      description: '抖音 - 记录美好时刻',
      icon: '🎬',
      available: false,
    },
    {
      id: 'zhihu',
      name: '知乎',
      description: '知乎 - 有问题，就会有答案',
      icon: '💡',
      available: false,
    },
    {
      id: 'bilibili',
      name: 'Bilibili',
      description: '哔哩哔哩 - 你感兴趣的视频都在B站',
      icon: '📺',
      available: true,
    },
  ];

  const handleAppSelect = (appId) => {
    setSelectedApp(appId);
    if (appId === 'rednote') {
      if (onAppSelect) {
        onAppSelect(appId);
      } else {
        navigate('/dashboard', { state: { selectedApp: appId } });
      }
    } else if (appId === 'bilibili') {
      navigate('/bilibili-examples');
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
          <h1>信息流平台选择器</h1>
          <p className="welcome-text">欢迎，{user?.username}！</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          退出登录
        </button>
      </div>

      <div className="app-selection-content">
        <h2>选择平台</h2>
        <p className="subtitle">选择一个社交媒体平台以查看重写后的内容</p>
        
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
                <div className="app-status available-badge">可用</div>
              ) : (
                <div className="app-status coming-soon-badge">即将推出</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppSelection;

