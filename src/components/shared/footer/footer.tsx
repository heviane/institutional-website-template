import Link from "next/link";
import { siteConfig } from "@/config/site";
import { formatTelUrl } from "@/lib/utils";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30 pb-20 sm:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Slogan */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="text-lg font-bold text-foreground">
              {siteConfig.name}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {siteConfig.slogan}
            </p>
          </div>

          {/* Quick Links Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Navegação
            </h4>
            <nav className="flex flex-col space-y-2" aria-label="Links do rodapé">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Channels */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Contato
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href={formatTelUrl(siteConfig.contact.phone)}
                  className="hover:text-foreground transition-colors"
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-foreground transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="text-xs leading-relaxed">
                {siteConfig.contact.address}
              </li>
            </ul>
          </div>

          {/* Legal Compliance & Transparency */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Dados Legais
            </h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                {siteConfig.legal.companyName}
              </p>
              <p>CNPJ: {siteConfig.legal.cnpj}</p>
              <p className="text-xs">
                DPO / Privacidade:{" "}
                <a
                  href={`mailto:${siteConfig.legal.dpoEmail}`}
                  className="hover:underline"
                >
                  {siteConfig.legal.dpoEmail}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar / Copyright */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            &copy; {currentYear} {siteConfig.legal.companyName}. Todos os direitos
            reservados.
          </p>
          <div className="flex gap-4">
            <Link
              href="/politica-de-privacidade"
              className="hover:text-foreground transition-colors"
            >
              Política de Privacidade
            </Link>
            <Link
              href="/termos-de-uso"
              className="hover:text-foreground transition-colors"
            >
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

