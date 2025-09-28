# OpenSubtitles MCP Server

A TypeScript/Node.js-based MCP (Model Context Protocol) server for OpenSubtitles API integration. This server provides subtitle search and download functionality with a freemium model, using the Kong gateway at api.opensubtitles.com for all API management.

## Features

- **Comprehensive Search**: Search subtitles using all OpenSubtitles API parameters (title, IMDB ID, TMDB ID, file hash, etc.)
- **Multiple Download Formats**: Support for SRT, ASS, and VTT subtitle formats
- **File Hash Calculation**: Calculate OpenSubtitles hash for exact movie file matching
- **Rate Limiting**: Integrated with Kong gateway for proper rate limiting
- **Freemium Model**: Unlimited search, downloads limited by API key status

## Installation & Usage

The OpenSubtitles MCP Server supports **three modes**:

- **HTTP Mode**: Web server for n8n workflows, browser access, and HTTP integrations
- **Stdio Mode (Local)**: Run locally for Claude Desktop integration  
- **Stdio Mode (Remote)**: Connect to hosted server at mcp.opensubtitles.com

### 1. HTTP Mode (Recommended for Server Deployment)

Run as a web server on port 1620:

```bash
# Install dependencies
npm install
npm run build

# Start HTTP server
npm start
# or
PORT=1620 MCP_MODE=http node dist/index.js
```

**Access points:**
- **Health Check:** `http://localhost:1620/health`
- **API Info:** `http://localhost:1620/`
- **Web Interface:** `http://localhost:1620/web` (Browser UI - No Node.js required!)
- **Direct API:** `http://localhost:1620/proxy` (POST requests)
- **Tools List:** `http://localhost:1620/tools` (Schema discovery)
- **MCP Endpoint:** `http://localhost:1620/sse` (Server-Sent Events)

### 2. Stdio Mode (For Claude Desktop)

#### Quick Start with npx
```bash
npx @opensubtitles/mcp-server
```

#### Install via mcp-get
```bash
npx @michaellatman/mcp-get@latest install @opensubtitles/mcp-server
```

#### Claude Code Integration
For `claude-code` environments, you can add the server using the `claude mcp add-json` command:
```bash
claude mcp add-json "opensubtitles" '{"command":"npx","args":["-y","@opensubtitles/mcp-server@latest"],"env":{"MCP_MODE":"stdio","LOG_LEVEL":"info"},"disabled":false}'
```

#### Claude Desktop Integration - Local Mode
Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "opensubtitles": {
      "command": "npx",
      "args": ["-y", "@opensubtitles/mcp-server"],
      "env": {
        "MCP_MODE": "stdio",
        "OPENSUBTITLES_USER_KEY": "your_api_key_here"
      }
    }
  }
}
```

#### Claude Desktop Integration - Remote Mode
Connect to the hosted server at mcp.opensubtitles.com:

```json
{
  "mcpServers": {
    "opensubtitles": {
      "command": "npx",
      "args": ["-y", "@opensubtitles/mcp-server", "remote-proxy.js"]
    }
  }
}
```

Or using the dedicated remote command:

```json
{
  "mcpServers": {
    "opensubtitles": {
      "command": "npx",
      "args": ["-y", "mcp-opensubtitles-remote"]
    }
  }
}
```

## MCP Tools

### 1. search_subtitles

Search for subtitles with comprehensive parameter support:

**Parameters:**
- `query` (string): Text search query
- `imdb_id` (number): IMDB ID for exact matching
- `tmdb_id` (number): TMDB ID for exact matching
- `parent_imdb_id` (number): Parent IMDB ID for TV series
- `parent_tmdb_id` (number): Parent TMDB ID for TV series
- `season_number` (number): Season number for TV episodes
- `episode_number` (number): Episode number for TV episodes
- `year` (number): Release year
- `moviehash` (string): OpenSubtitles file hash for exact matching
- `moviebytesize` (number): File size in bytes for hash matching
- `languages` (string): Comma-separated language codes (e.g., 'en,es,fr')
- `machine_translated` (string): Include machine translated subtitles
- `ai_translated` (string): Include AI translated subtitles
- `hearing_impaired` (string): Include hearing impaired subtitles
- `foreign_parts_only` (string): Include foreign parts only
- `trusted_sources` (string): Only trusted sources
- `order_by` (string): Sort order
- `order_direction` (string): Sort direction (asc/desc)

**Example:**
```typescript
await mcpClient.callTool("search_subtitles", {
  query: "The Matrix",
  year: 1999,
  languages: "en"
});
```

### 2. download_subtitle

Download subtitle content by ID:

**Parameters:**
- `subtitle_id` (string, required): Subtitle ID from search results
- `format` (string): Subtitle format (srt, ass, vtt) - defaults to 'srt'
- `user_api_key` (string): Optional user API key for authenticated downloads

**Example:**
```typescript
await mcpClient.callTool("download_subtitle", {
  subtitle_id: "123456",
  format: "srt",
  user_api_key: "your_api_key"
});
```

### 3. calculate_file_hash

Calculate OpenSubtitles hash for local movie files:

**Parameters:**
- `file_path` (string, required): Path to the movie file

**Example:**
```typescript
await mcpClient.callTool("calculate_file_hash", {
  file_path: "/path/to/movie.mkv"
});
```

## Usage Examples

### Search by Movie Title
```typescript
await mcpClient.callTool("search_subtitles", {
  query: "Inception",
  year: 2010,
  languages: "en"
});
```

### Search by File Hash
```typescript
// First calculate the hash
const hashResult = await mcpClient.callTool("calculate_file_hash", {
  file_path: "/path/to/inception.mkv"
});

// Then search using the hash
await mcpClient.callTool("search_subtitles", {
  moviehash: "8e245d9679d31e12",
  moviebytesize: 12909756
});
```

### Search TV Show Episodes
```typescript
await mcpClient.callTool("search_subtitles", {
  parent_imdb_id: 944947, // Game of Thrones
  season_number: 1,
  episode_number: 5,
  languages: "en"
});
```

## n8n Workflow Integration

The OpenSubtitles MCP Server has **native n8n MCP client support** for seamless workflow automation. Connect directly to the MCP server using n8n's built-in MCP client tools.

### 1. Start Server in HTTP Mode

First, start the MCP server in HTTP mode:

```bash
# Option 1: Use npm script (recommended)
npm start

# Option 2: Direct command with custom port
MCP_MODE=http PORT=1620 node dist/index.js

# Option 3: Using environment variables
export MCP_MODE=http
export PORT=1620
node dist/index.js
```

The server will be available at:
- **Base URL**: `http://localhost:1620`
- **Health Check**: `http://localhost:1620/health`
- **MCP Endpoint**: `http://localhost:1620/message` (Streamable HTTP)
- **Force JSON**: `http://localhost:1620/json` (Plain JSON for debugging)
- **Debug Info**: `http://localhost:1620/debug` (Server diagnostics)
- **Legacy MCP**: `http://localhost:1620/sse` (Server-Sent Events)

### 2. n8n MCP Client Configuration

#### Using n8n Native MCP Client

Configure the n8n MCP Client Tool node:

- **Server URL**: `http://localhost:1620/message` (or your server URL)
- **Transport**: HTTP Streamable  
- **Protocol**: Model Context Protocol (MCP)

#### Search Subtitles with MCP Client

Configure the MCP Client node with these parameters:

```json
{
  "tool": "search_subtitles",
  "arguments": {
    "query": "The Matrix", 
    "year": 1999,
    "languages": "en"
  }
}
```

#### Alternative: Direct HTTP Request

For manual HTTP integration, use HTTP Request node:

```json
{
  "method": "POST",
  "url": "http://localhost:1620/message",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "search_subtitles",
      "arguments": {
        "query": "The Matrix",
        "year": 1999,
        "languages": "en"
      }
    }
  }
}
```

#### Download Subtitle with MCP Client

```json
{
  "tool": "download_subtitle",
  "arguments": {
    "file_id": 123456,
    "user_api_key": "{{ $env.OPENSUBTITLES_API_KEY }}"
  }
}
```

#### Calculate File Hash with MCP Client

```json
{
  "tool": "calculate_file_hash",
  "arguments": {
    "file_path": "/path/to/movie.mkv"
  }
}
```

### 3. n8n Workflow Examples

#### Basic Search Workflow
1. **MCP Client Tool**: Search for subtitles using movie title
2. **Code Node**: Parse search results and extract file IDs
3. **MCP Client Tool**: Download best matching subtitle
4. **File System Node**: Save subtitle to disk

#### Automated Processing Workflow
1. **File Trigger**: Monitor folder for new movie files
2. **MCP Client Tool**: Calculate file hash
3. **MCP Client Tool**: Search subtitles by hash for exact match
4. **Conditional Node**: Check if subtitles found
5. **MCP Client Tool**: Download subtitle if found
6. **File System Node**: Save subtitle next to movie file

#### Benefits of Native MCP Integration
- **Auto-discovery**: Tools are automatically discovered via MCP protocol
- **Type Safety**: Full schema validation for tool arguments
- **Error Handling**: Proper MCP error responses
- **Tool Documentation**: Inline help and parameter descriptions
- **JSON Compatibility**: Automatic plain JSON responses for n8n clients
- **Debug Support**: Built-in debugging endpoints for troubleshooting

#### Troubleshooting n8n Integration

If you encounter JSON parsing errors:

1. **Try Force JSON Endpoint**: Use `http://localhost:1620/json` instead of `/message`
2. **Check Debug Info**: Visit `http://localhost:1620/debug` to verify server status
3. **Verify User-Agent**: Server auto-detects n8n clients (node, n8n, langchain, mcpClientTool)
4. **Check Logs**: Look for "Sending plain JSON response for n8n compatibility" messages

### 4. Environment Variables for n8n

Set these environment variables in your n8n instance:

```bash
# OpenSubtitles API Key (optional but recommended)
OPENSUBTITLES_API_KEY=your_api_key_here

# MCP Server URL (if running on different host/port)
MCP_SERVER_URL=http://localhost:1620
```

### 5. Response Format

All n8n HTTP requests will receive JSON-RPC 2.0 responses:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Search results or download data..."
      }
    ]
  }
}
```

### 6. Error Handling in n8n

Add error handling nodes to catch common issues:

- **Rate Limit (429)**: Retry after delay or notify user to get API key
- **Invalid API Key (401)**: Alert administrator to check API key
- **Network Errors**: Retry mechanism or alternative endpoint
- **File Not Found**: Skip processing or log error

### 7. Production Deployment

For production n8n workflows:

```bash
# Run MCP server as background service
nohup MCP_MODE=http PORT=1620 node dist/index.js > mcp-server.log 2>&1 &

# Or use PM2 for process management
pm2 start dist/index.js --name "opensubtitles-mcp" -- --env MCP_MODE=http PORT=1620

# Or use Docker
docker run -d -p 1620:1620 -e MCP_MODE=http opensubtitles-mcp-server
```

This integration allows you to automate subtitle operations in n8n workflows, perfect for media processing pipelines, batch subtitle downloads, or automated movie library management.

## Web Browser Interface

For users who don't want to install Node.js or configure MCP, we provide a **full web interface**:

### Access
- **URL**: `http://mcp.opensubtitles.com/web`
- **Requirements**: Any modern web browser
- **No Installation**: Works immediately without setup

### Features
- **🔍 Search Subtitles**: Search by title, year, IMDB ID, languages
- **💾 Download Subtitles**: Download by file ID from search results
- **🔢 Calculate Hash**: Generate OpenSubtitles hash for movie files
- **📊 Real-time Results**: Instant feedback with formatted results
- **🎯 User-friendly**: Clean interface with loading states and error handling

### Direct HTTP API

For developers and automation:

```bash
# Search subtitles
curl -X POST http://mcp.opensubtitles.com/proxy \
  -H "Content-Type: application/json" \
  -d '{"tool": "search_subtitles", "arguments": {"query": "Matrix", "year": 1999}}'

# Download subtitle
curl -X POST http://mcp.opensubtitles.com/proxy \
  -H "Content-Type: application/json" \
  -d '{"tool": "download_subtitle", "arguments": {"file_id": 123456}}'

# List available tools
curl http://mcp.opensubtitles.com/tools
```

## Rate Limiting & API Keys

### Anonymous Usage
- **Search**: Unlimited
- **Downloads**: 0 per day (Kong enforced)

### With OpenSubtitles API Key
- **Search**: Unlimited  
- **Downloads**: Based on your OpenSubtitles account quota

### Getting an API Key
1. Register at [OpenSubtitles.com](https://www.opensubtitles.com/api)
2. Get your free API key
3. Set the `OPENSUBTITLES_USER_KEY` environment variable or pass it in tool calls

## Development

### Prerequisites
- Node.js 18.0.0 or higher
- TypeScript

### Setup
```bash
git clone <repository>
cd mcp-opensubtitles
npm install
```

### Building
```bash
npm run build
```

### Development Commands
```bash
# HTTP Mode (Web Server)
npm run dev                # Build and run HTTP server on port 1620
npm start                  # Run built HTTP server

# Stdio Mode (Claude Desktop)
npm run dev:stdio          # Build and run stdio mode
npm start:stdio            # Run built stdio mode

# Development with Auto-rebuild
npm run watch
```

### Testing
```bash
# For HTTP mode testing
curl http://localhost:1620/health        # Health check
curl http://localhost:1620/             # API info

# For Stdio mode testing
npm test                   # Run evaluation tests
npm run inspector          # Debug with MCP Inspector (stdio mode)

# MCP evaluation tests
npx mcp-eval evals/evals.ts dist/index.js
```

### Environment Variables
```bash
OPENSUBTITLES_API_BASE=https://api.opensubtitles.com  # Default Kong gateway
NODE_ENV=production
PORT=1620
OPENSUBTITLES_USER_KEY=your_api_key_here  # Optional
```

## Architecture

The server uses a clean architecture with the following components:

- **MCP Server Core** (`src/server.ts`): Main MCP protocol implementation
- **Kong API Client** (`src/api-client.ts`): HTTP client for Kong gateway communication
- **Tools** (`src/tools/`): Individual tool implementations
- **Utilities** (`src/utils/`): Helper functions for hash calculation

All API requests go through the Kong gateway at `api.opensubtitles.com`, which handles:
- Rate limiting enforcement
- API key validation
- Request routing to OpenSubtitles API
- Error handling and responses

## Error Handling

The server provides helpful error messages for common scenarios:

- **Rate Limit Exceeded**: "Download limit reached. Get your free API key at opensubtitles.com/api"
- **Invalid API Key**: "Invalid API key. Please check your OpenSubtitles API key"
- **File Not Found**: Clear file path validation messages
- **Network Errors**: Descriptive network connectivity messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- **Issues**: Report bugs and feature requests on GitHub
- **API Documentation**: [OpenSubtitles API Docs](https://opensubtitles.stoplight.io/docs/opensubtitles-api/e3750fd63a100-getting-started)
- **MCP Protocol**: [Model Context Protocol Documentation](https://modelcontextprotocol.io/)