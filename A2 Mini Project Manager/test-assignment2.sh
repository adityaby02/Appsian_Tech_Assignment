#!/bin/bash

echo "Assignment 2: Mini Project Manager - Testing Script"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to cleanup processes
cleanup() {
    echo -e "${YELLOW}Cleaning up processes...${NC}"
    lsof -ti:5001,3000 | xargs kill -9 2>/dev/null || true
}

# Trap cleanup on script exit
trap cleanup EXIT

echo -e "${BLUE}Starting Assignment 2 Services...${NC}"

# Initial cleanup
cleanup
sleep 2

echo -e "${YELLOW}Setting up backend with JWT authentication...${NC}"
cd backend
dotnet restore > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Backend setup failed${NC}"
    exit 1
fi

echo -e "${YELLOW}Starting backend on port 5001...${NC}"
dotnet run --urls="http://localhost:5001" > ../backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
sleep 8

# Test backend
if curl -s "http://localhost:5001/api/auth/register" > /dev/null; then
    echo -e "${GREEN}SUCCESS: Backend API is running${NC}"
else
    echo -e "${RED}ERROR: Backend failed to start${NC}"
    exit 1
fi

echo "Backend API: http://localhost:5001/api"
echo "Swagger UI: http://localhost:5001/swagger"

echo -e "${YELLOW}Setting up frontend with authentication...${NC}"
cd ../frontend
npm install > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Frontend setup failed${NC}"
    exit 1
fi

echo -e "${YELLOW}Starting frontend on port 3000...${NC}"
BROWSER=none npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 12

# Test frontend
if curl -s "http://localhost:3000" > /dev/null; then
    echo -e "${GREEN}SUCCESS: Frontend App is running${NC}"
else
    echo -e "${RED}ERROR: Frontend failed to start${NC}"
    exit 1
fi

echo "Frontend App: http://localhost:3000"

echo ""
echo -e "${GREEN}SUCCESS: Assignment 2 is running successfully!${NC}"
echo ""
echo -e "${BLUE}Service URLs:${NC}"
echo "• Frontend: http://localhost:3000"
echo "• Backend API: http://localhost:5001/api"
echo "• Swagger UI: http://localhost:5001/swagger"
echo ""
echo -e "${BLUE}API Test Commands:${NC}"
echo "# Register a user"
echo 'curl -X POST http://localhost:5001/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"firstName\":\"Test\",\"lastName\":\"User\"}"'
echo ""
echo "# Login user"
echo 'curl -X POST http://localhost:5001/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"'
echo ""
echo "# Get projects (requires JWT token)"
echo 'curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5001/api/projects'
echo ""
echo "# Create project (requires JWT token)"
echo 'curl -X POST http://localhost:5001/api/projects -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_JWT_TOKEN" -d "{\"title\":\"Test Project\",\"description\":\"A test project\"}"'
echo ""
echo -e "${BLUE}Manual Test Checklist:${NC}"
echo "1. Open http://localhost:3000"
echo "2. Register a new user"
echo "3. Login with credentials"
echo "4. Create a new project"
echo "5. Add tasks to the project"
echo "6. Mark tasks as completed"
echo "7. Test logout and login again"
echo ""
echo -e "${YELLOW}Test User Credentials:${NC}"
echo "Email: test@example.com"
echo "Password: password123"
echo ""
echo -e "${YELLOW}Authentication Flow Test:${NC}"
echo "• User Registration: Create account -> Auto-login"
echo "• Project Creation: Add projects with descriptions"
echo "• Task Management: Create, update, complete, delete tasks"
echo "• User Isolation: Verify users only see their own data"
echo "• JWT Security: Test protected routes and token expiration"
echo ""
echo -e "${YELLOW}WARNING: To stop services, run: ./stop-assignment2.sh${NC}"
echo "Services are running in background. Check logs: backend.log, frontend.log"

# Save PIDs for cleanup script
echo "$BACKEND_PID $FRONTEND_PID" > .assignment2_pids
