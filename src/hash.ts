import { open } from "node:fs/promises";

/**
 * OpenSubtitles hash: file size plus the sum of the first and last 64 KiB read
 * as little-endian uint64 words, modulo 2^64, as 16 hex digits.
 * Ported unchanged from 1.x (src/utils/hash-calculator.ts), reading with one
 * file handle instead of two streams.
 */
const CHUNK = 65536;
const MASK = (1n << 64n) - 1n;

export interface HashResult {
  moviehash: string;
  moviebytesize: number;
}

export function hashFromChunks(size: number, head: Buffer, tail: Buffer): string {
  let hash = BigInt(size);
  for (const buf of [head, tail]) {
    for (let i = 0; i + 8 <= buf.length; i += 8) hash = (hash + buf.readBigUInt64LE(i)) & MASK;
  }
  return hash.toString(16).padStart(16, "0");
}

export async function calculateOpenSubtitlesHash(path: string): Promise<HashResult> {
  const fh = await open(path, "r");
  try {
    const st = await fh.stat();
    if (!st.isFile()) throw new Error("not a regular file");
    if (st.size < CHUNK * 2) throw new Error("file too small for an OpenSubtitles hash (minimum 128 KiB)");
    const head = Buffer.alloc(CHUNK);
    const tail = Buffer.alloc(CHUNK);
    await fh.read(head, 0, CHUNK, 0);
    await fh.read(tail, 0, CHUNK, st.size - CHUNK);
    return { moviehash: hashFromChunks(st.size, head, tail), moviebytesize: st.size };
  } finally {
    await fh.close();
  }
}
