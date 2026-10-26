import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ContactForm } from "@/components/shared/contact-form/contact-form";
import * as contactAction from "@/app/actions/contact";

// Mock @marsidev/react-turnstile
vi.mock("@marsidev/react-turnstile", () => ({
  Turnstile: ({ onSuccess }: { onSuccess: (token: string) => void }) => (
    <div data-testid="turnstile-widget">
      <button
        type="button"
        onClick={() => onSuccess("mock_cf_token")}
        data-testid="turnstile-trigger"
      >
        Verify Turnstile
      </button>
    </div>
  ),
}));

describe("ContactForm Component (src/components/shared/contact-form/contact-form.tsx)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields, labels and submit button", () => {
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/Nome completo/i);
    const emailInput = screen.getByLabelText(/E-mail/i);
    const phoneInput = screen.getByLabelText(/Telefone/i);
    const messageInput = screen.getByLabelText(/Mensagem/i);
    const submitBtn = screen.getByRole("button", { name: /Enviar mensagem/i });

    expect(document.body.contains(nameInput)).toBe(true);
    expect(document.body.contains(emailInput)).toBe(true);
    expect(document.body.contains(phoneInput)).toBe(true);
    expect(document.body.contains(messageInput)).toBe(true);
    expect(document.body.contains(submitBtn)).toBe(true);
  });

  it("keeps honeypot field visually hidden and inaccessible via aria-hidden", () => {
    const { container } = render(<ContactForm />);
    const honeypotWrapper = container.querySelector('[aria-hidden="true"]');

    expect(honeypotWrapper).toBeDefined();
    expect(honeypotWrapper?.classList.contains("opacity-0")).toBe(true);
  });

  it("displays client-side validation errors when required fields are missing", async () => {
    render(<ContactForm />);
    const submitBtn = screen.getByRole("button", { name: /Enviar mensagem/i });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      const nameError = screen.getByText(/O nome deve conter pelo menos 2 caracteres/i);
      const emailError = screen.getByText(/Informe um endereço de e-mail/i);
      const messageError = screen.getByText(/A mensagem deve conter pelo menos 10 caracteres/i);

      expect(document.body.contains(nameError)).toBe(true);
      expect(document.body.contains(emailError)).toBe(true);
      expect(document.body.contains(messageError)).toBe(true);
    });
  });

  it("submits valid form data and renders success alert", async () => {
    vi.spyOn(contactAction, "sendContactEmail").mockResolvedValueOnce({
      success: true,
      message: "Mensagem enviada com sucesso! Entraremos em contato em breve.",
    });

    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/Nome completo/i), {
      target: { value: "Mariana Costa" },
    });
    fireEvent.change(screen.getByLabelText(/E-mail/i), {
      target: { value: "mariana@exemplo.com" },
    });
    fireEvent.change(screen.getByLabelText(/Mensagem/i), {
      target: { value: "Mensagem detalhada sobre serviços de consultoria técnica." },
    });

    const submitBtn = screen.getByRole("button", { name: /Enviar mensagem/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      const statusAlert = screen.getByRole("status");
      expect(statusAlert.textContent).toContain("Mensagem enviada com sucesso");
    });
  });

  it("displays error alert with direct WhatsApp channel link when submission fails", async () => {
    vi.spyOn(contactAction, "sendContactEmail").mockResolvedValueOnce({
      success: false,
      message: "Limite temporário de envios atingido. Por favor, fale conosco pelo WhatsApp.",
    });

    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/Nome completo/i), {
      target: { value: "Mariana Costa" },
    });
    fireEvent.change(screen.getByLabelText(/E-mail/i), {
      target: { value: "mariana@exemplo.com" },
    });
    fireEvent.change(screen.getByLabelText(/Mensagem/i), {
      target: { value: "Mensagem detalhada sobre serviços de consultoria técnica." },
    });

    const submitBtn = screen.getByRole("button", { name: /Enviar mensagem/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert.textContent).toContain("Limite temporário de envios atingido");
      const link = alert.querySelector("a");
      expect(link).toBeDefined();
      expect(link?.getAttribute("href")).toContain("wa.me");
    });
  });

  it("passes WCAG 2.1 AA accessibility checks with zero violations", async () => {
    const { container } = render(<ContactForm />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
