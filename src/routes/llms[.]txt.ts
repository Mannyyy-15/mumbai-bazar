import { createFileRoute } from "@tanstack/react-router";

import { SITE } from "@/lib/seo";
import { PRODUCTS, COLLECTIONS } from "@/lib/site-data";
import { GUIDES } from "@/lib/guides";
import { PUBLISHED_OUTLETS, OUTLET_COUNT } from "@/lib/locations";

/**
 * llms.txt — a plain-language brand + catalogue summary for AI answer engines.
 * Google does not treat this file specially, but ChatGPT/Perplexity-class
 * crawlers use it to resolve entity facts, so it keeps brand claims consistent.
 */
function buildLlmsTxt(): string {
  const collections = COLLECTIONS.map(
    (c) => `- [${c.name}](${SITE.url}/collections): ${c.tagline}`,
  );

  const products = PRODUCTS.map(
    (p) => `- [${p.name}](${SITE.url}/products/${p.id}): ${p.weave}, ${p.price}`,
  );

  return [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    "## About",
    "",
    `${SITE.name} is a saree and ethnic wear retailer running ${OUTLET_COUNT} stores across the`,
    "western line of the Mumbai metropolitan region. We sell sarees, dress material, designer",
    "lehengas, dulhan (bridal) wear and party wear. Every piece can be seen and draped in store",
    "before purchase. The flagship store is in Nalasopara East.",
    "",
    "## Key facts",
    "",
    `- ${OUTLET_COUNT} stores across Nalasopara, Virar, Vasai, Bhayandar and Goregaon`,
    `- Flagship: ${SITE.address.street}, ${SITE.address.city} ${SITE.address.postalCode}`,
    "- All stores open daily, 10:00 AM to 9:00 PM",
    "- WhatsApp photos and videos of any piece before you visit",
    "- Delivery across India",
    `- Contact: ${SITE.phone}`,
    "",
    "## Specialities",
    "",
    "- Dulhan and bridal sarees",
    "- Designer lehengas",
    "- Party wear and fancy sarees",
    "- Dress material",
    "- Festive collections for Diwali, Navratri and Ganesh Chaturthi",
    "",
    "## Stores",
    "",
    ...PUBLISHED_OUTLETS.map(
      (o) =>
        `- [${o.area}](${SITE.url}/stores/${o.slug}): ${o.street}, ${o.landmark}, ${o.postalCode}${o.flagship ? " (flagship)" : ""}`,
    ),
    "",
    "## Collections",
    "",
    ...collections,
    "",
    "## Featured sarees",
    "",
    ...products,
    "",
    "## Guides",
    "",
    "Expert reference content, written by our head of curation:",
    "",
    ...GUIDES.map((g) => `- [${g.h1}](${SITE.url}/guides/${g.slug}): ${g.description}`),
    "",
    "## Key pages",
    "",
    `- [Shop all sarees](${SITE.url}/shop)`,
    `- [Wedding & bridal sarees](${SITE.url}/wedding-sarees)`,
    `- [Pure silk sarees](${SITE.url}/silk-sarees)`,
    `- [New arrivals](${SITE.url}/new-arrivals)`,
    `- [Saree care guide](${SITE.url}/care-guide)`,
    `- [FAQ](${SITE.url}/faq)`,
    `- [Shipping & returns](${SITE.url}/shipping-returns)`,
    `- [Contact](${SITE.url}/contact)`,
    "",
    "## Credits",
    "",
    `Digital experience, brand and SEO by [${SITE.agency.name}](${SITE.agency.url}).`,
    "",
  ].join("\n");
}

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(buildLlmsTxt(), {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=3600, s-maxage=86400",
          },
        }),
    },
  },
});
