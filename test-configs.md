# Claude Desktop MCP Testing Guide

## Testing Each Configuration

### 1. Test Local Development Version First
```json
{
  "mcpServers": {
    "opensubtitles": {
      "command": "node",
      "args": ["/Users/brano/Documents/data/www/opensubtitles.org/public_html/github/mcp.opensubtitles.com/dist/index.js"],
      "env": {
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```
**Expected**: Should work immediately (your local files)

### 2. Test HTTP Proxy (requires local server running)
```json
{
  "mcpServers": {
    "opensubtitles": {
      "command": "node",
      "args": ["/Users/brano/Documents/data/www/opensubtitles.org/public_html/github/mcp.opensubtitles.com/http-proxy.js"],
      "env": {
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```
**Prerequisites**: Make sure HTTP server is running on port 1620
**Expected**: Should connect to localhost:1620

### 3. Test NPX Local (no Node.js required)
```json
{
  "mcpServers": {
    "opensubtitles": {
      "command": "npx",
      "args": ["-y", "@opensubtitles/mcp-server@latest"],
      "env": {
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```
**Expected**: Should download package and run stdio mode
**Note**: Will be slow first time (downloading)

### 4. Test NPX Remote (no Node.js required)
```json
{
  "mcpServers": {
    "opensubtitles": {
      "command": "npx",
      "args": ["-y", "@opensubtitles/mcp-server@latest", "mcp-opensubtitles-remote"],
      "env": {
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```
**Prerequisites**: Remote server must be deployed and accessible
**Expected**: Should connect to mcp.opensubtitles.com

### 5. Test Remote Proxy (Node.js required)
```json
{
  "mcpServers": {
    "opensubtitles": {
      "command": "node",
      "args": ["/Users/brano/Documents/data/www/opensubtitles.org/public_html/github/mcp.opensubtitles.com/remote-proxy.js"],
      "env": {
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```
**Prerequisites**: Remote server must be accessible
**Expected**: Should connect to mcp.opensubtitles.com

### 6. Test SSH Remote (SSH access required)
```json
{
  "mcpServers": {
    "opensubtitles": {
      "command": "ssh",
      "args": [
        "root@mcp.opensubtitles.com",
        "cd /home/mcp.opensubtitles.com && LOG_LEVEL=debug MCP_MODE=stdio node dist/index.js"
      ]
    }
  }
}
```
**Prerequisites**: SSH key access to server
**Expected**: Should run directly on remote server

## How to Test Each Configuration

### Step 1: Edit Claude Desktop Config
1. Open `/Users/brano/Library/Application Support/Claude/claude_desktop_config.json`
2. Replace content with ONE of the configurations above
3. Save the file

### Step 2: Restart Claude Desktop
1. **Quit Claude Desktop completely** (Cmd+Q)
2. **Restart Claude Desktop**
3. Wait for it to fully load

### Step 3: Test MCP Tools
In Claude Desktop, try these commands:

**Test 1: Check if MCP is loaded**
```
What MCP tools do you have available?
```

**Test 2: Simple search**
```
@opensubtitles search for Matrix subtitles in English
```

**Test 3: Detailed search**
```
@opensubtitles search for The Matrix 1999 English subtitles
```

**Test 4: Check tool list**
```
@opensubtitles list all available tools
```

## Expected Results

### ✅ Success Indicators:
- Claude shows MCP tools in available tools list
- Search returns subtitle results with file IDs
- No connection errors in responses

### ❌ Failure Indicators:
- "No MCP servers available" message
- Connection timeout errors
- "Command not found" errors
- Empty tool list

## Troubleshooting

### If NPX is slow:
- First run downloads the entire package (~40MB)
- Subsequent runs should be faster (cached)

### If remote connections fail:
- Check if mcp.opensubtitles.com is accessible
- Verify firewall/network settings
- Try HTTP proxy first, then SSH

### If local files fail:
- Verify file paths are correct
- Check if TypeScript is compiled (`npm run build`)
- Ensure Node.js is installed locally