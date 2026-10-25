"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
          <Button
            variant="ghost"
            size="icon"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[320px] sm:w-[380px]">
          <DialogHeader>
            <DialogTitle>{siteConfig.name}</DialogTitle>
          </DialogHeader>
          <nav className="flex flex-col gap-2 mt-4" aria-label="Navegação móvel">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center min-h-[44px] px-3 py-2 text-base font-medium text-foreground/80 hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                {item.title}
              </a>
            ))}
            <div className="pt-4 mt-2 border-t border-border">
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

