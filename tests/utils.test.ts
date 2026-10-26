import { describe, expect, it } from "vitest";
import { cn, formatPhoneDisplay, formatTelUrl, formatWhatsAppUrl } from "@/lib/utils";

describe("cn utility", () => {
  it("should merge class names correctly", () => {
    const result = cn("px-2 py-1", "bg-blue-500");
    expect(result).toBe("px-2 py-1 bg-blue-500");
  });

  it("should resolve Tailwind class conflicts", () => {
    const result = cn("px-2", "px-4");
    expect(result).toBe("px-4");
  });

  it("should handle conditional classes", () => {
    const isHidden = false;
    const isVisible = true;
    const result = cn("base-class", isHidden && "hidden", isVisible && "block");
    expect(result).toBe("base-class block");
  });
});

describe("contact helper utilities", () => {
  describe("formatWhatsAppUrl", () => {
    it("should build a clean WhatsApp URL adding Brazilian country code 55 when omitted", () => {
      const url = formatWhatsAppUrl("(11) 99999-9999");
      expect(url).toBe("https://wa.me/5511999999999");
    });

    it("should avoid duplicating country code when already prefixed with 55", () => {
      const url = formatWhatsAppUrl("+55 (11) 99999-9999");
      expect(url).toBe("https://wa.me/5511999999999");
    });

    it("should include encoded message parameter when text is provided", () => {
      const url = formatWhatsAppUrl("11999999999", "Olá! Gostaria de mais informações.");
      expect(url).toBe(
        "https://wa.me/5511999999999?text=Ol%C3%A1!%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
      );
    });
  });

  describe("formatTelUrl", () => {
    it("should format phone number to tel: protocol with E.164 plus prefix", () => {
      const tel = formatTelUrl("(11) 99999-9999");
      expect(tel).toBe("tel:+5511999999999");
    });

    it("should preserve country code 55 without duplicating it", () => {
      const tel = formatTelUrl("5511999999999");
      expect(tel).toBe("tel:+5511999999999");
    });
  });

  describe("formatPhoneDisplay", () => {
    it("should format 11-digit mobile phone numbers with DDD", () => {
      expect(formatPhoneDisplay("11999999999")).toBe("(11) 99999-9999");
    });

    it("should format 10-digit landline numbers with DDD", () => {
      expect(formatPhoneDisplay("1133334444")).toBe("(11) 3333-4444");
    });

    it("should strip country code 55 and format 11-digit numbers", () => {
      expect(formatPhoneDisplay("5511999999999")).toBe("(11) 99999-9999");
    });

    it("should return raw value for non-standard lengths", () => {
      expect(formatPhoneDisplay("123")).toBe("123");
    });
  });
});
