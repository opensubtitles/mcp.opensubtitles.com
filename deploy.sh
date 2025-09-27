#!/bin/bash

# Simple deployment script for OpenSubtitles MCP Server

set -e

# Check if we're in a git repository
if [ -d ".git" ]; then
    echo "Updating existing repository..."
    
    # Check for local changes
    if ! git diff-index --quiet HEAD --; then
        echo "Warning: Local changes detected. Stashing them..."
        git stash push -m "Auto-stash before deployment $(date)"
    fi
    
    # Fetch latest changes
    git fetch origin
    
    # Force reset to match origin/master exactly
    echo "Resetting to match origin/master..."
    git reset --hard origin/master
    
    # Clean up any untracked files
    git clean -fd
else
    echo "Initializing repository in current directory..."
    git init
    git remote add origin https://github.com/opensubtitles/mcp.opensubtitles.com.git
    git fetch origin
    git checkout -b master
    git reset --hard origin/master
fi

# Install dependencies and build
echo "Installing dependencies..."
npm install

echo "Building project..."
npm run build

echo "Restarting server..."

# Find the PID of the old running server
# The -f flag matches against the full argument list, which is more specific
PID=$(pgrep -f 'node dist/index.js')

if [ ! -z "$PID" ]; then
    echo "Found old server process with PID: $PID. Stopping it..."
    kill $PID
    # Wait a moment for the process to die gracefully
    sleep 2
else
    echo "No old server process found running."
fi

echo "Starting new server in the background..."
nohup npm start &

echo "Deployment complete. Server is running."