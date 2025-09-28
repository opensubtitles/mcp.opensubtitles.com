# OpenSubtitles MCP Server Dockerfile
FROM node:18-alpine

# Install development dependencies
RUN apk add --no-cache git

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for development) without running build
RUN npm install --ignore-scripts

# Create non-root user (but allow file access)
RUN addgroup -g 1001 -S nodejs
RUN adduser -S mcpserver -u 1001 -G nodejs

# Change ownership of the app directory
RUN chown -R mcpserver:nodejs /app

# Switch to non-root user
USER mcpserver

# Expose port
EXPOSE 1620

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); const options = { host: 'localhost', port: 1620, path: '/health', timeout: 2000 }; const req = http.request(options, (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }); req.on('error', () => process.exit(1)); req.end();"

# Set environment variables
ENV NODE_ENV=development
ENV MCP_MODE=http
ENV PORT=1620

# Development startup - run HTTP server directly
CMD ["sh", "-c", "npm run build && MCP_MODE=http PORT=1620 node dist/index.js"]