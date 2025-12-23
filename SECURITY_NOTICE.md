# ⚠️ Security Notice

## API Key Exposure

**IMPORTANT:** The DeepSeek API key was previously committed to this repository in commit history.

### If Your Repository is Public:

1. **ROTATE YOUR API KEY IMMEDIATELY**

    - Go to https://platform.deepseek.com
    - Generate a new API key
    - Revoke/delete the old key: `YOUR-DEEPSEEK-API-KEY-HERE`

2. **Update Your Deployments**

    - Update the `DEEPSEEK_API_KEY` environment variable in Render with your new key
    - Update any other services using the old key

3. **Check API Usage**
    - Review your DeepSeek API usage logs for any unauthorized access
    - Monitor for unexpected charges

### Current Status:

✅ API key has been removed from all documentation files
✅ `.env.local` file created (gitignored) for local reference
✅ All future commits will use placeholders

### Best Practices:

-   **Never commit API keys** to version control
-   Use environment variables in deployment platforms (Render, etc.)
-   Store keys in `.env.local` (gitignored) for local development only
-   Use secret management services for production

### For Local Development:

Create a `.env.local` file (already created, gitignored) with:

```
DEEPSEEK_API_KEY=your-key-here
```

### For Deployment:

Set environment variables directly in Render dashboard:

-   Go to your service → Environment tab
-   Add `DEEPSEEK_API_KEY` = your key
-   Never commit the key to git
