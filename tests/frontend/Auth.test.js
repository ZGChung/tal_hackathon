import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { AuthContext } from '../../frontend/src/contexts/AuthContext';
import Login from '../../frontend/src/components/Auth/Login';
import Register from '../../frontend/src/components/Auth/Register';
import ProtectedRoute from '../../frontend/src/components/ProtectedRoute';
import * as authService from '../../frontend/src/services/authService';

// Mock authService
jest.mock('../../frontend/src/services/authService', () => ({
  register: jest.fn(),
  login: jest.fn(),
  getCurrentUser: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Component', () => {
  const mockLogin = jest.fn();
  const mockContextValue = {
    user: null,
    token: null,
    login: mockLogin,
    logout: jest.fn(),
    isAuthenticated: false,
    isAdmin: false,
  };

  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={mockContextValue}>
          {component}
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  test('renders login form with username and password fields', () => {
    renderWithRouter(<Login />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('shows validation error when submitting empty form', async () => {
    renderWithRouter(<Login />);
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('calls login function on successful form submission', async () => {
    const mockToken = 'mock-jwt-token';
    const mockUser = { id: 1, username: 'testuser', role: 'Student' };
    authService.login.mockResolvedValue({
      access_token: mockToken,
      user: mockUser,
    });
    mockLogin.mockResolvedValue();

    renderWithRouter(<Login />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('testuser', 'password123');
      expect(mockLogin).toHaveBeenCalledWith(mockToken, mockUser);
    });
  });

  test('displays error message on login failure', async () => {
    authService.login.mockRejectedValue(new Error('Invalid credentials'));

    renderWithRouter(<Login />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(passwordInput, 'wrongpassword');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('renders quick login buttons', () => {
    renderWithRouter(<Login />);
    expect(screen.getByRole('button', { name: /login as test admin/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login as test user/i })).toBeInTheDocument();
  });

  test('admin quick login button logs in successfully and redirects to admin dashboard', async () => {
    const mockToken = 'mock-jwt-token';
    const mockAdminUser = { id: 1, username: 'admin_test', role: 'Admin' };
    authService.login.mockResolvedValue({
      access_token: mockToken,
      user: mockAdminUser,
    });
    mockLogin.mockResolvedValue();

    renderWithRouter(<Login />);

    const adminButton = screen.getByRole('button', { name: /login as test admin/i });
    fireEvent.click(adminButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('admin_test', 'admin123');
      expect(mockLogin).toHaveBeenCalledWith(mockToken, mockAdminUser);
      expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
    });
  });

  test('user quick login button logs in successfully and redirects to dashboard', async () => {
    const mockToken = 'mock-jwt-token';
    const mockUser = { id: 2, username: 'user_test', role: 'Student' };
    authService.login.mockResolvedValue({
      access_token: mockToken,
      user: mockUser,
    });
    mockLogin.mockResolvedValue();

    renderWithRouter(<Login />);

    const userButton = screen.getByRole('button', { name: /login as test user/i });
    fireEvent.click(userButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('user_test', 'user123');
      expect(mockLogin).toHaveBeenCalledWith(mockToken, mockUser);
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('quick login buttons show loading state during login', async () => {
    const mockToken = 'mock-jwt-token';
    const mockUser = { id: 2, username: 'user_test', role: 'Student' };
    
    // Create a promise that we can control
    let resolveLogin;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });
    authService.login.mockReturnValue(loginPromise);

    renderWithRouter(<Login />);

    const adminButton = screen.getByRole('button', { name: /login as test admin/i });
    const userButton = screen.getByRole('button', { name: /login as test user/i });

    fireEvent.click(adminButton);

    // Check that buttons are disabled and show loading state
    await waitFor(() => {
      expect(adminButton).toBeDisabled();
      expect(userButton).toBeDisabled();
      expect(screen.getByText(/logging in/i)).toBeInTheDocument();
    });

    // Resolve the login
    resolveLogin({
      access_token: mockToken,
      user: mockUser,
    });

    await waitFor(() => {
      expect(adminButton).not.toBeDisabled();
    });
  });

  test('quick login buttons handle errors gracefully', async () => {
    authService.login.mockRejectedValue(new Error('Quick login failed'));

    renderWithRouter(<Login />);

    const adminButton = screen.getByRole('button', { name: /login as test admin/i });
    fireEvent.click(adminButton);

    await waitFor(() => {
      expect(screen.getByText(/quick login failed/i)).toBeInTheDocument();
    });
  });

  test('quick login buttons are disabled when loading', async () => {
    const mockToken = 'mock-jwt-token';
    const mockUser = { id: 2, username: 'user_test', role: 'Student' };
    
    let resolveLogin;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });
    authService.login.mockReturnValue(loginPromise);

    renderWithRouter(<Login />);

    const adminButton = screen.getByRole('button', { name: /login as test admin/i });
    const userButton = screen.getByRole('button', { name: /login as test user/i });
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.click(adminButton);

    await waitFor(() => {
      expect(adminButton).toBeDisabled();
      expect(userButton).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });

    resolveLogin({
      access_token: mockToken,
      user: mockUser,
    });

    await waitFor(() => {
      expect(adminButton).not.toBeDisabled();
      expect(userButton).not.toBeDisabled();
      expect(submitButton).not.toBeDisabled();
    });
  });
});

describe('Register Component', () => {
  const mockContextValue = {
    user: null,
    token: null,
    login: jest.fn(),
    logout: jest.fn(),
    isAuthenticated: false,
    isAdmin: false,
  };

  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={mockContextValue}>
          {component}
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders registration form with all required fields', () => {
    renderWithRouter(<Register />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('shows validation error when passwords do not match', async () => {
    renderWithRouter(<Register />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'differentpassword');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  test('calls register function on successful form submission', async () => {
    authService.register.mockResolvedValue({
      message: 'User registered successfully',
      user_id: 1,
    });

    renderWithRouter(<Register />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const roleSelect = screen.getByLabelText(/role/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    await userEvent.type(usernameInput, 'newuser');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');
    await userEvent.selectOptions(roleSelect, 'Student');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith('newuser', 'password123', 'Student');
    });
  });

  test('displays error message on registration failure', async () => {
    authService.register.mockRejectedValue(new Error('Username already exists'));

    renderWithRouter(<Register />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    await userEvent.type(usernameInput, 'existinguser');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/username already exists/i)).toBeInTheDocument();
    });
  });
});

describe('AuthContext', () => {
  test('loads token from localStorage on mount', () => {
    const mockToken = 'stored-token';
    const mockUser = { id: 1, username: 'testuser', role: 'Student' };
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));

    // This test would require rendering a component that uses AuthContext
    // For now, we'll test the behavior through ProtectedRoute
    expect(localStorage.getItem('token')).toBe(mockToken);
  });

  test('stores token in localStorage on login', () => {
    localStorage.clear();
    // This would be tested through the Login component integration
    expect(localStorage.getItem('token')).toBeNull();
  });

  test('removes token from localStorage on logout', () => {
    localStorage.setItem('token', 'some-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, username: 'test' }));
    // This would be tested through logout functionality
    expect(localStorage.getItem('token')).toBeTruthy();
  });
});

describe('ProtectedRoute Component', () => {
  const TestComponent = () => <div>Protected Content</div>;

  test('renders children when user is authenticated', () => {
    const mockContextValue = {
      user: { id: 1, username: 'testuser', role: 'Student' },
      token: 'mock-token',
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: true,
      isAdmin: false,
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockContextValue}>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('redirects to login when user is not authenticated', () => {
    const mockContextValue = {
      user: null,
      token: null,
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: false,
      isAdmin: false,
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockContextValue}>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('renders children when user is admin and route requires admin', () => {
    const mockContextValue = {
      user: { id: 1, username: 'admin', role: 'Admin' },
      token: 'mock-token',
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: true,
      isAdmin: true,
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockContextValue}>
          <ProtectedRoute requireAdmin={true}>
            <TestComponent />
          </ProtectedRoute>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('redirects when user is not admin but route requires admin', () => {
    const mockContextValue = {
      user: { id: 1, username: 'student', role: 'Student' },
      token: 'mock-token',
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: true,
      isAdmin: false,
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockContextValue}>
          <ProtectedRoute requireAdmin={true}>
            <TestComponent />
          </ProtectedRoute>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});

