# Quick Deployment Guide

## Option 1: Render (Recommended - Fastest)

Render is the quickest solution for deploying your full-stack app. It has a free tier and can deploy both frontend and backend automatically.

### Steps:

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

2. **Sign up for Render**:
   - Go to https://render.com
   - Sign up with your GitHub account

3. **Deploy via Blueprint**:
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml` and deploy both services

4. **Set Environment Variables**:
   - Go to your backend service settings
   - Add `OPENAI_API_KEY` (your OpenAI API key)
   - The `SECRET_KEY` is auto-generated, but you can set a custom one if needed
   - Update `ALLOWED_ORIGINS` to include your frontend URL (comma-separated):
     ```
     http://localhost:3000,https://your-frontend-url.onrender.com
     ```

5. **Update Frontend API URL**:
   - After backend deploys, copy its URL
   - Go to frontend service settings
   - Update `REACT_APP_API_URL` to your backend URL (e.g., `https://tal-hackathon-backend.onrender.com`)

6. **Access your app**:
   - Frontend: `https://tal-hackathon-frontend.onrender.com`
   - Backend API: `https://tal-hackathon-backend.onrender.com`
   - API Docs: `https://tal-hackathon-backend.onrender.com/docs`

### Notes:
- First deployment may take 5-10 minutes
- Free tier services spin down after 15 minutes of inactivity (first request will be slow)
- Database is SQLite (file-based) - data persists but is reset on redeploy
- For production, consider upgrading to a paid plan or using PostgreSQL

---

## Option 2: Railway (Alternative)

Railway is another great option with similar ease of use.

### Steps:

1. **Sign up**: https://railway.app
2. **Create new project** from GitHub repo
3. **Add services**:
   - Backend: Add Python service, set start command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Frontend: Add static site, set build command: `cd frontend && npm install && npm run build`, publish directory: `frontend/build`
4. **Set environment variables** (same as Render)

---

## Option 3: Vercel (Frontend) + Railway/Render (Backend)

Split deployment - Vercel for frontend (excellent React support), Railway/Render for backend.

### Frontend on Vercel:
1. Go to https://vercel.com
2. Import your GitHub repo
3. Set root directory to `frontend`
4. Add environment variable: `REACT_APP_API_URL` = your backend URL
5. Deploy

### Backend on Railway/Render:
Follow Option 1 or 2 above for backend only.

---

## Environment Variables Reference

### Backend:
- `SECRET_KEY`: JWT secret (auto-generated on Render, or set manually)
- `OPENAI_API_KEY`: Your OpenAI API key (required for rewriting features)
- `DATABASE_URL`: Database connection (defaults to SQLite)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed frontend URLs

### Frontend:
- `REACT_APP_API_URL`: Backend API URL (e.g., `https://your-backend.onrender.com`)

---

## Troubleshooting

### CORS Errors:
- Make sure `ALLOWED_ORIGINS` in backend includes your frontend URL
- Check that URLs don't have trailing slashes

### Database Issues:
- SQLite works but resets on redeploy
- For persistent data, consider PostgreSQL (Render offers free PostgreSQL)

### Slow First Request:
- Free tier services spin down after inactivity
- First request after spin-down takes ~30 seconds
- Consider paid plan for always-on service

### Build Failures:
- Check build logs in Render dashboard
- Ensure all dependencies are in `requirements.txt` and `package.json`
- Python version may need to be specified (3.11.0 recommended)

