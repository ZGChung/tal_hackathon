# Development Plan & Git Branch Strategy

## Overview

This document defines the development order, priorities, and git branch strategy for parallel agent development. Each task is decoupled and can be developed independently in its own feature branch.

## Development Priorities

### Phase 1: Foundation (Critical Path - Sequential)
**Goal**: Establish core infrastructure that other components depend on

1. **Backend Database & Auth** (Task 01)
   - Database setup, user model, authentication
   - **Branch**: `feature/backend-auth`
   - **Blocks**: All other backend tasks, frontend auth

2. **Frontend Auth UI** (Task 06)
   - Login/register components, auth context
   - **Branch**: `feature/frontend-auth`
   - **Depends on**: Task 01
   - **Blocks**: Admin dashboard, protected routes

### Phase 2: Core Data Management (Can Parallelize)
**Goal**: Enable data input and management

3. **Backend Curriculum API** (Task 02)
   - **Branch**: `feature/backend-curriculum`
   - **Depends on**: Task 01
   - **Can work in parallel with**: Task 03, Task 05

4. **Backend Preferences API** (Task 03)
   - **Branch**: `feature/backend-preferences`
   - **Depends on**: Task 01
   - **Can work in parallel with**: Task 02, Task 05

5. **Backend Mock RedNote** (Task 05)
   - **Branch**: `feature/backend-mock-rednote`
   - **No dependencies** (completely independent)
   - **Can work in parallel with**: Task 02, Task 03

6. **Frontend Admin Dashboard** (Task 07)
   - **Branch**: `feature/frontend-admin-dashboard`
   - **Depends on**: Task 01, Task 02, Task 03, Task 06
   - **Can work in parallel with**: Task 08 (after Task 05 merged)

### Phase 3: Content & Rewriting (Can Parallelize)
**Goal**: Core demo functionality

7. **Frontend RedNote Feed UI** (Task 08)
   - **Branch**: `feature/frontend-rednote-feed`
   - **Depends on**: Task 05, Task 06
   - **Can work in parallel with**: Task 04 (after Task 05 merged)

8. **Backend Rewriting Engine** (Task 04)
   - **Branch**: `feature/backend-rewriting`
   - **Depends on**: Task 02, Task 03
   - **Can work in parallel with**: Task 08

9. **Frontend Content Display** (Task 09)
   - **Branch**: `feature/frontend-content-display`
   - **Depends on**: Task 04, Task 05, Task 08
   - **Final feature before integration**

### Phase 4: Integration & Polish
**Goal**: End-to-end testing and polish

10. **Integration & E2E Testing** (Task 10)
    - **Branch**: `feature/integration-e2e`
    - **Depends on**: All previous tasks
    - **Final step before demo**

## Git Branch Strategy

### Branch Naming Convention
- Feature branches: `feature/{task-name}`
- Examples: `feature/backend-auth`, `feature/frontend-admin-dashboard`

### Workflow for Each Agent

1. **Create Feature Branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/{task-name}
   ```

2. **Development with TDD**
   - Write tests first (red)
   - Implement feature (green)
   - Refactor if needed
   - Commit frequently with clear messages

3. **Before Merging**
   - All tests pass
   - Code follows architecture patterns
   - No merge conflicts with main
   - Update documentation if needed

4. **Merge Process**
   ```bash
   git checkout main
   git pull origin main
   git merge feature/{task-name}
   git push origin main
   ```

### Branch Protection Rules

- **main branch**: Protected, requires tests to pass
- **Feature branches**: Can be force-pushed during development
- **Merge strategy**: Fast-forward when possible, squash commits if messy

## Parallel Development Matrix

| Task | Can Start After | Can Work Parallel With | Blocks |
|------|----------------|------------------------|--------|
| 01 Backend Auth | - | - | 02, 03, 06 |
| 06 Frontend Auth | 01 | - | 07, 08, 09 |
| 02 Backend Curriculum | 01 | 03, 05 | 04, 07 |
| 03 Backend Preferences | 01 | 02, 05 | 04, 07 |
| 05 Backend Mock RedNote | - | 02, 03 | 08, 09 |
| 07 Frontend Admin Dashboard | 01, 02, 03, 06 | 08 (after 05) | - |
| 08 Frontend RedNote Feed | 05, 06 | 04 (after 05) | 09 |
| 04 Backend Rewriting | 02, 03 | 08 (after 05) | 09 |
| 09 Frontend Content Display | 04, 05, 08 | - | 10 |
| 10 Integration | All | - | - |

## Decoupling Strategy

### Backend Components
- **Database models**: Independent, can be created in parallel
- **Routers**: Depend on models and services, but can stub dependencies
- **Services**: Business logic, can be tested in isolation

### Frontend Components
- **Pages**: Can be developed with mock API responses
- **Components**: Reusable, can be developed independently
- **Services**: API clients, can stub backend during development

### API Contracts
- Define API contracts early in `doc/API_CONTRACTS.md`
- Frontend can develop against contract while backend implements
- Use mock data for frontend development

## TDD Workflow per Task

1. **Read task requirements**
2. **Write failing tests** (red)
3. **Implement minimal code to pass** (green)
4. **Refactor** (if needed)
5. **Commit with message**: `feat: {feature-name} - {description}`
6. **Repeat until task complete**
7. **Ensure all tests pass**
8. **Create merge request or merge to main**

## Success Criteria per Phase

### Phase 1 Complete
- ✅ Users can register and login
- ✅ JWT authentication works
- ✅ Role-based access control works
- ✅ Frontend auth UI functional

### Phase 2 Complete
- ✅ Admin can upload curriculum
- ✅ Admin can set preferences
- ✅ Mock RedNote feed returns posts
- ✅ Admin dashboard functional

### Phase 3 Complete
- ✅ Content rewriting engine works
- ✅ RedNote feed displays in UI
- ✅ Rewritten content displays
- ✅ Original vs rewritten comparison works

### Phase 4 Complete
- ✅ All features integrated
- ✅ End-to-end flows work
- ✅ No critical bugs
- ✅ Demo ready

## Risk Mitigation

### Merge Conflicts
- **Prevention**: Keep branches small, merge frequently
- **Resolution**: Coordinate with other agents, resolve conflicts early

### API Contract Changes
- **Prevention**: Define contracts early, document changes
- **Resolution**: Update both frontend and backend simultaneously

### Dependencies Not Ready
- **Prevention**: Use mocks/stubs during development
- **Resolution**: Implement minimal interface, enhance later

## Time Estimates (Hackathon)

- Phase 1: 2-3 hours
- Phase 2: 3-4 hours (can parallelize)
- Phase 3: 3-4 hours (can parallelize)
- Phase 4: 1-2 hours

**Total**: ~9-13 hours of development time

