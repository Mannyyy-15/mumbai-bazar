import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [displayLocation, setDisplayLocation] = useState(pathname);

  useEffect(() => {
    if (pathname !== displayLocation) {
      setDisplayLocation(pathname);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    }
  }, [pathname, displayLocation]);

  return (
    <div key={displayLocation} className="w-full">
      {children}
    </div>
  );
}
