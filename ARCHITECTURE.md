# 🏗️ KisaanSetu-App - Complete Architecture & Implementation Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack Details](#technology-stack-details)
4. [Data Flow & API Integration](#data-flow--api-integration)
5. [Authentication System](#authentication-system)
6. [Component Architecture](#component-architecture)
7. [Database Design](#database-design)
8. [File Structure](#file-structure)
9. [Development Workflow](#development-workflow)
10. [Performance Optimizations](#performance-optimizations)

---

## Project Overview

### What is KisaanSetu-App?

KisaanSetu (means "Bridge for Farmers" in Hindi) is an AI-powered agricultural marketplace that:

1. **Empowers Farmers**: List crops directly without middlemen
2. **Connects Buyers**: Browse verified crops nationwide
3. **Verifies Quality**: AI grades crops automatically (A, B, C)
4. **Fair Bidding**: Transparent auction system
5. **Secure Transactions**: Mock payment wallet system

### Key Metrics
- **Total Pages**: 9 (responsive, mobile-ready)
- **Components**: 7 reusable React components
- **API Endpoints**: 12+ REST endpoints
- **Data Models**: 3 (User, Crop, Bid)
- **Authentication**: JWT-based with role verification

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      USERS                                   │
│                  (Browser / Mobile)                          │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
    ┌───▼──────────────┐          ┌──────▼────────────┐
    │  NEXT.JS 14      │          │   BACKEND API     │
    │  FRONTEND        │◄────────►│   EXPRESS.JS      │
    │  (Port: 3000)    │ REST API │   (Port: 5000)    │
    └────────────────┘          └────────┬───────────┘
         │                              │
         │ Tailwind CSS                │ MongoDB
         │ React 19                    │ Driver
         │ TypeScript                  │
         │                             │
         └─────────────────┬───────────┘
                           │
                    ┌──────▼──────────┐
                    │  MONGODB 7.0    │
                    │  (Database)     │
                    │  Port: 27017    │
                    └─────────────────┘
```

### Communication Flow

```
User Action
    │
    ▼
React Component
    │
    ▼
API Service (fetch/axios)
    │
    ▼
Backend Route Handler
    │
    ├─► Validation Middleware
    │
    ├─► Auth Middleware (JWT check)
    │
    ├─► Controller Logic
    │
    └─► MongoDB Operation
    │
    ▼
Response JSON
    │
    ▼
Frontend State Update
    │
    ▼
Component Re-render
```

---

## Technology Stack Details

### Frontend Stack

#### Framework & Libraries
```json
{
  "next": "14.0+",           // Server-side rendering, routing
  "react": "19.2+",          // UI components
  "react-dom": "19.2+",      // DOM rendering
  "typescript": "5+",        // Type safety
  "tailwindcss": "4+",       // Utility-first CSS
  "@tailwindcss/postcss": "4", // Tailwind plugin
}
```

#### Why These Choices?
- **Next.js**: Built-in routing, API optimization, production-ready
- **React 19**: Latest hooks, better performance
- **TypeScript**: Catch errors early, better IDE support
- **Tailwind CSS**: Fast styling, consistent design system

### Backend Stack

#### Framework & Libraries
```json
{
  "express": "5.2+",         // REST API framework
  "mongoose": "8+",          // MongoDB ODM
  "bcryptjs": "3.0+",        // Password hashing
  "jsonwebtoken": "9.0+",    // JWT authentication
  "cors": "2.8+",            // Cross-origin requests
  "dotenv": "17.2+",         // Environment variables
  "nodemon": "3.1+"          // Auto-restart on changes
}
```

#### Why These Choices?
- **Express**: Lightweight, flexible, industry standard
- **Mongoose**: Schema validation, relationship management
- **JWT**: Stateless auth, scalable, secure
- **bcryptjs**: Password security, industry standard

### Database

#### MongoDB Schema Design
```
Collections:
├── users
│   ├── Indexed: mobile (unique)
│   ├── Indexed: email (sparse unique)
│   └── Regular: role, location
│
├── crops
│   ├── Indexed: farmerId (foreign key)
│   ├── Indexed: status
│   ├── Text: cropName (for search)
│   └── Regular: other fields
│
└── bids
    ├── Indexed: cropId, buyerId
    ├── Indexed: createdAt (for sorting)
    └── Regular: bidAmount, status
```

---

## Data Flow & API Integration

### Authentication Flow

#### Signup Process
```
1. User fills signup form
   └─► Frontend validates input
   
2. POST /api/auth/signup
   └─► Backend receives data
   
3. Validation
   ├─► Check all fields present
   ├─► Validate mobile format
   └─► Check user doesn't exist
   
4. Password Hashing
   ├─► Generate salt (10 rounds)
   ├─► Hash password
   └─► Store hashed version
   
5. User Creation
   ├─► Save to MongoDB
   └─► Return new user object
   
6. JWT Generation
   ├─► Sign token with payload: {userId, role}
   ├─► Set expiration: 7 days
   └─► Return token
   
7. Frontend
   ├─► Store token in localStorage
   ├─► Save user in Context
   └─► Redirect to dashboard
```

#### Login Process
```
1. User submits credentials
   └─► POST /api/auth/login
   
2. Find user by mobile
   └─► db.users.findOne({mobile})
   
3. Compare passwords
   ├─► Extract salt from stored hash
   ├─► Hash submitted password
   └─► Compare hashes
   
4. Token generation & return
   └─► Same as signup
```

#### API Request with Auth
```
Frontend Request:
  ├─► Get token from localStorage
  ├─► Add header: "Authorization: Bearer {token}"
  └─► Send to API
  
Backend Middleware:
  ├─► Extract token from header
  ├─► Verify with JWT_SECRET
  ├─► Decode to get userId & role
  ├─► Attach to request object
  └─► Pass to route handler
  
Route Handler:
  ├─► Access req.userId & req.userRole
  └─► Proceed with protected logic
```

### Crop Listing Flow

```
Farmer: List New Crop
   │
   ├─► POST /api/crops
   │   ├─► Auth middleware (verify JWT)
   │   ├─► Body validation
   │   │   ├─► cropName required
   │   │   ├─► category in enum
   │   │   ├─► quantity > 0
   │   │   └─► basePrice > 0
   │   │
   │   ├─► Controller:
   │   │   ├─► Mock AI grading
   │   │   │   └─► Generate random grade (A/B/C)
   │   │   │   └─► Generate quality score (60-100)
   │   │   │
   │   │   ├─► Create crop document
   │   │   │   ├─► farmerId = req.userId
   │   │   │   ├─► status = "active"
   │   │   │   ├─► currentBid = 0
   │   │   │   ├─► bidCount = 0
   │   │   │   └─► createdAt = now
   │   │   │
   │   │   └─► Save to MongoDB
   │   │
   │   └─► Response: {success, crop}
   │
   └─► Frontend:
       ├─► Show success message
       ├─► Redirect to dashboard
       └─► Fetch updated crops list
```

### Bidding Flow

```
Buyer: Place Bid on Crop
   │
   ├─► Click "Place Bid"
   │
   ├─► Modal opens with:
   │   ├─► Crop details (name, grade, price)
   │   ├─► Current highest bid
   │   ├─► Input for bid amount
   │   └─► Submit button
   │
   ├─► Validation:
   │   ├─► User logged in? 
   │   ├─► User is buyer?
   │   ├─► Bid amount provided?
   │   └─► Bid >= minimum?
   │
   ├─► POST /api/bids
   │   ├─► Body: {cropId, bidAmount}
   │   ├─► Auth: verify buyer role
   │   │
   │   ├─► Find crop
   │   │   └─► db.crops.findById(cropId)
   │   │
   │   ├─► Validate bid amount
   │   │   ├─► minBid = max(currentBid + 1, basePrice)
   │   │   ├─► bidAmount >= minBid?
   │   │   └─► Check buyer wallet balance
   │   │
   │   ├─► Create Bid document
   │   │   ├─► cropId, buyerId, bidAmount
   │   │   ├─► status = "active"
   │   │   └─► createdAt = now
   │   │
   │   ├─► Update Crop
   │   │   ├─► currentBid = bidAmount
   │   │   ├─► bidCount += 1
   │   │   ├─► highestBidder = buyerId
   │   │   └─► save()
   │   │
   │   └─► Response: {success, bid}
   │
   └─► Frontend:
       ├─► Show success
       ├─► Refresh bid history
       └─► Update displayed price
```

### Data Fetch Flow

```
Frontend: Load Marketplace
   │
   ├─► Component mounts
   ├─► Call: getCrops({status: "active"})
   │
   ├─► GET /api/crops?status=active
   │   ├─► Query builder
   │   │   └─► Find all crops where status="active"
   │   │
   │   ├─► Populate farmer data
   │   │   └─► .populate("farmerId", "name location rating")
   │   │
   │   ├─► Sort by date
   │   │   └─► .sort({createdAt: -1})
   │   │
   │   └─► Response: {success, crops: [], count}
   │
   ├─► Frontend:
   │   ├─► Store in state
   │   ├─► Apply client-side filters
   │   │   ├─► Search by cropName
   │   │   ├─► Filter by category
   │   │   ├─► Filter by location
   │   │   └─► Filter by price range
   │   │
   │   └─► Render CropCard components
   │       ├─► Display image
   │       ├─► Show grade badge
   │       ├─► Display price & current bid
   │       └─► "View" & "Bid" buttons
   │
   └─► User interaction
       └─► Click "Place Bid" or "View Details"
```

---

## Authentication System

### JWT Token Structure

```javascript
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "userId": "507f1f77bcf86cd799439011",  // MongoDB ObjectId
  "role": "farmer",                       // "farmer" or "buyer"
  "iat": 1702000000,                      // Issued at
  "exp": 1702604800                       // Expires in 7 days
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  "your-super-secret-key-12345"
)
```

### Security Best Practices Implemented

1. **Password Hashing**
   ```javascript
   // 10 salt rounds = very secure
   const hash = await bcrypt.hash(password, 10);
   ```

2. **Secure Token Storage**
   ```javascript
   // Stored in localStorage (client-side)
   // Only sent in Authorization header
   // HTTPS only in production
   ```

3. **Role-Based Access Control**
   ```javascript
   // Only farmers can list crops
   // Only buyers can place bids
   // Verified in middleware
   ```

4. **Protected Routes**
   ```javascript
   // All data modifications require auth
   // POST, PUT, DELETE protected
   // GET public (for marketplace)
   ```

---

## Component Architecture

### Frontend Component Hierarchy

```
App (layout.tsx)
├─► AuthProvider (Context)
├─► Navbar
├─► Main Content
│   ├─► Pages
│   │   ├─► / (Landing)
│   │   ├─► /auth/signup
│   │   ├─► /auth/login
│   │   ├─► /farmer/*
│   │   ├─► /buyer/*
│   │   ├─► /crop/[id]
│   │   └─► /profile
│   │
│   └─► Components (Reusable)
│       ├─► Button
│       ├─► Input
│       ├─► Select
│       ├─► TextArea
│       ├─► CropCard
│       └─► Navbar
│
└─► Footer
```

### Component Props & State Flow

```typescript
// Button Component - Highly Reusable
interface ButtonProps {
  label: string;              // Button text
  onClick?: () => void;       // Click handler
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

// CropCard Component - Data Display
interface CropCardProps {
  crop: Crop;                 // Crop data object
  onPlaceBid?: () => void;   // Bid action
  variant?: 'marketplace' | 'farmer';
}
```

### State Management Strategy

```
Global State (Context):
├─► useAuth()
│   ├─► token (JWT)
│   ├─► user (User object)
│   ├─► isAuthenticated (boolean)
│   └─► Functions: login(), logout()

Local State (useState):
├─► Page components
│   ├─► crops (fetched data)
│   ├─► loading (boolean)
│   ├─► filters (filter state)
│   └─► errors (error messages)

No Redux/Zustand needed for this scale
```

---

## Database Design

### Relationships

```
User (1) ──────► (Many) Crop
  │
  └─── farmerId (if role="farmer")

Crop (1) ──────► (Many) Bid
  │
  └─── cropId

User (1) ──────► (Many) Bid
  │
  └─── buyerId (if role="buyer")
```

### Index Strategy

```javascript
// User collection
db.users.createIndex({mobile: 1}, {unique: true});
db.users.createIndex({email: 1}, {sparse: true, unique: true});

// Crop collection
db.crops.createIndex({farmerId: 1});
db.crops.createIndex({status: 1});
db.crops.createIndex({cropName: "text"}); // For search

// Bid collection
db.bids.createIndex({cropId: 1, bidAmount: -1}); // Compound
db.bids.createIndex({buyerId: 1});
db.bids.createIndex({createdAt: -1}); // For sorting
```

### Aggregation Examples

```javascript
// Get top-selling farmers
db.crops.aggregate([
  {$match: {status: "sold"}},
  {$group: {_id: "$farmerId", totalSold: {$sum: 1}}},
  {$sort: {totalSold: -1}},
  {$limit: 10}
]);

// Get average bid per crop
db.bids.aggregate([
  {$group: {_id: "$cropId", avgBid: {$avg: "$bidAmount"}}},
  {$lookup: {from: "crops", localField: "_id", foreignField: "_id", as: "crop"}},
  {$project: {cropName: "$crop.cropName", avgBid: 1}}
]);
```

---

## File Structure

### Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   │
│   ├── models/                  # Mongoose schemas
│   │   ├── User.js              # User schema & methods
│   │   ├── Crop.js              # Crop schema
│   │   └── Bid.js               # Bid schema
│   │
│   ├── controllers/             # Business logic
│   │   ├── authController.js    # Auth logic
│   │   ├── cropController.js    # Crop operations
│   │   └── bidController.js     # Bid operations
│   │
│   ├── routes/                  # API routes
│   │   ├── index.js             # Route aggregator
│   │   ├── auth.js              # /api/auth/*
│   │   ├── crops.js             # /api/crops/*
│   │   └── bids.js              # /api/bids/*
│   │
│   ├── middleware/              # Custom middleware
│   │   └── auth.js              # JWT verification
│   │
│   └── server.js                # Express app setup
│
├── .env                         # Environment variables
└── package.json
```

### Frontend Structure

```
frontend/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root layout with AuthProvider
│   │   ├── page.tsx             # Landing page
│   │   ├── globals.css          # Global styles
│   │   │
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   │
│   │   ├── farmer/              # Farmer routes
│   │   │   ├── dashboard/
│   │   │   ├── new-listing/
│   │   │   └── my-crops/
│   │   │
│   │   ├── buyer/               # Buyer routes
│   │   │   ├── marketplace/
│   │   │   └── my-bids/
│   │   │
│   │   ├── crop/
│   │   │   └── [id]/page.tsx   # Crop details
│   │   │
│   │   └── profile/page.tsx    # User profile
│   │
│   ├── components/              # Reusable components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── TextArea.tsx
│   │   ├── CropCard.tsx
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   │
│   ├── services/
│   │   └── api.ts               # API client wrapper
│   │
│   ├── context/
│   │   └── AuthContext.tsx      # Auth context provider
│   │
│   ├── hooks/
│   │   └── (custom hooks here)
│   │
│   ├── types/
│   │   ├── user.ts              # User types
│   │   └── crop.ts              # Crop types
│   │
│   └── utils/
│       ├── constants.ts         # Constants
│       └── validation.ts        # Validation helpers
│
├── .env.local
└── package.json
```

---

## Development Workflow

### Adding a New Feature

#### Example: Add "My Earnings" Page for Farmers

**Step 1: Plan**
```
- Route: /farmer/earnings
- Data needed: List of sold crops + bids
- UI: Table with crop, bid, earnings
```

**Step 2: Backend**
```javascript
// In cropController.js
const getFarmerEarnings = async (req, res) => {
  // Get sold crops
  // Calculate total earnings
  // Return data
};

// In routes/crops.js
router.get('/farmer/earnings', auth, getFarmerEarnings);
```

**Step 3: Frontend**
```typescript
// Create src/app/farmer/earnings/page.tsx
// Use cropAPI.getFarmerCrops()
// Filter for status="sold"
// Calculate and display earnings
```

**Step 4: Test**
```bash
1. npm run dev (backend & frontend)
2. Login as farmer
3. Navigate to /farmer/earnings
4. Verify data displays correctly
```

### Testing Checklist

```
[ ] Happy Path
    [ ] Feature works as expected
    [ ] All data displays correctly

[ ] Error Cases
    [ ] Handle API errors
    [ ] Show error messages
    [ ] Allow retry

[ ] Edge Cases
    [ ] Empty data lists
    [ ] Very large amounts
    [ ] Special characters

[ ] Performance
    [ ] Page loads quickly
    [ ] No console errors
    [ ] Responsive on mobile
```

---

## Performance Optimizations

### Frontend Optimizations

1. **Image Optimization**
   ```javascript
   // Use Next.js Image component
   import Image from 'next/image';
   <Image src={url} alt="crop" width={300} height={200} />
   ```

2. **Code Splitting**
   ```javascript
   // Automatic in Next.js App Router
   // Each page = separate bundle
   ```

3. **Lazy Loading**
   ```javascript
   import dynamic from 'next/dynamic';
   const Marketplace = dynamic(() => import('./marketplace'));
   ```

4. **Memoization**
   ```javascript
   // Prevent unnecessary re-renders
   const CropCard = memo(({crop}) => {...});
   ```

### Backend Optimizations

1. **Database Indexing**
   ```javascript
   // Indexes on frequently queried fields
   db.crops.createIndex({farmerId: 1});
   db.crops.createIndex({status: 1});
   ```

2. **Query Optimization**
   ```javascript
   // Populate only needed fields
   .populate('farmerId', 'name location rating');
   ```

3. **Pagination**
   ```javascript
   // For large lists
   const crops = await Crop.find()
     .limit(20)
     .skip((page - 1) * 20);
   ```

4. **Caching**
   ```javascript
   // In production, add Redis
   const cache = await redis.get('crops');
   ```

---

## Conclusion

This architecture provides:

✅ **Scalability**: Easy to add new features  
✅ **Maintainability**: Clear separation of concerns  
✅ **Security**: JWT auth, password hashing, role verification  
✅ **Performance**: Optimized queries, indexed database  
✅ **Developer Experience**: Modern stack, clear patterns  

---

**Happy building! 🚀**
