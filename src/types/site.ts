export interface NavItem {
  readonly title: string;
  readonly href: string;
}

export interface ContactConfig {
  readonly email: string;
  readonly phone: string;
  readonly whatsapp: string;
  readonly address: string;
  readonly showFloatingWhatsapp?: boolean;
}

export interface LegalServicesConfig {
  readonly turnstile?: boolean;
  readonly plausible?: boolean;
  readonly googleAnalytics?: boolean;
}

export interface LegalConfig {
  readonly companyName: string;
  readonly cnpj: string;
  readonly dpoEmail: string;
  readonly services?: LegalServicesConfig;
}

export interface SocialLinks {
  readonly instagram?: string;
  readonly linkedin?: string;
  readonly facebook?: string;
  readonly github?: string;
}

export interface SiteConfig {
  readonly name: string;
  readonly slogan: string;
  readonly description: string;
  readonly url: string;
  readonly ogImage: string;
  readonly nav: readonly NavItem[];
  readonly contact: ContactConfig;
  readonly legal: LegalConfig;
  readonly social: SocialLinks;
}
