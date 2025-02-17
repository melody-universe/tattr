import type { PropsWithChildren, ReactNode } from "react";

export function Card({ children }: PropsWithChildren): ReactNode {
  return (
    <section className="flex flex-col items-baseline space-y-4 rounded-3xl border border-violet-400 p-6 dark:border-violet-700">
      {children}
    </section>
  );
}
