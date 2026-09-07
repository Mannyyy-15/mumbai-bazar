import { useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div key={pathname} className="w-full">
      {children}
    </div>
  );
}
