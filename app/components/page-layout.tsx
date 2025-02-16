import type { PropsWithChildren, ReactNode } from "react";

export function PageLayout({ children }: PropsWithChildren): ReactNode {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex min-h-0 flex-1 flex-col items-center gap-16">
        <div className="w-full max-w-[300px] space-y-6 px-4">{children}</div>
      </div>
    </main>
  );
}
