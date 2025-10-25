#!/bin/bash

echo "Stopping Assignment 2 Services"
echo "==============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Kill processes on Assignment 2 ports
echo -e "${YELLOW}Stopping backend (port 5001)...${NC}"
lsof -ti:5001 | xargs kill -9 2>/dev/null || true

echo -e "${YELLOW}Stopping frontend (port 3000)...${NC}"
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Check if PID file exists and kill those processes too
if [ -f ".assignment2_pids" ]; then
    echo -e "${YELLOW}Cleaning up saved process IDs...${NC}"
    PIDS=$(cat .assignment2_pids)
    for pid in $PIDS; do
        kill -9 $pid 2>/dev/null || true
    done
    rm .assignment2_pids
fi

# Wait for processes to terminate
sleep 2

# Verify ports are free
SUCCESS=true
if lsof -i:5001 >/dev/null 2>&1; then
    echo -e "${RED}WARNING: Port 5001 still in use${NC}"
    SUCCESS=false
else
    echo -e "${GREEN}SUCCESS: Port 5001 is free${NC}"
fi

if lsof -i:3000 >/dev/null 2>&1; then
    echo -e "${RED}WARNING: Port 3000 still in use${NC}"
    SUCCESS=false
else
    echo -e "${GREEN}SUCCESS: Port 3000 is free${NC}"
fi

if [ "$SUCCESS" = true ]; then
    echo -e "${GREEN}Assignment 2 services stopped successfully${NC}"
else
    echo -e "${YELLOW}Some processes may still be running. Try restarting your terminal if needed.${NC}"
fi

echo "Log files: backend.log, frontend.log"
