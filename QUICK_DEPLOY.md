# Quick Deploy Guide - Render

This guide will get your app deployed in ~10 minutes using a sequential deployment strategy.

## Prerequisites

-   GitHub account
-   DeepSeek API key (get it from https://platform.deepseek.com)
-   Render account (free tier works)

## Step-by-Step Deployment (Sequential)

### 1. Push to GitHub

```bash
git add .
git commit -m "Configure for deployment"
git push origin main  # or your branch name
```

### 2. Deploy Frontend First

**Step 2a: Create Frontend Service**

1. Go to https://render.com and sign up/login with GitHub
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. Configure:
    - **Name**: `tal-hackathon-frontend`
    - **Root Directory**: Leave empty (or `frontend` if needed)
    - **Build Command**: `cd frontend && npm install && npm run build`
    - **Publish Directory**: `frontend/build`
5. Click **"Create Static Site"**
6. Wait for deployment (~3-5 minutes)

**Step 2b: Get Frontend URL**

1. Once deployed, copy your frontend URL from the Render dashboard
2. It will look like: `https://tal-hackathon-frontend.onrender.com` (or similar)
3. **Save this URL** - you'll need it for the backend!

### 3. Deploy Backend

**Step 3a: Create Backend Service**

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository (same repo)
3. Configure:
    - **Name**: `tal-hackathon-backend`
    - **Root Directory**: Leave empty
    - **Environment**: `Python 3`
    - **Build Command**: `pip install -r backend/requirements.txt`
    - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
4. **Before clicking "Create Web Service"**, scroll to **"Environment Variables"** section and add:
    - `DEEPSEEK_API_KEY` = Get your key by running `./copy_api_key.sh` or check `.env.local`
    - `ALLOWED_ORIGINS` = `https://YOUR-FRONTEND-URL.onrender.com` (paste your frontend URL from Step 2b)
    - `LLM_API_BASE_URL` = `https://api.deepseek.com`
    - `LLM_MODEL` = `deepseek-chat`
5. Click **"Create Web Service"**
6. Wait for deployment (~5-10 minutes)

**Step 3b: Get Backend URL**

1. Once deployed, copy your backend URL from the Render dashboard
2. It will look like: `https://tal-hackathon-backend.onrender.com` (or similar)
3. **Save this URL** - you'll need it for the frontend!

### 4. Update Frontend with Backend URL

**⚠️ IMPORTANT:** React needs environment variables at BUILD time. You MUST rebuild after setting the variable!

1. Go to your **tal-hackathon-frontend** service in Render
2. Click **"Environment"** tab
3. Add:
    - `REACT_APP_API_URL` = `https://YOUR-BACKEND-URL.onrender.com` (paste your backend URL from Step 3b)
    - **Make sure there's NO trailing slash** (e.g., `https://backend.onrender.com` not `https://backend.onrender.com/`)
4. Click **"Save Changes"**
5. **CRITICAL:** Click **"Manual Deploy"** → **"Deploy latest commit"** to rebuild with the new environment variable
    - This rebuild is required! The frontend won't work until you rebuild.

**Note:** If you see errors about `localhost:8000`, it means the frontend was built before setting `REACT_APP_API_URL`. Just rebuild after setting the variable.

### 5. Access Your App

-   **Frontend**: Your frontend URL from Step 2b
-   **Backend API**: Your backend URL from Step 3b
-   **API Docs**: `https://YOUR-BACKEND-URL.onrender.com/docs`

## Alternative: Deploy Both at Once

If you prefer to deploy both services at once (simpler but requires manual URL setup):

1. Go to https://render.com
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml` and show both services
5. Click **"Apply"** to deploy both
6. After deployment, get both URLs and set environment variables:
    - Backend: `DEEPSEEK_API_KEY` and `ALLOWED_ORIGINS` (with frontend URL)
    - Frontend: `REACT_APP_API_URL` (with backend URL)
7. Redeploy both services

## Troubleshooting

### CORS Errors

-   Make sure `ALLOWED_ORIGINS` in backend includes your exact frontend URL (no trailing slash)
-   Format: `https://your-frontend-url.onrender.com`

### API Connection Issues

-   Verify `REACT_APP_API_URL` in frontend matches your backend URL exactly
-   Check backend logs for errors
-   Test backend health: `https://your-backend.onrender.com/health`

### DeepSeek API Issues

-   Verify your API key is correct
-   Check backend logs for API errors
-   The service will fall back to mock rewriting if API fails

### Slow First Request

-   Free tier services spin down after 15 min of inactivity
-   First request after spin-down takes ~30 seconds
-   This is normal for free tier

## Quick Test

1. Visit your frontend URL
2. Login with:
    - Username: `admin`
    - Password: `admin123` (or check your seed data)
3. Navigate to RedNote Feed
4. Try rewriting a post to test DeepSeek integration

## Next Steps

-   For production: Consider upgrading to paid plan for always-on service
-   For persistent data: Consider PostgreSQL instead of SQLite
-   For custom domain: Add your domain in Render settings

## Quick Reference

-   **Get your API key**: Run `./copy_api_key.sh` or check `.env.local`
-   **See `RENDER_ENV_SETUP.md`** for copy-paste ready environment variable values
-   **See `DEPLOYMENT_WORKFLOW.md`** for detailed secure deployment workflow
