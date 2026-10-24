import type { ReactNode } from "react";

export default function HomePage(): ReactNode {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Institutional Website Template
        </h1>
        <p className="text-muted-foreground text-lg">
          Next.js 16 • Tailwind CSS v4 • TypeScript
        </p>
      </div>
    </main>
  );
}

