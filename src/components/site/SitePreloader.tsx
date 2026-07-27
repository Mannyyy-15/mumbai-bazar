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
  const siteReadyRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // 1. Lock Scrolling & Hide Page from screen readers on mount
    document.body.style.overflow = "hidden";
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.setAttribute("aria-hidden", "true");
    }

    // 2. Reduced Motion Check
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setIsReducedMotion(true);
      createSiteReadyPromise().then(() => {
        setTimeout(() => exitPreloader(200), 200);
      });
      return;
    }

    // 3. Start readiness check promise
    createSiteReadyPromise().then(() => {
      siteReadyRef.current = true;
    });

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Exit helper
  const exitPreloader = (fadeDuration = 350) => {
    setOpacity(0);
    setTimeout(() => {
      setShouldRender(false);
      document.body.style.overflow = "";
      const mainContent = document.getElementById("main-content");
      if (mainContent) {
        mainContent.removeAttribute("aria-hidden");
      }
    }, fadeDuration);
  };

  // Video playback logic starting at 5.0 seconds at 2.0x speed
  useEffect(() => {
    if (!shouldRender || isReducedMotion) return;

    const video = videoRef.current;
    if (!video) return;

    let isExiting = false;

    // Fast-forward video to 5.0s and set 2x playback speed
    const initVideo = () => {
      if (video.currentTime < 5.0) {
        video.currentTime = 5.0;
      }
      video.playbackRate = 2.0;
    };

    if (video.readyState >= 1) {
      initVideo();
    } else {
      video.addEventListener("loadedmetadata", initVideo, { once: true });
    }

    const updateLoop = () => {
      if (isExiting) return;

      const v = videoRef.current;
      if (!v) return;

      const currentTime = v.currentTime;
      const duration = v.duration || 10;
      const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
      const isSiteReady = siteReadyRef.current;

      // Ensure we stay at or after 5.0 seconds
      if (currentTime < 5.0 && !v.paused) {
        v.currentTime = 5.0;
      }

      // Check loop or completion window
      const clipEnded = currentTime >= duration - 0.2 || v.ended;
      const minPlayTimeReached = elapsedTime >= 2.0;

      if (isSiteReady && minPlayTimeReached && !isExiting) {
        isExiting = true;
        exitPreloader(350);
        return;
      }

      // If video ends before site is ready, loop back to 5.0s
      if (clipEnded) {
        if (isSiteReady) {
          isExiting = true;
          exitPreloader(350);
          return;
        } else {
          v.currentTime = 5.0;
          v.play().catch(() => undefined);
        }
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
        transition: `opacity ${isReducedMotion ? 200 : 350}ms cubic-bezier(0.4, 0, 0.2, 1)`,
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
          onPlay={() => {
            if (videoRef.current && videoRef.current.currentTime < 5.0) {
              videoRef.current.currentTime = 5.0;
              videoRef.current.playbackRate = 2.0;
            }
          }}
          onError={() => setShowStaticFallback(true)}
          className="h-full w-full max-w-[1280px] max-h-[720px] object-contain object-center"
        />
      )}
    </div>
  );
}
