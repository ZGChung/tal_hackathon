# Fix: ModuleNotFoundError: No module named 'backend'

## Problem

When starting the backend, you get:
```
ModuleNotFoundError: No module named 'backend'
```

## Cause

The start command was `cd backend && uvicorn main:app`, which runs from inside the `backend` directory. However, the imports in `backend/main.py` use `from backend.routers import ...`, which requires Python to be run from the **project root**, not from inside the backend directory.

## Solution

Changed the start command from:
```bash
cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

To:
```bash
uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

This runs uvicorn from the project root and specifies the module path as `backend.main:app`.

## Files Updated

- `render.yaml` - Main deployment config
- `render-backend-only.yaml` - Backend-only config
- `QUICK_DEPLOY.md` - Documentation

## Next Steps

1. **If using render.yaml (Blueprint):**
   - The fix is already in the file
   - Just redeploy: "Manual Deploy" → "Deploy latest commit"

2. **If you created the service manually:**
   - Go to your backend service → Settings
   - Update "Start Command" to: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - Save and redeploy

## Why This Works

- Running from project root allows Python to find the `backend` module
- `backend.main:app` tells uvicorn to import `main` from the `backend` package
- This matches how the imports are structured in the code

