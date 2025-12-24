import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import AppSelection from './AppSelection';
import ContentFeed from './ContentFeed';

const Dashboard = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showAppSelection, setShowAppSelection] = useState(true);
  // selectedApp is stored in localStorage but not used in render
  const [, setSelectedApp] = useState(null);

  useEffect(() => {
    // Check if app was selected from URL or state
    const appFromState = location.state?.selectedApp;
    const appFromStorage = localStorage.getItem('selectedApp');
    
    // Auto-select RedNote on first load if no app is selected
    if (appFromState || appFromStorage) {
      setSelectedApp(appFromState || appFromStorage);
      setShowAppSelection(false);
    } else if (!isAdmin && user?.role === 'Student') {
      // Auto-select RedNote for students on first visit
      setSelectedApp('rednote');
      localStorage.setItem('selectedApp', 'rednote');
      setShowAppSelection(false);
    }
  }, [location, isAdmin, user]);

  const handleAppSelect = (appId) => {
    setSelectedApp(appId);
    localStorage.setItem('selectedApp', appId);
    setShowAppSelection(false);
  };

  const handleBackToApps = () => {
    setShowAppSelection(true);
    setSelectedApp(null);
    localStorage.removeItem('selectedApp');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // For admins, they should be redirected to /admin/dashboard (handled in Login.js)
  if (isAdmin) {
    return (
      <ProtectedRoute>
        <div style={{ padding: '20px' }}>
          <h1>仪表板</h1>
          <p>欢迎，{user?.username}！</p>
          <p>角色：{user?.role}</p>
          <button onClick={handleLogout}>退出登录</button>
        </div>
      </ProtectedRoute>
    );
  }

  // For students, show app selection or content feed
  if (!isAdmin && user?.role === 'Student') {
    if (showAppSelection) {
      return (
        <ProtectedRoute>
          <AppSelection onAppSelect={handleAppSelect} />
        </ProtectedRoute>
      );
    }

    return (
      <ProtectedRoute>
        <div style={{ position: 'relative' }}>
          <div style={{ 
            position: 'absolute', 
            top: '20px', 
            right: '20px', 
            zIndex: 1000,
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
          }}>
            <button 
              onClick={handleBackToApps}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              ← 返回应用
            </button>
            <button 
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              退出登录
            </button>
          </div>
          <ContentFeed />
        </div>
      </ProtectedRoute>
    );
  }

  // Fallback for other roles or edge cases
  return (
    <ProtectedRoute>
      <div style={{ padding: '20px' }}>
        <h1>仪表板</h1>
        <p>欢迎，{user?.username}！</p>
        <p>角色：{user?.role}</p>
        <button onClick={handleLogout}>退出登录</button>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;

