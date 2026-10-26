import type { ReactNode } from "react";
import { Header } from "@/components/shared/header/header";
import { Footer } from "@/components/shared/footer/footer";

export default function LegalLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactNode {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

