export interface HashResult {
    hash: string;
    size: number;
}
/**
 * Calculate OpenSubtitles hash for a movie file
 * The OpenSubtitles hash is based on file size and a hash of the first and last 64KB of the file
 * This is a unique identifier used for exact file matching
 */
export declare function calculateOpenSubtitlesHash(filePath: string): Promise<HashResult>;
//# sourceMappingURL=hash-calculator.d.ts.map