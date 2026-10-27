import { expect, vi } from "vitest";
import * as matchers from "vitest-axe/matchers";
import * as React from "react";

expect.extend(matchers);

// Mock Next.js Link to render a clean anchor tag and eliminate prefetch state warnings in tests
vi.mock("next/link", () => {
  return {
    default: ({
      children,
      href,
      ...props
    }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
      prefetch?: boolean;
    }) => {
      return React.createElement("a", { href, ...props }, children);
    },
  };
});

// Mock Next.js font loader to avoid runtime errors in jsdom/Vitest
vi.mock("next/font/google", () => ({
  Inter: () => ({
    variable: "--font-sans",
  }),
}));

if (typeof window !== "undefined") {
  // Polyfill canvas getContext in jsdom to avoid axe-core warnings
  HTMLCanvasElement.prototype.getContext = () => null;
}
