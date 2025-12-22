import pytest
import os
import tempfile
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.main import app
from backend.database import get_db, Base
from backend.models.user import User
from backend.models.curriculum import Curriculum

# Workaround for bcrypt/passlib initialization issue
# Set environment variable to suppress bcrypt warnings
os.environ.setdefault('PASSLIB_SUPPRESS_WARNINGS', '1')


# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_curriculum.db"
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
def student_user(client):
    """Create a student user and return token"""
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
    return login_response.json()["access_token"]


@pytest.fixture
def sample_markdown():
    """Sample markdown content for testing"""
    return """# Mathematics
## Algebra
- **Variables**: x, y, z
- **Equations**: linear, quadratic

## Geometry
- **Shapes**: circle, triangle
- **Formulas**: area, perimeter
"""


class TestCurriculumUpload:
    """Test curriculum upload endpoint"""
    
    def test_upload_markdown_file_success(self, client, admin_user, sample_markdown):
        """Test successful markdown file upload by admin"""
        # Create a temporary markdown file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.md', delete=False) as f:
            f.write(sample_markdown)
            temp_path = f.name
        
        try:
            with open(temp_path, 'rb') as f:
                response = client.post(
                    "/api/curriculum/upload",
                    headers={"Authorization": f"Bearer {admin_user}"},
                    files={"file": ("test.md", f, "text/markdown")}
                )
            
            assert response.status_code == 200
            data = response.json()
            assert "id" in data
            assert data["filename"] == "test.md"
            assert "keywords" in data
            assert isinstance(data["keywords"], list)
            assert len(data["keywords"]) > 0
            assert "created_at" in data
        finally:
            os.unlink(temp_path)
    
    def test_upload_non_markdown_file_fails(self, client, admin_user):
        """Test upload of non-markdown file fails"""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            f.write("This is not markdown")
            temp_path = f.name
        
        try:
            with open(temp_path, 'rb') as f:
                response = client.post(
                    "/api/curriculum/upload",
                    headers={"Authorization": f"Bearer {admin_user}"},
                    files={"file": ("test.txt", f, "text/plain")}
                )
            
            assert response.status_code == 400
            assert "markdown" in response.json()["detail"].lower()
        finally:
            os.unlink(temp_path)
    
    def test_upload_requires_admin(self, client, student_user, sample_markdown):
        """Test that only admin can upload files"""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.md', delete=False) as f:
            f.write(sample_markdown)
            temp_path = f.name
        
        try:
            with open(temp_path, 'rb') as f:
                response = client.post(
                    "/api/curriculum/upload",
                    headers={"Authorization": f"Bearer {student_user}"},
                    files={"file": ("test.md", f, "text/markdown")}
                )
            
            assert response.status_code == 403
        finally:
            os.unlink(temp_path)
    
    def test_upload_requires_authentication(self, client, sample_markdown):
        """Test that upload requires authentication"""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.md', delete=False) as f:
            f.write(sample_markdown)
            temp_path = f.name
        
        try:
            with open(temp_path, 'rb') as f:
                response = client.post(
                    "/api/curriculum/upload",
                    files={"file": ("test.md", f, "text/markdown")}
                )
            
            assert response.status_code == 401
        finally:
            os.unlink(temp_path)


class TestCurriculumListing:
    """Test curriculum listing endpoint"""
    
    def test_list_curricula_admin_success(self, client, admin_user, sample_markdown):
        """Test admin can list curricula"""
        # Upload a file first
        with tempfile.NamedTemporaryFile(mode='w', suffix='.md', delete=False) as f:
            f.write(sample_markdown)
            temp_path = f.name
        
        try:
            with open(temp_path, 'rb') as f:
                client.post(
                    "/api/curriculum/upload",
                    headers={"Authorization": f"Bearer {admin_user}"},
                    files={"file": ("test.md", f, "text/markdown")}
                )
            
            # List curricula
            response = client.get(
                "/api/curriculum",
                headers={"Authorization": f"Bearer {admin_user}"}
            )
            
            assert response.status_code == 200
            data = response.json()
            assert isinstance(data, list)
            assert len(data) > 0
            assert "id" in data[0]
            assert "filename" in data[0]
            assert "keywords" in data[0]
        finally:
            os.unlink(temp_path)
    
    def test_list_curricula_requires_admin(self, client, student_user):
        """Test that only admin can list curricula"""
        response = client.get(
            "/api/curriculum",
            headers={"Authorization": f"Bearer {student_user}"}
        )
        
        assert response.status_code == 403
    
    def test_list_curricula_empty(self, client, admin_user):
        """Test listing when no curricula exist"""
        response = client.get(
            "/api/curriculum",
            headers={"Authorization": f"Bearer {admin_user}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 0


class TestCurriculumGetById:
    """Test get curriculum by ID endpoint"""
    
    def test_get_curriculum_by_id_success(self, client, admin_user, sample_markdown):
        """Test admin can get curriculum by ID"""
        # Upload a file first
        with tempfile.NamedTemporaryFile(mode='w', suffix='.md', delete=False) as f:
            f.write(sample_markdown)
            temp_path = f.name
        
        try:
            with open(temp_path, 'rb') as f:
                upload_response = client.post(
                    "/api/curriculum/upload",
                    headers={"Authorization": f"Bearer {admin_user}"},
                    files={"file": ("test.md", f, "text/markdown")}
                )
            
            curriculum_id = upload_response.json()["id"]
            
            # Get curriculum by ID
            response = client.get(
                f"/api/curriculum/{curriculum_id}",
                headers={"Authorization": f"Bearer {admin_user}"}
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["id"] == curriculum_id
            assert data["filename"] == "test.md"
            assert "keywords" in data
            assert "file_path" in data
            assert "created_at" in data
        finally:
            os.unlink(temp_path)
    
    def test_get_curriculum_by_id_not_found(self, client, admin_user):
        """Test getting non-existent curriculum returns 404"""
        response = client.get(
            "/api/curriculum/99999",
            headers={"Authorization": f"Bearer {admin_user}"}
        )
        
        assert response.status_code == 404
    
    def test_get_curriculum_by_id_requires_admin(self, client, student_user):
        """Test that only admin can get curriculum by ID"""
        response = client.get(
            "/api/curriculum/1",
            headers={"Authorization": f"Bearer {student_user}"}
        )
        
        assert response.status_code == 403


class TestMarkdownParsing:
    """Test markdown parsing functionality"""
    
    def test_parse_headings(self, client, admin_user):
        """Test that headings are extracted as keywords"""
        markdown = """# Mathematics
## Algebra
### Advanced Topics
"""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.md', delete=False) as f:
            f.write(markdown)
            temp_path = f.name
        
        try:
            with open(temp_path, 'rb') as f:
                response = client.post(
                    "/api/curriculum/upload",
                    headers={"Authorization": f"Bearer {admin_user}"},
                    files={"file": ("test.md", f, "text/markdown")}
                )
            
            assert response.status_code == 200
            keywords = response.json()["keywords"]
            assert "Mathematics" in keywords
            assert "Algebra" in keywords
            assert "Advanced Topics" in keywords
        finally:
            os.unlink(temp_path)
    
    def test_parse_bold_text(self, client, admin_user):
        """Test that bold text is extracted as keywords"""
        markdown = """# Math
- **Variables**: x, y
- **Equations**: linear
"""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.md', delete=False) as f:
            f.write(markdown)
            temp_path = f.name
        
        try:
            with open(temp_path, 'rb') as f:
                response = client.post(
                    "/api/curriculum/upload",
                    headers={"Authorization": f"Bearer {admin_user}"},
                    files={"file": ("test.md", f, "text/markdown")}
                )
            
            assert response.status_code == 200
            keywords = response.json()["keywords"]
            assert "Variables" in keywords
            assert "Equations" in keywords
        finally:
            os.unlink(temp_path)
    
    def test_parse_list_items(self, client, admin_user):
        """Test that list items are extracted as keywords"""
        markdown = """# Math
- linear
- quadratic
- polynomial
"""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.md', delete=False) as f:
            f.write(markdown)
            temp_path = f.name
        
        try:
            with open(temp_path, 'rb') as f:
                response = client.post(
                    "/api/curriculum/upload",
                    headers={"Authorization": f"Bearer {admin_user}"},
                    files={"file": ("test.md", f, "text/markdown")}
                )
            
            assert response.status_code == 200
            keywords = response.json()["keywords"]
            # List items should be extracted
            assert "linear" in keywords or "quadratic" in keywords
        finally:
            os.unlink(temp_path)

