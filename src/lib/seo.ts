/**
 * Central SEO configuration and helpers.
 *
 * Everything canonical/structured-data related is derived from SITE so there is a
 * single place to change the domain, brand name or contact details.
 */

export const SITE = {
  /** Production origin — no trailing slash. Update if the domain changes. */
  url: "https://mumbaibazar.com",
  name: "Mumbai Bazar",
  legalName: "Mumbai Bazar",
  tagline: "Sarees, Lehengas & Bridal Wear",
  description:
    "Sarees, dress material, designer lehengas and dulhan wear across 8 stores in Nalasopara, Virar, Vasai, Bhayandar and Goregaon. Party wear, bridal and festive collections, plus delivery across India.",
  locale: "en_IN",
  currency: "INR",
  email: "care@mumbaibazar.com",
  /** Flagship (Nalasopara East) number, from the live JustDial listing. */
  phone: "+91 89566 64631",
  /** E.164, digits only — used for wa.me links. */
  whatsapp: "918956664631",
  /**
   * Canonical NAP = the Nalasopara East flagship. This must match the Google
   * Business Profile for that store byte-for-byte; a mismatch between schema
   * and GBP suppresses local ranking for the whole network.
   */
  address: {
    street: "Shop 1, Tiwari Nagar, Tulinj Road",
    city: "Nalasopara",
    region: "Maharashtra",
    postalCode: "401209",
    country: "IN",
  },
  geo: { lat: 19.4162, lng: 72.8619 },
  /** Phase 1 hyper-local, Phase 2 Mumbai metro. Drives areaServed + geo pages. */
  serviceAreas: [
    "Vasai",
    "Virar",
    "Nalasopara",
    "Naigaon",
    "Bhayandar",
    "Mira Road",
    "Borivali",
    "Kandivali",
    "Malad",
    "Andheri",
    "Bandra",
    "Dadar",
    "South Mumbai",
    "Thane",
    "Navi Mumbai",
  ],
  /**
   * SINGLE SOURCE OF TRUTH for opening hours. Everything that states hours —
   * the footer, store pages, `openingHoursSpecification` in JSON-LD, llms.txt
   * and the homepage meta description — must derive from this and nothing else.
   *
   * Before this existed the site stated three different sets of hours at once:
   * the footer and Organization schema said Mon-Sat to 8 PM, while the store
   * pages, llms.txt and the homepage meta description said daily to 9 PM. Hours
   * are core NAP data: Google cross-references them against Google Business
   * Profile, inconsistency suppresses map-pack confidence, and an AI assistant
   * asked "are you open on Sunday?" had a 50/50 chance of sending a customer to
   * a closed shop.
   *
   * The values below follow the majority of the site (store pages + llms.txt +
   * homepage meta) and normal Indian saree-retail trading patterns.
   * >>> CONFIRM AGAINST THE ACTUAL STORES, then make Google Business Profile
   * >>> match exactly. Change it here only — never in a component.
   */
  hours: {
    opens: "10:00",
    closes: "21:00",
    /** All seven days. Set to the trading days if any store closes weekly. */
    days: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ] as const,
    /** Human-readable, for the footer and any prose that states hours. */
    label: "Open daily: 10:00 AM – 9:00 PM",
    /** Sentence-form, for llms.txt and other running prose. */
    sentence: "All stores open daily, 10:00 AM to 9:00 PM",
    /** Compact form for meta descriptions and inline chips. */
    short: "10 AM – 9 PM",
    /** Compact form including the days, for prose. */
    shortDaily: "Open daily 10 AM – 9 PM",
    /** Compact schema.org / GBP form. */
    spec: "Mo-Su 10:00-21:00",
  },
  social: [
    "https://www.instagram.com/mumbai__bazar__nalasopara/",
    "https://www.instagram.com/mumbai_bazar__bhayandar_/",
    "https://www.facebook.com/mumbaibazar",
    "https://www.youtube.com/@mumbaibazar",
    "https://in.pinterest.com/mumbaibazar",
  ],
  /**
   * Search-engine ownership verification. Paste the token each console gives
   * you (the bare content value, not the whole meta tag); empty values are
   * skipped, so it is safe to ship before the accounts exist.
   * - Google  : Search Console > Add property > HTML tag
   * - Bing    : Bing Webmaster Tools > Site verification (also feeds Copilot)
   * - Yandex  : Yandex Webmaster > Meta tag
   * - Pinterest: Pinterest business > Claim website (unlocks Rich Pins)
   */
  verification: {
    google: "T575kNhBnJsmhlPUp9FUcAjjqBKnfyNPXgAFZTPTG6g",
    bing: "",
    yandex: "",
    pinterest: "",
  },
  /**
   * IndexNow key — one shared token that pushes instant index requests to Bing,
   * Yandex, Naver and Seznam (Google does not consume IndexNow). Generate any
   * 8-128 char hex string; it is served at /<key>.txt to prove ownership.
   */
  indexNowKey: "46822c85822579eec5647124e3f618e3",
  /** Agency credit — powers the About/Story backlink to the studio site. */
  agency: {
    name: "ThePieCraft Marketing",
    url: "https://thepiecraftmarketing.com",
  },
} as const;

/**
 * Social share card. A purpose-made 1200x630 JPEG, not the logo — WhatsApp,
 * Facebook and X all crop to that ratio and a square logo unfurls badly.
 */
export const OG_IMAGE = `${SITE.url}/og-share.jpg`;

/** Absolute URL for any site-relative path or already-absolute asset. */
export function absoluteUrl(path: string): string {
  if (!path) return SITE.url;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE.url}${path.startsWith("/") ? "" : "/"}${path}`;
}

type MetaTag = Record<string, string>;
type LinkTag = Record<string, string>;

export type SeoInput = {
  title: string;
  description: string;
  /** Site-relative path, e.g. "/wedding-sarees". Drives canonical + og:url. */
  path: string;
  image?: string;
  /** "website" for browse pages, "product" for PDPs, "article" for the journal. */
  type?: "website" | "product" | "article";
  keywords?: string[];
  noindex?: boolean;
};

/**
 * Builds the full meta + link set for a route's `head()`.
 * Later tags win in TanStack Start, so per-route values override the root defaults.
 */
export function seo({
  title,
  description,
  path,
  image = OG_IMAGE,
  type = "website",
  keywords,
  noindex,
}: SeoInput): { meta: MetaTag[]; links: LinkTag[] } {
  const url = absoluteUrl(path);
  const img = absoluteUrl(image);

  const meta: MetaTag[] = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:image", content: img },
    { property: "og:image:alt", content: title },
    { property: "og:site_name", content: SITE.name },
    { property: "og:locale", content: SITE.locale },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: img },
  ];

  if (keywords?.length) meta.push({ name: "keywords", content: keywords.join(", ") });
  if (noindex) meta.push({ name: "robots", content: "noindex, nofollow" });

  return {
    meta,
    links: [
      { rel: "canonical", href: url },
      // Single-locale site today; x-default keeps the door open for regional variants.
      { rel: "alternate", hrefLang: "en-IN", href: url },
      { rel: "alternate", hrefLang: "x-default", href: url },
    ],
  };
}

/**
 * Serialises a JSON-LD object for a route's `head.scripts`. Attributes sit at
 * the top level of the entry -- a nested `attrs` object renders as the literal
 * `attrs="[object Object]"` -- with the payload under `children`.
 * `<` is escaped so a stray `</script>` in the data cannot close the tag early.
 */
export function jsonLd(data: unknown) {
  return {
    type: "application/ld+json",
    children: JSON.stringify(data).replace(/</g, "\u003c"),
  };
}

/**
 * Ownership-verification meta tags for the search consoles, skipping any
 * provider whose token has not been filled in yet.
 */
export function verificationMeta(): Record<string, string>[] {
  const { google, bing, yandex, pinterest } = SITE.verification;
  return [
    { name: "google-site-verification", content: google },
    { name: "msvalidate.01", content: bing },
    { name: "yandex-verification", content: yandex },
    { name: "p:domain_verify", content: pinterest },
  ].filter((tag) => tag.content.length > 0);
}

/**
 * Context-aware alt text for catalogue imagery.
 *
 * Formula: <product name> - <weave> saree<, view descriptor> | <brand>
 * Google Images and Pinterest Lens both read alt text as the primary textual
 * signal for a photo, and ethnic-wear discovery is overwhelmingly visual, so
 * every catalogue image gets the weave and brand rather than a bare title.
 * Kept under ~125 characters, which is where screen readers begin to truncate.
 */
export function productAltText(
  name: string,
  weave: string,
  view?: "front drape" | "palla detail" | "border detail" | "blouse piece" | "styled look",
): string {
  const viewPart = view ? `, ${view}` : "";
  return `${name} - ${weave} saree${viewPart} | ${SITE.name}`.slice(0, 125);
}
