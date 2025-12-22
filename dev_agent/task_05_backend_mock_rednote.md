# Task 05: Backend Mock RedNote Adapter

## 🎯 STANDALONE AGENT PROMPT
Copy this entire section to initialize a new agent:

---

**You are a backend developer working on Task 05: Backend Mock RedNote Adapter for a hackathon demo.**

**Context**: This is a FastAPI backend. You need to create a mock RedNote (小红书) adapter that simulates a social media feed with sample posts.

**Your Mission**:
1. Create feature branch: `feature/backend-mock-rednote`
2. Follow TDD: Write tests first, then implement
3. Create platform adapter interface (for future real API swap)
4. Implement mock RedNote adapter with sample posts
5. Ensure all tests pass before merging

**Key Requirements**:
- GET `/api/rednote/feed` - Returns feed of posts
- GET `/api/rednote/posts/{id}` - Returns single post
- Use adapter pattern for easy real API swap later
- Posts in Chinese (RedNote style)
- 10-20 sample posts

**Files to Create**:
- `backend/services/platform_adapter.py` - Abstract adapter interface
- `backend/services/mock_rednote.py` - Mock RedNote implementation
- `backend/models/post.py` - Post model (optional, can use in-memory)
- `backend/schemas/post.py` - Post schemas
- `backend/routers/rednote.py` - RedNote endpoints
- `tests/backend/test_rednote.py` - Tests

**Dependencies**: 
- **None** - This is completely independent!
- Can work in parallel with Tasks 02, 03

**TDD Workflow**:
1. Write failing tests for adapter interface
2. Implement adapter interface
3. Write failing tests for mock implementation
4. Implement mock RedNote adapter
5. Write failing tests for endpoints
6. Implement endpoints
7. All tests pass → ready to merge

**Merge Criteria**:
- ✅ All tests pass
- ✅ Feed endpoint returns posts
- ✅ Single post endpoint works
- ✅ Adapter pattern allows easy swap

**Environment Setup**:
```bash
conda activate rl
cd backend
# No additional packages needed
```

---

## 📋 Detailed Requirements

### Endpoints

1. **GET `/api/rednote/feed`**
   - Response: `[{id, author, text, image_url, likes, timestamp}, ...]`
   - Returns array of posts (10-20 sample posts)
   - Can add pagination if time permits

2. **GET `/api/rednote/posts/{id}`**
   - Response: `{id, author, text, image_url, likes, timestamp, ...}`
   - Returns single post by ID

### Platform Adapter Pattern

**Abstract Interface** (`platform_adapter.py`):
```python
class PlatformAdapter(ABC):
    @abstractmethod
    def get_feed(self) -> List[Post]:
        pass
    
    @abstractmethod
    def get_post(self, post_id: str) -> Post:
        pass
```

**Mock Implementation** (`mock_rednote.py`):
- Implements `PlatformAdapter`
- Returns hardcoded sample posts
- Posts in Chinese (小红书 style)
- Realistic structure: author, text, images, likes, timestamps

### Sample Posts

Create 10-20 diverse posts:
- Mix of topics (lifestyle, food, travel, etc.)
- Chinese text (小红书 style)
- Placeholder images (use URLs like `https://via.placeholder.com/400`)
- Realistic metadata (likes, timestamps)

**Post Structure**:
- id: str
- author: str (username)
- text: str (post content in Chinese)
- image_url: str (placeholder or sample image)
- likes: int
- timestamp: datetime
- (optional: comments, shares)

## 🔄 Git Workflow

```bash
git checkout main
git pull origin main
git checkout -b feature/backend-mock-rednote
# ... develop with TDD ...
git checkout main
git merge feature/backend-mock-rednote
```

## ✅ Success Criteria

- [ ] Feed endpoint returns array of posts
- [ ] Single post endpoint works
- [ ] Posts have realistic structure
- [ ] Adapter pattern implemented (easy to swap)
- [ ] Posts in Chinese style
- [ ] All tests pass
