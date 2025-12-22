# Task 10: Frontend-Backend Integration & End-to-End Flow

## 🎯 STANDALONE AGENT PROMPT
Copy this entire section to initialize a new agent:

---

**You are an integration developer working on Task 10: Frontend-Backend Integration & End-to-End Flow for a hackathon demo.**

**Context**: All features are implemented. You need to ensure seamless integration, fix any issues, and verify end-to-end flows work.

**Your Mission**:
1. Create feature branch: `feature/integration-e2e`
2. Test all API integrations
3. Fix CORS and connectivity issues
4. Add error boundaries and loading states
5. Verify complete user flows
6. Write integration tests
7. Ensure demo is ready

**Key Requirements**:
- Verify all API endpoints accessible from frontend
- CORS properly configured
- Error handling across stack
- Complete user flows work:
  1. Admin registers → uploads curriculum → sets preferences
  2. User views RedNote feed → sees rewritten content
  3. User compares original vs rewritten
- Loading states throughout
- Error messages display properly

**Files to Create/Modify**:
- `backend/main.py` - Verify CORS settings
- `frontend/src/utils/api.js` - Enhance error handling
- `frontend/src/components/ErrorBoundary.js` - React error boundary
- `frontend/src/components/Loading.js` - Loading component
- `tests/integration/test_e2e_flows.py` - E2E tests

**Dependencies**: 
- Requires ALL previous tasks to be merged
- This is the final integration step

**TDD Workflow**:
1. Write integration tests for user flows
2. Run tests, identify issues
3. Fix CORS, API connectivity issues
4. Add error boundaries
5. Add loading states where missing
6. Fix any bugs found
7. All tests pass → ready for demo

**Merge Criteria**:
- ✅ All integration tests pass
- ✅ All user flows work end-to-end
- ✅ CORS configured correctly
- ✅ Error handling works
- ✅ Loading states show
- ✅ No critical bugs
- ✅ Demo ready

**Environment Setup**:
```bash
conda activate rl
# Backend running: cd backend && uvicorn main:app --reload
# Frontend running: cd frontend && npm start
```

---

## 📋 Detailed Requirements

### Integration Checks

1. **CORS Configuration**
   - Backend allows frontend origin (localhost:3000)
   - Headers and methods configured correctly
   - Credentials allowed if needed

2. **API Connectivity**
   - All endpoints accessible from frontend
   - JWT tokens sent correctly
   - Error responses handled

3. **Error Handling**
   - React ErrorBoundary catches component errors
   - API errors display user-friendly messages
   - Network errors handled gracefully

4. **Loading States**
   - Show loading during API calls
   - Disable buttons during operations
   - Skeleton screens or spinners

### End-to-End Flows

**Flow 1: Admin Setup**
1. Admin registers → receives JWT
2. Admin logs in → redirected to dashboard
3. Admin uploads curriculum → sees keywords extracted
4. Admin sets preferences → saved successfully

**Flow 2: Content Rewriting**
1. User (Student or Admin) views RedNote feed
2. User navigates to Content Feed
3. System fetches posts and rewrites them
4. User sees rewritten content
5. User clicks "Compare" → sees original vs rewritten

**Flow 3: Authentication**
1. User registers → redirected to login
2. User logs in → token stored
3. User accesses protected route → allowed
4. User logs out → token cleared

### Integration Tests

Write tests for:
- Complete user registration/login flow
- Curriculum upload flow
- Preferences setting flow
- Content rewriting flow
- Error scenarios

## 🔄 Git Workflow

```bash
git checkout main
git pull origin main
git checkout -b feature/integration-e2e
# ... test, fix, commit ...
git checkout main
git merge feature/integration-e2e
```

## ✅ Success Criteria

- [ ] All API calls work from frontend
- [ ] CORS properly configured
- [ ] Error messages display to users
- [ ] Complete user flows work smoothly
- [ ] Loading states show during operations
- [ ] All integration tests pass
- [ ] No critical bugs
- [ ] Demo ready for presentation
