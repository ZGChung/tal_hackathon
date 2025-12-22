import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

