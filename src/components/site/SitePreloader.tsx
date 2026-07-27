import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/MB_logo_animation_white_background_202607271129.mp4";
const STATIC_LOGO = "/logo-main.png";
const SESSION_KEY = "mb_preloader_seen_v1";

/**
 * Creates a promise that resolves when critical initial page assets are loaded.
 */
function createSiteReadyPromise(): Promise<void> {
  return new Promise((resolve) => {
    let resolved = false;
    const safeResolve = () => {
      if (!resolved) {
        resolved = true;
        resolve();
      }
    };

    // Hard failsafe timeout (12s)
    const timeoutId = setTimeout(() => {
      console.warn("SitePreloader: Failsafe timeout reached (12s). Proceeding.");
      safeResolve();
    }, 12000);

    const checkReadyState = async () => {
      try {
        // 1. DOM Ready & Window Load
        if (document.readyState !== "complete") {
          await new Promise<void>((res) => window.addEventListener("load", () => res(), { once: true }));
        }

        // 2. Fonts Ready
        if ("fonts" in document) {
          await document.fonts.ready.catch(() => { });
        }

        // 3. Essential non-lazy images
        const heroImages = Array.from(
          document.querySelectorAll<HTMLImageElement>("img:not([loading='lazy']), img[fetchpriority='high']")
        );
        await Promise.all(
          heroImages.map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise<void>((res) => {
              img.onload = () => res();
              img.onerror = () => res();
            });
          })
        );
      } catch (e) {
        console.error("SitePreloader readiness check error:", e);
      } finally {
        clearTimeout(timeoutId);
        safeResolve();
      }
    };

    checkReadyState();
  });
}

export function SitePreloader() {
  const [shouldRender, setShouldRender] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [showStaticFallback, setShowStaticFallback] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const targetRateRef = useRef(1.0);
  const currentRateRef = useRef(1.0);
  const siteReadyRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // 1. Check Session Storage
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY)) {
      setShouldRender(false);
      return;
    }

    // 2. Lock Scrolling & Hide Page from screen readers
    document.body.style.overflow = "hidden";
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.setAttribute("aria-hidden", "true");
    }

    // 3. Reduced Motion Check
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setIsReducedMotion(true);
      createSiteReadyPromise().then(() => {
        setTimeout(() => exitPreloader(200), 200);
      });
      return;
    }

    // 4. Start readiness check promise
    createSiteReadyPromise().then(() => {
      siteReadyRef.current = true;
    });

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Exit helper
  const exitPreloader = (fadeDuration = 400) => {
    setOpacity(0);
    setTimeout(() => {
      setShouldRender(false);
      document.body.style.overflow = "";
      const mainContent = document.getElementById("main-content");
      if (mainContent) {
        mainContent.removeAttribute("aria-hidden");
      }
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch (_) { }
    }, fadeDuration);
  };

  // Video loop & playback rate interpolation logic
  useEffect(() => {
    if (!shouldRender || isReducedMotion) return;

    const video = videoRef.current;
    if (!video) return;

    let isExiting = false;

    // Smooth playbackRate interpolation loop
    const updateLoop = () => {
      if (isExiting) return;

      const v = videoRef.current;
      if (!v) return;

      const currentTime = v.currentTime;
      const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
      const isSiteReady = siteReadyRef.current;

      // Determine target speed based on load status & time
      if (isSiteReady) {
        if (currentTime < 2.5) {
          // FAST LOAD
          targetRateRef.current = 1.85;
        } else if (currentTime < 6.5) {
          // NORMAL LOAD
          targetRateRef.current = 1.35;
        } else {
          targetRateRef.current = 1.0;
        }
      } else {
        // SLOW LOAD: site not ready yet
        if (currentTime >= 7.5 && !v.paused) {
          v.pause(); // Pause at clean logo frame
        }
        targetRateRef.current = 1.0;
      }

      // Resume if site became ready after pause
      if (isSiteReady && v.paused && currentTime >= 7.5) {
        // Site ready after pausing on logo
        isExiting = true;
        setTimeout(() => exitPreloader(400), 200);
        return;
      }

      // Smooth playback rate easing
      if (Math.abs(currentRateRef.current - targetRateRef.current) > 0.02) {
        currentRateRef.current += (targetRateRef.current - currentRateRef.current) * 0.1;
        v.playbackRate = Math.min(2.0, Math.max(1.0, currentRateRef.current));
      }

      // Check for completion window (~6.8s to 7.3s) when site is ready
      if (isSiteReady && currentTime >= 6.8 && !isExiting) {
        // Enforce min total display time of 3.0s for smooth visual experience
        const minTimeRemaining = Math.max(0, 3200 - elapsedTime * 1000);
        isExiting = true;
        setTimeout(() => {
          v.pause();
          exitPreloader(400);
        }, Math.max(300, minTimeRemaining));
        return;
      }

      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [shouldRender, isReducedMotion]);

  if (!shouldRender) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100dvh",
        backgroundColor: "#ffffff",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: opacity,
        transition: `opacity ${isReducedMotion ? 200 : 400}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        pointerEvents: opacity === 0 ? "none" : "auto",
      }}
    >
      {isReducedMotion || showStaticFallback ? (
        <img
          src={STATIC_LOGO}
          alt="Mumbai Bazar Logo"
          className="max-h-[160px] max-w-[80vw] object-contain"
        />
      ) : (
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          autoPlay
          muted
          playsInline
          preload="auto"
          onError={() => setShowStaticFallback(true)}
          className="h-full w-full max-w-[1280px] max-h-[720px] object-contain object-center"
        />
      )}
    </div>
  );
}
