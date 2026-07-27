import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [displayLocation, setDisplayLocation] = useState(pathname);
  const [transitionStage, setTransitionStage] = useState<"enter" | "idle">("enter");

  useEffect(() => {
    if (pathname !== displayLocation) {
      setDisplayLocation(pathname);
      setTransitionStage("enter");
      // Reset scroll position to top on route change
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      const timer = setTimeout(() => setTransitionStage("idle"), 400);
      return () => clearTimeout(timer);
    }
  }, [pathname, displayLocation]);

  return (
    <div
      key={displayLocation}
      className={`w-full transition-all duration-500 cubic-bezier(0.22, 1, 0.36, 1) ${
        transitionStage === "enter"
          ? "opacity-0 translate-y-3 scale-[0.995]"
          : "opacity-100 translate-y-0 scale-100"
      }`}
    >
      {children}
    </div>
  );
}
