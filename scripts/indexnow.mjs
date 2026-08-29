#!/usr/bin/env node
/**
 * Push changed URLs to IndexNow (Bing, Yandex, Naver, Seznam).
 *
 * Google does not consume IndexNow — for Google, rely on the sitemap plus
 * Search Console's "Request indexing".
 *
 * Usage:
 *   node scripts/indexnow.mjs                     # submit every sitemap URL
 *   node scripts/indexnow.mjs /products/meher-wine /shop
 *
 * Requires INDEXNOW_KEY (or SITE.indexNowKey in src/lib/seo.ts) to be set and
 * the matching key file to be reachable at <host>/indexnow-key.txt.
 */

const HOST = process.env.SITE_HOST ?? "mumbaibaazar.com";
const ORIGIN = `https://${HOST}`;
const KEY = process.env.INDEXNOW_KEY ?? "";

if (!KEY) {
  console.error("INDEXNOW_KEY is not set. Generate a 8-128 char hex key, put it in");
  console.error("src/lib/seo.ts (SITE.indexNowKey), redeploy, then export INDEXNOW_KEY.");
  process.exit(1);
}

async function urlsFromSitemap() {
  const res = await fetch(`${ORIGIN}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const args = process.argv.slice(2);
const urlList = args.length
  ? args.map((p) => (p.startsWith("http") ? p : `${ORIGIN}${p.startsWith("/") ? "" : "/"}${p}`))
  : await urlsFromSitemap();

// IndexNow accepts at most 10,000 URLs per request.
const batch = urlList.slice(0, 10000);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `${ORIGIN}/indexnow-key.txt`,
    urlList: batch,
  }),
});

// 200 = accepted, 202 = accepted but key still being validated.
if (res.ok) {
  console.log(`Submitted ${batch.length} URL(s) to IndexNow — HTTP ${res.status}`);
} else {
  console.error(`IndexNow rejected the request — HTTP ${res.status}`);
  console.error(await res.text());
  process.exit(1);
}
