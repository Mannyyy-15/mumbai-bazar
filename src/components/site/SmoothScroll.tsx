import { useEffect } from "react";

/** Global Lenis + GSAP momentum scrolling for every route. */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Both libraries are dynamically imported, so their types come from the
    // import itself rather than a top-level import that would defeat the split.
    let lenisInstance: InstanceType<typeof import("lenis").default> | null = null;
    let onTickFn: ((time: number) => void) | null = null;
    let gsapModule: typeof import("gsap").gsap | null = null;

    Promise.all([import("lenis"), import("gsap")])
      .then(([{ default: Lenis }, { gsap }]) => {
        try {
          gsapModule = gsap;
          lenisInstance = new Lenis({
            autoRaf: false,
            lerp: 0.085,
            duration: 1.15,
            smoothWheel: true,
            wheelMultiplier: 0.9,
          });

          onTickFn = (time: number) => {
            if (lenisInstance) {
              try {
                lenisInstance.raf(time * 1000);
              } catch {
                // A single dropped frame must never break the ticker loop.
              }
            }
          };

          gsap.ticker.add(onTickFn);
          gsap.ticker.lagSmoothing(0);
        } catch (err) {
          console.warn("SmoothScroll init skipped:", err);
        }
      })
      .catch(() => undefined);

    return () => {
      if (gsapModule && onTickFn) {
        gsapModule.ticker.remove(onTickFn);
      }
      if (lenisInstance) {
        try {
          lenisInstance.destroy();
        } catch {
          // Already torn down by a prior unmount; nothing to clean up.
        }
      }
    };
  }, []);

  return null;
}
