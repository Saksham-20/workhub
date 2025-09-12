#!/bin/bash

echo "🔧 WorkHub Port Conflict Fixer"
echo "=============================="

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "❌ Port $port is in use"
        return 1
    else
        echo "✅ Port $port is available"
        return 0
    fi
}

# Function to kill processes on a port
kill_port() {
    local port=$1
    echo "🧹 Killing processes on port $port..."
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
    sleep 1
}

echo "🔍 Checking common WorkHub ports..."

# Check port 5001 (default local)
if ! check_port 5001; then
    echo "⚠️  Port 5001 is in use. Attempting to free it..."
    kill_port 5001
    if check_port 5001; then
        echo "✅ Port 5001 is now available"
    else
        echo "❌ Could not free port 5001. Try using a different port:"
        echo "   PORT=5002 ./start-local.sh"
        exit 1
    fi
fi

# Check port 10000 (deployment port)
if ! check_port 10000; then
    echo "⚠️  Port 10000 is in use (deployment port). This is normal for local development."
    echo "💡 Use port 5001 for local development instead."
fi

echo ""
echo "🚀 Starting WorkHub backend on port 5001..."
echo "🌐 Backend URL: http://localhost:5001"
echo "🔍 Health check: http://localhost:5001/api/health"
echo ""

cd backend
NODE_ENV=development PORT=5001 node server.js
