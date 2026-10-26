"use server";

import { headers } from "next/headers";
import { contactFormSchema, type ActionResponse } from "@/lib/schemas/contact";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { resend } from "@/lib/resend";
import { serverEnv } from "@/env/server";
import { clientEnv } from "@/env/client";

const MAX_RAW_PAYLOAD_SIZE = 5120; // ~5 KB

/**
 * Verifies Cloudflare Turnstile token via Cloudflare Siteverify API.
 */
async function verifyTurnstileToken(token?: string, remoteIp?: string): Promise<boolean> {
  if (!clientEnv.NEXT_PUBLIC_ENABLE_TURNSTILE || !serverEnv.TURNSTILE_SECRET_KEY) {
    return true; // Lite Mode bypass
  }

  if (!token) {
    return false;
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", serverEnv.TURNSTILE_SECRET_KEY);
    formData.append("response", token);
    if (remoteIp) {
      formData.append("remoteip", remoteIp);
    }

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      return false;
    }

    const data = (await res.json()) as { success: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

/**
 * Canonical Server Action for the transactional contact form.
 * Implements a 3-layer defensive barrier (Honeypot, Rate Limit, Turnstile) with Fail-Closed semantics.
 */
export async function sendContactEmail(rawInput: unknown): Promise<ActionResponse> {
  // 1. Structural Payload Guard (Anti-DoS CPU protection)
  if (!rawInput || typeof rawInput !== "object") {
    return { success: false, message: "Payload de requisição inválido." };
  }

  let serialized = "";
  try {
    serialized = JSON.stringify(rawInput);
  } catch {
    return { success: false, message: "Payload de requisição inválido." };
  }

  if (serialized.length > MAX_RAW_PAYLOAD_SIZE) {
    return { success: false, message: "Payload excede o limite máximo permitido." };
  }

  // 2. IP Extraction & Production Fail-Closed
  const headerList = await headers();
  const clientIp = getClientIp(headerList);

  if (!clientIp && process.env.NODE_ENV === "production") {
    return {
      success: false,
      message:
        "Não foi possível validar a segurança da conexão. Por favor, utilize nossos canais diretos de WhatsApp ou telefone.",
    };
  }

  const safeIp = clientIp ?? "127.0.0.1";

  // 3. Layer 1: Honeypot (silent discard to mislead automated spam bots)
  const rawRecord = rawInput as Record<string, unknown>;
  if (typeof rawRecord.website === "string" && rawRecord.website.length > 0) {
    return { success: true, message: "Mensagem enviada com sucesso!" };
  }

  // 4. Schema validation via Zod
  const parseResult = contactFormSchema.safeParse(rawInput);
  if (!parseResult.success) {
    return {
      success: false,
      message: "Existem campos inválidos no formulário. Por favor, verifique os dados informados.",
      errors: parseResult.error.flatten().fieldErrors,
    };
  }

  const validatedData = parseResult.data;

  // 5. Layer 2: Rate Limiting (Fail-Closed)
  try {
    const rateLimit = await checkRateLimit(safeIp);
    if (!rateLimit.isAllowed) {
      return {
        success: false,
        message:
          "Limite temporário de envios atingido. Por favor, aguarde uma hora ou fale conosco diretamente pelo WhatsApp.",
      };
    }
  } catch (error) {
    console.error("[CONTACT_ACTION_RATELIMIT_ERROR]", error);
    return {
      success: false,
      message:
        "Serviço de verificação temporariamente indisponível. Por favor, entre em contato diretamente pelo nosso WhatsApp.",
    };
  }

  // 6. Layer 3: Cloudflare Turnstile (Fail-Closed)
  if (clientEnv.NEXT_PUBLIC_ENABLE_TURNSTILE && serverEnv.TURNSTILE_SECRET_KEY) {
    const isTokenValid = await verifyTurnstileToken(validatedData.turnstileToken, safeIp);
    if (!isTokenValid) {
      return {
        success: false,
        message:
          "Falha na validação de segurança. Por favor, tente novamente ou fale conosco diretamente pelo WhatsApp.",
      };
    }
  }

  // 7. Transactional Dispatch via Resend API
  try {
    const { error } = await resend.emails.send({
      from: serverEnv.RESEND_FROM_EMAIL,
      to: serverEnv.CONTACT_EMAIL_TO,
      replyTo: validatedData.email,
      subject: `Novo contato via site: ${validatedData.name}`,
      text: `Nome: ${validatedData.name}\nE-mail: ${validatedData.email}\nTelefone: ${validatedData.phone || "Não informado"}\n\nMensagem:\n${validatedData.message}`,
    });

    if (error) {
      console.error("[CONTACT_ACTION_RESEND_ERROR]", error);
      return {
        success: false,
        message:
          "Ocorreu uma instabilidade temporária no serviço de e-mail. Por favor, utilize nossos canais diretos de WhatsApp ou telefone.",
      };
    }

    return {
      success: true,
      message: "Mensagem enviada com sucesso! Entraremos em contato em breve.",
    };
  } catch (error) {
    console.error("[CONTACT_ACTION_DISPATCH_ERROR]", error);
    return {
      success: false,
      message:
        "Ocorreu uma instabilidade temporária no serviço de e-mail. Por favor, utilize nossos canais diretos de WhatsApp ou telefone.",
    };
  }
}
