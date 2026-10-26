import "server-only";
import { z } from "zod";

export const DEFAULT_DEV_RATE_LIMIT_SECRET = "template-rate-limit-dev-secret-do-not-use-in-prod";

export const serverEnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY é obrigatória."),
    RESEND_FROM_EMAIL: z.string().min(1, "RESEND_FROM_EMAIL é obrigatória."),
    CONTACT_EMAIL_TO: z.string().email("CONTACT_EMAIL_TO deve ser um e-mail válido."),
    RATE_LIMIT_SECRET: z
      .string()
      .min(16, "RATE_LIMIT_SECRET deve ter no mínimo 16 caracteres.")
      .optional(),
    TURNSTILE_SECRET_KEY: z.string().optional(),
    NEXT_PUBLIC_ENABLE_TURNSTILE: z.string().optional(),
    UPSTASH_REDIS_REST_URL: z
      .string()
      .url("UPSTASH_REDIS_REST_URL deve ser uma URL válida.")
      .optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // 1. Em produção, RATE_LIMIT_SECRET é estritamente obrigatório e não pode ser o valor de exemplo
    if (data.NODE_ENV === "production") {
      if (!data.RATE_LIMIT_SECRET || data.RATE_LIMIT_SECRET === DEFAULT_DEV_RATE_LIMIT_SECRET) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["RATE_LIMIT_SECRET"],
          message:
            "RATE_LIMIT_SECRET é obrigatório em produção e não pode conter o valor padrão de desenvolvimento.",
        });
      }
    }

    // 2. Paridade Estrita das Credenciais do Upstash (ambas ou nenhuma)
    const hasUpstashUrl = Boolean(data.UPSTASH_REDIS_REST_URL);
    const hasUpstashToken = Boolean(data.UPSTASH_REDIS_REST_TOKEN);

    if (hasUpstashUrl !== hasUpstashToken) {
      const missingField = hasUpstashUrl ? "UPSTASH_REDIS_REST_TOKEN" : "UPSTASH_REDIS_REST_URL";
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [missingField],
        message: `${missingField} é obrigatório quando a outra credencial do Upstash Redis estiver configurada.`,
      });
    }

    // 3. Prevenção de Fail-Open no Turnstile: Se a flag estiver ativa em produção, a chave secreta é estritamente obrigatória
    const isTurnstileEnabled = data.NEXT_PUBLIC_ENABLE_TURNSTILE !== "false";
    if (data.NODE_ENV === "production" && isTurnstileEnabled) {
      if (!data.TURNSTILE_SECRET_KEY) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["TURNSTILE_SECRET_KEY"],
          message:
            "TURNSTILE_SECRET_KEY é obrigatória em produção quando o Turnstile estiver ativo. Defina NEXT_PUBLIC_ENABLE_TURNSTILE='false' para operar no Modo Lite.",
        });
      }
    }
  })
  .transform((data) => ({
    ...data,
    // Em dev/test, se RATE_LIMIT_SECRET for omitido, injeta o fallback controlado
    RATE_LIMIT_SECRET: data.RATE_LIMIT_SECRET ?? DEFAULT_DEV_RATE_LIMIT_SECRET,
  }));

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function parseServerEnv(raw: unknown): ServerEnv {
  return serverEnvSchema.parse(raw);
}

function resolveServerEnv(): ServerEnv {
  if (process.env.NODE_ENV === "test") {
    return parseServerEnv({
      ...process.env,
      NODE_ENV: "test",
      RESEND_API_KEY: process.env.RESEND_API_KEY ?? "re_test_dummy_key",
      RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL ?? "Teste <teste@example.com>",
      CONTACT_EMAIL_TO: process.env.CONTACT_EMAIL_TO ?? "contato@example.com",
      RATE_LIMIT_SECRET: process.env.RATE_LIMIT_SECRET ?? DEFAULT_DEV_RATE_LIMIT_SECRET,
    });
  }
  return parseServerEnv(process.env);
}

export const serverEnv: ServerEnv = resolveServerEnv();
