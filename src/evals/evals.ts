import { z } from 'zod';

export const evaluations = [
  // === MOVIE SEARCH TESTS ===
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
    name: 'search_movie_popular_title',
    description: 'Search for popular movie subtitles - Inception',
    tool: 'search_subtitles',
    args: {
      query: 'Inception',
      year: 2010,
      languages: 'en'
    },
    expectedSchema: z.object({
      total_results: z.number().min(1),
      subtitles: z.array(z.object({
        subtitle_id: z.string(),
        language: z.string(),
        movie_info: z.object({
          title: z.string().refine(title => title.toLowerCase().includes('inception')),
          year: z.number().refine(year => year === 2010),
        }).passthrough(),
      }).passthrough())
    }).passthrough()
  },
  {
    name: 'search_movie_recent_blockbuster',
    description: 'Search for recent blockbuster - Dune 2021',
    tool: 'search_subtitles',
    args: {
      query: 'Dune',
      year: 2021,
      languages: 'en'
    },
    expectedSchema: z.object({
      total_results: z.number(),
      subtitles: z.array(z.object({
        subtitle_id: z.string(),
        language: z.string(),
        movie_info: z.object({
          title: z.string(),
          year: z.number().refine(year => year >= 2021),
        }).passthrough(),
      }).passthrough())
    }).passthrough()
  },
  {
    name: 'search_movie_classic',
    description: 'Search for classic movie - Casablanca',
    tool: 'search_subtitles',
    args: {
      query: 'Casablanca',
      year: 1942,
      languages: 'en'
    },
    expectedSchema: z.object({
      total_results: z.number(),
      subtitles: z.array(z.object({
        subtitle_id: z.string(),
        language: z.string(),
        movie_info: z.object({
          title: z.string(),
          year: z.number().refine(year => year >= 1940 && year <= 1950),
        }).passthrough(),
      }).passthrough())
    }).passthrough()
  },
  {
    name: 'search_movie_multilingual',
    description: 'Search for movie with multiple languages - Avengers Endgame',
    tool: 'search_subtitles',
    args: {
      query: 'Avengers Endgame',
      year: 2019,
      languages: 'en,es,fr,de'
    },
    expectedSchema: z.object({
      total_results: z.number().min(1),
      subtitles: z.array(z.object({
        subtitle_id: z.string(),
        language: z.string().refine(lang => ['en', 'es', 'fr', 'de'].includes(lang)),
        movie_info: z.object({
          title: z.string(),
          year: z.number().refine(year => year === 2019),
        }).passthrough(),
      }).passthrough())
    }).passthrough()
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
  // === TV EPISODE SEARCH TESTS ===
  {
    name: 'search_tv_game_of_thrones_s1e1',
    description: 'Search for Game of Thrones S01E01 subtitles',
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
          parent_imdb_id: z.number().refine(id => id === 944947),
          season_number: z.number().refine(season => season === 1),
          episode_number: z.number().refine(episode => episode === 1),
          parent_title: z.string().nullable(),
        }).passthrough(),
      }).passthrough())
    }).passthrough()
  },
  {
    name: 'search_tv_breaking_bad_pilot',
    description: 'Search for Breaking Bad pilot episode subtitles',
    tool: 'search_subtitles',
    args: {
      parent_imdb_id: 903747, // Breaking Bad
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
          parent_imdb_id: z.number().refine(id => id === 903747),
          season_number: z.number().refine(season => season === 1),
          episode_number: z.number().refine(episode => episode === 1),
        }).passthrough(),
      }).passthrough())
    }).passthrough()
  },
  {
    name: 'search_tv_friends_finale',
    description: 'Search for Friends series finale subtitles',
    tool: 'search_subtitles',
    args: {
      parent_imdb_id: 108778, // Friends
      season_number: 10,
      episode_number: 17, // "The Last One"
      languages: 'en'
    },
    expectedSchema: z.object({
      total_results: z.number(),
      subtitles: z.array(z.object({
        subtitle_id: z.string(),
        language: z.string(),
        movie_info: z.object({
          parent_imdb_id: z.number().refine(id => id === 108778),
          season_number: z.number().refine(season => season === 10),
          episode_number: z.number().refine(episode => episode === 17),
        }).passthrough(),
      }).passthrough())
    }).passthrough()
  },
  {
    name: 'search_tv_stranger_things_recent',
    description: 'Search for recent Stranger Things episode subtitles',
    tool: 'search_subtitles',
    args: {
      parent_imdb_id: 4574334, // Stranger Things
      season_number: 4,
      episode_number: 1,
      languages: 'en'
    },
    expectedSchema: z.object({
      total_results: z.number(),
      subtitles: z.array(z.object({
        subtitle_id: z.string(),
        language: z.string(),
        movie_info: z.object({
          parent_imdb_id: z.number().refine(id => id === 4574334),
          season_number: z.number().refine(season => season >= 1),
          episode_number: z.number().refine(episode => episode >= 1),
        }).passthrough(),
      }).passthrough())
    }).passthrough()
  },
  {
    name: 'search_tv_the_office_multilingual',
    description: 'Search for The Office episode with multiple languages',
    tool: 'search_subtitles',
    args: {
      parent_imdb_id: 386676, // The Office (US)
      season_number: 2,
      episode_number: 1, // "The Dundies"
      languages: 'en,es,pt'
    },
    expectedSchema: z.object({
      total_results: z.number(),
      subtitles: z.array(z.object({
        subtitle_id: z.string(),
        language: z.string().refine(lang => ['en', 'es', 'pt'].includes(lang)),
        movie_info: z.object({
          parent_imdb_id: z.number().refine(id => id === 386676),
          season_number: z.number().refine(season => season === 2),
          episode_number: z.number().refine(episode => episode === 1),
        }).passthrough(),
      }).passthrough())
    }).passthrough()
  },
  {
    name: 'search_tv_anime_episode',
    description: 'Search for anime episode subtitles - Attack on Titan',
    tool: 'search_subtitles',
    args: {
      parent_imdb_id: 2560140, // Attack on Titan
      season_number: 1,
      episode_number: 1,
      languages: 'en,ja'
    },
    expectedSchema: z.object({
      total_results: z.number(),
      subtitles: z.array(z.object({
        subtitle_id: z.string(),
        language: z.string(),
        movie_info: z.object({
          parent_imdb_id: z.number().refine(id => id === 2560140),
          season_number: z.number().refine(season => season >= 1),
          episode_number: z.number().refine(episode => episode >= 1),
        }).passthrough(),
      }).passthrough())
    }).passthrough()
  },
  {
    name: 'search_tv_by_query_and_season',
    description: 'Search TV show using query with season info',
    tool: 'search_subtitles',
    args: {
      query: 'The Mandalorian S01E01',
      languages: 'en'
    },
    expectedSchema: z.object({
      total_results: z.number(),
      subtitles: z.array(z.object({
        subtitle_id: z.string(),
        language: z.string(),
        movie_info: z.object({
          title: z.string(),
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
  },
  
  // === ADVANCED SEARCH TESTS ===
  {
    name: 'search_with_hearing_impaired_only',
    description: 'Search for hearing impaired subtitles only',
    tool: 'search_subtitles',
    args: {
      query: 'Joker',
      year: 2019,
      languages: 'en',
      hearing_impaired: 'only'
    },
    expectedSchema: z.object({
      total_results: z.number(),
      subtitles: z.array(z.object({
        subtitle_id: z.string(),
        language: z.string(),
        quality_info: z.object({
          hearing_impaired: z.boolean().refine(hi => hi === true),
        }).passthrough(),
      }).passthrough())
    }).passthrough()
  },
  {
    name: 'search_trusted_sources_only',
    description: 'Search for trusted source subtitles only',
    tool: 'search_subtitles',
    args: {
      query: 'Interstellar',
      year: 2014,
      languages: 'en',
      trusted_sources: 'only',
      order_by: 'download_count',
      order_direction: 'desc'
    },
    expectedSchema: z.object({
      total_results: z.number(),
      subtitles: z.array(z.object({
        subtitle_id: z.string(),
        language: z.string(),
        quality_info: z.object({
          from_trusted: z.boolean().refine(trusted => trusted === true),
          download_count: z.number(),
        }).passthrough(),
      }).passthrough())
    }).passthrough()
  },
  {
    name: 'search_foreign_parts_only',
    description: 'Search for foreign parts only subtitles',
    tool: 'search_subtitles',
    args: {
      query: 'Kill Bill',
      year: 2003,
      languages: 'en',
      foreign_parts_only: 'only'
    },
    expectedSchema: z.object({
      total_results: z.number(),
      subtitles: z.array(z.object({
        subtitle_id: z.string(),
        language: z.string(),
        quality_info: z.object({
          foreign_parts_only: z.boolean().refine(fpo => fpo === true),
        }).passthrough(),
      }).passthrough())
    }).passthrough()
  },
  
  // === EDGE CASE TESTS ===
  {
    name: 'search_nonexistent_movie',
    description: 'Search for a movie that likely does not exist',
    tool: 'search_subtitles',
    args: {
      query: 'Zxcvbnm Qwertyuiop Asdfghjkl',
      year: 2025,
      languages: 'en'
    },
    expectedSchema: z.object({
      total_results: z.number().refine(total => total === 0),
      subtitles: z.array(z.any()).length(0),
    }).passthrough()
  },
  {
    name: 'search_tv_invalid_episode',
    description: 'Search for TV episode with unrealistic season/episode numbers',
    tool: 'search_subtitles',
    args: {
      parent_imdb_id: 944947, // Game of Thrones
      season_number: 999,
      episode_number: 999,
      languages: 'en'
    },
    expectedSchema: z.object({
      total_results: z.number(),
      subtitles: z.array(z.any()),
    }).passthrough()
  },
  {
    name: 'search_with_special_characters',
    description: 'Search with special characters in title',
    tool: 'search_subtitles',
    args: {
      query: 'Amélie',
      year: 2001,
      languages: 'fr,en'
    },
    expectedSchema: z.object({
      total_results: z.number(),
      subtitles: z.array(z.object({
        subtitle_id: z.string(),
        language: z.string().refine(lang => ['fr', 'en'].includes(lang)),
      }).passthrough())
    }).passthrough()
  },
  {
    name: 'search_empty_query',
    description: 'Search with empty query (should still work with other params)',
    tool: 'search_subtitles',
    args: {
      languages: 'en',
      year: 2020,
      trusted_sources: 'only'
    },
    expectedSchema: z.object({
      total_results: z.number(),
      subtitles: z.array(z.object({
        subtitle_id: z.string(),
        language: z.string().refine(lang => lang === 'en'),
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