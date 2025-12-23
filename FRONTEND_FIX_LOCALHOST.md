# Fix: Frontend Trying to Connect to localhost:8000

## Problem

Your frontend is trying to connect to `localhost:8000` instead of your deployed backend URL.

## Why This Happens

React apps need environment variables **at BUILD time**, not runtime. If `REACT_APP_API_URL` wasn't set when the frontend was built, it uses the default `localhost:8000`.

## Solution

### Step 1: Get Your Backend URL

From your Render dashboard, copy your backend service URL. It should look like:
```
https://tal-hackathon-backend.onrender.com
```

### Step 2: Set Environment Variable in Render

1. Go to your **tal-hackathon-frontend** service in Render dashboard
2. Click **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Set:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://YOUR-BACKEND-URL.onrender.com` (paste your actual backend URL)
5. Click **"Save Changes"**

### Step 3: Rebuild/Redeploy Frontend

**IMPORTANT:** You must rebuild the frontend for the environment variable to take effect!

1. In your frontend service, click **"Manual Deploy"**
2. Select **"Deploy latest commit"** (or trigger a new build)
3. Wait for the build to complete (~3-5 minutes)

### Step 4: Verify

1. Visit your frontend URL
2. Open browser DevTools (F12) → Network tab
3. Try to register/login
4. Check the network requests - they should now go to your backend URL (not localhost:8000)

## Quick Checklist

- [ ] Backend URL copied from Render dashboard
- [ ] `REACT_APP_API_URL` set in frontend service environment variables
- [ ] Frontend service redeployed/rebuilt
- [ ] Network requests now go to backend URL (check DevTools)

## Troubleshooting

### Still seeing localhost:8000?

- Make sure you **redeployed** after setting the environment variable
- Check that the environment variable name is exactly `REACT_APP_API_URL` (case-sensitive)
- Verify the backend URL is correct (no trailing slash)
- Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Backend URL format

✅ Correct:
```
https://tal-hackathon-backend.onrender.com
```

❌ Wrong:
```
https://tal-hackathon-backend.onrender.com/  (trailing slash)
http://tal-hackathon-backend.onrender.com   (http instead of https)
tal-hackathon-backend.onrender.com          (missing https://)
```

