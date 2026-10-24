import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

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

