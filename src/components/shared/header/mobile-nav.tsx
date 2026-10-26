"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { siteConfig, type NavItem } from "@/config/site";
import { formatWhatsAppUrl } from "@/lib/utils";

interface MobileNavProps {
  items: readonly NavItem[];
}

export function MobileNav({ items }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Abrir menu de navegação">
            <Menu className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[320px] sm:w-[380px]">
          <DialogHeader>
            <DialogTitle>{siteConfig.name}</DialogTitle>
            <DialogDescription className="sr-only">Navegação institucional móvel</DialogDescription>
          </DialogHeader>
          <nav className="mt-4 flex flex-col gap-2" aria-label="Navegação móvel">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-foreground/80 hover:text-foreground hover:bg-accent flex min-h-[44px] items-center rounded-md px-3 py-2 text-base font-medium transition-colors"
              >
                {item.title}
              </Link>
            ))}
            <div className="border-border mt-2 border-t pt-4">
              <Button asChild variant="whatsapp" className="w-full">
                <a
                  href={formatWhatsAppUrl(siteConfig.contact.whatsapp)}
                  onClick={() => setIsOpen(false)}
                >
                  Falar no WhatsApp
                </a>
              </Button>
            </div>
          </nav>
        </DialogContent>
      </Dialog>
    </div>
  );
}
