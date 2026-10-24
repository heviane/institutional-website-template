import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Institutional Website Template",
  description:
    "Modern institutional website template built with Next.js 16 and Tailwind CSS v4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactNode {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        {children}
      </body>
    </html>
  );
}

