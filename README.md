# 🌾 KisaanSetu-App

**AI-Powered Agricultural Marketplace & Crop Quality Verification Platform**

An innovative platform connecting Indian farmers with buyers through transparent bidding, AI-verified crop grading, and secure transactions.

---

## ✨ Features

- 🌾 **Farmer Dashboard**: List crops with AI quality grading
- 🏪 **Buyer Marketplace**: Browse verified crops from farmers nationwide  
- 🤖 **AI Crop Grading**: Automatic quality verification (Grades: A, B, C)
- 🤝 **Fair Bidding System**: Transparent auction without middlemen
- 💳 **Wallet Integration**: Mock payment system for testing
- 🔐 **Secure Authentication**: JWT-based auth with bcrypt password hashing
- 📊 **Real-time Stats**: Dashboard with crop listings, bids, and earnings
- 🔍 **Search & Filters**: Filter by crop type, grade, location, price
- 📱 **Fully Responsive**: Works on desktop, tablet, and mobile

---

## 🚀 Quick Start (2 Minutes)

### Option 1: Local Setup
```bash
# Run quick setup script
./quick-start.sh

# Then in Terminal 1:
cd backend && npm run dev

# Then in Terminal 2:
cd frontend && npm run dev

# Open http://localhost:3000
```

### Option 2: Docker Setup (Easiest)
```bash
# Requires Docker Desktop
docker-compose up --build

# Open http://localhost:3000
```

📖 **Full Setup Guide**: See [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)

---

## 🔑 Test Accounts

| Role | Mobile | Password |
|------|--------|----------|
| Farmer | `9876543210` | `password123` |
| Buyer | `9123456789` | `password123` |

---

## 📚 Project Structure

```
kisaansetu-app/
├── backend/              # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── config/      # Database configuration
│   │   ├── models/      # Mongoose schemas (User, Crop, Bid)
│   │   ├── controllers/ # Business logic
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Auth & validation
│   │   └── server.js    # Entry point
│   └── .env
│
├── frontend/             # Next.js 14 + React 19 + Tailwind
│   ├── src/
│   │   ├── app/         # App router pages
│   │   ├── components/  # Reusable UI components
│   │   ├── services/    # API client
│   │   ├── context/     # Auth context
│   │   ├── hooks/       # Custom hooks
│   │   └── types/       # TypeScript definitions
│   └── .env.local
│
├── docker-compose.yml   # Docker setup
└── INSTALLATION_GUIDE.md # Detailed setup
```

---

## 🛣️ API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Crops
- `POST /api/crops` - Create crop listing
- `GET /api/crops` - Get all crops (with filters)
- `GET /api/crops/:id` - Get crop details
- `GET /api/crops/farmer/my-crops` - Get farmer's crops

### Bidding
- `POST /api/bids` - Place a bid
- `GET /api/bids/my/bids` - Get my bids
- `GET /api/bids/crop/:id/bids` - Get bids for crop

---

## 🎯 Pages & Routes

| Page | Route | Role | Description |
|------|-------|------|-------------|
| Landing | `/` | All | Welcome page with features |
| Sign Up | `/auth/signup` | All | Create new account |
| Login | `/auth/login` | All | Login to account |
| Farmer Dashboard | `/farmer/dashboard` | Farmer | View stats & listings |
| List Crop | `/farmer/new-listing` | Farmer | Create new crop listing |
| My Crops | `/farmer/my-crops` | Farmer | Manage crops |
| Marketplace | `/buyer/marketplace` | Buyer | Browse & search crops |
| My Bids | `/buyer/my-bids` | Buyer | Track placed bids |
| Crop Details | `/crop/:id` | All | View crop & place bids |
| Profile | `/profile` | Auth | User profile & settings |

---

## 💻 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | Next.js | 14.0+ |
| | React | 19.2+ |
| | TypeScript | 5+ |
| | Tailwind CSS | 4+ |
| **Backend** | Node.js | 18+ |
| | Express.js | 5.0+ |
| | MongoDB | 7.0+ |
| **Authentication** | JWT | |
| **Security** | bcryptjs | 3.0+ |

---

## 🔐 Security Features

✅ **Password Hashing**: Bcrypt with 10 salt rounds  
✅ **JWT Tokens**: 7-day expiration  
✅ **Protected Routes**: Role-based access control  
✅ **Input Validation**: Form validation on frontend & backend  
✅ **CORS**: Configured for development  
✅ **Environment Variables**: Sensitive data protected  

---

## 📊 Data Models

### User
```javascript
{
  _id: ObjectId,
  name: String,
  mobile: String,
  email: String,
  passwordHash: String,
  role: "farmer" | "buyer",
  location: String,
  walletBalance: Number,
  rating: Number,
  createdAt: Date
}
```

### Crop
```javascript
{
  _id: ObjectId,
  farmerId: ObjectId,
  cropName: String,
  category: String,
  quantity: Number,
  basePrice: Number,
  aiGrade: "A" | "B" | "C",
  qualityScore: Number,
  currentBid: Number,
  bidCount: Number,
  status: "active" | "sold" | "expired"
}
```

### Bid
```javascript
{
  _id: ObjectId,
  cropId: ObjectId,
  buyerId: ObjectId,
  bidAmount: Number,
  status: "active" | "won" | "lost",
  createdAt: Date
}
```

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm i -g vercel
cd frontend
vercel
```

### Backend (Railway/Render)
```bash
# Railway
railway link && railway up

# Render - Connect GitHub repo
```

### Database (MongoDB Atlas)
- Use free tier for testing
- Update `MONGODB_URI` for production

---

## 🛠️ Development

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Code Quality
```bash
# Format code
npm run format

# Lint code
npm run lint
```

### Debug Mode
```bash
# Backend with debug logs
DEBUG=* npm run dev

# Frontend with React DevTools
# Install: React Developer Tools extension
```

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running locally or via Docker
- Check `MONGODB_URI` in `.env`

### CORS Errors
- Verify backend running on `:5000`
- Check `FRONTEND_URL` in backend `.env`

### Signup/Login Issues
- Clear browser localStorage: `localStorage.clear()`
- Check backend console for errors
- Restart both servers

**Full troubleshooting guide**: See [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md#-troubleshooting)

---

## 📚 Documentation

- [Installation Guide](./INSTALLATION_GUIDE.md) - Detailed setup steps
- [Setup Guide](./SETUP_GUIDE.md) - Architecture & features
- [API Documentation](./SETUP_GUIDE.md#-api-endpoints) - All endpoints
- [Troubleshooting](./INSTALLATION_GUIDE.md#-troubleshooting) - Common issues

---

## 🎯 24-Hour Hackathon Timeline

| Phase | Hours | Focus |
|-------|-------|-------|
| **Phase 1** | 0-4h | Backend setup, Auth, Database |
| **Phase 2** | 4-8h | Welcome page, Auth UI |
| **Phase 3** | 8-12h | Farmer Dashboard, Listings |
| **Phase 4** | 12-16h | Buyer Marketplace, Bidding |
| **Phase 5** | 16-20h | Filters, Search, Polish |
| **Phase 6** | 20-24h | Testing, Documentation, Demo |

---

## 🎨 UI/UX Highlights

- 🎨 **Modern Design**: Gradient backgrounds, smooth animations
- 📱 **Responsive**: Mobile-first approach
- ♿ **Accessible**: WCAG-compliant
- 🎯 **Intuitive**: Clear navigation & user flows
- ⚡ **Fast**: Optimized images & lazy loading

---

## 📈 Future Enhancements

- [ ] Real payment gateway (Stripe/Razorpay)
- [ ] Real-time WebSocket bidding
- [ ] Image upload to cloud (Cloudinary)
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Blockchain for transparency

---

## 🤝 Contributing

This is a hackathon project. Feel free to fork, modify, and improve!

---

## 📞 Support

- 📖 Check documentation
- 🐛 Review troubleshooting guide
- 💬 Check code comments

---

## 📜 License

Open source for educational purposes. Use freely for learning.

---

## 🙏 Acknowledgments

- Built for 24-hour Tech N Hack hackathon
- Designed for Indian farmers
- Made with ❤️ for agricultural innovation

---

## 👨‍💻 Created By

**Aniket Lodhi, harsh kumar , Raushan kumar , Shakshi Singh , Prerna Verma  / deepvision coders **  
Date:  07 December 2024  
Duration: 24 Hours

---

<div align="center">

### 🌾 Empowering Farmers Through Technology 🚀

**Start the journey now**: http://localhost:3000

[Get Started](#-quick-start-2-minutes) • [Setup Guide](./INSTALLATION_GUIDE.md) • [API Docs](./SETUP_GUIDE.md)

</div>
