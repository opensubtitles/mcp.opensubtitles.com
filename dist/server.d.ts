import { Tool, CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
export interface OpenSubtitlesServer {
    getTools(): Promise<Tool[]>;
    handleToolCall(params: CallToolRequest["params"]): Promise<any>;
}
export declare function createOpenSubtitlesServer(): OpenSubtitlesServer;
//# sourceMappingURL=server.d.ts.map