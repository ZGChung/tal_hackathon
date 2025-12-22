import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div style={{ padding: '20px' }}>
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.username}!</p>
        <p>Role: {user?.role}</p>
        <p>This is the admin-only dashboard.</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;

