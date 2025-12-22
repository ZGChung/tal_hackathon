# Task 03: Backend Admin Preferences API

## 🎯 STANDALONE AGENT PROMPT

Copy this entire section to initialize a new agent:

---

**You are a backend developer working on Task 03: Backend Admin Preferences API for a hackathon demo.**

**Context**: This is a FastAPI backend. You need to implement endpoints for Admin users to set and manage preferences for content rewriting.

**Your Mission**:

1. Create feature branch: `feature/backend-preferences`
2. Follow TDD: Write tests first, then implement
3. Implement CRUD endpoints for preferences (Admin only)
4. Store preferences in database
5. Ensure all tests pass before merging

**Key Requirements**:

-   POST `/api/preferences` - Create preferences (Admin only)
-   GET `/api/preferences` - Get current user's preferences (Admin only)
-   PUT `/api/preferences/{id}` - Update preferences (Admin only)
-   Preferences include: focus_areas, keywords, subject_preferences

**Files to Create**:

-   `backend/models/preferences.py` - Preferences model
-   `backend/schemas/preferences.py` - Pydantic schemas
-   `backend/routers/preferences.py` - Preferences endpoints
-   `tests/backend/test_preferences.py` - Tests

**Dependencies**:

-   Requires Task 01 (Backend Auth) to be merged
-   Can work in parallel with Task 02

**TDD Workflow**:

1. Write failing tests for create preferences
2. Implement create endpoint
3. Write failing tests for get preferences
4. Implement get endpoint
5. Write failing tests for update preferences
6. Implement update endpoint
7. All tests pass → ready to merge

**Merge Criteria**:

-   ✅ All tests pass
-   ✅ Admin-only access enforced
-   ✅ Preferences stored and retrievable

**Environment Setup**:

```bash
conda activate rl
cd backend
# No additional packages needed (uses existing auth)
```

---

## 📋 Detailed Requirements

### Endpoints

1. **POST `/api/preferences`** (Admin only)

    - Request: `{focus_areas: List[str], keywords: List[str], subject_preferences: List[str]}`
    - Response: `{id: int, focus_areas: List[str], keywords: List[str], subject_preferences: List[str], created_at: str}`
    - Creates preferences for current admin user

2. **GET `/api/preferences`** (Admin only)

    - Response: `{id, focus_areas, keywords, subject_preferences, created_at}`
    - Returns current admin's preferences (or 404 if none)

3. **PUT `/api/preferences/{id}`** (Admin only)
    - Request: Same as POST
    - Response: Updated preferences object
    - Updates existing preferences

### Database Model

**Preferences Model**:

-   id (primary key)
-   user_id (foreign key to User, admin)
-   focus_areas (JSON array)
-   keywords (JSON array)
-   subject_preferences (JSON array)
-   created_at, updated_at (timestamps)

## 🔄 Git Workflow

```bash
git checkout main
git pull origin main
git checkout -b feature/backend-preferences
# ... develop with TDD ...
git checkout main
git merge feature/backend-preferences
```

## ✅ Success Criteria

-   [ ] Admin can create preferences
-   [ ] Admin can retrieve preferences
-   [ ] Admin can update preferences
-   [ ] Student role cannot access endpoints
-   [ ] All tests pass
