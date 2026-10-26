export interface NavItem {
  title: string;
  href: string;
}

export interface ContactConfig {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  showFloatingWhatsapp?: boolean;
}

export interface LegalConfig {
  companyName: string;
  cnpj: string;
  dpoEmail: string;
  services?: {
    turnstile?: boolean;
    plausible?: boolean;
    googleAnalytics?: boolean;
  };
}

export interface SocialLinks {
  instagram?: string;
  linkedin?: string;
  facebook?: string;
  github?: string;
}

export interface SiteConfig {
  name: string;
  slogan: string;
  description: string;
  url: string;
  ogImage: string;
  nav: readonly NavItem[];
  contact: ContactConfig;
  legal: LegalConfig;
  social: SocialLinks;
}

/**
 * ⚠️ DEMO PLACEHOLDER VALUES:
 * The data below represents sample corporate information used for development,
 * testing, and layout demonstration. All values (especially corporate name, CNPJ,
 * address, contact channels, and DPO email) MUST be replaced with verified, real client
 * data before production deployment (see docs/07-client-onboarding-checklist.md).
 */
export const siteConfig: SiteConfig = {
  name: "Empresa Exemplo",
  slogan: "Soluções corporativas modernas, ágeis e de alta performance.",
  description:
    "Website institucional moderno, acessível e de alta performance com arquitetura serverless.",
  url: "https://www.empresaexemplo.com.br",
  ogImage: "https://www.empresaexemplo.com.br/og.jpg",
  nav: [
    { title: "Início", href: "#" },
    { title: "Serviços", href: "#servicos" },
    { title: "Sobre", href: "#sobre" },
    { title: "Contato", href: "#contato" },
  ],
  contact: {
    email: "contato@empresaexemplo.com.br",
    phone: "(11) 99999-9999",
    whatsapp: "5511999999999",
    address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
    showFloatingWhatsapp: true,
  },
  legal: {
    companyName: "Empresa Exemplo Ltda",
    cnpj: "00.000.000/0001-00",
    dpoEmail: "privacidade@empresaexemplo.com.br",
    services: {
      turnstile: true,
      plausible: false,
      googleAnalytics: false,
    },
  },
  social: {
    instagram: "https://instagram.com/empresaexemplo",
    linkedin: "https://linkedin.com/company/empresaexemplo",
  },
} as const;

