import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { AuthContext } from '../../frontend/src/contexts/AuthContext';
import AdminDashboard from '../../frontend/src/pages/AdminDashboard';
import * as curriculumService from '../../frontend/src/services/curriculumService';
import * as preferencesService from '../../frontend/src/services/preferencesService';

// Mock services
jest.mock('../../frontend/src/services/curriculumService', () => ({
  uploadCurriculum: jest.fn(),
  listCurricula: jest.fn(),
  getCurriculum: jest.fn(),
}));

jest.mock('../../frontend/src/services/preferencesService', () => ({
  getPreferences: jest.fn(),
  createPreferences: jest.fn(),
  updatePreferences: jest.fn(),
}));

describe('AdminDashboard', () => {
  const mockAdminUser = {
    id: 1,
    username: 'admin',
    role: 'Admin',
  };

  const mockContextValue = {
    user: mockAdminUser,
    token: 'mock-token',
    login: jest.fn(),
    logout: jest.fn(),
    isAuthenticated: true,
    isAdmin: true,
    loading: false,
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

  test('renders admin dashboard with tabs/sections', () => {
    renderWithRouter(<AdminDashboard />);
    expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/curriculum upload/i)).toBeInTheDocument();
    expect(screen.getByText(/curriculum list/i)).toBeInTheDocument();
    expect(screen.getByText(/preferences/i)).toBeInTheDocument();
  });
});

describe('CurriculumUpload Component', () => {
  const mockAdminUser = {
    id: 1,
    username: 'admin',
    role: 'Admin',
  };

  const mockContextValue = {
    user: mockAdminUser,
    token: 'mock-token',
    login: jest.fn(),
    logout: jest.fn(),
    isAuthenticated: true,
    isAdmin: true,
    loading: false,
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

  test('renders file input for curriculum upload', () => {
    renderWithRouter(<AdminDashboard />);
    const fileInput = screen.getByLabelText(/upload curriculum.*markdown/i);
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('type', 'file');
    expect(fileInput).toHaveAttribute('accept', '.md');
  });

  test('uploads curriculum file on submit', async () => {
    const mockFile = new File(['# Test Curriculum\nKeywords: math, science'], 'test.md', {
      type: 'text/markdown',
    });

    const mockResponse = {
      id: 1,
      filename: 'test.md',
      keywords: ['math', 'science'],
      created_at: new Date().toISOString(),
    };

    curriculumService.uploadCurriculum.mockResolvedValue(mockResponse);

    renderWithRouter(<AdminDashboard />);

    const fileInput = screen.getByLabelText(/upload curriculum.*markdown/i);
    const uploadButton = screen.getByRole('button', { name: /^upload$/i });

    await userEvent.upload(fileInput, mockFile);
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(curriculumService.uploadCurriculum).toHaveBeenCalledWith(mockFile);
      expect(screen.getByText(/uploaded successfully/i)).toBeInTheDocument();
      expect(screen.getByText(/keywords:/i)).toBeInTheDocument();
    });
  });

  test('displays error message on upload failure', async () => {
    const mockFile = new File(['test content'], 'test.md', {
      type: 'text/markdown',
    });

    curriculumService.uploadCurriculum.mockRejectedValue(new Error('Upload failed'));

    renderWithRouter(<AdminDashboard />);

    const fileInput = screen.getByLabelText(/upload curriculum.*markdown/i);
    const uploadButton = screen.getByRole('button', { name: /^upload$/i });

    await userEvent.upload(fileInput, mockFile);
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText(/upload failed/i)).toBeInTheDocument();
    });
  });

  test('shows loading state during upload', async () => {
    const mockFile = new File(['test content'], 'test.md', {
      type: 'text/markdown',
    });

    curriculumService.uploadCurriculum.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ id: 1 }), 100))
    );

    renderWithRouter(<AdminDashboard />);

    const fileInput = screen.getByLabelText(/upload curriculum.*markdown/i);
    const uploadButton = screen.getByRole('button', { name: /^upload$/i });

    await userEvent.upload(fileInput, mockFile);
    fireEvent.click(uploadButton);

    expect(screen.getByText(/uploading\.\.\./i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/uploading\.\.\./i)).not.toBeInTheDocument();
    });
  });
});

describe('CurriculumList Component', () => {
  const mockAdminUser = {
    id: 1,
    username: 'admin',
    role: 'Admin',
  };

  const mockContextValue = {
    user: mockAdminUser,
    token: 'mock-token',
    login: jest.fn(),
    logout: jest.fn(),
    isAuthenticated: true,
    isAdmin: true,
    loading: false,
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

  test('displays list of uploaded curricula', async () => {
    const mockCurricula = [
      {
        id: 1,
        filename: 'curriculum1.md',
        keywords: ['math', 'science'],
        created_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 2,
        filename: 'curriculum2.md',
        keywords: ['history', 'english'],
        created_at: '2024-01-02T00:00:00Z',
      },
    ];

    curriculumService.listCurricula.mockResolvedValue(mockCurricula);

    renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('curriculum1.md')).toBeInTheDocument();
      expect(screen.getByText('curriculum2.md')).toBeInTheDocument();
      expect(screen.getByText(/math/i)).toBeInTheDocument();
      expect(screen.getByText(/science/i)).toBeInTheDocument();
    });
  });

  test('displays empty state when no curricula exist', async () => {
    curriculumService.listCurricula.mockResolvedValue([]);

    renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/no curricula uploaded yet/i)).toBeInTheDocument();
    });
  });
});

describe('PreferencesForm Component', () => {
  const mockAdminUser = {
    id: 1,
    username: 'admin',
    role: 'Admin',
  };

  const mockContextValue = {
    user: mockAdminUser,
    token: 'mock-token',
    login: jest.fn(),
    logout: jest.fn(),
    isAuthenticated: true,
    isAdmin: true,
    loading: false,
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

  test('renders preferences form with all fields', () => {
    preferencesService.getPreferences.mockRejectedValue({ response: { status: 404 } });

    renderWithRouter(<AdminDashboard />);

    expect(screen.getByLabelText(/focus areas/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/keywords/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject preferences/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save preferences/i })).toBeInTheDocument();
  });

  test('displays existing preferences when available', async () => {
    const mockPreferences = {
      id: 1,
      focus_areas: ['STEM', 'Arts'],
      keywords: ['innovation', 'creativity'],
      subject_preferences: ['Mathematics', 'Science'],
      created_at: '2024-01-01T00:00:00Z',
    };

    preferencesService.getPreferences.mockResolvedValue(mockPreferences);

    renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('STEM, Arts')).toBeInTheDocument();
      expect(screen.getByDisplayValue('innovation, creativity')).toBeInTheDocument();
    });
  });

  test('creates new preferences on submit', async () => {
    preferencesService.getPreferences.mockRejectedValue({ response: { status: 404 } });
    const mockResponse = {
      id: 1,
      focus_areas: ['STEM'],
      keywords: ['innovation'],
      subject_preferences: ['Math'],
      created_at: new Date().toISOString(),
    };

    preferencesService.createPreferences.mockResolvedValue(mockResponse);

    renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      const focusAreasInput = screen.getByLabelText(/focus areas.*comma/i);
      const keywordsInput = screen.getByLabelText(/keywords.*comma/i);
      const subjectPreferencesInput = screen.getByLabelText(/subject preferences.*comma/i);
      const saveButton = screen.getByRole('button', { name: /save preferences/i });

      userEvent.clear(focusAreasInput);
      userEvent.type(focusAreasInput, 'STEM');
      userEvent.clear(keywordsInput);
      userEvent.type(keywordsInput, 'innovation');
      userEvent.clear(subjectPreferencesInput);
      userEvent.type(subjectPreferencesInput, 'Math');
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(preferencesService.createPreferences).toHaveBeenCalledWith({
        focus_areas: ['STEM'],
        keywords: ['innovation'],
        subject_preferences: ['Math'],
      });
      expect(screen.getByText(/preferences saved successfully/i)).toBeInTheDocument();
    });
  });

  test('updates existing preferences on submit', async () => {
    const existingPreferences = {
      id: 1,
      focus_areas: ['STEM'],
      keywords: ['innovation'],
      subject_preferences: ['Math'],
      created_at: '2024-01-01T00:00:00Z',
    };

    preferencesService.getPreferences.mockResolvedValue(existingPreferences);
    const mockUpdateResponse = {
      ...existingPreferences,
      focus_areas: ['STEM', 'Arts'],
    };

    preferencesService.updatePreferences.mockResolvedValue(mockUpdateResponse);

    renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      const focusAreasInput = screen.getByLabelText(/focus areas.*comma/i);
      const saveButton = screen.getByRole('button', { name: /save preferences/i });

      userEvent.clear(focusAreasInput);
      userEvent.type(focusAreasInput, 'STEM, Arts');
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(preferencesService.updatePreferences).toHaveBeenCalled();
      expect(screen.getByText(/preferences updated successfully/i)).toBeInTheDocument();
    });
  });

  test('displays error message on save failure', async () => {
    preferencesService.getPreferences.mockRejectedValue({ response: { status: 404 } });
    preferencesService.createPreferences.mockRejectedValue(new Error('Save failed'));

    renderWithRouter(<AdminDashboard />);

    const saveButton = screen.getByRole('button', { name: /save preferences/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/save failed/i)).toBeInTheDocument();
    });
  });
});
