#!/bin/bash

echo "🚀 Starting WorkHub Backend with Live Logs"
echo "=========================================="

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "node.*server.js" 2>/dev/null || true
sleep 2

# Set environment variables
export NODE_ENV=development
export PORT=5001

echo "📡 Starting server on port $PORT..."
echo "🌐 Backend will be available at: http://localhost:$PORT"
echo "🔍 Health check: http://localhost:$PORT/api/health"
echo ""
echo "📋 You should see login logs when you test the API"
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server in foreground so you can see logs
cd backend
node server.js
