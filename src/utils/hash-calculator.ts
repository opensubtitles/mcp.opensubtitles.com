import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { createHash } from "crypto";

export interface HashResult {
  hash: string;
  size: number;
}

/**
 * Calculate OpenSubtitles hash for a movie file
 * The OpenSubtitles hash is based on file size and a hash of the first and last 64KB of the file
 * This is a unique identifier used for exact file matching
 */
export async function calculateOpenSubtitlesHash(filePath: string): Promise<HashResult> {
  try {
    // Get file size
    const stats = await stat(filePath);
    const fileSize = stats.size;
    
    if (fileSize < 131072) { // 128KB minimum
      throw new Error("File too small for OpenSubtitles hash calculation (minimum 128KB)");
    }
    
    const chunkSize = 65536; // 64KB
    
    // Read first 64KB
    const firstChunk = await readChunk(filePath, 0, chunkSize);
    
    // Read last 64KB
    const lastChunk = await readChunk(filePath, fileSize - chunkSize, chunkSize);
    
    // Calculate hash using file size as initial value
    let hash = BigInt(fileSize);
    
    // Add values from first chunk
    for (let i = 0; i < firstChunk.length; i += 8) {
      hash += BigInt(firstChunk.readBigUInt64LE(i));
    }
    
    // Add values from last chunk
    for (let i = 0; i < lastChunk.length; i += 8) {
      hash += BigInt(lastChunk.readBigUInt64LE(i));
    }
    
    // Convert to 16-character hex string
    const hashHex = (hash & BigInt("0xFFFFFFFFFFFFFFFF")).toString(16).padStart(16, '0');
    
    return {
      hash: hashHex,
      size: fileSize,
    };
    
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to calculate hash: ${error.message}`);
    }
    throw new Error("Failed to calculate hash: Unknown error");
  }
}

/**
 * Read a specific chunk of data from a file
 */
function readChunk(filePath: string, start: number, length: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const stream = createReadStream(filePath, { start, end: start + length - 1 });
    
    stream.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });
    
    stream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      // Ensure we have exactly the right amount of data, pad with zeros if needed
      if (buffer.length < length) {
        const paddedBuffer = Buffer.alloc(length);
        buffer.copy(paddedBuffer);
        resolve(paddedBuffer);
      } else {
        resolve(buffer.subarray(0, length));
      }
    });
    
    stream.on('error', (error) => {
      reject(error);
    });
  });
}