#!/bin/bash

echo "🚨 EMERGENCY DEPLOYMENT - WorkHub Login Fixes"
echo "=============================================="

# Stop any running processes
echo "🛑 Stopping any running processes..."
pkill -f "node server.js" 2>/dev/null || true

# Check git status
echo "📋 Checking git status..."
git status

# Add all changes
echo "📦 Adding all changes..."
git add .

# Create a unique commit message with timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
COMMIT_MSG="EMERGENCY FIX: Deploy login fixes - $TIMESTAMP

- Fixed CORS configuration for frontend URL
- Enhanced error handling and logging  
- Added database initialization
- Added demo account creation
- Added version tracking
- Force deployment trigger"

# Commit changes
echo "💾 Committing changes with timestamp..."
git commit -m "$COMMIT_MSG"

# Push to trigger deployment
echo "🚀 Pushing to GitHub to trigger Render deployment..."
git push origin main

echo ""
echo "✅ Emergency deployment triggered!"
echo ""
echo "⏳ Render should now detect the changes and redeploy"
echo "🔍 Check your Render dashboard for deployment status"
echo ""
echo "🧪 Test with this command in 2-3 minutes:"
echo "   node quick-test.js"
echo ""
echo "🔑 Demo Credentials:"
echo "   Email: michael.demo@workhub.com"
echo "   Password: demo123"
echo ""
echo "🌐 URLs:"
echo "   Frontend: https://workhub-1-i1ga.onrender.com"
echo "   Backend: https://workhub-backend.onrender.com"
echo ""
echo "📱 If this doesn't work, manually go to Render dashboard and click 'Redeploy'"
