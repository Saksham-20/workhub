# 🚀 WorkHub Deployment Guide for Render

This guide will help you deploy WorkHub on Render, a modern cloud platform that makes deployment simple and automatic.

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **PostgreSQL Database**: We'll use Render's managed PostgreSQL

## 🗄️ Database Setup

### Step 1: Create PostgreSQL Database on Render

1. Go to your Render dashboard
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `workhub-database`
   - **Database**: `workhub`
   - **User**: `workhub_user`
   - **Region**: Choose closest to your users
   - **Plan**: Start with Free tier (can upgrade later)

4. Click "Create Database"
5. **Save the connection details** - you'll need them for the backend

### Step 2: Get Database Connection String

After creation, go to your database dashboard and copy the **External Database URL**. It will look like:
```
postgresql://workhub_user:password@dpg-xxxxx-a.oregon-postgres.render.com/workhub
```

## 🔧 Backend Deployment

### Step 1: Prepare Backend for Deployment

1. **Create `render.yaml` in project root:**

```yaml
services:
  - type: web
    name: workhub-backend
    env: node
    plan: free
    buildCommand: cd workhub/backend && npm install
    startCommand: cd workhub/backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: workhub-database
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: PORT
        value: 10000
    healthCheckPath: /api/health

  - type: web
    name: workhub-frontend
    env: static
    buildCommand: cd workhub/frontend && npm install && npm run build
    staticPublishPath: workhub/frontend/build
    envVars:
      - key: REACT_APP_API_URL
        value: https://workhub-backend.onrender.com
```

### Step 2: Update Backend Configuration

1. **Update `workhub/backend/config/database.js`:**

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = { pool };
```

2. **Update `workhub/backend/server.js`:**

```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/proposals', require('./routes/proposals'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

3. **Update `workhub/backend/package.json`:**

```json
{
  "name": "workhub-backend",
  "version": "1.0.0",
  "description": "WorkHub Backend API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.11.3",
    "express-validator": "^7.0.1",
    "dotenv": "^16.3.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Step 3: Deploy Backend

1. Go to Render dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `workhub-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd workhub/backend && npm install`
   - **Start Command**: `cd workhub/backend && npm start`
   - **Plan**: Free

5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: (from your PostgreSQL database)
   - `JWT_SECRET`: (generate a strong secret)
   - `PORT`: `10000`

6. Click "Create Web Service"

## 🎨 Frontend Deployment

### Step 1: Update Frontend Configuration

1. **Update `workhub/frontend/package.json`:**

```json
{
  "name": "workhub-frontend",
  "version": "0.1.0",
  "private": true,
  "homepage": ".",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1",
    "axios": "^1.3.4",
    "tailwindcss": "^3.2.7"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

2. **Update `workhub/frontend/src/services/api.js`:**

```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Step 2: Deploy Frontend

1. Go to Render dashboard
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `workhub-frontend`
   - **Build Command**: `cd workhub/frontend && npm install && npm run build`
   - **Publish Directory**: `workhub/frontend/build`
   - **Plan**: Free

5. Add Environment Variable:
   - `REACT_APP_API_URL`: `https://workhub-backend.onrender.com`

6. Click "Create Static Site"

## 🗃️ Database Migration

### Step 1: Run Database Migrations

After backend is deployed, you need to run the database migrations:

1. **Create a migration script** `workhub/backend/run-migrations.js`:

```javascript
const { pool } = require('./config/database');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  try {
    console.log('Running database migrations...');
    
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir).sort();
    
    for (const file of files) {
      if (file.endsWith('.sql')) {
        console.log(`Running migration: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await pool.query(sql);
        console.log(`✅ Migration ${file} completed`);
      }
    }
    
    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
```

2. **Add migration script to package.json**:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "migrate": "node run-migrations.js"
  }
}
```

3. **Run migrations** (you can do this locally with the production database URL):

```bash
cd workhub/backend
DATABASE_URL="your_render_database_url" npm run migrate
```

### Step 2: Create Demo Data

Run the demo data creation scripts:

```bash
cd workhub/backend
DATABASE_URL="your_render_database_url" node create_demo_simple.js
DATABASE_URL="your_render_database_url" node create_demo_jobs.js
DATABASE_URL="your_render_database_url" node create_demo_proposals.js
```

## 🔧 Environment Variables Summary

### Backend Environment Variables:
- `NODE_ENV`: `production`
- `DATABASE_URL`: (from Render PostgreSQL)
- `JWT_SECRET`: (generate strong secret)
- `PORT`: `10000`

### Frontend Environment Variables:
- `REACT_APP_API_URL`: `https://workhub-backend.onrender.com`

## 🌐 Custom Domain (Optional)

1. Go to your static site settings on Render
2. Click "Custom Domains"
3. Add your domain
4. Update DNS records as instructed
5. Update `REACT_APP_API_URL` to use your custom domain

## 📊 Monitoring & Logs

- **Backend Logs**: Available in Render dashboard under your web service
- **Frontend Logs**: Available in Render dashboard under your static site
- **Database Monitoring**: Available in Render dashboard under your database

## 🚀 Deployment Checklist

- [ ] Push code to GitHub
- [ ] Create PostgreSQL database on Render
- [ ] Deploy backend web service
- [ ] Deploy frontend static site
- [ ] Run database migrations
- [ ] Create demo data
- [ ] Test both demo accounts
- [ ] Verify all features work
- [ ] Set up custom domain (optional)

## 🔍 Troubleshooting

### Common Issues:

1. **Database Connection Issues**:
   - Check `DATABASE_URL` is correct
   - Ensure SSL is enabled for production
   - Verify database is accessible

2. **CORS Issues**:
   - Update CORS settings in backend
   - Check frontend API URL

3. **Build Failures**:
   - Check Node.js version (should be 18+)
   - Verify all dependencies are in package.json
   - Check build logs in Render dashboard

4. **Environment Variables**:
   - Ensure all required variables are set
   - Check variable names match exactly

## 📞 Support

If you encounter issues:
1. Check Render dashboard logs
2. Verify environment variables
3. Test locally with production database URL
4. Check GitHub repository is up to date

---

**Your WorkHub platform will be live at:**
- Frontend: `https://workhub-frontend.onrender.com`
- Backend API: `https://workhub-backend.onrender.com`

🎉 **Congratulations! Your WorkHub platform is now live on Render!**
