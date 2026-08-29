import { createFileRoute } from "@tanstack/react-router";

import { SITE } from "@/lib/seo";

/**
 * IndexNow ownership proof.
 *
 * IndexNow lets us push "this URL changed" pings to Bing, Yandex, Naver and
 * Seznam so new sarees are crawled in minutes rather than days. (Google does
 * not participate — it still relies on the sitemap and Search Console.)
 *
 * The protocol expects the key file to be served at the key's own filename,
 * e.g. /<key>.txt. Serving it here as well keeps the key in one place; point
 * the `keyLocation` field of the IndexNow payload at this URL.
 *
 * Returns 404 until `SITE.indexNowKey` is filled in, so we never advertise an
 * empty key.
 */
export const Route = createFileRoute("/indexnow-key.txt")({
  server: {
    handlers: {
      GET: () => {
        if (!SITE.indexNowKey) {
          return new Response("IndexNow key not configured", { status: 404 });
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
