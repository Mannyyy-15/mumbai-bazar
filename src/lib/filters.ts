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
    keywords: ["gold", "sunehri", "mustard", "haldi", "yellow", "zari", "golden"],
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
];

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
