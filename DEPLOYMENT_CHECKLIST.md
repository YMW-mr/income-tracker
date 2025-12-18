# Deployment Checklist

Use this checklist to ensure you don't miss any steps when deploying your Income Tracker app.

---

## Pre-Deployment Checklist

- [ ] Code is working locally
- [ ] All features tested
- [ ] Created GitHub account
- [ ] Code pushed to GitHub repository

---

## MongoDB Atlas Setup ✅

- [ ] Created MongoDB Atlas account
- [ ] Created FREE M0 cluster
- [ ] Cluster is fully deployed (green checkmark)
- [ ] Created database user with username
- [ ] Saved database password securely
- [ ] Added IP address 0.0.0.0/0 to Network Access
- [ ] Got connection string
- [ ] Replaced `<password>` with actual password in connection string
- [ ] Connection string saved in safe place (Notepad, password manager, etc.)

**Your MongoDB Connection String:**
```
mongodb+srv://___________:___________@cluster______.mongodb.net/?retryWrites=true&w=majority
```

---

## Render Backend Deployment ✅

- [ ] Created Render account
- [ ] Connected GitHub repository
- [ ] Created new Web Service
- [ ] Selected correct GitHub repository
- [ ] Set Root Directory to `backend`
- [ ] Set Build Command to `pip install -r requirements.txt`
- [ ] Set Start Command to `uvicorn server:app --host 0.0.0.0 --port $PORT`
- [ ] Selected FREE plan
- [ ] Added environment variable: `MONGO_URL`
- [ ] Added environment variable: `DB_NAME` = `income_tracker`
- [ ] Added environment variable: `SECRET_KEY` (random string)
- [ ] Added environment variable: `CORS_ORIGINS` = `*` (temporary)
- [ ] Clicked "Create Web Service"
- [ ] Waited for deployment to complete
- [ ] Service status shows "Live" (green)
- [ ] Tested backend: Visited `https://your-backend.onrender.com/docs`
- [ ] API documentation loads successfully

**Your Render Backend URL:**
```
https://_________________________________.onrender.com
```

---

## Vercel Frontend Deployment ✅

- [ ] Created Vercel account
- [ ] Connected GitHub repository
- [ ] Imported project from GitHub
- [ ] Set Root Directory to `frontend`
- [ ] Framework detected as "Create React App"
- [ ] Build Command auto-detected as `yarn build`
- [ ] Output Directory auto-detected as `build`
- [ ] Added environment variable: `REACT_APP_BACKEND_URL` = Render backend URL
- [ ] Made sure backend URL has NO trailing slash
- [ ] Clicked "Deploy"
- [ ] Waited for deployment to complete
- [ ] Deployment status shows "Ready"
- [ ] Visited frontend URL
- [ ] Login page loads with correct design

**Your Vercel Frontend URL:**
```
https://_________________________________.vercel.app
```

---

## Final Configuration ✅

- [ ] Went back to Render backend settings
- [ ] Updated `CORS_ORIGINS` from `*` to your Vercel URL
- [ ] Example: `https://your-app.vercel.app`
- [ ] Saved changes
- [ ] Backend automatically redeployed
- [ ] Waited 2-3 minutes for changes to take effect

---

## Testing Checklist ✅

### Backend Testing
- [ ] Visit `https://your-backend.onrender.com/docs`
- [ ] API documentation page loads
- [ ] Try `/api/auth/register` endpoint (optional)

### Frontend Testing
- [ ] Visit your Vercel URL
- [ ] Login page loads with proper styling
- [ ] Gradients and colors look correct
- [ ] Clicked "Sign Up"
- [ ] Registration form appears
- [ ] Registered test account with email and password
- [ ] Successfully logged in
- [ ] Dashboard loads with all components

### Feature Testing
- [ ] Clicked "Set Target" button
- [ ] Set monthly target (e.g., €5000)
- [ ] Target saved successfully
- [ ] YTD card shows €0.00 initially
- [ ] Clicked "Add Income Entry"
- [ ] Added first entry with amount and source
- [ ] Entry appears in table
- [ ] Monthly total updates correctly
- [ ] Remaining amount calculated correctly
- [ ] YTD total updates
- [ ] Added 2-3 more entries
- [ ] All entries visible in table
- [ ] Clicked "12-Month View" tab
- [ ] Yearly view loads with month cards
- [ ] Current month shows correct total
- [ ] Progress bars display correctly
- [ ] Clicked arrows to scroll through months
- [ ] Deleted an entry (trash icon)
- [ ] Entry removed and totals updated
- [ ] Navigated to previous/next month
- [ ] Logged out
- [ ] Logged back in
- [ ] All data still present

### Mobile Testing
- [ ] Opened app on mobile device or browser mobile view
- [ ] Layout responsive and readable
- [ ] Can scroll and tap all buttons
- [ ] Forms work correctly
- [ ] Tables are scrollable on small screens

---

## Optional Enhancements ✅

- [ ] Add custom domain to Vercel
- [ ] Add custom domain to Render backend
- [ ] Update CORS settings with new domain
- [ ] Update favicon and logos (logo192.png, logo512.png)
- [ ] Test PWA "Add to Home Screen" on mobile
- [ ] Share app URL with first test client
- [ ] Get feedback from test user

---

## Maintenance Checklist (Monthly)

- [ ] Check Render service is still running
- [ ] Check MongoDB Atlas cluster is active
- [ ] Verify no unexpected charges
- [ ] Check if any security updates needed
- [ ] Monitor error logs if issues reported

---

## URLs Summary

Fill in your deployment URLs:

| Service | URL |
|---------|-----|
| **Frontend (Share this!)** | https://_________________.vercel.app |
| **Backend API** | https://_________________.onrender.com |
| **Backend API Docs** | https://_________________.onrender.com/docs |
| **MongoDB Cluster** | Atlas Dashboard |

---

## Credentials Summary

Store these securely (password manager recommended):

| Item | Value |
|------|-------|
| MongoDB Username | _________________ |
| MongoDB Password | _________________ |
| MongoDB Connection String | mongodb+srv://... |
| Backend Secret Key | _________________ |
| GitHub Repository | github.com/______/______ |

---

## Deployment Status

Mark your status:

- [ ] 🔴 Not Started
- [ ] 🟡 In Progress
- [ ] 🟢 Completed & Working
- [ ] 🎉 Shared with Clients

---

## Common Issues Checklist

If something's not working, verify:

- [ ] MongoDB connection string has actual password (not `<password>`)
- [ ] Backend URL in Vercel has NO trailing slash
- [ ] CORS_ORIGINS in backend includes your Vercel URL
- [ ] All environment variables are saved and services redeployed
- [ ] Both services show "Live" or "Ready" status
- [ ] Browser console (F12) shows no red errors
- [ ] Tried in private/incognito browser window

---

## Next Steps After Deployment

1. **Test thoroughly** - Try all features multiple times
2. **Create test accounts** - Make 2-3 test users
3. **Test on mobile** - Open on your phone
4. **Share with beta user** - Get feedback from 1 trusted person
5. **Fix any issues** - Address problems before wider release
6. **Document for clients** - Create simple user guide if needed
7. **Launch** - Share URL with all clients! 🚀

---

## Success Criteria

Your deployment is successful when:

✅ You can register a new account
✅ You can login successfully  
✅ You can set a monthly target
✅ You can add income entries
✅ Totals calculate correctly
✅ YTD shows proper sum
✅ Yearly view displays all months
✅ You can delete entries
✅ You can logout and login again
✅ Data persists between sessions
✅ Works on both desktop and mobile
✅ You can share the URL with clients

---

**When all items are checked, your app is live and ready! 🎉**

Share your Vercel URL with clients and start tracking income!
