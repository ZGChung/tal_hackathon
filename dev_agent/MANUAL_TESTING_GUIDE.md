# Manual Testing Guide

## 🎯 Purpose

This guide provides step-by-step instructions for manually testing the complete application, including all integration features, error handling, and end-to-end user flows.

## 📋 Prerequisites

### Environment Setup

1. **Backend Setup**

    ```bash
    # Activate your Python environment (e.g., conda activate rl)
    cd backend
    pip install -r requirements.txt
    # IMPORTANT: Run uvicorn from project root, not backend directory
    cd ..
    uvicorn backend.main:app --reload
    ```

    - Backend should be running on `http://localhost:8000`
    - Verify: Visit `http://localhost:8000/health` - should return `{"status": "healthy"}`

2. **Frontend Setup**
    ```bash
    cd frontend
    npm install  # If not already done
    npm start
    ```
    - Frontend should be running on `http://localhost:3000`
    - Browser should automatically open

### Test Data Preparation

-   Create a sample markdown curriculum file for testing (see example below)
-   Have test credentials ready (or register new users during testing)

---

## 🧪 Test Scenarios

### Test 1: Complete Admin Setup Flow

**Objective**: Verify admin can register, login, upload curriculum, and set preferences.

#### Step 1: Admin Registration

1. Navigate to `http://localhost:3000/register`
2. Fill in the registration form:
    - Username: `admin_test`
    - Password: `admin123`
    - Role: Select `Admin`
3. Click "Register"
4. **Expected Result**:
    - Success message displayed
    - Redirected to login page
    - No errors in browser console

#### Step 2: Admin Login

1. On login page, enter credentials:
    - Username: `admin_test`
    - Password: `admin123`
2. Click "Login"
3. **Expected Result**:
    - Successfully logged in
    - Redirected to `/admin/dashboard`
    - Welcome message shows username and role
    - No errors in browser console

#### Step 3: Upload Curriculum

1. In Admin Dashboard, ensure "Curriculum Upload" tab is selected
2. Click "Choose File" or drag and drop
3. Select a markdown file (`.md` extension)

    - **Sample curriculum content** (save as `test_curriculum.md`):

        ```markdown
        # Mathematics Curriculum

        ## Chapter 1: Algebra

        -   Linear equations
        -   Quadratic equations
        -   Polynomials

        ## Chapter 2: Geometry

        -   Triangles
        -   Circles
        -   Area and perimeter

        ## Chapter 3: Calculus

        -   Derivatives
        -   Integrals
        -   Limits
        ```

4. Click "Upload"
5. **Expected Result**:
    - Loading state shows "Uploading..." (button disabled)
    - Success message: "Uploaded successfully! Keywords: [list of keywords]"
    - File input cleared
    - Keywords extracted and displayed
    - No errors in browser console

#### Step 4: View Curriculum List

1. Click "Curriculum List" tab
2. **Expected Result**:
    - Loading state shows briefly
    - List displays uploaded curriculum
    - Shows filename, upload date, and keywords
    - No errors

#### Step 5: Set Preferences

1. Click "Preferences" tab
2. Fill in the form:
    - Focus Areas: `STEM, Mathematics, Science`
    - Keywords: `problem-solving, critical thinking, innovation`
    - Subject Preferences: `Math, Physics, Chemistry`
3. Click "Save Preferences"
4. **Expected Result**:
    - Loading state shows "Saving..." (button disabled)
    - Success message: "Preferences saved successfully!"
    - Form data persists
    - No errors

#### Step 6: Verify Preferences Persist

1. Refresh the page (F5)
2. Navigate back to "Preferences" tab
3. **Expected Result**:
    - Previously saved preferences are loaded
    - All fields populated correctly
    - No errors

---

### Test 2: Content Rewriting Flow

**Objective**: Verify users can view RedNote feed, see rewritten content, and compare original vs rewritten.

#### Step 1: Access RedNote Feed

1. While logged in as admin (or any user), navigate to `/feed` or click "RedNote Feed" in navigation
2. **Expected Result**:
    - Loading spinner shows "加载中..."
    - Feed loads successfully
    - Posts displayed in card format
    - Each post shows: author, text, engagement metrics
    - No errors

#### Step 2: Access Content Feed (Rewritten Content)

1. Navigate to `/content` or click "Content Feed" in navigation
2. **Expected Result**:
    - Loading spinner shows "加载中..."
    - System fetches RedNote posts
    - Each post is rewritten using curriculum keywords
    - Rewritten posts displayed
    - Shows rewritten text with "Compare" button
    - No errors

#### Step 3: Compare Original vs Rewritten

1. Click "Compare" button on any rewritten post
2. **Expected Result**:
    - Comparison modal/view opens
    - Shows side-by-side or before/after view
    - Original text on one side
    - Rewritten text on other side
    - Keywords used are highlighted or listed
    - Can close comparison view
    - No errors

#### Step 4: Verify Keywords Integration

1. Check if rewritten content incorporates curriculum keywords
2. **Expected Result**:
    - Rewritten text includes relevant keywords from uploaded curriculum
    - Content is contextually appropriate
    - Keywords are natural, not forced

---

### Test 3: Authentication Flow

**Objective**: Verify complete authentication cycle works correctly.

#### Step 3.1: User Registration

1. Navigate to `/register`
2. Register a new student:
    - Username: `student_test`
    - Password: `student123`
    - Role: `Student`
3. **Expected Result**:
    - Registration successful
    - Redirected to login page
    - Success message displayed

#### Step 3.2: User Login

1. Login with student credentials
2. **Expected Result**:
    - Login successful
    - Redirected to `/dashboard` (not admin dashboard)
    - Token stored in localStorage
    - User info displayed

#### Step 3.3: Access Protected Routes

1. Try accessing `/admin/dashboard` as student
2. **Expected Result**:
    - Redirected to `/dashboard` (student cannot access admin routes)
    - No error page shown
    - Appropriate access control

#### Step 3.4: Logout

1. Click "Logout" button
2. **Expected Result**:
    - Logged out successfully
    - Redirected to login page
    - Token cleared from localStorage
    - Cannot access protected routes

#### Step 3.5: Token Expiration Handling

1. Manually delete token from localStorage (DevTools → Application → Local Storage)
2. Try to access a protected route
3. **Expected Result**:
    - Automatically redirected to login
    - No error boundary triggered
    - User-friendly redirect

---

### Test 4: Error Handling & Edge Cases

#### Test 4.1: Network Error Handling

1. Stop the backend server
2. Try to perform any API operation (e.g., upload curriculum, fetch feed)
3. **Expected Result**:
    - Error message displayed: "Network error: Unable to connect to server..."
    - No unhandled errors in console
    - UI remains functional
    - Retry option available

#### Test 4.2: Invalid File Upload

1. As admin, try to upload a non-markdown file (e.g., `.txt`, `.pdf`)
2. **Expected Result**:
    - Error message: "Please select a markdown (.md) file"
    - Upload button disabled or shows error
    - No file uploaded

#### Test 4.3: Unauthorized Access

1. Logout or use incognito window
2. Try to access `/admin/dashboard` directly
3. **Expected Result**:
    - Redirected to login page
    - No error boundary triggered
    - Appropriate access control

#### Test 4.4: Student Cannot Access Admin Endpoints

1. Login as student
2. Try to access admin features (curriculum upload, preferences)
3. **Expected Result**:
    - Cannot access admin dashboard
    - Appropriate error or redirect
    - No 500 errors

#### Test 4.5: Rewrite Without Curriculum

1. As admin, delete all curricula (if possible) or use a fresh admin account
2. Try to rewrite content
3. **Expected Result**:
    - Error message: "Curriculum not found. Please upload a curriculum first."
    - Graceful error handling
    - No crash

#### Test 4.6: Error Boundary Test

1. Open browser DevTools Console
2. Manually trigger an error (if possible through React DevTools)
3. **Expected Result**:
    - Error boundary catches the error
    - Fallback UI displayed: "⚠️ Something went wrong"
    - "Try Again" and "Go Home" buttons available
    - Error details shown in development mode

---

### Test 5: CORS & API Integration

#### Test 5.1: CORS Headers Verification

1. Open browser DevTools → Network tab
2. Perform any API request (e.g., login, fetch feed)
3. Check response headers
4. **Expected Result**:
    - `Access-Control-Allow-Origin: http://localhost:3000` present
    - `Access-Control-Allow-Credentials: true` present
    - No CORS errors in console

#### Test 5.2: API Request/Response Flow

1. Open DevTools → Network tab
2. Perform various operations (login, upload, fetch)
3. **Expected Result**:
    - All requests include `Authorization: Bearer <token>` header (when authenticated)
    - Responses have correct status codes (200, 201, 400, 401, 403, 404, 422, 500)
    - Error responses include `detail` field with user-friendly messages

#### Test 5.3: JWT Token Handling

1. Login and check Network tab
2. Verify token is sent in subsequent requests
3. **Expected Result**:
    - Token included in `Authorization` header
    - Token format: `Bearer <jwt_token>`
    - Token persists across page refreshes (stored in localStorage)

---

### Test 6: Loading States & UX

#### Test 6.1: Loading States During API Calls

1. Perform slow operations (upload large file, fetch feed)
2. **Expected Result**:
    - Loading spinner/indicator shows immediately
    - Buttons disabled during operation
    - "Loading..." or "Uploading..." text displayed
    - No duplicate requests triggered

#### Test 6.2: Button Disabled States

1. Click submit/upload button
2. Immediately try to click again
3. **Expected Result**:
    - Button disabled after first click
    - Cannot trigger duplicate requests
    - Button re-enabled after operation completes

#### Test 6.3: Loading States in Different Components

-   **RedNote Feed**: Loading spinner shows while fetching
-   **Content Feed**: Loading spinner shows while fetching and rewriting
-   **Curriculum Upload**: Button shows "Uploading..." and is disabled
-   **Preferences Form**: Button shows "Saving..." and is disabled
-   **Curriculum List**: "Loading..." text shows while fetching

---

### Test 7: Complete End-to-End User Journey

**Objective**: Test the complete flow from registration to content consumption.

#### Complete Flow:

1. **Register Admin** → `/register` → Create admin account
2. **Login** → `/login` → Access admin dashboard
3. **Upload Curriculum** → Extract keywords successfully
4. **Set Preferences** → Save focus areas and keywords
5. **View RedNote Feed** → See original posts
6. **View Content Feed** → See rewritten posts with curriculum integration
7. **Compare Content** → View original vs rewritten side-by-side
8. **Logout** → Return to login page
9. **Register Student** → Create student account
10. **Login as Student** → Access student dashboard
11. **View Feeds** → Student can view feeds (but not admin features)

**Expected Result**: All steps complete without errors, smooth user experience, all features work as expected.

---

## ✅ Verification Checklist

After completing all tests, verify:

-   [ ] All API endpoints accessible from frontend
-   [ ] CORS properly configured (no CORS errors)
-   [ ] Error messages display properly (user-friendly)
-   [ ] Complete user flows work smoothly
-   [ ] Loading states show during operations
-   [ ] Error boundary catches component errors
-   [ ] Authentication works (login, logout, token handling)
-   [ ] Role-based access control works (admin vs student)
-   [ ] Curriculum upload and keyword extraction works
-   [ ] Preferences save and load correctly
-   [ ] Content rewriting incorporates curriculum keywords
-   [ ] Comparison view works correctly
-   [ ] Network errors handled gracefully
-   [ ] Invalid inputs rejected with appropriate errors
-   [ ] No critical bugs or crashes
-   [ ] Demo ready for presentation

---

## 🐛 Common Issues & Troubleshooting

### Issue: CORS Errors

**Symptom**: Console shows CORS errors
**Solution**:

-   Verify backend is running on port 8000
-   Check `backend/main.py` CORS configuration
-   Ensure frontend is on port 3000

### Issue: 401 Unauthorized Errors

**Symptom**: API calls return 401
**Solution**:

-   Check if token exists in localStorage
-   Verify token format in Authorization header
-   Try logging out and logging back in

### Issue: Loading States Not Showing

**Symptom**: No loading indicators
**Solution**:

-   Check browser console for errors
-   Verify API calls are being made
-   Check component state management

### Issue: Error Boundary Not Catching Errors

**Symptom**: White screen or unhandled errors
**Solution**:

-   Verify ErrorBoundary wraps App component
-   Check React error boundaries are properly configured
-   Look for errors in console

---

## 📝 Test Results Template

Use this template to document your test results:

```
Test Date: __________
Tester: __________
Environment: Backend (port 8000) / Frontend (port 3000)

Test 1: Admin Setup Flow
- [ ] Registration: PASS / FAIL
- [ ] Login: PASS / FAIL
- [ ] Curriculum Upload: PASS / FAIL
- [ ] Preferences: PASS / FAIL
Notes: __________

Test 2: Content Rewriting Flow
- [ ] RedNote Feed: PASS / FAIL
- [ ] Content Feed: PASS / FAIL
- [ ] Comparison View: PASS / FAIL
Notes: __________

Test 3: Authentication Flow
- [ ] Registration: PASS / FAIL
- [ ] Login: PASS / FAIL
- [ ] Protected Routes: PASS / FAIL
- [ ] Logout: PASS / FAIL
Notes: __________

Test 4: Error Handling
- [ ] Network Errors: PASS / FAIL
- [ ] Invalid Inputs: PASS / FAIL
- [ ] Unauthorized Access: PASS / FAIL
- [ ] Error Boundary: PASS / FAIL
Notes: __________

Overall Status: ✅ READY / ❌ ISSUES FOUND

Issues Found:
1. __________
2. __________
```

---

## 🎯 Success Criteria

The application is ready for demo when:

1. ✅ All user flows work end-to-end without errors
2. ✅ Error handling works gracefully (no crashes)
3. ✅ Loading states provide good UX
4. ✅ CORS configured correctly
5. ✅ Authentication and authorization work
6. ✅ Content rewriting integrates curriculum keywords
7. ✅ No critical bugs or blocking issues

---

## 📞 Support

If you encounter issues during testing:

1. Check browser console for errors
2. Check backend logs for API errors
3. Verify environment setup (ports, dependencies)
4. Review this guide's troubleshooting section
5. Check integration test results: `pytest tests/integration/test_e2e_flows.py -v`

---

**Happy Testing! 🚀**
