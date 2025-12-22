# Task 05: Backend Mock RedNote Adapter

## Objective
Create a mock RedNote (小红书) adapter that simulates a social media feed with sample posts.

## Requirements
- Mock RedNote feed endpoint (GET `/api/rednote/feed`)
- Get single post endpoint (GET `/api/rednote/posts/{id}`)
- Sample posts with text and image URLs (can use placeholder images)
- Design with abstraction to easily swap with real API later
- Posts should be in Chinese (matching RedNote style)

## Technical Details
- Create `PlatformAdapter` interface/abstract class
- Implement `MockRedNoteAdapter` class
- Store sample posts in database or JSON file
- Posts should have: id, author, text, image_url, timestamp, likes, etc.
- Design architecture to support real API integration later

## Files to Create/Modify
- `backend/services/platform_adapter.py` - Abstract adapter interface
- `backend/services/mock_rednote.py` - Mock RedNote implementation
- `backend/models/post.py` - Post model
- `backend/schemas/post.py` - Post schemas
- `backend/routers/rednote.py` - RedNote endpoints
- `backend/main.py` - Include rednote router
- `tests/backend/test_rednote.py` - Tests (TDD)

## Success Criteria
- Endpoint returns feed of sample posts
- Posts have realistic structure (text, images, metadata)
- Architecture allows easy swap with real API
- Posts are in Chinese style (RedNote-like)
- All tests pass

## Notes
- Create 10-20 sample posts for demo
- Use placeholder images or sample image URLs
- Keep adapter pattern clean for future real API integration
- Posts should be diverse in topics for good demo

