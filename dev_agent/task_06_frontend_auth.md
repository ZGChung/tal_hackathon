# Task 06: Frontend Authentication UI

## Objective
Build React components for user authentication (registration and login) with role selection.

## Requirements
- Login page/component
- Registration page/component
- Role selection (Student or Admin) during registration
- Form validation
- Error handling and display
- JWT token storage (localStorage)
- Protected route wrapper
- Redirect based on role after login

## Technical Details
- Use React Router for navigation
- Store JWT token in localStorage
- Create context or state management for auth state
- Form validation (client-side)
- API integration with backend auth endpoints
- Protected route component to guard admin pages

## Files to Create/Modify
- `frontend/src/components/Auth/Login.js` - Login component
- `frontend/src/components/Auth/Register.js` - Register component
- `frontend/src/contexts/AuthContext.js` - Auth context/state
- `frontend/src/utils/api.js` - API client with auth headers
- `frontend/src/components/ProtectedRoute.js` - Protected route wrapper
- `frontend/src/App.js` - Add routes
- `tests/frontend/Auth.test.js` - Tests (TDD)

## Success Criteria
- Users can register with username, password, and role
- Users can login
- JWT token is stored and sent with requests
- Protected routes work (Admin pages require Admin role)
- Error messages display properly
- All tests pass

## Environment
```bash
conda activate rl
cd frontend
npm install react-router-dom
```

## Notes
- Keep UI simple but clean
- Focus on functionality over fancy design
- Can enhance styling later if time permits

