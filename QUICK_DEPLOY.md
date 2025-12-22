# Quick Deploy Guide - Render

This guide will get your app deployed in ~10 minutes.

## Prerequisites

-   GitHub account
-   DeepSeek API key (get it from https://platform.deepseek.com)
-   Render account (free tier works)

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
git add .
git commit -m "Configure for deployment"
git push origin main  # or your branch name
```

### 2. Deploy on Render

1. Go to https://render.com and sign up/login with GitHub
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml` and show both services
5. Click **"Apply"** to deploy

### 3. Wait for Initial Deployment

Let both services deploy first (takes ~5-10 minutes). You'll see the URLs in the Render dashboard:

-   Backend URL: `https://tal-hackathon-backend.onrender.com` (or similar)
-   Frontend URL: `https://tal-hackathon-frontend.onrender.com` (or similar)

### 4. Configure Environment Variables

**IMPORTANT:** Set these in order:

#### Step 1: Backend Service

1. Go to your **tal-hackathon-backend** service
2. Click **"Environment"** tab
3. Set these variables:
    - `DEEPSEEK_API_KEY` = `YOUR-DEEPSEEK-API-KEY-HERE`
    - `ALLOWED_ORIGINS` = `https://YOUR-FRONTEND-URL.onrender.com` (replace with your actual frontend URL from Render dashboard)
4. Click **"Save Changes"**

#### Step 2: Frontend Service

1. Go to your **tal-hackathon-frontend** service
2. Click **"Environment"** tab
3. Set this variable:
    - `REACT_APP_API_URL` = `https://YOUR-BACKEND-URL.onrender.com` (replace with your actual backend URL from Render dashboard)
4. Click **"Save Changes"**

### 5. Redeploy Services

After setting environment variables:

-   **Backend**: Click "Manual Deploy" → "Deploy latest commit"
-   **Frontend**: Click "Manual Deploy" → "Deploy latest commit"

### 6. Access Your App

-   **Frontend**: `https://tal-hackathon-frontend.onrender.com`
-   **Backend API**: `https://tal-hackathon-backend.onrender.com`
-   **API Docs**: `https://tal-hackathon-backend.onrender.com/docs`

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

See `RENDER_ENV_SETUP.md` for copy-paste ready environment variable values.
