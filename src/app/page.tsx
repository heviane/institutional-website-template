import type { ReactNode } from "react";
import { Briefcase, ShieldCheck, TrendingUp } from "lucide-react";
import { Header } from "@/components/shared/header/header";
import { Hero } from "@/components/shared/hero/hero";
import { Footer } from "@/components/shared/footer/footer";
import { ContactForm } from "@/components/shared/contact-form/contact-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { formatWhatsAppUrl } from "@/lib/utils";

/**
 * ⚠️ DEMO PLACEHOLDER CONTENT:
 * The services array below is strictly for layout demonstration, design system verification,
 * and automated accessibility testing (vitest-axe). Replace with the client's actual services
 * during client onboarding (docs/07-client-onboarding-checklist.md) or manage via Keystatic CMS (Feature 004).
 */
const services = [
  {
    icon: Briefcase,
    title: "Consultoria Estratégica",
    description: "Planejamento e governança sob medida para sua operação.",
    content:
      "Mapeamento detalhado de processos e implementação de práticas ágeis de gestão com métricas objetivas.",
  },
  {
    icon: ShieldCheck,
    title: "Segurança & Conformidade",
    description: "Privacidade por padrão e conformidade legal e regulatória.",
    content:
      "Adequação integral às diretrizes da LGPD, boas práticas de segurança e mitigação estruturada de riscos.",
  },
  {
    icon: TrendingUp,
    title: "Transformação & Escala",
    description: "Tecnologia e performance para crescimento consistente.",
    content:
      "Arquitetura moderna, alta disponibilidade e processos otimizados para acompanhar o ritmo da sua empresa.",
  },
];

export default function HomePage(): ReactNode {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Services & Features Section */}
        <section id="servicos" className="py-16 md:py-24 border-t border-border bg-muted/20 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Nossas Soluções
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Metodologias consolidadas para impulsionar eficiência e
                segurança para o seu negócio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12">
              {services.map((service) => {
                const IconComponent = service.icon;
                return (
                  <Card key={service.title} className="flex flex-col justify-between">
                    <CardHeader className="space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl font-bold">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {service.content}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="sobre" className="py-16 md:py-24 border-t border-border bg-background scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Sobre a {siteConfig.name}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Atuamos com foco inegociável em qualidade, conformidade técnica
                e relacionamento de longo prazo. Nossa missão é entregar
                soluções robustas e sustentáveis para que nossos clientes possam
                operar com total tranquilidade.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contato"
          className="py-16 md:py-24 border-t border-border bg-muted/30 scroll-mt-20"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Pronto para conversar sobre o seu projeto?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Envie sua mensagem pelo formulário abaixo ou fale diretamente com a nossa
                equipe pelos canais corporativos oficiais.
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
