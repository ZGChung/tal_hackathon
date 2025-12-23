# API Key Setup Guide

## ⚠️ Important Security Note

**Never commit API keys to git!** This repository is configured to keep API keys secure.

## Your DeepSeek API Key

Your API key is stored locally in `.env.local` (gitignored) for your reference.

**For deployment on Render:**

1. Go to your backend service in Render dashboard
2. Navigate to "Environment" tab
3. Add: `DEEPSEEK_API_KEY` = your key from `.env.local`
4. Save and redeploy

## Getting Your API Key

If you need to get or rotate your API key:

1. Go to https://platform.deepseek.com
2. Sign in to your account
3. Navigate to API Keys section
4. Create or copy your API key

## Security Best Practices

✅ **DO:**

-   Store keys in `.env.local` (gitignored) for local development
-   Set keys as environment variables in deployment platforms
-   Rotate keys if they're ever exposed

❌ **DON'T:**

-   Commit API keys to git
-   Share keys in documentation
-   Hardcode keys in source code
-   Push keys to public repositories

## If Your Key Was Exposed

If your API key was exposed in a public repository:

1. **Immediately rotate the key** at https://platform.deepseek.com
2. Update the key in all your deployments
3. Review API usage logs for unauthorized access
4. See `SECURITY_NOTICE.md` for more details
