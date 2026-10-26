import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { MobileNav } from "./mobile-nav";

export function Header() {
  return (
    <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-foreground flex items-center space-x-2 text-xl font-bold tracking-tight"
          >
            {siteConfig.name}
          </Link>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Navegação principal">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground py-2 text-sm font-medium transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 md:flex">
            <Button asChild variant="cta" size="sm">
              <Link href="/#contato">Fale Conosco</Link>
            </Button>
          </div>
          <MobileNav items={siteConfig.nav} />
        </div>
      </div>
    </header>
  );
}
