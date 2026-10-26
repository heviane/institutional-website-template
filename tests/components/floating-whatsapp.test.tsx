import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { FloatingWhatsApp } from "@/components/shared/floating-whatsapp/floating-whatsapp";
import { siteConfig } from "@/config/site";

describe("FloatingWhatsApp Component (src/components/shared/floating-whatsapp/)", () => {
  it("renders a floating action button linking to official WhatsApp URL", () => {
    render(<FloatingWhatsApp />);

    const link = screen.getByRole("link", { name: /falar conosco no whatsapp/i });

    expect(document.body.contains(link)).toBe(true);
    expect(link.getAttribute("href")).toContain(`wa.me/${siteConfig.contact.whatsapp}`);
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
    expect(link.getAttribute("rel")).toContain("noreferrer");
  });

  it("ensures touch target is at least 56x56px (exceeding WCAG 2.1 AA 44x44px)", () => {
    render(<FloatingWhatsApp />);

    const link = screen.getByRole("link", { name: /falar conosco no whatsapp/i });

    expect(link.className).toContain("h-14");
    expect(link.className).toContain("w-14");
    expect(link.className).toContain("fixed");
    expect(link.className).toContain("bottom-6");
    expect(link.className).toContain("right-6");
    expect(link.className).toContain("z-50");
  });

  it("does not render when showFloatingWhatsapp is explicitly false in siteConfig", () => {
    const originalValue = siteConfig.contact.showFloatingWhatsapp;
    (siteConfig.contact as { showFloatingWhatsapp?: boolean }).showFloatingWhatsapp = false;

    const { container } = render(<FloatingWhatsApp />);

    expect(container.firstChild).toBeNull();

    (siteConfig.contact as { showFloatingWhatsapp?: boolean }).showFloatingWhatsapp = originalValue;
  });

  it("passes WCAG 2.1 AA accessibility audit with zero violations", async () => {
    const { container } = render(<FloatingWhatsApp />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
