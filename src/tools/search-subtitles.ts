import { z } from "zod";
import { OpenSubtitlesKongClient, SearchParams } from "../api-client.js";

const SearchArgsSchema = z.object({
  query: z.string().optional(),
  imdb_id: z.number().optional(),
  tmdb_id: z.number().optional(),
  parent_imdb_id: z.number().optional(),
  parent_tmdb_id: z.number().optional(),
  season_number: z.number().optional(),
  episode_number: z.number().optional(),
  year: z.number().optional(),
  moviehash: z.string().optional(),
  moviebytesize: z.number().optional(),
  languages: z.string().optional(),
  machine_translated: z.string().optional(),
  ai_translated: z.string().optional(),
  hearing_impaired: z.string().optional(),
  foreign_parts_only: z.string().optional(),
  trusted_sources: z.string().optional(),
  order_by: z.string().optional(),
  order_direction: z.string().optional(),
  user_api_key: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
});

export async function searchSubtitles(args: unknown) {
  try {
    // Validate input arguments
    const validatedArgs = SearchArgsSchema.parse(args);
    
    // Extract authentication parameters from args
    const { user_api_key, username, password, ...searchParams } = validatedArgs;
    
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
    
    // Perform search
    const searchResults = await client.searchSubtitles(
      searchParams as SearchParams, 
      authValue,
      isToken
    );

    // Format results for MCP response
    const formattedResults = {
      total_results: searchResults.total_count,
      total_pages: searchResults.total_pages,
      current_page: searchResults.page,
      per_page: searchResults.per_page,
      subtitles: searchResults.data.map(subtitle => ({
        subtitle_id: subtitle.attributes.subtitle_id,
        language: subtitle.attributes.language,
        movie_info: {
          title: subtitle.attributes.feature_details?.title || "",
          movie_name: subtitle.attributes.feature_details?.movie_name || "",
          year: subtitle.attributes.feature_details?.year || 0,
          imdb_id: subtitle.attributes.feature_details?.imdb_id || 0,
          tmdb_id: subtitle.attributes.feature_details?.tmdb_id || null,
          season_number: subtitle.attributes.feature_details?.season_number || null,
          episode_number: subtitle.attributes.feature_details?.episode_number || null,
          parent_title: subtitle.attributes.feature_details?.parent_title || null,
          parent_imdb_id: subtitle.attributes.feature_details?.parent_imdb_id || null,
          parent_tmdb_id: subtitle.attributes.feature_details?.parent_tmdb_id || null,
        },
        quality_info: {
          download_count: subtitle.attributes.download_count || 0,
          new_download_count: subtitle.attributes.new_download_count || 0,
          hearing_impaired: subtitle.attributes.hearing_impaired || false,
          hd: subtitle.attributes.hd || false,
          fps: subtitle.attributes.fps || null,
          votes: subtitle.attributes.votes || 0,
          points: subtitle.attributes.points || 0,
          ratings: subtitle.attributes.ratings || 0,
          from_trusted: subtitle.attributes.from_trusted || false,
          foreign_parts_only: subtitle.attributes.foreign_parts_only || false,
          ai_translated: subtitle.attributes.ai_translated || false,
          machine_translated: subtitle.attributes.machine_translated || false,
        },
        upload_info: {
          upload_date: subtitle.attributes.upload_date || "",
          uploader_name: subtitle.attributes.uploader?.name || "",
          uploader_rank: subtitle.attributes.uploader?.rank || "",
          release: subtitle.attributes.release || "",
          comments: subtitle.attributes.comments || "",
        },
        files: (subtitle.attributes.files || []).map(file => ({
          file_id: file.file_id,
          file_name: file.file_name,
        })),
        webpage_url: subtitle.attributes.url || "",
        view_online: subtitle.attributes.url ? `${subtitle.attributes.url}` : "",
      }))
    };

    // Create a human-readable summary with clickable links
    const topSubtitles = formattedResults.subtitles.slice(0, 5);
    let summaryText = `## Search Results: ${formattedResults.total_results} subtitles found\n\n`;
    
    if (topSubtitles.length > 0) {
      summaryText += `**Top ${topSubtitles.length} Results:**\n\n`;
      
      topSubtitles.forEach((subtitle, index) => {
        const title = subtitle.movie_info.title || 'Unknown Title';
        const year = subtitle.movie_info.year ? ` (${subtitle.movie_info.year})` : '';
        const downloads = subtitle.quality_info.download_count || 0;
        const lang = subtitle.language || 'unknown';
        const fps = subtitle.quality_info.fps ? ` | ${subtitle.quality_info.fps} FPS` : '';
        const hd = subtitle.quality_info.hd ? ' | HD' : '';
        const trusted = subtitle.quality_info.from_trusted ? ' | ✅ Trusted' : '';
        const release = subtitle.upload_info.release ? ` | Release: ${subtitle.upload_info.release}` : '';
        
        summaryText += `### ${index + 1}. ${title}${year}\n`;
        summaryText += `- **Language:** ${lang}${fps}${hd}${trusted}\n`;
        summaryText += `- **Downloads:** ${downloads.toLocaleString()}\n`;
        if (release) summaryText += `- **Release:** ${subtitle.upload_info.release}\n`;
        if (subtitle.upload_info.comments) summaryText += `- **Notes:** ${subtitle.upload_info.comments}\n`;
        
        // Add clickable link
        if (subtitle.webpage_url) {
          summaryText += `- **🔗 View/Download:** ${subtitle.webpage_url}\n`;
        }
        
        summaryText += '\n';
      });
      
      if (formattedResults.total_results > 5) {
        summaryText += `*...and ${formattedResults.total_results - 5} more results*\n\n`;
      }
    }
    
    summaryText += `---\n📊 **Page:** ${formattedResults.current_page}/${formattedResults.total_pages} | **Per page:** ${formattedResults.per_page}\n\n`;
    summaryText += `**Raw data:**\n\`\`\`json\n${JSON.stringify(formattedResults, null, 2)}\n\`\`\``;

    return {
      content: [
        {
          type: "text",
          text: summaryText,
        },
      ],
    };

  } catch (error) {
    console.error("Search subtitles error:", error);
    
    let errorMessage = "Failed to search subtitles";
    if (error instanceof z.ZodError) {
      errorMessage = `Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
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
