# Task 03: Backend Admin Preferences API

## Objective
Create API endpoints for Admin users to set and manage preferences/requirements for content rewriting.

## Requirements
- Create preferences endpoint (POST `/api/preferences`) - Admin only
- Update preferences endpoint (PUT `/api/preferences/{id}`) - Admin only
- Get preferences endpoint (GET `/api/preferences`) - Admin only
- Preferences should include:
  - Educational focus areas (list of subjects/topics)
  - Keywords to prioritize
  - Subject preferences

## Technical Details
- Store preferences in database linked to user or as global settings
- Use Pydantic models for validation
- Ensure only Admin role can modify preferences
- Simple JSON structure for preferences

## Files to Create/Modify
- `backend/models/preferences.py` - Preferences model
- `backend/schemas/preferences.py` - Pydantic schemas
- `backend/routers/preferences.py` - Preferences endpoints
- `backend/main.py` - Include preferences router
- `tests/backend/test_preferences.py` - Tests (TDD)

## Success Criteria
- Admin can create preferences
- Admin can update preferences
- Admin can retrieve preferences
- Student role cannot access preferences endpoints
- Preferences are stored and retrievable
- All tests pass

## Notes
- Keep preference structure simple and extensible
- Can add more preference types later if time permits

