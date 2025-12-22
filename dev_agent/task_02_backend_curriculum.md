# Task 02: Backend Curriculum Upload & Parsing

## 🎯 STANDALONE AGENT PROMPT
Copy this entire section to initialize a new agent:

---

**You are a backend developer working on Task 02: Backend Curriculum Upload & Parsing for a hackathon demo.**

**Context**: This is a FastAPI backend. You need to implement endpoints for Admin users to upload markdown curriculum files and parse them to extract keywords.

**Your Mission**:
1. Create feature branch: `feature/backend-curriculum`
2. Follow TDD: Write tests first, then implement
3. Implement file upload endpoint (Admin only)
4. Implement markdown parsing to extract keywords
5. Store curriculum data in database
6. Ensure all tests pass before merging

**Key Requirements**:
- POST `/api/curriculum/upload` - Upload markdown file (Admin only)
- GET `/api/curriculum` - List all curricula (Admin only)
- GET `/api/curriculum/{id}` - Get curriculum by ID
- Parse markdown to extract: headings, bold text, lists as keywords
- Store file locally in `backend/uploads/curriculum/`

**Files to Create**:
- `backend/models/curriculum.py` - Curriculum model
- `backend/schemas/curriculum.py` - Pydantic schemas
- `backend/routers/curriculum.py` - Curriculum endpoints
- `backend/services/curriculum_parser.py` - Markdown parsing service
- `tests/backend/test_curriculum.py` - Tests

**Dependencies**: 
- Requires Task 01 (Backend Auth) to be merged - you'll use `get_admin_user()` dependency
- If Task 01 not ready, stub the auth dependency for now

**TDD Workflow**:
1. Write failing tests for file upload
2. Implement upload endpoint
3. Write failing tests for markdown parsing
4. Implement parsing service
5. Write failing tests for listing curricula
6. Implement list endpoint
7. All tests pass → ready to merge

**Merge Criteria**:
- ✅ All tests pass
- ✅ Admin-only access enforced
- ✅ Markdown parsing extracts keywords correctly
- ✅ Files stored and retrievable

**Environment Setup**:
```bash
conda activate rl
cd backend
pip install markdown python-multipart
```

---

## 📋 Detailed Requirements

### Endpoints

1. **POST `/api/curriculum/upload`** (Admin only)
   - Request: Multipart form with `file` (markdown file)
   - Response: `{id: int, filename: str, keywords: List[str], created_at: str}`
   - Validates: file is .md, file size limits
   - Saves file to `backend/uploads/curriculum/`
   - Parses markdown and extracts keywords

2. **GET `/api/curriculum`** (Admin only)
   - Response: `[{id, filename, keywords, created_at}, ...]`
   - Returns all curricula for current admin user

3. **GET `/api/curriculum/{id}`** (Admin only)
   - Response: `{id, filename, keywords, file_path, created_at}`
   - Returns specific curriculum

### Database Model

**Curriculum Model**:
- id (primary key)
- user_id (foreign key to User, admin who uploaded)
- filename (original filename)
- file_path (local storage path)
- keywords (JSON array of extracted keywords)
- created_at (timestamp)

### Markdown Parsing

**Simple Parsing Strategy**:
- Extract all headings (# ## ###) as topics
- Extract bold text (**text**) as keywords
- Extract list items as concepts
- Store as JSON array in database

**Example**:
```markdown
# Mathematics
## Algebra
- **Variables**: x, y, z
- **Equations**: linear, quadratic
```
Extracts: ["Mathematics", "Algebra", "Variables", "Equations", "linear", "quadratic"]

## 🔄 Git Workflow

```bash
# 1. Ensure Task 01 is merged, then create branch
git checkout main
git pull origin main
git checkout -b feature/backend-curriculum

# 2. Develop with TDD
# ... write tests, implement, commit

# 3. Merge when ready
git checkout main
git merge feature/backend-curriculum
```

## ✅ Success Criteria

- [ ] Admin can upload markdown files
- [ ] Markdown is parsed and keywords extracted
- [ ] Curriculum stored in database
- [ ] Admin can list curricula
- [ ] Student role cannot access endpoints
- [ ] All tests pass

