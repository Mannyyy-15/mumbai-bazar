import type { Route } from './+types/[llms.txt]';
import { SITE } from '~/lib/seo';
import { COLLECTIONS } from '~/lib/site-data';
import { fetchLiveProducts } from '~/lib/shopify.server';
import { GUIDES } from '~/lib/guides';
import { PUBLISHED_OUTLETS, OUTLET_COUNT } from '~/lib/locations';

export async function loader({ context }: Route.LoaderArgs) {
  const collections = COLLECTIONS.map(
    (c) => `- [${c.name}](${SITE.url}/collections): ${c.tagline}`,
  );

  const catalogue = await fetchLiveProducts(context, 60);
  const products = catalogue.map(
    (p) => `- [${p.name}](${SITE.url}/products/${p.handle}): ${p.weave}, ${p.price}`,
  );

  const text = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    '## About',
    '',
    `${SITE.name} is a saree and ethnic wear retailer running ${OUTLET_COUNT} stores across the`,
    'western line of the Mumbai metropolitan region. We sell sarees, dress material, designer',
    'lehengas, dulhan (bridal) wear and party wear. Every piece can be seen and draped in store',
    'before purchase. The flagship store is in Nalasopara East.',
    '',
    '## Key facts',
    '',
    `- ${OUTLET_COUNT} stores across Nalasopara, Virar, Vasai, Bhayandar and Goregaon`,
    `- Flagship: ${SITE.address.street}, ${SITE.address.city} ${SITE.address.postalCode}`,
    `- ${SITE.hours.sentence}`,
    '- WhatsApp photos and videos of any piece before you visit',
    '- Delivery across India',
    `- Contact: ${SITE.phone}`,
    '',
    '## Specialities',
    '',
    '- Dulhan and bridal sarees',
    '- Designer lehengas',
    '- Party wear and fancy sarees',
    '- Dress material',
    '- Festive collections for Diwali, Navratri and Ganesh Chaturthi',
    '',
    '## Stores',
    '',
    ...PUBLISHED_OUTLETS.map(
      (o) =>
        `- [${o.area}](${SITE.url}/stores/${o.slug}): ${o.street}, ${o.landmark}, ${o.postalCode}${o.flagship ? ' (flagship)' : ''}`,
    ),
    '',
    '## Collections',
    '',
    ...collections,
    '',
    ...(products.length ? ['## Featured sarees', '', ...products, ''] : []),
    '## Guides',
    '',
    'Expert reference content, written by our head of curation:',
    '',
    ...GUIDES.map((g) => `- [${g.h1}](${SITE.url}/guides/${g.slug}): ${g.description}`),
    '',
    '## Key pages',
    '',
    `- [Shop all sarees](${SITE.url}/shop)`,
    `- [Wedding & bridal sarees](${SITE.url}/wedding-sarees)`,
    `- [Pure silk sarees](${SITE.url}/silk-sarees)`,
    `- [New arrivals](${SITE.url}/new-arrivals)`,
    `- [Saree care guide](${SITE.url}/care-guide)`,
    `- [FAQ](${SITE.url}/faq)`,
    `- [Shipping & returns](${SITE.url}/shipping-returns)`,
    `- [Contact](${SITE.url}/contact)`,
    '',
    '## Credits',
    '',
    `Digital experience, brand and SEO by [${SITE.agency.name}](${SITE.agency.url}).`,
    '',
  ].join('\n');

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
