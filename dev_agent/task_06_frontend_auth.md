# Task 06: Frontend Authentication UI

## 🎯 STANDALONE AGENT PROMPT

Copy this entire section to initialize a new agent:

---

**You are a frontend developer working on Task 06: Frontend Authentication UI for a hackathon demo.**

**Context**: This is a React frontend application. You need to build authentication UI components (login, register) with JWT token management.

**Your Mission**:

1. Create feature branch: `feature/frontend-auth`
2. Follow TDD: Write tests first, then implement
3. Build login and registration components
4. Implement auth context for state management
5. Create protected route wrapper
6. Ensure all tests pass before merging

**Key Requirements**:

-   Login page with form validation
-   Registration page with role selection (Student/Admin)
-   JWT token storage in localStorage
-   Auth context for global auth state
-   Protected route component
-   Redirect based on role after login

**Files to Create**:

-   `frontend/src/components/Auth/Login.js`
-   `frontend/src/components/Auth/Register.js`
-   `frontend/src/contexts/AuthContext.js`
-   `frontend/src/utils/api.js` - API client with auth headers
-   `frontend/src/components/ProtectedRoute.js`
-   `frontend/src/services/authService.js` - Auth API calls
-   `frontend/src/App.js` - Add routes
-   `tests/frontend/Auth.test.js`

**Dependencies**:

-   Requires Task 01 (Backend Auth) to be merged
-   If backend not ready, use mock API responses

**TDD Workflow**:

1. Write failing tests for Login component
2. Implement Login component
3. Write failing tests for Register component
4. Implement Register component
5. Write failing tests for AuthContext
6. Implement AuthContext
7. Write failing tests for ProtectedRoute
8. Implement ProtectedRoute
9. All tests pass → ready to merge

**Merge Criteria**:

-   ✅ All tests pass
-   ✅ Login/register work with backend
-   ✅ JWT tokens stored and sent with requests
-   ✅ Protected routes work
-   ✅ Role-based redirects work

**Environment Setup**:

```bash
conda activate rl
cd frontend
npm install react-router-dom axios
```

---

## 📋 Detailed Requirements

### Components

1. **Login Component** (`components/Auth/Login.js`)

    - Form: username, password
    - Validation: required fields
    - Error display
    - On success: store token, redirect to dashboard

2. **Register Component** (`components/Auth/Register.js`)

    - Form: username, password, confirm password, role (Student/Admin)
    - Validation: all fields required, passwords match
    - Error display
    - On success: redirect to login

3. **AuthContext** (`contexts/AuthContext.js`)

    - Provides: `{user, token, login, logout, isAuthenticated, isAdmin}`
    - Loads token from localStorage on mount
    - Updates state on login/logout

4. **ProtectedRoute** (`components/ProtectedRoute.js`)

    - Wraps routes that require authentication
    - Redirects to login if not authenticated
    - Optional: role-based protection (Admin only)

5. **API Client** (`utils/api.js`)
    - Axios instance with base URL
    - Interceptor to add JWT token to headers
    - Error handling

### Routes

-   `/login` - Login page
-   `/register` - Registration page
-   `/dashboard` - Protected, redirects based on role

## 🔄 Git Workflow

```bash
git checkout main
git pull origin main
git checkout -b feature/frontend-auth
# ... develop with TDD ...
git checkout main
git merge feature/frontend-auth
```

## ✅ Success Criteria

-   [ ] Users can register with username, password, role
-   [ ] Users can login
-   [ ] JWT token stored in localStorage
-   [ ] Token sent with API requests
-   [ ] Protected routes work
-   [ ] Role-based redirects work
-   [ ] All tests pass
