# Move Frontend to Singapore Region

## Problem
Render Static Sites don't have region selection - they use a global CDN. To deploy in a specific region (Singapore), you need to deploy as a **Web Service** instead.

## Solution
Deploy the frontend as a Web Service (not Static Site) with Singapore region selection.

## Changes Made

1. **Added `frontend/server.js`** - Express server to serve the React build
2. **Updated `frontend/package.json`** - Added express dependency and serve script

## Steps to Deploy Frontend as Web Service in Singapore

### Step 1: Commit and Push Changes

```bash
cd /Users/jayson_zhong/Jayson_Work_local/GitHub/tal_hackathon
git add frontend/server.js frontend/package.json
git commit -m "Add Express server for frontend web service deployment"
git push origin main
```

### Step 2: Create New Web Service on Render

1. Go to Render Dashboard → Click **"New +"** → Select **"Web Service"**

2. **Connect Repository:**
   - Select your GitHub repository
   - Click "Connect"

3. **Configure Service:**
   - **Name:** `tal-hackathon-frontend-singapore` (or whatever you prefer)
   - **Region:** Select **Singapore**
   - **Root Directory:** `frontend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run serve`

4. **Environment Variables:**
   - Click "Add Environment Variable"
   - Key: `REACT_APP_API_URL`
   - Value: `https://tal-hackathon-backend.onrender.com` (your backend URL)

5. **Instance Type:**
   - Select "Free" (or paid if you prefer)

6. Click **"Create Web Service"**

### Step 3: Wait for Deployment

- The build will take 5-10 minutes
- Watch the logs to see progress
- When you see "Frontend server running on port...", it's ready

### Step 4: Test the New Frontend

1. Copy the new frontend URL (e.g., `https://tal-hackathon-frontend-singapore.onrender.com`)
2. Open it in your browser
3. Try logging in with `admin_test` / `admin123`
4. It should be much faster now!

### Step 5: Update Backend ALLOWED_ORIGINS

1. Go to Backend Service → Environment
2. Update `ALLOWED_ORIGINS` to include the new frontend URL:
   - If you only have one: `https://tal-hackathon-frontend-singapore.onrender.com`
   - If you want both (old and new): `https://old-frontend.onrender.com,https://new-frontend.onrender.com`
3. Save (backend will auto-redeploy)

### Step 6: Delete Old Static Site (After Testing)

Once you confirm the new Web Service works:
1. Go to the old Static Site service
2. Settings → Delete Service

## Why This Works

- **Static Sites:** Deployed on global CDN, no region control
- **Web Services:** Deployed in specific regions (Singapore, US West, Frankfurt, etc.)
- By using Express to serve the built React files, we can deploy as a Web Service

## Expected Performance

After moving both to Singapore:
- **Latency:** 1-10ms (instead of 200-500ms)
- **API calls:** 10-50x faster
- **User experience:** Much more responsive for Asian users

## Notes

- The Express server is very lightweight - just serves static files
- The React app is still a client-side SPA, works the same way
- This doesn't change how the frontend works, just how it's deployed

