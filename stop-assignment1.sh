#!/bin/bash

echo "Stopping Assignment 1 Services..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Kill processes on Assignment 1 ports
echo -e "${YELLOW}Stopping backend (port 5000)...${NC}"
lsof -ti:5000 | xargs kill -9 2>/dev/null || true

echo -e "${YELLOW}Stopping frontend (port 3000)...${NC}"
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Check if PID file exists and kill those processes too
if [ -f "assignment1-basic-task-manager/assignment1_pids.txt" ]; then
    echo -e "${YELLOW}Cleaning up saved process IDs...${NC}"
    PIDS=$(cat assignment1-basic-task-manager/assignment1_pids.txt)
    for pid in $PIDS; do
        kill -9 $pid 2>/dev/null || true
    done
    rm assignment1-basic-task-manager/assignment1_pids.txt
fi

# Wait a moment for processes to terminate
sleep 2

# Verify ports are free
if lsof -i:5000 >/dev/null 2>&1; then
    echo -e "${RED}WARNING: Port 5000 still in use${NC}"
else
    echo -e "${GREEN}SUCCESS: Port 5000 is free${NC}"
fi

if lsof -i:3000 >/dev/null 2>&1; then
    echo -e "${RED}WARNING: Port 3000 still in use${NC}"
else
    echo -e "${GREEN}SUCCESS: Port 3000 is free${NC}"
fi

echo -e "${GREEN}Assignment 1 services stopped${NC}"
echo "Log files: assignment1-basic-task-manager/backend.log, assignment1-basic-task-manager/frontend.log"
