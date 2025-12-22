# Task 08: Frontend Mock RedNote Feed UI

## Objective
Build a RedNote-like feed interface to display social media posts (mock data).

## Requirements
- Feed page displaying posts in RedNote style
- Post cards with:
  - Author name and avatar
  - Post text
  - Image (if available)
  - Like count
  - Timestamp
- Infinite scroll or pagination
- RedNote-like styling (Chinese social media aesthetic)
- Responsive design

## Technical Details
- Fetch posts from backend mock RedNote endpoint
- Create PostCard component
- Style to resemble RedNote (小红书) interface
- Use CSS or styled-components for styling
- Handle loading states
- Handle empty states

## Files to Create/Modify
- `frontend/src/pages/RedNoteFeed.js` - Feed page
- `frontend/src/components/Post/PostCard.js` - Individual post card
- `frontend/src/components/Post/PostList.js` - Post list container
- `frontend/src/styles/RedNoteFeed.css` - Styling
- `frontend/src/App.js` - Add feed route
- `tests/frontend/RedNoteFeed.test.js` - Tests (TDD)

## Success Criteria
- Feed displays posts from backend
- Posts look similar to RedNote style
- Responsive layout works
- Loading and error states handled
- All tests pass

## Notes
- Focus on visual similarity to RedNote for demo impact
- Use placeholder images or sample image URLs
- Keep it clean and modern

