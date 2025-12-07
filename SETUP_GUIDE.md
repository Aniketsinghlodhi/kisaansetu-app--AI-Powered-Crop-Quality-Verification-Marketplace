# 🌾 KisaanSetu-App - Complete Setup & Run Guide

## 📋 Project Overview

KisaanSetu-App is an AI-powered agricultural marketplace connecting farmers with buyers through:
- **AI Crop Grading**: Automatic quality verification
- **Fair Bidding System**: Transparent auction mechanism
- **Secure Marketplace**: Direct farmer-buyer connection
- **Wallet System**: Mock payment integration

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- MongoDB Atlas account (free tier okay)
- Git

### Step 1: Clone & Install

```bash
# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
```

### Step 2: Configure Environment Variables

**Backend** (`backend/.env` - Already created):
```
PORT=5000
MONGODB_URI=mongodb+srv://test:test123@cluster0.mongodb.net/kisaansetu?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-change-this-in-production-12345
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env.local` - Already created):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 3: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Output: ✅ Backend server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Output: ✅ Ready in X.Xs on http://localhost:3000
```

### Step 4: Open in Browser
```
http://localhost:3000
```

---

## 📊 Demo Credentials

### Test Account (Farmer)
- **Mobile**: `9876543210`
- **Password**: `password123`

### Test Account (Buyer)
- **Mobile**: `9123456789`
- **Password**: `password123`

---

## 🏗️ Project Architecture

```
kisaansetu-app/
├── backend/                 # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── models/         # Mongoose schemas
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth, validation
│   │   └── server.js       # Entry point
│   ├── .env                # Environment variables
│   └── package.json        # Dependencies
│
├── frontend/                # Next.js 14 + React 19 + Tailwind CSS
│   ├── src/
│   │   ├── app/            # App router pages
│   │   ├── components/     # Reusable components
│   │   ├── services/       # API client
│   │   ├── hooks/          # Custom hooks
│   │   ├── context/        # Auth context
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utilities
│   ├── .env.local          # Environment variables
│   └── package.json        # Dependencies
│
└── docs/                    # Documentation
```

---

## 🛣️ API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Crops
- `POST /api/crops` - List new crop (protected, farmers only)
- `GET /api/crops` - Get all active crops
- `GET /api/crops/:id` - Get crop details
- `GET /api/crops/farmer/my-crops` - Get farmer's crops (protected)
- `PUT /api/crops/:id` - Update crop (protected, owner only)
- `DELETE /api/crops/:id` - Delete crop (protected, owner only)

### Bids
- `POST /api/bids` - Place bid (protected, buyers only)
- `GET /api/bids/my/bids` - Get user's bids (protected)
- `GET /api/bids/crop/:cropId/bids` - Get bids for crop
- `GET /api/bids/crop/:cropId/highest` - Get highest bid for crop

---

## 🎨 Frontend Pages

| Route | Purpose | Role | Status |
|-------|---------|------|--------|
| `/` | Welcome page | All | ✅ Complete |
| `/auth/login` | Login | All | ✅ Complete |
| `/auth/signup` | Sign up | All | ✅ Complete |
| `/farmer/dashboard` | Dashboard | Farmer | ✅ Complete |
| `/farmer/new-listing` | List crop | Farmer | ✅ Complete |
| `/farmer/my-crops` | View crops | Farmer | ✅ Complete |
| `/buyer/marketplace` | Browse crops | Buyer | ✅ Complete |
| `/buyer/my-bids` | View bids | Buyer | ✅ Complete |
| `/crop/:id` | Crop details | All | ✅ Complete |
| `/profile` | User profile | Authenticated | ✅ Complete |

---

## 📦 Database Schema

### User
```javascript
{
  _id: ObjectId,
  name: String,
  mobile: String (unique),
  email: String (optional),
  passwordHash: String (bcrypt),
  role: Enum("farmer", "buyer"),
  location: String,
  walletBalance: Number,
  profileImage: String (optional),
  rating: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Crop
```javascript
{
  _id: ObjectId,
  farmerId: ObjectId (ref: User),
  cropName: String,
  category: String,
  quantity: Number,
  unit: String,
  basePrice: Number,
  imageUrl: String,
  aiGrade: String (A/B/C),
  qualityScore: Number,
  location: String,
  description: String,
  status: Enum("active", "sold", "expired"),
  currentBid: Number,
  bidCount: Number,
  highestBidder: ObjectId,
  createdAt: Date
}
```

### Bid
```javascript
{
  _id: ObjectId,
  cropId: ObjectId (ref: Crop),
  buyerId: ObjectId (ref: User),
  bidAmount: Number,
  status: Enum("active", "won", "lost"),
  createdAt: Date
}
```

---

## 🔐 Authentication Flow

1. **Signup**:
   - User enters credentials
   - Password hashed with bcrypt (10 rounds)
   - User saved to MongoDB
   - JWT token generated
   - Token stored in localStorage

2. **Login**:
   - User enters mobile + password
   - Password compared with hash
   - JWT token generated and returned
   - Token used for subsequent requests

3. **Protected Routes**:
   - Token extracted from `Authorization` header
   - Token verified with `JWT_SECRET`
   - User ID and role attached to request
   - Specific role checks applied (e.g., farmers only for crop creation)

---

## 🚀 Deployment Options

### Frontend (Vercel - Recommended)
```bash
# Deploy via Vercel CLI
npm i -g vercel
cd frontend
vercel
```

### Backend (Railway / Render)
```bash
# Railway
railway login
railway link
railway up

# Render
# Connect GitHub repo to render.com
```

### Database (MongoDB Atlas)
- Already using free tier cluster
- Add your IP to network access
- Update connection string if needed

---

## 🐛 Troubleshooting

### Issue: Cannot connect to MongoDB
**Solution**: 
- Check internet connection
- Verify IP is whitelisted in MongoDB Atlas
- Ensure `MONGODB_URI` is correct

### Issue: Signup/Login not working
**Solution**:
- Restart both backend and frontend
- Clear localStorage: `localStorage.clear()`
- Check browser console for errors

### Issue: CORS errors
**Solution**:
- Ensure backend is running on `:5000`
- Ensure frontend is running on `:3000`
- Check `FRONTEND_URL` in backend `.env`

### Issue: Crops not showing after creation
**Solution**:
- Refresh the page
- Check browser DevTools Network tab
- Verify crop was saved: Check MongoDB

---

## 📋 Features Implemented

### Phase 1: Auth & Setup ✅
- User registration (Farmer/Buyer)
- User login with JWT
- Password hashing with bcrypt
- Protected routes

### Phase 2: Welcome & UI ✅
- Landing page with hero section
- Features showcase
- Navigation bar
- Responsive design

### Phase 3: Farmer Dashboard ✅
- Dashboard with stats
- Create crop listings
- View my crops
- Crop management

### Phase 4: Buyer Marketplace ✅
- Browse all crops
- Search and filters
- Place bids
- View bid history
- My bids page

### Phase 5: Crop Details ✅
- Crop information display
- Bid history
- AI grade visualization
- Real-time bid updates

---

## 💡 How to Extend

### Add Real Payments
```javascript
// Integrate Stripe/Razorpay
const stripe = require('stripe')(process.env.STRIPE_KEY);
```

### Add Real Image Upload
```javascript
// Use Cloudinary or AWS S3
const cloudinary = require('cloudinary');
```

### Add WebSocket Real-time Bids
```javascript
// Use Socket.io
const io = require('socket.io');
```

### Add Email Notifications
```javascript
// Use SendGrid/Nodemailer
const nodemailer = require('nodemailer');
```

---

## 📞 Support

- **Documentation**: Check `/docs` folder
- **Issues**: Create GitHub issues
- **Questions**: Check README sections above

---

## 📜 License

This project is built for **24-hour hackathon**. Use freely for educational purposes.

---

## 🎉 Created with ❤️ for Indian Farmers

**KisaanSetu-App** - Empowering farmers through technology!

Happy coding! 🚀
