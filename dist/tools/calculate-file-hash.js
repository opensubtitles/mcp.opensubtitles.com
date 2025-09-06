import { z } from "zod";
import { calculateOpenSubtitlesHash } from "../utils/hash-calculator.js";
import { access, constants } from "fs/promises";
import { resolve } from "path";
const HashArgsSchema = z.object({
    file_path: z.string(),
});
export async function calculateFileHash(args) {
    try {
        // Validate input arguments
        const validatedArgs = HashArgsSchema.parse(args);
        // Resolve and validate file path
        const resolvedPath = resolve(validatedArgs.file_path);
        // Check if file exists and is readable
        try {
            await access(resolvedPath, constants.R_OK);
        }
        catch (error) {
            throw new Error(`File not found or not readable: ${validatedArgs.file_path}`);
        }
        // Calculate the OpenSubtitles hash
        const hashResult = await calculateOpenSubtitlesHash(resolvedPath);
        // Format response
        const response = {
            file_path: validatedArgs.file_path,
            resolved_path: resolvedPath,
            hash: hashResult.hash,
            size: hashResult.size,
            size_mb: Math.round(hashResult.size / 1024 / 1024 * 100) / 100,
            usage_note: "Use this hash with the 'moviehash' parameter in search_subtitles for exact file matching"
        };
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(response, null, 2),
                },
            ],
        };
    }
    catch (error) {
        console.error("Calculate file hash error:", error);
        let errorMessage = "Failed to calculate file hash";
        if (error instanceof z.ZodError) {
            errorMessage = `Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`;
        }
        else if (error instanceof Error) {
            errorMessage = error.message;
        }
        // Provide helpful error messages
        if (errorMessage.includes("not found")) {
            errorMessage += "\n\nMake sure the file path is correct and the file exists.";
        }
        else if (errorMessage.includes("too small")) {
            errorMessage += "\n\nThe file must be at least 128KB for hash calculation.";
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
//# sourceMappingURL=calculate-file-hash.js.map