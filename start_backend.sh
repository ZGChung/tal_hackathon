#!/bin/bash
# Backend startup script
# This script ensures the backend runs from the correct directory

echo "Starting TAL Hackathon Backend..."
echo "Make sure you have activated your conda environment (e.g., conda activate rl)"

# Check if we're in the project root
if [ ! -d "backend" ]; then
    echo "Error: Please run this script from the project root directory"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "backend/__pycache__" ] && [ ! -f "backend/database.db" ]; then
    echo "Installing backend dependencies..."
    cd backend
    pip install -r requirements.txt
    cd ..
fi

# Run uvicorn from project root
echo "Starting uvicorn server..."
echo "Backend will be available at http://localhost:8000"
echo "API docs will be available at http://localhost:8000/docs"
echo ""
uvicorn backend.main:app --reload

