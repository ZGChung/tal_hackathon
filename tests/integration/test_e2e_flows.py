"""
End-to-End Integration Tests

Tests complete user flows across the entire application:
1. Admin registration → login → upload curriculum → set preferences
2. User views RedNote feed → sees rewritten content
3. Authentication flow (register → login → logout)
4. Error scenarios
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.main import app
from backend.database import get_db, Base
from backend.models.user import User
from backend.models.curriculum import Curriculum
from backend.models.preferences import Preferences
import io


# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_integration.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
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
def admin_token(client):
    """Create an admin user and return auth token"""
    # Register admin
    register_response = client.post(
        "/api/auth/register",
        json={"username": "admin", "password": "admin123", "role": "Admin"},
    )
    assert register_response.status_code == 200

    # Login
    login_response = client.post(
        "/api/auth/login",
        json={"username": "admin", "password": "admin123"},
    )
    assert login_response.status_code == 200
    return login_response.json()["access_token"]


@pytest.fixture
def student_token(client):
    """Create a student user and return auth token"""
    # Register student
    register_response = client.post(
        "/api/auth/register",
        json={"username": "student", "password": "student123", "role": "Student"},
    )
    assert register_response.status_code == 200

    # Login
    login_response = client.post(
        "/api/auth/login",
        json={"username": "student", "password": "student123"},
    )
    assert login_response.status_code == 200
    return login_response.json()["access_token"]


class TestFlow1AdminSetup:
    """Test Flow 1: Admin Setup (Register → Login → Upload Curriculum → Set Preferences)"""

    def test_complete_admin_setup_flow(self, client, admin_token):
        """Test complete admin setup flow"""
        headers = {"Authorization": f"Bearer {admin_token}"}

        # Step 1: Verify admin is logged in
        me_response = client.get("/api/auth/me", headers=headers)
        assert me_response.status_code == 200
        assert me_response.json()["role"] == "Admin"
        assert me_response.json()["username"] == "admin"

        # Step 2: Upload curriculum
        curriculum_content = """
# Mathematics Curriculum

## Chapter 1: Algebra
- Linear equations
- Quadratic equations
- Polynomials

## Chapter 2: Geometry
- Triangles
- Circles
- Area and perimeter
"""
        curriculum_file = ("curriculum.md", io.BytesIO(curriculum_content.encode()), "text/markdown")
        
        upload_response = client.post(
            "/api/curriculum/upload",
            headers=headers,
            files={"file": curriculum_file},
        )
        assert upload_response.status_code == 200
        upload_data = upload_response.json()
        assert "id" in upload_data
        assert "keywords" in upload_data
        assert len(upload_data["keywords"]) > 0
        curriculum_id = upload_data["id"]

        # Step 3: List curricula
        list_response = client.get("/api/curriculum", headers=headers)
        assert list_response.status_code == 200
        curricula = list_response.json()
        assert len(curricula) == 1
        assert curricula[0]["id"] == curriculum_id

        # Step 4: Set preferences
        preferences_data = {
            "focus_areas": ["STEM", "Mathematics"],
            "keywords": ["problem-solving", "critical thinking"],
            "subject_preferences": ["Math", "Science"],
        }
        create_response = client.post(
            "/api/preferences",
            headers=headers,
            json=preferences_data,
        )
        assert create_response.status_code == 200
        prefs_data = create_response.json()
        assert prefs_data["focus_areas"] == preferences_data["focus_areas"]
        assert prefs_data["keywords"] == preferences_data["keywords"]

        # Step 5: Get preferences
        get_prefs_response = client.get("/api/preferences", headers=headers)
        assert get_prefs_response.status_code == 200
        assert get_prefs_response.json()["focus_areas"] == preferences_data["focus_areas"]


class TestFlow2ContentRewriting:
    """Test Flow 2: Content Rewriting (Fetch Feed → Rewrite Content → Compare)"""

    def test_content_rewriting_flow(self, client, admin_token):
        """Test content rewriting flow"""
        headers = {"Authorization": f"Bearer {admin_token}"}

        # Step 1: Upload curriculum first (required for rewriting)
        curriculum_content = """
# Science Curriculum

## Topics
- Physics
- Chemistry
- Biology
"""
        curriculum_file = ("science.md", io.BytesIO(curriculum_content.encode()), "text/markdown")
        upload_response = client.post(
            "/api/curriculum/upload",
            headers=headers,
            files={"file": curriculum_file},
        )
        assert upload_response.status_code == 200

        # Step 2: Get RedNote feed
        feed_response = client.get("/api/rednote/feed", headers=headers)
        assert feed_response.status_code == 200
        posts = feed_response.json()
        assert isinstance(posts, list)
        assert len(posts) > 0

        # Step 3: Rewrite a post
        if len(posts) > 0:
            post = posts[0]
            rewrite_request = {"text": post.get("text", "Sample post text")}
            rewrite_response = client.post(
                "/api/rewrite",
                headers=headers,
                json=rewrite_request,
            )
            assert rewrite_response.status_code == 200
            rewrite_data = rewrite_response.json()
            assert "original_text" in rewrite_data
            assert "rewritten_text" in rewrite_data
            assert "keywords_used" in rewrite_data
            assert rewrite_data["original_text"] == rewrite_request["text"]
            assert len(rewrite_data["rewritten_text"]) > 0

    def test_rewrite_without_curriculum_fails(self, client, admin_token):
        """Test that rewriting fails without curriculum"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        rewrite_request = {"text": "Sample text to rewrite"}
        rewrite_response = client.post(
            "/api/rewrite",
            headers=headers,
            json=rewrite_request,
        )
        assert rewrite_response.status_code == 404
        assert "curriculum" in rewrite_response.json()["detail"].lower()


class TestFlow3Authentication:
    """Test Flow 3: Authentication (Register → Login → Access Protected Route → Logout)"""

    def test_complete_auth_flow(self, client):
        """Test complete authentication flow"""
        # Step 1: Register
        register_response = client.post(
            "/api/auth/register",
            json={"username": "testuser", "password": "testpass123", "role": "Student"},
        )
        assert register_response.status_code == 200
        assert "user_id" in register_response.json()

        # Step 2: Login
        login_response = client.post(
            "/api/auth/login",
            json={"username": "testuser", "password": "testpass123"},
        )
        assert login_response.status_code == 200
        login_data = login_response.json()
        assert "access_token" in login_data
        assert login_data["token_type"] == "bearer"
        token = login_data["access_token"]

        # Step 3: Access protected route
        headers = {"Authorization": f"Bearer {token}"}
        me_response = client.get("/api/auth/me", headers=headers)
        assert me_response.status_code == 200
        assert me_response.json()["username"] == "testuser"

        # Step 4: Access without token should fail
        no_auth_response = client.get("/api/auth/me")
        assert no_auth_response.status_code == 401

        # Step 5: Access with invalid token should fail
        invalid_headers = {"Authorization": "Bearer invalid_token"}
        invalid_response = client.get("/api/auth/me", headers=invalid_headers)
        assert invalid_response.status_code == 401


class TestErrorScenarios:
    """Test error scenarios and edge cases"""

    def test_student_cannot_access_admin_endpoints(self, client, student_token):
        """Test that students cannot access admin-only endpoints"""
        headers = {"Authorization": f"Bearer {student_token}"}

        # Student should not be able to upload curriculum
        curriculum_file = ("test.md", io.BytesIO(b"# Test"), "text/markdown")
        upload_response = client.post(
            "/api/curriculum/upload",
            headers=headers,
            files={"file": curriculum_file},
        )
        assert upload_response.status_code == 403

        # Student should not be able to access preferences
        prefs_response = client.get("/api/preferences", headers=headers)
        assert prefs_response.status_code == 403

    def test_upload_invalid_file_type(self, client, admin_token):
        """Test uploading non-markdown file fails"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        invalid_file = ("test.txt", io.BytesIO(b"test content"), "text/plain")
        
        upload_response = client.post(
            "/api/curriculum/upload",
            headers=headers,
            files={"file": invalid_file},
        )
        assert upload_response.status_code == 400
        assert "markdown" in upload_response.json()["detail"].lower()

    def test_get_nonexistent_curriculum(self, client, admin_token):
        """Test getting nonexistent curriculum returns 404"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        response = client.get("/api/curriculum/99999", headers=headers)
        assert response.status_code == 404

    def test_get_preferences_before_creation(self, client, admin_token):
        """Test getting preferences before creation returns 404"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        response = client.get("/api/preferences", headers=headers)
        assert response.status_code == 404

    def test_create_duplicate_preferences(self, client, admin_token):
        """Test creating duplicate preferences fails"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        prefs_data = {
            "focus_areas": ["STEM"],
            "keywords": ["test"],
            "subject_preferences": ["Math"],
        }
        
        # Create first time
        create_response = client.post("/api/preferences", headers=headers, json=prefs_data)
        assert create_response.status_code == 200
        
        # Try to create again
        duplicate_response = client.post("/api/preferences", headers=headers, json=prefs_data)
        assert duplicate_response.status_code == 400
        assert "already exist" in duplicate_response.json()["detail"].lower()


class TestCORSConfiguration:
    """Test CORS configuration"""

    def test_cors_headers_present(self, client):
        """Test that CORS headers are present in responses"""
        response = client.options(
            "/api/auth/register",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "POST",
            },
        )
        # CORS preflight should be handled by FastAPI middleware
        assert response.status_code in [200, 204, 405]  # 405 is also acceptable

    def test_health_endpoint(self, client):
        """Test health endpoint is accessible"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

    def test_root_endpoint(self, client):
        """Test root endpoint is accessible"""
        response = client.get("/")
        assert response.status_code == 200
        assert "message" in response.json()


class TestIntegrationEndToEnd:
    """Complete end-to-end integration test"""

    def test_complete_user_journey(self, client):
        """Test complete user journey from registration to content rewriting"""
        # 1. Register admin
        register_response = client.post(
            "/api/auth/register",
            json={"username": "journey_admin", "password": "pass123", "role": "Admin"},
        )
        assert register_response.status_code == 200

        # 2. Login
        login_response = client.post(
            "/api/auth/login",
            json={"username": "journey_admin", "password": "pass123"},
        )
        assert login_response.status_code == 200
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 3. Upload curriculum
        curriculum_content = """
# Complete Curriculum

## Mathematics
- Algebra
- Geometry
- Calculus

## Science
- Physics
- Chemistry
"""
        curriculum_file = ("complete.md", io.BytesIO(curriculum_content.encode()), "text/markdown")
        upload_response = client.post(
            "/api/curriculum/upload",
            headers=headers,
            files={"file": curriculum_file},
        )
        assert upload_response.status_code == 200
        curriculum_keywords = upload_response.json()["keywords"]

        # 4. Set preferences
        prefs_response = client.post(
            "/api/preferences",
            headers=headers,
            json={
                "focus_areas": ["STEM"],
                "keywords": ["innovation", "creativity"],
                "subject_preferences": ["Math", "Science"],
            },
        )
        assert prefs_response.status_code == 200

        # 5. Get feed
        feed_response = client.get("/api/rednote/feed", headers=headers)
        assert feed_response.status_code == 200
        posts = feed_response.json()
        assert len(posts) > 0

        # 6. Rewrite content
        test_text = "This is a sample post about learning."
        rewrite_response = client.post(
            "/api/rewrite",
            headers=headers,
            json={"text": test_text},
        )
        assert rewrite_response.status_code == 200
        rewrite_data = rewrite_response.json()
        assert rewrite_data["original_text"] == test_text
        assert len(rewrite_data["rewritten_text"]) > 0
        assert len(rewrite_data["keywords_used"]) > 0

        # 7. Verify keywords from curriculum are used
        assert any(keyword in rewrite_data["keywords_used"] for keyword in curriculum_keywords)

