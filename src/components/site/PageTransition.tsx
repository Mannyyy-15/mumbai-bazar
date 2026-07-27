import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [displayLocation, setDisplayLocation] = useState(pathname);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (pathname !== displayLocation) {
      setDisplayLocation(pathname);
      setAnimating(true);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
      const timer = setTimeout(() => setAnimating(false), 350);
      return () => clearTimeout(timer);
    }
  }, [pathname, displayLocation]);

  return (
    <div
      key={displayLocation}
      className={`w-full transition-all duration-300 ease-out ${
        animating ? "opacity-40 translate-y-2" : "opacity-100 translate-y-0"
      }`}
    >
      {children}
    </div>
  );
}
