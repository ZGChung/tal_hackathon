#!/bin/bash
# Script to open the React app in Cursor's browser
# Wait for the server to be ready, then open in Cursor

echo "Waiting for React dev server to start..."
sleep 5

# Open in Cursor's browser (Cursor will handle this automatically when you click the link)
# Or manually open: http://localhost:3000 in Cursor's browser panel
echo "App should be running at http://localhost:3000"
echo "Open this URL in Cursor's browser panel (View > Show Browser or Cmd+Shift+B)"

# Try to open using Cursor's command if available
if command -v cursor &> /dev/null; then
    cursor --open-url http://localhost:3000 2>/dev/null || echo "Use Cursor's browser panel to open http://localhost:3000"
else
    echo "Use Cursor's browser panel to open http://localhost:3000"
fi

