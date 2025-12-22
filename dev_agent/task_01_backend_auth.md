# Task 01: Backend Authentication System

## Objective
Implement a simple local authentication system for the FastAPI backend with role-based access control (Student and Admin).

## Requirements
- User registration endpoint (POST `/api/auth/register`)
- User login endpoint (POST `/api/auth/login`)
- JWT token generation and validation
- Password hashing (use bcrypt or similar)
- Role-based access: Student and Admin
- Simple local storage (SQLite database recommended)
- User model with: username, email (optional), password_hash, role

## Technical Details
- Use FastAPI with Pydantic models for request/response validation
- Store users in SQLite database (simple, local, no setup needed)
- Use python-jose for JWT tokens
- Use passlib for password hashing
- Create middleware or dependency for role-based access control

## Files to Create/Modify
- `backend/models/user.py` - User model
- `backend/schemas/auth.py` - Pydantic schemas for auth
- `backend/routers/auth.py` - Auth endpoints
- `backend/database.py` - Database setup (SQLite)
- `backend/main.py` - Include auth router
- `tests/backend/test_auth.py` - Tests (TDD)

## Success Criteria
- Users can register with username, password, and role
- Users can login and receive JWT token
- Protected endpoints verify JWT tokens
- Role-based access works (Admin can access admin endpoints, Student cannot)
- All tests pass

## Environment
```bash
conda activate rl
cd backend
pip install fastapi uvicorn sqlalchemy python-jose[cryptography] passlib[bcrypt] python-multipart
```

## Notes
- Keep it simple for hackathon demo
- No email verification needed
- No password reset needed
- Focus on core functionality

