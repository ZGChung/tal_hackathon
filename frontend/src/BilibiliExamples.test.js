import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BilibiliExamples from './pages/BilibiliExamples';
import BilibiliVideoCard from './components/Bilibili/BilibiliVideoCard';
import VideoComparison from './components/Bilibili/VideoComparison';
import * as curriculumService from './services/curriculumService';
import * as preferencesService from './services/preferencesService';
import { AuthContext } from './contexts/AuthContext';

// Mock the services
jest.mock('./services/curriculumService', () => ({
  listCurricula: jest.fn(),
  getCurriculum: jest.fn(),
}));

jest.mock('./services/preferencesService', () => ({
  getPreferences: jest.fn(),
}));

// Mock AuthContext
const mockAuthContext = {
  user: { id: 1, username: 'testuser' },
  logout: jest.fn(),
  login: jest.fn(),
  isAuthenticated: true,
  isAdmin: false,
  loading: false,
};

describe('BilibiliVideoCard Component', () => {
  const mockVideo = {
    id: 'bilibili_example_1',
    title: 'Science Experiment Tutorial',
    description: 'Original video description',
    original_video_url: 'placeholder_video_1_original.mp4',
    modified_video_url: 'placeholder_video_1_modified.mp4',
    keywords_used: ['chemistry', 'reaction', 'experiment'],
    explanation: 'This video was modified to incorporate curriculum keywords...',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders video card with title and description', () => {
    render(<BilibiliVideoCard video={mockVideo} />);

    expect(screen.getByText('Science Experiment Tutorial')).toBeInTheDocument();
    expect(screen.getByText('Original video description')).toBeInTheDocument();
  });

  test('displays original and modified video placeholders', () => {
    render(<BilibiliVideoCard video={mockVideo} />);

    const videos = screen.getAllByTestId(/video-(original|modified)/);
    expect(videos.length).toBeGreaterThan(0);
  });

  test('displays keywords used', () => {
    render(<BilibiliVideoCard video={mockVideo} />);

    expect(screen.getByText('chemistry')).toBeInTheDocument();
    expect(screen.getByText('reaction')).toBeInTheDocument();
    expect(screen.getByText('experiment')).toBeInTheDocument();
  });

  test('displays explanation text', () => {
    render(<BilibiliVideoCard video={mockVideo} />);

    expect(
      screen.getByText(/This video was modified to incorporate curriculum keywords/i)
    ).toBeInTheDocument();
  });

  test('calls onCompare when compare button is clicked', () => {
    const mockOnCompare = jest.fn();
    render(<BilibiliVideoCard video={mockVideo} onCompare={mockOnCompare} />);

    const compareButton = screen.getByRole('button', { name: /对比视频/i });
    fireEvent.click(compareButton);

    expect(mockOnCompare).toHaveBeenCalledWith(mockVideo);
  });
});

describe('VideoComparison Component', () => {
  const mockVideo = {
    id: 'bilibili_example_1',
    title: 'Science Experiment Tutorial',
    original_video_url: 'placeholder_video_1_original.mp4',
    modified_video_url: 'placeholder_video_1_modified.mp4',
    keywords_used: ['chemistry', 'reaction', 'experiment'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders both original and modified video placeholders', () => {
    render(<VideoComparison video={mockVideo} onClose={() => { }} />);

    expect(screen.getByTestId('video-original')).toBeInTheDocument();
    expect(screen.getByTestId('video-modified')).toBeInTheDocument();
  });

  test('displays video title', () => {
    render(<VideoComparison video={mockVideo} onClose={() => { }} />);

    expect(screen.getByText('Science Experiment Tutorial')).toBeInTheDocument();
  });

  test('displays keywords used', () => {
    render(<VideoComparison video={mockVideo} onClose={() => { }} />);

    expect(screen.getByText('chemistry')).toBeInTheDocument();
    expect(screen.getByText('reaction')).toBeInTheDocument();
    expect(screen.getByText('experiment')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const mockOnClose = jest.fn();
    render(<VideoComparison video={mockVideo} onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  test('supports toggle view between original and modified', () => {
    render(<VideoComparison video={mockVideo} onClose={() => { }} />);

    // Should show both videos in side-by-side view by default
    expect(screen.getByTestId('video-original')).toBeInTheDocument();
    expect(screen.getByTestId('video-modified')).toBeInTheDocument();
  });
});

describe('BilibiliExamples Page', () => {
  const mockCurricula = [
    {
      id: 1,
      subject: 'Science',
      keywords: ['chemistry', 'reaction', 'experiment', 'molecules'],
    },
  ];

  const mockPreferences = {
    id: 1,
    keywords: ['ancient history', 'civilization', 'archaeology', 'culture'],
    focus_areas: ['history'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    curriculumService.listCurricula.mockResolvedValue(mockCurricula);
    preferencesService.getPreferences.mockResolvedValue(mockPreferences);
  });

  test('renders Bilibili examples page', async () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <BilibiliExamples />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const videoCards = screen.getAllByTestId(/bilibili-video-card/i);
      expect(videoCards.length).toBe(2);
    });
  });

  test('displays video cards with content', async () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <BilibiliExamples />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/delicious 英语单词学习/i)).toBeInTheDocument();
    });
  });

  test('fetches curriculum and preferences on mount', async () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <BilibiliExamples />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(curriculumService.listCurricula).toHaveBeenCalled();
      expect(preferencesService.getPreferences).toHaveBeenCalled();
    });
  });

  test('displays two example videos', async () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <BilibiliExamples />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const videoCards = screen.getAllByTestId(/bilibili-video-card/i);
      expect(videoCards.length).toBe(2);
    });
  });

  test('shows loading state while fetching data', () => {
    curriculumService.listCurricula.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    preferencesService.getPreferences.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <BilibiliExamples />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/加载中/i)).toBeInTheDocument();
  });

  test('gracefully handles curriculum fetch failure with fallback keywords', async () => {
    curriculumService.listCurricula.mockRejectedValue(
      new Error('Failed to fetch curriculum')
    );
    preferencesService.getPreferences.mockResolvedValue(mockPreferences);

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <BilibiliExamples />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Should still display videos with fallback keywords
    await waitFor(() => {
      expect(screen.getByText(/delicious 英语单词学习/i)).toBeInTheDocument();
    });

    // Should use fallback keywords for first video
    expect(screen.getByText('delicious')).toBeInTheDocument();
  });

  test('gracefully handles preferences fetch failure with fallback keywords', async () => {
    curriculumService.listCurricula.mockResolvedValue(mockCurricula);
    preferencesService.getPreferences.mockRejectedValue(
      new Error('Failed to fetch preferences')
    );

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <BilibiliExamples />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Should still display videos with fallback keywords
    await waitFor(() => {
      expect(screen.getByText(/江城子 苏轼/i)).toBeInTheDocument();
    });

    // Should use fallback keywords for second video
    expect(screen.getByText('江城子')).toBeInTheDocument();
  });

  test('opens comparison view when compare button is clicked', async () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <BilibiliExamples />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/delicious 英语单词学习/i)).toBeInTheDocument();
    });

    const compareButtons = screen.getAllByRole('button', { name: /对比视频/i });
    fireEvent.click(compareButtons[0]);

    await waitFor(() => {
      const modal = screen.getByTestId('video-comparison-modal');
      expect(modal).toBeInTheDocument();

      // Find videos within the modal
      const originalVideo = modal.querySelector('[data-testid="video-original"]');
      const modifiedVideo = modal.querySelector('[data-testid="video-modified"]');
      expect(originalVideo).toBeInTheDocument();
      expect(modifiedVideo).toBeInTheDocument();
    });
  });

  test('closes comparison view when close button is clicked', async () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <BilibiliExamples />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/delicious 英语单词学习/i)).toBeInTheDocument();
    });

    const compareButtons = screen.getAllByRole('button', { name: /对比视频/i });
    fireEvent.click(compareButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('video-comparison-modal')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('video-comparison-modal')).not.toBeInTheDocument();
    });
  });
});

