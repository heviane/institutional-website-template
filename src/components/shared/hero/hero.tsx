import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { formatWhatsAppUrl } from "@/lib/utils";

export interface HeroCta {
  text: string;
  href: string;
  variant?: "default" | "cta" | "whatsapp" | "outline" | "secondary";
}

export interface HeroProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
}

export function Hero({
  badge,
  title = siteConfig.slogan,
  subtitle = siteConfig.description,
  primaryCta = {
    text: "Iniciar Conversa no WhatsApp",
    href: formatWhatsAppUrl(siteConfig.contact.whatsapp),
    variant: "whatsapp",
  },
  secondaryCta = {
    text: "Conhecer Serviços",
    href: "/#servicos",
    variant: "outline",
  },
}: HeroProps = {}) {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        {badge && (
          <div className="border-border text-muted-foreground bg-muted/50 mb-6 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold">
            {badge}
          </div>
        )}

        <h1 className="text-foreground max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          {title}
        </h1>

        <p className="text-muted-foreground mt-6 max-w-3xl text-lg leading-relaxed sm:text-xl">
          {subtitle}
        </p>

        <div className="mt-8 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
          <Button
            asChild
            variant={primaryCta.variant ?? "whatsapp"}
            size="lg"
            className="w-full sm:w-auto"
          >
            <a href={primaryCta.href}>{primaryCta.text}</a>
          </Button>

          {secondaryCta && (
            <Button
              asChild
              variant={secondaryCta.variant ?? "outline"}
              size="lg"
              className="w-full sm:w-auto"
            >
              <a href={secondaryCta.href}>{secondaryCta.text}</a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
