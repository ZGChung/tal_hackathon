# Deployment Checklist

## ✅ Pre-Deployment (Completed)

- [x] Updated LLM service to support DeepSeek API
- [x] Configured CORS to accept environment variable for allowed origins
- [x] Created `render.yaml` with backend and frontend services
- [x] Set up DeepSeek API configuration (base URL and model)
- [x] Created deployment documentation

## 📋 Deployment Steps

### 1. Get Your DeepSeek API Key
- [ ] Go to https://platform.deepseek.com
- [ ] Sign up/login and get your API key
- [ ] Copy the key (starts with `sk-`)

### 2. Push to GitHub
- [ ] `git push origin main` (or your branch)

### 3. Deploy on Render
- [ ] Go to https://render.com
- [ ] Sign up/login with GitHub
- [ ] Click "New +" → "Blueprint"
- [ ] Connect your repository
- [ ] Click "Apply" to deploy both services

### 4. Wait for Initial Deployment (~5-10 min)
- [ ] Note your backend URL: `https://tal-hackathon-backend.onrender.com`
- [ ] Note your frontend URL: `https://tal-hackathon-frontend.onrender.com`

### 5. Configure Backend Environment Variables
- [ ] Go to backend service → "Environment" tab
- [ ] Set `DEEPSEEK_API_KEY` = `your-api-key-here`
- [ ] Set `ALLOWED_ORIGINS` = `https://tal-hackathon-frontend.onrender.com` (your actual frontend URL)
- [ ] Click "Save Changes"

### 6. Configure Frontend Environment Variables
- [ ] Go to frontend service → "Environment" tab
- [ ] Set `REACT_APP_API_URL` = `https://tal-hackathon-backend.onrender.com` (your actual backend URL)
- [ ] Click "Save Changes"

### 7. Redeploy Services
- [ ] Backend: Click "Manual Deploy" → "Deploy latest commit"
- [ ] Frontend: Click "Manual Deploy" → "Deploy latest commit"

### 8. Test Your Deployment
- [ ] Visit frontend URL
- [ ] Login (default: admin/admin123)
- [ ] Test RedNote Feed
- [ ] Test content rewriting (requires DeepSeek API)

## 🔧 Configuration Summary

### Backend Environment Variables:
```
DEEPSEEK_API_KEY=sk-your-key-here
LLM_API_BASE_URL=https://api.deepseek.com
LLM_MODEL=deepseek-chat
ALLOWED_ORIGINS=https://your-frontend-url.onrender.com
SECRET_KEY=(auto-generated)
DATABASE_URL=sqlite:///./database.db
```

### Frontend Environment Variables:
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## 🐛 Troubleshooting

- **CORS errors**: Check `ALLOWED_ORIGINS` matches frontend URL exactly (no trailing slash)
- **API connection**: Verify `REACT_APP_API_URL` matches backend URL exactly
- **DeepSeek errors**: Check API key is correct, check backend logs
- **Slow first request**: Normal for free tier (services spin down after 15 min)

## 📚 Documentation

- Quick guide: `QUICK_DEPLOY.md`
- Full guide: `DEPLOYMENT.md`

