import pytest
from datetime import datetime
from fastapi.testclient import TestClient
from backend.main import app
from backend.services.platform_adapter import PlatformAdapter
from backend.services.mock_rednote import MockRedNoteAdapter
from backend.schemas.post import Post

client = TestClient(app)


class TestPlatformAdapter:
    """Tests for the abstract PlatformAdapter interface"""
    
    def test_adapter_is_abstract(self):
        """Test that PlatformAdapter cannot be instantiated directly"""
        with pytest.raises(TypeError):
            PlatformAdapter()
    
    def test_adapter_has_get_feed_method(self):
        """Test that PlatformAdapter has get_feed abstract method"""
        assert hasattr(PlatformAdapter, 'get_feed')
        assert getattr(PlatformAdapter.get_feed, '__isabstractmethod__', False)
    
    def test_adapter_has_get_post_method(self):
        """Test that PlatformAdapter has get_post abstract method"""
        assert hasattr(PlatformAdapter, 'get_post')
        assert getattr(PlatformAdapter.get_post, '__isabstractmethod__', False)


class TestMockRedNoteAdapter:
    """Tests for MockRedNoteAdapter implementation"""
    
    def test_mock_adapter_implements_interface(self):
        """Test that MockRedNoteAdapter implements PlatformAdapter"""
        adapter = MockRedNoteAdapter()
        assert isinstance(adapter, PlatformAdapter)
    
    def test_get_feed_returns_list(self):
        """Test that get_feed returns a list of posts"""
        adapter = MockRedNoteAdapter()
        feed = adapter.get_feed()
        assert isinstance(feed, list)
        assert len(feed) == 6  # Should have exactly 6 posts
    
    def test_get_feed_returns_posts(self):
        """Test that get_feed returns Post objects"""
        adapter = MockRedNoteAdapter()
        feed = adapter.get_feed()
        assert len(feed) > 0
        for post in feed:
            assert isinstance(post, Post)
    
    def test_post_structure(self):
        """Test that posts have required fields"""
        adapter = MockRedNoteAdapter()
        feed = adapter.get_feed()
        assert len(feed) > 0
        
        post = feed[0]
        assert hasattr(post, 'id')
        assert hasattr(post, 'author')
        assert hasattr(post, 'text')
        assert hasattr(post, 'image_url')
        assert hasattr(post, 'likes')
        assert hasattr(post, 'timestamp')
        
        assert isinstance(post.id, str)
        assert isinstance(post.author, str)
        assert isinstance(post.text, str)
        assert isinstance(post.image_url, str)
        assert isinstance(post.likes, int)
        assert isinstance(post.timestamp, datetime)
    
    def test_posts_have_chinese_or_english(self):
        """Test that posts contain Chinese or English text"""
        adapter = MockRedNoteAdapter()
        feed = adapter.get_feed()
        assert len(feed) > 0
        
        # Check that at least some posts have Chinese characters
        has_chinese = False
        has_english = False
        for post in feed:
            # Check for Chinese characters (Unicode range)
            if any('\u4e00' <= char <= '\u9fff' for char in post.text):
                has_chinese = True
            # Check for English (basic Latin characters)
            if any(char.isalpha() and ord(char) < 128 for char in post.text):
                has_english = True
        
        assert has_chinese, "At least some posts should contain Chinese text"
        assert has_english, "At least some posts should contain English text"
    
    def test_get_post_by_id(self):
        """Test that get_post returns a post by ID"""
        adapter = MockRedNoteAdapter()
        feed = adapter.get_feed()
        assert len(feed) > 0
        
        post_id = feed[0].id
        post = adapter.get_post(post_id)
        
        assert isinstance(post, Post)
        assert post.id == post_id
    
    def test_get_post_nonexistent(self):
        """Test that get_post raises error for nonexistent post"""
        adapter = MockRedNoteAdapter()
        with pytest.raises(ValueError, match="Post not found"):
            adapter.get_post("nonexistent_id")
    
    def test_feed_has_realistic_data(self):
        """Test that feed has realistic metadata"""
        adapter = MockRedNoteAdapter()
        feed = adapter.get_feed()
        assert len(feed) > 0
        
        for post in feed:
            assert post.likes >= 0
            assert len(post.author) > 0
            assert len(post.text) > 0
            assert post.image_url.startswith('http')


class TestRedNoteEndpoints:
    """Tests for RedNote API endpoints"""
    
    def test_get_feed_endpoint(self):
        """Test GET /api/rednote/feed endpoint"""
        response = client.get("/api/rednote/feed")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 6  # Should have exactly 6 posts
    
    def test_feed_endpoint_returns_valid_posts(self):
        """Test that feed endpoint returns valid post structure"""
        response = client.get("/api/rednote/feed")
        assert response.status_code == 200
        
        posts = response.json()
        assert len(posts) > 0
        
        # Check first post structure
        post = posts[0]
        assert "id" in post
        assert "author" in post
        assert "text" in post
        assert "image_url" in post
        assert "likes" in post
        assert "timestamp" in post
        assert isinstance(post["id"], str)
        assert isinstance(post["author"], str)
        assert isinstance(post["text"], str)
        assert isinstance(post["image_url"], str)
        assert isinstance(post["likes"], int)
    
    def test_get_post_endpoint(self):
        """Test GET /api/rednote/posts/{id} endpoint"""
        # First get a post ID from feed
        feed_response = client.get("/api/rednote/feed")
        assert feed_response.status_code == 200
        posts = feed_response.json()
        assert len(posts) > 0
        
        post_id = posts[0]["id"]
        
        # Get single post
        response = client.get(f"/api/rednote/posts/{post_id}")
        assert response.status_code == 200
        
        post = response.json()
        assert post["id"] == post_id
        assert "author" in post
        assert "text" in post
        assert "image_url" in post
        assert "likes" in post
        assert "timestamp" in post
    
    def test_get_post_nonexistent(self):
        """Test GET /api/rednote/posts/{id} with nonexistent ID"""
        response = client.get("/api/rednote/posts/nonexistent_id")
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

