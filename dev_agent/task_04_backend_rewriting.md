# Task 04: Backend Content Rewriting Engine

## Objective
Implement the core content rewriting engine using LLM to rewrite text content with curriculum alignment.

## Requirements
- Rewrite endpoint (POST `/api/rewrite`) - accepts original text, returns rewritten text
- Integrate with LLM (OpenAI API, or local model, or open-source alternative)
- Extract curriculum keywords from database
- Rewrite logic: Increase frequency of curriculum-related terms
- Maintain original tone and structure
- Cache rewritten content (optional, for performance)

## Technical Details
- Use OpenAI API (recommended for demo) or alternative:
  - OpenAI: `openai` library
  - Alternative: Hugging Face transformers, or local model
- Create prompt engineering for rewriting:
  - Include curriculum keywords
  - Include admin preferences
  - Maintain original style
- Extract keywords from active curriculum
- Combine with admin preferences

## Files to Create/Modify
- `backend/services/llm_service.py` - LLM integration
- `backend/services/rewriter.py` - Core rewriting logic
- `backend/routers/rewrite.py` - Rewrite endpoint
- `backend/schemas/rewrite.py` - Request/response schemas
- `backend/main.py` - Include rewrite router
- `tests/backend/test_rewrite.py` - Tests (TDD)

## Success Criteria
- Endpoint accepts text and returns rewritten version
- Rewritten text includes curriculum keywords more frequently
- Original meaning and tone are preserved
- Integration with curriculum and preferences works
- All tests pass

## Environment
```bash
conda activate rl
cd backend
pip install openai  # or alternative LLM library
```

## Notes
- For demo, can use OpenAI API (requires API key)
- Alternative: Use free/open-source models if API costs are concern
- Keep prompt engineering simple but effective
- Can enhance with more sophisticated strategies later

