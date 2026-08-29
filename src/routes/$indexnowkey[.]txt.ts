import { createFileRoute } from "@tanstack/react-router";

import { SITE } from "@/lib/seo";

/**
 * IndexNow key file at its canonical location, `/<key>.txt`.
 *
 * The protocol expects the key to be served at a path named after the key
 * itself. This route matches any `*.txt` at the root and returns the key only
 * when the requested filename actually is the key — anything else 404s, so it
 * does not become a catch-all that shadows other text files.
 *
 * `/indexnow-key.txt` serves the same value at a stable, memorable path and is
 * what `keyLocation` in the submission payload points at.
 */
export const Route = createFileRoute("/$indexnowkey.txt")({
  server: {
    handlers: {
      GET: ({ params }) => {
        // The router keys the param on the whole segment and hands back the
        // filename with its extension still attached, so strip it.
        const requested = params["indexnowkey.txt"].replace(/\.txt$/, "");
        // A plain 404 Response, not notFound() — the router's notFound is for
        // page routes and surfaces as a 500 from a server handler.
        if (!SITE.indexNowKey || requested !== SITE.indexNowKey) {
          return new Response("Not found", {
            status: 404,
            headers: { "content-type": "text/plain; charset=utf-8" },
          });
        }
        return new Response(SITE.indexNowKey, {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
