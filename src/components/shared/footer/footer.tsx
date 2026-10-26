import Link from "next/link";
import { siteConfig } from "@/config/site";
import { formatTelUrl } from "@/lib/utils";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border bg-muted/30 border-t pb-20 sm:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand & Slogan */}
          <div className="space-y-4 md:col-span-1">
            <h3 className="text-foreground text-lg font-bold">{siteConfig.name}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{siteConfig.slogan}</p>
          </div>

          {/* Quick Links Navigation */}
          <div className="space-y-4">
            <h4 className="text-foreground text-sm font-semibold tracking-wider uppercase">
              Navegação
            </h4>
            <nav className="flex flex-col space-y-2" aria-label="Links do rodapé">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Channels */}
          <div className="space-y-4">
            <h4 className="text-foreground text-sm font-semibold tracking-wider uppercase">
              Contato
            </h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
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
              <li className="text-xs leading-relaxed">{siteConfig.contact.address}</li>
            </ul>
          </div>

          {/* Legal Compliance & Transparency */}
          <div className="space-y-4">
            <h4 className="text-foreground text-sm font-semibold tracking-wider uppercase">
              Dados Legais
            </h4>
            <div className="text-muted-foreground space-y-1 text-sm">
              <p className="text-foreground font-medium">{siteConfig.legal.companyName}</p>
              <p>CNPJ: {siteConfig.legal.cnpj}</p>
              <p className="text-xs">
                DPO / Privacidade:{" "}
                <a href={`mailto:${siteConfig.legal.dpoEmail}`} className="hover:underline">
                  {siteConfig.legal.dpoEmail}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar / Copyright */}
        <div className="border-border text-muted-foreground mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-xs sm:flex-row">
          <p>
            &copy; {currentYear} {siteConfig.legal.companyName}. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link
              href="/politica-de-privacidade"
              className="hover:text-foreground transition-colors"
            >
              Política de Privacidade
            </Link>
            <Link href="/termos-de-uso" className="hover:text-foreground transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
