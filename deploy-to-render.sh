#!/bin/bash

echo "🚀 WorkHub Deployment Script for Render"
echo "========================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized. Please run:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin <your-github-repo-url>"
    echo "   git push -u origin main"
    exit 1
fi

# Check if changes are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Prepare for deployment'"
    echo "   git push"
    exit 1
fi

echo "✅ Git repository is ready"

# Create .env.example for reference
echo "📝 Creating .env.example file..."
cat > workhub/backend/.env.example << EOF
# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database

# JWT Configuration
JWT_SECRET=your_jwt_secret_here_make_it_long_and_random

# Server Configuration
NODE_ENV=production
PORT=10000
EOF

echo "✅ .env.example created"

# Create .env.example for frontend
cat > workhub/frontend/.env.example << EOF
# API Configuration
REACT_APP_API_URL=https://workhub-backend.onrender.com
EOF

echo "✅ Frontend .env.example created"

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo ""
echo "1. Push your code to GitHub:"
echo "   git push"
echo ""
echo "2. Go to https://render.com and sign up/login"
echo ""
echo "3. Create a PostgreSQL database:"
echo "   - Click 'New +' → 'PostgreSQL'"
echo "   - Name: workhub-database"
echo "   - Plan: Free"
echo "   - Click 'Create Database'"
echo ""
echo "4. Deploy Backend:"
echo "   - Click 'New +' → 'Web Service'"
echo "   - Connect your GitHub repository"
echo "   - Name: workhub-backend"
echo "   - Environment: Node"
echo "   - Build Command: cd workhub/backend && npm install"
echo "   - Start Command: cd workhub/backend && npm start"
echo "   - Add Environment Variables:"
echo "     * NODE_ENV: production"
echo "     * DATABASE_URL: (from your PostgreSQL database)"
echo "     * JWT_SECRET: (generate a strong secret)"
echo "     * PORT: 10000"
echo ""
echo "5. Deploy Frontend:"
echo "   - Click 'New +' → 'Static Site'"
echo "   - Connect your GitHub repository"
echo "   - Name: workhub-frontend"
echo "   - Build Command: cd workhub/frontend && npm install && npm run build"
echo "   - Publish Directory: workhub/frontend/build"
echo "   - Add Environment Variable:"
echo "     * REACT_APP_API_URL: https://workhub-backend.onrender.com"
echo ""
echo "6. Run Database Migrations:"
echo "   - After backend is deployed, run migrations:"
echo "   DATABASE_URL='your_database_url' node workhub/backend/run-migrations.js"
echo ""
echo "7. Create Demo Data:"
echo "   DATABASE_URL='your_database_url' node workhub/backend/create_demo_simple.js"
echo "   DATABASE_URL='your_database_url' node workhub/backend/create_demo_jobs.js"
echo "   DATABASE_URL='your_database_url' node workhub/backend/create_demo_proposals.js"
echo ""
echo "8. Test your deployment:"
echo "   - Frontend: https://workhub-frontend.onrender.com"
echo "   - Backend API: https://workhub-backend.onrender.com/api/health"
echo ""
echo "🎉 Your WorkHub platform will be live on Render!"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT_GUIDE.md"
