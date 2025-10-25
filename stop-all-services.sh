#!/bin/bash

echo "Stopping All Assignment Services"
echo "==============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Stopping all services on ports 3000, 5000, 5001, 5002...${NC}"

# Kill all processes on our ports
echo -e "${YELLOW}Terminating backend services...${NC}"
lsof -ti:5000,5001,5002 | xargs kill -9 2>/dev/null || true

echo -e "${YELLOW}Terminating frontend services...${NC}"
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Kill any remaining dotnet processes
echo -e "${YELLOW}Cleaning up .NET processes...${NC}"
pkill -f "dotnet.*assignment" 2>/dev/null || true

# Kill any remaining npm processes
echo -e "${YELLOW}Cleaning up Node.js processes...${NC}"
pkill -f "npm.*start" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true

# Clean up PID files
echo -e "${YELLOW}Removing PID files...${NC}"
rm -f assignment1-basic-task-manager/assignment1_pids.txt 2>/dev/null || true
rm -f assignment2-mini-project-manager/.assignment2_pids 2>/dev/null || true
rm -f assignment3-smart-scheduler-api/.assignment3_pids 2>/dev/null || true

# Wait for processes to terminate
sleep 3

# Verify all ports are free
PORTS_STATUS=""
for port in 3000 5000 5001 5002; do
    if lsof -i:$port >/dev/null 2>&1; then
        echo -e "${RED}WARNING: Port $port still in use${NC}"
        PORTS_STATUS="PARTIAL"
    else
        echo -e "${GREEN}SUCCESS: Port $port is free${NC}"
    fi
done

if [ "$PORTS_STATUS" = "PARTIAL" ]; then
    echo -e "${YELLOW}Some ports are still in use. You may need to restart your terminal.${NC}"
else
    echo -e "${GREEN}All services stopped successfully${NC}"
fi

echo ""
echo -e "${BLUE}Service Status:${NC}"
echo "• Assignment 1 (ports 3000, 5000): STOPPED"
echo "• Assignment 2 (ports 3000, 5001): STOPPED" 
echo "• Assignment 3 (ports 3000, 5002): STOPPED"
echo ""
echo -e "${YELLOW}To restart services, use individual test scripts:${NC}"
echo "• ./test-assignment1-step-by-step.sh"
echo "• cd assignment2-mini-project-manager && ./test-assignment2.sh"
echo "• cd assignment3-smart-scheduler-api && ./test-assignment3.sh"
