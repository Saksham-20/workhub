#!/bin/bash

echo "🚀 Deploying Logging Fix to Render.com"
echo "======================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized. Please run:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if changes are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Committing changes..."
    git add .
    git commit -m "Fix: Enhanced logging for production visibility

- Added emoji-based logging for better visibility in Render logs
- Enhanced login attempt logging with environment info
- Improved success/failure logging format
- Better error logging for production debugging

This should make login logs visible in Render.com dashboard."
    
    echo "✅ Changes committed"
else
    echo "ℹ️  No changes to commit"
fi

# Push to trigger deployment
echo "🚀 Pushing to trigger Render deployment..."
git push origin main

echo ""
echo "✅ Deployment triggered!"
echo ""
echo "🔍 Next Steps:"
echo "1. Go to https://dashboard.render.com"
echo "2. Find your workhub-backend service"
echo "3. Click on 'Logs' tab"
echo "4. Wait for deployment to complete"
echo "5. Test login and check for enhanced logs"
echo ""
echo "🧪 Test login with:"
echo "curl -X POST https://workhub-jj2l.onrender.com/api/auth/login \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\":\"sarah.demo@workhub.com\",\"password\":\"demo123\"}'"
echo ""
echo "📋 Look for these log patterns:"
echo "   🔐 LOGIN ATTEMPT START"
echo "   ✅ LOGIN SUCCESSFUL"
echo "   ❌ VALIDATION ERRORS (if any)"
