# Quick Start Guide for Multi-Agent Development

## 🚀 How to Assign Tasks to Agents

Each task file in `dev_agent/` contains a **STANDALONE AGENT PROMPT** section. Simply:

1. Open the task file (e.g., `task_01_backend_auth.md`)
2. Copy the entire "🎯 STANDALONE AGENT PROMPT" section
3. Paste it to initialize a new agent
4. The agent will work on that specific task in its own feature branch

## 📋 Task Files

| Task | File | Branch Name | Dependencies |
|------|------|-------------|--------------|
| 01 | `task_01_backend_auth.md` | `feature/backend-auth` | None (foundation) |
| 02 | `task_02_backend_curriculum.md` | `feature/backend-curriculum` | Task 01 |
| 03 | `task_03_backend_preferences.md` | `feature/backend-preferences` | Task 01 |
| 04 | `task_04_backend_rewriting.md` | `feature/backend-rewriting` | Tasks 01, 02, 03 |
| 05 | `task_05_backend_mock_rednote.md` | `feature/backend-mock-rednote` | None (independent) |
| 06 | `task_06_frontend_auth.md` | `feature/frontend-auth` | Task 01 |
| 07 | `task_07_frontend_admin_dashboard.md` | `feature/frontend-admin-dashboard` | Tasks 01, 02, 03, 06 |
| 08 | `task_08_frontend_rednote_feed.md` | `feature/frontend-rednote-feed` | Tasks 05, 06 |
| 09 | `task_09_frontend_content_display.md` | `feature/frontend-content-display` | Tasks 04, 05, 08 |
| 10 | `task_10_integration.md` | `feature/integration-e2e` | All tasks |

## 🎯 Recommended Development Order

### Phase 1: Foundation (Sequential)
1. **Task 01** - Backend Auth (blocks everything)
2. **Task 06** - Frontend Auth (depends on 01)

### Phase 2: Core Features (Can Parallelize)
3. **Task 02** - Backend Curriculum (depends on 01)
4. **Task 03** - Backend Preferences (depends on 01, can parallel with 02)
5. **Task 05** - Backend Mock RedNote (independent, can parallel with 02, 03)

### Phase 3: Frontend & Rewriting (Can Parallelize)
6. **Task 07** - Frontend Admin Dashboard (depends on 01, 02, 03, 06)
7. **Task 08** - Frontend RedNote Feed (depends on 05, 06)
8. **Task 04** - Backend Rewriting (depends on 02, 03, can parallel with 08)

### Phase 4: Integration
9. **Task 09** - Frontend Content Display (depends on 04, 05, 08)
10. **Task 10** - Integration & E2E (depends on all)

## 🔄 Git Workflow for Each Agent

```bash
# 1. Agent creates feature branch
git checkout main
git pull origin main
git checkout -b feature/{task-name}

# 2. Agent develops with TDD
# - Write tests first (red)
# - Implement feature (green)
# - Refactor if needed
# - Commit frequently

# 3. Before merging
# - All tests pass
# - No merge conflicts
# - Code follows architecture

# 4. Merge to main
git checkout main
git merge feature/{task-name}
git push origin main
```

## 📚 Key Documents

- **Architecture**: `doc/ARCHITECTURE.md` - System design and structure
- **Development Plan**: `doc/DEVELOPMENT_PLAN.md` - Detailed plan with priorities
- **PRD**: `doc/prd.md` - Product requirements
- **Task Index**: `dev_agent/TASK_INDEX.md` - Overview of all tasks

## ✅ Success Checklist

Before assigning a task, ensure:
- [ ] Dependencies are merged (or agent can work with mocks)
- [ ] Agent has access to repository
- [ ] Agent understands TDD workflow
- [ ] Agent knows to create feature branch
- [ ] Agent knows merge criteria

## 🎓 Example: Assigning Task 01

1. Open `dev_agent/task_01_backend_auth.md`
2. Find the "🎯 STANDALONE AGENT PROMPT" section
3. Copy everything from "---" to "---"
4. Paste to new agent
5. Agent will:
   - Create branch `feature/backend-auth`
   - Follow TDD
   - Implement authentication
   - Merge when complete

That's it! The prompt is self-contained and includes all necessary information.

