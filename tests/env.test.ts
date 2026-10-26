import { describe, it, expect } from "vitest";
import { parseClientEnv, clientEnvSchema } from "@/env/client";
import { parseServerEnv, serverEnvSchema, DEFAULT_DEV_RATE_LIMIT_SECRET } from "@/env/server";

describe("Environment Validation Schemas (src/env/)", () => {
  describe("Client Environment Schema (clientEnvSchema & parseClientEnv)", () => {
    it("parses valid development configuration with defaults and undefined NEXT_PUBLIC_SITE_URL", () => {
      const parsed = parseClientEnv({
        NODE_ENV: "development",
      });

      expect(parsed.NEXT_PUBLIC_SITE_URL).toBeUndefined();
      expect(parsed.NEXT_PUBLIC_ENABLE_TURNSTILE).toBe(true);
      expect(parsed.NEXT_PUBLIC_TURNSTILE_SITE_KEY).toBeUndefined();
    });

    it("parses valid NEXT_PUBLIC_SITE_URL when provided", () => {
      const parsed = parseClientEnv({
        NODE_ENV: "development",
        NEXT_PUBLIC_SITE_URL: "https://example.com",
      });

      expect(parsed.NEXT_PUBLIC_SITE_URL).toBe("https://example.com");
    });

    it("parses NEXT_PUBLIC_ENABLE_TURNSTILE='false' into boolean false (Lite Mode)", () => {
      const parsed = parseClientEnv({
        NODE_ENV: "development",
        NEXT_PUBLIC_ENABLE_TURNSTILE: "false",
      });

      expect(parsed.NEXT_PUBLIC_ENABLE_TURNSTILE).toBe(false);
    });

    it("rejects invalid NEXT_PUBLIC_SITE_URL", () => {
      expect(() =>
        parseClientEnv({
          NODE_ENV: "development",
          NEXT_PUBLIC_SITE_URL: "not-a-valid-url",
        })
      ).toThrow();
    });

    it("requires NEXT_PUBLIC_TURNSTILE_SITE_KEY in production when Turnstile is active", () => {
      expect(() =>
        parseClientEnv({
          NODE_ENV: "production",
          NEXT_PUBLIC_SITE_URL: "https://example.com",
          NEXT_PUBLIC_ENABLE_TURNSTILE: "true",
        })
      ).toThrow(/NEXT_PUBLIC_TURNSTILE_SITE_KEY é obrigatória em produção/);
    });

    it("allows missing NEXT_PUBLIC_TURNSTILE_SITE_KEY in production if Turnstile is disabled (Lite Mode)", () => {
      const parsed = parseClientEnv({
        NODE_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "https://example.com",
        NEXT_PUBLIC_ENABLE_TURNSTILE: "false",
      });

      expect(parsed.NEXT_PUBLIC_ENABLE_TURNSTILE).toBe(false);
      expect(parsed.NEXT_PUBLIC_TURNSTILE_SITE_KEY).toBeUndefined();
    });
  });

  describe("Server Environment Schema (serverEnvSchema & parseServerEnv)", () => {
    const validDevConfig = {
      NODE_ENV: "development" as const,
      RESEND_API_KEY: "re_123456789",
      RESEND_FROM_EMAIL: "Contato <contato@example.com>",
      CONTACT_EMAIL_TO: "leads@example.com",
    };

    it("parses minimal valid configuration in development with default dev RATE_LIMIT_SECRET", () => {
      const parsed = parseServerEnv(validDevConfig);

      expect(parsed.RESEND_API_KEY).toBe("re_123456789");
      expect(parsed.RESEND_FROM_EMAIL).toBe("Contato <contato@example.com>");
      expect(parsed.CONTACT_EMAIL_TO).toBe("leads@example.com");
      expect(parsed.RATE_LIMIT_SECRET).toBe(DEFAULT_DEV_RATE_LIMIT_SECRET);
    });

    it("rejects missing core email variables", () => {
      expect(() =>
        parseServerEnv({
          NODE_ENV: "development",
          RESEND_FROM_EMAIL: "contato@example.com",
          CONTACT_EMAIL_TO: "leads@example.com",
        })
      ).toThrow(/RESEND_API_KEY/);

      expect(() =>
        parseServerEnv({
          NODE_ENV: "development",
          RESEND_API_KEY: "re_123",
          CONTACT_EMAIL_TO: "invalid-email",
        })
      ).toThrow(/CONTACT_EMAIL_TO/);
    });

    it("rejects production deployment if RATE_LIMIT_SECRET is missing", () => {
      expect(() =>
        parseServerEnv({
          ...validDevConfig,
          NODE_ENV: "production",
          TURNSTILE_SECRET_KEY: "0x4AAAAAA",
        })
      ).toThrow(/RATE_LIMIT_SECRET é obrigatório em produção/);
    });

    it("rejects production deployment if RATE_LIMIT_SECRET is set to dev placeholder", () => {
      expect(() =>
        parseServerEnv({
          ...validDevConfig,
          NODE_ENV: "production",
          RATE_LIMIT_SECRET: DEFAULT_DEV_RATE_LIMIT_SECRET,
          TURNSTILE_SECRET_KEY: "0x4AAAAAA",
        })
      ).toThrow(/RATE_LIMIT_SECRET é obrigatório em produção e não pode conter o valor padrão/);
    });

    it("rejects Upstash credentials mismatch (URL provided without Token)", () => {
      expect(() =>
        parseServerEnv({
          ...validDevConfig,
          UPSTASH_REDIS_REST_URL: "https://upstash.io",
        })
      ).toThrow(/UPSTASH_REDIS_REST_TOKEN é obrigatório/);
    });

    it("rejects Upstash credentials mismatch (Token provided without URL)", () => {
      expect(() =>
        parseServerEnv({
          ...validDevConfig,
          UPSTASH_REDIS_REST_TOKEN: "some-token",
        })
      ).toThrow(/UPSTASH_REDIS_REST_URL é obrigatório/);
    });

    it("accepts valid Upstash credentials when both are provided", () => {
      const parsed = parseServerEnv({
        ...validDevConfig,
        UPSTASH_REDIS_REST_URL: "https://example-redis.upstash.io",
        UPSTASH_REDIS_REST_TOKEN: "secret-token",
      });

      expect(parsed.UPSTASH_REDIS_REST_URL).toBe("https://example-redis.upstash.io");
      expect(parsed.UPSTASH_REDIS_REST_TOKEN).toBe("secret-token");
    });

    it("rejects in production if Turnstile is enabled but TURNSTILE_SECRET_KEY is missing", () => {
      expect(() =>
        parseServerEnv({
          ...validDevConfig,
          NODE_ENV: "production",
          RATE_LIMIT_SECRET: "strong-secret-key-at-least-16-chars",
          NEXT_PUBLIC_ENABLE_TURNSTILE: "true",
        })
      ).toThrow(/TURNSTILE_SECRET_KEY é obrigatória em produção/);
    });

    it("accepts in production if Turnstile is disabled (Lite Mode) without TURNSTILE_SECRET_KEY", () => {
      const parsed = parseServerEnv({
        ...validDevConfig,
        NODE_ENV: "production",
        RATE_LIMIT_SECRET: "strong-secret-key-at-least-16-chars",
        NEXT_PUBLIC_ENABLE_TURNSTILE: "false",
      });

      expect(parsed.TURNSTILE_SECRET_KEY).toBeUndefined();
    });
  });
});
