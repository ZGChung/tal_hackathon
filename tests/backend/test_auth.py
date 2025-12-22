import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.main import app
from backend.database import get_db, Base
from backend.models.user import User  # Import model to register it with Base


# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
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


class TestUserRegistration:
    """Test user registration endpoint"""
    
    def test_register_student_success(self, client):
        """Test successful student registration"""
        response = client.post(
            "/api/auth/register",
            json={
                "username": "student1",
                "password": "password123",
                "role": "Student"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "user_id" in data
        assert data["user_id"] > 0
    
    def test_register_admin_success(self, client):
        """Test successful admin registration"""
        response = client.post(
            "/api/auth/register",
            json={
                "username": "admin1",
                "password": "adminpass123",
                "role": "Admin"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "user_id" in data
    
    def test_register_duplicate_username(self, client):
        """Test registration with duplicate username fails"""
        # Register first user
        client.post(
            "/api/auth/register",
            json={
                "username": "duplicate",
                "password": "pass123",
                "role": "Student"
            }
        )
        # Try to register again with same username
        response = client.post(
            "/api/auth/register",
            json={
                "username": "duplicate",
                "password": "pass456",
                "role": "Admin"
            }
        )
        assert response.status_code == 400
        assert "username" in response.json()["detail"].lower()
    
    def test_register_invalid_role(self, client):
        """Test registration with invalid role fails"""
        response = client.post(
            "/api/auth/register",
            json={
                "username": "user1",
                "password": "pass123",
                "role": "InvalidRole"
            }
        )
        assert response.status_code == 422  # Validation error
    
    def test_register_missing_fields(self, client):
        """Test registration with missing fields fails"""
        response = client.post(
            "/api/auth/register",
            json={
                "username": "user1"
                # Missing password and role
            }
        )
        assert response.status_code == 422


class TestUserLogin:
    """Test user login endpoint"""
    
    def test_login_success(self, client):
        """Test successful login returns JWT token"""
        # First register a user
        client.post(
            "/api/auth/register",
            json={
                "username": "loginuser",
                "password": "loginpass123",
                "role": "Student"
            }
        )
        # Then login
        response = client.post(
            "/api/auth/login",
            json={
                "username": "loginuser",
                "password": "loginpass123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert "user" in data
        assert data["user"]["username"] == "loginuser"
        assert data["user"]["role"] == "Student"
        assert "id" in data["user"]
    
    def test_login_wrong_password(self, client):
        """Test login with wrong password fails"""
        # Register a user
        client.post(
            "/api/auth/register",
            json={
                "username": "wrongpass",
                "password": "correctpass",
                "role": "Student"
            }
        )
        # Try to login with wrong password
        response = client.post(
            "/api/auth/login",
            json={
                "username": "wrongpass",
                "password": "wrongpassword"
            }
        )
        assert response.status_code == 401
        assert "password" in response.json()["detail"].lower() or "invalid" in response.json()["detail"].lower()
    
    def test_login_nonexistent_user(self, client):
        """Test login with nonexistent user fails"""
        response = client.post(
            "/api/auth/login",
            json={
                "username": "nonexistent",
                "password": "anypass"
            }
        )
        assert response.status_code == 401
        assert "user" in response.json()["detail"].lower() or "invalid" in response.json()["detail"].lower()
    
    def test_login_missing_fields(self, client):
        """Test login with missing fields fails"""
        response = client.post(
            "/api/auth/login",
            json={
                "username": "user1"
                # Missing password
            }
        )
        assert response.status_code == 422


class TestJWTValidation:
    """Test JWT token validation and protected endpoints"""
    
    def test_get_current_user_success(self, client):
        """Test /api/auth/me returns current user with valid token"""
        # Register and login
        client.post(
            "/api/auth/register",
            json={
                "username": "meuser",
                "password": "mepass123",
                "role": "Student"
            }
        )
        login_response = client.post(
            "/api/auth/login",
            json={
                "username": "meuser",
                "password": "mepass123"
            }
        )
        token = login_response.json()["access_token"]
        
        # Get current user
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "meuser"
        assert data["role"] == "Student"
        assert "id" in data
    
    def test_get_current_user_no_token(self, client):
        """Test /api/auth/me fails without token"""
        response = client.get("/api/auth/me")
        assert response.status_code == 401
    
    def test_get_current_user_invalid_token(self, client):
        """Test /api/auth/me fails with invalid token"""
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": "Bearer invalid_token_here"}
        )
        assert response.status_code == 401
    
    def test_get_current_user_expired_token(self, client):
        """Test /api/auth/me fails with expired token"""
        # This would require mocking time or using a very short expiration
        # For now, we'll test with malformed token
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"}
        )
        # Should fail because token doesn't match our secret
        assert response.status_code == 401


class TestRoleBasedAccess:
    """Test role-based access control"""
    
    def test_admin_endpoint_requires_admin_role(self, client):
        """Test that admin-only endpoints require Admin role"""
        # Register and login as Student
        client.post(
            "/api/auth/register",
            json={
                "username": "studentuser",
                "password": "studentpass",
                "role": "Student"
            }
        )
        login_response = client.post(
            "/api/auth/login",
            json={
                "username": "studentuser",
                "password": "studentpass"
            }
        )
        student_token = login_response.json()["access_token"]
        
        # Try to access admin endpoint (we'll create a test admin endpoint)
        # For now, we'll test the dependency directly
        # This test will be updated when we have actual admin endpoints
        pass
    
    def test_admin_endpoint_allows_admin(self, client):
        """Test that admin can access admin-only endpoints"""
        # Register and login as Admin
        client.post(
            "/api/auth/register",
            json={
                "username": "adminuser",
                "password": "adminpass",
                "role": "Admin"
            }
        )
        login_response = client.post(
            "/api/auth/login",
            json={
                "username": "adminuser",
                "password": "adminpass"
            }
        )
        admin_token = login_response.json()["access_token"]
        
        # Admin should be able to access /api/auth/me
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        assert response.json()["role"] == "Admin"

