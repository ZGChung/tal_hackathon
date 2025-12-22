# Task 01: Backend Authentication System

## 🎯 STANDALONE AGENT PROMPT
Copy this entire section to initialize a new agent:

---

**You are a backend developer working on Task 01: Backend Authentication System for a hackathon demo.**

**Context**: This is a FastAPI backend application. You need to implement authentication with JWT tokens and role-based access control (Student and Admin roles).

**Your Mission**:
1. Create feature branch: `feature/backend-auth`
2. Follow TDD: Write tests first, then implement
3. Implement user registration and login endpoints
4. Add JWT token generation and validation
5. Implement role-based access control
6. Ensure all tests pass before merging

**Key Requirements**:
- POST `/api/auth/register` - User registration (username, password, role)
- POST `/api/auth/login` - User login, returns JWT token
- GET `/api/auth/me` - Get current user (protected endpoint)
- Use SQLite database (local, simple)
- Password hashing with bcrypt
- JWT tokens with python-jose
- Role-based dependencies for protected endpoints

**Files to Create**:
- `backend/models/user.py` - SQLAlchemy User model
- `backend/schemas/auth.py` - Pydantic schemas
- `backend/routers/auth.py` - Auth endpoints
- `backend/database.py` - Database setup
- `backend/utils/security.py` - Password hashing, JWT utilities
- `backend/utils/dependencies.py` - Auth dependencies
- `tests/backend/test_auth.py` - Tests

**Dependencies**: None - this is the foundation task.

**TDD Workflow**:
1. Write failing tests for registration
2. Implement registration endpoint
3. Write failing tests for login
4. Implement login endpoint
5. Write failing tests for JWT validation
6. Implement JWT validation
7. Write failing tests for role-based access
8. Implement role-based access
9. All tests pass → ready to merge

**Merge Criteria**:
- ✅ All tests pass
- ✅ Code follows architecture patterns (see `doc/ARCHITECTURE.md`)
- ✅ No merge conflicts with main
- ✅ JWT authentication works end-to-end

**Environment Setup**:
```bash
conda activate rl
cd backend
pip install fastapi uvicorn sqlalchemy python-jose[cryptography] passlib[bcrypt] python-multipart
```

---

## 📋 Detailed Requirements

### Endpoints to Implement

1. **POST `/api/auth/register`**
   - Request: `{username: str, password: str, role: "Student" | "Admin"}`
   - Response: `{message: str, user_id: int}`
   - Validates username uniqueness
   - Hashes password before storing

2. **POST `/api/auth/login`**
   - Request: `{username: str, password: str}`
   - Response: `{access_token: str, token_type: "bearer", user: {id, username, role}}`
   - Validates credentials
   - Returns JWT token

3. **GET `/api/auth/me`** (Protected)
   - Requires: Valid JWT token in Authorization header
   - Response: `{id: int, username: str, role: str}`

### Database Model

**User Model** (`backend/models/user.py`):
- id (primary key)
- username (unique, required)
- password_hash (required)
- role (enum: "Student" | "Admin", required)
- created_at (timestamp)

### Security Utilities

- Password hashing: Use `passlib[bcrypt]`
- JWT: Use `python-jose[cryptography]`
- Secret key: Store in environment variable or config (simple for demo)

### Dependencies for Protected Endpoints

Create `get_current_user()` and `get_admin_user()` dependencies:
- `get_current_user`: Validates JWT, returns current user
- `get_admin_user`: Validates JWT AND checks role is Admin

## 🔄 Git Workflow

```bash
# 1. Create and switch to feature branch
git checkout main
git pull origin main
git checkout -b feature/backend-auth

# 2. Develop with TDD (write tests, implement, commit)
git add .
git commit -m "test: add auth registration tests"
git commit -m "feat: implement user registration endpoint"
# ... continue with TDD commits

# 3. Before merging, ensure:
# - All tests pass: pytest tests/backend/test_auth.py
# - No conflicts with main
# - Code review (self-review is fine for hackathon)

# 4. Merge to main
git checkout main
git merge feature/backend-auth
git push origin main
```

## ✅ Success Criteria

- [ ] Users can register with username, password, and role
- [ ] Users can login and receive JWT token
- [ ] JWT tokens are validated correctly
- [ ] Protected endpoints require valid JWT
- [ ] Role-based access control works (Admin vs Student)
- [ ] All tests pass (100% coverage for auth endpoints)
- [ ] Code follows architecture patterns
- [ ] No merge conflicts

## 📚 Reference

- Architecture: `doc/ARCHITECTURE.md`
- PRD: `doc/prd.md`
- Development Plan: `doc/DEVELOPMENT_PLAN.md`

