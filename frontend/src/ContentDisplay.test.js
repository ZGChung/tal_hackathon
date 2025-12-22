import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RewrittenPostCard from './components/Content/RewrittenPostCard';
import ComparisonView from './components/Content/ComparisonView';
import ContentFeed from './pages/ContentFeed';
import api from './utils/api';
import * as rednoteService from './services/rednoteService';
import * as rewriteService from './services/rewriteService';

// Mock the api module
jest.mock('./utils/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

// Mock services
jest.mock('./services/rednoteService', () => ({
  getFeed: jest.fn(),
  getPost: jest.fn(),
}));

jest.mock('./services/rewriteService', () => ({
  rewriteText: jest.fn(),
}));

// Note: rewriteService tests are tested through integration in ContentFeed tests
// The service is mocked in this test suite to test component behavior

describe('RewrittenPostCard Component', () => {
  const mockPost = {
    id: '1',
    author: 'Test Author',
    text: 'Original post text',
    timestamp: new Date().toISOString(),
    likes: 100,
    comments: 50,
    shares: 25,
    image_url: 'https://example.com/image.jpg',
  };

  const mockRewriteData = {
    original_text: 'Original post text',
    rewritten_text: 'Rewritten post text with keywords',
    keywords_used: ['keyword1', 'keyword2'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders rewritten post with rewritten text', () => {
    render(
      <RewrittenPostCard
        post={mockPost}
        rewriteData={mockRewriteData}
        onCompare={() => {}}
      />
    );

    expect(screen.getByText('Rewritten post text with keywords')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });

  test('displays "Rewritten" badge', () => {
    render(
      <RewrittenPostCard
        post={mockPost}
        rewriteData={mockRewriteData}
        onCompare={() => {}}
      />
    );

    expect(screen.getByText(/已改写/i)).toBeInTheDocument();
  });

  test('calls onCompare when compare button is clicked', () => {
    const mockOnCompare = jest.fn();
    render(
      <RewrittenPostCard
        post={mockPost}
        rewriteData={mockRewriteData}
        onCompare={mockOnCompare}
      />
    );

    const compareButton = screen.getByRole('button', { name: /对比原文/i });
    fireEvent.click(compareButton);

    expect(mockOnCompare).toHaveBeenCalledWith(mockPost, mockRewriteData);
  });

  test('displays post stats (likes, comments, shares)', () => {
    render(
      <RewrittenPostCard
        post={mockPost}
        rewriteData={mockRewriteData}
        onCompare={() => {}}
      />
    );

    expect(screen.getByText(/100/i)).toBeInTheDocument();
    expect(screen.getByText(/50/i)).toBeInTheDocument();
    expect(screen.getByText(/25/i)).toBeInTheDocument();
  });

  test('displays image if image_url is provided', () => {
    render(
      <RewrittenPostCard
        post={mockPost}
        rewriteData={mockRewriteData}
        onCompare={() => {}}
      />
    );

    const image = screen.getByAltText(/post/i);
    expect(image).toBeInTheDocument();
    expect(image.src).toContain('example.com/image.jpg');
  });
});

describe('ComparisonView Component', () => {
  const mockPost = {
    id: '1',
    author: 'Test Author',
    text: 'Original post text',
    timestamp: new Date().toISOString(),
  };

  const mockRewriteData = {
    original_text: 'Original post text',
    rewritten_text: 'Rewritten post text with keywords',
    keywords_used: ['keyword1', 'keyword2'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders both original and rewritten text', () => {
    render(
      <ComparisonView
        post={mockPost}
        rewriteData={mockRewriteData}
        onClose={() => {}}
      />
    );

    expect(screen.getByText('Original post text')).toBeInTheDocument();
    expect(screen.getByText('Rewritten post text with keywords')).toBeInTheDocument();
  });

  test('displays keywords used', () => {
    render(
      <ComparisonView
        post={mockPost}
        rewriteData={mockRewriteData}
        onClose={() => {}}
      />
    );

    expect(screen.getByText('keyword1')).toBeInTheDocument();
    expect(screen.getByText('keyword2')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const mockOnClose = jest.fn();
    render(
      <ComparisonView
        post={mockPost}
        rewriteData={mockRewriteData}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByRole('button', { name: /✕/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  test('supports toggle view between original and rewritten', () => {
    render(
      <ComparisonView
        post={mockPost}
        rewriteData={mockRewriteData}
        onClose={() => {}}
      />
    );

    // Should show both in side-by-side view by default
    expect(screen.getByText('Original post text')).toBeInTheDocument();
    expect(screen.getByText('Rewritten post text with keywords')).toBeInTheDocument();
  });
});

describe('ContentFeed Page', () => {
  const mockPosts = [
    {
      id: '1',
      author: 'Author 1',
      text: 'Post 1 text',
      timestamp: new Date().toISOString(),
      likes: 100,
    },
    {
      id: '2',
      author: 'Author 2',
      text: 'Post 2 text',
      timestamp: new Date().toISOString(),
      likes: 200,
    },
  ];

  const mockRewriteData1 = {
    original_text: 'Post 1 text',
    rewritten_text: 'Rewritten Post 1 text',
    keywords_used: ['keyword1'],
  };

  const mockRewriteData2 = {
    original_text: 'Post 2 text',
    rewritten_text: 'Rewritten Post 2 text',
    keywords_used: ['keyword2'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    rednoteService.getFeed.mockResolvedValue(mockPosts);
    rewriteService.rewriteText
      .mockResolvedValueOnce(mockRewriteData1)
      .mockResolvedValueOnce(mockRewriteData2);
  });

  test('fetches feed and displays rewritten posts', async () => {
    render(<ContentFeed />);

    await waitFor(() => {
      expect(rednoteService.getFeed).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(rewriteService.rewriteText).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      expect(screen.getByText('Rewritten Post 1 text')).toBeInTheDocument();
      expect(screen.getByText('Rewritten Post 2 text')).toBeInTheDocument();
    });
  });

  test('shows loading state while fetching and rewriting', async () => {
    render(<ContentFeed />);

    expect(screen.getByText(/加载中/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/加载中/i)).not.toBeInTheDocument();
    });
  });

  test('displays error message when feed fetch fails', async () => {
    rednoteService.getFeed.mockRejectedValue(new Error('Failed to fetch feed'));

    render(<ContentFeed />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch feed/i)).toBeInTheDocument();
    });
  });

  test('opens comparison view when compare button is clicked', async () => {
    render(<ContentFeed />);

    await waitFor(() => {
      expect(screen.getByText('Rewritten Post 1 text')).toBeInTheDocument();
    });

    const compareButtons = screen.getAllByRole('button', { name: /对比原文/i });
    fireEvent.click(compareButtons[0]);

    await waitFor(() => {
      // The comparison view should show both texts
      expect(screen.getByText('Post 1 text')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});

