# OpenSubtitles MCP Server

A TypeScript/Node.js-based MCP (Model Context Protocol) server for OpenSubtitles API integration. This server provides subtitle search and download functionality with a freemium model, using the Kong gateway at api.opensubtitles.com for all API management.

## Features

- **Comprehensive Search**: Search subtitles using all OpenSubtitles API parameters (title, IMDB ID, TMDB ID, file hash, etc.)
- **Multiple Download Formats**: Support for SRT, ASS, and VTT subtitle formats
- **File Hash Calculation**: Calculate OpenSubtitles hash for exact movie file matching
- **Rate Limiting**: Integrated with Kong gateway for proper rate limiting
- **Freemium Model**: Unlimited search, downloads limited by API key status

## Installation

### Quick Start with npx (Recommended)

```bash
npx @opensubtitles/mcp-server
```

### Install via mcp-get

```bash
npx @michaellatman/mcp-get@latest install @opensubtitles/mcp-server
```

### Claude Desktop Integration

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "opensubtitles": {
      "command": "npx",
      "args": ["-y", "@opensubtitles/mcp-server"],
      "env": {
        "OPENSUBTITLES_USER_KEY": "your_api_key_here"
      }
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

### Development with Auto-rebuild
```bash
npm run watch
```

### Testing
```bash
# Run evaluation tests
npm test

# Use MCP Inspector for debugging
npm run inspector
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