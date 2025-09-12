#!/bin/bash

echo "🔧 WorkHub CORS Fix Deployment"
echo "==============================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Please run this from the workhub root directory."
    exit 1
fi

# Check git status
echo "📋 Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Staging changes..."
    git add .
    
    echo "💾 Committing CORS fixes..."
    git commit -m "Fix CORS configuration for frontend access

- Updated CORS middleware to properly handle preflight requests
- Added explicit CORS headers for all responses
- Added debugging endpoints for CORS testing
- Fixed origin validation for workhub-1-i1ga.onrender.com

This should resolve the CORS error preventing login from the frontend."
    
    echo "🚀 Pushing changes to GitHub..."
    git push origin main
    
    echo "✅ Changes pushed to GitHub!"
else
    echo "ℹ️  No changes to commit. CORS fixes may already be deployed."
fi

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo ""
echo "1. Go to https://render.com"
echo "2. Find your 'workhub-backend' service"
echo "3. Click 'Manual Deploy' → 'Deploy latest commit'"
echo "4. Wait for deployment to complete (2-3 minutes)"
echo "5. Test the login at https://workhub-1-i1ga.onrender.com"
echo ""
echo "🔍 To test the fix:"
echo "   node quick-test.js"
echo ""
echo "📋 CORS Configuration Applied:"
echo "   - Added workhub-1-i1ga.onrender.com to allowed origins"
echo "   - Fixed preflight request handling"
echo "   - Added explicit CORS headers to all responses"
echo "   - Added debugging for CORS requests"
echo ""
echo "🎉 After deployment, the login should work without CORS errors!"
