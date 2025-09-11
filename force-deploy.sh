#!/bin/bash

echo "🚀 Force Deploying WorkHub Backend to Render"
echo "============================================="

# Stop any running processes
echo "🛑 Stopping any running processes..."
pkill -f "node server.js" 2>/dev/null || true

# Check git status
echo "📋 Checking git status..."
git status

# Add all changes
echo "📦 Adding all changes..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Force deploy: Fix login issues and CORS configuration

- Fixed CORS configuration for frontend URL
- Enhanced error handling and logging
- Added database initialization
- Added demo account creation
- Fixed package.json paths
- Updated render.yaml configuration"

# Push to trigger deployment
echo "🚀 Pushing to GitHub to trigger Render deployment..."
git push origin main

echo ""
echo "✅ Deployment triggered!"
echo ""
echo "⏳ Render typically takes 2-5 minutes to deploy"
echo "🔍 Check your Render dashboard for deployment status"
echo ""
echo "🧪 Once deployed, test with:"
echo "   Email: michael.demo@workhub.com"
echo "   Password: demo123"
echo ""
echo "🌐 Test URLs:"
echo "   Backend Health: https://workhub-backend.onrender.com/api/health"
echo "   Frontend: https://workhub-1-i1ga.onrender.com"
