import type { Route } from './+types/[sitemap.xml]';
import { SITE } from '~/lib/seo';
import { fetchLiveProducts } from '~/lib/shopify.server';
import { PUBLISHED_OUTLETS } from '~/lib/locations';
import { GUIDES } from '~/lib/guides';
import { LOCAL_AREAS } from '~/lib/local-areas';

const STATIC_ENTRIES = [
  { path: '/' },
  { path: '/shop' },
  { path: '/wedding-sarees' },
  { path: '/silk-sarees' },
  { path: '/new-arrivals' },
  { path: '/festive-edit' },
  { path: '/everyday-sarees' },
  { path: '/sarees-under-1000' },
  { path: '/collections' },
  { path: '/trousseau-builder' },
  { path: '/our-story' },
  { path: '/about' },
  { path: '/care-guide' },
  { path: '/stores' },
  { path: '/guides' },
  { path: '/faq' },
  { path: '/contact' },
  { path: '/contact-information' },
  { path: '/shipping-policy' },
  { path: '/refund-policy' },
  { path: '/privacy-policy' },
  { path: '/terms-of-service' },
  { path: '/legal-notice' },
  { path: '/shipping-returns' },
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlEntry(path: string, lastmod?: string): string {
  return [
    '  <url>',
    `    <loc>${escapeXml(SITE.url + path)}</loc>`,
    ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
    '  </url>',
  ].join('\n');
}

export async function loader({ context }: Route.LoaderArgs) {
  const staticUrls = STATIC_ENTRIES.map((e) => urlEntry(e.path));
  const products = await fetchLiveProducts(context, 100);
  const productUrls = products.map((p) => urlEntry(`/products/${p.handle}`));
  const outletUrls = PUBLISHED_OUTLETS.map((o) => urlEntry(`/stores/${o.slug}`));
  const areaUrls = LOCAL_AREAS.map((a) => urlEntry(`/sarees-in/${a.slug}`));
  const guideUrls = GUIDES.map((g) => urlEntry(`/guides/${g.slug}`, g.modified));

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticUrls,
    ...productUrls,
    ...outletUrls,
    ...areaUrls,
    ...guideUrls,
    '</urlset>',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
