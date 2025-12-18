# Income Tracker - Architecture Overview

This document explains how your app works and how the different pieces connect.

---

## Simple Overview

```
Your Client's Browser
        ↓
   [Frontend - React]
   (Vercel - Free)
   - Login/Register pages
   - Dashboard
   - Income entry forms
   - Monthly/Yearly views
        ↓
   Makes API calls to...
        ↓
   [Backend - FastAPI]
   (Render - Free)
   - Handles authentication
   - Processes income data
   - Calculates totals
        ↓
   Stores/Retrieves data from...
        ↓
   [Database - MongoDB]
   (Atlas - Free)
   - Stores user accounts
   - Stores income entries
   - Stores monthly targets
```

---

## Detailed Architecture

### 1. Frontend (React + PWA)
**Hosted on: Vercel**
**What it does:**
- Displays the user interface (login, dashboard, forms)
- Runs in the user's browser
- Makes HTTP requests to the backend
- Shows real-time calculations and updates
- Works as a Progressive Web App (can be installed on phones)

**Key Files:**
- `src/App.js` - Main app and routing
- `src/components/Login.jsx` - Login page
- `src/components/Register.jsx` - Registration page
- `src/components/Dashboard.jsx` - Main dashboard
- `src/components/MonthlyView.jsx` - Monthly income view
- `src/components/YearlyView.jsx` - 12-month overview

**Technologies:**
- React 19
- React Router (page navigation)
- Axios (API calls)
- Tailwind CSS (styling)
- Shadcn/UI (components)
- Service Worker (PWA functionality)

---

### 2. Backend (FastAPI)
**Hosted on: Render**
**What it does:**
- Receives requests from frontend
- Authenticates users (JWT tokens)
- Validates data
- Performs calculations (totals, YTD, etc.)
- Stores/retrieves data from MongoDB
- Returns JSON responses

**Key File:**
- `server.py` - All backend logic

**API Endpoints:**
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user
- `POST /api/income` - Add income entry
- `GET /api/income?month=X&year=Y` - Get entries
- `DELETE /api/income/{id}` - Delete entry
- `GET /api/income/ytd` - Get year-to-date total
- `GET /api/income/yearly` - Get 12-month summary
- `POST /api/target` - Set monthly target
- `GET /api/target` - Get user's target

**Technologies:**
- FastAPI (Python web framework)
- Pydantic (data validation)
- Motor (async MongoDB driver)
- JWT (authentication tokens)
- Passlib + Bcrypt (password hashing)

---

### 3. Database (MongoDB)
**Hosted on: MongoDB Atlas**
**What it stores:**

#### Collections:

**users** - User accounts
```javascript
{
  id: "uuid",
  email: "user@example.com",
  password_hash: "hashed_password",
  created_at: "2024-11-10T12:00:00Z"
}
```

**income_entries** - Income records
```javascript
{
  id: "uuid",
  user_id: "user_uuid",
  date: "2024-11-10",
  amount: 1500.00,
  source: "Client A",
  month: 11,
  year: 2024,
  created_at: "2024-11-10T12:00:00Z"
}
```

**monthly_targets** - Income targets
```javascript
{
  id: "uuid",
  user_id: "user_uuid",
  monthly_target: 5000.00,
  updated_at: "2024-11-10T12:00:00Z"
}
```

---

## Request Flow Example

### User Adds Income Entry:

1. **User Action:**
   - User fills form: Amount = €1500, Source = "Client A"
   - Clicks "Add Entry" button

2. **Frontend (Browser):**
   - Validates form data
   - Makes POST request to: `https://your-backend.onrender.com/api/income`
   - Sends: `{ date: "2024-11-10", amount: 1500, source: "Client A" }`
   - Includes JWT token in Authorization header

3. **Backend (Render):**
   - Receives request
   - Verifies JWT token (user is logged in)
   - Extracts user_id from token
   - Parses date to get month/year
   - Creates income entry object
   - Saves to MongoDB

4. **Database (MongoDB Atlas):**
   - Stores the new income entry
   - Returns success confirmation

5. **Backend Response:**
   - Sends back the created entry as JSON
   - Status: 200 OK

6. **Frontend Update:**
   - Receives successful response
   - Adds entry to the table
   - Updates monthly total
   - Updates YTD total
   - Shows success message ("Income added!")

**Total time:** ~500ms - 2 seconds (depending on server wake state)

---

## Authentication Flow

### Registration:
```
User → Frontend → Backend → Hash Password → Store in MongoDB → Create JWT → Return to Frontend → Store in LocalStorage
```

### Login:
```
User → Frontend → Backend → Check Email → Verify Password → Create JWT → Return to Frontend → Store in LocalStorage
```

### Authenticated Requests:
```
Frontend → Include JWT in Header → Backend → Verify Token → Process Request → Return Data
```

### Logout:
```
User → Frontend → Remove JWT from LocalStorage → Redirect to Login
```

---

## Data Flow

### Monthly View:
1. User opens dashboard
2. Frontend requests current month data
3. Backend queries MongoDB for entries (month=11, year=2024, user_id=X)
4. Backend calculates total
5. Backend gets user's target
6. Backend calculates remaining (target - total)
7. Returns summary + entries to frontend
8. Frontend displays in table and cards

### YTD Calculation:
1. Frontend requests YTD
2. Backend queries all entries for current year
3. Backend sums all amounts
4. Returns total to frontend
5. Frontend displays in gradient card

### Yearly View:
1. Frontend requests 12-month summary
2. Backend calculates last 12 months from today
3. For each month, backend:
   - Gets entries for that month
   - Calculates total
   - Gets user's target
   - Calculates remaining
4. Returns array of 12 monthly summaries
5. Frontend displays as scrollable cards

---

## Security Features

### Password Security:
- Passwords are **never** stored in plain text
- Hashed using Bcrypt (industry standard)
- Salt is automatically added

### Authentication:
- JWT (JSON Web Tokens) for session management
- Tokens expire (can be configured)
- Stored in browser's localStorage
- Sent with every API request

### Database Security:
- MongoDB user has limited permissions
- Connection uses TLS/SSL encryption
- Network access controlled by IP whitelist

### API Security:
- CORS configured to allow only your frontend
- Protected endpoints require authentication
- Input validation on all endpoints

---

## Scalability

### Current Setup (Free Tier):
- **Users:** Unlimited clients can register
- **Data:** 512MB storage (thousands of entries)
- **Traffic:** Unlimited on Vercel, 750 hours/month on Render
- **Performance:** Good for small businesses (10-100 active users)

### If You Need More:
**Render Paid Plans:**
- Starter ($7/month): No sleep, faster response
- Professional ($25/month): More resources

**MongoDB Paid Plans:**
- M2 ($9/month): 2GB storage
- M5 ($25/month): 5GB storage

**Vercel:**
- Pro ($20/month): Custom domains, better analytics
- Stays free for most use cases

---

## Deployment Environments

### Development (Local):
```
Frontend: http://localhost:3000
Backend: http://localhost:8001
Database: Local MongoDB or Atlas
```

### Production (Deployed):
```
Frontend: https://your-app.vercel.app
Backend: https://your-api.onrender.com
Database: MongoDB Atlas (cloud)
```

---

## Technology Choices - Why?

**React:**
- Fast, modern UI framework
- Component-based (reusable code)
- Large community and resources

**FastAPI:**
- Very fast Python framework
- Auto-generates API documentation
- Easy to write and understand

**MongoDB:**
- Flexible schema (easy to modify)
- Fast for this type of data
- Great free tier

**Vercel:**
- Best for React apps
- Fast global CDN
- Easy deployment

**Render:**
- Great free tier for Python apps
- Auto-deploys from GitHub
- Easy environment variables

---

## Monitoring & Maintenance

### Check These Regularly:

**Vercel Dashboard:**
- Deployment status
- Build logs
- Analytics (traffic)

**Render Dashboard:**
- Service status
- Logs (errors)
- Usage hours

**MongoDB Atlas:**
- Storage usage
- Connection count
- Cluster health

### When to Upgrade:

**Render Free Tier Limits:**
- Service sleeps after 15 min inactivity
- 750 hours/month (about 31 days)
- If you need 24/7 uptime, upgrade to Starter

**MongoDB Free Tier Limits:**
- 512MB storage
- If you hit limit, upgrade to M2

---

## Future Enhancements (Optional)

### Features You Could Add:
- Password reset via email
- Export data to CSV/Excel
- Income categories/tags
- Recurring income entries
- Charts and graphs
- Team/business accounts
- Expense tracking
- Multi-currency support

### Technical Improvements:
- Add Redis for caching
- Implement rate limiting
- Add email notifications
- Set up automated backups
- Add error tracking (Sentry)
- Implement analytics

---

## File Structure Reference

```
/app
├── frontend/
│   ├── src/
│   │   ├── App.js                    # Main app
│   │   ├── components/
│   │   │   ├── Login.jsx             # Login page
│   │   │   ├── Register.jsx          # Register page
│   │   │   ├── Dashboard.jsx         # Dashboard
│   │   │   ├── MonthlyView.jsx       # Monthly view
│   │   │   └── YearlyView.jsx        # Yearly view
│   │   ├── service-worker.js         # PWA service worker
│   │   └── serviceWorkerRegistration.js
│   ├── public/
│   │   ├── manifest.json             # PWA manifest
│   │   └── index.html                # HTML template
│   ├── vercel.json                   # Vercel config
│   └── .env.example                  # Environment template
│
├── backend/
│   ├── server.py                     # Backend API
│   ├── requirements.txt              # Python dependencies
│   ├── render.yaml                   # Render config
│   └── .env.example                  # Environment template
│
├── DEPLOYMENT_GUIDE.md               # Full deployment guide
├── QUICK_START.md                    # Quick deploy steps
├── DEPLOYMENT_CHECKLIST.md           # Deployment checklist
├── TROUBLESHOOTING.md                # Common issues
├── ARCHITECTURE.md                   # This file
└── README.md                         # Project overview
```

---

## Support & Resources

**Documentation:**
- React: https://react.dev
- FastAPI: https://fastapi.tiangolo.com
- MongoDB: https://docs.mongodb.com

**Deployment Platforms:**
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com

---

**This architecture provides a solid, scalable foundation for your income tracking app that can grow with your business!**
