#!/bin/bash

echo "🚀 Starting WorkHub Backend Locally"
echo "==================================="

# Kill any existing node processes on common ports
echo "🧹 Cleaning up existing processes..."
pkill -f "node.*server.js" 2>/dev/null || true

# Set local development environment
export NODE_ENV=development
export PORT=5001

echo "📡 Starting server on port $PORT..."
echo "🌐 Backend will be available at: http://localhost:$PORT"
echo "🔍 Health check: http://localhost:$PORT/api/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd backend
node server.js
