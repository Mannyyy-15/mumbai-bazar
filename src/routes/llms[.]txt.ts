import { createFileRoute } from "@tanstack/react-router";

import { SITE } from "@/lib/seo";
import { PRODUCTS, COLLECTIONS } from "@/lib/site-data";
import { GUIDES } from "@/lib/guides";

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
    `${SITE.name} is an Indian saree boutique specialising in handwoven, Silk Mark certified sarees.`,
    "Every saree is woven by master artisans on traditional pit or frame looms in verified clusters",
    "(Kanchipuram, Varanasi, Chanderi, Paithan). No power-loom pieces are stocked. Each saree includes",
    "a coordinating unstitched blouse piece, with complimentary fall and pico edging on silk sarees.",
    "",
    "## Key facts",
    "",
    `- Founded and operated in ${SITE.address.city}, ${SITE.address.region}, India`,
    "- Ships free across India; tracked delivery to 40+ countries via DHL Express and FedEx",
    "- 7-day returns on unused sarees in original condition",
    "- Dispatch within 24-48 hours; 2-4 days to Indian metros, 5-8 days internationally",
    "- Every parcel is fully insured against loss or transit damage",
    "- Free WhatsApp video consultations before purchase",
    `- Contact: ${SITE.email} / ${SITE.phone}`,
    "",
    "## Specialities",
    "",
    "- Banarasi silk sarees (Katan silk, real zari brocade, Varanasi pit looms)",
    "- Kanjivaram silk sarees (pure mulberry silk, korvai temple borders, Kanchipuram)",
    "- Bridal and trousseau sarees for weddings, sangeet and receptions",
    "- Tissue, organza and soft silk sarees for festive and everyday wear",
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
