#!/bin/bash

echo "🚀 Force Rebuilding Frontend with Correct Backend URL"
echo "===================================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized. Please run:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

echo "📝 Committing force rebuild with correct backend URL..."
git add .
git commit -m "Force: Frontend rebuild with correct backend URL

- Forced API_URL to use https://workhub-jj2l.onrender.com
- Added debug logging to verify API configuration
- This should fix the CORS issue by using correct backend

The frontend was still trying to reach workhub-backend.onrender.com
instead of workhub-jj2l.onrender.com. This commit forces the correct URL."

echo "✅ Force rebuild committed"

# Push to trigger deployment
echo "🚀 Deploying force rebuild to Render..."
git push origin main

echo ""
echo "✅ Force rebuild deployed!"
echo ""
echo "⏰ Wait 5-7 minutes for complete rebuild and deployment"
echo ""
echo "🧪 Test after deployment:"
echo "1. Go to https://workhub-1-i1ga.onrender.com/login"
echo "2. Open browser console (F12)"
echo "3. Look for debug logs showing correct API_URL"
echo "4. Try logging in with sarah.demo@workhub.com / demo123"
echo ""
echo "🔍 Expected console output:"
echo "   🔍 API Configuration:"
echo "   Final API_URL: https://workhub-jj2l.onrender.com"
echo ""
echo "📋 If still showing workhub-backend.onrender.com:"
echo "   - Clear browser cache completely"
echo "   - Try incognito/private mode"
echo "   - Wait longer for deployment to complete"
