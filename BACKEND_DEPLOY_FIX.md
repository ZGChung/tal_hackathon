# Fix: Backend Deployment Error - Python Version Issue

## Problem

Render is trying to use Python 3.13.4, but `pydantic-core==2.14.1` doesn't have pre-built wheels for Python 3.13 and requires Rust to compile, which fails.

## Error Message

```
error: failed to create directory `/usr/local/cargo/registry/cache/index.crates.io-1949cf8c6b5b557f`
Caused by: Read-only file system (os error 30)
```

## Solution

Created `runtime.txt` file to force Render to use Python 3.11.0, which has pre-built wheels for all dependencies.

### Files Created

1. **`runtime.txt`** (root directory) - Specifies Python 3.11.0
2. **`backend/runtime.txt`** (backend directory) - Backup location

### Next Steps

1. **Commit and push the fix:**
   ```bash
   git add runtime.txt backend/runtime.txt render.yaml
   git commit -m "Fix: Specify Python 3.11.0 for Render deployment"
   git push origin main
   ```

2. **Redeploy on Render:**
   - Go to your backend service in Render
   - Click "Manual Deploy" → "Deploy latest commit"
   - The build should now use Python 3.11.0

3. **Verify:**
   - Check build logs - should see "Installing Python version 3.11.0..."
   - Build should complete successfully

## Alternative: Update Dependencies

If you prefer to use Python 3.13, you could update pydantic to a newer version that has wheels for 3.13:

```bash
# Update requirements.txt
pydantic>=2.9.0  # Newer versions have Python 3.13 wheels
```

But using Python 3.11.0 is the safer, faster option.

