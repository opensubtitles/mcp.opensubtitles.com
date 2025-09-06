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
});

export async function searchSubtitles(args: unknown) {
  try {
    // Validate input arguments
    const validatedArgs = SearchArgsSchema.parse(args);
    
    // Extract user API key from args
    const { user_api_key, ...searchParams } = validatedArgs;
    
    // Create API client
    const client = new OpenSubtitlesKongClient();
    
    // Perform search
    const searchResults = await client.searchSubtitles(
      searchParams as SearchParams, 
      user_api_key
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
          title: subtitle.attributes.feature_details.title,
          movie_name: subtitle.attributes.feature_details.movie_name,
          year: subtitle.attributes.feature_details.year,
          imdb_id: subtitle.attributes.feature_details.imdb_id,
          tmdb_id: subtitle.attributes.feature_details.tmdb_id,
          season_number: subtitle.attributes.feature_details.season_number,
          episode_number: subtitle.attributes.feature_details.episode_number,
          parent_title: subtitle.attributes.feature_details.parent_title,
          parent_imdb_id: subtitle.attributes.feature_details.parent_imdb_id,
          parent_tmdb_id: subtitle.attributes.feature_details.parent_tmdb_id,
        },
        quality_info: {
          download_count: subtitle.attributes.download_count,
          new_download_count: subtitle.attributes.new_download_count,
          hearing_impaired: subtitle.attributes.hearing_impaired,
          hd: subtitle.attributes.hd,
          fps: subtitle.attributes.fps,
          votes: subtitle.attributes.votes,
          points: subtitle.attributes.points,
          ratings: subtitle.attributes.ratings,
          from_trusted: subtitle.attributes.from_trusted,
          foreign_parts_only: subtitle.attributes.foreign_parts_only,
          ai_translated: subtitle.attributes.ai_translated,
          machine_translated: subtitle.attributes.machine_translated,
        },
        upload_info: {
          upload_date: subtitle.attributes.upload_date,
          uploader_name: subtitle.attributes.uploader.name,
          uploader_rank: subtitle.attributes.uploader.rank,
          release: subtitle.attributes.release,
          comments: subtitle.attributes.comments,
        },
        files: subtitle.attributes.files.map(file => ({
          file_id: file.file_id,
          file_name: file.file_name,
        })),
        url: subtitle.attributes.url,
      }))
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(formattedResults, null, 2),
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