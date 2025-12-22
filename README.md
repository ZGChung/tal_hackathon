# TAL Hackathon Demo

A web application demo for the TAL Hackathon, built with React frontend and FastAPI backend.

## Project Structure

```
tal_hackathon/
├── frontend/          # React frontend application
├── backend/           # FastAPI backend application
├── tests/             # Test files (TDD)
│   ├── frontend/      # Frontend tests
│   ├── backend/       # Backend tests
│   └── integration/   # Integration tests
├── doc/               # Documentation and markdown files
│   └── prd.md         # Product Requirements Document
└── dev_agent/         # Agent task summaries and prompts
```

## Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- Conda (for virtual environment)

### Backend Setup
```bash
conda activate rl
cd backend
pip install -r requirements.txt
# Run from project root (not backend directory)
cd ..
uvicorn backend.main:app --reload
```

Backend will run on http://localhost:8000
API documentation available at http://localhost:8000/docs

### Frontend Setup
```bash
conda activate rl
cd frontend
npm install
npm start
```

Frontend will run on http://localhost:3000

## Development Approach

This project uses a **multi-agent development workflow** with Test Driven Development (TDD).

### Agents
- **Frontend Agent**: React development
- **Backend Agent**: FastAPI development
- **Testing Agent**: Test implementation and TDD enforcement
- **Integration Agent**: Frontend-backend integration

See `dev_agent/` folder for detailed task summaries and initialization prompts.

## Testing

Run tests using:
- Frontend: `cd frontend && npm test`
- Backend: `cd backend && pytest`
- Integration: `pytest tests/integration/`

## Documentation

- Product Requirements: `doc/prd.md`
- Agent Tasks: `dev_agent/`

