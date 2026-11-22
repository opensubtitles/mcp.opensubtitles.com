import { z } from "zod";
export declare const SubtitleFileSchema: z.ZodObject<{
    file_id: z.ZodNumber;
    file_name: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
    cd_number: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    file_id: number;
    file_name: string;
    cd_number?: number | null | undefined;
}, {
    file_id: number;
    file_name?: string | null | undefined;
    cd_number?: number | null | undefined;
}>;
export declare const SubtitleAttributesSchema: z.ZodObject<{
    subtitle_id: z.ZodString;
    language: z.ZodNullable<z.ZodString>;
    download_count: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodNumber>>, number, number | null | undefined>;
    new_download_count: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodNumber>>, number, number | null | undefined>;
    hearing_impaired: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
    hd: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
    fps: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    votes: z.ZodDefault<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
    points: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodNumber>>, number, number | null | undefined>;
    ratings: z.ZodDefault<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
    from_trusted: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
    foreign_parts_only: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
    ai_translated: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
    machine_translated: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
    upload_date: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
    release: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
    comments: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    legacy_subtitle_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    legacy_uploader_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    nb_cd: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    slug: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    uploader: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        uploader_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        name: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
        rank: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        rank: string;
        uploader_id?: number | null | undefined;
    }, {
        uploader_id?: number | null | undefined;
        name?: string | null | undefined;
        rank?: string | null | undefined;
    }>>>, {
        name: string;
        rank: string;
        uploader_id?: number | null | undefined;
    }, {
        uploader_id?: number | null | undefined;
        name?: string | null | undefined;
        rank?: string | null | undefined;
    } | null | undefined>;
    feature_details: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        feature_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        feature_type: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
        year: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        title: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
        movie_name: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
        imdb_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        tmdb_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        season_number: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        episode_number: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        parent_imdb_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        parent_title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        parent_tmdb_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        parent_feature_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        feature_type: string;
        title: string;
        movie_name: string;
        feature_id?: number | null | undefined;
        year?: number | null | undefined;
        imdb_id?: number | null | undefined;
        tmdb_id?: number | null | undefined;
        season_number?: number | null | undefined;
        episode_number?: number | null | undefined;
        parent_imdb_id?: number | null | undefined;
        parent_title?: string | null | undefined;
        parent_tmdb_id?: number | null | undefined;
        parent_feature_id?: number | null | undefined;
    }, {
        feature_id?: number | null | undefined;
        feature_type?: string | null | undefined;
        year?: number | null | undefined;
        title?: string | null | undefined;
        movie_name?: string | null | undefined;
        imdb_id?: number | null | undefined;
        tmdb_id?: number | null | undefined;
        season_number?: number | null | undefined;
        episode_number?: number | null | undefined;
        parent_imdb_id?: number | null | undefined;
        parent_title?: string | null | undefined;
        parent_tmdb_id?: number | null | undefined;
        parent_feature_id?: number | null | undefined;
    }>>>, Partial<{
        feature_id: number | null;
        feature_type: string;
        year: number | null;
        title: string;
        movie_name: string;
        imdb_id: number | null;
        tmdb_id: number | null;
        season_number: number | null;
        episode_number: number | null;
        parent_imdb_id: number | null;
        parent_title: string | null;
        parent_tmdb_id: number | null;
        parent_feature_id: number | null;
    }>, {
        feature_id?: number | null | undefined;
        feature_type?: string | null | undefined;
        year?: number | null | undefined;
        title?: string | null | undefined;
        movie_name?: string | null | undefined;
        imdb_id?: number | null | undefined;
        tmdb_id?: number | null | undefined;
        season_number?: number | null | undefined;
        episode_number?: number | null | undefined;
        parent_imdb_id?: number | null | undefined;
        parent_title?: string | null | undefined;
        parent_tmdb_id?: number | null | undefined;
        parent_feature_id?: number | null | undefined;
    } | null | undefined>;
    url: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
    related_links: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodAny, "many">>>, any[], any[] | null | undefined>;
    files: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        file_id: z.ZodNumber;
        file_name: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
        cd_number: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        file_id: number;
        file_name: string;
        cd_number?: number | null | undefined;
    }, {
        file_id: number;
        file_name?: string | null | undefined;
        cd_number?: number | null | undefined;
    }>, "many">>>, {
        file_id: number;
        file_name: string;
        cd_number?: number | null | undefined;
    }[], {
        file_id: number;
        file_name?: string | null | undefined;
        cd_number?: number | null | undefined;
    }[] | null | undefined>;
}, "strip", z.ZodTypeAny, {
    subtitle_id: string;
    language: string | null;
    download_count: number;
    new_download_count: number;
    hearing_impaired: boolean | null;
    hd: boolean | null;
    votes: number | null;
    points: number;
    ratings: number | null;
    from_trusted: boolean | null;
    foreign_parts_only: boolean | null;
    ai_translated: boolean | null;
    machine_translated: boolean | null;
    upload_date: string;
    release: string;
    comments: string | null;
    uploader: {
        name: string;
        rank: string;
        uploader_id?: number | null | undefined;
    };
    feature_details: Partial<{
        feature_id: number | null;
        feature_type: string;
        year: number | null;
        title: string;
        movie_name: string;
        imdb_id: number | null;
        tmdb_id: number | null;
        season_number: number | null;
        episode_number: number | null;
        parent_imdb_id: number | null;
        parent_title: string | null;
        parent_tmdb_id: number | null;
        parent_feature_id: number | null;
    }>;
    url: string;
    related_links: any[];
    files: {
        file_id: number;
        file_name: string;
        cd_number?: number | null | undefined;
    }[];
    fps?: number | null | undefined;
    legacy_subtitle_id?: number | null | undefined;
    legacy_uploader_id?: number | null | undefined;
    nb_cd?: number | null | undefined;
    slug?: string | null | undefined;
}, {
    subtitle_id: string;
    language: string | null;
    download_count?: number | null | undefined;
    new_download_count?: number | null | undefined;
    hearing_impaired?: boolean | null | undefined;
    hd?: boolean | null | undefined;
    fps?: number | null | undefined;
    votes?: number | null | undefined;
    points?: number | null | undefined;
    ratings?: number | null | undefined;
    from_trusted?: boolean | null | undefined;
    foreign_parts_only?: boolean | null | undefined;
    ai_translated?: boolean | null | undefined;
    machine_translated?: boolean | null | undefined;
    upload_date?: string | null | undefined;
    release?: string | null | undefined;
    comments?: string | null | undefined;
    legacy_subtitle_id?: number | null | undefined;
    legacy_uploader_id?: number | null | undefined;
    nb_cd?: number | null | undefined;
    slug?: string | null | undefined;
    uploader?: {
        uploader_id?: number | null | undefined;
        name?: string | null | undefined;
        rank?: string | null | undefined;
    } | null | undefined;
    feature_details?: {
        feature_id?: number | null | undefined;
        feature_type?: string | null | undefined;
        year?: number | null | undefined;
        title?: string | null | undefined;
        movie_name?: string | null | undefined;
        imdb_id?: number | null | undefined;
        tmdb_id?: number | null | undefined;
        season_number?: number | null | undefined;
        episode_number?: number | null | undefined;
        parent_imdb_id?: number | null | undefined;
        parent_title?: string | null | undefined;
        parent_tmdb_id?: number | null | undefined;
        parent_feature_id?: number | null | undefined;
    } | null | undefined;
    url?: string | null | undefined;
    related_links?: any[] | null | undefined;
    files?: {
        file_id: number;
        file_name?: string | null | undefined;
        cd_number?: number | null | undefined;
    }[] | null | undefined;
}>;
export declare const SubtitleSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodString;
    attributes: z.ZodObject<{
        subtitle_id: z.ZodString;
        language: z.ZodNullable<z.ZodString>;
        download_count: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodNumber>>, number, number | null | undefined>;
        new_download_count: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodNumber>>, number, number | null | undefined>;
        hearing_impaired: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
        hd: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
        fps: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        votes: z.ZodDefault<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
        points: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodNumber>>, number, number | null | undefined>;
        ratings: z.ZodDefault<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
        from_trusted: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
        foreign_parts_only: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
        ai_translated: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
        machine_translated: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
        upload_date: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
        release: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
        comments: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
        legacy_subtitle_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        legacy_uploader_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        nb_cd: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        slug: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        uploader: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            uploader_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            name: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
            rank: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            rank: string;
            uploader_id?: number | null | undefined;
        }, {
            uploader_id?: number | null | undefined;
            name?: string | null | undefined;
            rank?: string | null | undefined;
        }>>>, {
            name: string;
            rank: string;
            uploader_id?: number | null | undefined;
        }, {
            uploader_id?: number | null | undefined;
            name?: string | null | undefined;
            rank?: string | null | undefined;
        } | null | undefined>;
        feature_details: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            feature_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            feature_type: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
            year: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
            movie_name: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
            imdb_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            tmdb_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            season_number: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            episode_number: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            parent_imdb_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            parent_title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            parent_tmdb_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            parent_feature_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            feature_type: string;
            title: string;
            movie_name: string;
            feature_id?: number | null | undefined;
            year?: number | null | undefined;
            imdb_id?: number | null | undefined;
            tmdb_id?: number | null | undefined;
            season_number?: number | null | undefined;
            episode_number?: number | null | undefined;
            parent_imdb_id?: number | null | undefined;
            parent_title?: string | null | undefined;
            parent_tmdb_id?: number | null | undefined;
            parent_feature_id?: number | null | undefined;
        }, {
            feature_id?: number | null | undefined;
            feature_type?: string | null | undefined;
            year?: number | null | undefined;
            title?: string | null | undefined;
            movie_name?: string | null | undefined;
            imdb_id?: number | null | undefined;
            tmdb_id?: number | null | undefined;
            season_number?: number | null | undefined;
            episode_number?: number | null | undefined;
            parent_imdb_id?: number | null | undefined;
            parent_title?: string | null | undefined;
            parent_tmdb_id?: number | null | undefined;
            parent_feature_id?: number | null | undefined;
        }>>>, Partial<{
            feature_id: number | null;
            feature_type: string;
            year: number | null;
            title: string;
            movie_name: string;
            imdb_id: number | null;
            tmdb_id: number | null;
            season_number: number | null;
            episode_number: number | null;
            parent_imdb_id: number | null;
            parent_title: string | null;
            parent_tmdb_id: number | null;
            parent_feature_id: number | null;
        }>, {
            feature_id?: number | null | undefined;
            feature_type?: string | null | undefined;
            year?: number | null | undefined;
            title?: string | null | undefined;
            movie_name?: string | null | undefined;
            imdb_id?: number | null | undefined;
            tmdb_id?: number | null | undefined;
            season_number?: number | null | undefined;
            episode_number?: number | null | undefined;
            parent_imdb_id?: number | null | undefined;
            parent_title?: string | null | undefined;
            parent_tmdb_id?: number | null | undefined;
            parent_feature_id?: number | null | undefined;
        } | null | undefined>;
        url: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
        related_links: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodAny, "many">>>, any[], any[] | null | undefined>;
        files: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
            file_id: z.ZodNumber;
            file_name: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
            cd_number: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            file_id: number;
            file_name: string;
            cd_number?: number | null | undefined;
        }, {
            file_id: number;
            file_name?: string | null | undefined;
            cd_number?: number | null | undefined;
        }>, "many">>>, {
            file_id: number;
            file_name: string;
            cd_number?: number | null | undefined;
        }[], {
            file_id: number;
            file_name?: string | null | undefined;
            cd_number?: number | null | undefined;
        }[] | null | undefined>;
    }, "strip", z.ZodTypeAny, {
        subtitle_id: string;
        language: string | null;
        download_count: number;
        new_download_count: number;
        hearing_impaired: boolean | null;
        hd: boolean | null;
        votes: number | null;
        points: number;
        ratings: number | null;
        from_trusted: boolean | null;
        foreign_parts_only: boolean | null;
        ai_translated: boolean | null;
        machine_translated: boolean | null;
        upload_date: string;
        release: string;
        comments: string | null;
        uploader: {
            name: string;
            rank: string;
            uploader_id?: number | null | undefined;
        };
        feature_details: Partial<{
            feature_id: number | null;
            feature_type: string;
            year: number | null;
            title: string;
            movie_name: string;
            imdb_id: number | null;
            tmdb_id: number | null;
            season_number: number | null;
            episode_number: number | null;
            parent_imdb_id: number | null;
            parent_title: string | null;
            parent_tmdb_id: number | null;
            parent_feature_id: number | null;
        }>;
        url: string;
        related_links: any[];
        files: {
            file_id: number;
            file_name: string;
            cd_number?: number | null | undefined;
        }[];
        fps?: number | null | undefined;
        legacy_subtitle_id?: number | null | undefined;
        legacy_uploader_id?: number | null | undefined;
        nb_cd?: number | null | undefined;
        slug?: string | null | undefined;
    }, {
        subtitle_id: string;
        language: string | null;
        download_count?: number | null | undefined;
        new_download_count?: number | null | undefined;
        hearing_impaired?: boolean | null | undefined;
        hd?: boolean | null | undefined;
        fps?: number | null | undefined;
        votes?: number | null | undefined;
        points?: number | null | undefined;
        ratings?: number | null | undefined;
        from_trusted?: boolean | null | undefined;
        foreign_parts_only?: boolean | null | undefined;
        ai_translated?: boolean | null | undefined;
        machine_translated?: boolean | null | undefined;
        upload_date?: string | null | undefined;
        release?: string | null | undefined;
        comments?: string | null | undefined;
        legacy_subtitle_id?: number | null | undefined;
        legacy_uploader_id?: number | null | undefined;
        nb_cd?: number | null | undefined;
        slug?: string | null | undefined;
        uploader?: {
            uploader_id?: number | null | undefined;
            name?: string | null | undefined;
            rank?: string | null | undefined;
        } | null | undefined;
        feature_details?: {
            feature_id?: number | null | undefined;
            feature_type?: string | null | undefined;
            year?: number | null | undefined;
            title?: string | null | undefined;
            movie_name?: string | null | undefined;
            imdb_id?: number | null | undefined;
            tmdb_id?: number | null | undefined;
            season_number?: number | null | undefined;
            episode_number?: number | null | undefined;
            parent_imdb_id?: number | null | undefined;
            parent_title?: string | null | undefined;
            parent_tmdb_id?: number | null | undefined;
            parent_feature_id?: number | null | undefined;
        } | null | undefined;
        url?: string | null | undefined;
        related_links?: any[] | null | undefined;
        files?: {
            file_id: number;
            file_name?: string | null | undefined;
            cd_number?: number | null | undefined;
        }[] | null | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    type: string;
    id: string;
    attributes: {
        subtitle_id: string;
        language: string | null;
        download_count: number;
        new_download_count: number;
        hearing_impaired: boolean | null;
        hd: boolean | null;
        votes: number | null;
        points: number;
        ratings: number | null;
        from_trusted: boolean | null;
        foreign_parts_only: boolean | null;
        ai_translated: boolean | null;
        machine_translated: boolean | null;
        upload_date: string;
        release: string;
        comments: string | null;
        uploader: {
            name: string;
            rank: string;
            uploader_id?: number | null | undefined;
        };
        feature_details: Partial<{
            feature_id: number | null;
            feature_type: string;
            year: number | null;
            title: string;
            movie_name: string;
            imdb_id: number | null;
            tmdb_id: number | null;
            season_number: number | null;
            episode_number: number | null;
            parent_imdb_id: number | null;
            parent_title: string | null;
            parent_tmdb_id: number | null;
            parent_feature_id: number | null;
        }>;
        url: string;
        related_links: any[];
        files: {
            file_id: number;
            file_name: string;
            cd_number?: number | null | undefined;
        }[];
        fps?: number | null | undefined;
        legacy_subtitle_id?: number | null | undefined;
        legacy_uploader_id?: number | null | undefined;
        nb_cd?: number | null | undefined;
        slug?: string | null | undefined;
    };
}, {
    type: string;
    id: string;
    attributes: {
        subtitle_id: string;
        language: string | null;
        download_count?: number | null | undefined;
        new_download_count?: number | null | undefined;
        hearing_impaired?: boolean | null | undefined;
        hd?: boolean | null | undefined;
        fps?: number | null | undefined;
        votes?: number | null | undefined;
        points?: number | null | undefined;
        ratings?: number | null | undefined;
        from_trusted?: boolean | null | undefined;
        foreign_parts_only?: boolean | null | undefined;
        ai_translated?: boolean | null | undefined;
        machine_translated?: boolean | null | undefined;
        upload_date?: string | null | undefined;
        release?: string | null | undefined;
        comments?: string | null | undefined;
        legacy_subtitle_id?: number | null | undefined;
        legacy_uploader_id?: number | null | undefined;
        nb_cd?: number | null | undefined;
        slug?: string | null | undefined;
        uploader?: {
            uploader_id?: number | null | undefined;
            name?: string | null | undefined;
            rank?: string | null | undefined;
        } | null | undefined;
        feature_details?: {
            feature_id?: number | null | undefined;
            feature_type?: string | null | undefined;
            year?: number | null | undefined;
            title?: string | null | undefined;
            movie_name?: string | null | undefined;
            imdb_id?: number | null | undefined;
            tmdb_id?: number | null | undefined;
            season_number?: number | null | undefined;
            episode_number?: number | null | undefined;
            parent_imdb_id?: number | null | undefined;
            parent_title?: string | null | undefined;
            parent_tmdb_id?: number | null | undefined;
            parent_feature_id?: number | null | undefined;
        } | null | undefined;
        url?: string | null | undefined;
        related_links?: any[] | null | undefined;
        files?: {
            file_id: number;
            file_name?: string | null | undefined;
            cd_number?: number | null | undefined;
        }[] | null | undefined;
    };
}>;
export declare const SearchResponseSchema: z.ZodObject<{
    total_pages: z.ZodNumber;
    total_count: z.ZodNumber;
    per_page: z.ZodNumber;
    page: z.ZodNumber;
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodString;
        attributes: z.ZodObject<{
            subtitle_id: z.ZodString;
            language: z.ZodNullable<z.ZodString>;
            download_count: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodNumber>>, number, number | null | undefined>;
            new_download_count: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodNumber>>, number, number | null | undefined>;
            hearing_impaired: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
            hd: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
            fps: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            votes: z.ZodDefault<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
            points: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodNumber>>, number, number | null | undefined>;
            ratings: z.ZodDefault<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
            from_trusted: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
            foreign_parts_only: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
            ai_translated: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
            machine_translated: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
            upload_date: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
            release: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
            comments: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
            legacy_subtitle_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            legacy_uploader_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            nb_cd: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            slug: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uploader: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                uploader_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                name: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
                rank: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                rank: string;
                uploader_id?: number | null | undefined;
            }, {
                uploader_id?: number | null | undefined;
                name?: string | null | undefined;
                rank?: string | null | undefined;
            }>>>, {
                name: string;
                rank: string;
                uploader_id?: number | null | undefined;
            }, {
                uploader_id?: number | null | undefined;
                name?: string | null | undefined;
                rank?: string | null | undefined;
            } | null | undefined>;
            feature_details: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                feature_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                feature_type: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
                year: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                title: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
                movie_name: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
                imdb_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                tmdb_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                season_number: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                episode_number: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                parent_imdb_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                parent_title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                parent_tmdb_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                parent_feature_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "strip", z.ZodTypeAny, {
                feature_type: string;
                title: string;
                movie_name: string;
                feature_id?: number | null | undefined;
                year?: number | null | undefined;
                imdb_id?: number | null | undefined;
                tmdb_id?: number | null | undefined;
                season_number?: number | null | undefined;
                episode_number?: number | null | undefined;
                parent_imdb_id?: number | null | undefined;
                parent_title?: string | null | undefined;
                parent_tmdb_id?: number | null | undefined;
                parent_feature_id?: number | null | undefined;
            }, {
                feature_id?: number | null | undefined;
                feature_type?: string | null | undefined;
                year?: number | null | undefined;
                title?: string | null | undefined;
                movie_name?: string | null | undefined;
                imdb_id?: number | null | undefined;
                tmdb_id?: number | null | undefined;
                season_number?: number | null | undefined;
                episode_number?: number | null | undefined;
                parent_imdb_id?: number | null | undefined;
                parent_title?: string | null | undefined;
                parent_tmdb_id?: number | null | undefined;
                parent_feature_id?: number | null | undefined;
            }>>>, Partial<{
                feature_id: number | null;
                feature_type: string;
                year: number | null;
                title: string;
                movie_name: string;
                imdb_id: number | null;
                tmdb_id: number | null;
                season_number: number | null;
                episode_number: number | null;
                parent_imdb_id: number | null;
                parent_title: string | null;
                parent_tmdb_id: number | null;
                parent_feature_id: number | null;
            }>, {
                feature_id?: number | null | undefined;
                feature_type?: string | null | undefined;
                year?: number | null | undefined;
                title?: string | null | undefined;
                movie_name?: string | null | undefined;
                imdb_id?: number | null | undefined;
                tmdb_id?: number | null | undefined;
                season_number?: number | null | undefined;
                episode_number?: number | null | undefined;
                parent_imdb_id?: number | null | undefined;
                parent_title?: string | null | undefined;
                parent_tmdb_id?: number | null | undefined;
                parent_feature_id?: number | null | undefined;
            } | null | undefined>;
            url: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
            related_links: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodAny, "many">>>, any[], any[] | null | undefined>;
            files: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
                file_id: z.ZodNumber;
                file_name: z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodString>>, string, string | null | undefined>;
                cd_number: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, "strip", z.ZodTypeAny, {
                file_id: number;
                file_name: string;
                cd_number?: number | null | undefined;
            }, {
                file_id: number;
                file_name?: string | null | undefined;
                cd_number?: number | null | undefined;
            }>, "many">>>, {
                file_id: number;
                file_name: string;
                cd_number?: number | null | undefined;
            }[], {
                file_id: number;
                file_name?: string | null | undefined;
                cd_number?: number | null | undefined;
            }[] | null | undefined>;
        }, "strip", z.ZodTypeAny, {
            subtitle_id: string;
            language: string | null;
            download_count: number;
            new_download_count: number;
            hearing_impaired: boolean | null;
            hd: boolean | null;
            votes: number | null;
            points: number;
            ratings: number | null;
            from_trusted: boolean | null;
            foreign_parts_only: boolean | null;
            ai_translated: boolean | null;
            machine_translated: boolean | null;
            upload_date: string;
            release: string;
            comments: string | null;
            uploader: {
                name: string;
                rank: string;
                uploader_id?: number | null | undefined;
            };
            feature_details: Partial<{
                feature_id: number | null;
                feature_type: string;
                year: number | null;
                title: string;
                movie_name: string;
                imdb_id: number | null;
                tmdb_id: number | null;
                season_number: number | null;
                episode_number: number | null;
                parent_imdb_id: number | null;
                parent_title: string | null;
                parent_tmdb_id: number | null;
                parent_feature_id: number | null;
            }>;
            url: string;
            related_links: any[];
            files: {
                file_id: number;
                file_name: string;
                cd_number?: number | null | undefined;
            }[];
            fps?: number | null | undefined;
            legacy_subtitle_id?: number | null | undefined;
            legacy_uploader_id?: number | null | undefined;
            nb_cd?: number | null | undefined;
            slug?: string | null | undefined;
        }, {
            subtitle_id: string;
            language: string | null;
            download_count?: number | null | undefined;
            new_download_count?: number | null | undefined;
            hearing_impaired?: boolean | null | undefined;
            hd?: boolean | null | undefined;
            fps?: number | null | undefined;
            votes?: number | null | undefined;
            points?: number | null | undefined;
            ratings?: number | null | undefined;
            from_trusted?: boolean | null | undefined;
            foreign_parts_only?: boolean | null | undefined;
            ai_translated?: boolean | null | undefined;
            machine_translated?: boolean | null | undefined;
            upload_date?: string | null | undefined;
            release?: string | null | undefined;
            comments?: string | null | undefined;
            legacy_subtitle_id?: number | null | undefined;
            legacy_uploader_id?: number | null | undefined;
            nb_cd?: number | null | undefined;
            slug?: string | null | undefined;
            uploader?: {
                uploader_id?: number | null | undefined;
                name?: string | null | undefined;
                rank?: string | null | undefined;
            } | null | undefined;
            feature_details?: {
                feature_id?: number | null | undefined;
                feature_type?: string | null | undefined;
                year?: number | null | undefined;
                title?: string | null | undefined;
                movie_name?: string | null | undefined;
                imdb_id?: number | null | undefined;
                tmdb_id?: number | null | undefined;
                season_number?: number | null | undefined;
                episode_number?: number | null | undefined;
                parent_imdb_id?: number | null | undefined;
                parent_title?: string | null | undefined;
                parent_tmdb_id?: number | null | undefined;
                parent_feature_id?: number | null | undefined;
            } | null | undefined;
            url?: string | null | undefined;
            related_links?: any[] | null | undefined;
            files?: {
                file_id: number;
                file_name?: string | null | undefined;
                cd_number?: number | null | undefined;
            }[] | null | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        id: string;
        attributes: {
            subtitle_id: string;
            language: string | null;
            download_count: number;
            new_download_count: number;
            hearing_impaired: boolean | null;
            hd: boolean | null;
            votes: number | null;
            points: number;
            ratings: number | null;
            from_trusted: boolean | null;
            foreign_parts_only: boolean | null;
            ai_translated: boolean | null;
            machine_translated: boolean | null;
            upload_date: string;
            release: string;
            comments: string | null;
            uploader: {
                name: string;
                rank: string;
                uploader_id?: number | null | undefined;
            };
            feature_details: Partial<{
                feature_id: number | null;
                feature_type: string;
                year: number | null;
                title: string;
                movie_name: string;
                imdb_id: number | null;
                tmdb_id: number | null;
                season_number: number | null;
                episode_number: number | null;
                parent_imdb_id: number | null;
                parent_title: string | null;
                parent_tmdb_id: number | null;
                parent_feature_id: number | null;
            }>;
            url: string;
            related_links: any[];
            files: {
                file_id: number;
                file_name: string;
                cd_number?: number | null | undefined;
            }[];
            fps?: number | null | undefined;
            legacy_subtitle_id?: number | null | undefined;
            legacy_uploader_id?: number | null | undefined;
            nb_cd?: number | null | undefined;
            slug?: string | null | undefined;
        };
    }, {
        type: string;
        id: string;
        attributes: {
            subtitle_id: string;
            language: string | null;
            download_count?: number | null | undefined;
            new_download_count?: number | null | undefined;
            hearing_impaired?: boolean | null | undefined;
            hd?: boolean | null | undefined;
            fps?: number | null | undefined;
            votes?: number | null | undefined;
            points?: number | null | undefined;
            ratings?: number | null | undefined;
            from_trusted?: boolean | null | undefined;
            foreign_parts_only?: boolean | null | undefined;
            ai_translated?: boolean | null | undefined;
            machine_translated?: boolean | null | undefined;
            upload_date?: string | null | undefined;
            release?: string | null | undefined;
            comments?: string | null | undefined;
            legacy_subtitle_id?: number | null | undefined;
            legacy_uploader_id?: number | null | undefined;
            nb_cd?: number | null | undefined;
            slug?: string | null | undefined;
            uploader?: {
                uploader_id?: number | null | undefined;
                name?: string | null | undefined;
                rank?: string | null | undefined;
            } | null | undefined;
            feature_details?: {
                feature_id?: number | null | undefined;
                feature_type?: string | null | undefined;
                year?: number | null | undefined;
                title?: string | null | undefined;
                movie_name?: string | null | undefined;
                imdb_id?: number | null | undefined;
                tmdb_id?: number | null | undefined;
                season_number?: number | null | undefined;
                episode_number?: number | null | undefined;
                parent_imdb_id?: number | null | undefined;
                parent_title?: string | null | undefined;
                parent_tmdb_id?: number | null | undefined;
                parent_feature_id?: number | null | undefined;
            } | null | undefined;
            url?: string | null | undefined;
            related_links?: any[] | null | undefined;
            files?: {
                file_id: number;
                file_name?: string | null | undefined;
                cd_number?: number | null | undefined;
            }[] | null | undefined;
        };
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    total_pages: number;
    total_count: number;
    per_page: number;
    page: number;
    data: {
        type: string;
        id: string;
        attributes: {
            subtitle_id: string;
            language: string | null;
            download_count: number;
            new_download_count: number;
            hearing_impaired: boolean | null;
            hd: boolean | null;
            votes: number | null;
            points: number;
            ratings: number | null;
            from_trusted: boolean | null;
            foreign_parts_only: boolean | null;
            ai_translated: boolean | null;
            machine_translated: boolean | null;
            upload_date: string;
            release: string;
            comments: string | null;
            uploader: {
                name: string;
                rank: string;
                uploader_id?: number | null | undefined;
            };
            feature_details: Partial<{
                feature_id: number | null;
                feature_type: string;
                year: number | null;
                title: string;
                movie_name: string;
                imdb_id: number | null;
                tmdb_id: number | null;
                season_number: number | null;
                episode_number: number | null;
                parent_imdb_id: number | null;
                parent_title: string | null;
                parent_tmdb_id: number | null;
                parent_feature_id: number | null;
            }>;
            url: string;
            related_links: any[];
            files: {
                file_id: number;
                file_name: string;
                cd_number?: number | null | undefined;
            }[];
            fps?: number | null | undefined;
            legacy_subtitle_id?: number | null | undefined;
            legacy_uploader_id?: number | null | undefined;
            nb_cd?: number | null | undefined;
            slug?: string | null | undefined;
        };
    }[];
}, {
    total_pages: number;
    total_count: number;
    per_page: number;
    page: number;
    data: {
        type: string;
        id: string;
        attributes: {
            subtitle_id: string;
            language: string | null;
            download_count?: number | null | undefined;
            new_download_count?: number | null | undefined;
            hearing_impaired?: boolean | null | undefined;
            hd?: boolean | null | undefined;
            fps?: number | null | undefined;
            votes?: number | null | undefined;
            points?: number | null | undefined;
            ratings?: number | null | undefined;
            from_trusted?: boolean | null | undefined;
            foreign_parts_only?: boolean | null | undefined;
            ai_translated?: boolean | null | undefined;
            machine_translated?: boolean | null | undefined;
            upload_date?: string | null | undefined;
            release?: string | null | undefined;
            comments?: string | null | undefined;
            legacy_subtitle_id?: number | null | undefined;
            legacy_uploader_id?: number | null | undefined;
            nb_cd?: number | null | undefined;
            slug?: string | null | undefined;
            uploader?: {
                uploader_id?: number | null | undefined;
                name?: string | null | undefined;
                rank?: string | null | undefined;
            } | null | undefined;
            feature_details?: {
                feature_id?: number | null | undefined;
                feature_type?: string | null | undefined;
                year?: number | null | undefined;
                title?: string | null | undefined;
                movie_name?: string | null | undefined;
                imdb_id?: number | null | undefined;
                tmdb_id?: number | null | undefined;
                season_number?: number | null | undefined;
                episode_number?: number | null | undefined;
                parent_imdb_id?: number | null | undefined;
                parent_title?: string | null | undefined;
                parent_tmdb_id?: number | null | undefined;
                parent_feature_id?: number | null | undefined;
            } | null | undefined;
            url?: string | null | undefined;
            related_links?: any[] | null | undefined;
            files?: {
                file_id: number;
                file_name?: string | null | undefined;
                cd_number?: number | null | undefined;
            }[] | null | undefined;
        };
    }[];
}>;
/**
 * Validate a search response record by record. A record that does not match the
 * schema is skipped (and counted in the log) instead of failing the whole search.
 */
export declare function parseSearchResponse(raw: unknown): SearchResponse;
export declare const DownloadResponseSchema: z.ZodObject<{
    link: z.ZodString;
    file_name: z.ZodString;
    requests: z.ZodNumber;
    remaining: z.ZodNumber;
    message: z.ZodString;
    reset_time: z.ZodString;
    reset_time_utc: z.ZodString;
}, "strip", z.ZodTypeAny, {
    link: string;
    file_name: string;
    message: string;
    requests: number;
    remaining: number;
    reset_time: string;
    reset_time_utc: string;
}, {
    link: string;
    file_name: string;
    message: string;
    requests: number;
    remaining: number;
    reset_time: string;
    reset_time_utc: string;
}>;
export type SearchResponse = z.infer<typeof SearchResponseSchema>;
export type DownloadResponse = z.infer<typeof DownloadResponseSchema>;
export type Subtitle = z.infer<typeof SubtitleSchema>;
export interface SearchParams {
    query?: string;
    imdb_id?: number;
    tmdb_id?: number;
    parent_imdb_id?: number;
    parent_tmdb_id?: number;
    season_number?: number;
    episode_number?: number;
    year?: number;
    moviehash?: string;
    moviebytesize?: number;
    languages?: string;
    machine_translated?: string;
    ai_translated?: string;
    hearing_impaired?: string;
    foreign_parts_only?: string;
    trusted_sources?: string;
    order_by?: string;
    order_direction?: string;
}
export interface DownloadParams {
    file_id: number;
    sub_format?: string;
    file_name?: string;
    in_fps?: number;
    out_fps?: number;
    timeshift?: number;
    force_download?: boolean;
}
export interface LoginParams {
    username: string;
    password: string;
}
export interface LoginResponse {
    user: {
        allowed_translations: number;
        allowed_downloads: number;
        level: string;
        user_id: number;
        ext_installed: boolean;
        vip: boolean;
    };
    base_url: string;
    token: string;
    status: number;
}
export declare class OpenSubtitlesKongClient {
    private client;
    private baseURL;
    private defaultApiKey;
    constructor(baseURL?: string);
    searchSubtitles(params: SearchParams, userApiKeyOrToken?: string, isToken?: boolean): Promise<SearchResponse>;
    downloadSubtitle(params: DownloadParams, userApiKeyOrToken?: string, isToken?: boolean): Promise<DownloadResponse>;
    downloadSubtitleContent(downloadUrl: string): Promise<string>;
    login(params: LoginParams): Promise<LoginResponse>;
    healthCheck(): Promise<boolean>;
}
//# sourceMappingURL=api-client.d.ts.map