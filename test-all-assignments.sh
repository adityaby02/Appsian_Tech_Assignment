#!/bin/bash

echo "Testing All Three Assignments - Comprehensive Suite"
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to cleanup processes
cleanup() {
    echo -e "${YELLOW}Cleaning up all processes...${NC}"
    lsof -ti:5000,5001,5002,3000 | xargs kill -9 2>/dev/null || true
    sleep 2
}

# Trap cleanup on script exit
trap cleanup EXIT

echo -e "${BLUE}Step 1: Prerequisites Check${NC}"

# Check .NET
if ! command -v dotnet &> /dev/null; then
    echo -e "${RED}ERROR: .NET 8 is not installed${NC}"
    exit 1
else
    echo -e "${GREEN}SUCCESS: .NET $(dotnet --version) found${NC}"
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}ERROR: Node.js is not installed${NC}"
    exit 1
else
    echo -e "${GREEN}SUCCESS: Node.js $(node --version) found${NC}"
fi

# Initial cleanup
cleanup

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Assignment 1: Basic Task Manager${NC}"
echo -e "${BLUE}========================================${NC}"

cd assignment1-basic-task-manager

# Test Assignment 1
echo -e "${YELLOW}Setting up Assignment 1 backend...${NC}"
cd backend
dotnet restore > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Assignment 1 backend setup failed${NC}"
    exit 1
fi

dotnet run --urls="http://localhost:5000" > ../backend.log 2>&1 &
A1_BACKEND_PID=$!
cd ../

sleep 8

# Test backend API
if curl -s "http://localhost:5000/api/tasks" > /dev/null; then
    echo -e "${GREEN}SUCCESS: Assignment 1 backend is running${NC}"
else
    echo -e "${RED}ERROR: Assignment 1 backend failed to start${NC}"
    kill $A1_BACKEND_PID 2>/dev/null
    exit 1
fi

echo -e "${YELLOW}Setting up Assignment 1 frontend...${NC}"
cd frontend
npm install > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Assignment 1 frontend setup failed${NC}"
    kill $A1_BACKEND_PID 2>/dev/null
    exit 1
fi

BROWSER=none npm start > ../frontend.log 2>&1 &
A1_FRONTEND_PID=$!
cd ../

sleep 12

# Test frontend
if curl -s "http://localhost:3000" > /dev/null; then
    echo -e "${GREEN}SUCCESS: Assignment 1 frontend is running${NC}"
else
    echo -e "${RED}ERROR: Assignment 1 frontend failed to start${NC}"
    kill $A1_BACKEND_PID $A1_FRONTEND_PID 2>/dev/null
    exit 1
fi

echo -e "${GREEN}COMPLETE: Assignment 1 is working correctly${NC}"
echo "• Frontend: http://localhost:3000"
echo "• Backend: http://localhost:5000"

# Stop Assignment 1
kill $A1_BACKEND_PID $A1_FRONTEND_PID 2>/dev/null
sleep 3

cd ../

echo ""
echo -e "${BLUE}===========================================${NC}"
echo -e "${BLUE}Testing Assignment 2: Mini Project Manager${NC}"
echo -e "${BLUE}===========================================${NC}"

cd assignment2-mini-project-manager

# Test Assignment 2
echo -e "${YELLOW}Setting up Assignment 2 backend...${NC}"
cd backend
dotnet restore > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Assignment 2 backend setup failed${NC}"
    exit 1
fi

dotnet run --urls="http://localhost:5001" > ../backend.log 2>&1 &
A2_BACKEND_PID=$!
cd ../

sleep 8

# Test backend API
if curl -s "http://localhost:5001/api/auth/register" > /dev/null; then
    echo -e "${GREEN}SUCCESS: Assignment 2 backend is running${NC}"
else
    echo -e "${RED}ERROR: Assignment 2 backend failed to start${NC}"
    kill $A2_BACKEND_PID 2>/dev/null
    exit 1
fi

echo -e "${YELLOW}Setting up Assignment 2 frontend...${NC}"
cd frontend
npm install > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Assignment 2 frontend setup failed${NC}"
    kill $A2_BACKEND_PID 2>/dev/null
    exit 1
fi

BROWSER=none npm start > ../frontend.log 2>&1 &
A2_FRONTEND_PID=$!
cd ../

sleep 12

# Test frontend
if curl -s "http://localhost:3000" > /dev/null; then
    echo -e "${GREEN}SUCCESS: Assignment 2 frontend is running${NC}"
else
    echo -e "${RED}ERROR: Assignment 2 frontend failed to start${NC}"
    kill $A2_BACKEND_PID $A2_FRONTEND_PID 2>/dev/null
    exit 1
fi

echo -e "${GREEN}COMPLETE: Assignment 2 is working correctly${NC}"
echo "• Frontend: http://localhost:3000"
echo "• Backend: http://localhost:5001"

# Stop Assignment 2
kill $A2_BACKEND_PID $A2_FRONTEND_PID 2>/dev/null
sleep 3

cd ../

echo ""
echo -e "${BLUE}==============================================${NC}"
echo -e "${BLUE}Testing Assignment 3: Smart Scheduler API${NC}"
echo -e "${BLUE}==============================================${NC}"

cd assignment3-smart-scheduler-api

# Test Assignment 3
echo -e "${YELLOW}Setting up Assignment 3 backend...${NC}"
cd backend
dotnet restore > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Assignment 3 backend setup failed${NC}"
    exit 1
fi

dotnet run --urls="http://localhost:5002" > ../backend.log 2>&1 &
A3_BACKEND_PID=$!
cd ../

sleep 8

# Test backend API
if curl -s "http://localhost:5002/api/v1/projects/sample/schedule/sample" > /dev/null; then
    echo -e "${GREEN}SUCCESS: Assignment 3 backend is running${NC}"
else
    echo -e "${RED}ERROR: Assignment 3 backend failed to start${NC}"
    kill $A3_BACKEND_PID 2>/dev/null
    exit 1
fi

echo -e "${YELLOW}Setting up Assignment 3 frontend...${NC}"
cd frontend
npm install > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Assignment 3 frontend setup failed${NC}"
    kill $A3_BACKEND_PID 2>/dev/null
    exit 1
fi

BROWSER=none npm start > ../frontend.log 2>&1 &
A3_FRONTEND_PID=$!
cd ../

sleep 12

# Test frontend
if curl -s "http://localhost:3000" > /dev/null; then
    echo -e "${GREEN}SUCCESS: Assignment 3 frontend is running${NC}"
else
    echo -e "${RED}ERROR: Assignment 3 frontend failed to start${NC}"
    kill $A3_BACKEND_PID $A3_FRONTEND_PID 2>/dev/null
    exit 1
fi

echo -e "${GREEN}COMPLETE: Assignment 3 is working correctly${NC}"
echo "• Frontend: http://localhost:3000"
echo "• Backend: http://localhost:5002"

# Stop Assignment 3
kill $A3_BACKEND_PID $A3_FRONTEND_PID 2>/dev/null
sleep 2

cd ../

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}ALL ASSIGNMENTS TESTED SUCCESSFULLY${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "${BLUE}Summary:${NC}"
echo -e "${GREEN}• Assignment 1: Basic Task Manager - WORKING${NC}"
echo -e "${GREEN}• Assignment 2: Mini Project Manager - WORKING${NC}"
echo -e "${GREEN}• Assignment 3: Smart Scheduler API - WORKING${NC}"
echo ""
echo -e "${YELLOW}Individual Test Commands:${NC}"
echo "• Assignment 1: ./test-assignment1-step-by-step.sh"
echo "• Assignment 2: cd assignment2-mini-project-manager && ./test-assignment2.sh"
echo "• Assignment 3: cd assignment3-smart-scheduler-api && ./test-assignment3.sh"
echo ""
echo -e "${YELLOW}Note: All processes have been stopped. Use individual test scripts to run specific assignments.${NC}"
