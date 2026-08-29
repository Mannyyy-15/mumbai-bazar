import { createFileRoute } from "@tanstack/react-router";

import { SITE } from "@/lib/seo";

/**
 * Allows all reputable crawlers, including the AI answer engines that now drive
 * a meaningful share of qualified retail traffic. Only genuinely non-indexable
 * surfaces (cart/checkout state, query-string noise) are disallowed.
 */
function buildRobots(): string {
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /*?*sort=",
    "Disallow: /*?*filter=",
    "Disallow: /*?add-to-cart=",
    "",
    "# AI answer engines — explicitly welcomed for brand citations",
    "User-agent: GPTBot",
    "Allow: /",
    "",
    "User-agent: OAI-SearchBot",
    "Allow: /",
    "",
    "User-agent: ChatGPT-User",
    "Allow: /",
    "",
    "User-agent: PerplexityBot",
    "Allow: /",
    "",
    "User-agent: ClaudeBot",
    "Allow: /",
    "",
    "User-agent: Google-Extended",
    "Allow: /",
    "",
    `Sitemap: ${SITE.url}/sitemap.xml`,
    "",
  ].join("\n");
}

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(buildRobots(), {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=86400",
          },
        }),
    },
  },
});
