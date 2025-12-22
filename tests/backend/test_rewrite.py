import pytest
import os
from unittest.mock import Mock, patch, MagicMock
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.main import app
from backend.database import get_db, Base
from backend.models.user import User
from backend.models.curriculum import Curriculum
from backend.models.preferences import Preferences

# Workaround for bcrypt/passlib initialization issue
os.environ.setdefault('PASSLIB_SUPPRESS_WARNINGS', '1')


# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_rewrite.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database for each test"""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client"""
    return TestClient(app)


@pytest.fixture
def admin_user(client):
    """Create an admin user and return token"""
    client.post(
        "/api/auth/register",
        json={
            "username": "admin",
            "password": "adminpass123",
            "role": "Admin"
        }
    )
    login_response = client.post(
        "/api/auth/login",
        json={
            "username": "admin",
            "password": "adminpass123"
        }
    )
    return login_response.json()["access_token"]


@pytest.fixture
def sample_curriculum(client, db_session, admin_user):
    """Create a sample curriculum for testing"""
    # Get admin user from database
    user = db_session.query(User).filter(User.username == "admin").first()
    if not user:
        # User should exist from admin_user fixture, but ensure it does
        return None
    
    curriculum = Curriculum(
        user_id=user.id,
        filename="test_curriculum.md",
        file_path="/tmp/test_curriculum.md",
        keywords=["mathematics", "algebra", "geometry", "equations"]
    )
    db_session.add(curriculum)
    db_session.commit()
    db_session.refresh(curriculum)
    return curriculum


@pytest.fixture
def sample_preferences(client, db_session, admin_user):
    """Create sample preferences for testing"""
    # Get admin user from database
    user = db_session.query(User).filter(User.username == "admin").first()
    if not user:
        # User should exist from admin_user fixture, but ensure it does
        return None
    
    preferences = Preferences(
        user_id=user.id,
        focus_areas=["STEM", "Mathematics"],
        keywords=["learning", "education", "problem-solving"],
        subject_preferences=["Math", "Science"]
    )
    db_session.add(preferences)
    db_session.commit()
    db_session.refresh(preferences)
    return preferences


class TestLLMService:
    """Test LLM service functionality"""
    
    @patch('backend.services.llm_service.OpenAI')
    @patch.dict('os.environ', {'OPENAI_API_KEY': 'test-key'})
    def test_llm_service_rewrite_text(self, mock_openai_class):
        """Test LLM service can rewrite text"""
        from backend.services.llm_service import LLMService
        
        # Mock OpenAI client
        mock_client = MagicMock()
        mock_openai_class.return_value = mock_client
        
        # Mock the chat completion response
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "This is rewritten text with mathematics and algebra concepts."
        mock_client.chat.completions.create.return_value = mock_response
        
        # Initialize service
        service = LLMService()
        
        # Test rewrite
        result = service.rewrite_text(
            original_text="This is a simple text.",
            keywords=["mathematics", "algebra"]
        )
        
        assert result == "This is rewritten text with mathematics and algebra concepts."
        assert mock_client.chat.completions.create.called
    
    @patch('backend.services.llm_service.OpenAI')
    def test_llm_service_fallback_to_mock(self, mock_openai_class):
        """Test LLM service falls back to mock when no API key"""
        from backend.services.llm_service import LLMService
        
        # Don't set API key, so it will use mock
        with patch.dict('os.environ', {}, clear=True):
            service = LLMService()
            
            result = service.rewrite_text(
                original_text="This is a simple text.",
                keywords=["mathematics", "algebra"]
            )
            
            # Should use mock rewrite which appends keywords
            assert "mathematics" in result.lower() or "algebra" in result.lower()
            assert "This is a simple text" in result
    
    @patch('backend.services.llm_service.OpenAI')
    def test_llm_service_preserves_tone(self, mock_openai_class):
        """Test that LLM service maintains original tone"""
        from backend.services.llm_service import LLMService
        
        mock_client = MagicMock()
        mock_openai_class.return_value = mock_client
        
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "Hey! This is a fun text about mathematics!"
        mock_client.chat.completions.create.return_value = mock_response
        
        service = LLMService()
        result = service.rewrite_text(
            original_text="Hey! This is a fun text!",
            keywords=["mathematics"]
        )
        
        assert "mathematics" in result.lower()
        assert "hey" in result.lower() or "fun" in result.lower()


class TestRewriterService:
    """Test rewriter service functionality"""
    
    @patch('backend.services.rewriter.LLMService')
    def test_rewriter_combines_keywords(self, mock_llm_service_class):
        """Test that rewriter combines curriculum and preference keywords"""
        from backend.services.rewriter import RewriterService
        
        # Mock LLM service
        mock_llm_service = MagicMock()
        mock_llm_service.rewrite_text.return_value = "Rewritten text"
        mock_llm_service_class.return_value = mock_llm_service
        
        # Create rewriter service
        rewriter = RewriterService()
        
        # Test with curriculum and preference keywords
        curriculum_keywords = ["mathematics", "algebra"]
        preference_keywords = ["learning", "education"]
        
        result = rewriter.rewrite(
            original_text="Simple text",
            curriculum_keywords=curriculum_keywords,
            preference_keywords=preference_keywords
        )
        
        # Verify LLM was called with combined keywords
        assert mock_llm_service.rewrite_text.called
        call_args = mock_llm_service.rewrite_text.call_args
        assert call_args is not None
        keywords_arg = call_args[1]['keywords']
        assert "mathematics" in keywords_arg
        assert "algebra" in keywords_arg
        assert "learning" in keywords_arg
        assert "education" in keywords_arg
    
    @patch('backend.services.rewriter.LLMService')
    def test_rewriter_handles_empty_keywords(self, mock_llm_service_class):
        """Test rewriter handles empty keyword lists"""
        from backend.services.rewriter import RewriterService
        
        mock_llm_service = MagicMock()
        mock_llm_service.rewrite_text.return_value = "Rewritten text"
        mock_llm_service_class.return_value = mock_llm_service
        
        rewriter = RewriterService()
        
        result = rewriter.rewrite(
            original_text="Simple text",
            curriculum_keywords=[],
            preference_keywords=[]
        )
        
        # Should still call LLM even with empty keywords
        assert mock_llm_service.rewrite_text.called


class TestRewriteEndpoint:
    """Test rewrite endpoint"""
    
    @patch('backend.services.rewriter.LLMService')
    def test_rewrite_endpoint_success(self, mock_llm_service_class, client, admin_user, sample_curriculum, sample_preferences):
        """Test successful rewrite request"""
        # Mock LLM service
        mock_llm_service = MagicMock()
        mock_llm_service.rewrite_text.return_value = "This is rewritten text with mathematics and algebra."
        mock_llm_service_class.return_value = mock_llm_service
        
        response = client.post(
            "/api/rewrite",
            headers={"Authorization": f"Bearer {admin_user}"},
            json={
                "text": "This is a simple text.",
                "curriculum_id": sample_curriculum.id
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "original_text" in data
        assert "rewritten_text" in data
        assert "keywords_used" in data
        assert data["original_text"] == "This is a simple text."
        assert data["rewritten_text"] == "This is rewritten text with mathematics and algebra."
        assert isinstance(data["keywords_used"], list)
        assert len(data["keywords_used"]) > 0
    
    @patch('backend.services.rewriter.LLMService')
    def test_rewrite_endpoint_uses_active_curriculum(self, mock_llm_service_class, client, admin_user, sample_curriculum, sample_preferences):
        """Test rewrite uses most recent curriculum when curriculum_id not provided"""
        # Mock LLM service
        mock_llm_service = MagicMock()
        mock_llm_service.rewrite_text.return_value = "Rewritten text"
        mock_llm_service_class.return_value = mock_llm_service
        
        response = client.post(
            "/api/rewrite",
            headers={"Authorization": f"Bearer {admin_user}"},
            json={
                "text": "Simple text"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "keywords_used" in data
        # Should include curriculum keywords
        assert any(kw in data["keywords_used"] for kw in sample_curriculum.keywords)
    
    def test_rewrite_endpoint_requires_authentication(self, client):
        """Test rewrite endpoint requires authentication"""
        response = client.post(
            "/api/rewrite",
            json={
                "text": "Simple text"
            }
        )
        
        assert response.status_code == 401
    
    def test_rewrite_endpoint_requires_admin(self, client):
        """Test rewrite endpoint requires admin user"""
        # Create student user
        client.post(
            "/api/auth/register",
            json={
                "username": "student",
                "password": "studentpass123",
                "role": "Student"
            }
        )
        login_response = client.post(
            "/api/auth/login",
            json={
                "username": "student",
                "password": "studentpass123"
            }
        )
        student_token = login_response.json()["access_token"]
        
        response = client.post(
            "/api/rewrite",
            headers={"Authorization": f"Bearer {student_token}"},
            json={
                "text": "Simple text"
            }
        )
        
        assert response.status_code == 403
    
    def test_rewrite_endpoint_curriculum_not_found(self, client, admin_user):
        """Test rewrite endpoint handles non-existent curriculum"""
        response = client.post(
            "/api/rewrite",
            headers={"Authorization": f"Bearer {admin_user}"},
            json={
                "text": "Simple text",
                "curriculum_id": 99999
            }
        )
        
        assert response.status_code == 404
        assert "curriculum" in response.json()["detail"].lower()
    
    def test_rewrite_endpoint_no_curriculum_available(self, client, admin_user, sample_preferences):
        """Test rewrite endpoint handles case when no curriculum exists"""
        response = client.post(
            "/api/rewrite",
            headers={"Authorization": f"Bearer {admin_user}"},
            json={
                "text": "Simple text"
            }
        )
        
        # Should return 404 if no curriculum available
        assert response.status_code == 404

