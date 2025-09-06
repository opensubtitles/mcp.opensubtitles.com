#!/bin/bash

# Simple deployment script for OpenSubtitles MCP Server

set -e

# Clone or update repository
if [ -d "mcp.opensubtitles.com" ]; then
    echo "Updating existing repository..."
    cd mcp.opensubtitles.com
    git pull origin master
else
    echo "Cloning repository..."
    git clone https://github.com/opensubtitles/mcp.opensubtitles.com.git
    cd mcp.opensubtitles.com
fi

# Install dependencies and build
echo "Installing dependencies..."
npm install

echo "Building project..."
npm run build

echo "Deployment complete! Run with: node dist/index.js"