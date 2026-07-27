import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

export function ScrollReveal() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let observer: IntersectionObserver | null = null;
    const raf = requestAnimationFrame(() => {
      const observerCallback: IntersectionObserverCallback = (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      };

      observer = new IntersectionObserver(observerCallback, {
        root: null,
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.05,
      });

      const elements = document.querySelectorAll(
        "section, .reveal-on-scroll, [data-reveal]"
      );

      elements.forEach((el) => {
        if (!el.classList.contains("is-visible")) {
          el.classList.add("reveal-init");
          observer?.observe(el);
        }
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      if (observer) observer.disconnect();
    };
  }, [pathname]);

  return null;
}
