import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import ContentFeed from './ContentFeed';

const Dashboard = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // For students, show the ContentFeed (rewriting view)
  // For admins, they should be redirected to /admin/dashboard (handled in Login.js)
  if (!isAdmin && user?.role === 'Student') {
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
            <span style={{ color: '#666', fontSize: '0.9rem' }}>
              Welcome, {user?.username}!
            </span>
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
              Logout
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
        <h1>Dashboard</h1>
        <p>Welcome, {user?.username}!</p>
        <p>Role: {user?.role}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;

