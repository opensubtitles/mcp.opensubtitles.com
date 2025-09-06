# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript/Node.js-based MCP (Model Context Protocol) server for OpenSubtitles API integration. The server provides subtitle search and download functionality with a freemium model, using the existing Kong gateway at api.opensubtitles.com for API management.

## Commands

### Development Commands
```bash
npm install                # Install dependencies
npm run build              # Build TypeScript to JavaScript
npm run watch              # Development with auto-rebuild
npm run dev                # Build and run the server
npm test                   # Run tests (currently placeholder)
npm run test:evals         # Run MCP evaluation tests (when implemented)
npm run inspector          # Debug with MCP Inspector
npm run prepublish         # Build before publishing
```

### Testing and Debugging
```bash
npx @modelcontextprotocol/inspector dist/index.js  # MCP Inspector for debugging
npx mcp-eval src/evals/evals.ts dist/index.js       # Run evaluation tests
```

## Architecture

### Core Structure (Planned)
- **MCP Server**: TypeScript implementation using @modelcontextprotocol/sdk
- **API Integration**: All requests go through Kong gateway (api.opensubtitles.com)
- **Rate Limiting**: Handled by Kong configuration
- **Deployment**: mcp.opensubtitles.com domain
- **Distribution**: NPM package @opensubtitles/mcp-server

### Planned Directory Structure
```
src/
├── index.ts               # Main MCP server entry point
├── server.ts              # MCP server implementation
├── api-client.ts          # Kong gateway client wrapper
├── tools/                 # MCP tool implementations
│   ├── search-subtitles.ts
│   ├── download-subtitle.ts
│   └── calculate-file-hash.ts
└── utils/                 # Helper functions
    ├── hash-calculator.ts
    └── subtitle-parser.ts
```

### MCP Tools to Implement

1. **search_subtitles**: Search with all OpenSubtitles API parameters (query, imdb_id, tmdb_id, moviehash, etc.)
2. **download_subtitle**: Download subtitle content (rate limited via Kong)
3. **calculate_file_hash**: Calculate OpenSubtitles hash for movie files

## Technical Details

### Dependencies
- @modelcontextprotocol/sdk - MCP TypeScript SDK
- axios - HTTP client for Kong gateway communication
- zod - Schema validation and type safety
- dotenv - Environment configuration
- crypto - File hashing (built-in Node.js)

### API Integration
- Base URL: https://api.opensubtitles.com (Kong gateway)
- Rate limiting: Managed by Kong (unlimited search, limited downloads)
- Authentication: User API keys passed through Kong

### Business Model
- Anonymous users: Unlimited search, 0 downloads
- API key users: Full OpenSubtitles API access
- Future premium: Server-side API key with higher limits

## Configuration

### Environment Variables
```
OPENSUBTITLES_API_BASE=https://api.opensubtitles.com
NODE_ENV=production
PORT=1620
```

### TypeScript Configuration
- Target: ES2022
- Module: ESNext
- Strict mode enabled
- Output directory: dist/

## Installation and Usage

### NPM Package Usage
```bash
npx @opensubtitles/mcp-server                    # Direct usage
npx @michaellatman/mcp-get@latest install @opensubtitles/mcp-server  # Via mcp-get
```

### Claude Desktop Integration
```json
{
  "mcpServers": {
    "opensubtitles": {
      "command": "npx",
      "args": ["-y", "@opensubtitles/mcp-server"]
    }
  }
}
```

## Development Notes

- Complete TypeScript MCP server implementation with 3 tools
- Kong gateway handles all rate limiting and API management
- Use MCP Inspector for debugging (stdio communication)
- Follow security best practices for API key handling
- Supports both HTTP mode (port 1620) and stdio mode for Claude Desktop

## Publishing to NPM

To publish this package to NPM registry so users can use `npx @opensubtitles/mcp-server`:

### Prerequisites
1. Ensure you have NPM account with access to @opensubtitles organization
2. Login to NPM: `npm login`
3. Verify build works: `npm run build`

### Publishing Steps
```bash
# Ensure clean build
npm run build

# Test package locally
npm pack
tar -tf opensubtitles-mcp-server-1.0.0.tgz

# Publish to NPM
npm publish

# Verify publication
npm view @opensubtitles/mcp-server
```

### After Publishing
Users can then use:
```bash
npx @opensubtitles/mcp-server
```

And Claude Desktop config becomes:
```json
{
  "mcpServers": {
    "opensubtitles": {
      "command": "npx",
      "args": ["-y", "@opensubtitles/mcp-server"],
      "env": {
        "MCP_MODE": "stdio"
      }
    }
  }
}
```

### Current Status
- Package is ready for publication
- Currently users must install from GitHub: `npx https://github.com/opensubtitles/mcp.opensubtitles.com.git`
- HTTP server available at: https://mcp.opensubtitles.com