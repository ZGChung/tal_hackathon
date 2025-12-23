# Fix: Render Python Version Issue

## Problem

Render is using Python 3.13.4 by default, but `pydantic==2.5.0` doesn't have pre-built wheels for Python 3.13, causing Rust compilation to fail.

## Solutions Applied

### Solution 1: Updated Pydantic (Recommended)

Updated `pydantic` from `2.5.0` to `>=2.9.0` which has pre-built wheels for Python 3.13.

**File changed:** `backend/requirements.txt`
```diff
- pydantic==2.5.0
+ pydantic>=2.9.0
```

### Solution 2: runtime.txt (Backup)

Created `runtime.txt` to specify Python 3.11.0, but Render may not always detect it when creating services manually.

## Next Steps

1. **Push the updated requirements.txt:**
   ```bash
   git push origin main
   ```

2. **Redeploy on Render:**
   - Go to your backend service
   - Click "Manual Deploy" → "Deploy latest commit"
   - Should now work with Python 3.13

## Alternative: Manually Set Python Version in Render

If the above doesn't work, you can manually set Python version in Render dashboard:

1. Go to your backend service → Settings
2. Scroll to "Build & Deploy"
3. Set "Python Version" to `3.11.0`
4. Save and redeploy

## Why This Works

- **Pydantic 2.9+** has pre-built wheels for Python 3.13, so no Rust compilation needed
- This is faster and more reliable than compiling from source
- Compatible with all your existing code (pydantic 2.9 is backward compatible with 2.5)

