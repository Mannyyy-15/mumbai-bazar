/**
 * Hyper-local landing page data.
 *
 * Each entry becomes /saree-shop/<slug>. Pages are deliberately differentiated
 * — distinct H1, intro, landmarks, occasions and weave emphasis — because a set
 * of near-identical city pages is the classic way local SEO turns into thin
 * doorway content and gets filtered out of the index.
 *
 * Rollout follows the phased plan: phase 1 = Vasai-Virar belt, phase 2 = wider
 * Mumbai metro. Only `published: true` locations are routed and put in the
 * sitemap, so phase 2 can ship when there is real copy behind it.
 */

export type Location = {
  slug: string;
  /** City name as locals search it. */
  city: string;
  /** Broader region, used in headings and schema. */
  region: string;
  phase: 1 | 2;
  published: boolean;
  postalCode: string;
  /** Neighbourhoods and nearby areas this page should also rank for. */
  nearby: string[];
  /** Recognisable local landmarks — these make the copy verifiably local. */
  landmarks: string[];
  /** Festivals and occasions that drive saree demand in this area. */
  occasions: string[];
  /** Weaves with genuine local pull, used to slant the copy. */
  weaves: string[];
  /** One-paragraph, locality-specific intro. */
  intro: string;
};

export const LOCATIONS: Location[] = [
  {
    slug: "vasai",
    city: "Vasai",
    region: "Vasai-Virar, Maharashtra",
    phase: 1,
    published: true,
    postalCode: "401202",
    nearby: ["Vasai West", "Vasai East", "Papdi", "Manickpur", "Ambadi Road"],
    landmarks: ["Vasai Fort", "Ambadi Road market", "Vasai railway station"],
    occasions: ["Ganesh Chaturthi", "Diwali", "Gudi Padwa", "wedding season"],
    weaves: ["Paithani", "Banarasi", "Kanjivaram"],
    intro:
      "Our home boutique sits on Ambadi Road in Vasai West, a short walk from Vasai station. Vasai shoppers come to us for Paithani sarees ahead of Gudi Padwa and Ganesh Chaturthi, and for full bridal trousseaux through the winter wedding season. Every saree can be seen, draped and compared in daylight before you buy.",
  },
  {
    slug: "virar",
    city: "Virar",
    region: "Vasai-Virar, Maharashtra",
    phase: 1,
    published: true,
    postalCode: "401303",
    nearby: ["Virar West", "Virar East", "Agashi", "Arnala", "Bolinj"],
    landmarks: ["Virar railway station", "Jivdani Temple", "Agashi Road"],
    occasions: ["Navratri", "Diwali", "Jivdani yatra", "wedding season"],
    weaves: ["Paithani", "soft silk", "tissue silk"],
    intro:
      "Virar families shop with us for festive drapes around Navratri and the Jivdani yatra, and for lightweight soft silks that hold up to a long day out. We deliver across Virar West and East, Agashi and Bolinj, usually the same day, and offer WhatsApp video drapes if you would rather choose from home.",
  },
  {
    slug: "nalasopara",
    city: "Nalasopara",
    region: "Vasai-Virar, Maharashtra",
    phase: 1,
    published: true,
    postalCode: "401209",
    nearby: ["Nalasopara West", "Nalasopara East", "Achole", "Tulinj Road"],
    landmarks: ["Nalasopara railway station", "Tulinj Road", "Achole Road"],
    occasions: ["Ganesh Chaturthi", "Diwali", "Navratri", "engagements"],
    weaves: ["cotton silk", "soft silk", "Banarasi"],
    intro:
      "Nalasopara shoppers tend to want two things at once: an everyday saree that survives a commute, and something genuinely special for the festival calendar. We stock both — easy-care cotton silks alongside handwoven Banarasi — with free delivery across Nalasopara East and West.",
  },
  {
    slug: "mira-bhayandar",
    city: "Mira-Bhayandar",
    region: "Thane, Maharashtra",
    phase: 1,
    published: true,
    postalCode: "401107",
    nearby: ["Mira Road", "Bhayandar West", "Bhayandar East", "Kashimira"],
    landmarks: ["Mira Road station", "Bhayandar station", "Maxus Mall"],
    occasions: ["Diwali", "Navratri", "Gujarati wedding season"],
    weaves: ["Bandhani", "Banarasi", "Kanjivaram"],
    intro:
      "Mira Road and Bhayandar have a strong Gujarati and Marwari community, and it shows in what sells: Bandhani, bright Banarasi and heavier bridal silks through the wedding months. We deliver across Mira Road, Kashimira and both sides of Bhayandar.",
  },
  // ---- Phase 2: wider Mumbai metro. Unpublish-until-real-copy. ----
  {
    slug: "borivali",
    city: "Borivali",
    region: "Mumbai Western Suburbs",
    phase: 2,
    published: false,
    postalCode: "400092",
    nearby: ["Borivali West", "Borivali East", "Kandivali"],
    landmarks: ["Borivali station", "Sanjay Gandhi National Park"],
    occasions: ["Diwali", "Navratri"],
    weaves: ["Banarasi", "Kanjivaram"],
    intro: "",
  },
  {
    slug: "dadar",
    city: "Dadar",
    region: "Central Mumbai",
    phase: 2,
    published: false,
    postalCode: "400028",
    nearby: ["Dadar West", "Shivaji Park", "Matunga"],
    landmarks: ["Dadar station", "Shivaji Park"],
    occasions: ["Gudi Padwa", "Ganesh Chaturthi"],
    weaves: ["Paithani", "Nauvari"],
    intro: "",
  },
  {
    slug: "thane",
    city: "Thane",
    region: "Thane, Maharashtra",
    phase: 2,
    published: false,
    postalCode: "400601",
    nearby: ["Thane West", "Ghodbunder Road"],
    landmarks: ["Thane station", "Viviana Mall"],
    occasions: ["Diwali", "wedding season"],
    weaves: ["Paithani", "silk"],
    intro: "",
  },
];

export const PUBLISHED_LOCATIONS = LOCATIONS.filter((l) => l.published);

export function getLocation(slug: string): Location | undefined {
  return PUBLISHED_LOCATIONS.find((l) => l.slug === slug);
}
