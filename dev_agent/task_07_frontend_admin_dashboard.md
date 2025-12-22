# Task 07: Frontend Admin Dashboard

## Objective
Build React components for Admin users to upload curriculum and manage preferences.

## Requirements
- Admin dashboard page (protected route)
- Curriculum upload component:
  - File upload input (markdown files)
  - Upload button
  - Display uploaded curricula list
  - Show parsing status/results
- Preferences management component:
  - Form to set educational focus areas
  - Form to set keywords to prioritize
  - Save/update preferences
  - Display current preferences

## Technical Details
- Use React Router for navigation
- File upload using FormData
- Form components with validation
- API integration with backend endpoints
- Display curriculum list and preferences
- Error handling and success messages

## Files to Create/Modify
- `frontend/src/pages/AdminDashboard.js` - Main admin dashboard
- `frontend/src/components/Admin/CurriculumUpload.js` - Upload component
- `frontend/src/components/Admin/CurriculumList.js` - List component
- `frontend/src/components/Admin/PreferencesForm.js` - Preferences form
- `frontend/src/App.js` - Add admin route
- `tests/frontend/Admin.test.js` - Tests (TDD)

## Success Criteria
- Admin can upload markdown curriculum files
- Admin can see list of uploaded curricula
- Admin can set and update preferences
- Forms have proper validation
- Success/error messages display
- All tests pass

## Notes
- Keep UI functional and clear
- Show loading states during upload
- Display parsed keywords/concepts after upload

