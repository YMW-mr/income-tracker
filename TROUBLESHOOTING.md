# Troubleshooting Guide

Common issues and solutions when deploying your Income Tracker app.

---

## MongoDB Atlas Issues

### ❌ "Authentication failed" or "Bad auth"

**Problem**: Wrong username or password in connection string

**Solution**:
1. Go to MongoDB Atlas dashboard
2. Click "Database Access" in left sidebar
3. Verify your username
4. If unsure, click "Edit" on the user and reset password
5. Update your connection string with correct credentials
6. Make sure to replace `<password>` with actual password (no `<` or `>` symbols)

**Example of WRONG connection string:**
```
mongodb+srv://incomeuser:<password>@cluster0.abc123.mongodb.net/
```

**Example of CORRECT connection string:**
```
mongodb+srv://incomeuser:MyActualPass123@cluster0.abc123.mongodb.net/
```

---

### ❌ "Connection timeout" or "Could not connect to server"

**Problem**: IP address not whitelisted

**Solution**:
1. Go to MongoDB Atlas dashboard
2. Click "Network Access" in left sidebar
3. Make sure you see `0.0.0.0/0` in the list
4. If not, click "Add IP Address"
5. Choose "Allow Access from Anywhere"
6. Click "Confirm"
7. Wait 1-2 minutes for changes to take effect

---

### ❌ How to find my connection string again?

**Solution**:
1. Go to MongoDB Atlas dashboard
2. Click "Database" in left sidebar
3. Click "Connect" button on your cluster
4. Choose "Drivers"
5. Copy the connection string
6. Replace `<password>` with your actual password

---

## Render Backend Issues

### ❌ "Application failed to start"

**Problem**: Missing environment variables or wrong configuration

**Solution**:
1. Go to your Render dashboard
2. Click on your web service
3. Go to "Environment" tab
4. Verify these variables exist:
   - `MONGO_URL` - Your full MongoDB connection string
   - `DB_NAME` - Should be `income_tracker`
   - `SECRET_KEY` - Any long random string
   - `CORS_ORIGINS` - Your Vercel URL or `*` for testing
5. Check "Logs" tab for specific error messages

---

### ❌ Backend URL returns "Not Found" or "502 Bad Gateway"

**Problem**: Service might be sleeping (free tier) or not fully deployed

**Solution**:
1. Free tier services sleep after 15 minutes of inactivity
2. First request after sleep takes 30-60 seconds to wake up
3. Check "Events" tab to see if deployment succeeded
4. Visit: `https://your-backend.onrender.com/docs` to test
5. If you see API documentation, backend is working!

---

### ❌ "Command not found: uvicorn"

**Problem**: Build command not running correctly

**Solution**:
1. In Render dashboard, go to your service settings
2. Verify "Build Command" is: `pip install -r requirements.txt`
3. Verify "Start Command" is: `uvicorn server:app --host 0.0.0.0 --port $PORT`
4. Make sure "Root Directory" is set to `backend`
5. Trigger manual redeploy

---

## Vercel Frontend Issues

### ❌ Frontend shows "Loading..." forever

**Problem**: Frontend can't connect to backend

**Solution**:
1. Open browser developer console (F12)
2. Look for red errors
3. Check if `REACT_APP_BACKEND_URL` is set correctly
4. In Vercel dashboard:
   - Go to project settings
   - Click "Environment Variables"
   - Verify `REACT_APP_BACKEND_URL` = your Render backend URL
   - Should be: `https://your-api.onrender.com` (no trailing slash)
5. Redeploy frontend after changing variables

---

### ❌ CORS Error: "Access blocked by CORS policy"

**Problem**: Backend CORS settings don't include frontend URL

**Solution**:
1. Go to Render dashboard (backend service)
2. Go to "Environment" tab
3. Update `CORS_ORIGINS` to include your Vercel URL
4. Example: `https://your-app.vercel.app`
5. For multiple origins, separate with commas: `https://app1.vercel.app,https://app2.vercel.app`
6. Service will auto-restart
7. Wait 1-2 minutes and try again

---

### ❌ Build fails on Vercel

**Problem**: Missing dependencies or wrong configuration

**Solution**:
1. Check "Root Directory" is set to `frontend`
2. Check "Framework Preset" is "Create React App"
3. Build command should be auto-detected as `yarn build`
4. Output directory should be `build`
5. Check build logs for specific errors
6. Common issue: Make sure all dependencies are in package.json

---

## App Functionality Issues

### ❌ "Invalid credentials" when trying to login

**Problem**: User doesn't exist or wrong password

**Solution**:
1. Make sure you registered an account first (click "Sign Up")
2. Use exact email and password
3. Password is case-sensitive
4. If you forgot password, you'll need to register a new account (no password reset yet)

---

### ❌ Data not saving or disappearing

**Problem**: Database connection issue

**Solution**:
1. Check backend logs in Render dashboard
2. Verify MongoDB connection string is correct
3. Check MongoDB Atlas cluster is running (not paused)
4. Free MongoDB clusters may pause after 60 days of inactivity

---

### ❌ YTD or monthly totals showing €0.00 even after adding entries

**Problem**: Entries saved but calculations might be cached

**Solution**:
1. Try refreshing the page (F5)
2. Check if entries appear in the table
3. Navigate to next/previous month and back
4. Log out and log back in
5. Check browser console for errors

---

## GitHub Push Issues

### ❌ "Permission denied" when pushing to GitHub

**Solution**:
```bash
# Use personal access token instead of password
# Create token at: https://github.com/settings/tokens
# Then use:
git remote set-url origin https://YOUR_USERNAME@github.com/YOUR_USERNAME/income-tracker.git
git push
# Enter token as password when prompted
```

---

### ❌ Large files preventing push

**Solution**:
```bash
# Make sure .gitignore is working
# Remove node_modules and __pycache__ from git:
git rm -r --cached node_modules
git rm -r --cached __pycache__
git commit -m "Remove large files"
git push
```

---

## Testing Your Deployment

### ✅ Test Backend is Working

1. Visit: `https://your-backend.onrender.com/docs`
2. You should see FastAPI documentation
3. Try the `/api/auth/register` endpoint
4. If it works, backend is good!

### ✅ Test Frontend is Working

1. Visit: `https://your-app.vercel.app`
2. You should see the login page
3. Try registering an account
4. If you can register and login, everything works!

### ✅ Test Full Integration

1. Register a new account
2. Set a monthly target (e.g., €5000)
3. Add 2-3 income entries
4. Check if totals update
5. Navigate to yearly view
6. If all works, you're done! 🎉

---

## Still Having Issues?

### Check These Common Mistakes:

1. ❌ Connection string still has `<password>` instead of actual password
2. ❌ Backend URL has trailing slash (should be `https://api.com` not `https://api.com/`)
3. ❌ CORS_ORIGINS in backend doesn't match frontend URL
4. ❌ Forgot to redeploy after changing environment variables
5. ❌ Used HTTP instead of HTTPS in URLs
6. ❌ Network Access in MongoDB doesn't include 0.0.0.0/0

### Get Help:

- **Render Support**: https://render.com/docs
- **Vercel Support**: https://vercel.com/docs
- **MongoDB Support**: https://docs.mongodb.com/

---

## Quick Checklist

Before asking for help, verify:

- [ ] MongoDB cluster is running and accessible
- [ ] Connection string has actual password (not `<password>`)
- [ ] Backend deployed successfully on Render
- [ ] Backend URL ends without trailing slash
- [ ] Frontend deployed successfully on Vercel
- [ ] `REACT_APP_BACKEND_URL` set in Vercel
- [ ] `CORS_ORIGINS` includes frontend URL in Render
- [ ] Both services show "Deployed" status
- [ ] Browser console shows no red errors
- [ ] Tried in incognito/private browsing mode

---

## Environment Variables Reference

### Backend (Render)
```
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=income_tracker
SECRET_KEY=any-long-random-string-here-make-it-secure
CORS_ORIGINS=https://your-app.vercel.app
```

### Frontend (Vercel)
```
REACT_APP_BACKEND_URL=https://your-backend.onrender.com
```

**IMPORTANT**: No trailing slashes on URLs!
