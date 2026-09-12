import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { App as CapApp } from "@capacitor/app";

/**
 * Indicates if the application is running inside a native iOS or Android Capacitor shell.
 */
export const isNative = Capacitor.isNativePlatform();

/**
 * Trigger subtle tactile feedback for interactive boutique commerce actions
 * (e.g. Shop Now, variant change, add-to-bag, quantity increment).
 */
export async function hapticImpact(style: "light" | "medium" | "heavy" = "light") {
  try {
    if (isNative) {
      const map = {
        light: ImpactStyle.Light,
        medium: ImpactStyle.Medium,
        heavy: ImpactStyle.Heavy,
      };
      await Haptics.impact({ style: map[style] });
    } else if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(style === "light" ? 10 : style === "medium" ? 25 : 40);
    }
  } catch {
    // Graceful fallback on devices where haptics are disabled
  }
}

/**
 * Trigger success notification vibration feedback (e.g. Added to Cart / Order confirmed).
 */
export async function hapticSuccess() {
  try {
    if (isNative) {
      await Haptics.notification({ type: NotificationType.Success });
    } else if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([15, 40, 20]);
    }
  } catch {
    // Graceful fallback
  }
}

/**
 * Registry of active modal / drawer back-button handlers.
 * Allows CartDrawer, WishlistDrawer, Mobile Menu, and Search overlays
 * to intercept Android's back button and close themselves first.
 */
type BackHandler = () => boolean;
const backHandlers: { priority: number; handler: BackHandler }[] = [];

export function registerBackHandler(priority: number, handler: BackHandler): () => void {
  const entry = { priority, handler };
  backHandlers.push(entry);
  backHandlers.sort((a, b) => b.priority - a.priority);

  return () => {
    const idx = backHandlers.indexOf(entry);
    if (idx !== -1) {
      backHandlers.splice(idx, 1);
    }
  };
}

/**
 * Safely opens external URLs (WhatsApp, Phone, Maps, Instagram) in the native system handler.
 */
export function openExternalUrl(url: string) {
  if (typeof window === "undefined") return;

  if (url.startsWith("tel:") || url.startsWith("mailto:")) {
    window.location.href = url;
    return;
  }

  // Open external protocol or site via system browser / application
  window.open(url, "_system");
}

let isInitialized = false;

/**
 * Initializes native mobile app capabilities (Status Bar, Back Button, Splash Screen, External Links).
 * Safe to call on all platforms; automatically acts as a no-op on regular web browsers.
 */
export async function initializeNativeApp() {
  if (!isNative || isInitialized) return;
  isInitialized = true;

  try {
    // 1. Configure Native Status Bar matching royal maroon brand palette
    await StatusBar.setStyle({ style: Style.Dark });
    if (Capacitor.getPlatform() === "android") {
      await StatusBar.setBackgroundColor({ color: "#9B1018" });
    }

    // 2. Hide Native Splash Screen smoothly once UI is mounted
    setTimeout(async () => {
      try {
        await SplashScreen.hide({ fadeOutDuration: 300 });
      } catch {
        // Ignored
      }
    }, 400);

    // 3. Android Hardware Back Button listener
    CapApp.addListener("backButton", ({ canGoBack }) => {
      // Check registered modal/drawer dismiss handlers first
      for (const item of backHandlers) {
        if (item.handler()) {
          return; // Handled (e.g. dismissed cart drawer or menu)
        }
      }

      // If no modal was open, navigate history or exit
      if (canGoBack && typeof window !== "undefined" && window.location.pathname !== "/") {
        window.history.back();
      } else {
        CapApp.exitApp();
      }
    });

    // 4. External link click listener to cleanly route WhatsApp, Maps, Instagram & Tel
    if (typeof document !== "undefined") {
      document.addEventListener(
        "click",
        (e) => {
          const target = (e.target as HTMLElement)?.closest("a");
          if (!target || !target.href) return;

          const href = target.getAttribute("href") || "";

          // Intercept tel: and mailto:.
          //
          // These were missing, even though openExternalUrl() already had a
          // branch for them that nothing reached. Inside a webview an
          // un-intercepted tel: link is handled inconsistently across Android
          // versions — sometimes the dialer opens, sometimes the navigation is
          // simply dropped. "Call the store" is the highest-intent tap in the
          // whole app for a physical saree shop, so it cannot be left to luck.
          if (href.startsWith("tel:") || href.startsWith("mailto:")) {
            e.preventDefault();
            openExternalUrl(href);
            return;
          }

          // Intercept WhatsApp links
          if (href.startsWith("https://wa.me/") || href.startsWith("whatsapp:")) {
            e.preventDefault();
            openExternalUrl(href);
            return;
          }

          // Intercept Google Maps links
          if (href.includes("maps.google.com") || href.includes("google.com/maps")) {
            e.preventDefault();
            openExternalUrl(href);
            return;
          }

          // Intercept Instagram profile/reels
          if (href.includes("instagram.com")) {
            e.preventDefault();
            openExternalUrl(href);
            return;
          }
        },
        { capture: true },
      );
    }

    // 5. Push notifications.
    //
    // Attaches listeners only — it does NOT prompt. Asking for notification
    // permission during launch is how you get denied, and on iOS a denial is
    // near-permanent (Settings-only to undo). The prompt belongs at a moment
    // that makes sense to the customer; see requestPushPermission().
    //
    // Loaded dynamically so the plugin never enters the website bundle.
    void import("./push-notifications")
      .then((m) => m.initializePush())
      .catch(() => undefined);

    // 6. Native shell update check.
    //
    // Web content updates itself (the app loads the live site), so this is only
    // about store releases. Deferred past first paint — nothing here is worth
    // delaying the shop for, and it self-throttles to once a day.
    setTimeout(() => {
      void import("./app-update")
        .then((m) => m.checkForUpdate())
        .then((info) => {
          if (info) {
            console.info(
              `[update] version ${info.latest} available (running ${info.current})` +
                `${info.required ? " — required" : ""}`,
            );
          }
        })
        .catch(() => undefined);
    }, 5000);
  } catch (err) {
    console.warn("Native bridge initialization error:", err);
  }
}
