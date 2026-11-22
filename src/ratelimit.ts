/**
 * Per-client token bucket (in-process). Each replica limits on its own, so the
 * effective limit behind N replicas is up to N times higher; the REST API's own
 * per-key limits still apply behind it.
 */
export class RateLimiter {
  private readonly buckets = new Map<string, { tokens: number; at: number }>();
  private readonly perMs: number;

  constructor(
    private readonly perMinute: number,
    private readonly burst = Math.max(10, Math.ceil(perMinute / 4)),
    private readonly maxClients = 50_000,
  ) {
    this.perMs = perMinute / 60_000;
  }

  take(key: string, now = Date.now()): { ok: true } | { ok: false; retryAfter: number } {
    let b = this.buckets.get(key);
    if (!b) {
      if (this.buckets.size >= this.maxClients) this.sweep(now);
      b = { tokens: this.burst, at: now };
      this.buckets.set(key, b);
    }
    b.tokens = Math.min(this.burst, b.tokens + (now - b.at) * this.perMs);
    b.at = now;
    if (b.tokens >= 1) {
      b.tokens -= 1;
      return { ok: true };
    }
    return { ok: false, retryAfter: Math.max(1, Math.ceil((1 - b.tokens) / this.perMs / 1000)) };
  }

  private sweep(now: number): void {
    for (const [k, b] of this.buckets) {
      if (now - b.at > 10 * 60_000) this.buckets.delete(k);
    }
    if (this.buckets.size >= this.maxClients) this.buckets.clear();
  }
}
