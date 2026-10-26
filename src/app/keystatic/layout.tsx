import type { ReactNode } from "react";

export default function KeystaticLayout({ children }: { children: ReactNode }) {
  return (
    <div className="keystatic-admin-root relative min-h-screen w-full [&~a]:hidden">{children}</div>
  );
}
