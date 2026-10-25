import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

describe("Card component", () => {
  it("renders composite structure properly with semantic elements", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Consultoria Estratégica</CardTitle>
          <CardDescription>Soluções sob medida para sua empresa.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Conteúdo detalhado do serviço com benefícios claros.</p>
        </CardContent>
        <CardFooter>
          <button type="button">Saiba mais</button>
        </CardFooter>
      </Card>
    );

    const title = screen.getByText("Consultoria Estratégica");
    const description = screen.getByText("Soluções sob medida para sua empresa.");
    const content = screen.getByText("Conteúdo detalhado do serviço com benefícios claros.");
    const button = screen.getByRole("button", { name: /saiba mais/i });

    expect(title).toBeDefined();
    expect(document.body.contains(title)).toBe(true);
    expect(description).toBeDefined();
    expect(document.body.contains(description)).toBe(true);
    expect(content).toBeDefined();
    expect(document.body.contains(content)).toBe(true);
    expect(button).toBeDefined();
    expect(document.body.contains(button)).toBe(true);
  });

  it("applies theme border and background classes without raw hex colors", () => {
    const { container } = render(
      <Card className="custom-class">
        <CardContent>Test</CardContent>
      </Card>
    );

    const card = container.firstElementChild as HTMLElement;
    expect(card.className).toContain("bg-card");
    expect(card.className).toContain("text-card-foreground");
    expect(card.className).toContain("border");
    expect(card.className).toContain("custom-class");
    // Assert no raw hex colors are used in class names
    expect(card.className).not.toMatch(/#[0-9a-fA-F]{3,8}/);
  });

  it("has zero accessibility violations according to WCAG 2.1 AA", async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Título Acessível</CardTitle>
          <CardDescription>Descrição acessível do cartão.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Texto do cartão em conformidade com contraste semântico.</p>
        </CardContent>
      </Card>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
