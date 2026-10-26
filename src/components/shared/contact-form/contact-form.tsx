"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { Loader2, CheckCircle2, AlertCircle, Send } from "lucide-react";
import { contactFormSchema, type ContactFormData } from "@/lib/schemas/contact";
import { sendContactEmail } from "@/app/actions/contact";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { clientEnv } from "@/env/client";
import { siteConfig } from "@/config/site";
import { formatWhatsAppUrl } from "@/lib/utils";

export function ContactForm(): React.JSX.Element {
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      website: "",
      turnstileToken: "",
      privacyConsent: false,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const response = await sendContactEmail(data);

      if (response.success) {
        setStatusMessage(response.message);
        reset();
      } else {
        setErrorMessage(
          response.message ||
            "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente."
        );
      }
    } catch {
      setErrorMessage(
        "Instabilidade temporária na conexão. Por favor, tente novamente ou entre em contato via WhatsApp."
      );
    }
  };

  const whatsappDirectUrl = formatWhatsAppUrl(
    siteConfig.contact.whatsapp,
    "Olá! Gostaria de informações sobre os serviços corporativos."
  );

  return (
    <div className="mx-auto w-full max-w-2xl">
      {statusMessage ? (
        <div
          role="status"
          className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p className="text-sm font-medium">{statusMessage}</p>
        </div>
      ) : null}

      {errorMessage ? (
        <div
          role="alert"
          className="bg-destructive/10 border-destructive/20 text-destructive mb-6 flex items-start gap-3 rounded-lg border p-4"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="text-sm">
            <p className="font-medium">{errorMessage}</p>
            <p className="mt-2">
              Se preferir,{" "}
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline underline-offset-4 hover:opacity-80"
              >
                fale conosco diretamente pelo WhatsApp
              </a>
              .
            </p>
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* Honeypot field (hidden from assistive technologies and users) */}
        <div className="pointer-events-none absolute left-[-9999px] opacity-0" aria-hidden="true">
          <label htmlFor="website-honeypot">Website</label>
          <input
            id="website-honeypot"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>

        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-foreground block text-sm font-medium">
            Nome completo <span className="text-destructive">*</span>
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Ex: Ana Silva"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            disabled={isSubmitting}
            {...register("name")}
          />
          {errors.name ? (
            <p id="name-error" className="text-destructive text-sm">
              {errors.name.message}
            </p>
          ) : null}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-foreground block text-sm font-medium">
            E-mail profissional <span className="text-destructive">*</span>
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Ex: ana.silva@empresa.com.br"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            disabled={isSubmitting}
            {...register("email")}
          />
          {errors.email ? (
            <p id="email-error" className="text-destructive text-sm">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <label htmlFor="phone" className="text-foreground block text-sm font-medium">
            Telefone / WhatsApp <span className="text-muted-foreground text-xs">(opcional)</span>
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder="Ex: (11) 98765-4321"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            disabled={isSubmitting}
            {...register("phone")}
          />
          {errors.phone ? (
            <p id="phone-error" className="text-destructive text-sm">
              {errors.phone.message}
            </p>
          ) : null}
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <label htmlFor="message" className="text-foreground block text-sm font-medium">
            Mensagem <span className="text-destructive">*</span>
          </label>
          <Textarea
            id="message"
            rows={4}
            placeholder="Descreva detalhadamente sua demanda corporativa ou projeto..."
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
            disabled={isSubmitting}
            {...register("message")}
          />
          {errors.message ? (
            <p id="message-error" className="text-destructive text-sm">
              {errors.message.message}
            </p>
          ) : null}
        </div>

        {/* Cloudflare Turnstile */}
        {clientEnv.NEXT_PUBLIC_ENABLE_TURNSTILE && clientEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
          <div className="pt-2">
            <Turnstile
              siteKey={clientEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              onSuccess={(token) => setValue("turnstileToken", token)}
            />
          </div>
        ) : null}

        {/* Privacy Consent Checkbox (LGPD Art. 5, XII) */}
        <div className="flex items-start gap-3 pt-2">
          <input
            id="privacyConsent"
            type="checkbox"
            className="border-input mt-1 h-4 w-4 cursor-pointer rounded"
            {...register("privacyConsent")}
          />
          <label
            htmlFor="privacyConsent"
            className="text-muted-foreground cursor-pointer text-xs leading-relaxed"
          >
            Concordo com a{" "}
            <a
              href="/politica-de-privacidade"
              className="text-primary hover:text-primary/80 underline underline-offset-4"
            >
              Política de Privacidade
            </a>{" "}
            e autorizo o tratamento dos meus dados para retorno comercial.
          </label>
        </div>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-h-[44px] w-full cursor-pointer px-8 sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando mensagem...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar mensagem
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
