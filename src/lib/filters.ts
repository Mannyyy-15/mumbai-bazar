import type { Product } from "./site-data";

export type ColorFilterOption = {
  key: string;
  label: string;
  hex: string;
  border?: string;
  keywords: string[];
};

export const COLOR_OPTIONS: ColorFilterOption[] = [
  {
    key: "wine-maroon",
    label: "Wine & Maroon",
    hex: "#58111A",
    keywords: ["wine", "maroon", "burgundy", "oxblood", "shringar"],
  },
  {
    key: "red-crimson",
    label: "Red & Crimson",
    hex: "#A31D1D",
    keywords: ["red", "crimson", "sindoor", "lal", "vermilion"],
  },
  {
    key: "pink-rani",
    label: "Pink & Rani",
    hex: "#D63384",
    keywords: ["pink", "rani", "gulabi", "rose", "magenta", "blush"],
  },
  {
    key: "gold-yellow",
    label: "Gold & Mustard",
    hex: "#D4AF37",
    keywords: ["gold", "sunehri", "mustard", "haldi", "yellow", "golden"],
  },
  {
    key: "blue-peacock",
    label: "Blue & Peacock",
    hex: "#1A5276",
    keywords: ["blue", "neelam", "peacock", "indigo", "navy", "royal blue", "teal"],
  },
  {
    key: "green-emerald",
    label: "Green & Emerald",
    hex: "#196F3D",
    keywords: ["green", "emerald", "mehendi", "pista", "olive", "forest"],
  },
  {
    key: "coral-peach",
    label: "Coral & Rust",
    hex: "#E76F51",
    keywords: ["coral", "peach", "orange", "kesariya", "rust", "rustic", "kalamkari"],
  },
  {
    key: "purple-violet",
    label: "Purple & Violet",
    hex: "#6C3483",
    keywords: ["purple", "violet", "lavender", "jamuni", "plum", "royale"],
  },
  {
    key: "ivory-cream",
    label: "Ivory & Cream",
    hex: "#F5EFEB",
    border: "#C5A880",
    keywords: ["ivory", "cream", "white", "beige", "canvas", "off-white", "ecru"],
  },
  {
    key: "black-ebony",
    label: "Black & Midnight",
    hex: "#1A1A1A",
    border: "#444444",
    keywords: ["black", "ebony", "charcoal", "jet black", "kala", "dark"],
  },
];

/**
 * Maps any variant color name (e.g. "Red", "White", "Black", "Wine", "Navy") to
 * the best matching hex color and border for visual swatches.
 */
export function resolveColorSwatch(colorName: string): { name: string; hex: string; border?: string } {
  const clean = colorName.trim();
  const lower = clean.toLowerCase();

  // 1. Direct match in COLOR_OPTIONS keywords
  for (const c of COLOR_OPTIONS) {
    for (const kw of c.keywords) {
      if (lower.includes(kw)) {
        return {
          name: clean,
          hex: c.hex,
          border: c.border,
        };
      }
    }
  }

  // 2. Fallbacks for standard fashion colors
  if (lower.includes("black") || lower.includes("noir")) return { name: clean, hex: "#1A1A1A", border: "#444444" };
  if (lower.includes("white") || lower.includes("off white") || lower.includes("ivory")) return { name: clean, hex: "#F5EFEB", border: "#C5A880" };
  if (lower.includes("red") || lower.includes("crimson") || lower.includes("ruby")) return { name: clean, hex: "#A31D1D" };
  if (lower.includes("maroon") || lower.includes("wine") || lower.includes("burgundy")) return { name: clean, hex: "#58111A" };
  if (lower.includes("pink") || lower.includes("rose") || lower.includes("blush") || lower.includes("magenta")) return { name: clean, hex: "#D63384" };
  if (lower.includes("gold") || lower.includes("mustard") || lower.includes("yellow")) return { name: clean, hex: "#D4AF37" };
  if (lower.includes("green") || lower.includes("emerald") || lower.includes("olive") || lower.includes("mehendi")) return { name: clean, hex: "#196F3D" };
  if (lower.includes("blue") || lower.includes("navy") || lower.includes("royal") || lower.includes("peacock")) return { name: clean, hex: "#1A5276" };
  if (lower.includes("teal") || lower.includes("cyan")) return { name: clean, hex: "#0E8686" };
  if (lower.includes("purple") || lower.includes("violet") || lower.includes("lavender")) return { name: clean, hex: "#6C3483" };
  if (lower.includes("coral") || lower.includes("peach") || lower.includes("orange") || lower.includes("rust")) return { name: clean, hex: "#E76F51" };
  if (lower.includes("grey") || lower.includes("gray") || lower.includes("silver")) return { name: clean, hex: "#8E8E93", border: "#B0B0B5" };
  if (lower.includes("brown") || lower.includes("copper") || lower.includes("beige")) return { name: clean, hex: "#795548" };

  return { name: clean, hex: "#641F2A" };
}

export type TypeFilterOption = {
  key: string;
  label: string;
  match: (p: Product) => boolean;
};

export const TYPE_OPTIONS: TypeFilterOption[] = [
  {
    key: "wedding-bridal",
    label: "Wedding & Bridal Sarees",
    match: (p) =>
      p.category.includes("wedding-sarees") ||
      (p.name + " " + p.weave + " " + (p.details?.description || "")).toLowerCase().includes("wedding") ||
      (p.name + " " + p.weave).toLowerCase().includes("bridal"),
  },
  {
    key: "pure-silk",
    label: "Pure Silk Sarees",
    match: (p) =>
      p.category.includes("silk-sarees") ||
      (p.name + " " + p.weave).toLowerCase().includes("silk"),
  },
  {
    key: "festive-party",
    label: "Festive & Party Wear",
    match: (p) =>
      p.category.includes("festive-edit") ||
      (p.name + " " + p.weave).toLowerCase().includes("festive") ||
      (p.name + " " + p.weave).toLowerCase().includes("party"),
  },
  {
    key: "everyday-casual",
    label: "Everyday & Ready-to-Wear",
    match: (p) =>
      p.category.includes("everyday-sarees") ||
      (p.name + " " + p.weave).toLowerCase().includes("everyday") ||
      (p.name + " " + p.weave).toLowerCase().includes("daily") ||
      (p.name + " " + p.weave).toLowerCase().includes("casual"),
  },
  {
    key: "new-arrivals",
    label: "New Arrivals",
    match: (p) => p.category.includes("new-arrivals") || p.tag === "New",
  },
  {
    key: "bestsellers",
    label: "Best Sellers",
    match: (p) =>
      p.tag === "Bestseller" ||
      (p.name).toLowerCase().includes("meher") ||
      (p.name).toLowerCase().includes("sunehri") ||
      (p.name).toLowerCase().includes("rangrez"),
  },
];

export type FabricFilterOption = {
  key: string;
  label: string;
  match: (p: Product) => boolean;
};

export const FABRIC_OPTIONS: FabricFilterOption[] = [
  {
    key: "banarasi",
    label: "Pure Banarasi Silk",
    match: (p) =>
      (p.weave + " " + p.name + " " + (p.details?.fabric || "")).toLowerCase().includes("banarasi"),
  },
  {
    key: "kanjivaram",
    label: "Kanjivaram Silk",
    match: (p) =>
      (p.weave + " " + p.name + " " + (p.details?.fabric || "")).toLowerCase().includes("kanjivaram"),
  },
  {
    key: "paithani",
    label: "Paithani Weave",
    match: (p) =>
      (p.weave + " " + p.name + " " + (p.details?.fabric || "")).toLowerCase().includes("paithani"),
  },
  {
    key: "katan-mulberry",
    label: "Katan & Mulberry Silk",
    match: (p) => {
      const text = (p.weave + " " + p.name + " " + (p.details?.fabric || "")).toLowerCase();
      return text.includes("katan") || text.includes("mulberry") || text.includes("pure silk");
    },
  },
  {
    key: "cotton-silk",
    label: "Cotton Silk & Canvas",
    match: (p) =>
      (p.weave + " " + p.name + " " + (p.details?.fabric || "")).toLowerCase().includes("cotton"),
  },
  {
    key: "kalamkari-fusion",
    label: "Kalamkari Handblock Print",
    match: (p) =>
      (p.weave + " " + p.name + " " + (p.details?.fabric || "")).toLowerCase().includes("kalamkari"),
  },
  {
    key: "tissue-brocade",
    label: "Metallic Tissue & Zari",
    match: (p) => {
      const text = (p.weave + " " + p.name + " " + (p.details?.fabric || "")).toLowerCase();
      return text.includes("tissue") || text.includes("brocade") || text.includes("zari");
    },
  },
  {
    key: "soft-lightweight",
    label: "Soft Silk & Lightweight",
    match: (p) => {
      const text = (p.weave + " " + p.name + " " + (p.details?.fabric || "")).toLowerCase();
      return text.includes("soft") || text.includes("lightweight") || text.includes("contemporary");
    },
  },
];

export const PRICE_PRESETS = [
  { key: "u1k", label: "Under ₹ 1,000", min: 0, max: 999 },
  { key: "1k-5k", label: "₹ 1,000 – ₹ 5,000", min: 1000, max: 5000 },
  { key: "5k-15k", label: "₹ 5,000 – ₹ 15,000", min: 5000, max: 15000 },
  { key: "15k-30k", label: "₹ 15,000 – ₹ 30,000", min: 15000, max: 30000 },
  { key: "30kp", label: "Above ₹ 30,000", min: 30000, max: Infinity },
];

export function matchesColor(p: Product, colorKey: string): boolean {
  const color = COLOR_OPTIONS.find((c) => c.key === colorKey);
  if (!color) return false;
  const text = (p.name + " " + p.weave + " " + (p.details?.description || "") + " " + p.id).toLowerCase();
  return color.keywords.some((kw) => text.includes(kw));
}

export function parsePriceNumber(s?: string | number | null): number {
  if (typeof s === "number") return s;
  return Number(String(s || "").replace(/[^\d]/g, "")) || 0;
}
