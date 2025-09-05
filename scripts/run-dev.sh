#!/bin/bash

# Run development script for Tradezy
echo "🚀 Starting Tradezy Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Check if node_modules exists in both directories
if [ ! -d "server/node_modules" ] || [ ! -d "client/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm run install-all
fi

# Start MongoDB with Docker Compose
echo -e "${GREEN}📦 Starting MongoDB database...${NC}"
docker-compose up -d mongodb mongo-express

# Wait for MongoDB to be ready
echo -e "${YELLOW}⏳ Waiting for MongoDB to be ready...${NC}"
counter=0
until docker exec tradezy-mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
    counter=$((counter+1))
    if [ $counter -gt 30 ]; then
        echo -e "${RED}❌ MongoDB failed to start within 30 seconds${NC}"
        exit 1
    fi
    printf '.'
    sleep 1
done
echo ""

# Check if services are running
if docker-compose ps | grep -q "Exit"; then
    echo -e "${RED}❌ Some services failed to start. Check docker-compose logs.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ MongoDB is ready!${NC}"
echo ""
echo -e "${GREEN}📝 Service URLs:${NC}"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend API: http://localhost:5000"
echo "  - MongoDB Express: http://localhost:8081 (check .env for credentials)"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down...${NC}"
    # Kill all background processes
    kill $(jobs -p) 2>/dev/null
    # Stop Docker containers
    echo -e "${YELLOW}🐳 Stopping Docker containers...${NC}"
    docker-compose down
    echo -e "${GREEN}✨ Cleanup complete!${NC}"
    exit 0
}

# Set up trap for cleanup
trap cleanup SIGINT SIGTERM EXIT

# Start backend in background
echo -e "${GREEN}🔧 Starting backend server...${NC}"
cd server && npm run dev &
BACKEND_PID=$!

# Give backend time to start
sleep 3

# Start frontend in background
echo -e "${GREEN}🎨 Starting frontend application...${NC}"
cd ../client && npm run dev &
FRONTEND_PID=$!

# Wait for all background processes
echo ""
echo -e "${GREEN}✨ Tradezy is running! Press Ctrl+C to stop all services.${NC}"
echo -e "${YELLOW}💡 Tip: Run 'docker-compose logs -f mongodb' in another terminal to see database logs${NC}"

# Keep the script running
wait $BACKEND_PID $FRONTEND_PID