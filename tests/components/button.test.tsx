import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "@/components/ui/button";

describe("Button component", () => {
  it("renders with default variant and meets minimum touch target", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });

    expect(button).toBeDefined();
    expect(document.body.contains(button)).toBe(true);
    expect(button.className).toContain("bg-primary");
    expect(button.className).toContain("min-h-[44px]");
    expect(button.className).toContain("min-w-[44px]");
  });

  it("renders cta variant with accent and interactive scale classes (Case 6)", () => {
    render(<Button variant="cta">Fale Conosco</Button>);
    const button = screen.getByRole("button", { name: /fale conosco/i });

    expect(button.className).toContain("bg-primary");
    expect(button.className).toContain("hover:scale-[1.02]");
    expect(button.className).toContain("active:scale-[0.98]");
  });

  it("renders whatsapp variant with brand emerald styling (Case 6)", () => {
    render(<Button variant="whatsapp">WhatsApp</Button>);
    const button = screen.getByRole("button", { name: /whatsapp/i });

    expect(button.className).toContain("bg-emerald-700");
    expect(button.className).toContain("text-white");
    expect(button.className).toContain("hover:bg-emerald-800");
  });

  it("supports polymorphism with asChild prop rendering anchor element (Case 6)", () => {
    render(
      <Button asChild variant="cta">
        <a href="https://wa.me/5511999999999">Link via CTA</a>
      </Button>
    );

    const link = screen.getByRole("link", { name: /link via cta/i });
    expect(link).toBeDefined();
    expect(document.body.contains(link)).toBe(true);
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe("https://wa.me/5511999999999");
    expect(link.className).toContain("bg-primary");
    expect(link.className).toContain("hover:scale-[1.02]");
  });

  it("has zero accessibility violations according to WCAG 2.1 AA", async () => {
    const { container } = render(<Button variant="cta">Acessível</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
