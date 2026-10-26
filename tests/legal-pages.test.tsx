import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import PrivacyPolicyPage from "@/app/(legal)/politica-de-privacidade/page";
import TermsOfUsePage from "@/app/(legal)/termos-de-uso/page";
import { siteConfig } from "@/config/site";

describe("Legal Pages (src/app/(legal)/)", () => {
  describe("Privacy Policy Page (politica-de-privacidade/page.tsx)", () => {
    it("renders corporate identification and DPO contact channel", () => {
      render(<PrivacyPolicyPage />);

      expect(screen.getAllByText(new RegExp(siteConfig.legal.companyName, "i")).length).toBeGreaterThan(0);
      expect(screen.getAllByText(new RegExp(siteConfig.legal.cnpj, "i")).length).toBeGreaterThan(0);
      expect(screen.getAllByText(new RegExp(siteConfig.legal.dpoEmail, "i")).length).toBeGreaterThan(0);
    });

    it("transparently describes active cloud infrastructure and HMAC IP pseudonymization", () => {
      render(<PrivacyPolicyPage />);

      const text = document.body.textContent ?? "";

      expect(text).toContain("Vercel");
      expect(text).toContain("Resend");
      expect(text).toContain("Upstash");
      expect(text).toMatch(/pseudonimização/i);
      expect(text).toMatch(/HMAC/i);
    });

    it("includes International Data Transfer clause (LGPD Art. 33)", () => {
      render(<PrivacyPolicyPage />);

      const text = document.body.textContent ?? "";

      expect(text).toMatch(/Transferência Internacional de Dados/i);
      expect(text).toMatch(/Art\.?\s*33/i);
    });

    it("respects service fidelity (ADR 0007): does not mention Plausible when disabled", () => {
      render(<PrivacyPolicyPage />);

      const text = document.body.textContent ?? "";

      expect(text).not.toContain("Plausible");
    });

    it("renders Turnstile section when active in configuration", () => {
      render(<PrivacyPolicyPage />);

      const text = document.body.textContent ?? "";

      expect(text).toMatch(/Turnstile/i);
    });

    it("has zero accessibility violations according to WCAG 2.1 AA", async () => {
      const { container } = render(<PrivacyPolicyPage />);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });

  describe("Terms of Use Page (termos-de-uso/page.tsx)", () => {
    it("renders corporate details and terms of use title", () => {
      render(<TermsOfUsePage />);

      expect(screen.getByRole("heading", { level: 1, name: /Termos de Uso/i })).toBeDefined();
      expect(screen.getAllByText(new RegExp(siteConfig.legal.companyName, "i")).length).toBeGreaterThan(0);
      expect(screen.getAllByText(new RegExp(siteConfig.legal.cnpj, "i")).length).toBeGreaterThan(0);
    });

    it("has zero accessibility violations according to WCAG 2.1 AA", async () => {
      const { container } = render(<TermsOfUsePage />);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});

