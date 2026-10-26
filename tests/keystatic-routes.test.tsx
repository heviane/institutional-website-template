import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import * as routeHandler from "@/app/api/keystatic/[...params]/route";
import KeystaticPage from "@/app/keystatic/[[...params]]/page";
import KeystaticLayout from "@/app/keystatic/layout";

describe("Keystatic App Router Admin Routes", () => {
  it("exports valid GET and POST handlers in /api/keystatic/[...params]", () => {
    expect(routeHandler.GET).toBeDefined();
    expect(typeof routeHandler.GET).toBe("function");

    expect(routeHandler.POST).toBeDefined();
    expect(typeof routeHandler.POST).toBe("function");
  });

  it("exports a valid Keystatic Admin Page component", () => {
    expect(KeystaticPage).toBeDefined();
    expect(typeof KeystaticPage).toBe("function");
  });

  it("renders KeystaticLayout with isolation class and children intact", () => {
    const { container } = render(
      <KeystaticLayout>
        <div data-testid="keystatic-test-child">Painel Administrativo Keystatic</div>
      </KeystaticLayout>
    );

    const child = screen.getByTestId("keystatic-test-child");
    expect(child).toBeDefined();
    expect(child.textContent).toBe("Painel Administrativo Keystatic");

    const root = container.querySelector(".keystatic-admin-root");
    expect(root).toBeDefined();
    expect(root?.className).toContain("[&~a]:hidden");
  });
});
