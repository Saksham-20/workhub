# WorkHub Port Configuration Explained

## 🚨 The Port 10000 Issue - SOLVED!

### What Was Happening:
- **Port 10000** is configured for **deployment on Render.com**
- When you ran `PORT=10000 node server.js`, it tried to bind to port 10000 locally
- This caused the "Detected service running on port 10000" error

### The Solution:
- **Local Development**: Use port **5001** (default)
- **Deployment**: Use port **10000** (Render.com requirement)

## 📋 Port Usage:

| Environment | Port | Command | Purpose |
|-------------|------|---------|---------|
| **Local Dev** | 5001 | `./start-local.sh` | Development & testing |
| **Deployment** | 10000 | Render.com | Production server |

## 🚀 How to Run Locally (CORRECT):

```bash
# Method 1: Use the helper script (RECOMMENDED)
./start-local.sh

# Method 2: Manual start
cd backend
NODE_ENV=development PORT=5001 node server.js

# Method 3: Use the port conflict fixer
./fix-port-conflict.sh
```

## ❌ What NOT to Do:

```bash
# DON'T run this locally (causes port conflicts)
PORT=10000 node server.js

# DON'T use deployment port for local development
```

## ✅ Current Status:
- ✅ Server running on port 5001 (local)
- ✅ No port conflicts
- ✅ All endpoints working
- ✅ Database connected
- ✅ Demo accounts ready

## 🔧 Quick Commands:

```bash
# Test local server
node test-local.js

# Start local server
./start-local.sh

# Fix port conflicts
./fix-port-conflict.sh

# Check server status
curl http://localhost:5001/api/health
```

## 🌐 URLs:
- **Local Backend**: http://localhost:5001
- **Health Check**: http://localhost:5001/api/health
- **Login**: http://localhost:5001/api/auth/login
- **Jobs**: http://localhost:5001/api/jobs

The port 10000 issue is now completely resolved! 🎉
