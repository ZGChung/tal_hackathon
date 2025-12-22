import React, { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import CurriculumUpload from '../components/Admin/CurriculumUpload';
import CurriculumList from '../components/Admin/CurriculumList';
import PreferencesForm from '../components/Admin/PreferencesForm';
import '../components/Admin/Admin.css';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('upload');
  const curriculumListRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUploadSuccess = () => {
    // Refresh curriculum list when upload succeeds
    if (curriculumListRef.current && curriculumListRef.current.refresh) {
      curriculumListRef.current.refresh();
    }
    // Switch to list tab to show the updated list
    setActiveSection('list');
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1>Admin Dashboard</h1>
            <p style={{ margin: '0.5rem 0', color: '#666' }}>
              Welcome, {user?.username}! ({user?.role})
            </p>
          </div>
          <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
            Logout
          </button>
        </div>

        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeSection === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveSection('upload')}
          >
            Curriculum Upload
          </button>
          <button
            className={`admin-tab ${activeSection === 'list' ? 'active' : ''}`}
            onClick={() => setActiveSection('list')}
          >
            Curriculum List
          </button>
          <button
            className={`admin-tab ${activeSection === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveSection('preferences')}
          >
            Preferences
          </button>
        </div>

        <div className="admin-tab-content">
          {activeSection === 'upload' && (
            <CurriculumUpload onUploadSuccess={handleUploadSuccess} />
          )}
          {activeSection === 'list' && (
            <div ref={curriculumListRef}>
              <CurriculumList />
            </div>
          )}
          {activeSection === 'preferences' && <PreferencesForm />}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;

