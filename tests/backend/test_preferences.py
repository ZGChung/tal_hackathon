import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.main import app
from backend.database import get_db, Base
from backend.models.user import User, UserRole
from backend.models.preferences import Preferences


# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_preferences.db"
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
    """Create and login an admin user, return token"""
    # Register admin
    client.post(
        "/api/auth/register",
        json={
            "username": "admin",
            "password": "adminpass123",
            "role": "Admin"
        }
    )
    # Login
    response = client.post(
        "/api/auth/login",
        json={
            "username": "admin",
            "password": "adminpass123"
        }
    )
    return response.json()["access_token"]


@pytest.fixture
def student_user(client):
    """Create and login a student user, return token"""
    # Register student
    client.post(
        "/api/auth/register",
        json={
            "username": "student",
            "password": "studentpass123",
            "role": "Student"
        }
    )
    # Login
    response = client.post(
        "/api/auth/login",
        json={
            "username": "student",
            "password": "studentpass123"
        }
    )
    return response.json()["access_token"]


class TestCreatePreferences:
    """Test POST /api/preferences endpoint"""
    
    def test_create_preferences_success(self, client, admin_user):
        """Test admin can create preferences"""
        response = client.post(
            "/api/preferences",
            headers={"Authorization": f"Bearer {admin_user}"},
            json={
                "focus_areas": ["math", "science"],
                "keywords": ["algebra", "physics"],
                "subject_preferences": ["Mathematics", "Physics"]
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["focus_areas"] == ["math", "science"]
        assert data["keywords"] == ["algebra", "physics"]
        assert data["subject_preferences"] == ["Mathematics", "Physics"]
        assert "created_at" in data
    
    def test_create_preferences_requires_auth(self, client):
        """Test creating preferences without auth fails"""
        response = client.post(
            "/api/preferences",
            json={
                "focus_areas": ["math"],
                "keywords": ["algebra"],
                "subject_preferences": ["Mathematics"]
            }
        )
        assert response.status_code == 401
    
    def test_create_preferences_requires_admin(self, client, student_user):
        """Test student cannot create preferences"""
        response = client.post(
            "/api/preferences",
            headers={"Authorization": f"Bearer {student_user}"},
            json={
                "focus_areas": ["math"],
                "keywords": ["algebra"],
                "subject_preferences": ["Mathematics"]
            }
        )
        assert response.status_code == 403
    
    def test_create_preferences_empty_lists(self, client, admin_user):
        """Test creating preferences with empty lists"""
        response = client.post(
            "/api/preferences",
            headers={"Authorization": f"Bearer {admin_user}"},
            json={
                "focus_areas": [],
                "keywords": [],
                "subject_preferences": []
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["focus_areas"] == []
        assert data["keywords"] == []
        assert data["subject_preferences"] == []
    
    def test_create_preferences_missing_fields(self, client, admin_user):
        """Test creating preferences with missing fields fails"""
        response = client.post(
            "/api/preferences",
            headers={"Authorization": f"Bearer {admin_user}"},
            json={
                "focus_areas": ["math"]
                # Missing keywords and subject_preferences
            }
        )
        assert response.status_code == 422


class TestGetPreferences:
    """Test GET /api/preferences endpoint"""
    
    def test_get_preferences_success(self, client, admin_user):
        """Test admin can get their preferences"""
        # First create preferences
        create_response = client.post(
            "/api/preferences",
            headers={"Authorization": f"Bearer {admin_user}"},
            json={
                "focus_areas": ["math", "science"],
                "keywords": ["algebra", "physics"],
                "subject_preferences": ["Mathematics", "Physics"]
            }
        )
        pref_id = create_response.json()["id"]
        
        # Then get preferences
        response = client.get(
            "/api/preferences",
            headers={"Authorization": f"Bearer {admin_user}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == pref_id
        assert data["focus_areas"] == ["math", "science"]
        assert data["keywords"] == ["algebra", "physics"]
        assert data["subject_preferences"] == ["Mathematics", "Physics"]
        assert "created_at" in data
    
    def test_get_preferences_not_found(self, client, admin_user):
        """Test getting preferences when none exist returns 404"""
        response = client.get(
            "/api/preferences",
            headers={"Authorization": f"Bearer {admin_user}"}
        )
        assert response.status_code == 404
    
    def test_get_preferences_requires_auth(self, client):
        """Test getting preferences without auth fails"""
        response = client.get("/api/preferences")
        assert response.status_code == 401
    
    def test_get_preferences_requires_admin(self, client, student_user):
        """Test student cannot get preferences"""
        response = client.get(
            "/api/preferences",
            headers={"Authorization": f"Bearer {student_user}"}
        )
        assert response.status_code == 403


class TestUpdatePreferences:
    """Test PUT /api/preferences/{id} endpoint"""
    
    def test_update_preferences_success(self, client, admin_user):
        """Test admin can update their preferences"""
        # First create preferences
        create_response = client.post(
            "/api/preferences",
            headers={"Authorization": f"Bearer {admin_user}"},
            json={
                "focus_areas": ["math"],
                "keywords": ["algebra"],
                "subject_preferences": ["Mathematics"]
            }
        )
        pref_id = create_response.json()["id"]
        
        # Update preferences
        response = client.put(
            f"/api/preferences/{pref_id}",
            headers={"Authorization": f"Bearer {admin_user}"},
            json={
                "focus_areas": ["math", "science", "history"],
                "keywords": ["algebra", "physics", "world-war"],
                "subject_preferences": ["Mathematics", "Physics", "History"]
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == pref_id
        assert data["focus_areas"] == ["math", "science", "history"]
        assert data["keywords"] == ["algebra", "physics", "world-war"]
        assert data["subject_preferences"] == ["Mathematics", "Physics", "History"]
    
    def test_update_preferences_not_found(self, client, admin_user):
        """Test updating non-existent preferences returns 404"""
        response = client.put(
            "/api/preferences/999",
            headers={"Authorization": f"Bearer {admin_user}"},
            json={
                "focus_areas": ["math"],
                "keywords": ["algebra"],
                "subject_preferences": ["Mathematics"]
            }
        )
        assert response.status_code == 404
    
    def test_update_preferences_requires_auth(self, client):
        """Test updating preferences without auth fails"""
        response = client.put(
            "/api/preferences/1",
            json={
                "focus_areas": ["math"],
                "keywords": ["algebra"],
                "subject_preferences": ["Mathematics"]
            }
        )
        assert response.status_code == 401
    
    def test_update_preferences_requires_admin(self, client, student_user):
        """Test student cannot update preferences"""
        response = client.put(
            "/api/preferences/1",
            headers={"Authorization": f"Bearer {student_user}"},
            json={
                "focus_areas": ["math"],
                "keywords": ["algebra"],
                "subject_preferences": ["Mathematics"]
            }
        )
        assert response.status_code == 403
    
    def test_update_preferences_wrong_user(self, client, admin_user):
        """Test admin cannot update another admin's preferences"""
        # Create second admin
        client.post(
            "/api/auth/register",
            json={
                "username": "admin2",
                "password": "adminpass123",
                "role": "Admin"
            }
        )
        login_response = client.post(
            "/api/auth/login",
            json={
                "username": "admin2",
                "password": "adminpass123"
            }
        )
        admin2_token = login_response.json()["access_token"]
        
        # Admin2 creates preferences
        create_response = client.post(
            "/api/preferences",
            headers={"Authorization": f"Bearer {admin2_token}"},
            json={
                "focus_areas": ["math"],
                "keywords": ["algebra"],
                "subject_preferences": ["Mathematics"]
            }
        )
        pref_id = create_response.json()["id"]
        
        # Admin1 tries to update Admin2's preferences
        response = client.put(
            f"/api/preferences/{pref_id}",
            headers={"Authorization": f"Bearer {admin_user}"},
            json={
                "focus_areas": ["hacked"],
                "keywords": ["hacked"],
                "subject_preferences": ["Hacked"]
            }
        )
        assert response.status_code == 403
    
    def test_update_preferences_missing_fields(self, client, admin_user):
        """Test updating preferences with missing fields fails"""
        # First create preferences
        create_response = client.post(
            "/api/preferences",
            headers={"Authorization": f"Bearer {admin_user}"},
            json={
                "focus_areas": ["math"],
                "keywords": ["algebra"],
                "subject_preferences": ["Mathematics"]
            }
        )
        pref_id = create_response.json()["id"]
        
        # Try to update with missing fields
        response = client.put(
            f"/api/preferences/{pref_id}",
            headers={"Authorization": f"Bearer {admin_user}"},
            json={
                "focus_areas": ["math"]
                # Missing keywords and subject_preferences
            }
        )
        assert response.status_code == 422

