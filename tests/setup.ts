import { expect } from "vitest";
import * as matchers from "vitest-axe/matchers";

expect.extend(matchers);

if (typeof window !== "undefined") {
  // Polyfill canvas getContext in jsdom to avoid axe-core warnings
  HTMLCanvasElement.prototype.getContext = () => null;
}
