import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import * as authService from '../../services/authService';
import './Auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { login: contextLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      // Check if it's a success message
      if (location.state.message.toLowerCase().includes('successful') || 
          location.state.message.toLowerCase().includes('success')) {
        setSuccessMessage(location.state.message);
      } else {
        setErrorMessage(location.state.message);
      }
    }
  }, [location]);

  const validate = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = '用户名是必填项';
    }

    if (!password) {
      newErrors.password = '密码是必填项';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage(''); // Clear success message when attempting login

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login(username, password);
      
      // Response from authService.login is already response.data from axios
      // So response should have: { access_token, token_type, user }
      console.log('Login response received:', response);
      
      // Ensure user object exists and has required fields
      if (!response || !response.user) {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response from server: missing user data');
      }
      
      // Ensure user has role
      if (!response.user.role) {
        console.error('User object missing role:', response.user);
        throw new Error('Invalid user data: missing role');
      }
      
      contextLogin(response.access_token, response.user);

      // Redirect based on role
      if (response.user.role === 'Admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      // Extract error message from Error object or error object
      const errorMsg = error?.message || error?.response?.data?.detail || '凭据无效。请检查您的用户名和密码。';
      setErrorMessage(errorMsg);
      console.error('Login error:', error); // Debug log
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (username, password) => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const response = await authService.login(username, password);
      
      // Ensure user object exists and has required fields
      if (!response || !response.user) {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response from server: missing user data');
      }
      
      // Ensure user has role
      if (!response.user.role) {
        console.error('User object missing role:', response.user);
        throw new Error('Invalid user data: missing role');
      }
      
      contextLogin(response.access_token, response.user);
      
      // Redirect based on role
      if (response.user.role === 'Admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      const errorMsg = error?.message || error?.response?.data?.detail || 'Quick login failed';
      setErrorMessage(errorMsg);
      console.error('Quick login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>登录</h2>
        <form onSubmit={handleSubmit}>
          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={errors.username ? 'error' : ''}
            />
            {errors.username && (
              <span className="error-text">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <div className="quick-login-buttons">
          <button
            type="button"
            onClick={() => handleQuickLogin('admin_test', 'admin123')}
            disabled={loading}
            className="quick-login-button"
          >
            {loading ? '登录中...' : '快速登录 (管理员)'}
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('user_test', 'user123')}
            disabled={loading}
            className="quick-login-button"
          >
            {loading ? '登录中...' : '快速登录 (学生)'}
          </button>
        </div>

        <p className="auth-link">
          还没有账号？<Link to="/register">在此注册</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

