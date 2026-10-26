import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import HomePage from "@/app/page";
import { siteConfig } from "@/config/site";

describe("HomePage (Layout Shell Demo)", () => {
  it("renders complete landing page shell with Header, Hero, Services, About, and Footer", () => {
    render(<HomePage />);

    // Header & Brand (appears in Header and Footer)
    const brandElements = screen.getAllByText(siteConfig.name);
    expect(brandElements.length).toBeGreaterThan(0);

    // Hero Section & Footer Slogan
    const sloganElements = screen.getAllByText(siteConfig.slogan);
    expect(sloganElements.length).toBeGreaterThan(0);

    // Services Section
    expect(screen.getByText("Nossas Soluções")).toBeDefined();
    expect(screen.getByText("Consultoria Estratégica")).toBeDefined();
    expect(screen.getByText("Segurança & Conformidade")).toBeDefined();
    expect(screen.getByText("Transformação & Escala")).toBeDefined();

    // About Section
    expect(screen.getByText(`Sobre a ${siteConfig.name}`)).toBeDefined();

    // Contact Section with Form
    expect(screen.getByText("Pronto para conversar sobre o seu projeto?")).toBeDefined();
    expect(screen.getByLabelText(/Nome completo/i)).toBeDefined();
    expect(screen.getByLabelText(/E-mail profissional/i)).toBeDefined();
    expect(screen.getByLabelText(/Mensagem/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /Enviar mensagem/i })).toBeDefined();

    // Footer
    expect(screen.getByText(new RegExp(siteConfig.legal.cnpj))).toBeDefined();
  });

  it("has zero accessibility violations across the entire home layout shell", async () => {
    const { container } = render(<HomePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
