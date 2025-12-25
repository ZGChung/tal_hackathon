# TAL Hackathon Demo - Content Rewriter for Educational Alignment

A web application that automatically rewrites social media content to align with students' curriculum, interests, and parental requirements. Built with React frontend and FastAPI backend.

## 🎯 Core Value Proposition

- Transform social media content into curriculum-aligned educational material
- Respect parental preferences and requirements
- Maintain student engagement through familiar content formats
- Provide a unified interface for accessing rewritten content

## ✨ Features

### Implemented Features

- **Authentication System**: JWT-based authentication with Student and Admin roles
- **Curriculum Management**: Upload and parse markdown curriculum files, extract keywords
- **Admin Preferences**: Set educational preferences and requirements (JSON format)
- **Content Rewriting Engine**: AI-powered text rewriting using DeepSeek API (with mock fallback)
- **RedNote (小红书) Integration**: Mock RedNote feed with educational examples
- **Bilibili Examples**: Video examples demonstrating curriculum-aligned content
- **Content Comparison**: Side-by-side view of original vs rewritten content
- **Default Content**: Pre-loaded Chinese learning curricula (成语, 古诗, 英语词汇) and preferences

### Current Demo Content

**Default Curricula** (in Chinese):
- 英语词汇学习 (English Vocabulary Learning)
- 中国成语学习 (Chinese Idioms Learning)
- 中国古诗学习 (Chinese Poetry Learning)

**Default Preferences**:
- 儿童语言学习偏好 (Children's Language Learning Preferences) - For kids under 12

**Example Content**:
- RedNote posts with Chinese idioms, poetry, and English vocabulary examples
- Bilibili video examples with educational descriptions

## 🏗️ Project Structure

```
tal_hackathon/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── contexts/     # React contexts
│   └── public/           # Static assets (including videos)
├── backend/              # FastAPI backend application
│   ├── routers/          # API routes
│   ├── services/         # Business logic
│   ├── models/           # Database models
│   ├── schemas/          # Pydantic schemas
│   └── uploads/          # Uploaded curriculum files
├── tests/                # Test files (TDD)
│   ├── frontend/          # Frontend tests
│   ├── backend/          # Backend tests
│   └── integration/     # Integration tests
├── doc/                  # Documentation
│   ├── prd.md            # Product Requirements Document
│   ├── ARCHITECTURE.md   # System architecture
│   └── ONE_PAGER.md      # One-page overview
├── dev_agent/            # Agent task summaries and prompts
│   └── task_XX_*.md      # Individual task instructions
├── manual_test/          # Manual testing files
│   ├── curriculum/       # Example curriculum files
│   └── preferences/     # Example preference files
└── video_example/         # Video examples for Bilibili
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+ (Python 3.11 recommended)
- Node.js 14+
- Conda (for virtual environment)

### Backend Setup

```bash
# Activate conda environment
conda activate rl

# Install dependencies
cd backend
pip install -r requirements.txt

# Run from project root (not backend directory)
cd ..
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will run on http://localhost:8000  
API documentation available at http://localhost:8000/docs

**Optional: DeepSeek API Configuration**
- Set `DEEPSEEK_API_KEY` environment variable for AI-powered rewriting
- Without API key, the system uses a sophisticated mock rewrite function
- See `copy_api_key.sh` for helper script

### Frontend Setup

```bash
# Activate conda environment
conda activate rl

# Install dependencies
cd frontend
npm install

# Start development server
npm start
```

Frontend will run on http://localhost:3000

**Note**: The frontend is configured to not auto-open in the system browser. Use Cursor's built-in browser or manually navigate to http://localhost:3000

### Default Test Accounts

- **Admin**: `admin_test` / `admin123`
- **Student**: `user_test` / `user123`

Quick login buttons are available on the login page for faster testing.

## 🧪 Testing

### Run Tests

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
pytest

# Integration tests
pytest tests/integration/
```

### Test Coverage

- Backend: Authentication, Curriculum, Preferences, Rewriting, RedNote adapter
- Frontend: Components, Pages, Services
- Integration: End-to-end flows

## 📚 Documentation

- **Product Requirements**: `doc/prd.md`
- **Architecture**: `doc/ARCHITECTURE.md`
- **One-Pager**: `doc/ONE_PAGER.md`
- **Development Plan**: `doc/DEVELOPMENT_PLAN.md`
- **Task Index**: `dev_agent/TASK_INDEX.md`

## 🔧 Development Approach

This project uses a **multi-agent development workflow** with Test Driven Development (TDD).

### Development Phases

1. **Foundation**: Authentication (Backend + Frontend)
2. **Core Features**: Curriculum Upload, Admin Preferences, Admin Dashboard
3. **Content & Rewriting**: Mock RedNote, Content Rewriting Engine, Content Display
4. **Integration**: End-to-end testing and integration
5. **Additional Features**: YouTube Examples, Quick Login, Content Updates

### Task Management

Each development task has a standalone prompt file in `dev_agent/`:
- `task_01_backend_auth.md` - Backend authentication
- `task_02_backend_curriculum.md` - Curriculum upload
- `task_03_backend_preferences.md` - Admin preferences
- ... and 13 more tasks

See `dev_agent/TASK_INDEX.md` for complete task list and dependencies.

### TDD Workflow

1. Write failing tests
2. Implement feature
3. Make tests pass
4. Refactor
5. Commit

## 🎨 Current Demo Capabilities

### For Students

- View rewritten RedNote (小红书) feed
- Compare original vs rewritten content
- See how curriculum keywords are incorporated
- View Bilibili video examples with educational context

### For Admins (Teachers/Parents)

- Upload curriculum files (Markdown format)
- Set educational preferences (JSON format)
- View uploaded curricula and preferences
- Fast-upload buttons for example curricula and preferences

### Content Rewriting

- Automatically incorporates curriculum keywords into social media posts
- Respects admin preferences
- Maintains original tone and style
- Uses DeepSeek API (with mock fallback)
- Supports Chinese and English content

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Curriculum
- `POST /api/curriculum/upload` - Upload curriculum file
- `GET /api/curriculum` - List all curricula
- `GET /api/curriculum/{id}` - Get curriculum by ID

### Preferences
- `POST /api/preferences` - Create/update preferences
- `GET /api/preferences` - Get current preferences

### Content
- `GET /api/rednote/feed` - Get RedNote feed
- `POST /api/rewrite` - Rewrite text with curriculum alignment

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI
- **Database**: SQLite (with SQLAlchemy ORM)
- **Authentication**: JWT (python-jose)
- **LLM**: DeepSeek API (OpenAI-compatible) with mock fallback
- **Validation**: Pydantic

### Frontend
- **Framework**: React
- **Routing**: React Router
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: CSS modules

## 📝 Notes

- **LLM Service**: Uses DeepSeek API if `DEEPSEEK_API_KEY` is set, otherwise uses sophisticated mock rewrite function
- **Database**: SQLite database file created automatically on first run
- **File Uploads**: Curriculum files stored in `backend/uploads/curriculum/`
- **Videos**: Bilibili example videos stored in `frontend/public/videos/bilibili/`
- **Development**: Follows TDD principles with comprehensive test coverage

## 🚢 Deployment

See deployment configuration files:
- `render.yaml` - Full stack deployment
- `render-backend-only.yaml` - Backend only
- `render-frontend-only.yaml` - Frontend only
- `setup_render_env.sh` - Environment setup helper

## 📖 License

This is a hackathon demo project.

## 🤝 Contributing

This project uses a multi-agent development workflow. See `dev_agent/` folder for task assignments and development guidelines.
