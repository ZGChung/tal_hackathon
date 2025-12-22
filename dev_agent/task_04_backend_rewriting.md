# Task 04: Backend Content Rewriting Engine

## 🎯 STANDALONE AGENT PROMPT
Copy this entire section to initialize a new agent:

---

**You are a backend developer working on Task 04: Backend Content Rewriting Engine for a hackathon demo.**

**Context**: This is a FastAPI backend. You need to implement the core content rewriting engine using LLM to rewrite text with curriculum alignment.

**Your Mission**:
1. Create feature branch: `feature/backend-rewriting`
2. Follow TDD: Write tests first, then implement
3. Integrate LLM service (OpenAI or alternative)
4. Implement rewriting logic that increases curriculum keyword frequency
5. Ensure all tests pass before merging

**Key Requirements**:
- POST `/api/rewrite` - Accepts text, returns rewritten text
- Integrate with LLM (OpenAI API recommended)
- Extract curriculum keywords from database
- Use admin preferences in rewriting
- Maintain original tone and structure

**Files to Create**:
- `backend/services/llm_service.py` - LLM integration
- `backend/services/rewriter.py` - Core rewriting logic
- `backend/routers/rewrite.py` - Rewrite endpoint
- `backend/schemas/rewrite.py` - Request/response schemas
- `tests/backend/test_rewrite.py` - Tests

**Dependencies**: 
- Requires Task 01 (Auth), Task 02 (Curriculum), Task 03 (Preferences)
- Can work in parallel with Task 08 (Frontend RedNote Feed)

**TDD Workflow**:
1. Write failing tests for LLM service
2. Implement LLM service (can mock for tests)
3. Write failing tests for rewriting logic
4. Implement rewriting service
5. Write failing tests for rewrite endpoint
6. Implement rewrite endpoint
7. All tests pass → ready to merge

**Merge Criteria**:
- ✅ All tests pass
- ✅ Rewriting increases curriculum keyword frequency
- ✅ Original tone preserved
- ✅ Integration with curriculum and preferences works

**Environment Setup**:
```bash
conda activate rl
cd backend
pip install openai  # or alternative: transformers, etc.
```

**Note**: For tests, mock the LLM service to avoid API calls.

---

## 📋 Detailed Requirements

### Endpoint

**POST `/api/rewrite`**
- Request: `{text: str, curriculum_id: int?}` (optional curriculum_id, uses active if not provided)
- Response: `{original_text: str, rewritten_text: str, keywords_used: List[str]}`
- Logic:
  1. Get active curriculum (or specified curriculum_id)
  2. Get admin preferences
  3. Extract keywords from curriculum
  4. Combine with preference keywords
  5. Call LLM with prompt to rewrite text
  6. Return rewritten text

### LLM Service

**Prompt Engineering**:
```
Rewrite the following text to naturally incorporate these educational keywords more frequently: {keywords}
Maintain the original tone, style, and meaning.
Original text: {original_text}
```

**LLM Options**:
- OpenAI API (recommended for demo)
- Hugging Face transformers (free alternative)
- Local model (if available)

### Rewriter Service

**Core Logic**:
1. Extract keywords from curriculum
2. Merge with admin preference keywords
3. Create LLM prompt
4. Call LLM service
5. Return rewritten text

## 🔄 Git Workflow

```bash
git checkout main
git pull origin main
git checkout -b feature/backend-rewriting
# ... develop with TDD ...
git checkout main
git merge feature/backend-rewriting
```

## ✅ Success Criteria

- [ ] Rewrite endpoint accepts text and returns rewritten version
- [ ] Rewritten text includes curriculum keywords more frequently
- [ ] Original meaning and tone preserved
- [ ] Integration with curriculum and preferences works
- [ ] All tests pass (with mocked LLM)
