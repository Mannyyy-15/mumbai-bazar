import { createFileRoute } from "@tanstack/react-router";

/**
 * Version manifest the native apps poll to learn a store release exists.
 *
 * Web content updates on its own — the apps load mumbaibazar.com, so a deploy
 * reaches every install immediately. This file is only about the NATIVE shell:
 * plugins, permissions, targetSdk, splash screen. Those need a store release,
 * and this is how an old install finds out.
 *
 * Bump `version` here in the same commit that ships a new build to the stores.
 * Leave `minimum` alone unless an old build is genuinely broken or unsafe —
 * raising it forces a blocking prompt that the customer cannot dismiss.
 */
const VERSIONS = {
  android: {
    /** Latest versionName published to Google Play. */
    version: "1.0.0",
    /** Oldest version still allowed to run. Raise only to force an upgrade. */
    minimum: "1.0.0",
    notes: "",
  },
  ios: {
    version: "1.0.0",
    minimum: "1.0.0",
    notes: "",
  },
} as const;

export const Route = createFileRoute("/app-version.json")({
  server: {
    handlers: {
      GET: () =>
        new Response(JSON.stringify(VERSIONS, null, 2), {
          headers: {
            "content-type": "application/json; charset=utf-8",
            // Short cache. A long-lived CDN copy would keep announcing a
            // version that is no longer current, and the client also sends
            // cache: no-store for the same reason.
            "cache-control": "public, max-age=300",
          },
        }),
    },
  },
});
