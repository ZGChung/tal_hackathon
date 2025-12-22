# Render Environment Variables Setup

## Your Configuration Values

Copy these values into your Render dashboard after deployment:

### Backend Service Environment Variables

1. Go to your **tal-hackathon-backend** service → **Environment** tab
2. Add/Update these variables:

```
DEEPSEEK_API_KEY=YOUR-DEEPSEEK-API-KEY-HERE
```

```
ALLOWED_ORIGINS=https://tal-hackathon-frontend.onrender.com
```

**Note:** Replace `tal-hackathon-frontend.onrender.com` with your actual frontend URL from Render dashboard.

### Frontend Service Environment Variables

1. Go to your **tal-hackathon-frontend** service → **Environment** tab
2. Add/Update this variable:

```
REACT_APP_API_URL=https://tal-hackathon-backend.onrender.com
```

**Note:** Replace `tal-hackathon-backend.onrender.com` with your actual backend URL from Render dashboard.

## Quick Steps

1. Deploy services on Render (get the URLs)
2. Copy your backend URL (e.g., `https://tal-hackathon-backend-xyz.onrender.com`)
3. Copy your frontend URL (e.g., `https://tal-hackathon-frontend-abc.onrender.com`)
4. Set backend `ALLOWED_ORIGINS` = your frontend URL
5. Set frontend `REACT_APP_API_URL` = your backend URL
6. Set backend `DEEPSEEK_API_KEY` = `YOUR-DEEPSEEK-API-KEY-HERE`
7. Redeploy both services

