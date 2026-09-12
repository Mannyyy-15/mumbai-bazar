/**
 * Push notifications for the native apps.
 *
 * Why this exists
 * ---------------
 * Two reasons, and the second is the commercial one:
 *
 * 1. Order and arrival updates are genuinely useful to a saree customer —
 *    "your order has shipped", "new bridal range in at Nalasopara".
 * 2. Apple Guideline 4.2 rejects apps that are a repackaged website. This app
 *    loads mumbaibazar.com in a webview, so it needs capability the website
 *    cannot have. Push is the strongest single answer to that, and unlike a
 *    gimmick it is something the shop will actually use.
 *
 * What it needs to work
 * ---------------------
 * Android delivery runs on Firebase Cloud Messaging, which needs
 * `android/app/google-services.json` from the Firebase console. That file is
 * NOT in the repo (it is per-project and the client has to create it).
 *
 * Everything here is written to degrade quietly without it: no permission
 * prompt, no registration attempt, no crash — the app simply runs without push.
 * See MOBILE_RELEASE.md for the setup steps.
 *
 * On the web this module is inert. Every export is safe to call from shared
 * code that also runs in a browser.
 */

import { Preferences } from "@capacitor/preferences";

import { isNative } from "./native-bridge";

/** Where the FCM token is cached, so we only report a genuinely new one. */
const TOKEN_KEY = "mb_push_token";

/** Whether the customer has been asked for permission yet. */
const ASKED_KEY = "mb_push_asked";

/**
 * Endpoint that receives the device token.
 *
 * EMPTY UNTIL A BACKEND EXISTS. While empty, tokens are stored on the device
 * and nothing is transmitted — the app still receives pushes sent from the
 * Firebase console to a topic, which is how the shop will send broadcasts
 * without any backend at all. Fill this in only when there is something to
 * receive it.
 */
const TOKEN_ENDPOINT = "";

/** Topic every install subscribes to, for shop-wide broadcasts. */
export const BROADCAST_TOPIC = "all-customers";

export type PushStatus =
  | "unsupported" // web, or a native build without Firebase configured
  | "denied" // customer said no
  | "granted" // registered and listening
  | "pending"; // not asked yet

let status: PushStatus = "unsupported";
let initialised = false;

export function getPushStatus(): PushStatus {
  return status;
}

/**
 * True when push can actually work: a native build whose plugin is present.
 *
 * A missing google-services.json does NOT fail here — it fails later, inside
 * register(), which is why registrationError is handled rather than assumed
 * away.
 */
async function pushAvailable(): Promise<boolean> {
  if (!isNative) return false;
  try {
    const { PushNotifications } = await import("@capacitor/push-notifications");
    return Boolean(PushNotifications);
  } catch {
    return false;
  }
}

/**
 * Ask for permission and register.
 *
 * Deliberately NOT called on first launch. An app that demands notification
 * permission before showing anything gets denied, and on iOS a denial is close
 * to permanent — the customer has to go into Settings to undo it. Call this
 * after the customer has done something that implies interest: placed an order,
 * saved to wishlist, or tapped an explicit "notify me" control.
 */
export async function requestPushPermission(): Promise<PushStatus> {
  if (!(await pushAvailable())) {
    status = "unsupported";
    return status;
  }

  try {
    const { PushNotifications } = await import("@capacitor/push-notifications");

    let perm = await PushNotifications.checkPermissions();
    if (perm.receive === "prompt" || perm.receive === "prompt-with-rationale") {
      perm = await PushNotifications.requestPermissions();
      await Preferences.set({ key: ASKED_KEY, value: "1" });
    }

    if (perm.receive !== "granted") {
      status = "denied";
      return status;
    }

    await PushNotifications.register();
    status = "granted";
    return status;
  } catch (err) {
    // Almost always a missing google-services.json. Warn, do not throw: push is
    // an enhancement and must never take the shop app down with it.
    console.warn("[push] registration failed (Firebase configured?):", err);
    status = "unsupported";
    return status;
  }
}

/** Has the customer already been asked? Used to avoid re-prompting. */
export async function hasBeenAsked(): Promise<boolean> {
  if (!isNative) return false;
  try {
    const { value } = await Preferences.get({ key: ASKED_KEY });
    return value === "1";
  } catch {
    return false;
  }
}

/**
 * Sends the device token to our backend, if there is one.
 *
 * Skipped entirely while TOKEN_ENDPOINT is empty. Broadcasts still work in that
 * case because every device subscribes to BROADCAST_TOPIC, and the Firebase
 * console can send to a topic without knowing any individual token — which is
 * all the shop needs for "new arrivals" style messages.
 */
async function reportToken(token: string): Promise<void> {
  try {
    const { value: cached } = await Preferences.get({ key: TOKEN_KEY });
    if (cached === token) return; // unchanged, nothing to do

    await Preferences.set({ key: TOKEN_KEY, value: token });

    if (!TOKEN_ENDPOINT) return;

    await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, platform: "android" }),
    });
  } catch (err) {
    console.warn("[push] could not report token:", err);
  }
}

/**
 * Wires up the push listeners. Safe to call on every platform and more than
 * once; it is a no-op off-native and after the first call.
 *
 * This only ATTACHES listeners — it does not prompt. Prompting is
 * requestPushPermission(), called at a moment that makes sense to the customer.
 */
export async function initializePush(): Promise<void> {
  if (initialised || !(await pushAvailable())) return;
  initialised = true;

  try {
    const { PushNotifications } = await import("@capacitor/push-notifications");

    await PushNotifications.addListener("registration", (token) => {
      void reportToken(token.value);
    });

    await PushNotifications.addListener("registrationError", (err) => {
      // The expected path when google-services.json is absent.
      console.warn("[push] registration error:", err);
      status = "unsupported";
    });

    // Delivered while the app is open. Android does not show a system banner in
    // this case, so anything user-visible has to be handled in-app.
    await PushNotifications.addListener("pushNotificationReceived", (notification) => {
      console.info("[push] received in foreground:", notification.title);
    });

    // The customer tapped the notification. If it carries a path, honour it —
    // this is what makes "your order shipped" land on the order, not the home
    // page. Only same-origin paths are followed, so a malicious payload cannot
    // redirect the app off-site.
    await PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
      const path = action.notification?.data?.path;
      if (typeof path === "string" && path.startsWith("/") && !path.startsWith("//")) {
        window.location.assign(path);
      }
    });

    // Re-register silently if permission was granted in an earlier session, so
    // the token stays fresh without prompting again.
    const perm = await PushNotifications.checkPermissions();
    if (perm.receive === "granted") {
      await PushNotifications.register();
      status = "granted";
    } else if (perm.receive === "denied") {
      status = "denied";
    } else {
      status = "pending";
    }
  } catch (err) {
    console.warn("[push] initialisation skipped:", err);
    status = "unsupported";
  }
}
