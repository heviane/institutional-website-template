import type { JSX } from "react";
import type { LucideIcon } from "lucide-react";
import { Briefcase, ShieldCheck, TrendingUp, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/shared/header/header";
import { Hero } from "@/components/shared/hero/hero";
import { Footer } from "@/components/shared/footer/footer";
import { ContactForm } from "@/components/shared/contact-form/contact-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { getServices } from "@/lib/keystatic";

const ICON_MAP: Record<string, LucideIcon> = {
  Briefcase,
  ShieldCheck,
  TrendingUp,
};

export default async function HomePage(): Promise<JSX.Element> {
  const servicesData = await getServices();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Services & Features Section */}
        <section
          id="servicos"
          className="border-border bg-muted/20 scroll-mt-20 border-t py-16 md:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                Nossas Soluções
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Metodologias consolidadas para impulsionar eficiência e segurança para o seu
                negócio.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
              {servicesData.map((service) => {
                const IconComponent = ICON_MAP[service.entry.icon] ?? CheckCircle2;
                return (
                  <Card key={service.slug} className="flex flex-col justify-between">
                    <CardHeader className="space-y-4">
                      <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-lg">
                        <IconComponent className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-xl font-bold">{service.entry.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {service.entry.shortDescription}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {service.entry.features && service.entry.features.length > 0 && (
                        <ul className="space-y-2">
                          {service.entry.features.map((feature) => (
                            <li
                              key={feature}
                              className="text-muted-foreground flex items-center gap-2 text-sm"
                            >
                              <span className="bg-primary h-1.5 w-1.5 shrink-0 rounded-full" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="sobre"
          className="border-border bg-background scroll-mt-20 border-t py-16 md:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl space-y-6 text-center">
              <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                Sobre a {siteConfig.name}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Atuamos com foco inegociável em qualidade, conformidade técnica e relacionamento de
                longo prazo. Nossa missão é entregar soluções robustas e sustentáveis para que
                nossos clientes possam operar com total tranquilidade.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contato"
          className="border-border bg-muted/30 scroll-mt-20 border-t py-16 md:py-24"
        >
          <div className="mx-auto max-w-4xl space-y-12 px-4 sm:px-6 lg:px-8">
            <div className="space-y-4 text-center">
              <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                Pronto para conversar sobre o seu projeto?
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                Envie sua mensagem pelo formulário abaixo ou fale diretamente com a nossa equipe
                pelos canais corporativos oficiais.
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
