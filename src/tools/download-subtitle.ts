import { z } from "zod";
import { OpenSubtitlesKongClient } from "../api-client.js";

const DownloadArgsSchema = z.object({
  file_id: z.number(),
  file_name: z.string().optional(),
  in_fps: z.number().optional(),
  out_fps: z.number().optional(),
  timeshift: z.number().optional(),
  force_download: z.boolean().optional().default(true), // Default to true for direct file download
  user_api_key: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
});

export async function downloadSubtitle(args: unknown) {
  try {
    // Validate input arguments
    const validatedArgs = DownloadArgsSchema.parse(args);
    
    // Extract authentication parameters from args
    const { user_api_key, username, password, file_id, file_name, in_fps, out_fps, timeshift, force_download } = validatedArgs;
    
    // Create API client
    const client = new OpenSubtitlesKongClient();
    
    // Handle authentication
    let authValue: string | undefined = user_api_key;
    let isToken = false;
    
    // If username/password provided, login to get token
    if (username && password && !user_api_key) {
      try {
        const loginResponse = await client.login({ username, password });
        authValue = loginResponse.token;
        isToken = true;
        console.error(`DEBUG: Successfully logged in user ${username}, got token`);
      } catch (loginError) {
        console.error("DEBUG: Login failed:", loginError);
        // Continue with default API key (authValue will be undefined)
      }
    }
    
    // Request download link
    const downloadParams: any = {
      file_id: file_id,
    };
    
    // Add optional parameters
    if (file_name) downloadParams.file_name = file_name;
    if (in_fps !== undefined) downloadParams.in_fps = in_fps;
    if (out_fps !== undefined) downloadParams.out_fps = out_fps;
    if (timeshift !== undefined) downloadParams.timeshift = timeshift;
    // Always set force_download to ensure direct file download with proper headers
    downloadParams.force_download = force_download;
    
    const downloadInfo = await client.downloadSubtitle(
      downloadParams,
      authValue,
      isToken
    );
    
    // Download the actual subtitle content
    const subtitleContent = await client.downloadSubtitleContent(downloadInfo.link);
    
    // Format response
    const response = {
      file_id: file_id,
      file_name: downloadInfo.file_name,
      content: subtitleContent,
      force_download: force_download,
      download_info: {
        requests_used: downloadInfo.requests,
        requests_remaining: downloadInfo.remaining,
        reset_time: downloadInfo.reset_time,
        reset_time_utc: downloadInfo.reset_time_utc,
        message: downloadInfo.message,
      },
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
    };

  } catch (error) {
    console.error("Download subtitle error:", error);
    
    let errorMessage = "Failed to download subtitle";
    if (error instanceof z.ZodError) {
      errorMessage = `Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    // Provide helpful error messages based on common issues
    if (errorMessage.includes("429")) {
      errorMessage += "\n\nTo download subtitles, you need an OpenSubtitles API key. Get one free at: https://www.opensubtitles.com/api";
    } else if (errorMessage.includes("401")) {
      errorMessage += "\n\nYour API key may be invalid. Please check it at: https://www.opensubtitles.com/api";
    }

    return {
      content: [
        {
          type: "text",
          text: `Error: ${errorMessage}`,
        },
      ],
    };
  }
}