import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";

// Module-level reference to the active Lenis instance for immediate external access
let activeLenisInstance: any = null;

export function scrollToTop() {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  if (activeLenisInstance) {
    try {
      activeLenisInstance.scrollTo(0, { immediate: true, force: true });
    } catch {
      // ignore
    }
  }
}

/** Global Lenis + GSAP momentum scrolling for every route with seamless route scroll reset. */
export function SmoothScroll() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.searchStr });
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Never on native.
    //
    // Lenis + GSAP is 88 KB that hijacks the scroll wheel to add momentum a
    // desktop browser lacks. A phone webview already has momentum scrolling in
    // the compositor, running off the main thread — so on native this library
    // is not an enhancement, it is a second scroll implementation competing
    // with the first, on the main thread, and it is a large part of why the
    // app felt laggy next to the website.
    //
    // Checked via the global rather than importing native-bridge, so this
    // component stays free of Capacitor imports and the web bundle is
    // unchanged.
    const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } })
      .Capacitor;
    if (cap?.isNativePlatform?.()) return;

    // Both libraries are dynamically imported, so their types come from the
    // import itself rather than a top-level import that would defeat the split.
    let onTickFn: ((time: number) => void) | null = null;
    let gsapModule: typeof import("gsap").gsap | null = null;

    Promise.all([import("lenis"), import("gsap")])
      .then(([{ default: Lenis }, { gsap }]) => {
        try {
          gsapModule = gsap;
          const instance = new Lenis({
            autoRaf: false,
            lerp: 0.085,
            duration: 1.15,
            smoothWheel: true,
            wheelMultiplier: 0.9,
          });

          lenisRef.current = instance;
          activeLenisInstance = instance;

          onTickFn = (time: number) => {
            if (lenisRef.current) {
              try {
                lenisRef.current.raf(time * 1000);
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
      if (lenisRef.current) {
        try {
          lenisRef.current.destroy();
        } catch {
          // Already torn down by a prior unmount; nothing to clean up.
        }
        if (activeLenisInstance === lenisRef.current) {
          activeLenisInstance = null;
        }
        lenisRef.current = null;
      }
    };
  }, []);

  // Guarantee every route navigation instantly opens at top: 0
  useEffect(() => {
    scrollToTop();
    const t1 = setTimeout(scrollToTop, 20);
    const t2 = setTimeout(scrollToTop, 100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname, search]);

  return null;
}
