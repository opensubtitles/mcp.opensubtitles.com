#!/bin/bash

# Simple deployment script for OpenSubtitles MCP Server

set -e

# Check if we're in a git repository
if [ -d ".git" ]; then
    echo "Updating existing repository..."
    git pull origin master
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

echo "Deployment complete!"
echo ""
echo "Usage options:"
echo "  HTTP Mode (Web Server):  npm start"
echo "  Stdio Mode (Claude):     npm run start:stdio"
echo "  Development HTTP:        npm run dev"
echo "  Development Stdio:       npm run dev:stdio"
echo ""
echo "HTTP server will run on: http://localhost:1620"
echo "Health check at:         http://localhost:1620/health"