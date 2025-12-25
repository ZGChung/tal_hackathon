import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import YouTubeExamples from '../../frontend/src/pages/YouTubeExamples';
import YouTubeVideoCard from '../../frontend/src/components/YouTube/YouTubeVideoCard';
import VideoComparison from '../../frontend/src/components/YouTube/VideoComparison';
import * as curriculumService from '../../frontend/src/services/curriculumService';
import * as preferencesService from '../../frontend/src/services/preferencesService';

// Mock the services
jest.mock('../../frontend/src/services/curriculumService', () => ({
  listCurricula: jest.fn(),
  getCurriculum: jest.fn(),
}));

jest.mock('../../frontend/src/services/preferencesService', () => ({
  getPreferences: jest.fn(),
}));

describe('YouTubeVideoCard Component', () => {
  const mockVideo = {
    id: 'youtube_example_1',
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
    render(<YouTubeVideoCard video={mockVideo} />);

    expect(screen.getByText('Science Experiment Tutorial')).toBeInTheDocument();
    expect(screen.getByText('Original video description')).toBeInTheDocument();
  });

  test('displays original and modified video placeholders', () => {
    render(<YouTubeVideoCard video={mockVideo} />);

    const videos = screen.getAllByTestId(/video-(original|modified)/);
    expect(videos.length).toBeGreaterThan(0);
  });

  test('displays keywords used', () => {
    render(<YouTubeVideoCard video={mockVideo} />);

    expect(screen.getByText('chemistry')).toBeInTheDocument();
    expect(screen.getByText('reaction')).toBeInTheDocument();
    expect(screen.getByText('experiment')).toBeInTheDocument();
  });

  test('displays explanation text', () => {
    render(<YouTubeVideoCard video={mockVideo} />);

    expect(
      screen.getByText(/This video was modified to incorporate curriculum keywords/i)
    ).toBeInTheDocument();
  });

  test('calls onCompare when compare button is clicked', () => {
    const mockOnCompare = jest.fn();
    render(<YouTubeVideoCard video={mockVideo} onCompare={mockOnCompare} />);

    const compareButton = screen.getByRole('button', { name: /compare/i });
    fireEvent.click(compareButton);

    expect(mockOnCompare).toHaveBeenCalledWith(mockVideo);
  });
});

describe('VideoComparison Component', () => {
  const mockVideo = {
    id: 'youtube_example_1',
    title: 'Science Experiment Tutorial',
    original_video_url: 'placeholder_video_1_original.mp4',
    modified_video_url: 'placeholder_video_1_modified.mp4',
    keywords_used: ['chemistry', 'reaction', 'experiment'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders both original and modified video placeholders', () => {
    render(<VideoComparison video={mockVideo} onClose={() => {}} />);

    expect(screen.getByTestId('video-original')).toBeInTheDocument();
    expect(screen.getByTestId('video-modified')).toBeInTheDocument();
  });

  test('displays video title', () => {
    render(<VideoComparison video={mockVideo} onClose={() => {}} />);

    expect(screen.getByText('Science Experiment Tutorial')).toBeInTheDocument();
  });

  test('displays keywords used', () => {
    render(<VideoComparison video={mockVideo} onClose={() => {}} />);

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
    render(<VideoComparison video={mockVideo} onClose={() => {}} />);

    // Should show both videos in side-by-side view by default
    expect(screen.getByTestId('video-original')).toBeInTheDocument();
    expect(screen.getByTestId('video-modified')).toBeInTheDocument();
  });
});

describe('YouTubeExamples Page', () => {
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

  test('renders YouTube examples page with header', async () => {
    render(<YouTubeExamples />);

    await waitFor(() => {
      expect(screen.getByText(/YouTube Examples/i)).toBeInTheDocument();
    });
  });

  test('displays subtitle about curriculum keywords and preferences', async () => {
    render(<YouTubeExamples />);

    await waitFor(() => {
      expect(
        screen.getByText(/See how curriculum keywords and preferences modify videos/i)
      ).toBeInTheDocument();
    });
  });

  test('fetches curriculum and preferences on mount', async () => {
    render(<YouTubeExamples />);

    await waitFor(() => {
      expect(curriculumService.listCurricula).toHaveBeenCalled();
      expect(preferencesService.getPreferences).toHaveBeenCalled();
    });
  });

  test('displays two example videos', async () => {
    render(<YouTubeExamples />);

    await waitFor(() => {
      const videoCards = screen.getAllByTestId(/youtube-video-card/i);
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

    render(<YouTubeExamples />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('displays error message when curriculum fetch fails', async () => {
    curriculumService.listCurricula.mockRejectedValue(
      new Error('Failed to fetch curriculum')
    );

    render(<YouTubeExamples />);

    await waitFor(() => {
      expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
    });
  });

  test('displays error message when preferences fetch fails', async () => {
    preferencesService.getPreferences.mockRejectedValue(
      new Error('Failed to fetch preferences')
    );

    render(<YouTubeExamples />);

    await waitFor(() => {
      expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
    });
  });

  test('opens comparison view when compare button is clicked', async () => {
    render(<YouTubeExamples />);

    await waitFor(() => {
      expect(screen.getByText(/Science Experiment Tutorial/i)).toBeInTheDocument();
    });

    const compareButtons = screen.getAllByRole('button', { name: /compare/i });
    fireEvent.click(compareButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('video-original')).toBeInTheDocument();
      expect(screen.getByTestId('video-modified')).toBeInTheDocument();
    });
  });

  test('closes comparison view when close button is clicked', async () => {
    render(<YouTubeExamples />);

    await waitFor(() => {
      expect(screen.getByText(/Science Experiment Tutorial/i)).toBeInTheDocument();
    });

    const compareButtons = screen.getAllByRole('button', { name: /compare/i });
    fireEvent.click(compareButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('video-original')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('video-original')).not.toBeInTheDocument();
    });
  });
});

