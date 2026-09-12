import { createFileRoute } from "@tanstack/react-router";

import {
  ANDROID_APP_ID,
  ANDROID_CERT_FINGERPRINTS,
  androidLinksReady,
} from "@/lib/mobile-app";

/**
 * Digital Asset Links — proves to Android that mumbaibazar.com and the app are
 * the same owner, which is what makes `android:autoVerify="true"` succeed.
 *
 * Without this file Android's verification fails silently: no error anywhere,
 * links just keep opening in Chrome. The manifest has declared autoVerify since
 * the app was added, so App Links have never actually worked.
 *
 * Served as a route rather than a static file because Android requires
 * `Content-Type: application/json` over HTTPS with no redirects, and a route
 * gives us control of the header. It must stay reachable at exactly
 * /.well-known/assetlinks.json.
 */
function buildAssetLinks(): string {
  return JSON.stringify(
    [
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: ANDROID_APP_ID,
          sha256_cert_fingerprints: ANDROID_CERT_FINGERPRINTS,
        },
      },
    ],
    null,
    2,
  );
}

export const Route = createFileRoute("/.well-known/assetlinks.json")({
  server: {
    handlers: {
      GET: () => {
        // 404 until a real fingerprint exists. Publishing the file with an
        // empty fingerprint array is worse than not publishing it: Android
        // caches the failed verification, and the app then needs a reinstall
        // to re-verify even after the file is corrected.
        if (!androidLinksReady()) {
          return new Response("Not Found", {
            status: 404,
            headers: { "content-type": "text/plain; charset=utf-8" },
          });
        }

        return new Response(buildAssetLinks(), {
          headers: {
            "content-type": "application/json; charset=utf-8",
            // Short cache: this changes when a signing key is added, and a
            // stale copy blocks verification for everyone who installs next.
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
