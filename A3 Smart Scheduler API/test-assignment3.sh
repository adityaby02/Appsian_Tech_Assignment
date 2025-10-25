#!/bin/bash

echo "Assignment 3: Smart Scheduler API - Testing Script"
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
    lsof -ti:5002,3000 | xargs kill -9 2>/dev/null || true
}

# Trap cleanup on script exit
trap cleanup EXIT

echo -e "${BLUE}Starting Assignment 3 Services...${NC}"

# Initial cleanup
cleanup
sleep 2

echo -e "${YELLOW}Setting up backend with smart scheduler...${NC}"
cd backend
dotnet restore > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Backend setup failed${NC}"
    exit 1
fi

echo -e "${YELLOW}Starting backend on port 5002...${NC}"
dotnet run --urls="http://localhost:5002" > ../backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
sleep 8

# Test backend
if curl -s "http://localhost:5002/api/v1/projects/sample/schedule/sample" > /dev/null; then
    echo -e "${GREEN}SUCCESS: Backend API is running${NC}"
else
    echo -e "${RED}ERROR: Backend failed to start${NC}"
    exit 1
fi

echo "Backend API: http://localhost:5002/api"
echo "Swagger UI: http://localhost:5002/swagger"
echo "Smart Scheduler: http://localhost:5002/api/v1/projects/{projectId}/schedule"

echo -e "${YELLOW}Setting up frontend with smart scheduler UI...${NC}"
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
echo -e "${GREEN}SUCCESS: Assignment 3 is running successfully!${NC}"
echo ""
echo -e "${BLUE}Service URLs:${NC}"
echo "• Frontend: http://localhost:3000"
echo "• Backend API: http://localhost:5002/api"
echo "• Swagger UI: http://localhost:5002/swagger"
echo ""
echo -e "${BLUE}Smart Scheduler API Test Commands:${NC}"
echo "# Get sample schedule format"
echo 'curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5002/api/v1/projects/sample/schedule/sample'
echo ""
echo "# Generate smart schedule (replace PROJECT_ID and JWT_TOKEN)"
echo 'curl -X POST http://localhost:5002/api/v1/projects/{PROJECT_ID}/schedule \'
echo '  -H "Content-Type: application/json" \'
echo '  -H "Authorization: Bearer YOUR_JWT_TOKEN" \'
echo '  -d '"'"'{'
echo '    "tasks": ['
echo '      {'
echo '        "title": "Design API",'
echo '        "estimatedHours": 5,'
echo '        "dueDate": "2025-10-26T00:00:00Z",'
echo '        "dependencies": []'
echo '      },'
echo '      {'
echo '        "title": "Implement Backend",'
echo '        "estimatedHours": 12,'
echo '        "dueDate": "2025-10-28T00:00:00Z",'
echo '        "dependencies": ["Design API"]'
echo '      }'
echo '    ]'
echo '  }'"'"''
echo ""
echo -e "${BLUE}Manual Test Checklist:${NC}"
echo "1. Open http://localhost:3000"
echo "2. Register/Login user"
echo "3. Create a project"
echo "4. Open project details"
echo "5. Click 'Smart Scheduler' button"
echo "6. Load sample data"
echo "7. Generate schedule"
echo "8. Review recommended order and conflicts"
echo ""
echo -e "${YELLOW}Smart Scheduler Features:${NC}"
echo "• Dependency resolution with cycle detection"
echo "• Topological sorting for optimal task ordering"
echo "• Conflict detection for impossible deadlines"
echo "• Priority calculation based on dependencies"
echo "• Interactive UI with sample data"
echo ""
echo -e "${YELLOW}Algorithm Testing Scenarios:${NC}"
echo "• Basic Dependency Chain: Task A -> Task B -> Task C"
echo "• Parallel Dependencies: Task A -> [Task B, Task C] -> Task D"
echo "• Circular Dependency Detection: Task A -> Task B -> Task A (should error)"
echo "• Impossible Deadlines: 40-hour task due in 1 day (should warn)"
echo "• Complex Networks: Multiple interdependent task chains"
echo ""
echo -e "${YELLOW}WARNING: To stop services, run: ./stop-assignment3.sh${NC}"
echo "Services are running in background. Check logs: backend.log, frontend.log"

# Save PIDs for cleanup script
echo "$BACKEND_PID $FRONTEND_PID" > .assignment3_pids
