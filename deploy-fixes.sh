#!/bin/bash

echo "🚀 Deploying WorkHub login fixes..."

# Check if we're in the right directory
if [ ! -f "backend/server.js" ]; then
    echo "❌ Please run this script from the workhub root directory"
    exit 1
fi

echo "📦 Installing dependencies..."
cd backend
npm install

echo "🔧 Running database migrations..."
node -e "require('./config/database').runMigrations().then(() => console.log('Migrations completed')).catch(console.error)"

echo "👥 Creating demo accounts..."
node create_simple_demo.js

echo "✅ Backend setup complete!"
echo ""
echo "🌐 Frontend CORS Configuration:"
echo "The frontend should be configured to use: https://workhub-backend.onrender.com"
echo ""
echo "🔑 Demo Account Credentials:"
echo "Client: michael.demo@workhub.com / demo123"
echo "Freelancer: sarah.demo@workhub.com / demo123"
echo ""
echo "🧪 Testing login..."
cd ..
node test_login.js

echo ""
echo "🎉 Deployment complete! The login issues should now be fixed."
echo ""
echo "📋 What was fixed:"
echo "1. ✅ Added correct frontend URL to CORS configuration"
echo "2. ✅ Improved CORS handling for preflight requests"
echo "3. ✅ Added better error logging and debugging"
echo "4. ✅ Added database connection testing on startup"
echo "5. ✅ Added automatic migration and demo account creation"
echo "6. ✅ Improved error handling in login controller"
