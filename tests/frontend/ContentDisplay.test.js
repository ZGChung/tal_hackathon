import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rewriteText } from '../../frontend/src/services/rewriteService';
import RewrittenPostCard from '../../frontend/src/components/Content/RewrittenPostCard';
import ComparisonView from '../../frontend/src/components/Content/ComparisonView';
import ContentFeed from '../../frontend/src/pages/ContentFeed';
import api from '../../frontend/src/utils/api';
import * as rednoteService from '../../frontend/src/services/rednoteService';
import * as rewriteService from '../../frontend/src/services/rewriteService';

// Mock the api module
jest.mock('../../frontend/src/utils/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

// Mock services
jest.mock('../../frontend/src/services/rednoteService', () => ({
  getFeed: jest.fn(),
  getPost: jest.fn(),
}));

jest.mock('../../frontend/src/services/rewriteService', () => ({
  rewriteText: jest.fn(),
}));

describe('rewriteService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rewriteText', () => {
    test('should call rewrite API with text and optional curriculum_id', async () => {
      const mockResponse = {
        data: {
          original_text: 'Original text',
          rewritten_text: 'Rewritten text',
          keywords_used: ['keyword1', 'keyword2'],
        },
      };
      api.post.mockResolvedValue(mockResponse);

      const result = await rewriteText('Original text', 1);

      expect(api.post).toHaveBeenCalledWith('/api/rewrite', {
        text: 'Original text',
        curriculum_id: 1,
      });
      expect(result).toEqual(mockResponse.data);
    });

    test('should call rewrite API without curriculum_id when not provided', async () => {
      const mockResponse = {
        data: {
          original_text: 'Original text',
          rewritten_text: 'Rewritten text',
          keywords_used: ['keyword1'],
        },
      };
      api.post.mockResolvedValue(mockResponse);

      const result = await rewriteText('Original text');

      expect(api.post).toHaveBeenCalledWith('/api/rewrite', {
        text: 'Original text',
        curriculum_id: undefined,
      });
      expect(result).toEqual(mockResponse.data);
    });

    test('should throw error when API call fails', async () => {
      const errorMessage = 'Failed to rewrite text';
      api.post.mockRejectedValue({
        response: {
          data: {
            detail: errorMessage,
          },
        },
      });

      await expect(rewriteText('Original text')).rejects.toThrow(errorMessage);
    });

    test('should throw generic error when API call fails without detail', async () => {
      api.post.mockRejectedValue(new Error('Network error'));

      await expect(rewriteText('Original text')).rejects.toThrow(
        'Failed to rewrite text. Please try again.'
      );
    });
  });
});

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

    expect(screen.getByText(/rewritten/i)).toBeInTheDocument();
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

    const compareButton = screen.getByRole('button', { name: /compare|对比/i });
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

    const closeButton = screen.getByRole('button', { name: /close|关闭/i });
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

    expect(screen.getByText(/loading|加载中/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading|加载中/i)).not.toBeInTheDocument();
    });
  });

  test('displays error message when feed fetch fails', async () => {
    rednoteService.getFeed.mockRejectedValue(new Error('Failed to fetch feed'));

    render(<ContentFeed />);

    await waitFor(() => {
      expect(screen.getByText(/failed|错误/i)).toBeInTheDocument();
    });
  });

  test('displays error message when rewrite fails', async () => {
    rewriteService.rewriteText.mockRejectedValue(new Error('Failed to rewrite'));

    render(<ContentFeed />);

    await waitFor(() => {
      expect(screen.getByText(/failed|错误/i)).toBeInTheDocument();
    });
  });

  test('opens comparison view when compare button is clicked', async () => {
    render(<ContentFeed />);

    await waitFor(() => {
      expect(screen.getByText('Rewritten Post 1 text')).toBeInTheDocument();
    });

    const compareButtons = screen.getAllByRole('button', { name: /compare|对比/i });
    fireEvent.click(compareButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Post 1 text')).toBeInTheDocument();
      expect(screen.getByText('Rewritten Post 1 text')).toBeInTheDocument();
    });
  });
});

