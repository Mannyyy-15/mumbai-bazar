import { createFileRoute } from "@tanstack/react-router";

import {
  APPLE_TEAM_ID,
  IOS_BUNDLE_ID,
  DEEP_LINK_PATHS,
  appleLinksReady,
} from "@/lib/mobile-app";

/**
 * Apple App Site Association — the iOS counterpart to assetlinks.json, and what
 * makes Universal Links open in the app instead of Safari.
 *
 * Three rules Apple enforces that are easy to get wrong:
 *   - served from https://mumbaibazar.com/.well-known/apple-app-site-association
 *   - Content-Type: application/json
 *   - NO .json extension on the path, and no redirects
 * Hence the odd filename of this route.
 *
 * iOS fetches this through Apple's CDN when the app installs. A malformed or
 * placeholder copy gets cached there, so this 404s until the Team ID is real.
 */
function buildAasa(): string {
  const appId = `${APPLE_TEAM_ID}.${IOS_BUNDLE_ID}`;

  return JSON.stringify(
    {
      applinks: {
        // `details` uses the modern `components` form. `apps: []` and the old
        // `paths` array are legacy but harmless, and some tooling still checks
        // for them.
        details: [
          {
            appIDs: [appId],
            components: DEEP_LINK_PATHS.map((path) => ({
              "/": path,
              comment: `Open ${path} in the Mumbai Bazar app`,
            })),
          },
        ],
      },
      // Lets the app share its Keychain credentials with the website, so a
      // saved password works in both. Harmless with no login today, and saves a
      // re-deploy if accounts are added later.
      webcredentials: { apps: [appId] },
    },
    null,
    2,
  );
}

export const Route = createFileRoute("/.well-known/apple-app-site-association")({
  server: {
    handlers: {
      GET: () => {
        if (!appleLinksReady()) {
          return new Response("Not Found", {
            status: 404,
            headers: { "content-type": "text/plain; charset=utf-8" },
          });
        }

        return new Response(buildAasa(), {
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
