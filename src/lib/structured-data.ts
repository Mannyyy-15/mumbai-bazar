/**
 * schema.org JSON-LD builders.
 *
 * Google's 2026 merchant-listing/rich-result requirements need attribute-rich
 * Product markup (brand, sku, offers, shipping + return policy) rather than the
 * bare name/image/offers minimum, so the product builder emits the full set.
 */

import { SITE, absoluteUrl, OG_IMAGE } from "./seo";
import type { Product } from "./site-data";

const ORG_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;

/** Parses "₹ 18,900" into "18900.00" for schema price fields. */
export function priceToSchema(price: string): string {
  const n = Number(String(price).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n.toFixed(2) : "0.00";
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "OnlineStore"],
    "@id": ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: { "@type": "ImageObject", url: absoluteUrl("/logo-main.png") },
    image: OG_IMAGE,
    description: SITE.description,
    email: SITE.email,
    telephone: SITE.phone,
    currenciesAccepted: SITE.currency,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    sameAs: [...SITE.social],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SITE.phone,
        contactType: "customer service",
        email: SITE.email,
        areaServed: ["IN", "US", "GB", "AE", "CA", "AU", "SG"],
        availableLanguage: ["English", "Hindi", "Marathi"],
      },
    ],
    // Business policies — required for merchant listing rich results in 2026.
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "IN",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 7,
      returnMethod: "https://schema.org/ReturnByMail",
      returnFees: "https://schema.org/FreeReturn",
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Physical boutique — powers local-pack and "saree shop near me" visibility. */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": `${SITE.url}/#store`,
    name: `${SITE.name} Boutique Studio`,
    image: OG_IMAGE,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: "₹₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:00",
        closes: "20:00",
      },
    ],
    // Phase 1 (Vasai-Virar) through Phase 2 (Mumbai metro) catchment. Each named
    // city is a City entity so Google can match "saree shop in <city>" intent.
    areaServed: SITE.serviceAreas.map((city) => ({
      "@type": "City",
      name: city,
      containedInPlace: { "@type": "State", name: SITE.address.region },
    })),
    hasMap: `https://www.google.com/maps/search/?api=1&query=${SITE.geo.lat},${SITE.geo.lng}`,
    currenciesAccepted: SITE.currency,
    paymentAccepted: "Cash, UPI, Credit Card, Debit Card, Net Banking",
    parentOrganization: { "@id": ORG_ID },
    sameAs: [...SITE.social],
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function productSchema(p: Product) {
  const url = absoluteUrl(`/products/${p.id}`);
  const images = (p.details?.gallery?.length ? p.details.gallery : [p.img]).map(absoluteUrl);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: p.name,
    description:
      p.details?.description ??
      `${p.name} handwoven in ${p.weave}. Silk Mark certified, with a matching unstitched blouse piece.`,
    image: images,
    sku: p.id,
    mpn: p.id,
    url,
    brand: { "@type": "Brand", name: SITE.name },
    material: p.details?.fabric ?? p.weave,
    category: "Apparel & Accessories > Clothing > Traditional & Ceremonial Clothing > Sarees",
    isFamilyFriendly: true,
    // additionalProperty carries the spec table — this is what AI shopping
    // surfaces read when comparing products.
    additionalProperty: [
      { name: "Weave", value: p.weave },
      { name: "Fabric", value: p.details?.fabric },
      { name: "Drape", value: p.details?.drape },
      { name: "Blouse Piece", value: p.details?.blousePiece },
      { name: "Length", value: p.details?.length },
      { name: "Border", value: p.details?.border },
      { name: "Palla", value: p.details?.palla },
    ]
      .filter((a): a is { name: string; value: string } => Boolean(a.value))
      .map((a) => ({ "@type": "PropertyValue", name: a.name, value: a.value })),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: SITE.currency,
      price: priceToSchema(p.price),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": ORG_ID },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: SITE.currency,
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 6, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
  };
}

/** Collection/category listing — helps Google understand a browse page's inventory. */
export function itemListSchema(products: Product[], listName: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: listName,
    url: absoluteUrl(path),
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/products/${p.id}`),
        name: p.name,
      })),
    },
  };
}

/**
 * Per-locality store schema for the /saree-shop/<city> pages.
 *
 * Uses the real boutique address (a fabricated per-city address would be a
 * fake-location signal and risks a Google Business Profile penalty) while
 * declaring the specific neighbourhoods served, which is what actually earns
 * "saree shop near me" visibility in surrounding areas.
 */
export function localAreaSchema(city: string, nearby: string[], postalCode: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": `${SITE.url}/saree-shop/${city.toLowerCase().replace(/\s+/g, "-")}#store`,
    name: `${SITE.name} — Sarees in ${city}`,
    description: `Handwoven silk, Paithani and bridal sarees available in ${city} and nearby areas including ${nearby.join(", ")}.`,
    image: OG_IMAGE,
    url: `${SITE.url}/saree-shop/${city.toLowerCase().replace(/\s+/g, "-")}`,
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: "₹₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    areaServed: [city, ...nearby].map((name) => ({
      "@type": "City",
      name,
      containedInPlace: { "@type": "State", name: SITE.address.region },
    })),
    // Delivery-only catchment around the named locality.
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
      geoRadius: "25000",
      description: `Free saree delivery across ${city} ${postalCode} and surrounding areas.`,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:00",
        closes: "20:00",
      },
    ],
    parentOrganization: { "@id": ORG_ID },
    sameAs: [...SITE.social],
  };
}

/**
 * Editorial article schema for the /guides cluster.
 *
 * `speakable` marks the passages voice assistants read aloud, and the
 * author/publisher pair is the E-E-A-T signal Google weighs on YMYL-adjacent
 * commercial advice — a named human with stated expertise, not "Admin".
 */
export function articleSchema(a: {
  title: string;
  description: string;
  path: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  authorTitle: string;
  wordCount?: number;
}) {
  const url = absoluteUrl(a.path);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: a.title.slice(0, 110),
    description: a.description,
    image: absoluteUrl(a.image ?? "/logo-main.png"),
    url,
    datePublished: a.datePublished,
    dateModified: a.dateModified ?? a.datePublished,
    inLanguage: "en-IN",
    isPartOf: { "@id": WEBSITE_ID },
    author: {
      "@type": "Person",
      name: a.authorName,
      jobTitle: a.authorTitle,
      worksFor: { "@id": ORG_ID },
    },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(a.wordCount ? { wordCount: a.wordCount } : {}),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".answer-first", "h1"],
    },
  };
}

/**
 * HowTo schema for procedural guides (draping, washing, storing).
 * These win the step-by-step carousel and are heavily cited by voice and AI
 * assistants, which prefer enumerated instructions over prose.
 */
export function howToSchema(h: {
  name: string;
  description: string;
  path: string;
  totalTime?: string;
  supplies?: string[];
  steps: { name: string; text: string }[];
}) {
  const url = absoluteUrl(h.path);
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${url}#howto`,
    name: h.name,
    description: h.description,
    ...(h.totalTime ? { totalTime: h.totalTime } : {}),
    ...(h.supplies?.length
      ? { supply: h.supplies.map((s) => ({ "@type": "HowToSupply", name: s })) }
      : {}),
    step: h.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${url}#step-${i + 1}`,
    })),
  };
}

/**
 * Review aggregate for a product.
 *
 * Deliberately NOT called anywhere yet: emitting ratings that are not backed by
 * real, verifiable, on-page customer reviews is a manual-action risk. Wire this
 * in only once server-rendered reviews exist (see the reviews pipeline).
 */
export function withReviews(
  product: ReturnType<typeof productSchema>,
  reviews: { author: string; rating: number; body: string; date: string }[],
) {
  if (!reviews.length) return product;
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return {
    ...product,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avg.toFixed(1),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      datePublished: r.date,
      reviewBody: r.body,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })),
  };
}
