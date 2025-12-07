# 👨‍💻 KisaanSetu-App - Developer Notes & Maintenance Guide

## Overview

This document contains important notes for developers maintaining and extending KisaanSetu-App.

---

## System Dependencies

### Required Software

```bash
Node.js:     v18.17+ (check: node --version)
npm:         v9.0+    (check: npm --version)
MongoDB:     v7.0+    (check: mongod --version)
Git:         v2.0+    (check: git --version)
```

### Installing Dependencies

**macOS**:
```bash
brew install node mongodb-community git
brew services start mongodb-community
```

**Ubuntu/Debian**:
```bash
sudo apt update
sudo apt install nodejs npm git
curl https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt install mongodb-org
sudo systemctl start mongod
```

**Windows** (using Chocolatey):
```bash
choco install nodejs mongodb-community git
mongod  # Start MongoDB in separate terminal
```

---

## Code Organization & Patterns

### Backend Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js         # DB connection (SINGLE RESPONSIBILITY)
│   │
│   ├── models/                 # Data schemas (SCHEMA DEFINITIONS)
│   │   ├── User.js             # User schema with validation
│   │   ├── Crop.js             # Crop schema with indexes
│   │   └── Bid.js              # Bid schema relationships
│   │
│   ├── controllers/            # Business logic (CORE LOGIC)
│   │   ├── authController.js   # Auth: signup, login, profile
│   │   ├── cropController.js   # Crops: CRUD, search, farmer-specific
│   │   └── bidController.js    # Bids: place, retrieve, validate
│   │
│   ├── middleware/             # Request processing (CROSS-CUTTING)
│   │   └── auth.js             # JWT verification
│   │
│   ├── routes/                 # URL mapping (ENDPOINT ROUTING)
│   │   ├── auth.js
│   │   ├── crops.js
│   │   ├── bids.js
│   │   └── index.js            # Route aggregator
│   │
│   └── server.js               # Express app setup (ENTRY POINT)
│
├── .env                        # Configuration (DO NOT COMMIT)
├── package.json
└── node_modules/
```

### Design Patterns Used

#### 1. MVC (Model-View-Controller)
```
Models    → Database layer (Mongoose schemas)
Views     → JSON responses (implicit)
Controllers → Business logic
Routes    → URL routing & method mapping
```

#### 2. Middleware Pattern
```
Request → Auth Middleware → Controller → Response
```

#### 3. Repository/Service Pattern (Implicit)
```
Controllers use models directly as repositories
Example: User.findById() acts as repository
```

### Code Standards

#### Controller Template
```javascript
// GOOD: Clear structure
const getFunction = async (req, res) => {
  try {
    // 1. Validate input
    const { id } = req.params;
    if (!id) return res.status(400).json({...});
    
    // 2. Fetch data
    const data = await Model.findById(id);
    if (!data) return res.status(404).json({...});
    
    // 3. Business logic
    const result = processData(data);
    
    // 4. Return response
    res.json({ success: true, data: result });
  } catch (error) {
    // 5. Error handling
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getFunction };
```

#### Route Template
```javascript
const router = require('express').Router();
const { controller } = require('../controllers/nameController');
const auth = require('../middleware/auth');

// Public route
router.get('/', controller.getAll);

// Protected route (auth required)
router.post('/', auth, controller.create);

// Admin only
router.delete('/:id', auth, requireAdmin, controller.delete);

module.exports = router;
```

---

## Frontend Project Structure

```
frontend/src/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── farmer/
│   │   ├── dashboard/page.tsx
│   │   ├── new-listing/page.tsx
│   │   └── my-crops/page.tsx
│   ├── buyer/
│   │   ├── marketplace/page.tsx
│   │   └── my-bids/page.tsx
│   ├── crop/[id]/page.tsx
│   └── profile/page.tsx
│
├── components/                 # Reusable React components
│   ├── Button.tsx              # Styled button with variants
│   ├── Input.tsx               # Form input wrapper
│   ├── Select.tsx              # Dropdown wrapper
│   ├── TextArea.tsx            # Textarea wrapper
│   ├── CropCard.tsx            # Crop display card
│   ├── Navbar.tsx              # Navigation bar
│   └── Footer.tsx              # Footer
│
├── context/                    # Context API providers
│   └── AuthContext.tsx         # Global auth state
│
├── services/                   # API client
│   └── api.ts                  # Centralized API calls
│
├── hooks/                      # Custom React hooks
│   └── (custom hooks here)
│
├── types/                      # TypeScript definitions
│   ├── user.ts                 # User types
│   └── crop.ts                 # Crop types
│
└── utils/                      # Utility functions
    ├── constants.ts
    └── validation.ts
```

### Frontend Patterns

#### Context Hook Usage
```typescript
// ✅ GOOD: Hook for easy access
const {user, token, logout} = useAuth();

// ❌ AVOID: Direct context usage
const context = useContext(AuthContext);
```

#### Component Prop Pattern
```typescript
// ✅ GOOD: Interface for type safety
interface CropCardProps {
  crop: Crop;
  onBid?: (amount: number) => void;
  variant?: 'marketplace' | 'farmer';
}

export default function CropCard({crop, onBid, variant = 'marketplace'}: CropCardProps) {
  // Component code
}
```

#### API Call Pattern
```typescript
// ✅ GOOD: Error handling in component
const handleBid = async () => {
  try {
    setLoading(true);
    await bidAPI.placeBid(cropId, amount);
    setSuccess('Bid placed!');
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

---

## Database Maintenance

### MongoDB Commands

#### Check Database
```bash
mongosh
use kisaansetu
db.users.countDocuments()
db.crops.countDocuments()
db.bids.countDocuments()
```

#### Create Index
```javascript
db.users.createIndex({mobile: 1}, {unique: true});
db.crops.createIndex({farmerId: 1});
db.crops.createIndex({status: 1});
db.bids.createIndex({cropId: 1, bidAmount: -1});
```

#### Backup Database
```bash
mongodump --db kisaansetu --out ./backup
```

#### Restore Database
```bash
mongorestore --db kisaansetu ./backup/kisaansetu
```

#### Clear Collection
```javascript
db.bids.deleteMany({});
db.crops.deleteMany({});
```

### Query Optimization

#### Check Query Performance
```javascript
db.crops.find({farmerId: ObjectId("...")}).explain("executionStats")
```

#### Common Queries

```javascript
// Find farmer's active crops
db.crops.find({
  farmerId: ObjectId("..."),
  status: "active"
}).sort({createdAt: -1});

// Find bids for crop sorted by amount
db.bids.find({
  cropId: ObjectId("...")
}).sort({bidAmount: -1});

// Top farmers by crop count
db.crops.aggregate([
  {$group: {_id: "$farmerId", count: {$sum: 1}}},
  {$sort: {count: -1}},
  {$limit: 10}
]);

// Average bid per category
db.bids.aggregate([
  {$lookup: {
    from: "crops",
    localField: "cropId",
    foreignField: "_id",
    as: "crop"
  }},
  {$group: {
    _id: "$crop.category",
    avgBid: {$avg: "$bidAmount"}
  }}
]);
```

---

## Common Development Tasks

### Adding a New Feature

#### Step 1: Plan
```
- What pages needed?
- What data models?
- What API endpoints?
- What components?
```

#### Step 2: Database Schema
```javascript
// backend/src/models/NewModel.js
const mongoose = require('mongoose');

const newSchema = new mongoose.Schema({
  field1: {type: String, required: true},
  field2: {type: Number, default: 0},
  createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('New', newSchema);
```

#### Step 3: API Endpoint
```javascript
// backend/src/controllers/newController.js
const getNew = async (req, res) => {
  try {
    const data = await New.find();
    res.json({success: true, data});
  } catch (error) {
    res.status(500).json({success: false, error: error.message});
  }
};

module.exports = {getNew};
```

#### Step 4: Frontend
```typescript
// frontend/src/app/new/page.tsx
'use client';
import {useEffect, useState} from 'react';
import {api} from '@/services/api';

export default function NewPage() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const load = async () => {
      try {
        const result = await api.get('/new');
        setData(result.data);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, []);
  
  return (
    <div className="container">
      {data.map(item => <div key={item._id}>{item.field1}</div>)}
    </div>
  );
}
```

### Testing Changes

#### Backend
```bash
# 1. Clear database
mongo
use kisaansetu
db.dropDatabase()
exit

# 2. Restart server
cd backend
npm run dev

# 3. Test endpoints with cURL or Postman
curl http://localhost:5000/api/crops
```

#### Frontend
```bash
# 1. Restart dev server
cd frontend
npm run dev

# 2. Open browser to http://localhost:3000
# 3. Test in DevTools (F12)
```

### Debugging

#### Backend Debugging
```javascript
// Add console logs
console.log('User data:', user);

// Check request data
console.log('Body:', req.body);
console.log('Params:', req.params);
console.log('Query:', req.query);

// Error logging
try {
  // code
} catch (error) {
  console.error('Error details:', error.message, error.stack);
}
```

#### Frontend Debugging
```typescript
// Browser DevTools
console.log('State:', data);

// Network tab
// Check request/response in Network tab (F12)

// React DevTools
// Install React DevTools extension
// Check component props and state
```

---

## Performance Optimization

### Backend

#### Query Optimization
```javascript
// ❌ SLOW: Full document fetch
User.find({role: 'farmer'});

// ✅ FAST: Only needed fields
User.find({role: 'farmer'}, 'name location rating');

// ✅ FASTER: With index
db.users.createIndex({role: 1});

// ✅ FASTEST: Pagination
User.find({role: 'farmer'})
  .limit(20)
  .skip((page - 1) * 20);
```

#### Connection Pooling
```javascript
// MongoDB automatically pools connections
// Default: 10 connections
// Adjust in production if needed
```

### Frontend

#### Code Splitting
```typescript
// Next.js automatically code-splits at page level
// Each route = separate bundle

// Manual lazy loading
import dynamic from 'next/dynamic';
const HeavyComponent = dynamic(() => import('./HeavyComponent'));
```

#### Image Optimization
```typescript
import Image from 'next/image';

<Image
  src="/crop.jpg"
  alt="Crop"
  width={300}
  height={200}
  loading="lazy"
/>
```

#### Memoization
```typescript
import {memo} from 'react';

const CropCard = memo(({crop}) => {
  // Only re-renders if crop prop changes
  return <div>{crop.name}</div>;
});
```

---

## Security Checklist

### Backend Security
- [ ] Passwords hashed with bcrypt
- [ ] JWT tokens signed with strong secret
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using MongoDB/Mongoose)
- [ ] CORS properly configured
- [ ] No sensitive data in logs
- [ ] Rate limiting in production
- [ ] HTTPS in production

### Frontend Security
- [ ] No API keys in frontend code
- [ ] Never store sensitive data in localStorage
- [ ] Use environment variables for secrets
- [ ] Validate user input
- [ ] Sanitize displayed content
- [ ] CSRF tokens in state-changing requests
- [ ] Content Security Policy headers

### Environment Variables
```bash
# Backend .env (NEVER commit)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kisaansetu
JWT_SECRET=very-long-random-secret-key-at-least-32-chars
NODE_ENV=development

# Frontend .env.local (NEVER commit)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Deployment Checklist

### Before Production

- [ ] All tests passing
- [ ] No console errors
- [ ] Performance optimized
- [ ] Security review complete
- [ ] Database backups configured
- [ ] Error monitoring setup (e.g., Sentry)
- [ ] Analytics configured
- [ ] Documentation updated

### Production Environment Variables

```bash
# Backend
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kisaansetu
JWT_SECRET=very-long-random-production-secret
NODE_ENV=production
```

### Deployment Platforms

#### Frontend (Vercel)
```bash
1. Connect GitHub repo
2. Set environment variables
3. Deploy
```

#### Backend (Railway)
```bash
1. Connect GitHub repo
2. Set environment variables
3. Deploy
```

#### Database (MongoDB Atlas)
```bash
1. Create cluster
2. Add user credentials
3. Get connection string
4. Update MONGODB_URI
```

---

## Troubleshooting Guide

### Issue: Port Already in Use

**Error**: `EADDRINUSE :::5000`

**Solution**:
```bash
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: MongoDB Connection Failed

**Error**: `ENOTFOUND cluster0.mongodb.net`

**Solution**:
```bash
# Check MongoDB running
mongosh

# Or use local MongoDB
# Update MONGODB_URI to: mongodb://localhost:27017/kisaansetu
```

### Issue: CORS Error

**Error**: `Access to XMLHttpRequest blocked by CORS`

**Solution**:
```javascript
// backend/src/server.js
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue: Token Expired

**Error**: `401 Unauthorized`

**Solution**: 
```typescript
// Frontend: Clear localStorage
localStorage.clear();
// Redirect to login
```

### Issue: Blank Page

**Error**: White screen, no errors

**Solution**:
```bash
1. Check browser console (F12)
2. Check network requests
3. Verify API_URL is correct
4. Check .env.local file
```

---

## Important Files & Their Purpose

| File | Purpose | Edit When |
|------|---------|-----------|
| `backend/src/server.js` | Express setup | Change middleware/routes |
| `backend/src/models/*.js` | Database schemas | Add new fields/validation |
| `backend/src/controllers/*.js` | Business logic | Add new features |
| `backend/src/routes/*.js` | URL mapping | Add new endpoints |
| `frontend/src/services/api.ts` | API client | Change API structure |
| `frontend/src/context/AuthContext.tsx` | Global state | Change auth logic |
| `frontend/.env.local` | Frontend config | Different API URL |
| `backend/.env` | Backend config | Database/JWT settings |

---

## Useful Commands

```bash
# Backend
cd backend
npm install              # Install dependencies
npm run dev              # Start development
npm start                # Start production
npm test                 # Run tests (if configured)

# Frontend
cd frontend
npm install
npm run dev              # Start development
npm run build            # Build production
npm start                # Start production
npm run lint             # Check code style

# Database
mongosh                  # MongoDB CLI
mongo < script.js        # Run MongoDB script
mongodump --db kisaansetu  # Backup
mongorestore --db kisaansetu ./backup  # Restore

# Git
git status               # Check changes
git add .                # Stage changes
git commit -m "message"  # Commit
git push origin main     # Push to GitHub
```

---

## Resources

- **Next.js**: https://nextjs.org/docs
- **Express**: https://expressjs.com
- **MongoDB**: https://docs.mongodb.com
- **React**: https://react.dev
- **Mongoose**: https://mongoosejs.com
- **JWT**: https://jwt.io
- **Tailwind CSS**: https://tailwindcss.com

---

**Last Updated: 2024**
