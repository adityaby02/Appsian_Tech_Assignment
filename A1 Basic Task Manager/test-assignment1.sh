#!/bin/bash

echo "Assignment 1: Basic Task Manager - Testing Script"
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to cleanup processes
cleanup() {
    echo -e "${YELLOW}Cleaning up processes...${NC}"
    lsof -ti:5000,3000 | xargs kill -9 2>/dev/null || true
}

# Trap cleanup on script exit
trap cleanup EXIT

echo -e "${BLUE}Starting Assignment 1 Services...${NC}"

# Initial cleanup
cleanup
sleep 2

echo -e "${YELLOW}Setting up backend...${NC}"
cd backend
dotnet restore > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Backend setup failed${NC}"
    exit 1
fi

echo -e "${YELLOW}Starting backend on port 5000...${NC}"
dotnet run --urls="http://localhost:5000" > ../backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
sleep 8

# Test backend
if curl -s "http://localhost:5000/api/tasks" > /dev/null; then
    echo -e "${GREEN}SUCCESS: Backend API is running${NC}"
else
    echo -e "${RED}ERROR: Backend failed to start${NC}"
    exit 1
fi

echo "Backend API: http://localhost:5000/api"
echo "Swagger UI: http://localhost:5000/swagger"

echo -e "${YELLOW}Setting up frontend...${NC}"
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
echo -e "${GREEN}SUCCESS: Assignment 1 is running successfully!${NC}"
echo ""
echo -e "${BLUE}Service URLs:${NC}"
echo "• Frontend: http://localhost:3000"
echo "• Backend API: http://localhost:5000/api"
echo "• Swagger UI: http://localhost:5000/swagger"
echo ""
echo -e "${BLUE}API Test Commands:${NC}"
echo "# Get all tasks"
echo "curl http://localhost:5000/api/tasks"
echo ""
echo "# Create a task"  
echo 'curl -X POST http://localhost:5000/api/tasks -H "Content-Type: application/json" -d '"'"'{"description":"Test Task","isCompleted":false}'"'"''
echo ""
echo "# Update a task"
echo 'curl -X PUT http://localhost:5000/api/tasks/{id} -H "Content-Type: application/json" -d '"'"'{"description":"Updated Task","isCompleted":true}'"'"''
echo ""
echo -e "${BLUE}Manual Test Checklist:${NC}"
echo "1. Open http://localhost:3000"
echo "2. Add a new task"
echo "3. Mark task as completed"
echo "4. Test filter buttons (All/Active/Completed)"
echo "5. Delete the task"
echo "6. Test offline mode (disconnect network)"
echo ""
echo -e "${YELLOW}Test User Actions:${NC}"
echo "• Task Creation: Add tasks with various descriptions"
echo "• Task Completion: Toggle completed status"
echo "• Task Filtering: Switch between All/Active/Completed views"
echo "• Task Deletion: Remove individual tasks"
echo "• Offline Support: Disconnect network and verify localStorage backup"
echo ""
echo -e "${YELLOW}WARNING: To stop services, run: ./stop-assignment1.sh${NC}"
echo "Services are running in background. Check logs: backend.log, frontend.log"

# Save PIDs for cleanup script
echo "$BACKEND_PID $FRONTEND_PID" > assignment1_pids.txt
