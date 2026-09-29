/**
 * Native-app detection for the site the Capacitor shell loads.
 *
 * How this works, and why there are no Capacitor imports here
 * -----------------------------------------------------------
 * The Android/iOS apps are a Capacitor shell pointing at this site over the
 * network. The plugins (haptics, status bar, push) live in the SHELL's bundle,
 * not here — so this file must never import `@capacitor/*`, or the website
 * would try to pull packages it does not have.
 *
 * What it does instead is detect the shell at runtime, via the `Capacitor`
 * global the shell injects into the webview, and mark the document. Everything
 * under `.native-app` in app.css then applies: page transitions, no text
 * selection, no tap highlight, no overscroll bounce, hidden announcement bar.
 *
 * `initializeNativeApp()` was an empty function after the Hydrogen port, which
 * silently killed every app-only behaviour — the apps went back to looking and
 * feeling like a website in a frame.
 *
 * Haptics fall back to the Vibration API, which the webview does support.
 */

type CapacitorGlobal = {
  isNativePlatform?: () => boolean;
  getPlatform?: () => string;
  Plugins?: Record<string, unknown>;
};

function capacitor(): CapacitorGlobal | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor;
}

/**
 * True when this page is running inside the Capacitor shell.
 *
 * A function rather than a const: this module is evaluated during SSR, where
 * `window` does not exist — a const captured there would stay false on the
 * client forever.
 */
export function isNativeApp(): boolean {
  return Boolean(capacitor()?.isNativePlatform?.());
}

/** Kept for call sites that read it as a value. Always false during SSR. */
export const isNative = false;

/**
 * Subtle tactile feedback on interactive commerce actions.
 *
 * Uses the shell's Haptics plugin when present, and the Vibration API
 * otherwise. Wrapped because iOS Safari has no vibrate() and some Android
 * builds throw when system haptics are disabled.
 */
export async function hapticImpact(style: "light" | "medium" | "heavy" = "light") {
  try {
    const plugins = capacitor()?.Plugins as
      | { Haptics?: { impact?: (o: { style: string }) => Promise<void> } }
      | undefined;

    if (plugins?.Haptics?.impact) {
      await plugins.Haptics.impact({ style: style.toUpperCase() });
      return;
    }

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(style === "light" ? 10 : style === "medium" ? 25 : 40);
    }
  } catch {
    // Haptics are a nicety. Never let them break an add-to-cart.
  }
}

/** Success pattern, e.g. added to cart or order confirmed. */
export async function hapticSuccess() {
  try {
    const plugins = capacitor()?.Plugins as
      | { Haptics?: { notification?: (o: { type: string }) => Promise<void> } }
      | undefined;

    if (plugins?.Haptics?.notification) {
      await plugins.Haptics.notification({ type: "SUCCESS" });
      return;
    }

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([15, 40, 20]);
    }
  } catch {
    // Ignored.
  }
}

/**
 * Registry of modal/drawer handlers for the Android hardware back button.
 *
 * The shell owns the actual `backButton` listener; drawers register here so a
 * back press closes the open drawer before navigating. Highest priority first.
 */
type BackHandler = () => boolean;
const backHandlers: { priority: number; handler: BackHandler }[] = [];

export function registerBackHandler(priority: number, handler: BackHandler): () => void {
  const entry = { priority, handler };
  backHandlers.push(entry);
  backHandlers.sort((a, b) => b.priority - a.priority);

  return () => {
    const idx = backHandlers.indexOf(entry);
    if (idx !== -1) backHandlers.splice(idx, 1);
  };
}

/** Runs registered handlers; true means one of them consumed the press. */
export function runBackHandlers(): boolean {
  for (const item of backHandlers) {
    if (item.handler()) return true;
  }
  return false;
}

/** Opens tel:, mailto: and external links through the system handler. */
export function openExternalUrl(url: string) {
  if (typeof window === "undefined") return;
  if (url.startsWith("tel:") || url.startsWith("mailto:")) {
    window.location.href = url;
    return;
  }
  window.open(url, "_system");
}

let initialised = false;

/**
 * Marks the document as running in the app and wires the app-only behaviours.
 *
 * Safe on every platform and idempotent: a no-op in a normal browser and after
 * the first call.
 */
export function initializeNativeApp() {
  if (initialised || typeof document === "undefined") return;
  if (!isNativeApp()) return;
  initialised = true;

  // Everything under `.native-app` in app.css keys off this.
  document.documentElement.classList.add("native-app");

  /**
   * Route tel:, WhatsApp, Maps and Instagram through the system handler.
   *
   * Inside a webview these are handled inconsistently — sometimes the dialer
   * opens, sometimes the navigation is silently dropped. "Call the store" is
   * the highest-intent tap in the app for a shop with eight branches, so it
   * cannot be left to chance.
   */
  document.addEventListener(
    "click",
    (e) => {
      const anchor = (e.target as HTMLElement)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (!href) return;

      const external =
        href.startsWith("tel:") ||
        href.startsWith("mailto:") ||
        href.startsWith("whatsapp:") ||
        href.startsWith("https://wa.me/") ||
        href.includes("maps.google.com") ||
        href.includes("google.com/maps") ||
        href.includes("instagram.com");

      if (external) {
        e.preventDefault();
        openExternalUrl(href);
      }
    },
    { capture: true },
  );
}
