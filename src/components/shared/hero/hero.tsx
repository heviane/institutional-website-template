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
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {badge && (
          <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground mb-6 bg-muted/50">
            {badge}
          </div>
        )}

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl">
          {title}
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl leading-relaxed">
          {subtitle}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
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

