import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { MobileNav } from "./mobile-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="flex items-center space-x-2 font-bold text-xl tracking-tight text-foreground"
          >
            {siteConfig.name}
          </a>
          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Navegação principal"
          >
            {siteConfig.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground py-2"
              >
                {item.title}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="cta" size="sm">
              <a href="#contato">Fale Conosco</a>
            </Button>
          </div>
          <MobileNav items={siteConfig.nav} />
        </div>
      </div>
    </header>
  );
}

