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
    // Only enter app if explicitly selected via state (user clicked)
    // Do NOT use localStorage to auto-enter - always show selection screen first
    const appFromState = location.state?.selectedApp;
    
    if (appFromState) {
      setSelectedApp(appFromState);
      localStorage.setItem('selectedApp', appFromState);
      setShowAppSelection(false);
    } else {
      // Clear any old localStorage value to ensure we show selection screen
      localStorage.removeItem('selectedApp');
      setShowAppSelection(true);
    }
    // Note: 小红书 tab is selected/highlighted by default in AppSelection component
    // but user must click to enter it (no auto-enter)
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
    // Navigate to clear location.state so it doesn't auto-enter
    navigate('/dashboard', { replace: true, state: {} });
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
        <ContentFeed onBackToApps={handleBackToApps} />
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

