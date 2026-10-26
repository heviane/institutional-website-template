import { describe, it, expect } from "vitest";
import { reader, getPublishedPosts, getServices, getFaqs, getHomePage } from "@/lib/keystatic";

describe("Keystatic Reader API Layer (src/lib/keystatic.ts)", () => {
  it("initializes reader successfully with local configuration", () => {
    expect(reader).toBeDefined();
    expect(reader.collections).toBeDefined();
    expect(reader.singletons).toBeDefined();
  });

  it("reads homePage singleton with all required fields", async () => {
    const home = await getHomePage();

    expect(home).toBeDefined();
    expect(home?.heroHeadline).toBeTruthy();
    expect(home?.heroSubheadline).toBeTruthy();
    expect(home?.primaryCtaLabel).toBeTruthy();
    expect(home?.primaryCtaLink).toBeTruthy();
    expect(typeof home?.showTestimonials).toBe("boolean");
  });

  it("reads all active services seeded in content/services/", async () => {
    const services = await getServices();

    expect(Array.isArray(services)).toBe(true);
    expect(services.length).toBeGreaterThanOrEqual(3);

    const slugs = services.map((s) => s.slug);
    expect(slugs).toContain("consultoria-estrategica");
    expect(slugs).toContain("seguranca-e-conformidade");
    expect(slugs).toContain("transformacao-e-escala");

    for (const service of services) {
      expect(service.entry.title).toBeTruthy();
      expect(service.entry.icon).toBeTruthy();
      expect(service.entry.shortDescription).toBeTruthy();
      expect(Array.isArray(service.entry.features)).toBe(true);
      expect(service.entry.features.length).toBeGreaterThan(0);
    }
  });

  it("returns FAQs ordered by display order (ascending order: 1, 2, 3...)", async () => {
    const faqs = await getFaqs();

    expect(Array.isArray(faqs)).toBe(true);
    expect(faqs.length).toBeGreaterThanOrEqual(3);

    for (let i = 0; i < faqs.length - 1; i++) {
      const currentOrder = faqs[i].entry.order ?? 0;
      const nextOrder = faqs[i + 1].entry.order ?? 0;
      expect(currentOrder).toBeLessThanOrEqual(nextOrder);
    }
  });

  it("filters out draft posts and orders published posts by date descending", async () => {
    const publishedPosts = await getPublishedPosts();

    expect(Array.isArray(publishedPosts)).toBe(true);
    expect(publishedPosts.length).toBeGreaterThan(0);

    // Draft post MUST NOT be included
    const slugs = publishedPosts.map((p) => p.slug);
    expect(slugs).toContain("bem-vindo-ao-novo-site");
    expect(slugs).not.toContain("governanca-e-seguranca-digital");

    // All returned posts must strictly have status === "published"
    for (const post of publishedPosts) {
      expect(post.entry.status).toBe("published");
      expect(post.entry.title).toBeTruthy();
      expect(post.entry.summary).toBeTruthy();
    }

    // Verify descending date order if multiple published posts exist
    for (let i = 0; i < publishedPosts.length - 1; i++) {
      const currentDate = new Date(publishedPosts[i].entry.publishedDate).getTime();
      const nextDate = new Date(publishedPosts[i + 1].entry.publishedDate).getTime();
      expect(currentDate).toBeGreaterThanOrEqual(nextDate);
    }
  });
});
