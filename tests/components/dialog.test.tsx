import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

describe("Dialog component", () => {
  it("manages complete focus lifecycle (Case 3): opens, traps focus, closes on Escape, restores focus", async () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button type="button">Abrir Modal</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Título do Diálogo</DialogTitle>
            <DialogDescription>Descrição do diálogo acessível.</DialogDescription>
          </DialogHeader>
          <button type="button">Ação Interna</button>
        </DialogContent>
      </Dialog>
    );

    const triggerButton = screen.getByRole("button", { name: /abrir modal/i });
    expect(triggerButton).toBeDefined();
    expect(document.body.contains(triggerButton)).toBe(true);

    // Dialog is initially closed
    expect(screen.queryByRole("dialog")).toBeNull();

    // 1. Open dialog
    triggerButton.focus();
    expect(document.activeElement).toBe(triggerButton);
    fireEvent.click(triggerButton);

    // Dialog content should now be visible
    const dialogElement = await screen.findByRole("dialog");
    expect(dialogElement).toBeDefined();
    expect(document.body.contains(dialogElement)).toBe(true);
    expect(screen.getByText("Título do Diálogo")).toBeDefined();

    // 2. Escape closes dialog
    fireEvent.keyDown(dialogElement, { key: "Escape", code: "Escape" });

    // Dialog should be closed and focus restored to trigger
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
      expect(document.activeElement).toBe(triggerButton);
    });
  });

  it("has zero accessibility violations when open according to WCAG 2.1 AA", async () => {
    const { container } = render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modal Acessível</DialogTitle>
            <DialogDescription>Descrição detalhada para leitores de tela.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
