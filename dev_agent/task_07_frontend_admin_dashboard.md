# Task 07: Frontend Admin Dashboard

## 🎯 STANDALONE AGENT PROMPT
Copy this entire section to initialize a new agent:

---

**You are a frontend developer working on Task 07: Frontend Admin Dashboard for a hackathon demo.**

**Context**: This is a React frontend application. You need to build an admin dashboard for curriculum upload and preferences management.

**Your Mission**:
1. Create feature branch: `feature/frontend-admin-dashboard`
2. Follow TDD: Write tests first, then implement
3. Build curriculum upload component
4. Build preferences management component
5. Create admin dashboard page
6. Ensure all tests pass before merging

**Key Requirements**:
- Admin-only protected page
- Curriculum file upload (markdown)
- Display uploaded curricula list
- Preferences form (focus areas, keywords)
- Success/error messages
- Loading states

**Files to Create**:
- `frontend/src/pages/AdminDashboard.js`
- `frontend/src/components/Admin/CurriculumUpload.js`
- `frontend/src/components/Admin/CurriculumList.js`
- `frontend/src/components/Admin/PreferencesForm.js`
- `frontend/src/services/curriculumService.js`
- `frontend/src/services/preferencesService.js`
- `frontend/src/App.js` - Add admin route
- `tests/frontend/Admin.test.js`

**Dependencies**: 
- Requires: Task 01, Task 02, Task 03, Task 06
- If backends not ready, use mock API responses

**TDD Workflow**:
1. Write failing tests for curriculum upload
2. Implement curriculum upload component
3. Write failing tests for curriculum list
4. Implement curriculum list component
5. Write failing tests for preferences form
6. Implement preferences form
7. All tests pass → ready to merge

**Merge Criteria**:
- ✅ All tests pass
- ✅ Admin can upload curriculum
- ✅ Admin can view curricula list
- ✅ Admin can set preferences
- ✅ Forms validated
- ✅ Loading/error states work

**Environment Setup**:
```bash
conda activate rl
cd frontend
# No additional packages needed
```

---

## 📋 Detailed Requirements

### Components

1. **AdminDashboard** (`pages/AdminDashboard.js`)
   - Protected route (Admin only)
   - Layout with tabs or sections:
     - Curriculum Upload
     - Curriculum List
     - Preferences

2. **CurriculumUpload** (`components/Admin/CurriculumUpload.js`)
   - File input (accept .md files)
   - Upload button
   - Loading state during upload
   - Success message with parsed keywords
   - Error handling

3. **CurriculumList** (`components/Admin/CurriculumList.js`)
   - Display list of uploaded curricula
   - Show: filename, keywords, upload date
   - Can delete (optional)

4. **PreferencesForm** (`components/Admin/PreferencesForm.js`)
   - Form fields:
     - Focus areas (multi-input or tags)
     - Keywords (multi-input or tags)
     - Subject preferences (multi-input)
   - Save button
   - Display current preferences if exist
   - Success/error messages

### API Services

- `curriculumService.js`: upload, list, get by ID
- `preferencesService.js`: create, get, update

## 🔄 Git Workflow

```bash
git checkout main
git pull origin main
git checkout -b feature/frontend-admin-dashboard
# ... develop with TDD ...
git checkout main
git merge feature/frontend-admin-dashboard
```

## ✅ Success Criteria

- [ ] Admin can upload markdown curriculum files
- [ ] Admin can see list of uploaded curricula
- [ ] Admin can set preferences
- [ ] Admin can update preferences
- [ ] Forms validated properly
- [ ] Loading states work
- [ ] Error messages display
- [ ] All tests pass
