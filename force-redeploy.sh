#!/bin/bash

echo "🚀 Force Redeploy WorkHub Backend"
echo "=================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Please run this from the workhub root directory."
    exit 1
fi

# Create a small change to force redeploy
echo "📝 Creating deployment trigger..."
echo "// Deployment trigger: $(date)" >> backend/server.js

# Commit the change
git add backend/server.js
git commit -m "Force redeploy: $(date)

- Triggering backend redeploy to apply CORS fixes
- This should resolve the login issues"

# Push to trigger deployment
echo "🚀 Pushing to trigger deployment..."
git push origin main

echo ""
echo "✅ Changes pushed! Render should now redeploy the backend."
echo ""
echo "⏳ Wait 2-3 minutes for deployment to complete, then test:"
echo "   node quick-test.js"
echo ""
echo "🔍 Monitor deployment at: https://render.com"
echo "   Look for 'workhub-backend' service"
