/**
 * App update checking for the native shells.
 *
 * How updates actually work here
 * ------------------------------
 * This is a remote-URL Capacitor app: the shell loads mumbaibazar.com, so all
 * web content — prices, products, copy, layout — updates the moment the site
 * deploys. No store release, no user action. That covers the overwhelming
 * majority of changes.
 *
 * What does NOT update that way is the native shell itself: plugins, the
 * splash screen, permissions, targetSdk. Those need a new build on the store.
 * This module tells the customer when such a release exists.
 *
 * Why a hand-rolled check rather than Play In-App Updates
 * ------------------------------------------------------
 * Google's in-app update API requires the app to be installed BY Play. It does
 * nothing for a sideloaded APK, which is exactly how this app will be tested
 * before it is listed, so it would appear to work and silently do nothing.
 * A version endpoint on our own domain works in both cases, and it also covers
 * the App Store, where no equivalent API exists at all.
 *
 * Inert on the web.
 */

import { Preferences } from "@capacitor/preferences";

import { isNative } from "./native-bridge";

/** Remembers the version we last nagged about, so we ask once per release. */
const DISMISSED_KEY = "mb_update_dismissed";

/** Throttle: at most one check per day. */
const LAST_CHECK_KEY = "mb_update_checked_at";
const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;

export type UpdateInfo = {
  /** Latest version published to the stores. */
  latest: string;
  /** Version running on this device. */
  current: string;
  /** True when the store version is newer. */
  available: boolean;
  /** True when the old version should stop being used (e.g. a broken build). */
  required: boolean;
  notes?: string;
  storeUrl: string;
};

const PLAY_URL = "https://play.google.com/store/apps/details?id=com.mumbaibazar.store";
const APP_STORE_URL = "https://apps.apple.com/app/mumbai-bazar/id0000000000";

/**
 * Compares dotted version strings numerically.
 *
 * A string compare gets this wrong in a way that matters: "1.10.0" < "1.9.0"
 * lexically, so the tenth release would stop offering updates.
 * Returns >0 when `a` is newer.
 */
export function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map((n) => parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/** The running app's version, from the native package metadata. */
async function currentVersion(): Promise<string | null> {
  if (!isNative) return null;
  try {
    const { App } = await import("@capacitor/app");
    const info = await App.getInfo();
    return info.version;
  } catch {
    return null;
  }
}

/**
 * Checks /app-version.json for a newer release.
 *
 * Returns null when there is nothing to say — not native, checked recently,
 * offline, endpoint missing, or already up to date. Callers only need to handle
 * the interesting case.
 */
export async function checkForUpdate(options?: { force?: boolean }): Promise<UpdateInfo | null> {
  if (!isNative) return null;

  const current = await currentVersion();
  if (!current) return null;

  try {
    if (!options?.force) {
      const { value: last } = await Preferences.get({ key: LAST_CHECK_KEY });
      if (last && Date.now() - Number(last) < CHECK_INTERVAL_MS) return null;
    }
    await Preferences.set({ key: LAST_CHECK_KEY, value: String(Date.now()) });

    const platform = (await import("@capacitor/core")).Capacitor.getPlatform();

    // cache: no-store — a CDN-cached copy of this file would keep announcing a
    // version that is no longer the latest.
    const res = await fetch("https://mumbaibazar.com/app-version.json", {
      cache: "no-store",
    });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      android?: { version?: string; minimum?: string; notes?: string };
      ios?: { version?: string; minimum?: string; notes?: string };
    };

    const entry = platform === "ios" ? data.ios : data.android;
    if (!entry?.version) return null;

    const available = compareVersions(entry.version, current) > 0;
    const required = Boolean(entry.minimum && compareVersions(entry.minimum, current) > 0);

    if (!available && !required) return null;

    // Respect a dismissal, but never for a required update.
    if (!required) {
      const { value: dismissed } = await Preferences.get({ key: DISMISSED_KEY });
      if (dismissed === entry.version) return null;
    }

    return {
      latest: entry.version,
      current,
      available,
      required,
      notes: entry.notes,
      storeUrl: platform === "ios" ? APP_STORE_URL : PLAY_URL,
    };
  } catch {
    // Offline, or the endpoint is not published yet. Silent by design: a failed
    // update check must never interrupt someone shopping.
    return null;
  }
}

/** Remembers that this version's prompt was dismissed. */
export async function dismissUpdate(version: string): Promise<void> {
  try {
    await Preferences.set({ key: DISMISSED_KEY, value: version });
  } catch {
    // Not worth surfacing.
  }
}

/** Opens the appropriate store listing. */
export async function openStoreListing(url: string): Promise<void> {
  try {
    const { AppLauncher } = await import("@capacitor/app-launcher");
    await AppLauncher.openUrl({ url });
  } catch {
    window.open(url, "_system");
  }
}
