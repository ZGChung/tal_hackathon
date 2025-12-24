# Task 12: Add Quick Login Buttons to Login Page

## 🎯 STANDALONE AGENT PROMPT
Copy this entire section to initialize a new agent:

---

**You are a frontend developer working on Task 12: Add Quick Login Buttons to Login Page for a hackathon demo.**

**Context**: This is a React frontend application. You need to add two quick login buttons to the existing Login component that allow users to quickly log in with default test accounts for faster testing.

**Your Mission**:
1. Create feature branch: `feature/quick-login-buttons`
2. Follow TDD: Write tests first, then implement
3. Add two quick login buttons to Login component
4. Buttons should automatically log in with test credentials
5. Ensure all tests pass before merging

**Key Requirements**:
- Add two buttons side by side under the login confirmation button
- Button 1: "Login as Test Admin" - logs in with admin_test / admin123
- Button 2: "Login as Test User" - logs in with user_test / user123
- Buttons should use the same login logic as the form
- Buttons should be styled consistently with existing design
- Buttons should show loading state during login
- Buttons should handle errors gracefully

**Default Test Accounts** (from `backend/database_seed.py`):
- **Admin Account**: 
  - Username: `admin_test`
  - Password: `admin123`
  - Role: `Admin`
- **Student Account**:
  - Username: `user_test`
  - Password: `user123`
  - Role: `Student`

**Files to Modify**:
- `frontend/src/components/Auth/Login.js` - Add quick login buttons
- `frontend/src/components/Auth/Auth.css` - Style the quick login buttons
- `tests/frontend/Auth.test.js` - Add tests for quick login buttons

**Dependencies**: 
- Requires: Task 01 (Backend Auth), Task 06 (Frontend Auth)
- Test accounts should be seeded (happens automatically on backend startup)

**TDD Workflow**:
1. Write failing tests for quick login buttons
2. Implement quick login button handlers
3. Add buttons to Login component
4. Style buttons to match existing design
5. Test both admin and student quick login flows
6. All tests pass → ready to merge

**Merge Criteria**:
- ✅ All tests pass
- ✅ Quick login buttons appear under login form
- ✅ Admin button logs in as admin_test and redirects to /admin/dashboard
- ✅ User button logs in as user_test and redirects to /dashboard
- ✅ Buttons show loading state during login
- ✅ Buttons handle errors (e.g., if accounts don't exist)
- ✅ Buttons are styled consistently
- ✅ Buttons work on mobile/responsive

**Environment Setup**:
```bash
conda activate rl
cd frontend
# No additional packages needed
```

---

## 📋 Detailed Requirements

### Button Placement

**Location**: Under the login confirmation button, before the registration link

**Layout**:
```
[Login Button]
[Quick Login Buttons - Side by Side]
[Registration Link]
```

### Button Implementation

**Button 1: "Login as Test Admin"**
- Text: "Login as Test Admin" or "快速登录 (管理员)"
- On click: Call `authService.login('admin_test', 'admin123')`
- On success: Redirect to `/admin/dashboard`
- Show loading state: "Logging in as Admin..."
- Handle errors: Display error message if login fails

**Button 2: "Login as Test User"**
- Text: "Login as Test User" or "快速登录 (学生)"
- On click: Call `authService.login('user_test', 'user123')`
- On success: Redirect to `/dashboard`
- Show loading state: "Logging in as User..."
- Handle errors: Display error message if login fails

### Styling

**Button Style**:
- Side by side layout (flexbox or grid)
- Match existing button styles but with different color/variant
- Consider using secondary/outline style to differentiate from main login
- Responsive: Stack vertically on mobile if needed
- Add visual distinction (e.g., different background color or border)

**Example CSS**:
```css
.quick-login-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  margin-bottom: 15px;
}

.quick-login-button {
  flex: 1;
  padding: 0.75rem 1rem;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.quick-login-button:hover {
  background-color: #e0e0e0;
}

.quick-login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .quick-login-buttons {
    flex-direction: column;
  }
}
```

### Implementation Details

**Handler Function**:
```javascript
const handleQuickLogin = async (username, password) => {
  setLoading(true);
  setErrorMessage('');
  setSuccessMessage('');
  
  try {
    const response = await authService.login(username, password);
    contextLogin(response.access_token, response.user);
    
    if (response.user.role === 'Admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  } catch (error) {
    const errorMsg = error?.message || error?.response?.data?.detail || 'Quick login failed';
    setErrorMessage(errorMsg);
  } finally {
    setLoading(false);
  }
};
```

**Button JSX**:
```jsx
<div className="quick-login-buttons">
  <button
    type="button"
    onClick={() => handleQuickLogin('admin_test', 'admin123')}
    disabled={loading}
    className="quick-login-button"
  >
    {loading ? 'Logging in...' : 'Login as Test Admin'}
  </button>
  <button
    type="button"
    onClick={() => handleQuickLogin('user_test', 'user123')}
    disabled={loading}
    className="quick-login-button"
  >
    {loading ? 'Logging in...' : 'Login as Test User'}
  </button>
</div>
```

### Error Handling

- If test accounts don't exist: Show error message
- If backend is down: Show error message
- If login fails for any reason: Show error message
- Don't break existing login form functionality

### Testing

**Test Cases**:
1. Admin quick login button logs in successfully
2. User quick login button logs in successfully
3. Buttons show loading state during login
4. Buttons are disabled during login
5. Error handling works if login fails
6. Redirects to correct dashboard based on role
7. Buttons are visible and styled correctly
8. Responsive layout works on mobile

## 🔄 Git Workflow

```bash
git checkout main
git pull origin main
git checkout -b feature/quick-login-buttons
# ... develop with TDD ...
git checkout main
git merge feature/quick-login-buttons
```

## ✅ Success Criteria

- [ ] Two quick login buttons appear under login form
- [ ] Buttons are side by side (or stacked on mobile)
- [ ] Admin button logs in as admin_test and redirects correctly
- [ ] User button logs in as user_test and redirects correctly
- [ ] Buttons show loading state
- [ ] Buttons handle errors gracefully
- [ ] Buttons are styled consistently
- [ ] All tests pass
- [ ] No breaking changes to existing login functionality

## 📝 Notes

- These buttons are for testing/demo purposes only
- Test accounts are created automatically by backend seed script
- If accounts don't exist, backend will create them on startup
- Consider adding a visual indicator that these are test accounts
- Buttons should be clearly labeled to avoid confusion
- The buttons should reuse the existing `handleSubmit` logic or create a shared handler function

