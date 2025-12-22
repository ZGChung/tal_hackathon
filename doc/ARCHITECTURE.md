# System Architecture

## Overview

This document defines the system architecture for the TAL Hackathon demo application. The system follows a decoupled, modular design to enable parallel development by multiple agents.

## Architecture Principles

1. **Separation of Concerns**: Clear boundaries between frontend, backend, and data layers
2. **API-First Design**: Backend exposes RESTful APIs; frontend consumes them
3. **Modular Components**: Each feature is self-contained and testable
4. **Scalability**: Architecture supports future enhancements without major refactoring
5. **Testability**: TDD approach with isolated unit tests and integration tests

## System Layers

### 1. Frontend Layer (React)

-   **Location**: `frontend/`
-   **Responsibilities**: UI/UX, user interactions, API calls
-   **State Management**: React Context API (simple, no Redux needed for demo)
-   **Routing**: React Router
-   **API Communication**: Axios or fetch API

### 2. Backend Layer (FastAPI)

-   **Location**: `backend/`
-   **Responsibilities**: Business logic, data processing, API endpoints
-   **Structure**:
    -   `models/` - Database models (SQLAlchemy)
    -   `schemas/` - Pydantic schemas for request/response validation
    -   `routers/` - API route handlers
    -   `services/` - Business logic services
    -   `database.py` - Database connection and session management
    -   `main.py` - FastAPI app initialization

### 3. Data Layer

-   **Database**: SQLite (local, simple, no setup needed)
-   **Location**: `backend/database.db` (gitignored)
-   **ORM**: SQLAlchemy
-   **File Storage**: Local filesystem (`backend/uploads/`)

## Component Architecture

### Backend Components

```
backend/
├── main.py                 # FastAPI app, CORS, router registration
├── database.py             # Database connection, session management
├── models/                 # SQLAlchemy models
│   ├── user.py            # User model (auth)
│   ├── curriculum.py      # Curriculum model
│   ├── preferences.py     # Admin preferences model
│   └── post.py            # Social media post model
├── schemas/                # Pydantic schemas
│   ├── auth.py            # Auth request/response schemas
│   ├── curriculum.py      # Curriculum schemas
│   ├── preferences.py     # Preferences schemas
│   ├── post.py            # Post schemas
│   └── rewrite.py         # Rewrite request/response schemas
├── routers/                # API route handlers
│   ├── auth.py            # Authentication endpoints
│   ├── curriculum.py      # Curriculum endpoints
│   ├── preferences.py     # Preferences endpoints
│   ├── rednote.py         # Mock RedNote endpoints
│   └── rewrite.py         # Content rewriting endpoints
├── services/               # Business logic
│   ├── auth_service.py    # Authentication logic
│   ├── curriculum_parser.py  # Markdown parsing
│   ├── platform_adapter.py   # Abstract platform interface
│   ├── mock_rednote.py    # Mock RedNote implementation
│   ├── llm_service.py     # LLM integration
│   └── rewriter.py        # Content rewriting logic
└── utils/                  # Utilities
    ├── security.py         # Password hashing, JWT
    └── dependencies.py     # FastAPI dependencies (auth, roles)
```

### Frontend Components

```
frontend/
├── src/
│   ├── App.js             # Main app, routing
│   ├── index.js           # Entry point
│   ├── contexts/          # React contexts
│   │   └── AuthContext.js # Authentication state
│   ├── components/        # Reusable components
│   │   ├── Auth/          # Auth components
│   │   ├── Admin/         # Admin components
│   │   ├── Post/          # Post display components
│   │   └── Common/        # Common UI components
│   ├── pages/             # Page components
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── AdminDashboard.js
│   │   ├── RedNoteFeed.js
│   │   └── ContentFeed.js
│   ├── services/          # API service functions
│   │   ├── api.js         # API client setup
│   │   ├── authService.js
│   │   ├── curriculumService.js
│   │   ├── preferencesService.js
│   │   ├── rednoteService.js
│   │   └── rewriteService.js
│   └── utils/             # Utilities
│       └── constants.js   # API endpoints, constants
```

## API Contracts

### Authentication Endpoints

-   `POST /api/auth/register` - User registration
-   `POST /api/auth/login` - User login
-   `GET /api/auth/me` - Get current user (protected)

### Curriculum Endpoints

-   `POST /api/curriculum/upload` - Upload markdown file (Admin only)
-   `GET /api/curriculum` - List all curricula (Admin only)
-   `GET /api/curriculum/{id}` - Get curriculum by ID (Admin only)

### Preferences Endpoints

-   `POST /api/preferences` - Create preferences (Admin only)
-   `GET /api/preferences` - Get preferences (Admin only)
-   `PUT /api/preferences/{id}` - Update preferences (Admin only)

### Mock RedNote Endpoints

-   `GET /api/rednote/feed` - Get feed of posts
-   `GET /api/rednote/posts/{id}` - Get single post

### Rewrite Endpoints

-   `POST /api/rewrite` - Rewrite content (requires curriculum and preferences)

## Data Models

### User

-   id, username, email, password_hash, role (Student/Admin), created_at

### Curriculum

-   id, user_id (admin), filename, file_path, keywords (JSON), created_at

### Preferences

-   id, user_id (admin), focus_areas (JSON), keywords (JSON), created_at

### Post (Mock RedNote)

-   id, author, text, image_url, likes, timestamp

## Development Workflow

1. **Feature Branch Strategy**: Each task gets its own branch
2. **TDD**: Write tests first, then implement
3. **Isolation**: Each component can be developed independently
4. **Integration**: Merge to main after tests pass and code review

## Dependencies

### Backend

-   FastAPI, Uvicorn
-   SQLAlchemy (ORM)
-   Pydantic (validation)
-   python-jose (JWT)
-   passlib (password hashing)
-   python-multipart (file uploads)
-   markdown (markdown parsing)
-   openai (or alternative LLM library)

### Frontend

-   React, React DOM
-   React Router
-   Axios (or fetch)
-   React Testing Library (testing)

## Security Considerations

-   JWT tokens for authentication
-   Password hashing with bcrypt
-   Role-based access control
-   Input validation with Pydantic
-   CORS configuration for frontend

## Scalability Points

-   Platform adapter pattern allows easy API swap
-   Service layer allows business logic changes
-   Database models can be extended
-   API endpoints can be versioned
-   Frontend components are modular
