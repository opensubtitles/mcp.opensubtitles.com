import { z } from 'zod';

export const evaluations = [
  {
    name: 'search_subtitles_by_title',
    description: 'Search for subtitles by movie title and year',
    tool: 'search_subtitles',
    args: {
      query: 'The Matrix',
      year: 1999,
      languages: 'en'
    },
    expectedSchema: z.object({
      total_results: z.number(),
      total_pages: z.number(),
      current_page: z.number(),
      per_page: z.number(),
      subtitles: z.array(z.object({
        subtitle_id: z.string(),
        language: z.string(),
        movie_info: z.object({
          title: z.string(),
          movie_name: z.string(),
          year: z.number(),
          imdb_id: z.number(),
          tmdb_id: z.number().nullable(),
          season_number: z.number().nullable(),
          episode_number: z.number().nullable(),
          parent_title: z.string().nullable(),
          parent_imdb_id: z.number().nullable(),
          parent_tmdb_id: z.number().nullable(),
        }),
        quality_info: z.object({
          download_count: z.number(),
          new_download_count: z.number(),
          hearing_impaired: z.boolean(),
          hd: z.boolean(),
          fps: z.number().nullable(),
          votes: z.number(),
          points: z.number(),
          ratings: z.number(),
          from_trusted: z.boolean(),
          foreign_parts_only: z.boolean(),
          ai_translated: z.boolean(),
          machine_translated: z.boolean(),
        }),
        upload_info: z.object({
          upload_date: z.string(),
          uploader_name: z.string(),
          uploader_rank: z.string(),
          release: z.string(),
          comments: z.string(),
        }),
        files: z.array(z.object({
          file_id: z.number(),
          file_name: z.string(),
        })),
        url: z.string(),
      }))
    })
  },
  {
    name: 'search_subtitles_by_imdb',
    description: 'Search for subtitles by IMDB ID',
    tool: 'search_subtitles',
    args: {
      imdb_id: 133093, // The Matrix
      languages: 'en'
    },
    expectedSchema: z.object({
      total_results: z.number(),
      subtitles: z.array(z.object({
        subtitle_id: z.string(),
        language: z.string(),
        movie_info: z.object({
          imdb_id: z.number(),
          title: z.string(),
        }).passthrough(),
      }).passthrough())
    }).passthrough()
  },
  {
    name: 'search_subtitles_tv_show',
    description: 'Search for TV show subtitles by parent ID and episode',
    tool: 'search_subtitles',
    args: {
      parent_imdb_id: 944947, // Game of Thrones
      season_number: 1,
      episode_number: 1,
      languages: 'en'
    },
    expectedSchema: z.object({
      total_results: z.number(),
      subtitles: z.array(z.object({
        subtitle_id: z.string(),
        language: z.string(),
        movie_info: z.object({
          parent_imdb_id: z.number(),
          season_number: z.number(),
          episode_number: z.number(),
        }).passthrough(),
      }).passthrough())
    }).passthrough()
  },
  {
    name: 'search_subtitles_by_hash',
    description: 'Search for subtitles by file hash (will likely return empty for fake hash)',
    tool: 'search_subtitles',
    args: {
      moviehash: '8e245d9679d31e12',
      moviebytesize: 12909756
    },
    expectedSchema: z.object({
      total_results: z.number(),
      subtitles: z.array(z.object({
        subtitle_id: z.string(),
        language: z.string(),
      }).passthrough())
    }).passthrough()
  },
  {
    name: 'download_subtitle_without_api_key',
    description: 'Attempt to download subtitle without API key (should fail with rate limit)',
    tool: 'download_subtitle',
    args: {
      subtitle_id: '123456',
      format: 'srt'
    },
    expectError: true,
    expectedErrorPattern: /Download limit reached|rate limit|API key/i
  },
  {
    name: 'calculate_hash_nonexistent_file',
    description: 'Calculate hash for non-existent file (should fail)',
    tool: 'calculate_file_hash',
    args: {
      file_path: '/nonexistent/file.mkv'
    },
    expectError: true,
    expectedErrorPattern: /File not found|not readable/i
  },
  {
    name: 'search_with_multiple_filters',
    description: 'Search with multiple filter parameters',
    tool: 'search_subtitles',
    args: {
      query: 'Inception',
      year: 2010,
      languages: 'en,es',
      hearing_impaired: 'exclude',
      trusted_sources: 'include',
      order_by: 'download_count',
      order_direction: 'desc'
    },
    expectedSchema: z.object({
      total_results: z.number(),
      subtitles: z.array(z.object({
        subtitle_id: z.string(),
        language: z.string(),
        quality_info: z.object({
          hearing_impaired: z.boolean(),
          from_trusted: z.boolean(),
        }).passthrough(),
      }).passthrough())
    }).passthrough()
  },
  {
    name: 'search_machine_translated_only',
    description: 'Search for machine translated subtitles only',
    tool: 'search_subtitles',
    args: {
      query: 'Avatar',
      year: 2009,
      languages: 'es',
      machine_translated: 'only'
    },
    expectedSchema: z.object({
      total_results: z.number(),
      subtitles: z.array(z.object({
        subtitle_id: z.string(),
        language: z.string(),
        quality_info: z.object({
          machine_translated: z.boolean(),
        }).passthrough(),
      }).passthrough())
    }).passthrough()
  }
];

// Helper function for testing
export function runEvaluation(evaluation: any, result: any) {
  try {
    if (evaluation.expectError) {
      if (typeof result === 'object' && result.content && result.content[0] && result.content[0].text) {
        const text = result.content[0].text;
        if (text.startsWith('Error:') && evaluation.expectedErrorPattern.test(text)) {
          return { success: true, message: 'Expected error occurred' };
        }
        return { success: false, message: 'Expected error but got different error or success' };
      }
      return { success: false, message: 'Expected error but got success' };
    } else {
      if (typeof result === 'object' && result.content && result.content[0] && result.content[0].text) {
        const text = result.content[0].text;
        if (text.startsWith('Error:')) {
          return { success: false, message: `Unexpected error: ${text}` };
        }
        
        const parsedResult = JSON.parse(text);
        evaluation.expectedSchema.parse(parsedResult);
        return { success: true, message: 'Schema validation passed' };
      }
      return { success: false, message: 'Invalid result format' };
    }
  } catch (error) {
    return { 
      success: false, 
      message: `Evaluation failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}