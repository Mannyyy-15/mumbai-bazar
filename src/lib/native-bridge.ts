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
 * Initializes native mobile app capabilities (Status Bar, Back Button, Splash Screen).
 * Safe to call on all platforms; automatically acts as a no-op on regular web browsers.
 */
export async function initializeNativeApp(options?: {
  onHardwareBack?: () => boolean; // return true if handled (e.g. closed a drawer), false to proceed with history back
}) {
  if (!isNative) return;

  try {
    // 1. Configure Native Status Bar
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
      if (options?.onHardwareBack && options.onHardwareBack()) {
        return;
      }
      if (canGoBack) {
        window.history.back();
      } else {
        CapApp.exitApp();
      }
    });
  } catch (err) {
    console.warn("Native bridge initialization error:", err);
  }
}
