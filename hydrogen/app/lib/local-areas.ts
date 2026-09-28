/**
 * Area landing pages — the layer between the brand and the individual outlets.
 *
 * Why this file exists
 * --------------------
 * Search Console (30 Aug – 6 Sep 2026) showed 799 impressions, of which ~442
 * were the brand name. Every remaining local query scored ZERO impressions:
 * "saree shop vasai virar", "saree shop near me" and "best saree shop
 * nalasopara" had no eligible URL on this site at all.
 *
 * The outlet pages (/stores/<slug>) rank for a single branch. But nobody
 * searches "Virar West saree shop" — they search "saree shop in vasai virar",
 * because Vasai-Virar is one municipal corporation and locals treat the belt as
 * one place. That query had no page. This is that page.
 *
 * The distinction that matters:
 *   /stores/<slug>       one shop, one address, NAP + directions. Transactional.
 *   /sarees-in-<area>    the belt: comparison, price bands, which branch for
 *                        what. Research intent — which is where AI Overviews
 *                        and "best X in Y" queries actually resolve.
 *
 * Every page must carry detail only someone who trades here would know: station
 * names, honest market comparisons, real price bands. Near-identical area pages
 * differing by a place name are doorway pages and get filtered wholesale.
 */

import { OUTLETS, type Outlet } from "./locations";
import { SITE } from "./seo";

export type PriceBand = {
  label: string;
  range: string;
  /** What the customer actually gets in this band. Concrete, not adjectives. */
  what: string;
};

export type LocalArea = {
  slug: string;
  /** How people search it, e.g. "Vasai Virar". Drives H1 and title. */
  name: string;
  /** Formal/administrative name, used once in the body for entity clarity. */
  formalName: string;
  region: string;
  /** Outlet slugs serving this area, nearest-first. */
  outletSlugs: string[];
  /** Localities this page legitimately covers. */
  covers: string[];
  /** Railway stations — the primary way people navigate this belt. */
  stations: string[];
  title: string;
  description: string;
  keywords: string[];
  /** Direct 40-60 word answer. This is the AI-extractable passage. */
  answer: string;
  /** Body paragraphs under the answer. */
  intro: string[];
  priceBands: PriceBand[];
  /** Honest comparison against the alternatives a local would consider. */
  comparison: { caption: string; headers: string[]; rows: string[][] };
  /** Questions real searchers ask about buying here. */
  faqs: { q: string; a: string }[];
};

export const LOCAL_AREAS: LocalArea[] = [
  {
    slug: "vasai-virar",
    name: "Vasai Virar",
    formalName: "the Vasai-Virar City Municipal Corporation belt",
    region: "Palghar, Maharashtra",
    outletSlugs: ["nalasopara", "virar"],
    covers: [
      "Nalasopara East",
      "Nalasopara West",
      "Virar East",
      "Virar West",
      "Vasai East",
      "Vasai West",
      "Naigaon",
      "Achole",
      "Tulinj",
      "Bolinj",
      "Agashi",
      "Papdi",
      "Manickpur",
    ],
    stations: ["Vasai Road", "Nalasopara", "Virar", "Naigaon"],
    title: "Saree Shops in Vasai Virar — Bridal, Party Wear & Dress Material | Mumbai Bazar",
    description: `Looking for a saree shop in Vasai Virar? Mumbai Bazar has stores at Nalasopara East (Tulinj Road) and Virar West (Gaothan Road). Sarees from ₹800, dulhan wear, lehengas and dress material. ${SITE.hours.shortDaily}.`,
    keywords: [
      "saree shop in vasai virar",
      "best saree shop in vasai virar",
      "saree shop near me",
      "saree shop nalasopara",
      "saree shop virar",
      "bridal saree vasai virar",
      "lehenga shop vasai virar",
      "dress material shop nalasopara",
      "dulhan saree virar",
      "party wear saree vasai",
    ],
    answer: `Mumbai Bazar runs two saree stores in the Vasai-Virar belt: Nalasopara East on Tulinj Road near the flyover, and Virar West on Gaothan Road next to Corporation Bank. Both stock fancy and party wear sarees, dress material, designer lehengas and dulhan wear. Sarees start around ₹800. ${SITE.hours.sentence}.`,
    intro: [
      "Vasai, Virar and Nalasopara sit on one stretch of the Western line, and most people here shop across all three rather than sticking to their own station. A customer in Naigaon will come up to Nalasopara for a wedding purchase; someone in Agashi will come down to Virar West. So it helps to know what each market is actually good for before spending a Sunday on it.",
      "Nalasopara East is the busiest of the three for ethnic wear. The stretch along Tulinj Road, from the flyover towards Achole, is where most of the saree and dress material trade sits, and it is where you will find the widest bridal range. Virar West's Gaothan Road is smaller and quicker to get through — better if you already know roughly what you want. Vasai West around Manickpur leans towards readymade and daily wear more than heavy occasion pieces.",
      "Our Nalasopara East shop is the flagship and holds the largest selection in the group, including the bridal and dulhan range. The Virar West shop has been on Gaothan Road since 2009 and turns over more party wear and festive pieces, particularly around Navratri and the Jivdani yatra.",
    ],
    priceBands: [
      {
        label: "Everyday and office",
        range: "₹800 – ₹2,000",
        what: "Cotton blends, printed georgette and light synthetic sarees. Easy to wash, no dry-clean bills, fine for daily wear and office.",
      },
      {
        label: "Party wear and festive",
        range: "₹2,000 – ₹6,000",
        what: "Fancy sarees with sequin, zari or embroidery work. Net, organza, satin and silk blends. What most people buy for a function, for Diwali, or for a family wedding they are attending.",
      },
      {
        label: "Designer lehengas",
        range: "₹5,000 – ₹15,000",
        what: "Semi-stitched and readymade lehengas with heavier work. Sangeet, mehendi, reception and engagement wear.",
      },
      {
        label: "Dulhan and bridal",
        range: "₹12,000 – ₹40,000+",
        what: "Heavy bridal sarees and lehengas — dense zari, hand embroidery, stone and dori work. The widest range sits at Nalasopara East.",
      },
    ],
    comparison: {
      caption: "Where to shop for sarees in the Vasai-Virar belt",
      headers: ["Market", "Best for", "Typical range", "Getting there"],
      rows: [
        [
          "Nalasopara East (Tulinj Road)",
          "Bridal and dulhan, dress material, widest overall choice",
          "₹800 – ₹40,000+",
          "10 min from Nalasopara station, east side",
        ],
        [
          "Virar West (Gaothan Road)",
          "Party wear, festive sarees, quick focused trips",
          "₹800 – ₹15,000",
          "Walking distance from Virar station, west side",
        ],
        [
          "Vasai West (Manickpur)",
          "Readymade and daily wear more than occasion pieces",
          "₹500 – ₹6,000",
          "Auto from Vasai Road station",
        ],
        [
          "Borivali / Kandivali",
          "Bigger branded showrooms, higher prices",
          "₹3,000 – ₹60,000+",
          "30 – 50 min by train from Virar",
        ],
        [
          "Dadar / Girgaon (South Mumbai)",
          "Traditional silk houses, widest Kanjivaram and Paithani",
          "₹6,000 – ₹1,00,000+",
          "1.5 – 2 hrs by train from Virar",
        ],
      ],
    },
    faqs: [
      {
        q: "Which is the best saree shop in Vasai Virar?",
        a: `It depends on what you are buying. For bridal and dulhan sarees the Nalasopara East market has the deepest range, and our flagship on Tulinj Road carries the widest selection in our group. For party wear and festive sarees on a quicker trip, Virar West's Gaothan Road is easier to get through. ${SITE.hours.sentence}.`,
      },
      {
        q: "What is the price of a saree in Nalasopara or Virar?",
        a: "Everyday cotton and printed sarees start around ₹800. Party wear and festive pieces with zari or embroidery work sit between ₹2,000 and ₹6,000. Designer lehengas run ₹5,000 to ₹15,000. Heavy dulhan and bridal pieces start around ₹12,000 and go well past ₹40,000 depending on the work.",
      },
      {
        q: "Where can I buy a bridal saree in Vasai Virar?",
        a: "Our Nalasopara East store on Tulinj Road, near the flyover and opposite Seema Complex, holds the largest bridal and dulhan range across our eight stores. It is where most customers come to compare pieces side by side before a wedding. Call +91 89566 64631 before coming if you want a specific colour or budget kept ready.",
      },
      {
        q: "Which saree shop is nearest to Nalasopara station?",
        a: "Our Nalasopara East store is on Tulinj Road by the flyover bridge, opposite Seema Complex — about ten minutes from Nalasopara station on the east side, reachable by auto or on foot.",
      },
      {
        q: "Which saree shop is near Virar station?",
        a: "Our Virar West store is at Shop No. C-1, Padma Colony Building on Gaothan Road, near the MSEB office and next to Corporation Bank. It is within walking distance of Virar station on the west side.",
      },
      {
        q: "Do saree shops in Vasai Virar stay open on Sunday?",
        a: `Ours do. ${SITE.hours.sentence}, including Sunday. Sunday is the busiest day on this belt, so mornings are calmer if you want time to look through pieces properly.`,
      },
      {
        q: "Do you stitch the blouse, and how long does it take?",
        a: "Yes, blouse stitching and fall-and-pico are arranged in store. Turnaround is usually a few days, depending on the work and how busy the wedding season is. Tell us the date you need it for when you buy and we will confirm what is possible.",
      },
      {
        q: "Is it cheaper to buy a saree in Vasai Virar than in Mumbai city?",
        a: "For everyday and party wear, generally yes — overheads on this belt are lower than in Dadar or Borivali, and the same fancy saree usually costs less here. For traditional silks like Kanjivaram and Paithani, the specialist houses in Dadar and Girgaon carry more depth, so the trade-off is price against range.",
      },
    ],
  },
];

export function getLocalArea(slug: string): LocalArea | undefined {
  return LOCAL_AREAS.find((a) => a.slug === slug);
}

/** The published outlets serving an area, in the order listed. */
export function areaOutlets(area: LocalArea): Outlet[] {
  return area.outletSlugs
    .map((slug) => OUTLETS.find((o) => o.slug === slug))
    .filter((o): o is Outlet => Boolean(o?.published && o?.verified));
}
