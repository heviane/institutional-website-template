import { describe, it, expect } from "vitest";
import { contactFormSchema } from "@/lib/schemas/contact";

describe("Contact Form Schema (contactFormSchema)", () => {
  const validData = {
    name: "Ana Silva",
    email: "ana.silva@empresa.com.br",
    phone: "(11) 98765-4321",
    message: "Gostaria de solicitar uma proposta comercial para desenvolvimento.",
    privacyConsent: true,
  };

  it("validates valid input data successfully and trims fields", () => {
    const result = contactFormSchema.safeParse({
      ...validData,
      name: "  Ana Silva  ",
      email: "  ANA.SILVA@EMPRESA.COM.BR  ",
      message: "  Gostaria de solicitar uma proposta comercial para desenvolvimento.  ",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Ana Silva");
      expect(result.data.email).toBe("ana.silva@empresa.com.br");
      expect(result.data.message).toBe("Gostaria de solicitar uma proposta comercial para desenvolvimento.");
    }
  });

  it("applies trim BEFORE min check (Zod 3 ordering: rejects whitespace-only names)", () => {
    const result = contactFormSchema.safeParse({
      ...validData,
      name: "   ",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name?.[0]).toMatch(
        /O nome deve conter pelo menos 2 caracteres/
      );
    }
  });

  it("applies trim BEFORE min check on message", () => {
    const result = contactFormSchema.safeParse({
      ...validData,
      message: "        ",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.message?.[0]).toMatch(
        /A mensagem deve conter pelo menos 10 caracteres/
      );
    }
  });

  it("normalizes and lowercases email before checking valid email format", () => {
    const result = contactFormSchema.safeParse({
      ...validData,
      email: "  USER@DOMAIN.COM  ",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("user@domain.com");
    }
  });

  it("rejects invalid email formats", () => {
    const result = contactFormSchema.safeParse({
      ...validData,
      email: "invalid-email-address",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email?.[0]).toMatch(
        /Informe um endereço de e-mail corporativo ou pessoal válido/
      );
    }
  });

  it("enforces functional boundary on message (accepts 1000 characters, rejects 1001)", () => {
    const exact1000 = "a".repeat(1000);
    const exact1001 = "a".repeat(1001);

    const validResult = contactFormSchema.safeParse({
      ...validData,
      message: exact1000,
    });
    expect(validResult.success).toBe(true);

    const invalidResult = contactFormSchema.safeParse({
      ...validData,
      message: exact1001,
    });
    expect(invalidResult.success).toBe(false);
    if (!invalidResult.success) {
      expect(invalidResult.error.flatten().fieldErrors.message?.[0]).toMatch(
        /A mensagem deve conter no máximo 1000 caracteres/
      );
    }
  });

  it("accepts optional phone number as empty string or formatted text", () => {
    const withEmptyPhone = contactFormSchema.safeParse({
      ...validData,
      phone: "",
    });
    expect(withEmptyPhone.success).toBe(true);

    const withoutPhone = contactFormSchema.safeParse({
      name: validData.name,
      email: validData.email,
      message: validData.message,
    });
    expect(withoutPhone.success).toBe(true);
  });

  it("flags honeypot field if populated by a bot", () => {
    const botResult = contactFormSchema.safeParse({
      ...validData,
      website: "https://spam-bot.xyz",
    });

    expect(botResult.success).toBe(false);
    if (!botResult.success) {
      expect(botResult.error.flatten().fieldErrors.website?.[0]).toMatch(
        /Spam detectado pelo campo honeypot/
      );
    }
  });

  it("allows privacyConsent to be optional or explicit boolean without default true (LGPD Art. 5º, XII)", () => {
    const withoutConsent = contactFormSchema.safeParse({
      name: validData.name,
      email: validData.email,
      message: validData.message,
    });

    expect(withoutConsent.success).toBe(true);
    if (withoutConsent.success) {
      // Must not inject default(true)
      expect(withoutConsent.data.privacyConsent).toBeUndefined();
    }
  });
});

