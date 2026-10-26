import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome deve conter pelo menos 2 caracteres.")
    .max(100, "O nome deve conter no máximo 100 caracteres."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Informe um endereço de e-mail corporativo ou pessoal válido.")
    .max(150, "O e-mail deve conter no máximo 150 caracteres."),
  phone: z
    .string()
    .trim()
    .max(20, "O telefone deve conter no máximo 20 caracteres.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "A mensagem deve conter pelo menos 10 caracteres.")
    .max(1000, "A mensagem deve conter no máximo 1000 caracteres."),
  website: z.string().max(0, "Spam detectado pelo campo honeypot.").optional().or(z.literal("")),
  turnstileToken: z.string().optional().or(z.literal("")),
  // LGPD Art. 5, XII: Explicit consent without presumed default(true)
  privacyConsent: z.boolean().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export interface ActionResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}
