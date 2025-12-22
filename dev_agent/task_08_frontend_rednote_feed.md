# Task 08: Frontend Mock RedNote Feed UI

## 🎯 STANDALONE AGENT PROMPT
Copy this entire section to initialize a new agent:

---

**You are a frontend developer working on Task 08: Frontend Mock RedNote Feed UI for a hackathon demo.**

**Context**: This is a React frontend application. You need to build a RedNote-like feed interface to display social media posts.

**Your Mission**:
1. Create feature branch: `feature/frontend-rednote-feed`
2. Follow TDD: Write tests first, then implement
3. Build RedNote-style feed page
4. Create post card components
5. Style to resemble RedNote (小红书)
6. Ensure all tests pass before merging

**Key Requirements**:
- Feed page displaying posts
- Post cards with: author, text, image, likes, timestamp
- RedNote-like styling (Chinese social media aesthetic)
- Responsive design
- Loading and error states

**Files to Create**:
- `frontend/src/pages/RedNoteFeed.js`
- `frontend/src/components/Post/PostCard.js`
- `frontend/src/components/Post/PostList.js`
- `frontend/src/services/rednoteService.js`
- `frontend/src/styles/RedNoteFeed.css`
- `frontend/src/App.js` - Add feed route
- `tests/frontend/RedNoteFeed.test.js`

**Dependencies**: 
- Requires: Task 05 (Backend Mock RedNote), Task 06 (Frontend Auth)
- If backend not ready, use mock data

**TDD Workflow**:
1. Write failing tests for PostCard component
2. Implement PostCard component
3. Write failing tests for PostList component
4. Implement PostList component
5. Write failing tests for RedNoteFeed page
6. Implement RedNoteFeed page
7. All tests pass → ready to merge

**Merge Criteria**:
- ✅ All tests pass
- ✅ Feed displays posts from backend
- ✅ Posts styled like RedNote
- ✅ Responsive layout
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

1. **RedNoteFeed** (`pages/RedNoteFeed.js`)
   - Fetches posts from `/api/rednote/feed`
   - Displays PostList
   - Handles loading state
   - Handles error state

2. **PostCard** (`components/Post/PostCard.js`)
   - Displays:
     - Author name and avatar (placeholder)
     - Post text (Chinese)
     - Image (if available)
     - Like count
     - Timestamp
   - RedNote-style styling

3. **PostList** (`components/Post/PostList.js`)
   - Container for PostCard components
   - Grid or list layout
   - Responsive

### Styling

**RedNote (小红书) Style**:
- Clean, modern design
- Pink/red accent colors (optional)
- Card-based layout
- Chinese typography
- Image-focused posts

**CSS Approach**:
- Use CSS modules or regular CSS
- Keep it simple but visually appealing
- Responsive (mobile-friendly)

### API Service

- `rednoteService.js`: getFeed(), getPost(id)

## 🔄 Git Workflow

```bash
git checkout main
git pull origin main
git checkout -b feature/frontend-rednote-feed
# ... develop with TDD ...
git checkout main
git merge feature/frontend-rednote-feed
```

## ✅ Success Criteria

- [ ] Feed displays posts from backend
- [ ] Posts styled like RedNote
- [ ] Responsive layout works
- [ ] Loading state shows
- [ ] Error state handled
- [ ] All tests pass
