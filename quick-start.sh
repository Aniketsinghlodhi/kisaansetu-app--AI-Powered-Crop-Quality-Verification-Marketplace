#!/bin/bash

# KisaanSetu-App - Quick Start Script
# This script helps set up and run the project

set -e

echo "╔════════════════════════════════════════╗"
echo "║  🌾 KisaanSetu-App Quick Start Setup   ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "📥 Please install Node.js from: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"

# Check if MongoDB is running
if ! command -v mongosh &> /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB CLI not found. If MongoDB is not running locally, use Docker${NC}"
    echo "    Option 1: Install MongoDB - https://www.mongodb.com/try/download/community"
    echo "    Option 2: Use Docker - docker-compose up"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✅ MongoDB CLI found${NC}"
fi

# Install dependencies
echo -e "\n${BLUE}Installing backend dependencies...${NC}"
cd backend
npm install --quiet
cd ..

echo -e "${GREEN}✅ Backend dependencies installed${NC}"

echo -e "\n${BLUE}Installing frontend dependencies...${NC}"
cd frontend
npm install --quiet
cd ..

echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

# Create .env files if they don't exist
if [ ! -f backend/.env ]; then
    echo -e "\n${BLUE}Creating backend .env...${NC}"
    cat > backend/.env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kisaansetu
JWT_SECRET=your-super-secret-key-change-this-in-production-12345
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EOF
    echo -e "${GREEN}✅ Backend .env created${NC}"
fi

if [ ! -f frontend/.env.local ]; then
    echo -e "\n${BLUE}Creating frontend .env.local...${NC}"
    cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000/api
EOF
    echo -e "${GREEN}✅ Frontend .env.local created${NC}"
fi

echo -e "\n${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}📖 Next steps:${NC}"
echo ""
echo "1️⃣  Start MongoDB (if not using Docker):"
echo "   macOS: brew services start mongodb-community"
echo "   Linux: sudo systemctl start mongod"
echo "   Windows: Start MongoDB Server from Services"
echo ""
echo "2️⃣  In Terminal 1, start the backend:"
echo "   cd backend && npm run dev"
echo ""
echo "3️⃣  In Terminal 2, start the frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "4️⃣  Open http://localhost:3000 in your browser"
echo ""
echo "📝 Test Credentials:"
echo "   Farmer: 9876543210 / password123"
echo "   Buyer:  9123456789 / password123"
echo ""
echo "📚 Full setup guide: see INSTALLATION_GUIDE.md"
echo ""
