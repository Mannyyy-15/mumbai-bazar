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

  // 1. Direct match for ethnic shade names
  if (lower.includes("bottle green")) return { name: clean, hex: "#004225" };
  if (lower.includes("rama") || lower.includes("firozi") || lower.includes("turquoise")) return { name: clean, hex: "#008B8B" };
  if (lower.includes("rani")) return { name: clean, hex: "#E71D73" };
  if (lower.includes("navy")) return { name: clean, hex: "#0B1D51" };
  if (lower.includes("wine")) return { name: clean, hex: "#58111A" };
  if (lower.includes("maroon")) return { name: clean, hex: "#63101E" };
  if (lower.includes("magenta")) return { name: clean, hex: "#C2185B" };

  // 2. Direct match in COLOR_OPTIONS keywords
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

  // 3. Fallbacks for standard fashion colors
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
  { key: "1k-3k", label: "₹ 1,000 – ₹ 3,000", min: 1000, max: 3000 },
  { key: "3k-5k", label: "₹ 3,000 – ₹ 5,000", min: 3000, max: 5000 },
];

export function matchesColor(p: Product, colorKey: string): boolean {
  // Check dynamic color match first
  if (matchesDynamicColor(p, colorKey)) return true;
  const color = COLOR_OPTIONS.find((c) => c.key === colorKey);
  if (!color) return false;
  const text = (p.name + " " + p.weave + " " + (p.details?.description || "") + " " + p.id).toLowerCase();
  return color.keywords.some((kw) => text.includes(kw));
}

export type DynamicColorFilterOption = {
  key: string;
  label: string;
  hex: string;
  border?: string;
  count: number;
};

/**
 * Extracts all authentic colors for a product based on its Shopify variants,
 * options, or garment title (for single-variant products).
 */
export function getProductColors(p: Product): string[] {
  const colors: string[] = [];

  // 1. Explicit variants from Shopify
  if (p.variants && Array.isArray(p.variants)) {
    for (const v of p.variants) {
      if (v.color && v.color.trim().toLowerCase() !== "default title") {
        colors.push(v.color.trim());
      } else if (v.selectedOptions && Array.isArray(v.selectedOptions)) {
        for (const opt of v.selectedOptions) {
          if (/colou?r/i.test(opt.name) && opt.value) {
            colors.push(opt.value.trim());
          }
        }
      } else if (v.title && v.title.trim().toLowerCase() !== "default title") {
        colors.push(v.title.split("/")[0].trim());
      }
    }
  }

  // 2. Product options from Shopify
  if (p.options && Array.isArray(p.options)) {
    for (const opt of p.options) {
      if (/colou?r/i.test(opt.name) && Array.isArray(opt.values)) {
        for (const val of opt.values) {
          if (val) colors.push(val.trim());
        }
      }
    }
  }

  // 3. For single-variant products without explicit variant options, identify primary saree color
  if (colors.length === 0) {
    const text = `${p.name} ${p.id} ${p.weave || ""}`.toLowerCase();
    const colorRules: Array<[string, string[]]> = [
      ["Bottle Green", ["bottle green"]],
      ["Rama", ["rama"]],
      ["Navy Blue", ["navy blue", "navy"]],
      ["Turquoise", ["turquoise", "neel tarang"]],
      ["Blue", ["blue", "neelam"]],
      ["Rani", ["rani"]],
      ["Magenta", ["magenta"]],
      ["Pink", ["pink", "gulabi"]],
      ["Wine", ["wine"]],
      ["Maroon", ["maroon"]],
      ["Red", ["red", "sindoori", "lal"]],
      ["Rust", ["rust"]],
      ["Orange", ["orange", "kesarika"]],
      ["Yellow", ["yellow", "rangbahar"]],
      ["Gold", ["gold", "sunehri"]],
      ["Green", ["green"]],
      ["Purple", ["purple"]],
      ["Black", ["black", "shyamali"]],
      ["White", ["white", "ivory", "cream", "off-white"]],
    ];

    for (const [label, kws] of colorRules) {
      if (kws.some((kw) => text.includes(kw))) {
        colors.push(label);
        break;
      }
    }
  }

  // Return unique colors preserving order
  return Array.from(new Set(colors));
}

/**
 * Dynamically derives available color filter options directly from the products catalogue.
 * No hardcoded color list; each color reflects live Shopify variants and items.
 */
export function getDynamicColorOptions(products: Product[]): DynamicColorFilterOption[] {
  const colorMap = new Map<string, { label: string; count: number }>();

  for (const p of products) {
    const pColors = getProductColors(p);
    for (const raw of pColors) {
      const key = raw.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const existing = colorMap.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        colorMap.set(key, { label: raw, count: 1 });
      }
    }
  }

  const result: DynamicColorFilterOption[] = [];
  for (const [key, { label, count }] of colorMap.entries()) {
    const resolved = resolveColorSwatch(label);
    result.push({
      key,
      label,
      hex: resolved.hex,
      border: resolved.border,
      count,
    });
  }

  // Sort by product count descending (most popular colors first), then alphabetically
  return result.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function matchesDynamicColor(p: Product, colorKey: string): boolean {
  const pColors = getProductColors(p);
  const targetKey = colorKey.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return pColors.some((c) => {
    const cKey = c.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return cKey === targetKey || cKey.includes(targetKey) || targetKey.includes(cKey);
  });
}

export function parsePriceNumber(s?: string | number | null): number {
  if (typeof s === "number") return s;
  return Number(String(s || "").replace(/[^\d]/g, "")) || 0;
}
