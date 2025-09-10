# 🚀 Quick Start: Deploy WorkHub to Render

## Step 1: Prepare Your Code for GitHub

```bash
# Navigate to your project root
cd /Users/nishantpuri/Desktop/workhub

# Initialize git repository
git init

# Add all files
git add .

# Commit your code
git commit -m "Initial commit: WorkHub platform ready for deployment"

# Create a new repository on GitHub and add it as remote
# (Replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/workhub.git

# Push to GitHub
git push -u origin main
```

## Step 2: Deploy on Render

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Connect your GitHub repository

### 2.2 Create PostgreSQL Database
1. Click "New +" → "PostgreSQL"
2. Name: `workhub-database`
3. Plan: Free
4. Click "Create Database"
5. **Copy the External Database URL** (you'll need this)

### 2.3 Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `workhub-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd workhub/backend && npm install`
   - **Start Command**: `cd workhub/backend && npm start`
   - **Plan**: Free

4. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: (paste the database URL from step 2.2)
   - `JWT_SECRET`: `your_super_secret_jwt_key_here_make_it_long_and_random`
   - `PORT`: `10000`

5. Click "Create Web Service"

### 2.4 Deploy Frontend
1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `workhub-frontend`
   - **Build Command**: `cd workhub/frontend && npm install && npm run build`
   - **Publish Directory**: `workhub/frontend/build`
   - **Plan**: Free

4. Add Environment Variable:
   - `REACT_APP_API_URL`: `https://workhub-backend.onrender.com`

5. Click "Create Static Site"

## Step 3: Set Up Database

After both services are deployed, run these commands locally to set up the database:

```bash
# Run migrations
DATABASE_URL="your_database_url_here" node workhub/backend/run-migrations.js

# Create demo accounts
DATABASE_URL="your_database_url_here" node workhub/backend/create_demo_simple.js

# Create demo jobs
DATABASE_URL="your_database_url_here" node workhub/backend/create_demo_jobs.js

# Create demo proposals
DATABASE_URL="your_database_url_here" node workhub/backend/create_demo_proposals.js
```

## Step 4: Test Your Deployment

1. **Frontend URL**: `https://workhub-frontend.onrender.com`
2. **Backend Health Check**: `https://workhub-backend.onrender.com/api/health`

### Test Demo Accounts:
- **Freelancer**: `sarah.demo@workhub.com` / `demo123`
- **Client**: `michael.demo@workhub.com` / `demo123`

## 🎉 You're Done!

Your WorkHub platform is now live on Render! 

### What You Get:
- ✅ Professional freelance marketplace
- ✅ Complete user management
- ✅ Job posting and proposal system
- ✅ Demo accounts for client presentations
- ✅ Mobile-responsive design
- ✅ Indian Rupee currency support
- ✅ Custom skill functionality

### Next Steps:
1. Share the frontend URL with potential clients
2. Monitor the application in Render dashboard
3. Consider upgrading to paid plans as usage grows
4. Set up custom domain if needed

---

**Need Help?** Check the detailed `DEPLOYMENT_GUIDE.md` for troubleshooting and advanced configuration.
