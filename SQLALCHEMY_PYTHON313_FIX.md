# Fix: SQLAlchemy Python 3.13 Compatibility Issue

## Problem

Deployment fails with:
```
AssertionError: Class <class 'sqlalchemy.sql.elements.SQLCoreOperations'> directly inherits TypingOnly but has additional attributes
```

## Cause

SQLAlchemy 2.0.23 is **incompatible with Python 3.13**. This version was released before Python 3.13 and has typing compatibility issues.

## Solution

Updated SQLAlchemy from `2.0.23` to `>=2.0.25`, which has Python 3.13 support.

**File changed:** `backend/requirements.txt`
```diff
- sqlalchemy==2.0.23
+ sqlalchemy>=2.0.25
```

## Why This Works

- SQLAlchemy 2.0.25+ includes fixes for Python 3.13 typing compatibility
- All SQLAlchemy 2.0.x versions are API-compatible, so no code changes needed
- This is a safe upgrade that maintains backward compatibility

## Next Steps

1. **Push the fix:**
   ```bash
   git push origin main
   ```

2. **Redeploy on Render:**
   - Go to your backend service
   - Click "Manual Deploy" → "Deploy latest commit"
   - Should now work with Python 3.13

## Verification

After deployment, check logs for:
- ✅ No AssertionError about SQLCoreOperations
- ✅ Application startup complete
- ✅ Health check at `/health` returns `{"status": "healthy"}`

## Alternative: Use Python 3.11

If you prefer to stick with SQLAlchemy 2.0.23, you can manually set Python version to 3.11 in Render dashboard:
1. Go to Settings → Build & Deploy
2. Set "Python Version" to `3.11.0`
3. Redeploy

But upgrading SQLAlchemy is the recommended solution.

