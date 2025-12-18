# Quick Start - Deploy Your Income Tracker

Follow these 3 simple steps to get your app online (takes ~30 minutes):

---

## Step 1: MongoDB Atlas (5 minutes)

### 1. Create Account
- Go to https://www.mongodb.com/cloud/atlas
- Click "Try Free" or "Sign Up"
- Register with email or Google account

### 2. Create a FREE Cluster
- After login, you'll see "Create a deployment" or "Build a Database"
- Click "Build a Database"
- Choose **M0 FREE** tier (it says "Shared" and "FREE")
- Select any cloud provider (AWS, Google Cloud, or Azure)
- Choose a region closest to you or your clients
- Leave cluster name as default (e.g., "Cluster0")
- Click "Create" button at the bottom
- Wait 1-3 minutes for cluster creation

### 3. Create Database User
- You'll see a security setup screen
- Under "How would you like to authenticate your connection?"
- Choose "Username and Password" (should be selected by default)
- Enter a username (e.g., `incomeuser`)
- Click "Autogenerate Secure Password" or create your own
- **IMPORTANT**: Click the "Copy" button and paste this password somewhere safe (Notepad, etc.)
- Click "Create User" button

### 4. Allow Network Access
- Scroll down to "Where would you like to connect from?"
- Click "Add My Current IP Address" first (this adds your IP)
- Then click "Add a Different IP Address"
- In the box, type: `0.0.0.0/0`
- Description: `Allow all IPs`
- Click "Add Entry"
- Click "Finish and Close" button
- Click "Go to Databases" on the popup

### 5. Navigate to Connection
- You should see your cluster (Cluster0 or similar)
- Click the "Connect" button (big button on your cluster)

### 6. Get Connection String - DETAILED STEPS
- You'll see several connection options
- Click "Drivers" (or "Connect your application")
- Under "Select your driver and version":
  - Driver: **Node.js** (or leave default)
  - Version: **Any recent version** (doesn't matter much)
- You'll see a connection string that looks like this:
  ```
  mongodb+srv://incomeuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```
- Click the "Copy" button next to the connection string
- **CRITICAL**: Paste it somewhere (Notepad, etc.)
- **Replace `<password>` with your actual password** from Step 3
  
  **Example:**
  - Before: `mongodb+srv://incomeuser:<password>@cluster0.abc123.mongodb.net/`
  - After: `mongodb+srv://incomeuser:MySecurePass123@cluster0.abc123.mongodb.net/`
  
- **This is your MONGO_URL for Render!**
- Save this final string - you'll need it in Step 2

### 7. Verify Your Connection String
Your final connection string should look like:
```
mongodb+srv://USERNAME:ACTUAL_PASSWORD@clusterXXXX.mongodb.net/?retryWrites=true&w=majority
```

**Make sure:**
- ✅ `<password>` is replaced with your actual password
- ✅ No spaces in the string
- ✅ Starts with `mongodb+srv://`
- ✅ Contains your username before the `:`
- ✅ Contains your password after the `:`

---

## Step 2: Deploy Backend to Render (10 minutes)

1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repo (you'll need to push code to GitHub first)
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `MONGO_URL` = your connection string from Step 1
   - `DB_NAME` = `income_tracker`
   - `SECRET_KEY` = any random long string (e.g., `abc123xyz789...`)
   - `CORS_ORIGINS` = `*`
6. Click "Create Web Service"
7. Wait 5-10 minutes for deployment
8. **Save your Render URL** (e.g., `https://your-app.onrender.com`)

---

## Step 3: Deploy Frontend to Vercel (10 minutes)

1. Go to https://vercel.com and sign up
2. Click "Add New..." → "Project"
3. Import your GitHub repo
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Create React App
5. Add environment variable:
   - **Key**: `REACT_APP_BACKEND_URL`
   - **Value**: Your Render URL from Step 2
6. Click "Deploy"
7. Wait 2-3 minutes
8. **Your app is live!** You'll get a URL like `https://your-app.vercel.app`

---

## Step 4: Final Touch (2 minutes)

1. Go back to Render
2. Update `CORS_ORIGINS` environment variable to your Vercel URL
3. Service will auto-restart

---

## Done! 🎉

Share your Vercel URL with clients. They can:
- Register accounts
- Track their income
- View monthly/yearly summaries
- Add it to their phone's home screen (PWA)

---

## Before You Deploy - Push to GitHub

```bash
# In your /app directory
git init
git add .
git commit -m "Initial commit - Income Tracker"
git branch -M main

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/income-tracker.git
git push -u origin main
```

---

## Need Help?

See full guide: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## Costs

- **All FREE**: MongoDB (512MB), Render (750 hours/month), Vercel (unlimited)
- Perfect for small businesses with multiple clients

---

## What You'll Need

✅ GitHub account
✅ MongoDB Atlas account (free)
✅ Render account (free)
✅ Vercel account (free)
✅ 30 minutes of your time
