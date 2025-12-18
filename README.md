# Income Tracker App

A beautiful, mobile-friendly income tracking application with authentication, monthly/yearly views, and target setting.

## Features

✅ User authentication (email/password)
✅ Add income entries (date, amount, source)
✅ Monthly income view with navigation
✅ Year-to-date (YTD) totals
✅ 12-month scrollable overview
✅ Monthly target setting
✅ Real-time calculations
✅ Mobile responsive design
✅ PWA support (add to home screen)
✅ Calm, women-friendly UI design

## Tech Stack

**Frontend:**
- React 19
- Tailwind CSS
- Shadcn/UI components
- PWA enabled

**Backend:**
- FastAPI (Python)
- JWT authentication
- MongoDB database

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB

### Setup

1. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your MongoDB connection
uvicorn server:app --reload --port 8001
```

2. **Frontend Setup**
```bash
cd frontend
yarn install
cp .env.example .env
# Edit .env with your backend URL
yarn start
```

3. **Access**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001
- API Docs: http://localhost:8001/docs

## Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete deployment instructions to:
- Frontend: Vercel (Free)
- Backend: Render (Free)
- Database: MongoDB Atlas (Free)

## Quick Deploy Summary

1. **MongoDB Atlas**: Create free cluster, get connection string
2. **Render**: Deploy backend with MongoDB URL
3. **Vercel**: Deploy frontend with backend URL
4. **Update CORS**: Add Vercel URL to backend CORS settings

## Project Structure

```
/app
├── backend/              # FastAPI backend
│   ├── server.py        # Main API file
│   ├── requirements.txt # Python dependencies
│   ├── render.yaml      # Render deployment config
│   └── .env.example     # Environment variables template
│
├── frontend/            # React frontend
│   ├── src/
│   │   ├── App.js      # Main app component
│   │   ├── components/ # React components
│   │   └── service-worker.js # PWA service worker
│   ├── public/
│   │   └── manifest.json # PWA manifest
│   ├── vercel.json     # Vercel deployment config
│   └── .env.example    # Environment variables template
│
└── DEPLOYMENT_GUIDE.md  # Detailed deployment guide
```

## Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb+srv://...
DB_NAME=income_tracker
SECRET_KEY=your-secret-key
CORS_ORIGINS=https://your-app.vercel.app
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=https://your-api.onrender.com
```

## Features Overview

### Authentication
- Secure JWT-based authentication
- Email/password registration and login
- Protected routes

### Income Tracking
- Add entries with date, amount, and source
- View monthly breakdown
- Delete entries
- Real-time total calculations

### Monthly View
- Current month income summary
- Total, target, and remaining amounts
- Navigate between months
- Spreadsheet-style entry table

### Yearly View
- Last 12 months overview
- Scrollable month cards
- Progress bars for each month
- Target achievement status

### Design
- Soft gradients (rose, purple, teal)
- Glassmorphism effects
- Rounded corners and smooth animations
- Manrope font for readability
- Mobile-first responsive design

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Income
- `POST /api/income` - Add income entry
- `GET /api/income?month=X&year=Y` - Get monthly entries
- `DELETE /api/income/{id}` - Delete entry
- `GET /api/income/monthly-summary` - Get month summary
- `GET /api/income/ytd` - Get year-to-date total
- `GET /api/income/yearly` - Get 12-month summary

### Targets
- `POST /api/target` - Set monthly target
- `GET /api/target` - Get user's target

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome)

## PWA Features

- Add to home screen
- Offline support (basic)
- App-like experience on mobile
- Custom splash screen

## License

MIT

## Support

For deployment help, see DEPLOYMENT_GUIDE.md
