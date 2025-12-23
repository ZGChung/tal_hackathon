# CORS Preflight Failure Fix

## Error Confirmed
```
Preflight response is not successful. Status code: 400
XMLHttpRequest cannot load https://tal-hackathon-backend.onrender.com/api/auth/login due to access control checks.
```

## Root Cause
The backend's CORS configuration is not allowing requests from your frontend domain. The browser's preflight OPTIONS request is being rejected with a 400 error.

## Solution: Add ALLOWED_ORIGINS Environment Variable

### Step 1: Get Your Frontend URL
Your frontend is deployed at something like:
- `https://your-frontend-name.onrender.com`
- Or a custom domain if you set one up

### Step 2: Add ALLOWED_ORIGINS to Backend

1. Go to Render Dashboard → **Backend Service** → **Environment** tab
2. Click **"Add Environment Variable"**
3. Set:
   - **Key:** `ALLOWED_ORIGINS`
   - **Value:** Your frontend URL (e.g., `https://tal-hackathon-frontend.onrender.com`)
     - **Important:** NO trailing slash! Use `https://example.com` not `https://example.com/`
     - If you have multiple origins, separate with commas: `https://frontend1.com,https://frontend2.com`
4. Click **"Save Changes"**

### Step 3: Wait for Auto-Redeploy
- The backend should automatically redeploy when you save the environment variable
- Wait for it to finish (2-3 minutes)
- Check the backend logs to confirm it's running

### Step 4: Test Again
1. Go to your frontend
2. Try logging in with `admin_test` / `admin123`
3. It should now work!

## How to Find Your Frontend URL

If you're not sure what your frontend URL is:
1. Go to Render Dashboard → **Frontend Service**
2. Look at the top - you'll see the URL under the service name
3. It looks like: `https://something.onrender.com`
4. Copy that URL (without any trailing `/` or paths)

## Alternative: Allow All Origins (Quick Test Only)

**For testing only** (not recommended for production):
1. Set `ALLOWED_ORIGINS` to: `*`
2. This allows all origins
3. After confirming it works, change it to your actual frontend URL

## Why This Is Needed

Your backend has this CORS configuration:
```python
allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
if allowed_origins_env:
    allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",")]
    allow_all_origins = False
else:
    # Default: allow all origins if not set
    allowed_origins = ["*"]
    allow_all_origins = True
```

When `allow_all_origins = True`, the backend sets `allow_credentials = False`. But your frontend is likely sending credentials (cookies, auth headers), which causes CORS to fail.

By setting `ALLOWED_ORIGINS`, you enable proper CORS with credentials support.

## Expected Result

After setting `ALLOWED_ORIGINS` and redeploying:
- The preflight OPTIONS request will return 200
- The actual POST request will succeed
- Login will work!

You should see in the console:
```
Login response received: {access_token: "...", token_type: "bearer", user: {...}}
```

