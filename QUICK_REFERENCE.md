# 🚀 KisaanSetu-App - Quick Reference Guide

## Getting Started (5 Minutes)

### Option 1: Using Docker (Easiest)
```bash
cd /Users/aniketlodhi/developer/kisaansetu-app
docker-compose up --build
```
Then open: `http://localhost:3000`

### Option 2: Local Setup (Manual)
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev
```

### Option 3: Automated Script
```bash
chmod +x quick-start.sh
./quick-start.sh
```

---

## Test Credentials

### Farmer Account
- **Mobile**: 9876543210
- **Password**: password123

### Buyer Account
- **Mobile**: 9876543211
- **Password**: password123

---

## Project URL Map

| Page | URL | Requires Auth | Role |
|------|-----|---------------|------|
| Landing | `/` | No | - |
| Login | `/auth/login` | No | - |
| Signup | `/auth/signup` | No | - |
| Farmer Dashboard | `/farmer/dashboard` | Yes | Farmer |
| New Listing | `/farmer/new-listing` | Yes | Farmer |
| My Crops | `/farmer/my-crops` | Yes | Farmer |
| Marketplace | `/buyer/marketplace` | Yes | Buyer |
| My Bids | `/buyer/my-bids` | Yes | Buyer |
| Crop Details | `/crop/[id]` | Yes | Buyer |
| Profile | `/profile` | Yes | Both |

---

## API Endpoints Quick Reference

### Authentication
```
POST   /api/auth/signup      - Create new user
POST   /api/auth/login       - User login
GET    /api/auth/profile     - Get user profile (protected)
```

### Crops (Marketplace)
```
GET    /api/crops            - List all active crops
GET    /api/crops/:id        - Get crop details
POST   /api/crops            - Create crop (farmer only)
PUT    /api/crops/:id        - Update crop (farmer only)
DELETE /api/crops/:id        - Delete crop (farmer only)
GET    /api/crops/farmer     - Get farmer's crops (farmer only)
```

### Bids (Bidding)
```
POST   /api/bids             - Place bid (buyer only)
GET    /api/bids/my/bids     - Get my bids (buyer only)
GET    /api/bids/crop/:cropId - Get bids for crop
```

---

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kisaansetu
JWT_SECRET=your-secret-key-here-change-in-production
NODE_ENV=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Feature Overview

### 👨‍🌾 Farmer Features
- ✅ Sign up with role selection
- ✅ Create crop listings with AI grading
- ✅ View dashboard with stats
- ✅ Manage my crops (view, update, delete)
- ✅ Track bids on crops
- ✅ View profile

### 🛒 Buyer Features
- ✅ Sign up with role selection
- ✅ Browse marketplace with search & filters
- ✅ View crop details & bid history
- ✅ Place bids on crops
- ✅ Track my bids & winning status
- ✅ View profile

### 🤖 AI Features
- ✅ Automatic crop grading (A/B/C)
- ✅ Quality score generation (60-100%)
- ✅ AI verification badge

---

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ENOTFOUND _mongodb._tcp
Solution: 
1. Install MongoDB locally (brew install mongodb-community on macOS)
2. Start: brew services start mongodb-community
3. Or use Docker: docker-compose up
```

### Port Already in Use
```
Error: EADDRINUSE :::5000
Solution:
1. Kill process: lsof -ti:5000 | xargs kill -9
2. Or use different port: PORT=5001 npm run dev
```

### Token Expired / Logged Out
```
Clear localStorage and login again:
1. Open DevTools (F12)
2. Application → LocalStorage → Clear All
3. Refresh page
```

### Crop Not Appearing
```
1. Make sure crop status is "active"
2. Check crop location matches filter
3. Refresh marketplace page
4. Check browser console for errors
```

---

## Development Commands

### Backend
```bash
cd backend

npm install              # Install dependencies
npm run dev             # Start with hot-reload
npm start               # Start production
npm test                # Run tests (if added)
```

### Frontend
```bash
cd frontend

npm install              # Install dependencies
npm run dev             # Start dev server
npm run build           # Build for production
npm start               # Start production
npm run lint            # Lint code
```

---

## File Editing Quick Reference

### To Add New API Endpoint

**1. Create Controller (backend/src/controllers/nameController.js)**
```javascript
const myFunction = async (req, res) => {
  try {
    // Your logic here
    res.json({success: true, data});
  } catch (error) {
    res.status(500).json({success: false, error: error.message});
  }
};
module.exports = {myFunction};
```

**2. Add Route (backend/src/routes/name.js)**
```javascript
const router = require('express').Router();
const {myFunction} = require('../controllers/nameController');
const auth = require('../middleware/auth');

router.get('/endpoint', auth, myFunction);
module.exports = router;
```

**3. Mount Route (backend/src/routes/index.js)**
```javascript
const nameRouter = require('./name');
router.use('/name', nameRouter);
```

### To Add New Frontend Page

**1. Create Directory Structure**
```bash
mkdir -p frontend/src/app/new-page
```

**2. Create Page (frontend/src/app/new-page/page.tsx)**
```typescript
import {useRouter} from 'next/navigation';

export default function NewPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Page Title</h1>
    </div>
  );
}
```

### To Add New Component

**1. Create Component (frontend/src/components/MyComponent.tsx)**
```typescript
interface MyComponentProps {
  prop1: string;
  prop2?: number;
}

export default function MyComponent({prop1, prop2}: MyComponentProps) {
  return (
    <div className="component-class">
      {prop1}
    </div>
  );
}
```

**2. Use in Page**
```typescript
import MyComponent from '@/components/MyComponent';

export default function Page() {
  return <MyComponent prop1="test" />;
}
```

---

## Deployment Checklist

### Before Deploying

- [ ] Test all features locally
- [ ] Update .env with production values
- [ ] Change JWT_SECRET
- [ ] Update MONGODB_URI to production DB
- [ ] Update API_URL to production backend
- [ ] Test auth flows
- [ ] Test bidding system
- [ ] Performance check (no console errors)

### Frontend Deployment (Vercel)

```bash
1. Push to GitHub
2. Connect repo to Vercel
3. Set env vars: NEXT_PUBLIC_API_URL
4. Deploy
```

### Backend Deployment (Railway)

```bash
1. Push to GitHub
2. Connect repo to Railway
3. Set env vars: MONGODB_URI, JWT_SECRET
4. Deploy
```

---

## Performance Tips

### Frontend
- Use `next/image` for images
- Memoize expensive components
- Lazy load routes with `dynamic()`
- Check bundle size with `npm run build`

### Backend
- Use database indexes
- Populate only needed fields
- Add pagination for large lists
- Use caching for repeated queries

---

## Learning Resources

### Frontend (React/Next.js)
- https://react.dev
- https://nextjs.org/docs
- https://tailwindcss.com

### Backend (Node/Express)
- https://nodejs.org/docs
- https://expressjs.com
- https://mongoosejs.com

### Database (MongoDB)
- https://docs.mongodb.com
- https://www.mongodb.com/docs/manual

---

## Common Code Patterns

### Using Auth in Component
```typescript
import {useAuth} from '@/context/AuthContext';

export default function Page() {
  const {user, isAuthenticated, logout} = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return <div>Hello {user?.name}</div>;
}
```

### Calling API
```typescript
import {cropAPI} from '@/services/api';

const crops = await cropAPI.getCrops({
  status: 'active',
  category: 'wheat'
});
```

### Error Handling
```typescript
try {
  await bidAPI.placeBid(cropId, amount);
  alert('Bid placed successfully!');
} catch (error) {
  alert('Error: ' + error.message);
}
```

---

## Next Steps

1. ✅ Setup complete
2. ✅ Start development servers
3. ✅ Login with test credentials
4. ✅ Explore all features
5. ✅ Make changes as needed
6. ✅ Deploy to production

---

**Happy coding! 🎉**
