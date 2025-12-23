# Secure Deployment Workflow

## 🔐 How API Keys Work (Secure Method)

**The Problem:** You need the API key for deployment, but can't commit it to git (especially if repo is public).

**The Solution:** Store key locally, set it in Render dashboard (not in git).

## ✅ Secure Workflow

### Step 1: Store Key Locally (Already Done)

Your API key is stored in `.env.local` (gitignored):
```bash
# This file is NOT committed to git
DEEPSEEK_API_KEY=YOUR-DEEPSEEK-API-KEY-HERE
```

### Step 2: Get Your Key for Deployment

**Option A: Use Helper Script (Easiest)**
```bash
./copy_api_key.sh
```
This will display your key for easy copying.

**Option B: Read from File**
```bash
cat .env.local | grep DEEPSEEK_API_KEY
```

**Option C: Open File**
```bash
# Open .env.local in your editor
code .env.local  # or vim, nano, etc.
```

### Step 3: Set Key in Render Dashboard

1. Go to https://render.com
2. Navigate to your **backend service**
3. Click **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Set:
   - **Key**: `DEEPSEEK_API_KEY`
   - **Value**: Paste your key from Step 2
6. Click **"Save Changes"**
7. **Redeploy** your service

### Step 4: Verify It Works

- Key is stored locally (`.env.local`) ✅
- Key is set in Render dashboard ✅
- Key is NOT in git ✅
- Key is NOT in any committed files ✅

## 🔄 Deployment Process

```
┌─────────────────┐
│  .env.local     │  (Local, gitignored)
│  (Your Key)     │
└────────┬────────┘
         │ Copy
         ▼
┌─────────────────┐
│  Render          │  (Cloud platform)
│  Dashboard       │
│  Environment     │
│  Variables       │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  Deployed App    │  (Uses key from Render)
└─────────────────┘
```

## 📋 Quick Checklist

- [ ] API key stored in `.env.local` (gitignored)
- [ ] API key NOT in any git-tracked files
- [ ] API key set in Render dashboard
- [ ] Service redeployed after setting key
- [ ] App working with DeepSeek API

## 🛡️ Security Best Practices

✅ **DO:**
- Store keys in `.env.local` (gitignored)
- Set keys in Render dashboard environment variables
- Use helper scripts to copy keys (don't type them)
- Rotate keys if exposed

❌ **DON'T:**
- Commit keys to git
- Hardcode keys in source code
- Share keys in documentation
- Push keys to public repositories

## 🚨 If Key Was Exposed

If your key was ever committed to git:
1. **Rotate immediately** at https://platform.deepseek.com
2. Update key in Render dashboard
3. Update `.env.local` with new key
4. See `SECURITY_NOTICE.md` for details

## 💡 Why This Works

- **Render stores keys securely** - They're encrypted and only accessible through the dashboard
- **Keys never leave your control** - You manually set them, they're not in code
- **Git stays clean** - No sensitive data in version control
- **Easy to rotate** - Just update in Render dashboard if needed

