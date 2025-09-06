import { z } from "zod";
import { OpenSubtitlesKongClient } from "../api-client.js";

const DownloadArgsSchema = z.object({
  subtitle_id: z.string(),
  format: z.enum(["srt", "ass", "vtt"]).optional().default("srt"),
  user_api_key: z.string().optional(),
});

export async function downloadSubtitle(args: unknown) {
  try {
    // Validate input arguments
    const validatedArgs = DownloadArgsSchema.parse(args);
    
    // Create API client
    const client = new OpenSubtitlesKongClient();
    
    // First, we need to get the file_id from the subtitle_id
    // This requires searching for the subtitle first to get the file details
    const searchResults = await client.searchSubtitles(
      { query: "", languages: "en" }, // Minimal search to get structure
      validatedArgs.user_api_key
    );
    
    // Find the subtitle with matching ID
    const targetSubtitle = searchResults.data.find(
      sub => sub.attributes.subtitle_id === validatedArgs.subtitle_id
    );
    
    if (!targetSubtitle || !targetSubtitle.attributes.files.length) {
      throw new Error(`Subtitle with ID ${validatedArgs.subtitle_id} not found or has no files`);
    }
    
    // Use the first file (most common case)
    const fileId = targetSubtitle.attributes.files[0].file_id;
    
    // Request download link
    const downloadInfo = await client.downloadSubtitle(
      {
        file_id: fileId,
        sub_format: validatedArgs.format,
      },
      validatedArgs.user_api_key
    );
    
    // Download the actual subtitle content
    const subtitleContent = await client.downloadSubtitleContent(downloadInfo.link);
    
    // Format response
    const response = {
      subtitle_id: validatedArgs.subtitle_id,
      file_name: downloadInfo.file_name,
      format: validatedArgs.format,
      content: subtitleContent,
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