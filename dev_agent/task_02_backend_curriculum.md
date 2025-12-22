# Task 02: Backend Curriculum Upload & Parsing

## Objective
Create API endpoints to upload markdown curriculum files and parse them to extract keywords and concepts.

## Requirements
- File upload endpoint (POST `/api/curriculum/upload`) - Admin only
- Markdown file parsing to extract:
  - Topics/subjects
  - Keywords
  - Learning objectives
  - Key concepts
- Store parsed curriculum data in database
- List curriculum endpoint (GET `/api/curriculum`) - Admin only
- Get curriculum by ID (GET `/api/curriculum/{id}`)

## Technical Details
- Accept markdown (.md) files
- Parse markdown using a library (e.g., `markdown` or `markdown2`)
- Extract keywords using simple text processing or NLP (keep it simple)
- Store in database: original file path, parsed keywords, metadata
- Use dependency injection to ensure Admin role requirement

## Files to Create/Modify
- `backend/models/curriculum.py` - Curriculum model
- `backend/schemas/curriculum.py` - Pydantic schemas
- `backend/routers/curriculum.py` - Curriculum endpoints
- `backend/services/curriculum_parser.py` - Markdown parsing logic
- `backend/main.py` - Include curriculum router
- `tests/backend/test_curriculum.py` - Tests (TDD)

## Success Criteria
- Admin can upload markdown file
- System parses markdown and extracts keywords
- Curriculum data is stored in database
- Admin can list all uploaded curricula
- Student role cannot access upload endpoint
- All tests pass

## Environment
```bash
conda activate rl
cd backend
pip install markdown  # or markdown2
```

## Notes
- Keep parsing simple - extract headings, bold text, lists as keywords
- Can enhance later with NLP if time permits
- Store file locally in `backend/uploads/curriculum/`

