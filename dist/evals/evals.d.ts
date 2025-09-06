import { z } from 'zod';
export declare const evaluations: ({
    name: string;
    description: string;
    tool: string;
    args: {
        query: string;
        year: number;
        languages: string;
        imdb_id?: undefined;
        parent_imdb_id?: undefined;
        season_number?: undefined;
        episode_number?: undefined;
        moviehash?: undefined;
        moviebytesize?: undefined;
        subtitle_id?: undefined;
        format?: undefined;
        file_path?: undefined;
        hearing_impaired?: undefined;
        trusted_sources?: undefined;
        order_by?: undefined;
        order_direction?: undefined;
        machine_translated?: undefined;
        foreign_parts_only?: undefined;
    };
    expectedSchema: z.ZodObject<{
        total_results: z.ZodNumber;
        total_pages: z.ZodNumber;
        current_page: z.ZodNumber;
        per_page: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodString;
                movie_name: z.ZodString;
                year: z.ZodNumber;
                imdb_id: z.ZodNumber;
                tmdb_id: z.ZodNullable<z.ZodNumber>;
                season_number: z.ZodNullable<z.ZodNumber>;
                episode_number: z.ZodNullable<z.ZodNumber>;
                parent_title: z.ZodNullable<z.ZodString>;
                parent_imdb_id: z.ZodNullable<z.ZodNumber>;
                parent_tmdb_id: z.ZodNullable<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                year: number;
                title: string;
                movie_name: string;
                imdb_id: number;
                tmdb_id: number | null;
                season_number: number | null;
                episode_number: number | null;
                parent_imdb_id: number | null;
                parent_title: string | null;
                parent_tmdb_id: number | null;
            }, {
                year: number;
                title: string;
                movie_name: string;
                imdb_id: number;
                tmdb_id: number | null;
                season_number: number | null;
                episode_number: number | null;
                parent_imdb_id: number | null;
                parent_title: string | null;
                parent_tmdb_id: number | null;
            }>;
            quality_info: z.ZodObject<{
                download_count: z.ZodNumber;
                new_download_count: z.ZodNumber;
                hearing_impaired: z.ZodBoolean;
                hd: z.ZodBoolean;
                fps: z.ZodNullable<z.ZodNumber>;
                votes: z.ZodNumber;
                points: z.ZodNumber;
                ratings: z.ZodNumber;
                from_trusted: z.ZodBoolean;
                foreign_parts_only: z.ZodBoolean;
                ai_translated: z.ZodBoolean;
                machine_translated: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                download_count: number;
                new_download_count: number;
                hearing_impaired: boolean;
                hd: boolean;
                fps: number | null;
                votes: number;
                points: number;
                ratings: number;
                from_trusted: boolean;
                foreign_parts_only: boolean;
                ai_translated: boolean;
                machine_translated: boolean;
            }, {
                download_count: number;
                new_download_count: number;
                hearing_impaired: boolean;
                hd: boolean;
                fps: number | null;
                votes: number;
                points: number;
                ratings: number;
                from_trusted: boolean;
                foreign_parts_only: boolean;
                ai_translated: boolean;
                machine_translated: boolean;
            }>;
            upload_info: z.ZodObject<{
                upload_date: z.ZodString;
                uploader_name: z.ZodString;
                uploader_rank: z.ZodString;
                release: z.ZodString;
                comments: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                upload_date: string;
                release: string;
                comments: string;
                uploader_name: string;
                uploader_rank: string;
            }, {
                upload_date: string;
                release: string;
                comments: string;
                uploader_name: string;
                uploader_rank: string;
            }>;
            files: z.ZodArray<z.ZodObject<{
                file_id: z.ZodNumber;
                file_name: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                file_id: number;
                file_name: string;
            }, {
                file_id: number;
                file_name: string;
            }>, "many">;
            url: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            subtitle_id: string;
            language: string;
            url: string;
            files: {
                file_id: number;
                file_name: string;
            }[];
            movie_info: {
                year: number;
                title: string;
                movie_name: string;
                imdb_id: number;
                tmdb_id: number | null;
                season_number: number | null;
                episode_number: number | null;
                parent_imdb_id: number | null;
                parent_title: string | null;
                parent_tmdb_id: number | null;
            };
            quality_info: {
                download_count: number;
                new_download_count: number;
                hearing_impaired: boolean;
                hd: boolean;
                fps: number | null;
                votes: number;
                points: number;
                ratings: number;
                from_trusted: boolean;
                foreign_parts_only: boolean;
                ai_translated: boolean;
                machine_translated: boolean;
            };
            upload_info: {
                upload_date: string;
                release: string;
                comments: string;
                uploader_name: string;
                uploader_rank: string;
            };
        }, {
            subtitle_id: string;
            language: string;
            url: string;
            files: {
                file_id: number;
                file_name: string;
            }[];
            movie_info: {
                year: number;
                title: string;
                movie_name: string;
                imdb_id: number;
                tmdb_id: number | null;
                season_number: number | null;
                episode_number: number | null;
                parent_imdb_id: number | null;
                parent_title: string | null;
                parent_tmdb_id: number | null;
            };
            quality_info: {
                download_count: number;
                new_download_count: number;
                hearing_impaired: boolean;
                hd: boolean;
                fps: number | null;
                votes: number;
                points: number;
                ratings: number;
                from_trusted: boolean;
                foreign_parts_only: boolean;
                ai_translated: boolean;
                machine_translated: boolean;
            };
            upload_info: {
                upload_date: string;
                release: string;
                comments: string;
                uploader_name: string;
                uploader_rank: string;
            };
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        total_pages: number;
        per_page: number;
        total_results: number;
        current_page: number;
        subtitles: {
            subtitle_id: string;
            language: string;
            url: string;
            files: {
                file_id: number;
                file_name: string;
            }[];
            movie_info: {
                year: number;
                title: string;
                movie_name: string;
                imdb_id: number;
                tmdb_id: number | null;
                season_number: number | null;
                episode_number: number | null;
                parent_imdb_id: number | null;
                parent_title: string | null;
                parent_tmdb_id: number | null;
            };
            quality_info: {
                download_count: number;
                new_download_count: number;
                hearing_impaired: boolean;
                hd: boolean;
                fps: number | null;
                votes: number;
                points: number;
                ratings: number;
                from_trusted: boolean;
                foreign_parts_only: boolean;
                ai_translated: boolean;
                machine_translated: boolean;
            };
            upload_info: {
                upload_date: string;
                release: string;
                comments: string;
                uploader_name: string;
                uploader_rank: string;
            };
        }[];
    }, {
        total_pages: number;
        per_page: number;
        total_results: number;
        current_page: number;
        subtitles: {
            subtitle_id: string;
            language: string;
            url: string;
            files: {
                file_id: number;
                file_name: string;
            }[];
            movie_info: {
                year: number;
                title: string;
                movie_name: string;
                imdb_id: number;
                tmdb_id: number | null;
                season_number: number | null;
                episode_number: number | null;
                parent_imdb_id: number | null;
                parent_title: string | null;
                parent_tmdb_id: number | null;
            };
            quality_info: {
                download_count: number;
                new_download_count: number;
                hearing_impaired: boolean;
                hd: boolean;
                fps: number | null;
                votes: number;
                points: number;
                ratings: number;
                from_trusted: boolean;
                foreign_parts_only: boolean;
                ai_translated: boolean;
                machine_translated: boolean;
            };
            upload_info: {
                upload_date: string;
                release: string;
                comments: string;
                uploader_name: string;
                uploader_rank: string;
            };
        }[];
    }>;
    expectError?: undefined;
    expectedErrorPattern?: undefined;
} | {
    name: string;
    description: string;
    tool: string;
    args: {
        query: string;
        year: number;
        languages: string;
        imdb_id?: undefined;
        parent_imdb_id?: undefined;
        season_number?: undefined;
        episode_number?: undefined;
        moviehash?: undefined;
        moviebytesize?: undefined;
        subtitle_id?: undefined;
        format?: undefined;
        file_path?: undefined;
        hearing_impaired?: undefined;
        trusted_sources?: undefined;
        order_by?: undefined;
        order_direction?: undefined;
        machine_translated?: undefined;
        foreign_parts_only?: undefined;
    };
    expectedSchema: z.ZodObject<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodEffects<z.ZodString, string, string>;
                year: z.ZodEffects<z.ZodNumber, 2010, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">>;
    expectError?: undefined;
    expectedErrorPattern?: undefined;
} | {
    name: string;
    description: string;
    tool: string;
    args: {
        query: string;
        year: number;
        languages: string;
        imdb_id?: undefined;
        parent_imdb_id?: undefined;
        season_number?: undefined;
        episode_number?: undefined;
        moviehash?: undefined;
        moviebytesize?: undefined;
        subtitle_id?: undefined;
        format?: undefined;
        file_path?: undefined;
        hearing_impaired?: undefined;
        trusted_sources?: undefined;
        order_by?: undefined;
        order_direction?: undefined;
        machine_translated?: undefined;
        foreign_parts_only?: undefined;
    };
    expectedSchema: z.ZodObject<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodString;
                year: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">>;
    expectError?: undefined;
    expectedErrorPattern?: undefined;
} | {
    name: string;
    description: string;
    tool: string;
    args: {
        imdb_id: number;
        languages: string;
        query?: undefined;
        year?: undefined;
        parent_imdb_id?: undefined;
        season_number?: undefined;
        episode_number?: undefined;
        moviehash?: undefined;
        moviebytesize?: undefined;
        subtitle_id?: undefined;
        format?: undefined;
        file_path?: undefined;
        hearing_impaired?: undefined;
        trusted_sources?: undefined;
        order_by?: undefined;
        order_direction?: undefined;
        machine_translated?: undefined;
        foreign_parts_only?: undefined;
    };
    expectedSchema: z.ZodObject<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                imdb_id: z.ZodNumber;
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">>;
    expectError?: undefined;
    expectedErrorPattern?: undefined;
} | {
    name: string;
    description: string;
    tool: string;
    args: {
        parent_imdb_id: number;
        season_number: number;
        episode_number: number;
        languages: string;
        query?: undefined;
        year?: undefined;
        imdb_id?: undefined;
        moviehash?: undefined;
        moviebytesize?: undefined;
        subtitle_id?: undefined;
        format?: undefined;
        file_path?: undefined;
        hearing_impaired?: undefined;
        trusted_sources?: undefined;
        order_by?: undefined;
        order_direction?: undefined;
        machine_translated?: undefined;
        foreign_parts_only?: undefined;
    };
    expectedSchema: z.ZodObject<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 944947, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
                parent_title: z.ZodNullable<z.ZodString>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">>;
    expectError?: undefined;
    expectedErrorPattern?: undefined;
} | {
    name: string;
    description: string;
    tool: string;
    args: {
        parent_imdb_id: number;
        season_number: number;
        episode_number: number;
        languages: string;
        query?: undefined;
        year?: undefined;
        imdb_id?: undefined;
        moviehash?: undefined;
        moviebytesize?: undefined;
        subtitle_id?: undefined;
        format?: undefined;
        file_path?: undefined;
        hearing_impaired?: undefined;
        trusted_sources?: undefined;
        order_by?: undefined;
        order_direction?: undefined;
        machine_translated?: undefined;
        foreign_parts_only?: undefined;
    };
    expectedSchema: z.ZodObject<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 903747, number>;
                season_number: z.ZodEffects<z.ZodNumber, 1, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">>;
    expectError?: undefined;
    expectedErrorPattern?: undefined;
} | {
    name: string;
    description: string;
    tool: string;
    args: {
        parent_imdb_id: number;
        season_number: number;
        episode_number: number;
        languages: string;
        query?: undefined;
        year?: undefined;
        imdb_id?: undefined;
        moviehash?: undefined;
        moviebytesize?: undefined;
        subtitle_id?: undefined;
        format?: undefined;
        file_path?: undefined;
        hearing_impaired?: undefined;
        trusted_sources?: undefined;
        order_by?: undefined;
        order_direction?: undefined;
        machine_translated?: undefined;
        foreign_parts_only?: undefined;
    };
    expectedSchema: z.ZodObject<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 108778, number>;
                season_number: z.ZodEffects<z.ZodNumber, 10, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 17, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">>;
    expectError?: undefined;
    expectedErrorPattern?: undefined;
} | {
    name: string;
    description: string;
    tool: string;
    args: {
        parent_imdb_id: number;
        season_number: number;
        episode_number: number;
        languages: string;
        query?: undefined;
        year?: undefined;
        imdb_id?: undefined;
        moviehash?: undefined;
        moviebytesize?: undefined;
        subtitle_id?: undefined;
        format?: undefined;
        file_path?: undefined;
        hearing_impaired?: undefined;
        trusted_sources?: undefined;
        order_by?: undefined;
        order_direction?: undefined;
        machine_translated?: undefined;
        foreign_parts_only?: undefined;
    };
    expectedSchema: z.ZodObject<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 4574334, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">>;
    expectError?: undefined;
    expectedErrorPattern?: undefined;
} | {
    name: string;
    description: string;
    tool: string;
    args: {
        parent_imdb_id: number;
        season_number: number;
        episode_number: number;
        languages: string;
        query?: undefined;
        year?: undefined;
        imdb_id?: undefined;
        moviehash?: undefined;
        moviebytesize?: undefined;
        subtitle_id?: undefined;
        format?: undefined;
        file_path?: undefined;
        hearing_impaired?: undefined;
        trusted_sources?: undefined;
        order_by?: undefined;
        order_direction?: undefined;
        machine_translated?: undefined;
        foreign_parts_only?: undefined;
    };
    expectedSchema: z.ZodObject<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, string, string>;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, string, string>;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, string, string>;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, string, string>;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, string, string>;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, string, string>;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, string, string>;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, string, string>;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, string, string>;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 386676, number>;
                season_number: z.ZodEffects<z.ZodNumber, 2, number>;
                episode_number: z.ZodEffects<z.ZodNumber, 1, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">>;
    expectError?: undefined;
    expectedErrorPattern?: undefined;
} | {
    name: string;
    description: string;
    tool: string;
    args: {
        parent_imdb_id: number;
        season_number: number;
        episode_number: number;
        languages: string;
        query?: undefined;
        year?: undefined;
        imdb_id?: undefined;
        moviehash?: undefined;
        moviebytesize?: undefined;
        subtitle_id?: undefined;
        format?: undefined;
        file_path?: undefined;
        hearing_impaired?: undefined;
        trusted_sources?: undefined;
        order_by?: undefined;
        order_direction?: undefined;
        machine_translated?: undefined;
        foreign_parts_only?: undefined;
    };
    expectedSchema: z.ZodObject<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                parent_imdb_id: z.ZodEffects<z.ZodNumber, 2560140, number>;
                season_number: z.ZodEffects<z.ZodNumber, number, number>;
                episode_number: z.ZodEffects<z.ZodNumber, number, number>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">>;
    expectError?: undefined;
    expectedErrorPattern?: undefined;
} | {
    name: string;
    description: string;
    tool: string;
    args: {
        query: string;
        languages: string;
        year?: undefined;
        imdb_id?: undefined;
        parent_imdb_id?: undefined;
        season_number?: undefined;
        episode_number?: undefined;
        moviehash?: undefined;
        moviebytesize?: undefined;
        subtitle_id?: undefined;
        format?: undefined;
        file_path?: undefined;
        hearing_impaired?: undefined;
        trusted_sources?: undefined;
        order_by?: undefined;
        order_direction?: undefined;
        machine_translated?: undefined;
        foreign_parts_only?: undefined;
    };
    expectedSchema: z.ZodObject<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            movie_info: z.ZodObject<{
                title: z.ZodString;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                title: z.ZodString;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">>;
    expectError?: undefined;
    expectedErrorPattern?: undefined;
} | {
    name: string;
    description: string;
    tool: string;
    args: {
        moviehash: string;
        moviebytesize: number;
        query?: undefined;
        year?: undefined;
        languages?: undefined;
        imdb_id?: undefined;
        parent_imdb_id?: undefined;
        season_number?: undefined;
        episode_number?: undefined;
        subtitle_id?: undefined;
        format?: undefined;
        file_path?: undefined;
        hearing_impaired?: undefined;
        trusted_sources?: undefined;
        order_by?: undefined;
        order_direction?: undefined;
        machine_translated?: undefined;
        foreign_parts_only?: undefined;
    };
    expectedSchema: z.ZodObject<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">>;
    expectError?: undefined;
    expectedErrorPattern?: undefined;
} | {
    name: string;
    description: string;
    tool: string;
    args: {
        subtitle_id: string;
        format: string;
        query?: undefined;
        year?: undefined;
        languages?: undefined;
        imdb_id?: undefined;
        parent_imdb_id?: undefined;
        season_number?: undefined;
        episode_number?: undefined;
        moviehash?: undefined;
        moviebytesize?: undefined;
        file_path?: undefined;
        hearing_impaired?: undefined;
        trusted_sources?: undefined;
        order_by?: undefined;
        order_direction?: undefined;
        machine_translated?: undefined;
        foreign_parts_only?: undefined;
    };
    expectError: boolean;
    expectedErrorPattern: RegExp;
    expectedSchema?: undefined;
} | {
    name: string;
    description: string;
    tool: string;
    args: {
        file_path: string;
        query?: undefined;
        year?: undefined;
        languages?: undefined;
        imdb_id?: undefined;
        parent_imdb_id?: undefined;
        season_number?: undefined;
        episode_number?: undefined;
        moviehash?: undefined;
        moviebytesize?: undefined;
        subtitle_id?: undefined;
        format?: undefined;
        hearing_impaired?: undefined;
        trusted_sources?: undefined;
        order_by?: undefined;
        order_direction?: undefined;
        machine_translated?: undefined;
        foreign_parts_only?: undefined;
    };
    expectError: boolean;
    expectedErrorPattern: RegExp;
    expectedSchema?: undefined;
} | {
    name: string;
    description: string;
    tool: string;
    args: {
        query: string;
        year: number;
        languages: string;
        hearing_impaired: string;
        trusted_sources: string;
        order_by: string;
        order_direction: string;
        imdb_id?: undefined;
        parent_imdb_id?: undefined;
        season_number?: undefined;
        episode_number?: undefined;
        moviehash?: undefined;
        moviebytesize?: undefined;
        subtitle_id?: undefined;
        format?: undefined;
        file_path?: undefined;
        machine_translated?: undefined;
        foreign_parts_only?: undefined;
    };
    expectedSchema: z.ZodObject<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                hearing_impaired: z.ZodBoolean;
                from_trusted: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">>;
    expectError?: undefined;
    expectedErrorPattern?: undefined;
} | {
    name: string;
    description: string;
    tool: string;
    args: {
        query: string;
        year: number;
        languages: string;
        machine_translated: string;
        imdb_id?: undefined;
        parent_imdb_id?: undefined;
        season_number?: undefined;
        episode_number?: undefined;
        moviehash?: undefined;
        moviebytesize?: undefined;
        subtitle_id?: undefined;
        format?: undefined;
        file_path?: undefined;
        hearing_impaired?: undefined;
        trusted_sources?: undefined;
        order_by?: undefined;
        order_direction?: undefined;
        foreign_parts_only?: undefined;
    };
    expectedSchema: z.ZodObject<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                machine_translated: z.ZodBoolean;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                machine_translated: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                machine_translated: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                machine_translated: z.ZodBoolean;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                machine_translated: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                machine_translated: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                machine_translated: z.ZodBoolean;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                machine_translated: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                machine_translated: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                machine_translated: z.ZodBoolean;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                machine_translated: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                machine_translated: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                machine_translated: z.ZodBoolean;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                machine_translated: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                machine_translated: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                machine_translated: z.ZodBoolean;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                machine_translated: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                machine_translated: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                machine_translated: z.ZodBoolean;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                machine_translated: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                machine_translated: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                machine_translated: z.ZodBoolean;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                machine_translated: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                machine_translated: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                machine_translated: z.ZodBoolean;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                machine_translated: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                machine_translated: z.ZodBoolean;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">>;
    expectError?: undefined;
    expectedErrorPattern?: undefined;
} | {
    name: string;
    description: string;
    tool: string;
    args: {
        query: string;
        year: number;
        languages: string;
        hearing_impaired: string;
        imdb_id?: undefined;
        parent_imdb_id?: undefined;
        season_number?: undefined;
        episode_number?: undefined;
        moviehash?: undefined;
        moviebytesize?: undefined;
        subtitle_id?: undefined;
        format?: undefined;
        file_path?: undefined;
        trusted_sources?: undefined;
        order_by?: undefined;
        order_direction?: undefined;
        machine_translated?: undefined;
        foreign_parts_only?: undefined;
    };
    expectedSchema: z.ZodObject<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                hearing_impaired: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">>;
    expectError?: undefined;
    expectedErrorPattern?: undefined;
} | {
    name: string;
    description: string;
    tool: string;
    args: {
        query: string;
        year: number;
        languages: string;
        trusted_sources: string;
        order_by: string;
        order_direction: string;
        imdb_id?: undefined;
        parent_imdb_id?: undefined;
        season_number?: undefined;
        episode_number?: undefined;
        moviehash?: undefined;
        moviebytesize?: undefined;
        subtitle_id?: undefined;
        format?: undefined;
        file_path?: undefined;
        hearing_impaired?: undefined;
        machine_translated?: undefined;
        foreign_parts_only?: undefined;
    };
    expectedSchema: z.ZodObject<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                from_trusted: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
                download_count: z.ZodNumber;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">>;
    expectError?: undefined;
    expectedErrorPattern?: undefined;
} | {
    name: string;
    description: string;
    tool: string;
    args: {
        query: string;
        year: number;
        languages: string;
        foreign_parts_only: string;
        imdb_id?: undefined;
        parent_imdb_id?: undefined;
        season_number?: undefined;
        episode_number?: undefined;
        moviehash?: undefined;
        moviebytesize?: undefined;
        subtitle_id?: undefined;
        format?: undefined;
        file_path?: undefined;
        hearing_impaired?: undefined;
        trusted_sources?: undefined;
        order_by?: undefined;
        order_direction?: undefined;
        machine_translated?: undefined;
    };
    expectedSchema: z.ZodObject<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodString;
            quality_info: z.ZodObject<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                foreign_parts_only: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
            }, z.ZodTypeAny, "passthrough">>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">>;
    expectError?: undefined;
    expectedErrorPattern?: undefined;
} | {
    name: string;
    description: string;
    tool: string;
    args: {
        query: string;
        year: number;
        languages: string;
        imdb_id?: undefined;
        parent_imdb_id?: undefined;
        season_number?: undefined;
        episode_number?: undefined;
        moviehash?: undefined;
        moviebytesize?: undefined;
        subtitle_id?: undefined;
        format?: undefined;
        file_path?: undefined;
        hearing_impaired?: undefined;
        trusted_sources?: undefined;
        order_by?: undefined;
        order_direction?: undefined;
        machine_translated?: undefined;
        foreign_parts_only?: undefined;
    };
    expectedSchema: z.ZodObject<{
        total_results: z.ZodEffects<z.ZodNumber, 0, number>;
        subtitles: z.ZodArray<z.ZodAny, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        total_results: z.ZodEffects<z.ZodNumber, 0, number>;
        subtitles: z.ZodArray<z.ZodAny, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        total_results: z.ZodEffects<z.ZodNumber, 0, number>;
        subtitles: z.ZodArray<z.ZodAny, "many">;
    }, z.ZodTypeAny, "passthrough">>;
    expectError?: undefined;
    expectedErrorPattern?: undefined;
} | {
    name: string;
    description: string;
    tool: string;
    args: {
        parent_imdb_id: number;
        season_number: number;
        episode_number: number;
        languages: string;
        query?: undefined;
        year?: undefined;
        imdb_id?: undefined;
        moviehash?: undefined;
        moviebytesize?: undefined;
        subtitle_id?: undefined;
        format?: undefined;
        file_path?: undefined;
        hearing_impaired?: undefined;
        trusted_sources?: undefined;
        order_by?: undefined;
        order_direction?: undefined;
        machine_translated?: undefined;
        foreign_parts_only?: undefined;
    };
    expectedSchema: z.ZodObject<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodAny, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodAny, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodAny, "many">;
    }, z.ZodTypeAny, "passthrough">>;
    expectError?: undefined;
    expectedErrorPattern?: undefined;
} | {
    name: string;
    description: string;
    tool: string;
    args: {
        query: string;
        year: number;
        languages: string;
        imdb_id?: undefined;
        parent_imdb_id?: undefined;
        season_number?: undefined;
        episode_number?: undefined;
        moviehash?: undefined;
        moviebytesize?: undefined;
        subtitle_id?: undefined;
        format?: undefined;
        file_path?: undefined;
        hearing_impaired?: undefined;
        trusted_sources?: undefined;
        order_by?: undefined;
        order_direction?: undefined;
        machine_translated?: undefined;
        foreign_parts_only?: undefined;
    };
    expectedSchema: z.ZodObject<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, string, string>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, string, string>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, string, string>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, string, string>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, string, string>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, string, string>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, string, string>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, string, string>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, string, string>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">>;
    expectError?: undefined;
    expectedErrorPattern?: undefined;
} | {
    name: string;
    description: string;
    tool: string;
    args: {
        languages: string;
        year: number;
        trusted_sources: string;
        query?: undefined;
        imdb_id?: undefined;
        parent_imdb_id?: undefined;
        season_number?: undefined;
        episode_number?: undefined;
        moviehash?: undefined;
        moviebytesize?: undefined;
        subtitle_id?: undefined;
        format?: undefined;
        file_path?: undefined;
        hearing_impaired?: undefined;
        order_by?: undefined;
        order_direction?: undefined;
        machine_translated?: undefined;
        foreign_parts_only?: undefined;
    };
    expectedSchema: z.ZodObject<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, "en", string>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, "en", string>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, "en", string>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, "en", string>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, "en", string>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, "en", string>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        total_results: z.ZodNumber;
        subtitles: z.ZodArray<z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, "en", string>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, "en", string>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            subtitle_id: z.ZodString;
            language: z.ZodEffects<z.ZodString, "en", string>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
    }, z.ZodTypeAny, "passthrough">>;
    expectError?: undefined;
    expectedErrorPattern?: undefined;
})[];
export declare function runEvaluation(evaluation: any, result: any): {
    success: boolean;
    message: string;
};
//# sourceMappingURL=evals.d.ts.map