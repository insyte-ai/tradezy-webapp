#!/bin/bash

# TradeZy Startup Script
# This script ensures all dependencies are installed and starts the development environment

echo "🚀 Starting TradeZy Development Environment..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js installation
if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js version:${NC} $(node -v)"

# Check npm installation
if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm version:${NC} $(npm -v)"

# Install root dependencies (concurrently)
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing root dependencies (concurrently)...${NC}"
    npm install
else
    echo -e "${GREEN}✓ Root dependencies installed${NC}"
fi

# Install server dependencies
if [ ! -d "server/node_modules" ]; then
    echo -e "${YELLOW}Installing server dependencies...${NC}"
    cd server && npm install && cd ..
else
    echo -e "${GREEN}✓ Server dependencies installed${NC}"
fi

# Install client dependencies
if [ ! -d "client/node_modules" ]; then
    echo -e "${YELLOW}Installing client dependencies...${NC}"
    cd client && npm install && cd ..
else
    echo -e "${GREEN}✓ Client dependencies installed${NC}"
fi

# Setup environment file
if [ ! -f "server/.env" ]; then
    echo -e "${YELLOW}Creating .env file from template...${NC}"
    cp server/.env.example server/.env
    echo -e "${RED}⚠️  IMPORTANT: Please configure your server/.env file with:${NC}"
    echo -e "  - MongoDB connection string"
    echo -e "  - JWT secrets"
    echo -e "  - Email configuration (optional)"
    echo -e "  - Stripe keys (optional)"
    echo ""
    echo -e "${YELLOW}Edit server/.env and run this script again.${NC}"
    exit 0
fi

# Check MongoDB connection (optional)
echo -e "${BLUE}Checking database connection...${NC}"
if command_exists mongod; then
    if pgrep -x "mongod" > /dev/null; then
        echo -e "${GREEN}✓ MongoDB is running locally${NC}"
    else
        echo -e "${YELLOW}⚠ MongoDB is not running locally. Make sure your database is accessible.${NC}"
    fi
else
    echo -e "${YELLOW}ℹ MongoDB not installed locally. Using remote database.${NC}"
fi

# Display startup information
echo ""
echo "================================================"
echo -e "${GREEN}Starting TradeZy Development Servers${NC}"
echo "================================================"
echo -e "📦 Backend API: ${BLUE}http://localhost:5001${NC}"
echo -e "💻 Frontend App: ${BLUE}http://localhost:3000${NC}"
echo -e "📚 API Health: ${BLUE}http://localhost:5001/health${NC}"
echo "================================================"
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo ""

# Start both servers using concurrently
npm run dev