# Deployment Guide - Income Tracker App

This guide will help you deploy your income tracking app to Vercel (frontend), Render (backend), and MongoDB Atlas (database).

## Prerequisites
- GitHub account
- Vercel account (free)
- Render account (free)
- MongoDB Atlas account (free)

---

## Step 1: Set Up MongoDB Atlas (Database)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select a cloud provider and region (closest to you)
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `incometracker` (or your choice)
   - Password: Generate a strong password (save it!)
   - User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Allow Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:<password>@cluster.xxxxx.mongodb.net/`
   - Replace `<password>` with your actual password
   - Save this for later!

---

## Step 2: Push Code to GitHub

1. **Create GitHub Repository**
   - Go to https://github.com/new
   - Name: `income-tracker` (or your choice)
   - Make it Public or Private
   - Click "Create repository"

2. **Push Your Code**
   ```bash
   # In your project directory (/app)
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/income-tracker.git
   git push -u origin main
   ```

---

## Step 3: Deploy Backend to Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your `income-tracker` repo

3. **Configure Service**
   - **Name**: `income-tracker-api` (or your choice)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable":
   
   - **MONGO_URL**: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/`
     (Your connection string from Step 1)
   
   - **DB_NAME**: `income_tracker`
   
   - **SECRET_KEY**: Generate random string (e.g., `openssl rand -hex 32`)
     Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`
   
   - **CORS_ORIGINS**: `*` (we'll update this after frontend deployment)

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - You'll get a URL like: `https://income-tracker-api.onrender.com`
   - **Save this URL!**

6. **Test Backend**
   - Visit: `https://your-api.onrender.com/docs`
   - You should see the API documentation

---

## Step 4: Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your `income-tracker` GitHub repo
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `yarn build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)

4. **Add Environment Variables**
   Click "Environment Variables":
   
   - **Key**: `REACT_APP_BACKEND_URL`
   - **Value**: `https://your-api.onrender.com` (from Step 3)
   - Select all environments (Production, Preview, Development)
   - Click "Add"

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - You'll get a URL like: `https://income-tracker.vercel.app`
   - **Save this URL!**

---

## Step 5: Update CORS Settings

1. **Go Back to Render**
   - Open your backend service
   - Go to "Environment"
   - Find `CORS_ORIGINS` variable
   - Update value to: `https://your-app.vercel.app`
   - Click "Save Changes"
   - Service will auto-redeploy

---

## Step 6: Test Your App

1. **Visit Your Vercel URL**
   - Open: `https://your-app.vercel.app`
   - You should see the login page

2. **Create Test Account**
   - Click "Sign Up"
   - Register with email and password
   - You should be logged in

3. **Test Features**
   - Set a monthly target
   - Add income entries
   - View monthly summary
   - Check YTD total
   - View 12-month overview

---

## Step 7: Custom Domain (Optional)

### For Vercel (Frontend)
1. Go to your project settings
2. Click "Domains"
3. Add your domain (e.g., `income.yourdomain.com`)
4. Follow DNS configuration instructions

### For Render (Backend)
1. Go to your service settings
2. Click "Custom Domain"
3. Add subdomain (e.g., `api.yourdomain.com`)
4. Update frontend env variable with new backend URL

---

## Troubleshooting

### Backend not connecting to MongoDB
- Check MONGO_URL is correct
- Ensure IP whitelist includes 0.0.0.0/0
- Verify database user has correct permissions

### Frontend can't reach backend
- Check REACT_APP_BACKEND_URL is set correctly
- Verify CORS_ORIGINS includes your Vercel URL
- Check browser console for errors

### App shows errors
- Check Render logs: Dashboard → your service → Logs
- Check Vercel logs: Project → Deployments → click deployment → Logs

---

## Costs

- **MongoDB Atlas**: FREE (512MB storage)
- **Render**: FREE (750 hours/month, sleeps after 15min inactivity)
- **Vercel**: FREE (unlimited bandwidth, 100GB/month)

**Note**: Render free tier sleeps after inactivity. First request after sleep takes 30-60 seconds.

---

## Next Steps

1. Share your Vercel URL with clients
2. Consider custom domain for professional look
3. Monitor usage in each platform's dashboard
4. Upgrade plans as needed for more users

---

## Support

If you encounter issues:
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- MongoDB: https://docs.mongodb.com/

---

## Your Deployment URLs

Fill these in after deployment:

- **Frontend (Vercel)**: ___________________________
- **Backend (Render)**: ___________________________
- **Database**: MongoDB Atlas

Share the Vercel URL with your clients!
