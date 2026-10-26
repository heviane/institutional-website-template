import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";

export const reader = createReader(process.cwd(), keystaticConfig);

/**
 * Returns the home page singleton data.
 */
export async function getHomePage() {
  return reader.singletons.homePage.read();
}

/**
 * Returns the about page singleton data.
 */
export async function getAboutPage() {
  return reader.singletons.aboutPage.read();
}

/**
 * Returns all active services ordered as defined.
 */
export async function getServices() {
  return reader.collections.services.all();
}

/**
 * Returns FAQs sorted by display order ascending.
 */
export async function getFaqs() {
  const faqs = await reader.collections.faqs.all();
  return faqs.sort((a, b) => (a.entry.order ?? 0) - (b.entry.order ?? 0));
}

/**
 * Returns all published blog posts, filtering out drafts,
 * sorted by publication date descending.
 */
export async function getPublishedPosts() {
  const allPosts = await reader.collections.posts.all();
  return allPosts
    .filter((post) => post.entry.status === "published")
    .sort(
      (a, b) =>
        new Date(b.entry.publishedDate).getTime() - new Date(a.entry.publishedDate).getTime()
    );
}
