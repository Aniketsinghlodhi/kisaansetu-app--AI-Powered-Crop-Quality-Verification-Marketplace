# 📦 KisaanSetu-App - Complete Installation Guide

## Choose Your Setup Method

### Option 1: Local Setup (Recommended for Development)
### Option 2: Docker Setup (Easiest, Recommended for Testing)

---

## ⚡ Option 1: Local Setup

### Prerequisites
- **Node.js** 18+ (download: https://nodejs.org/)
- **MongoDB** (download: https://www.mongodb.com/try/download/community)
- **Git**

### Step 1: Install MongoDB Locally

#### macOS (Using Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

Verify MongoDB is running:
```bash
mongosh
> show databases
> exit
```

#### Windows
1. Download from: https://www.mongodb.com/try/download/community
2. Run installer
3. Follow default installation
4. MongoDB should start automatically

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### Step 2: Clone Repository & Install Dependencies

```bash
# Clone or navigate to project
cd /Users/aniketlodhi/developer/kisaansetu-app

# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
```

### Step 3: Verify Environment Files

#### Backend `.env` should contain:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kisaansetu
JWT_SECRET=your-super-secret-key-change-this-in-production-12345
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### Frontend `.env.local` should contain:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 4: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev

# Expected output:
# ╔════════════════════════════════════════╗
# ║   ✅ KisaanSetu-App Backend Running    ║
# ║   URL: http://localhost:5000           ║
# ║   Environment: development              ║
# ╚════════════════════════════════════════╝
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev

# Expected output:
# ▲ Next.js 16.0.7
# - Local:        http://localhost:3000
```

### Step 5: Open in Browser
```
http://localhost:3000
```

---

## 🐳 Option 2: Docker Setup (Easiest)

### Prerequisites
- **Docker** (download: https://www.docker.com/products/docker-desktop)
- **Docker Compose** (included with Docker Desktop)

### Step 1: Start with Docker Compose

```bash
# Navigate to project root
cd /Users/aniketlodhi/developer/kisaansetu-app

# Start all services
docker-compose up --build

# This will:
# 1. Create MongoDB container
# 2. Build and start Backend
# 3. Build and start Frontend
```

### Step 2: Wait for Services to Start

```
✅ MongoDB: localhost:27017
✅ Backend: http://localhost:5000
✅ Frontend: http://localhost:3000
```

### Step 3: Open in Browser
```
http://localhost:3000
```

### Useful Docker Commands

```bash
# View logs
docker-compose logs

# Stop services
docker-compose down

# Remove data
docker-compose down -v

# Rebuild containers
docker-compose up --build
```

---

## 🔑 Test Accounts (Pre-created)

### Account 1: Farmer
- **Mobile**: `9876543210`
- **Password**: `password123`
- **Type**: Can list crops, view bids

### Account 2: Buyer
- **Mobile**: `9123456789`
- **Password**: `password123`
- **Type**: Can browse crops, place bids

### Create New Accounts
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Choose role (Farmer or Buyer)
4. Fill in details
5. Click "Sign Up"

---

## ✅ Verify Installation

### Backend Check
```bash
curl http://localhost:5000/health
# Expected response:
# {"status":"OK","message":"Server is running","timestamp":"2025-01-07T..."}
```

### Frontend Check
1. Open http://localhost:3000 in browser
2. You should see the landing page with "🌾 KisaanSetu-App" logo
3. Navigation should work

### Database Check

#### Option A: Using MongoDB Compass (GUI)
1. Download: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. Should see `kisaansetu` database

#### Option B: Using mongosh (CLI)
```bash
mongosh
> use kisaansetu
> show collections
> db.users.find().pretty()
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to MongoDB"

**Cause**: MongoDB is not running

**Solution**:
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Check Services → MongoDB Server status
```

### Issue: "Port 3000 already in use"

**Cause**: Another application using port 3000

**Solution**:
```bash
# macOS/Linux - Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Windows - Change frontend port
# In frontend, edit package.json scripts:
# "dev": "next dev -p 3001"
```

### Issue: "Port 5000 already in use"

**Cause**: Another application using port 5000

**Solution**:
```bash
# Change backend port in .env
PORT=5001

# Update frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### Issue: "CORS errors in browser"

**Cause**: Backend not running or wrong URL

**Solution**:
1. Verify backend is running on http://localhost:5000
2. Check frontend `.env.local` has correct API URL
3. Restart frontend: `npm run dev`

### Issue: "Signup/Login not working"

**Cause**: Database issue or backend error

**Solution**:
1. Check backend console for errors
2. Verify MongoDB is running
3. Clear browser localStorage: Press F12 → Console → `localStorage.clear()`
4. Refresh page

### Issue: "Crops not showing after creation"

**Cause**: API communication issue

**Solution**:
1. Check browser Network tab (F12)
2. Look for failed requests
3. Restart both servers
4. Check backend logs for errors

---

## 🚀 Next Steps After Installation

### 1. Explore Features
- [ ] Sign up as Farmer
- [ ] List a crop
- [ ] Sign up as Buyer  
- [ ] Browse marketplace
- [ ] Place a bid
- [ ] View bid history

### 2. Test Different Scenarios
- [ ] Create multiple crops
- [ ] Place multiple bids
- [ ] Check dashboard stats
- [ ] View profile

### 3. Check Database
```bash
mongosh
> use kisaansetu
> db.users.countDocuments()
> db.crops.countDocuments()
> db.bids.countDocuments()
```

---

## 📝 Production Deployment

### Important: Change These Before Deploying!

1. **JWT_SECRET** in backend `.env`
   ```env
   JWT_SECRET=generate-a-long-random-key-here
   ```

2. **MongoDB Connection**
   ```env
   MONGODB_URI=your-production-mongodb-url
   ```

3. **Frontend API URL**
   ```env
   NEXT_PUBLIC_API_URL=your-production-backend-url
   ```

### Deploy Backend

**Option A: Railway (Recommended)**
```bash
npm i -g railway
cd backend
railway link
railway up
```

**Option B: Render**
- Connect GitHub repo to render.com
- Set environment variables
- Deploy

### Deploy Frontend

**Option A: Vercel (Recommended)**
```bash
npm i -g vercel
cd frontend
vercel
```

**Option B: Netlify**
- Connect GitHub repo to netlify.com
- Set environment variables
- Deploy

---

## 📞 Need Help?

### Check Logs
```bash
# Backend errors
cd backend
npm run dev

# Frontend errors
cd frontend
npm run dev

# Check browser console: F12 → Console tab
```

### Common Issues
- MongoDB not running → Start MongoDB service
- Port conflicts → Change port in `.env`
- CORS errors → Check API URL in frontend `.env.local`
- Authentication issues → Clear localStorage

### Resources
- MongoDB Docs: https://docs.mongodb.com/
- Next.js Docs: https://nextjs.org/docs
- Express Docs: https://expressjs.com/
- React Docs: https://react.dev/

---

## 🎉 Success!

If you see the landing page at http://localhost:3000, **congratulations!** 🎊

You now have a fully functional AI-powered crop marketplace running locally.

Happy coding! 🚀
