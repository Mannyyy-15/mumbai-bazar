import { createFileRoute } from "@tanstack/react-router";

import { SITE } from "@/lib/seo";
import { COLLECTIONS } from "@/lib/site-data";
import { fetchShopifyProducts } from "@/lib/shopify";
import { PUBLISHED_OUTLETS } from "@/lib/locations";
import { GUIDES } from "@/lib/guides";

type Entry = { path: string; changefreq: string; priority: string };

/** Static, indexable routes. Utility pages sit lower in priority. */
const STATIC_ENTRIES: Entry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/shop", changefreq: "daily", priority: "0.9" },
  { path: "/wedding-sarees", changefreq: "weekly", priority: "0.9" },
  { path: "/silk-sarees", changefreq: "weekly", priority: "0.9" },
  { path: "/new-arrivals", changefreq: "daily", priority: "0.8" },
  { path: "/festive-edit", changefreq: "weekly", priority: "0.8" },
  { path: "/everyday-sarees", changefreq: "weekly", priority: "0.8" },
  { path: "/collections", changefreq: "weekly", priority: "0.8" },
  { path: "/trousseau-builder", changefreq: "monthly", priority: "0.7" },
  { path: "/our-story", changefreq: "monthly", priority: "0.6" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/care-guide", changefreq: "monthly", priority: "0.6" },
  { path: "/stores", changefreq: "monthly", priority: "0.9" },
  { path: "/guides", changefreq: "weekly", priority: "0.7" },
  { path: "/faq", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.5" },
  { path: "/contact-information", changefreq: "monthly", priority: "0.5" },
  { path: "/shipping-policy", changefreq: "monthly", priority: "0.5" },
  { path: "/refund-policy", changefreq: "monthly", priority: "0.5" },
  { path: "/privacy-policy", changefreq: "monthly", priority: "0.5" },
  { path: "/terms-of-service", changefreq: "monthly", priority: "0.5" },
  { path: "/legal-notice", changefreq: "monthly", priority: "0.5" },
  { path: "/shipping-returns", changefreq: "monthly", priority: "0.4" },
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(path: string, lastmod: string, changefreq: string, priority: string): string {
  return [
    "  <url>",
    `    <loc>${escapeXml(SITE.url + path)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
}

async function buildSitemap(): Promise<string> {
  const lastmod = new Date().toISOString().slice(0, 10);

  const staticUrls = STATIC_ENTRIES.map((e) => urlEntry(e.path, lastmod, e.changefreq, e.priority));

  // Product URLs come from the live Shopify catalogue, not the local seed data —
  // the PDP loader only resolves Shopify handles, so anything else would be a
  // 404 handed straight to Google. On a fetch failure we emit no product URLs
  // rather than stale ones.
  const products = await fetchShopifyProducts(250).catch(() => []);
  const productUrls = products.map((p) =>
    urlEntry(`/products/${p.handle}`, lastmod, "weekly", "0.8"),
  );

  // Collection landing pages are rendered by /collections; list them so the
  // weave-specific URLs are discoverable rather than orphaned.
  const collectionUrls = COLLECTIONS.map((c) =>
    urlEntry(`/collections#${c.slug}`, lastmod, "monthly", "0.6"),
  );

  // Store pages. These carry the branch NAP, so they rank for "saree shop near
  // me" in each locality and back the Google Business Profile listings.
  const outletUrls = PUBLISHED_OUTLETS.map((o) =>
    urlEntry(`/stores/${o.slug}`, lastmod, "monthly", o.flagship ? "0.9" : "0.8"),
  );

  // Editorial guides — the topical-authority cluster.
  const guideUrls = GUIDES.map((g) => urlEntry(`/guides/${g.slug}`, g.modified, "monthly", "0.7"));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticUrls,
    ...productUrls,
    ...outletUrls,
    ...guideUrls,
    ...collectionUrls,
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
