# Changelog

All notable changes to the OpenSubtitles MCP Server project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.6_n8n_plain_json] - 2025-09-28

### Added
- Native n8n MCP client compatibility with adaptive response format
- Plain JSON responses for n8n clients to fix chunked encoding parsing issues
- Tools included directly in initialize response for n8n compatibility
- Enhanced debug logging for MCP client detection and response formatting
- User-Agent based client detection (n8n uses "node" User-Agent)

### Fixed
- **CRITICAL**: Fixed empty tools list in n8n MCP client integration
- n8n now receives all 3 tools (search_subtitles, download_subtitle, calculate_file_hash) properly
- Chunked HTTP response encoding issues with n8n client parsing
- Tools now available in both `capabilities.tools.available` and `result.tools` arrays

### Changed
- Adaptive HTTP response format: plain JSON for n8n, chunked for other clients
- Enhanced initialize response with tools for immediate availability
- Updated capabilities structure to include tool names in `available` array
- Improved error handling and client compatibility detection

### Technical Details
- Added `streamResponse()` function with client detection
- n8n clients (User-Agent: "node") receive `res.json()` response
- Other clients continue to receive chunked transfer encoding
- Tools are included in initialize response to avoid separate tools/list calls

## [1.4.5_n8n_debug] - 2025-09-28

### Added
- Enhanced debugging for n8n MCP client issues
- Comprehensive request/response logging
- Tools included in initialize response for compatibility testing

### Fixed
- Debugging empty tools response to n8n clients
- Enhanced logging to track tool discovery process

## [1.4.4] - 2025-09-27

### Added
- Docker development environment with docker-compose.yml
- Full n8n integration support with Qdrant and PostgreSQL
- Docker network connectivity for container communication
- Volume mapping for live development workflow
- Enhanced HTTP endpoints for debugging and testing

### Fixed
- ES module entry point reliability issues
- Keep-alive mechanisms for stable MCP connections
- Process exit prevention in stdio mode

### Changed
- Improved TypeScript build process
- Updated to latest MCP SDK patterns
- Enhanced server stability and reliability

## [1.4.3] - 2025-09-26

### Added
- Comprehensive error handling and user-friendly messages
- Enhanced file hash calculation with proper error reporting
- Improved API client with better Kong gateway integration

### Fixed
- Rate limiting error messages now suggest getting API key
- File path validation and error reporting
- Network connectivity error handling

## [1.4.2] - 2025-09-25

### Added
- HTTP server mode for web access and n8n integration
- Express.js and CORS support for browser compatibility
- Health check endpoint at /health
- Web interface endpoint at /web

### Changed
- Dual mode operation: stdio for Claude Desktop, HTTP for web access
- Enhanced build process with post-processing

## [1.4.1] - 2025-09-24

### Fixed
- Search parameters validation and type safety
- Download tool parameter handling
- File hash calculation edge cases

### Added
- Comprehensive input validation
- Better error messages for common user mistakes

## [1.4.0] - 2025-09-23

### Added
- Complete TypeScript implementation
- All three core tools (search, download, hash)
- Full MCP protocol compliance
- Kong gateway integration for API management

### Changed
- Migrated from JavaScript to TypeScript
- Updated to latest MCP SDK
- Improved code organization and maintainability

## [1.3.0] - 2025-09-20

### Added
- Claude Desktop integration support
- Stdio transport for MCP communication
- Keep-alive mechanisms for stable connections

### Fixed
- Process lifecycle management
- Signal handling for graceful shutdown

## [1.2.0] - 2025-09-18

### Added
- OpenSubtitles file hash calculation
- Support for exact movie file matching
- Enhanced search capabilities with all API parameters

### Changed
- Improved search algorithm accuracy
- Better parameter validation

## [1.1.0] - 2025-09-15

### Added
- Subtitle download functionality
- Multiple format support (SRT, ASS, VTT)
- API key authentication for downloads

### Fixed
- Rate limiting respect
- Error handling improvements

## [1.0.0] - 2025-09-10

### Added
- Initial release
- Basic subtitle search functionality
- MCP protocol implementation
- Kong gateway integration
- Freemium model support

### Features
- Search subtitles by title, IMDB ID, TMDB ID
- Language filtering
- Year and episode/season filtering
- Rate limiting via Kong gateway