import { z } from "zod";

export const clientEnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    NEXT_PUBLIC_SITE_URL: z
      .string()
      .url("NEXT_PUBLIC_SITE_URL deve ser uma URL válida.")
      .optional(),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
    NEXT_PUBLIC_ENABLE_TURNSTILE: z
      .string()
      .optional()
      .transform((val) => val !== "false"), // Padrão true, desativável definindo como "false"
  })
  .superRefine((data, ctx) => {
    // Se Turnstile estiver ativado em produção (Modo Robusto), a chave do site é obrigatória
    if (data.NODE_ENV === "production" && data.NEXT_PUBLIC_ENABLE_TURNSTILE) {
      if (!data.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["NEXT_PUBLIC_TURNSTILE_SITE_KEY"],
          message:
            "NEXT_PUBLIC_TURNSTILE_SITE_KEY é obrigatória em produção quando o Turnstile estiver ativado. Defina NEXT_PUBLIC_ENABLE_TURNSTILE='false' para operar no Modo Lite.",
        });
      }
    }
  });

export type ClientEnv = z.infer<typeof clientEnvSchema>;

export function parseClientEnv(raw: unknown): ClientEnv {
  return clientEnvSchema.parse(raw);
}

export const clientEnv: ClientEnv = parseClientEnv({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  NEXT_PUBLIC_ENABLE_TURNSTILE: process.env.NEXT_PUBLIC_ENABLE_TURNSTILE,
});
