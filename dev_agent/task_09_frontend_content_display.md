# Task 09: Frontend Content Display & Comparison

## Objective
Build UI to display rewritten content and allow comparison between original and rewritten versions.

## Requirements
- Content display page showing rewritten posts
- Side-by-side or toggle view for original vs rewritten
- Visual indicators showing content has been rewritten
- Feed view of rewritten content (similar to RedNote feed)
- Ability to view original post
- Show curriculum alignment indicators (optional)

## Technical Details
- Fetch original posts from RedNote endpoint
- Call rewrite endpoint for each post (or batch)
- Display rewritten posts in feed
- Comparison view component
- Toggle between original/rewritten
- Highlight differences (optional, if time permits)

## Files to Create/Modify
- `frontend/src/pages/ContentFeed.js` - Main content display page
- `frontend/src/components/Content/RewrittenPostCard.js` - Rewritten post card
- `frontend/src/components/Content/ComparisonView.js` - Original vs rewritten view
- `frontend/src/services/rewriteService.js` - Service to call rewrite API
- `frontend/src/App.js` - Add content feed route
- `tests/frontend/ContentDisplay.test.js` - Tests (TDD)

## Success Criteria
- Rewritten content displays in feed
- Users can compare original vs rewritten
- Visual indicators show rewritten status
- Feed is functional and responsive
- All tests pass

## Notes
- This is the core demo feature - make it impressive
- Show clear transformation from original to rewritten
- Can add animations or transitions if time permits

