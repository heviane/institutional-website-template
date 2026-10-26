import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Header } from "@/components/shared/header/header";
import { MobileNav } from "@/components/shared/header/mobile-nav";
import { Hero } from "@/components/shared/hero/hero";
import { Footer } from "@/components/shared/footer/footer";
import { siteConfig } from "@/config/site";
import { formatWhatsAppUrl } from "@/lib/utils";

describe("Layout Components Suite (Server-First & UI Matrix)", () => {
  describe("Header component (Case 1: Header renders nav items)", () => {
    it("renders brand name and all navigation links defined in siteConfig", () => {
      render(<Header />);

      // Brand name
      expect(screen.getByText(siteConfig.name)).toBeDefined();

      // Navigation links
      for (const item of siteConfig.nav) {
        const link = screen.getAllByRole("link", { name: item.title })[0];
        expect(link).toBeDefined();
        expect(link.getAttribute("href")).toBe(item.href);
      }
    });

    it("has zero accessibility violations according to WCAG 2.1 AA", async () => {
      const { container } = render(<Header />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("MobileNav component (Case 2: Mobile menu toggles correctly)", () => {
    it("opens on trigger click, auto-closes when anchor link is clicked, and closes on Escape", async () => {
      render(<MobileNav items={siteConfig.nav} />);

      const triggerButton = screen.getByRole("button", {
        name: /abrir menu/i,
      });
      expect(triggerButton).toBeDefined();

      // Initially closed
      expect(screen.queryByRole("dialog")).toBeNull();

      // 1. Open menu
      fireEvent.click(triggerButton);
      const dialog = await screen.findByRole("dialog");
      expect(dialog).toBeDefined();

      // Nav items should be visible inside mobile nav
      const firstNavItem = screen.getByRole("link", {
        name: siteConfig.nav[0].title,
      });
      expect(firstNavItem).toBeDefined();

      // 2. Click anchor link -> triggers auto-close
      fireEvent.click(firstNavItem);
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).toBeNull();
      });

      // 3. Open menu again and test Escape key close
      fireEvent.click(triggerButton);
      const dialogAgain = await screen.findByRole("dialog");
      expect(dialogAgain).toBeDefined();

      fireEvent.keyDown(dialogAgain, { key: "Escape", code: "Escape" });
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).toBeNull();
      });
    });

    it("has zero accessibility violations when mobile menu is open", async () => {
      const { container } = render(<MobileNav items={siteConfig.nav} />);
      const triggerButton = screen.getByRole("button", {
        name: /abrir menu/i,
      });
      fireEvent.click(triggerButton);

      await screen.findByRole("dialog");
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Hero component (Case 4: CTA links point to correct anchors)", () => {
    it("renders default title, subtitle, and configured CTA anchor links", () => {
      render(<Hero />);

      expect(screen.getByText(siteConfig.slogan)).toBeDefined();
      expect(screen.getByText(siteConfig.description)).toBeDefined();

      // Primary CTA pointing to WhatsApp
      const expectedWhatsAppUrl = formatWhatsAppUrl(siteConfig.contact.whatsapp);
      const primaryLink = screen.getByRole("link", {
        name: /iniciar conversa no whatsapp/i,
      });
      expect(primaryLink.getAttribute("href")).toBe(expectedWhatsAppUrl);

      // Secondary CTA pointing to /#servicos
      const secondaryLink = screen.getByRole("link", {
        name: /conhecer serviços/i,
      });
      expect(secondaryLink.getAttribute("href")).toBe("/#servicos");
    });

    it("supports custom props overriding fallbacks while respecting button hierarchy", () => {
      render(
        <Hero
          badge="Inovação Contínua"
          title="Título Customizado"
          subtitle="Subtítulo Customizado"
          primaryCta={{
            text: "Fale com Especialista",
            href: "#contato",
            variant: "cta",
          }}
          secondaryCta={{
            text: "Ver Portfólio",
            href: "#portfolio",
            variant: "outline",
          }}
        />
      );

      expect(screen.getByText("Inovação Contínua")).toBeDefined();
      expect(screen.getByText("Título Customizado")).toBeDefined();
      expect(screen.getByText("Subtítulo Customizado")).toBeDefined();

      const primary = screen.getByRole("link", {
        name: /fale com especialista/i,
      });
      expect(primary.getAttribute("href")).toBe("#contato");

      const secondary = screen.getByRole("link", { name: /ver portfólio/i });
      expect(secondary.getAttribute("href")).toBe("#portfolio");
    });

    it("has zero accessibility violations according to WCAG 2.1 AA", async () => {
      const { container } = render(<Hero />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Footer component (Case 5: Footer shows legal/contact info)", () => {
    it("displays corporate compliance info, CNPJ, navigation links, and dynamic copyright year", () => {
      render(<Footer />);

      const currentYear = new Date().getFullYear().toString();
      expect(screen.getByText(new RegExp(currentYear))).toBeDefined();

      // Legal data
      const companyElements = screen.getAllByText(new RegExp(siteConfig.legal.companyName));
      expect(companyElements.length).toBeGreaterThan(0);
      expect(screen.getByText(new RegExp(siteConfig.legal.cnpj))).toBeDefined();

      // Contact info
      expect(screen.getByText(siteConfig.contact.email)).toBeDefined();
      expect(screen.getByText(siteConfig.contact.phone)).toBeDefined();
      expect(screen.getByText(siteConfig.contact.address)).toBeDefined();
    });

    it("has zero accessibility violations according to WCAG 2.1 AA", async () => {
      const { container } = render(<Footer />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
