import { createHmac } from "node:crypto";
import { Redis } from "@upstash/redis";
import { serverEnv } from "@/env/server";

export const MAX_REQUESTS_PER_WINDOW = 5;
export const RATE_LIMIT_WINDOW_SECONDS = 3600; // 1 hour

export const RATE_LIMIT_LUA_SCRIPT = `
local current = redis.call('INCR', KEYS[1])
if current == 1 then
    redis.call('EXPIRE', KEYS[1], ARGV[1])
end
return current
`;

export interface RateLimitResult {
  isAllowed: boolean;
  remaining: number;
  resetAt: number;
}

interface MemoryStoreItem {
  count: number;
  expiresAt: number;
}

const memoryStore = new Map<string, MemoryStoreItem>();

/**
 * Resets the in-memory rate limit store (primarily for tests).
 */
export function resetMemoryRateLimit(): void {
  memoryStore.clear();
}

/**
 * Pseudonymizes the visitor IP address using HMAC-SHA256 according to LGPD Art. 13, § 4.
 * Raw IP addresses are never logged or stored.
 */
export function hashIp(ip: string, secret: string): string {
  return createHmac("sha256", secret).update(ip).digest("hex");
}

/**
 * Extracts client IP from edge headers in order of trust.
 * In production, returns null if no trusted headers exist to prevent shared-bucket denial of service.
 */
export function getClientIp(headers: Headers | { get(name: string): string | null }): string | null {
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  if (process.env.NODE_ENV !== "production") {
    return "127.0.0.1";
  }

  return null;
}

let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  if (serverEnv.UPSTASH_REDIS_REST_URL && serverEnv.UPSTASH_REDIS_REST_TOKEN) {
    if (!redisClient) {
      redisClient = new Redis({
        url: serverEnv.UPSTASH_REDIS_REST_URL,
        token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
      });
    }
    return redisClient;
  }
  return null;
}

/**
 * Checks rate limiting for a given IP.
 * - Modo Robusto: Executes atomic Lua script in Upstash Redis via single HTTP request.
 * - Modo Lite: Ephemeral in-memory Map (best-effort).
 */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const now = Date.now();
  const resetAt = now + RATE_LIMIT_WINDOW_SECONDS * 1000;
  const anonymizedIp = hashIp(ip, serverEnv.RATE_LIMIT_SECRET);
  const cacheKey = `rate-limit:contact:${anonymizedIp}`;

  const redis = getRedisClient();

  if (redis) {
    try {
      const rawCount = await redis.eval(
        RATE_LIMIT_LUA_SCRIPT,
        [cacheKey],
        [RATE_LIMIT_WINDOW_SECONDS]
      );
      const count = Number(rawCount);

      const isAllowed = count <= MAX_REQUESTS_PER_WINDOW;
      return {
        isAllowed,
        remaining: isAllowed ? Math.max(0, MAX_REQUESTS_PER_WINDOW - count) : 0,
        resetAt,
      };
    } catch (error) {
      // Fail-Closed policy in production: rethrow to block email dispatch and trigger fallback message
      if (process.env.NODE_ENV === "production") {
        throw error;
      }
      // In development / test, log warning and gracefully fall through to in-memory store
      console.warn("[RateLimit] Upstash Redis error, falling back to memoryStore:", error);
    }
  }

  // In-Memory store (Modo Lite / Dev)
  const existing = memoryStore.get(cacheKey);

  if (!existing || now > existing.expiresAt) {
    memoryStore.set(cacheKey, { count: 1, expiresAt: resetAt });
    return {
      isAllowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      resetAt,
    };
  }

  existing.count += 1;
  const isAllowed = existing.count <= MAX_REQUESTS_PER_WINDOW;

  return {
    isAllowed,
    remaining: isAllowed ? Math.max(0, MAX_REQUESTS_PER_WINDOW - existing.count) : 0,
    resetAt: existing.expiresAt,
  };
}

