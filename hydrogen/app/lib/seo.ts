/**
 * Central SEO configuration and helpers for Hydrogen / React Router 7.
 *
 * Everything canonical and structured-data related derives from SITE so there is a
 * single place to change the domain, brand name or contact details.
 */

export const SITE = {
  /** Production origin — no trailing slash. */
  url: "https://www.mumbaibazar.com",
  name: "Mumbai Bazar",
  legalName: "Mumbai Bazar",
  tagline: "Sarees, Lehengas & Bridal Wear",
  description:
    "Sarees, dress material, designer lehengas and dulhan wear across 8 stores in Nalasopara, Virar, Vasai, Bhayandar and Goregaon. Party wear, bridal and festive collections, plus delivery across India.",
  locale: "en_IN",
  currency: "INR",
  email: "care@mumbaibazar.com",
  /** Flagship (Nalasopara East) number */
  phone: "+91 89566 64631",
  /** E.164 digits only for wa.me */
  whatsapp: "918956664631",
  address: {
    street: "Shop 1, Tiwari Nagar, Tulinj Road",
    city: "Nalasopara",
    region: "Maharashtra",
    postalCode: "401209",
    country: "IN",
  },
  geo: { lat: 19.4162, lng: 72.8619 },
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
  hours: {
    opens: "10:00",
    closes: "21:00",
    days: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ] as const,
    label: "Open daily: 10:00 AM – 9:00 PM",
    sentence: "All stores open daily, 10:00 AM to 9:00 PM",
    short: "10 AM – 9 PM",
    shortDaily: "Open daily 10 AM – 9 PM",
    spec: "Mo-Su 10:00-21:00",
  },
  social: [
    "https://www.instagram.com/mumbai__bazar__nalasopara/",
    "https://www.instagram.com/mumbai_bazar__bhayandar_/",
    "https://www.facebook.com/mumbaibazar",
    "https://www.youtube.com/@mumbaibazar",
    "https://in.pinterest.com/mumbaibazar",
  ],
  verification: {
    google: "T575kNhBnJsmhlPUp9FUcAjjqBKnfyNPXgAFZTPTG6g",
    bing: "",
    yandex: "",
    pinterest: "",
  },
  indexNowKey: "46822c85822579eec5647124e3f618e3",
  agency: {
    name: "ThePieCraft Marketing",
    url: "https://thepiecraftmarketing.com",
  },
} as const;

export const OG_IMAGE = `${SITE.url}/og-share.jpg`;

export function absoluteUrl(path: string): string {
  if (!path) return SITE.url;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE.url}${path.startsWith("/") ? "" : "/"}${path}`;
}

export type SeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "product" | "article";
  keywords?: string[];
  noindex?: boolean;
};

/**
 * Returns React Router 7 / Remix meta descriptor array.
 */
/**
 * Clamp a meta description to what Google actually displays (~155-160 chars),
 * on a word boundary.
 *
 * The crawl found 17 pages over 165 characters. Google truncates those
 * mid-sentence with its own ellipsis, which usually cuts off the part that
 * carries the call to action. Clamping centrally means a long description
 * written anywhere degrades gracefully instead of needing every page fixed.
 */
export function clampDescription(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, clean.lastIndexOf(" ", max - 1));
  return cut.replace(/[\s,;:—-]+$/, "") + "…";
}

export function getSeoMeta({
  title,
  description,
  path,
  image = OG_IMAGE,
  type = "website",
  keywords,
  noindex,
}: SeoInput) {
  const url = absoluteUrl(path);
  const img = absoluteUrl(image);
  description = clampDescription(description);

  const metaList: Array<Record<string, string>> = [
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
    { tagName: "link", rel: "canonical", href: url },
    { tagName: "link", rel: "alternate", hrefLang: "en-IN", href: url },
    { tagName: "link", rel: "alternate", hrefLang: "x-default", href: url },
  ];

  if (keywords?.length) {
    metaList.push({ name: "keywords", content: keywords.join(", ") });
  }

  if (noindex) {
    metaList.push({ name: "robots", content: "noindex, nofollow" });
  }

  return metaList;
}

export function verificationMeta(): Record<string, string>[] {
  const { google, bing, yandex, pinterest } = SITE.verification;
  return [
    { name: "google-site-verification", content: google },
    { name: "msvalidate.01", content: bing },
    { name: "yandex-verification", content: yandex },
    { name: "p:domain_verify", content: pinterest },
  ].filter((tag) => tag.content && tag.content.length > 0);
}

export function productAltText(
  name: string,
  weave: string,
  view?: "front drape" | "palla detail" | "border detail" | "blouse piece" | "styled look",
): string {
  const viewPart = view ? `, ${view}` : "";
  return `${name} - ${weave} saree${viewPart} | ${SITE.name}`.slice(0, 125);
}

export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
