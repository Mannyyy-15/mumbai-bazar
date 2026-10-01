import { useLoaderData } from "react-router";
import type { Route } from "./+types/sarees-under-1000";
import { getSeoMeta, jsonLdScript } from "~/lib/seo";
import { breadcrumbSchema, collectionSchema, faqSchema } from "~/lib/structured-data";
import { fetchLiveProducts } from "~/lib/shopify.server";
import { CategoryPage } from "~/components/CategoryPage";
import { IMG } from "~/lib/site-data";
import { COD_FEE_LABEL, lowestPriceLabel } from "~/lib/commerce";

/**
 * /sarees-under-1000
 *
 * Why this page exists
 * --------------------
 * Google autocomplete for India returns "saree under 1000", "silk saree under
 * 1000", "saree under 1000 for farewell" and "saree under 1000 for weddings"
 * among the top suggestions -- high-volume, high-intent, and nothing on this
 * site targeted any of it.
 *
 * It also fits the catalogue unusually well: a live crawl found all 64 online
 * products priced Rs 649-1,699, median Rs 999, with 47 at or under Rs 1,000.
 *
 * Deliberately NOT built: /sarees-under-2000. Every online product is under
 * Rs 1,700, so that page would be a duplicate of /shop. Add it once the
 * catalogue has meaningful stock above Rs 2,000.
 */

const MAX_PRICE = 1000;

/**
 * Below this many products the page is thin, so it noindexes itself rather
 * than shipping a near-empty grid to Google. Protects the page if the
 * catalogue changes and nobody remembers this route exists.
 */
const MIN_PRODUCTS_TO_INDEX = 6;

function priceOf(p: { price?: string }): number {
  return Number(String(p.price ?? "").replace(/[^0-9.]/g, "")) || 0;
}

const FAQS = [
  {
    q: "Can I get a good saree under ₹1,000?",
    a: "Yes, for the right occasion. At this price you get printed, zari butti and kalamkari-style sarees in art silk and soft blends — good for office, college farewells, pujas and family functions where you are a guest. For your own wedding you will want to look at a heavier piece in store.",
  },
  {
    q: "Is the zari on these sarees real gold or silver?",
    a: "No. Zari on sarees at this price is metallic thread. It gives the same shine in photographs and is far lighter to wear, but it is not precious metal, and nobody selling a saree under ₹1,000 can honestly tell you otherwise.",
  },
  {
    q: "Which saree under ₹1,000 is best for a farewell?",
    a: "A soft art silk or georgette-blend saree with a zari border. It drapes easily for a first-time wearer, holds pleats through a long event, and photographs well under hall lighting. Avoid stiff fabrics if you are not used to wearing a saree all day.",
  },
  {
    q: "Can I wear these sarees to the office?",
    a: "The printed and lighter zari pieces work well for office — they are easy to wash at home, do not need dry cleaning, and stay comfortable through a full day. Keep heavier butti work for evenings and functions.",
  },
  {
    q: "Do you charge for delivery on sarees under ₹1,000?",
    a: `Delivery is free anywhere in India when you pay online. Cash on Delivery carries a ${COD_FEE_LABEL} handling fee, shown at checkout before you pay.`,
  },
  {
    q: "Can I exchange a saree if I don't like it?",
    a: "Yes, within 7 days of delivery, as long as the saree is unused with its tags intact and the blouse piece unstitched.",
  },
];

export const meta: Route.MetaFunction = ({ data }) => {
  const count = data?.products?.length ?? 0;
  const from = lowestPriceLabel(data?.products ?? []);
  return getSeoMeta({
    title: "Sarees Under ₹1,000 — Party, Office & Farewell | Mumbai Bazar",
    description: `${count > 0 ? `${count} ` : ""}sarees under ₹1,000${
      from ? `, from ${from}` : ""
    } — printed, zari butti and art silk for office, farewells and functions. Free delivery on prepaid orders.`,
    path: "/sarees-under-1000",
    noindex: count < MIN_PRODUCTS_TO_INDEX,
    keywords: [
      "saree under 1000",
      "silk saree under 1000",
      "saree under 1000 for farewell",
      "party wear saree under 1000",
      "office wear saree under 1000",
      "saree under 1000 for wedding",
    ],
  });
};

export async function loader({ context }: Route.LoaderArgs) {
  const all = await fetchLiveProducts(context, 100);
  // Cheapest first: the point of the page is the price.
  const products = all
    .filter((p) => {
      const n = priceOf(p);
      return n > 0 && n <= MAX_PRICE;
    })
    .sort((a, b) => priceOf(a) - priceOf(b));
  return { products };
}

export default function SareesUnder1000Route() {
  const { products } = useLoaderData<typeof loader>();

  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Shop", path: "/shop" },
      { name: "Sarees Under ₹1,000", path: "/sarees-under-1000" },
    ]),
    collectionSchema(
      "Sarees Under ₹1,000",
      "Printed, zari butti and art silk sarees priced at ₹1,000 or less.",
      "/sarees-under-1000",
      products.slice(0, 12),
    ),
    faqSchema(FAQS),
  ];

  return (
    <div className="w-full bg-ivory">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }}
      />
      <CategoryPage
        eyebrow="Under ₹1,000"
        title="Sarees Under ₹1,000"
        crumb="Sarees Under ₹1,000"
        copy="Printed, zari butti and art silk sarees for office, farewells and family functions — all at ₹1,000 or less."
        heroImg={IMG.colPuresilk}
        showHero={false}
        contentKey="sarees-under-1000"
        products={products}
      />

      {/* Answers rendered on the page as well as in FAQPage schema: Google
          only credits structured data that matches visible content. */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <h2 className="font-serif text-2xl text-maroon md:text-3xl">
          Questions about sarees under ₹1,000
        </h2>
        <dl className="mt-6 space-y-4">
          {FAQS.map((f) => (
            <div key={f.q} className="rounded-2xl border border-gold/40 bg-white p-5">
              <dt className="font-serif text-lg font-bold text-ink">{f.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-taupe">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
