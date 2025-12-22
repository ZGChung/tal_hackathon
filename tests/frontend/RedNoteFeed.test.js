import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PostCard from '../../frontend/src/components/Post/PostCard';
import PostList from '../../frontend/src/components/Post/PostList';
import RedNoteFeed from '../../frontend/src/pages/RedNoteFeed';
import * as rednoteService from '../../frontend/src/services/rednoteService';

// Mock rednoteService
jest.mock('../../frontend/src/services/rednoteService', () => ({
  getFeed: jest.fn(),
  getPost: jest.fn(),
}));

describe('PostCard Component', () => {
  const mockPost = {
    id: 'post_001',
    author: '美食小达人',
    text: '今天做了超好吃的红烧肉！',
    image_url: 'https://via.placeholder.com/400?text=红烧肉',
    likes: 1234,
    timestamp: new Date('2024-01-01T10:00:00Z'),
    comments: 56,
    shares: 23,
  };

  test('renders post author name', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('美食小达人')).toBeInTheDocument();
  });

  test('renders post text content', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('今天做了超好吃的红烧肉！')).toBeInTheDocument();
  });

  test('renders post image', () => {
    render(<PostCard post={mockPost} />);
    const image = screen.getByAltText(/post/i);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockPost.image_url);
  });

  test('renders like count', () => {
    render(<PostCard post={mockPost} />);
    // Like count might be formatted (e.g., "1.2k" for 1234)
    expect(screen.getByText(/1234|1\.2k/i)).toBeInTheDocument();
  });

  test('renders timestamp', () => {
    // Use an old date to ensure full date format is shown
    const oldDatePost = {
      ...mockPost,
      timestamp: new Date('2020-01-01T10:00:00Z'),
    };
    render(<PostCard post={oldDatePost} />);
    // Timestamp should be displayed in some format (relative or full date)
    const timestampElement = screen.getByText(/分钟前|小时前|天前|2020|1月|Jan/i);
    expect(timestampElement).toBeInTheDocument();
  });

  test('renders comments count if provided', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText(/56/i)).toBeInTheDocument();
  });

  test('renders shares count if provided', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText(/23/i)).toBeInTheDocument();
  });
});

describe('PostList Component', () => {
  const mockPosts = [
    {
      id: 'post_001',
      author: '美食小达人',
      text: '今天做了超好吃的红烧肉！',
      image_url: 'https://via.placeholder.com/400?text=红烧肉',
      likes: 1234,
      timestamp: new Date('2024-01-01T10:00:00Z'),
      comments: 56,
      shares: 23,
    },
    {
      id: 'post_002',
      author: '旅行日记',
      text: '大理洱海边的日出真的太美了！',
      image_url: 'https://via.placeholder.com/400?text=洱海日出',
      likes: 2567,
      timestamp: new Date('2024-01-01T07:00:00Z'),
      comments: 89,
      shares: 45,
    },
  ];

  test('renders all posts in the list', () => {
    render(<PostList posts={mockPosts} />);
    expect(screen.getByText('美食小达人')).toBeInTheDocument();
    expect(screen.getByText('旅行日记')).toBeInTheDocument();
  });

  test('renders empty state when no posts', () => {
    render(<PostList posts={[]} />);
    expect(screen.getByText(/no posts|暂无内容/i)).toBeInTheDocument();
  });

  test('renders correct number of PostCard components', () => {
    const { container } = render(<PostList posts={mockPosts} />);
    const postCards = container.querySelectorAll('.post-card, [data-testid="post-card"]');
    expect(postCards.length).toBeGreaterThanOrEqual(2);
  });
});

describe('RedNoteFeed Page', () => {
  const mockContextValue = {
    user: { id: 1, username: 'testuser', role: 'Student' },
    token: 'mock-token',
    login: jest.fn(),
    logout: jest.fn(),
    isAuthenticated: true,
    isAdmin: false,
  };

  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading state initially', async () => {
    rednoteService.getFeed.mockImplementation(
      () => new Promise(() => {}) // Never resolves to keep loading state
    );

    renderWithRouter(<RedNoteFeed />);
    expect(screen.getByText(/loading|加载中/i)).toBeInTheDocument();
  });

  test('displays posts after successful fetch', async () => {
    const mockPosts = [
      {
        id: 'post_001',
        author: '美食小达人',
        text: '今天做了超好吃的红烧肉！',
        image_url: 'https://via.placeholder.com/400?text=红烧肉',
        likes: 1234,
        timestamp: '2024-01-01T10:00:00Z',
        comments: 56,
        shares: 23,
      },
    ];

    rednoteService.getFeed.mockResolvedValue(mockPosts);

    renderWithRouter(<RedNoteFeed />);

    // Wait for posts to load
    await screen.findByText('美食小达人');
    expect(screen.getByText('今天做了超好吃的红烧肉！')).toBeInTheDocument();
  });

  test('displays error message on fetch failure', async () => {
    rednoteService.getFeed.mockRejectedValue(new Error('Failed to fetch feed'));

    renderWithRouter(<RedNoteFeed />);

    await screen.findByText(/error|错误|failed/i);
    expect(screen.getByText(/error|错误|failed/i)).toBeInTheDocument();
  });

  test('calls getFeed on mount', () => {
    rednoteService.getFeed.mockResolvedValue([]);
    renderWithRouter(<RedNoteFeed />);
    expect(rednoteService.getFeed).toHaveBeenCalled();
  });
});

