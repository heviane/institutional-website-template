import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendContactEmail } from "@/app/actions/contact";
import * as rateLimitModule from "@/lib/rate-limit";
import { resend } from "@/lib/resend";
import { clientEnv } from "@/env/client";
import { serverEnv } from "@/env/server";

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn(
    async () =>
      new Headers({
        "x-real-ip": "203.0.113.42",
      })
  ),
}));

// Mock resend
vi.mock("@/lib/resend", () => ({
  resend: {
    emails: {
      send: vi.fn(async () => ({ data: { id: "mock_email_id" }, error: null })),
    },
  },
}));

describe("Contact Server Action (src/app/actions/contact.ts)", () => {
  const validPayload = {
    name: "Carlos Eduardo",
    email: "carlos.eduardo@empresa.com",
    phone: "(11) 99887-7665",
    message: "Gostaria de agendar uma demonstração técnica dos serviços corporativos.",
    turnstileToken: "valid_turnstile_token",
    privacyConsent: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NODE_ENV", "test");
    vi.spyOn(globalThis, "fetch").mockImplementation(
      async () => new Response(JSON.stringify({ success: true }), { status: 200 })
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("Caso 1 (Caminho Feliz): Valid submission dispatches email via Resend and returns success", async () => {
    const response = await sendContactEmail(validPayload);

    expect(response.success).toBe(true);
    expect(response.message).toMatch(/Mensagem enviada com sucesso/);
    expect(resend.emails.send).toHaveBeenCalledTimes(1);
    expect(resend.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: serverEnv.RESEND_FROM_EMAIL,
        to: serverEnv.CONTACT_EMAIL_TO,
        replyTo: "carlos.eduardo@empresa.com",
      })
    );
  });

  it("Caso 2 (Honeypot): Bot populating 'website' is silently discarded with fake success", async () => {
    const botPayload = {
      ...validPayload,
      website: "https://spam-bot.xyz",
    };

    const response = await sendContactEmail(botPayload);

    expect(response.success).toBe(true);
    expect(response.message).toMatch(/Mensagem enviada com sucesso/);
    // Neither Resend nor external APIs should have been called
    expect(resend.emails.send).not.toHaveBeenCalled();
  });

  it("Caso 3 (Rate Limit Estourado): Rate limit rejection returns message directing to WhatsApp", async () => {
    vi.spyOn(rateLimitModule, "checkRateLimit").mockResolvedValueOnce({
      isAllowed: false,
      remaining: 0,
      resetAt: Date.now() + 3600000,
    });

    const response = await sendContactEmail(validPayload);

    expect(response.success).toBe(false);
    expect(response.message).toMatch(/Limite temporário de envios atingido/);
    expect(response.message).toMatch(/WhatsApp/);
    expect(resend.emails.send).not.toHaveBeenCalled();
  });

  it("Caso 4 (Rate Limit Fail-Closed): Upstash Redis error blocks email dispatch and alerts user", async () => {
    vi.spyOn(rateLimitModule, "checkRateLimit").mockRejectedValueOnce(
      new Error("Redis connection timeout")
    );

    const response = await sendContactEmail(validPayload);

    expect(response.success).toBe(false);
    expect(response.message).toMatch(/indisponível/i);
    expect(response.message).toMatch(/WhatsApp/);
    expect(resend.emails.send).not.toHaveBeenCalled();
  });

  it("Caso 5 (Turnstile Fail-Closed): Invalid Turnstile token or Cloudflare failure blocks email", async () => {
    // Simulate Cloudflare returning error 500 or { success: false }
    vi.spyOn(globalThis, "fetch").mockImplementationOnce(
      async () => new Response(JSON.stringify({ success: false }), { status: 200 })
    );

    // Ensure Turnstile verification is actively enforced
    const originalEnable = clientEnv.NEXT_PUBLIC_ENABLE_TURNSTILE;
    (clientEnv as { NEXT_PUBLIC_ENABLE_TURNSTILE: boolean }).NEXT_PUBLIC_ENABLE_TURNSTILE = true;
    (serverEnv as { TURNSTILE_SECRET_KEY?: string }).TURNSTILE_SECRET_KEY = "0x4AAAAAA";

    const response = await sendContactEmail({
      ...validPayload,
      turnstileToken: "invalid_or_expired_token",
    });

    expect(response.success).toBe(false);
    expect(response.message).toMatch(/validação de segurança/i);
    expect(resend.emails.send).not.toHaveBeenCalled();

    (clientEnv as { NEXT_PUBLIC_ENABLE_TURNSTILE: boolean }).NEXT_PUBLIC_ENABLE_TURNSTILE =
      originalEnable;
  });

  it("Caso 6 (Turnstile Modo Lite): Proceeds with dispatch when Turnstile is disabled", async () => {
    const originalEnable = clientEnv.NEXT_PUBLIC_ENABLE_TURNSTILE;
    (clientEnv as { NEXT_PUBLIC_ENABLE_TURNSTILE: boolean }).NEXT_PUBLIC_ENABLE_TURNSTILE = false;

    const response = await sendContactEmail({
      ...validPayload,
      turnstileToken: undefined,
    });

    expect(response.success).toBe(true);
    expect(resend.emails.send).toHaveBeenCalledTimes(1);

    (clientEnv as { NEXT_PUBLIC_ENABLE_TURNSTILE: boolean }).NEXT_PUBLIC_ENABLE_TURNSTILE =
      originalEnable;
  });

  it("Caso 7 (Resend Fail & Sanitização Absoluta): Resend API error returns sanitized fallback message without leaking internals", async () => {
    vi.mocked(resend.emails.send).mockResolvedValueOnce({
      data: null,
      error: {
        name: "rate_limit_exceeded",
        message: "You have exceeded your daily quota of 100 emails on Resend API.",
      },
    } as unknown as Awaited<ReturnType<typeof resend.emails.send>>);

    const response = await sendContactEmail(validPayload);

    expect(response.success).toBe(false);
    expect(response.message).toMatch(/instabilidade temporária no serviço de e-mail/);
    expect(response.message).toMatch(/WhatsApp/);
    // Assert no private details leaked
    expect(JSON.stringify(response)).not.toContain("rate_limit_exceeded");
    expect(JSON.stringify(response)).not.toContain("Resend API");
  });

  it("Caso 8 (Guarda Preliminar Anti-DoS): Payload exceeding 5000 characters is rejected immediately", async () => {
    const oversizedPayload = {
      ...validPayload,
      message: "a".repeat(5100),
    };

    const response = await sendContactEmail(oversizedPayload);

    expect(response.success).toBe(false);
    expect(response.message).toMatch(/Payload excede o limite máximo permitido/);
    expect(resend.emails.send).not.toHaveBeenCalled();
  });

  it("Caso 9 (Validação Zod de Payload): Invalid field types return structured field errors", async () => {
    const invalidPayload = {
      name: "A", // too short (< 2)
      email: "not-an-email",
      message: "Short", // too short (< 10)
    };

    const response = await sendContactEmail(invalidPayload);

    expect(response.success).toBe(false);
    expect(response.errors).toBeDefined();
    expect(response.errors?.name).toBeDefined();
    expect(response.errors?.email).toBeDefined();
    expect(response.errors?.message).toBeDefined();
    expect(resend.emails.send).not.toHaveBeenCalled();
  });

  it("Caso 10 (IP Ausente em Produção - Fail-Closed): Request without edge IP in production is rejected without shared bucket", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const { headers } = await import("next/headers");
    vi.mocked(headers).mockResolvedValueOnce(new Headers()); // no IP headers

    const response = await sendContactEmail(validPayload);

    expect(response.success).toBe(false);
    expect(response.message).toMatch(/validar a segurança da conexão/);
    expect(response.message).toMatch(/WhatsApp/);
    expect(resend.emails.send).not.toHaveBeenCalled();
  });
});
