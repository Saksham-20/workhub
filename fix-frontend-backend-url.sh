#!/bin/bash

echo "🔧 Fixing Frontend Backend URL Configuration"
echo "============================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized. Please run:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

echo "📝 Committing frontend backend URL fix..."
git add .
git commit -m "Fix: Frontend now points to correct backend URL

- Updated api.js to use https://workhub-jj2l.onrender.com in production
- Fixed CORS issue by pointing to correct backend
- Frontend will now connect to the working backend

This should resolve the login CORS errors on the deployed frontend."

echo "✅ Frontend backend URL fix committed"

# Push to trigger deployment
echo "🚀 Deploying frontend fix to Render..."
git push origin main

echo ""
echo "✅ Frontend fix deployed!"
echo ""
echo "🧪 Test the fix:"
echo "1. Wait 3-5 minutes for frontend deployment to complete"
echo "2. Go to https://workhub-1-i1ga.onrender.com/login"
echo "3. Try logging in with:"
echo "   Email: sarah.demo@workhub.com"
echo "   Password: demo123"
echo ""
echo "🔍 Expected results:"
echo "   ✅ No more CORS errors in browser console"
echo "   ✅ Login should work successfully"
echo "   ✅ Should redirect to dashboard after login"
echo ""
echo "📋 If still having issues:"
echo "   - Clear browser cache (Ctrl+F5 or Cmd+Shift+R)"
echo "   - Try in incognito/private mode"
echo "   - Check browser console for any remaining errors"
