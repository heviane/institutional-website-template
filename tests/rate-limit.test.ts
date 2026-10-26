import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  hashIp,
  getClientIp,
  checkRateLimit,
  resetMemoryRateLimit,
  RATE_LIMIT_LUA_SCRIPT,
  MAX_REQUESTS_PER_WINDOW,
  RATE_LIMIT_WINDOW_SECONDS,
} from "@/lib/rate-limit";

describe("Rate Limiting & IP Pseudonymization (src/lib/rate-limit.ts)", () => {
  const secret = "test-secret-at-least-16-characters-long";

  beforeEach(() => {
    resetMemoryRateLimit();
    vi.stubEnv("NODE_ENV", "test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  describe("HMAC IP Pseudonymization (hashIp)", () => {
    it("generates a deterministic 64-character SHA-256 hex string", () => {
      const hash1 = hashIp("192.168.1.1", secret);
      const hash2 = hashIp("192.168.1.1", secret);

      expect(hash1).toHaveLength(64);
      expect(hash1).toBe(hash2);
      expect(hash1).not.toContain("192.168.1.1");
    });

    it("produces distinct hashes for different IPs and secrets", () => {
      const hashA = hashIp("192.168.1.1", secret);
      const hashB = hashIp("192.168.1.2", secret);
      const hashC = hashIp("192.168.1.1", "different-secret-16-chars-long");

      expect(hashA).not.toBe(hashB);
      expect(hashA).not.toBe(hashC);
    });
  });

  describe("Client IP Extraction (getClientIp)", () => {
    it("prioritizes cf-connecting-ip over x-real-ip and x-forwarded-for", () => {
      const headers = new Headers({
        "cf-connecting-ip": "203.0.113.195",
        "x-real-ip": "198.51.100.1",
        "x-forwarded-for": "192.0.2.1, 198.51.100.1",
      });

      expect(getClientIp(headers)).toBe("203.0.113.195");
    });

    it("falls back to x-real-ip when cf-connecting-ip is absent", () => {
      const headers = new Headers({
        "x-real-ip": "198.51.100.1",
        "x-forwarded-for": "192.0.2.1",
      });

      expect(getClientIp(headers)).toBe("198.51.100.1");
    });

    it("extracts the first valid IP from x-forwarded-for when other edge headers are absent", () => {
      const headers = new Headers({
        "x-forwarded-for": " 192.0.2.1 , 198.51.100.1 ",
      });

      expect(getClientIp(headers)).toBe("192.0.2.1");
    });

    it("returns '127.0.0.1' fallback in development or test when no IP header exists", () => {
      vi.stubEnv("NODE_ENV", "test");
      const headers = new Headers();

      expect(getClientIp(headers)).toBe("127.0.0.1");
    });

    it("returns null in production when no IP header exists (Fail-Closed, prevents shared bucket)", () => {
      vi.stubEnv("NODE_ENV", "production");
      const headers = new Headers();

      expect(getClientIp(headers)).toBeNull();
    });
  });

  describe("In-Memory Rate Limiting (Modo Lite / Dev / Best-Effort)", () => {
    it("allows up to 5 requests in a 1-hour window and blocks the 6th", async () => {
      const ip = "192.168.10.50";

      for (let i = 1; i <= MAX_REQUESTS_PER_WINDOW; i++) {
        const res = await checkRateLimit(ip);
        expect(res.isAllowed).toBe(true);
        expect(res.remaining).toBe(MAX_REQUESTS_PER_WINDOW - i);
      }

      // 6th attempt must be rejected
      const blockedRes = await checkRateLimit(ip);
      expect(blockedRes.isAllowed).toBe(false);
      expect(blockedRes.remaining).toBe(0);
    });

    it("tracks separate limits for distinct IP addresses", async () => {
      const ipA = "10.0.0.1";
      const ipB = "10.0.0.2";

      for (let i = 0; i < MAX_REQUESTS_PER_WINDOW; i++) {
        await checkRateLimit(ipA);
      }

      const blockedA = await checkRateLimit(ipA);
      expect(blockedA.isAllowed).toBe(false);

      const allowedB = await checkRateLimit(ipB);
      expect(allowedB.isAllowed).toBe(true);
    });

    it("resets counter after the 1-hour window expires", async () => {
      const ip = "10.0.0.3";

      for (let i = 0; i < MAX_REQUESTS_PER_WINDOW; i++) {
        await checkRateLimit(ip);
      }
      expect((await checkRateLimit(ip)).isAllowed).toBe(false);

      // Fast-forward time past 3600 seconds
      const futureTime = Date.now() + (RATE_LIMIT_WINDOW_SECONDS + 1) * 1000;
      vi.spyOn(Date, "now").mockReturnValue(futureTime);

      const freshRes = await checkRateLimit(ip);
      expect(freshRes.isAllowed).toBe(true);
      expect(freshRes.remaining).toBe(MAX_REQUESTS_PER_WINDOW - 1);
    });
  });

  describe("Redis Atomic Lua Script Definition", () => {
    it("contains an atomic Lua script executing INCR and conditional EXPIRE", () => {
      expect(RATE_LIMIT_LUA_SCRIPT).toContain("redis.call('INCR', KEYS[1])");
      expect(RATE_LIMIT_LUA_SCRIPT).toContain("redis.call('EXPIRE', KEYS[1], ARGV[1])");
    });
  });
});

