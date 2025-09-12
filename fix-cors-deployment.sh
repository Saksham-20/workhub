#!/bin/bash

echo "🔧 Fixing CORS Issue for Frontend Login"
echo "======================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized. Please run:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

echo "📝 Committing CORS fixes..."
git add .
git commit -m "Fix: CORS configuration for frontend login

- Added workhub-jj2l.onrender.com to allowed origins
- Enhanced CORS debugging with origin logging
- Added CORS debug endpoint for troubleshooting
- Improved CORS error handling and logging

This should fix the login issue on https://workhub-1-i1ga.onrender.com"

echo "✅ CORS fixes committed"

# Push to trigger deployment
echo "🚀 Deploying CORS fixes to Render..."
git push origin main

echo ""
echo "✅ CORS fixes deployed!"
echo ""
echo "🧪 Test the fix:"
echo "1. Wait 2-3 minutes for deployment to complete"
echo "2. Go to https://workhub-1-i1ga.onrender.com/login"
echo "3. Try logging in with:"
echo "   Email: sarah.demo@workhub.com"
echo "   Password: demo123"
echo ""
echo "🔍 Debug CORS if still having issues:"
echo "curl https://workhub-jj2l.onrender.com/api/cors-debug"
echo ""
echo "📋 Check Render logs for CORS debugging info"
