import { describe, expect, it } from "vitest";
import { siteConfig, type SiteConfig } from "@/config/site";
import type { SiteConfig as SiteConfigContract } from "@/types/site";

describe("siteConfig configuration object", () => {
  it("should contain all required top-level metadata fields", () => {
    expect(siteConfig.name).toBeTruthy();
    expect(typeof siteConfig.name).toBe("string");

    expect(siteConfig.slogan).toBeTruthy();
    expect(typeof siteConfig.slogan).toBe("string");

    expect(siteConfig.description).toBeTruthy();
    expect(typeof siteConfig.description).toBe("string");

    expect(siteConfig.url).toMatch(/^https?:\/\//);
    expect(siteConfig.ogImage).toMatch(/^https?:\/\//);
  });

  it("should have a populated navigation array with valid structure", () => {
    expect(Array.isArray(siteConfig.nav)).toBe(true);
    expect(siteConfig.nav.length).toBeGreaterThan(0);

    for (const item of siteConfig.nav) {
      expect(item.title).toBeTruthy();
      expect(typeof item.title).toBe("string");
      expect(item.href).toBeTruthy();
      expect(typeof item.href).toBe("string");
      // Must be anchor (#), relative (/), or absolute url (http)
      expect(item.href).toMatch(/^([#/]|https?:\/\/)/);
    }
  });

  it("should contain complete and valid contact information", () => {
    expect(siteConfig.contact).toBeDefined();
    expect(siteConfig.contact.email).toContain("@");
    expect(siteConfig.contact.phone).toBeTruthy();
    expect(siteConfig.contact.whatsapp).toMatch(/^\d+$/);
    expect(siteConfig.contact.address).toBeTruthy();
  });

  it("should contain legal and corporate compliance fields (LGPD/CNPJ)", () => {
    expect(siteConfig.legal).toBeDefined();
    expect(siteConfig.legal.companyName).toBeTruthy();
    expect(siteConfig.legal.cnpj).toBeTruthy();
    expect(siteConfig.legal.dpoEmail).toContain("@");
  });

  it("should contain social channels configuration", () => {
    expect(siteConfig.social).toBeDefined();
    expect(typeof siteConfig.social).toBe("object");
  });

  it("should conform to SiteConfig type contract", () => {
    const config: SiteConfig = siteConfig;
    expect(config).toBeDefined();
  });

  it("should conform to SiteConfig type contract from template types zone", () => {
    const config: SiteConfigContract = siteConfig;
    expect(config).toBeDefined();
  });
});
