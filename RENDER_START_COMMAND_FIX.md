# Fix: ModuleNotFoundError - Update Start Command in Render Dashboard

## Problem

Even after updating the start command in code, you're still getting:
```
ModuleNotFoundError: No module named 'backend'
```

## Cause

If you created the service **manually** in Render (not via Blueprint), the start command in the Render dashboard needs to be updated manually. The `render.yaml` file only applies when using Blueprint deployment.

## Solution

### Update Start Command in Render Dashboard

1. Go to your **backend service** in Render dashboard
2. Click **"Settings"** tab
3. Scroll to **"Build & Deploy"** section
4. Find **"Start Command"**
5. Replace it with:
   ```bash
   cd /opt/render/project/src && PYTHONPATH=/opt/render/project/src:$PYTHONPATH uvicorn backend.main:app --host 0.0.0.0 --port $PORT
   ```
6. Click **"Save Changes"**
7. Click **"Manual Deploy"** → **"Deploy latest commit"**

### Alternative: Simpler Command (if above doesn't work)

If the above doesn't work, try this simpler version:
```bash
PYTHONPATH=/opt/render/project/src uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

## Why This Works

- `cd /opt/render/project/src` - Ensures we're in the project root
- `PYTHONPATH=/opt/render/project/src` - Adds project root to Python path so it can find the `backend` module
- `uvicorn backend.main:app` - Runs uvicorn with the correct module path

## Verification

After updating and redeploying, check the logs:
- Should see: "Application startup complete"
- Should NOT see: "ModuleNotFoundError: No module named 'backend'"
- Health check at `/health` should return `{"status": "healthy"}`

