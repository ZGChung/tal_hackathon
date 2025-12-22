# Task 09: Frontend Content Display & Comparison

## 🎯 STANDALONE AGENT PROMPT
Copy this entire section to initialize a new agent:

---

**You are a frontend developer working on Task 09: Frontend Content Display & Comparison for a hackathon demo.**

**Context**: This is a React frontend application. You need to build UI to display rewritten content and allow comparison between original and rewritten versions.

**Your Mission**:
1. Create feature branch: `feature/frontend-content-display`
2. Follow TDD: Write tests first, then implement
3. Build content feed with rewritten posts
4. Create comparison view (original vs rewritten)
5. Ensure all tests pass before merging

**Key Requirements**:
- Display rewritten content in feed
- Side-by-side or toggle view for comparison
- Visual indicators for rewritten content
- Fetch original posts and call rewrite API
- Show curriculum alignment (optional)

**Files to Create**:
- `frontend/src/pages/ContentFeed.js`
- `frontend/src/components/Content/RewrittenPostCard.js`
- `frontend/src/components/Content/ComparisonView.js`
- `frontend/src/services/rewriteService.js`
- `frontend/src/App.js` - Add content feed route
- `tests/frontend/ContentDisplay.test.js`

**Dependencies**: 
- Requires: Task 04 (Backend Rewriting), Task 05 (Mock RedNote), Task 08 (RedNote Feed)
- This is the core demo feature!

**TDD Workflow**:
1. Write failing tests for rewrite service
2. Implement rewrite service
3. Write failing tests for RewrittenPostCard
4. Implement RewrittenPostCard
5. Write failing tests for ComparisonView
6. Implement ComparisonView
7. Write failing tests for ContentFeed
8. Implement ContentFeed
9. All tests pass → ready to merge

**Merge Criteria**:
- ✅ All tests pass
- ✅ Rewritten content displays
- ✅ Comparison view works
- ✅ Visual indicators show rewritten status
- ✅ Feed is functional

**Environment Setup**:
```bash
conda activate rl
cd frontend
# No additional packages needed
```

---

## 📋 Detailed Requirements

### Components

1. **ContentFeed** (`pages/ContentFeed.js`)
   - Fetches posts from RedNote feed
   - Calls rewrite API for each post (or batch)
   - Displays rewritten posts
   - Shows loading state during rewriting
   - Handles errors

2. **RewrittenPostCard** (`components/Content/RewrittenPostCard.js`)
   - Similar to PostCard but for rewritten content
   - Shows indicator: "Rewritten" badge
   - Displays rewritten text
   - Button to view original/comparison

3. **ComparisonView** (`components/Content/ComparisonView.js`)
   - Side-by-side or toggle view
   - Left: Original post
   - Right: Rewritten post
   - Highlight differences (optional)
   - Close button

### User Flow

1. User navigates to Content Feed
2. System fetches RedNote posts
3. For each post, call rewrite API
4. Display rewritten posts in feed
5. User clicks "Compare" → shows ComparisonView
6. User can toggle between original/rewritten

### API Service

- `rewriteService.js`: rewriteText(text, curriculum_id?)

## 🔄 Git Workflow

```bash
git checkout main
git pull origin main
git checkout -b feature/frontend-content-display
# ... develop with TDD ...
git checkout main
git merge feature/frontend-content-display
```

## ✅ Success Criteria

- [ ] Rewritten content displays in feed
- [ ] Users can compare original vs rewritten
- [ ] Visual indicators show rewritten status
- [ ] Comparison view works (side-by-side or toggle)
- [ ] Feed is functional and responsive
- [ ] All tests pass
