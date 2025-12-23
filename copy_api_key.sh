#!/bin/bash
# Helper script to display your API key for easy copying to Render
# This reads from .env.local (which is gitignored)

ENV_FILE=".env.local"

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: .env.local file not found!"
    echo ""
    echo "Create .env.local with:"
    echo "  DEEPSEEK_API_KEY=your-key-here"
    exit 1
fi

# Extract API key from .env.local
API_KEY=$(grep "^DEEPSEEK_API_KEY=" "$ENV_FILE" | cut -d '=' -f2 | tr -d '"' | tr -d "'" | xargs)

if [ -z "$API_KEY" ]; then
    echo "❌ Error: DEEPSEEK_API_KEY not found in .env.local"
    echo ""
    echo "Add this line to .env.local:"
    echo "  DEEPSEEK_API_KEY=your-key-here"
    exit 1
fi

echo "=========================================="
echo "🔑 Your DeepSeek API Key (for Render)"
echo "=========================================="
echo ""
echo "Copy this key and paste it into Render dashboard:"
echo ""
echo "$API_KEY"
echo ""
echo "=========================================="
echo ""
echo "Steps to add to Render:"
echo "1. Go to your backend service → Environment tab"
echo "2. Add variable: DEEPSEEK_API_KEY"
echo "3. Paste the key above as the value"
echo "4. Click 'Save Changes'"
echo "5. Redeploy your service"
echo ""

