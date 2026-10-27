import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import type { MetadataRoute } from "next";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { JsonLd } from "@/components/shared/seo/json-ld";
import { metadata } from "@/app/layout";
import { siteConfig } from "@/config/site";

type SitemapItem = MetadataRoute.Sitemap[number];

describe("SEO Technical & Metadata Suite (Feature 005)", () => {
  describe("Robots Configuration (src/app/robots.ts)", () => {
    it("AC-001: should allow public root and disallow Keystatic admin and api routes", () => {
      const robotsConfig = robots();

      expect(robotsConfig.rules).toBeDefined();

      const rules = Array.isArray(robotsConfig.rules) ? robotsConfig.rules[0] : robotsConfig.rules;

      expect(rules.userAgent).toBe("*");
      expect(rules.allow).toBe("/");

      const disallow = Array.isArray(rules.disallow) ? rules.disallow : [rules.disallow];
      expect(disallow).toContain("/keystatic/");
      expect(disallow).toContain("/api/keystatic/");
    });

    it("AC-001: should reference canonical sitemap URL and host based on siteConfig", () => {
      const robotsConfig = robots();

      expect(robotsConfig.sitemap).toBe(`${siteConfig.url}/sitemap.xml`);
      expect(robotsConfig.host).toBe(siteConfig.url);
    });
  });

  describe("Sitemap Configuration (src/app/sitemap.ts)", () => {
    it("AC-002: should return static institutional routes with correct priorities", async () => {
      const sitemapEntries = await sitemap();
      const urls = sitemapEntries.map((entry: SitemapItem) => entry.url);

      expect(urls).toContain(`${siteConfig.url}/`);
      expect(urls).toContain(`${siteConfig.url}/politica-de-privacidade`);
      expect(urls).toContain(`${siteConfig.url}/termos-de-uso`);

      const homeEntry = sitemapEntries.find((e: SitemapItem) => e.url === `${siteConfig.url}/`);
      expect(homeEntry?.priority).toBe(1.0);
      expect(homeEntry?.changeFrequency).toBe("weekly");

      const privacyEntry = sitemapEntries.find(
        (e: SitemapItem) => e.url === `${siteConfig.url}/politica-de-privacidade`
      );
      expect(privacyEntry?.priority).toBe(0.3);
      expect(privacyEntry?.changeFrequency).toBe("monthly");
    });

    it("AC-002: should include published blog posts and exclude drafts from Keystatic", async () => {
      const sitemapEntries = await sitemap();
      const urls = sitemapEntries.map((entry: SitemapItem) => entry.url);

      // Published post in seed data
      expect(urls).toContain(`${siteConfig.url}/blog/bem-vindo-ao-novo-site`);

      // Draft post in seed data must NOT be present
      expect(urls).not.toContain(`${siteConfig.url}/blog/governanca-e-seguranca-digital`);

      const postEntry = sitemapEntries.find(
        (e: SitemapItem) => e.url === `${siteConfig.url}/blog/bem-vindo-ao-novo-site`
      );
      expect(postEntry?.priority).toBe(0.7);
      expect(postEntry?.changeFrequency).toBe("weekly");
      expect(postEntry?.lastModified).toBeDefined();
    });
  });

  describe("Schema.org JSON-LD Component (src/components/shared/seo/json-ld.tsx)", () => {
    it("AC-004: should render valid JSON-LD script with Organization and WebSite entities", () => {
      const { container } = render(<JsonLd />);
      const script = container.querySelector('script[type="application/ld+json"]');

      expect(script).not.toBeNull();
      const jsonContent = script?.textContent ?? "";
      const parsed = JSON.parse(jsonContent);

      expect(parsed).toBeDefined();
      expect(parsed["@context"]).toBe("https://schema.org");

      // Verify either @graph array or multiple objects
      const entities = parsed["@graph"] ? parsed["@graph"] : [parsed];

      const org = entities.find((e: Record<string, unknown>) => e["@type"] === "Organization");
      expect(org).toBeDefined();
      expect(org.name).toBe(siteConfig.name);
      expect(org.url).toBe(siteConfig.url);

      const website = entities.find((e: Record<string, unknown>) => e["@type"] === "WebSite");
      expect(website).toBeDefined();
      expect(website.name).toBe(siteConfig.name);
      expect(website.url).toBe(siteConfig.url);
      expect(website.inLanguage).toBe("pt-BR");
    });

    it("AC-004: should pass accessibility check with zero violations", async () => {
      const { container } = render(<JsonLd />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Root Layout Metadata (src/app/layout.tsx)", () => {
    it("AC-003: should contain canonical link, OpenGraph and Twitter configurations", () => {
      expect(metadata.metadataBase).toBeDefined();
      expect(metadata.title).toBeDefined();
      expect(metadata.description).toBe(siteConfig.description);

      // Canonical alternates
      expect(metadata.alternates).toBeDefined();
      expect(metadata.alternates?.canonical).toBe("./");

      // Open Graph
      expect(metadata.openGraph).toMatchObject({
        type: "website",
        locale: "pt_BR",
        url: siteConfig.url,
      });

      // Twitter
      expect(metadata.twitter).toMatchObject({
        card: "summary_large_image",
      });

      // Robots
      expect(metadata.robots).toBeDefined();
    });
  });
});
