import { z } from "zod";
export declare const SubtitleFileSchema: z.ZodObject<{
    file_id: z.ZodNumber;
    file_name: z.ZodString;
    cd_number: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    file_id: number;
    file_name: string;
    cd_number?: number | undefined;
}, {
    file_id: number;
    file_name: string;
    cd_number?: number | undefined;
}>;
export declare const SubtitleAttributesSchema: z.ZodObject<{
    subtitle_id: z.ZodString;
    language: z.ZodNullable<z.ZodString>;
    download_count: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    new_download_count: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    hearing_impaired: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
    hd: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
    fps: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    votes: z.ZodDefault<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
    points: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    ratings: z.ZodDefault<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
    from_trusted: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
    foreign_parts_only: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
    ai_translated: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
    machine_translated: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
    upload_date: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    release: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    comments: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    legacy_subtitle_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    legacy_uploader_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    nb_cd: z.ZodOptional<z.ZodNumber>;
    slug: z.ZodOptional<z.ZodString>;
    uploader: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        uploader_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        name: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        rank: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        rank: string;
        uploader_id?: number | null | undefined;
    }, {
        uploader_id?: number | null | undefined;
        name?: string | undefined;
        rank?: string | undefined;
    }>>>;
    feature_details: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        feature_id: z.ZodOptional<z.ZodNumber>;
        feature_type: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        year: z.ZodOptional<z.ZodNumber>;
        title: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        movie_name: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        imdb_id: z.ZodOptional<z.ZodNumber>;
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
        feature_id?: number | undefined;
        year?: number | undefined;
        imdb_id?: number | undefined;
        tmdb_id?: number | null | undefined;
        season_number?: number | null | undefined;
        episode_number?: number | null | undefined;
        parent_imdb_id?: number | null | undefined;
        parent_title?: string | null | undefined;
        parent_tmdb_id?: number | null | undefined;
        parent_feature_id?: number | null | undefined;
    }, {
        feature_id?: number | undefined;
        feature_type?: string | undefined;
        year?: number | undefined;
        title?: string | undefined;
        movie_name?: string | undefined;
        imdb_id?: number | undefined;
        tmdb_id?: number | null | undefined;
        season_number?: number | null | undefined;
        episode_number?: number | null | undefined;
        parent_imdb_id?: number | null | undefined;
        parent_title?: string | null | undefined;
        parent_tmdb_id?: number | null | undefined;
        parent_feature_id?: number | null | undefined;
    }>>>;
    url: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    related_links: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodAny, "many">>>;
    files: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        file_id: z.ZodNumber;
        file_name: z.ZodString;
        cd_number: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        file_id: number;
        file_name: string;
        cd_number?: number | undefined;
    }, {
        file_id: number;
        file_name: string;
        cd_number?: number | undefined;
    }>, "many">>>;
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
    feature_details: {
        feature_type: string;
        title: string;
        movie_name: string;
        feature_id?: number | undefined;
        year?: number | undefined;
        imdb_id?: number | undefined;
        tmdb_id?: number | null | undefined;
        season_number?: number | null | undefined;
        episode_number?: number | null | undefined;
        parent_imdb_id?: number | null | undefined;
        parent_title?: string | null | undefined;
        parent_tmdb_id?: number | null | undefined;
        parent_feature_id?: number | null | undefined;
    };
    url: string;
    related_links: any[];
    files: {
        file_id: number;
        file_name: string;
        cd_number?: number | undefined;
    }[];
    fps?: number | null | undefined;
    legacy_subtitle_id?: number | null | undefined;
    legacy_uploader_id?: number | null | undefined;
    nb_cd?: number | undefined;
    slug?: string | undefined;
}, {
    subtitle_id: string;
    language: string | null;
    download_count?: number | undefined;
    new_download_count?: number | undefined;
    hearing_impaired?: boolean | null | undefined;
    hd?: boolean | null | undefined;
    fps?: number | null | undefined;
    votes?: number | null | undefined;
    points?: number | undefined;
    ratings?: number | null | undefined;
    from_trusted?: boolean | null | undefined;
    foreign_parts_only?: boolean | null | undefined;
    ai_translated?: boolean | null | undefined;
    machine_translated?: boolean | null | undefined;
    upload_date?: string | undefined;
    release?: string | undefined;
    comments?: string | null | undefined;
    legacy_subtitle_id?: number | null | undefined;
    legacy_uploader_id?: number | null | undefined;
    nb_cd?: number | undefined;
    slug?: string | undefined;
    uploader?: {
        uploader_id?: number | null | undefined;
        name?: string | undefined;
        rank?: string | undefined;
    } | undefined;
    feature_details?: {
        feature_id?: number | undefined;
        feature_type?: string | undefined;
        year?: number | undefined;
        title?: string | undefined;
        movie_name?: string | undefined;
        imdb_id?: number | undefined;
        tmdb_id?: number | null | undefined;
        season_number?: number | null | undefined;
        episode_number?: number | null | undefined;
        parent_imdb_id?: number | null | undefined;
        parent_title?: string | null | undefined;
        parent_tmdb_id?: number | null | undefined;
        parent_feature_id?: number | null | undefined;
    } | undefined;
    url?: string | undefined;
    related_links?: any[] | undefined;
    files?: {
        file_id: number;
        file_name: string;
        cd_number?: number | undefined;
    }[] | undefined;
}>;
export declare const SubtitleSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodString;
    attributes: z.ZodObject<{
        subtitle_id: z.ZodString;
        language: z.ZodNullable<z.ZodString>;
        download_count: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        new_download_count: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        hearing_impaired: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
        hd: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
        fps: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        votes: z.ZodDefault<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
        points: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        ratings: z.ZodDefault<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
        from_trusted: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
        foreign_parts_only: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
        ai_translated: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
        machine_translated: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
        upload_date: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        release: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        comments: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
        legacy_subtitle_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        legacy_uploader_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        nb_cd: z.ZodOptional<z.ZodNumber>;
        slug: z.ZodOptional<z.ZodString>;
        uploader: z.ZodDefault<z.ZodOptional<z.ZodObject<{
            uploader_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            name: z.ZodDefault<z.ZodOptional<z.ZodString>>;
            rank: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            rank: string;
            uploader_id?: number | null | undefined;
        }, {
            uploader_id?: number | null | undefined;
            name?: string | undefined;
            rank?: string | undefined;
        }>>>;
        feature_details: z.ZodDefault<z.ZodOptional<z.ZodObject<{
            feature_id: z.ZodOptional<z.ZodNumber>;
            feature_type: z.ZodDefault<z.ZodOptional<z.ZodString>>;
            year: z.ZodOptional<z.ZodNumber>;
            title: z.ZodDefault<z.ZodOptional<z.ZodString>>;
            movie_name: z.ZodDefault<z.ZodOptional<z.ZodString>>;
            imdb_id: z.ZodOptional<z.ZodNumber>;
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
            feature_id?: number | undefined;
            year?: number | undefined;
            imdb_id?: number | undefined;
            tmdb_id?: number | null | undefined;
            season_number?: number | null | undefined;
            episode_number?: number | null | undefined;
            parent_imdb_id?: number | null | undefined;
            parent_title?: string | null | undefined;
            parent_tmdb_id?: number | null | undefined;
            parent_feature_id?: number | null | undefined;
        }, {
            feature_id?: number | undefined;
            feature_type?: string | undefined;
            year?: number | undefined;
            title?: string | undefined;
            movie_name?: string | undefined;
            imdb_id?: number | undefined;
            tmdb_id?: number | null | undefined;
            season_number?: number | null | undefined;
            episode_number?: number | null | undefined;
            parent_imdb_id?: number | null | undefined;
            parent_title?: string | null | undefined;
            parent_tmdb_id?: number | null | undefined;
            parent_feature_id?: number | null | undefined;
        }>>>;
        url: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        related_links: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodAny, "many">>>;
        files: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
            file_id: z.ZodNumber;
            file_name: z.ZodString;
            cd_number: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            file_id: number;
            file_name: string;
            cd_number?: number | undefined;
        }, {
            file_id: number;
            file_name: string;
            cd_number?: number | undefined;
        }>, "many">>>;
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
        feature_details: {
            feature_type: string;
            title: string;
            movie_name: string;
            feature_id?: number | undefined;
            year?: number | undefined;
            imdb_id?: number | undefined;
            tmdb_id?: number | null | undefined;
            season_number?: number | null | undefined;
            episode_number?: number | null | undefined;
            parent_imdb_id?: number | null | undefined;
            parent_title?: string | null | undefined;
            parent_tmdb_id?: number | null | undefined;
            parent_feature_id?: number | null | undefined;
        };
        url: string;
        related_links: any[];
        files: {
            file_id: number;
            file_name: string;
            cd_number?: number | undefined;
        }[];
        fps?: number | null | undefined;
        legacy_subtitle_id?: number | null | undefined;
        legacy_uploader_id?: number | null | undefined;
        nb_cd?: number | undefined;
        slug?: string | undefined;
    }, {
        subtitle_id: string;
        language: string | null;
        download_count?: number | undefined;
        new_download_count?: number | undefined;
        hearing_impaired?: boolean | null | undefined;
        hd?: boolean | null | undefined;
        fps?: number | null | undefined;
        votes?: number | null | undefined;
        points?: number | undefined;
        ratings?: number | null | undefined;
        from_trusted?: boolean | null | undefined;
        foreign_parts_only?: boolean | null | undefined;
        ai_translated?: boolean | null | undefined;
        machine_translated?: boolean | null | undefined;
        upload_date?: string | undefined;
        release?: string | undefined;
        comments?: string | null | undefined;
        legacy_subtitle_id?: number | null | undefined;
        legacy_uploader_id?: number | null | undefined;
        nb_cd?: number | undefined;
        slug?: string | undefined;
        uploader?: {
            uploader_id?: number | null | undefined;
            name?: string | undefined;
            rank?: string | undefined;
        } | undefined;
        feature_details?: {
            feature_id?: number | undefined;
            feature_type?: string | undefined;
            year?: number | undefined;
            title?: string | undefined;
            movie_name?: string | undefined;
            imdb_id?: number | undefined;
            tmdb_id?: number | null | undefined;
            season_number?: number | null | undefined;
            episode_number?: number | null | undefined;
            parent_imdb_id?: number | null | undefined;
            parent_title?: string | null | undefined;
            parent_tmdb_id?: number | null | undefined;
            parent_feature_id?: number | null | undefined;
        } | undefined;
        url?: string | undefined;
        related_links?: any[] | undefined;
        files?: {
            file_id: number;
            file_name: string;
            cd_number?: number | undefined;
        }[] | undefined;
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
        feature_details: {
            feature_type: string;
            title: string;
            movie_name: string;
            feature_id?: number | undefined;
            year?: number | undefined;
            imdb_id?: number | undefined;
            tmdb_id?: number | null | undefined;
            season_number?: number | null | undefined;
            episode_number?: number | null | undefined;
            parent_imdb_id?: number | null | undefined;
            parent_title?: string | null | undefined;
            parent_tmdb_id?: number | null | undefined;
            parent_feature_id?: number | null | undefined;
        };
        url: string;
        related_links: any[];
        files: {
            file_id: number;
            file_name: string;
            cd_number?: number | undefined;
        }[];
        fps?: number | null | undefined;
        legacy_subtitle_id?: number | null | undefined;
        legacy_uploader_id?: number | null | undefined;
        nb_cd?: number | undefined;
        slug?: string | undefined;
    };
}, {
    type: string;
    id: string;
    attributes: {
        subtitle_id: string;
        language: string | null;
        download_count?: number | undefined;
        new_download_count?: number | undefined;
        hearing_impaired?: boolean | null | undefined;
        hd?: boolean | null | undefined;
        fps?: number | null | undefined;
        votes?: number | null | undefined;
        points?: number | undefined;
        ratings?: number | null | undefined;
        from_trusted?: boolean | null | undefined;
        foreign_parts_only?: boolean | null | undefined;
        ai_translated?: boolean | null | undefined;
        machine_translated?: boolean | null | undefined;
        upload_date?: string | undefined;
        release?: string | undefined;
        comments?: string | null | undefined;
        legacy_subtitle_id?: number | null | undefined;
        legacy_uploader_id?: number | null | undefined;
        nb_cd?: number | undefined;
        slug?: string | undefined;
        uploader?: {
            uploader_id?: number | null | undefined;
            name?: string | undefined;
            rank?: string | undefined;
        } | undefined;
        feature_details?: {
            feature_id?: number | undefined;
            feature_type?: string | undefined;
            year?: number | undefined;
            title?: string | undefined;
            movie_name?: string | undefined;
            imdb_id?: number | undefined;
            tmdb_id?: number | null | undefined;
            season_number?: number | null | undefined;
            episode_number?: number | null | undefined;
            parent_imdb_id?: number | null | undefined;
            parent_title?: string | null | undefined;
            parent_tmdb_id?: number | null | undefined;
            parent_feature_id?: number | null | undefined;
        } | undefined;
        url?: string | undefined;
        related_links?: any[] | undefined;
        files?: {
            file_id: number;
            file_name: string;
            cd_number?: number | undefined;
        }[] | undefined;
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
            download_count: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            new_download_count: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            hearing_impaired: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
            hd: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
            fps: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            votes: z.ZodDefault<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
            points: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            ratings: z.ZodDefault<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
            from_trusted: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
            foreign_parts_only: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
            ai_translated: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
            machine_translated: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>;
            upload_date: z.ZodDefault<z.ZodOptional<z.ZodString>>;
            release: z.ZodDefault<z.ZodOptional<z.ZodString>>;
            comments: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
            legacy_subtitle_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            legacy_uploader_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            nb_cd: z.ZodOptional<z.ZodNumber>;
            slug: z.ZodOptional<z.ZodString>;
            uploader: z.ZodDefault<z.ZodOptional<z.ZodObject<{
                uploader_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                name: z.ZodDefault<z.ZodOptional<z.ZodString>>;
                rank: z.ZodDefault<z.ZodOptional<z.ZodString>>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                rank: string;
                uploader_id?: number | null | undefined;
            }, {
                uploader_id?: number | null | undefined;
                name?: string | undefined;
                rank?: string | undefined;
            }>>>;
            feature_details: z.ZodDefault<z.ZodOptional<z.ZodObject<{
                feature_id: z.ZodOptional<z.ZodNumber>;
                feature_type: z.ZodDefault<z.ZodOptional<z.ZodString>>;
                year: z.ZodOptional<z.ZodNumber>;
                title: z.ZodDefault<z.ZodOptional<z.ZodString>>;
                movie_name: z.ZodDefault<z.ZodOptional<z.ZodString>>;
                imdb_id: z.ZodOptional<z.ZodNumber>;
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
                feature_id?: number | undefined;
                year?: number | undefined;
                imdb_id?: number | undefined;
                tmdb_id?: number | null | undefined;
                season_number?: number | null | undefined;
                episode_number?: number | null | undefined;
                parent_imdb_id?: number | null | undefined;
                parent_title?: string | null | undefined;
                parent_tmdb_id?: number | null | undefined;
                parent_feature_id?: number | null | undefined;
            }, {
                feature_id?: number | undefined;
                feature_type?: string | undefined;
                year?: number | undefined;
                title?: string | undefined;
                movie_name?: string | undefined;
                imdb_id?: number | undefined;
                tmdb_id?: number | null | undefined;
                season_number?: number | null | undefined;
                episode_number?: number | null | undefined;
                parent_imdb_id?: number | null | undefined;
                parent_title?: string | null | undefined;
                parent_tmdb_id?: number | null | undefined;
                parent_feature_id?: number | null | undefined;
            }>>>;
            url: z.ZodDefault<z.ZodOptional<z.ZodString>>;
            related_links: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodAny, "many">>>;
            files: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
                file_id: z.ZodNumber;
                file_name: z.ZodString;
                cd_number: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                file_id: number;
                file_name: string;
                cd_number?: number | undefined;
            }, {
                file_id: number;
                file_name: string;
                cd_number?: number | undefined;
            }>, "many">>>;
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
            feature_details: {
                feature_type: string;
                title: string;
                movie_name: string;
                feature_id?: number | undefined;
                year?: number | undefined;
                imdb_id?: number | undefined;
                tmdb_id?: number | null | undefined;
                season_number?: number | null | undefined;
                episode_number?: number | null | undefined;
                parent_imdb_id?: number | null | undefined;
                parent_title?: string | null | undefined;
                parent_tmdb_id?: number | null | undefined;
                parent_feature_id?: number | null | undefined;
            };
            url: string;
            related_links: any[];
            files: {
                file_id: number;
                file_name: string;
                cd_number?: number | undefined;
            }[];
            fps?: number | null | undefined;
            legacy_subtitle_id?: number | null | undefined;
            legacy_uploader_id?: number | null | undefined;
            nb_cd?: number | undefined;
            slug?: string | undefined;
        }, {
            subtitle_id: string;
            language: string | null;
            download_count?: number | undefined;
            new_download_count?: number | undefined;
            hearing_impaired?: boolean | null | undefined;
            hd?: boolean | null | undefined;
            fps?: number | null | undefined;
            votes?: number | null | undefined;
            points?: number | undefined;
            ratings?: number | null | undefined;
            from_trusted?: boolean | null | undefined;
            foreign_parts_only?: boolean | null | undefined;
            ai_translated?: boolean | null | undefined;
            machine_translated?: boolean | null | undefined;
            upload_date?: string | undefined;
            release?: string | undefined;
            comments?: string | null | undefined;
            legacy_subtitle_id?: number | null | undefined;
            legacy_uploader_id?: number | null | undefined;
            nb_cd?: number | undefined;
            slug?: string | undefined;
            uploader?: {
                uploader_id?: number | null | undefined;
                name?: string | undefined;
                rank?: string | undefined;
            } | undefined;
            feature_details?: {
                feature_id?: number | undefined;
                feature_type?: string | undefined;
                year?: number | undefined;
                title?: string | undefined;
                movie_name?: string | undefined;
                imdb_id?: number | undefined;
                tmdb_id?: number | null | undefined;
                season_number?: number | null | undefined;
                episode_number?: number | null | undefined;
                parent_imdb_id?: number | null | undefined;
                parent_title?: string | null | undefined;
                parent_tmdb_id?: number | null | undefined;
                parent_feature_id?: number | null | undefined;
            } | undefined;
            url?: string | undefined;
            related_links?: any[] | undefined;
            files?: {
                file_id: number;
                file_name: string;
                cd_number?: number | undefined;
            }[] | undefined;
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
            feature_details: {
                feature_type: string;
                title: string;
                movie_name: string;
                feature_id?: number | undefined;
                year?: number | undefined;
                imdb_id?: number | undefined;
                tmdb_id?: number | null | undefined;
                season_number?: number | null | undefined;
                episode_number?: number | null | undefined;
                parent_imdb_id?: number | null | undefined;
                parent_title?: string | null | undefined;
                parent_tmdb_id?: number | null | undefined;
                parent_feature_id?: number | null | undefined;
            };
            url: string;
            related_links: any[];
            files: {
                file_id: number;
                file_name: string;
                cd_number?: number | undefined;
            }[];
            fps?: number | null | undefined;
            legacy_subtitle_id?: number | null | undefined;
            legacy_uploader_id?: number | null | undefined;
            nb_cd?: number | undefined;
            slug?: string | undefined;
        };
    }, {
        type: string;
        id: string;
        attributes: {
            subtitle_id: string;
            language: string | null;
            download_count?: number | undefined;
            new_download_count?: number | undefined;
            hearing_impaired?: boolean | null | undefined;
            hd?: boolean | null | undefined;
            fps?: number | null | undefined;
            votes?: number | null | undefined;
            points?: number | undefined;
            ratings?: number | null | undefined;
            from_trusted?: boolean | null | undefined;
            foreign_parts_only?: boolean | null | undefined;
            ai_translated?: boolean | null | undefined;
            machine_translated?: boolean | null | undefined;
            upload_date?: string | undefined;
            release?: string | undefined;
            comments?: string | null | undefined;
            legacy_subtitle_id?: number | null | undefined;
            legacy_uploader_id?: number | null | undefined;
            nb_cd?: number | undefined;
            slug?: string | undefined;
            uploader?: {
                uploader_id?: number | null | undefined;
                name?: string | undefined;
                rank?: string | undefined;
            } | undefined;
            feature_details?: {
                feature_id?: number | undefined;
                feature_type?: string | undefined;
                year?: number | undefined;
                title?: string | undefined;
                movie_name?: string | undefined;
                imdb_id?: number | undefined;
                tmdb_id?: number | null | undefined;
                season_number?: number | null | undefined;
                episode_number?: number | null | undefined;
                parent_imdb_id?: number | null | undefined;
                parent_title?: string | null | undefined;
                parent_tmdb_id?: number | null | undefined;
                parent_feature_id?: number | null | undefined;
            } | undefined;
            url?: string | undefined;
            related_links?: any[] | undefined;
            files?: {
                file_id: number;
                file_name: string;
                cd_number?: number | undefined;
            }[] | undefined;
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
            feature_details: {
                feature_type: string;
                title: string;
                movie_name: string;
                feature_id?: number | undefined;
                year?: number | undefined;
                imdb_id?: number | undefined;
                tmdb_id?: number | null | undefined;
                season_number?: number | null | undefined;
                episode_number?: number | null | undefined;
                parent_imdb_id?: number | null | undefined;
                parent_title?: string | null | undefined;
                parent_tmdb_id?: number | null | undefined;
                parent_feature_id?: number | null | undefined;
            };
            url: string;
            related_links: any[];
            files: {
                file_id: number;
                file_name: string;
                cd_number?: number | undefined;
            }[];
            fps?: number | null | undefined;
            legacy_subtitle_id?: number | null | undefined;
            legacy_uploader_id?: number | null | undefined;
            nb_cd?: number | undefined;
            slug?: string | undefined;
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
            download_count?: number | undefined;
            new_download_count?: number | undefined;
            hearing_impaired?: boolean | null | undefined;
            hd?: boolean | null | undefined;
            fps?: number | null | undefined;
            votes?: number | null | undefined;
            points?: number | undefined;
            ratings?: number | null | undefined;
            from_trusted?: boolean | null | undefined;
            foreign_parts_only?: boolean | null | undefined;
            ai_translated?: boolean | null | undefined;
            machine_translated?: boolean | null | undefined;
            upload_date?: string | undefined;
            release?: string | undefined;
            comments?: string | null | undefined;
            legacy_subtitle_id?: number | null | undefined;
            legacy_uploader_id?: number | null | undefined;
            nb_cd?: number | undefined;
            slug?: string | undefined;
            uploader?: {
                uploader_id?: number | null | undefined;
                name?: string | undefined;
                rank?: string | undefined;
            } | undefined;
            feature_details?: {
                feature_id?: number | undefined;
                feature_type?: string | undefined;
                year?: number | undefined;
                title?: string | undefined;
                movie_name?: string | undefined;
                imdb_id?: number | undefined;
                tmdb_id?: number | null | undefined;
                season_number?: number | null | undefined;
                episode_number?: number | null | undefined;
                parent_imdb_id?: number | null | undefined;
                parent_title?: string | null | undefined;
                parent_tmdb_id?: number | null | undefined;
                parent_feature_id?: number | null | undefined;
            } | undefined;
            url?: string | undefined;
            related_links?: any[] | undefined;
            files?: {
                file_id: number;
                file_name: string;
                cd_number?: number | undefined;
            }[] | undefined;
        };
    }[];
}>;
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