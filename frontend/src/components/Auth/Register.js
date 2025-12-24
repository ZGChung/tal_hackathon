import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as authService from '../../services/authService';
import './Auth.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('Student');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};

        if (!username.trim()) {
            newErrors.username = '用户名是必填项';
        }

        if (!password) {
            newErrors.password = '密码是必填项';
        } else if (password.length < 6) {
            newErrors.password = '密码至少需要6个字符';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = '请确认您的密码';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = '密码不匹配';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!validate()) {
            return;
        }

        setLoading(true);

        try {
            await authService.register(username, password, role);
            // Redirect to login after successful registration
            navigate('/login', { state: { message: '注册成功！请登录。' } });
        } catch (error) {
            // Extract error message from Error object or error object
            const errorMsg = error?.message || error?.response?.data?.detail || '注册失败。请检查您的输入并重试。';
            setErrorMessage(errorMsg);
            console.error('Registration error:', error); // Debug log
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>注册</h2>
                <form onSubmit={handleSubmit}>
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

                    <div className="form-group">
                        <label htmlFor="confirmPassword">确认密码</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={errors.confirmPassword ? 'error' : ''}
                        />
                        {errors.confirmPassword && (
                            <span className="error-text">{errors.confirmPassword}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">角色</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="Student">Student</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    <button type="submit" disabled={loading} className="submit-button">
                        {loading ? '注册中...' : '注册'}
                    </button>
                </form>

                <p className="auth-link">
                    已有账号？<Link to="/login">在此登录</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

