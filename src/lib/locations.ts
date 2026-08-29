/**
 * Outlet network data.
 *
 * Mumbai Bazar runs eight stores across the Vasai-Virar belt, Bhayandar and
 * Goregaon. Nalasopara East is the flagship and carries the strongest review
 * base, so it is the primary entity: it holds the canonical NAP, and the other
 * outlets reference it as their parent.
 *
 * Two rules this file exists to enforce:
 *
 * 1. Only outlets with a REAL, verified street address are `published`. Google
 *    cross-checks location pages against Google Business Profile, and inventing
 *    an address to fill out the map is what gets a GBP suspended. Addresses
 *    marked `verified: false` are placeholders and stay off the site.
 *
 * 2. Every page is differentiated by genuine local detail (landmark, nearby
 *    areas, what actually sells there). Eight near-identical outlet pages read
 *    as doorway content and get filtered wholesale.
 */

export type Outlet = {
  slug: string;
  /** Locality as customers search it. */
  city: string;
  /** Sub-area, e.g. "Nalasopara East". Used in headings and schema. */
  area: string;
  region: string;
  /** The flagship carries the canonical NAP and the main review base. */
  flagship: boolean;
  /**
   * True only when the street address below is confirmed from a live listing.
   * Unverified outlets are excluded from the site and the sitemap.
   */
  verified: boolean;
  published: boolean;
  street: string;
  landmark: string;
  postalCode: string;
  phone?: string;
  instagram?: string;
  /** Live listing this NAP was taken from, so it can be re-checked. */
  sourceUrl?: string;
  nearby: string[];
  landmarks: string[];
  occasions: string[];
  /** What this outlet is actually known for locally. */
  specialities: string[];
  intro: string;
};

export const OUTLETS: Outlet[] = [
  {
    slug: "nalasopara",
    city: "Nalasopara",
    area: "Nalasopara East",
    region: "Palghar, Maharashtra",
    flagship: true,
    verified: true,
    published: true,
    street: "Shop 1, Tiwari Nagar, Tulinj Road",
    landmark: "Near Flyover Bridge, opposite Seema Complex",
    postalCode: "401209",
    phone: "+91 89566 64631",
    instagram: "https://www.instagram.com/mumbai__bazar__nalasopara/",
    sourceUrl:
      "https://www.justdial.com/Palghar/Mumbai-Bazar-Near-Flyover-Bridge-Opposite-Seema-Complex-Tiwari-Nagar-Nalasopara-East/022PXX22-XX22-150424145850-M5F3_BZDET",
    nearby: ["Nalasopara East", "Nalasopara West", "Tulinj Road", "Achole", "Santosh Bhuvan"],
    landmarks: ["Nalasopara flyover bridge", "Seema Complex", "Nalasopara railway station"],
    occasions: ["wedding season", "Diwali", "Navratri", "Ganesh Chaturthi"],
    specialities: [
      "Dulhan and bridal sarees",
      "Designer lehengas",
      "Party wear sarees",
      "Dress material",
    ],
    intro:
      "Our flagship store sits on Tulinj Road by the Nalasopara flyover, opposite Seema Complex. It carries the widest range in the group — bridal and dulhan sarees, designer lehengas, party wear and dress material — and it is where most customers come to compare pieces side by side before a wedding.",
  },
  {
    slug: "virar",
    city: "Virar",
    area: "Virar West",
    region: "Palghar, Maharashtra",
    flagship: false,
    verified: true,
    published: true,
    street: "Shop No. C-1, Padma Colony Building, Gaothan Road",
    landmark: "Near MSEB Office, next to Corporation Bank",
    postalCode: "401303",
    sourceUrl:
      "https://www.justdial.com/Palghar/Mumbai-Bazaar-Nearby-MSEB-Office-Next-to-Corporation-Bank-Virar-West/022PXX22-XX22-130328135019-X2R6_BZDET",
    nearby: ["Virar West", "Virar East", "Agashi", "Bolinj", "Narangi"],
    landmarks: ["Virar railway station", "Corporation Bank, Gaothan Road", "Jivdani Temple"],
    occasions: ["Navratri", "Diwali", "Jivdani yatra", "wedding season"],
    specialities: ["Party wear sarees", "Dress material", "Fancy sarees", "Festive lehengas"],
    intro:
      "Our Virar West store on Gaothan Road, next to Corporation Bank, has served the area since 2009. Virar shoppers come to us for festive drapes around Navratri and the Jivdani yatra, and for party wear that works for a long day out.",
  },
  {
    slug: "bhayandar",
    city: "Bhayandar",
    area: "Bhayandar East",
    region: "Thane, Maharashtra",
    flagship: false,
    verified: true,
    published: true,
    street: "Talao Road",
    landmark: "Opposite Ujwal Book Depot",
    postalCode: "401105",
    phone: "+91 92442 42819",
    instagram: "https://www.instagram.com/mumbai_bazar__bhayandar_/",
    nearby: ["Bhayandar East", "Bhayandar West", "Mira Road", "Kashimira", "Kharigaon"],
    landmarks: ["Ujwal Book Depot, Talao Road", "Bhayandar railway station", "Maxus Mall"],
    occasions: ["Diwali", "Navratri", "Gujarati wedding season"],
    specialities: ["Fancy sarees", "Dress material", "Designer lehengas", "Dulhan sarees"],
    intro:
      "Our Bhayandar East store on Talao Road, opposite Ujwal Book Depot, serves a largely Gujarati and Marwari community — which shows in what moves fastest here: bright fancy sarees, designer lehengas and heavier bridal pieces through the wedding months.",
  },
  {
    slug: "goregaon",
    city: "Goregaon",
    area: "Goregaon West",
    region: "Mumbai Suburban, Maharashtra",
    flagship: false,
    verified: true,
    published: true,
    street: "Kakaji Nagar, Jawahar Nagar",
    landmark: "Near Goregaon West Station Road",
    postalCode: "400104",
    sourceUrl:
      "https://www.justdial.com/Mumbai/Mumbai-Bazar-Saree-Shop-Near-Goregaw-West-Goregaon-West/022PXX22-XX22-240227220417-I4Y7_BZDET",
    nearby: ["Goregaon West", "Goregaon East", "Malad", "Jogeshwari", "Ram Mandir"],
    landmarks: ["Goregaon West station", "Jawahar Nagar", "Station Road"],
    occasions: ["Diwali", "Navratri", "Ganesh Chaturthi", "wedding season"],
    specialities: ["Party wear sarees", "Fancy sarees", "Dress material"],
    intro:
      "Our Goregaon West store near Station Road is the group's foothold in the western suburbs, and the most convenient branch for customers coming from Malad, Jogeshwari and Ram Mandir.",
  },

  // ---------------------------------------------------------------------------
  // Remaining outlets. The client has confirmed these exist (2 Virar, 2
  // Nalasopara, 2 Vasai) but the exact street addresses are not yet verified
  // against a live listing, so they stay unpublished rather than shipping a
  // guessed address that would conflict with Google Business Profile.
  // ---------------------------------------------------------------------------
  {
    slug: "vasai",
    city: "Vasai",
    area: "Vasai West",
    region: "Palghar, Maharashtra",
    flagship: false,
    verified: false,
    published: false,
    street: "",
    landmark: "",
    postalCode: "401202",
    nearby: ["Vasai West", "Vasai East", "Papdi", "Manickpur"],
    landmarks: ["Vasai railway station", "Vasai Fort"],
    occasions: ["Gudi Padwa", "Ganesh Chaturthi", "Diwali"],
    specialities: ["Fancy sarees", "Dress material"],
    intro: "",
  },
];

/** Only outlets with a verified address are routed and indexed. */
export const PUBLISHED_OUTLETS = OUTLETS.filter((o) => o.published && o.verified);

export const FLAGSHIP = PUBLISHED_OUTLETS.find((o) => o.flagship) ?? PUBLISHED_OUTLETS[0];

export function getOutlet(slug: string): Outlet | undefined {
  return PUBLISHED_OUTLETS.find((o) => o.slug === slug);
}

/** Total store count, including outlets not yet published as pages. */
export const OUTLET_COUNT = 8;
