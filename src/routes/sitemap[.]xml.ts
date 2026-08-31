import { createFileRoute } from "@tanstack/react-router";

import { SITE } from "@/lib/seo";
import { fetchShopifyProducts } from "@/lib/shopify";
import { PUBLISHED_OUTLETS } from "@/lib/locations";
import { GUIDES } from "@/lib/guides";

type Entry = { path: string };

/** Static, indexable routes. */
const STATIC_ENTRIES: Entry[] = [
  { path: "/" },
  { path: "/shop" },
  { path: "/wedding-sarees" },
  { path: "/silk-sarees" },
  { path: "/new-arrivals" },
  { path: "/festive-edit" },
  { path: "/everyday-sarees" },
  { path: "/collections" },
  { path: "/trousseau-builder" },
  { path: "/our-story" },
  { path: "/about" },
  { path: "/care-guide" },
  { path: "/stores" },
  { path: "/guides" },
  { path: "/faq" },
  { path: "/contact" },
  { path: "/contact-information" },
  { path: "/shipping-policy" },
  { path: "/refund-policy" },
  { path: "/privacy-policy" },
  { path: "/terms-of-service" },
  { path: "/legal-notice" },
  { path: "/shipping-returns" },
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * A sitemap entry.
 *
 * Deliberately emits neither `changefreq` nor `priority`: Google ignores both
 * outright and has said so for years.
 *
 * `lastmod` is emitted ONLY where a real content-modified date exists — which
 * today means the guides. Previously every URL carried the build date, so all
 * 41 entries claimed to have changed on every deploy. A `lastmod` that moves
 * without the content moving is treated as untrustworthy and then discarded
 * wholesale, which costs the signal on the pages where the date is genuine.
 */
function urlEntry(path: string, lastmod?: string): string {
  return [
    "  <url>",
    `    <loc>${escapeXml(SITE.url + path)}</loc>`,
    ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
    "  </url>",
  ].join("\n");
}

async function buildSitemap(): Promise<string> {
  const staticUrls = STATIC_ENTRIES.map((e) => urlEntry(e.path));

  // Product URLs come from the live Shopify catalogue, not the local seed data —
  // the PDP loader only resolves Shopify handles, so anything else would be a
  // 404 handed straight to Google. On a fetch failure we emit no product URLs
  // rather than stale ones.
  const products = await fetchShopifyProducts(250).catch(() => []);
  const productUrls = products.map((p) => urlEntry(`/products/${p.handle}`));

  // NOTE: the weave collections are deliberately NOT listed. They were emitted
  // as `/collections#banarasi`-style fragment URLs, and Google discards
  // everything after the "#", so those were five duplicate submissions of
  // /collections — inflating the sitemap and misreporting coverage in Search
  // Console. To make these rank they need to become real URLs
  // (/collections/banarasi) with their own content, not fragments.

  // Store pages. These carry the branch NAP, so they rank for "saree shop near
  // me" in each locality and back the Google Business Profile listings.
  const outletUrls = PUBLISHED_OUTLETS.map((o) => urlEntry(`/stores/${o.slug}`));

  // Editorial guides — the topical-authority cluster, and the only URLs with a
  // real modified date.
  const guideUrls = GUIDES.map((g) => urlEntry(`/guides/${g.slug}`, g.modified));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticUrls,
    ...productUrls,
    ...outletUrls,
    ...guideUrls,
    "</urlset>",
  ].join("\n");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () =>
        new Response(await buildSitemap(), {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600, s-maxage=86400",
          },
        }),
    },
  },
});
