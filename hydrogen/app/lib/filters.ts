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

export type SwatchResolution = {
  name: string;
  hex: string;
  secondaryHex?: string;
  isDual?: boolean;
  border?: string;
};

/**
 * Resolves an individual shade name to its curated hex and border.
 */
function resolveSingleColorSwatch(colorName: string): { name: string; hex: string; border?: string } {
  const clean = colorName.trim();
  const lower = clean.toLowerCase();

  // 1. Direct match for multi-word and ethnic shades
  if (lower.includes("dark red") || lower.includes("deep red")) return { name: clean, hex: "#7D0A14" };
  if (lower.includes("bottle green")) return { name: clean, hex: "#004225" };
  if (lower.includes("olive green")) return { name: clean, hex: "#556B2F" };
  if (lower.includes("emerald green") || lower.includes("emerald")) return { name: clean, hex: "#0D5C3A" };
  if (lower.includes("teal green")) return { name: clean, hex: "#006D6D" };
  if (lower.includes("teal") || lower.includes("cyan") || lower.includes("sea green")) return { name: clean, hex: "#008080" };
  if (lower.includes("rama") || lower.includes("firozi") || lower.includes("turquoise")) return { name: clean, hex: "#008B8B" };
  if (lower.includes("navy blue") || lower.includes("navy")) return { name: clean, hex: "#0B1D51" };
  if (lower.includes("royal blue")) return { name: clean, hex: "#1A365D" };
  if (lower.includes("peacock blue")) return { name: clean, hex: "#1A5276" };
  if (lower.includes("royal purple")) return { name: clean, hex: "#4B1E6D" };
  if (lower.includes("plum purple") || lower.includes("plum")) return { name: clean, hex: "#5C1D49" };
  if (lower.includes("golden yellow")) return { name: clean, hex: "#E5A91E" };
  if (lower.includes("cream gold")) return { name: clean, hex: "#D4AF37", border: "#C5A880" };
  if (lower.includes("slate grey") || lower.includes("slate gray") || lower.includes("slate")) return { name: clean, hex: "#708090", border: "#94A3B8" };
  if (lower.includes("off white") || lower.includes("off-white")) return { name: clean, hex: "#F5EFEB", border: "#C5A880" };
  if (lower.includes("rani")) return { name: clean, hex: "#E71D73" };
  if (lower.includes("magenta")) return { name: clean, hex: "#C2185B" };
  if (lower.includes("wine")) return { name: clean, hex: "#58111A" };
  if (lower.includes("maroon")) return { name: clean, hex: "#63101E" };
  if (lower.includes("red") || lower.includes("crimson") || lower.includes("sindoori")) return { name: clean, hex: "#A31D1D" };
  if (lower.includes("pink") || lower.includes("rose") || lower.includes("blush")) return { name: clean, hex: "#D63384" };
  if (lower.includes("gold") || lower.includes("sunehri")) return { name: clean, hex: "#D4AF37" };
  if (lower.includes("yellow") || lower.includes("haldi") || lower.includes("mustard")) return { name: clean, hex: "#EAB308" };
  if (lower.includes("orange") || lower.includes("kesarika") || lower.includes("kesariya")) return { name: clean, hex: "#E65100" };
  if (lower.includes("rust") || lower.includes("rustic")) return { name: clean, hex: "#C0392B" };
  if (lower.includes("peach") || lower.includes("coral") || lower.includes("apricot")) return { name: clean, hex: "#E76F51" };
  if (lower.includes("green") || lower.includes("mehendi") || lower.includes("pista")) return { name: clean, hex: "#196F3D" };
  if (lower.includes("blue") || lower.includes("neelam")) return { name: clean, hex: "#1A5276" };
  if (lower.includes("purple") || lower.includes("violet") || lower.includes("jamuni")) return { name: clean, hex: "#6C3483" };
  if (lower.includes("lavender") || lower.includes("lilac") || lower.includes("mauve")) return { name: clean, hex: "#967BB6" };
  if (lower.includes("black") || lower.includes("ebony") || lower.includes("shyamali")) return { name: clean, hex: "#1A1A1A", border: "#444444" };
  if (lower.includes("grey") || lower.includes("gray") || lower.includes("silver") || lower.includes("ash") || lower.includes("charcoal")) return { name: clean, hex: "#8E8E93", border: "#B0B0B5" };
  if (lower.includes("white") || lower.includes("ivory")) return { name: clean, hex: "#F5EFEB", border: "#C5A880" };
  if (lower.includes("beige") || lower.includes("cream") || lower.includes("chikoo") || lower.includes("khaki") || lower.includes("sand")) return { name: clean, hex: "#D9C8B4", border: "#C5B29B" };
  if (lower.includes("brown") || lower.includes("copper") || lower.includes("tan") || lower.includes("chocolate") || lower.includes("coffee")) return { name: clean, hex: "#795548", border: "#5D4037" };
  if (lower.includes("multi") || lower.includes("rainbow")) return { name: clean, hex: "#A27633", border: "#D4AF37" };

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

  return { name: clean, hex: "#641F2A" };
}

/**
 * Maps any color name (single or dual, e.g. "Dark Red & Black", "Emerald Green & Red", "Wine")
 * to the best matching hex colors and split diagonal styling for visual swatches.
 */
export function resolveColorSwatch(colorName: string): SwatchResolution {
  const clean = colorName.trim();
  const dualParts = clean.split(/\s+(?:&|and)\s+/i);

  if (dualParts.length >= 2) {
    const part1 = resolveSingleColorSwatch(dualParts[0]);
    const part2 = resolveSingleColorSwatch(dualParts[1]);
    return {
      name: clean,
      hex: part1.hex,
      secondaryHex: part2.hex,
      isDual: true,
      border: part1.border || part2.border || undefined,
    };
  }

  return resolveSingleColorSwatch(clean);
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
      (p.weave + " " + p.name + " " + (p.details?.fabric || "") + " " + (p.tags || []).join(" ")).toLowerCase().includes("banarasi"),
  },
  {
    key: "kanjivaram",
    label: "Kanjivaram Silk",
    match: (p) =>
      (p.weave + " " + p.name + " " + (p.details?.fabric || "") + " " + (p.tags || []).join(" ")).toLowerCase().includes("kanjivaram"),
  },
  {
    key: "paithani",
    label: "Paithani Weave",
    match: (p) =>
      (p.weave + " " + p.name + " " + (p.details?.fabric || "") + " " + (p.tags || []).join(" ")).toLowerCase().includes("paithani"),
  },
  {
    key: "zari-butti",
    label: "Zari Butti & Brocade",
    match: (p) => {
      const text = (p.weave + " " + p.name + " " + (p.details?.fabric || "") + " " + (p.details?.description || "")).toLowerCase();
      return text.includes("zari") || text.includes("butti") || text.includes("brocade");
    },
  },
  {
    key: "temple-border",
    label: "Temple Border Silk",
    match: (p) =>
      (p.weave + " " + p.name + " " + (p.details?.fabric || "")).toLowerCase().includes("temple"),
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
    key: "katan-mulberry",
    label: "Katan & Mulberry Silk",
    match: (p) => {
      const text = (p.weave + " " + p.name + " " + (p.details?.fabric || "")).toLowerCase();
      return text.includes("katan") || text.includes("mulberry") || text.includes("pure silk");
    },
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

export const DETAILED_COLOR_RULES: Array<{ label: string; kws: string[] }> = [
  // Multi-word specific shades first (to prioritize e.g. "Dark Red" over "Red")
  { label: "Dark Red", kws: ["dark red", "deep red"] },
  { label: "Bottle Green", kws: ["bottle green"] },
  { label: "Olive Green", kws: ["olive green"] },
  { label: "Emerald Green", kws: ["emerald green", "emerald"] },
  { label: "Teal Green", kws: ["teal green"] },
  { label: "Teal", kws: ["teal", "cyan", "sea green", "aqua"] },
  { label: "Navy Blue", kws: ["navy blue", "navy"] },
  { label: "Royal Blue", kws: ["royal blue"] },
  { label: "Peacock Blue", kws: ["peacock blue"] },
  { label: "Rani Pink", kws: ["rani pink", "rani"] },
  { label: "Plum Purple", kws: ["plum purple", "plum"] },
  { label: "Royal Purple", kws: ["royal purple"] },
  { label: "Golden Yellow", kws: ["golden yellow"] },
  { label: "Cream Gold", kws: ["cream gold"] },
  { label: "Slate Grey", kws: ["slate grey", "slate gray", "slate"] },
  { label: "Off White", kws: ["off white", "off-white"] },
  // Single-word shades
  { label: "Rama", kws: ["rama", "firozi"] },
  { label: "Turquoise", kws: ["turquoise", "neel tarang"] },
  { label: "Blue", kws: ["blue", "neelam"] },
  { label: "Magenta", kws: ["magenta"] },
  { label: "Pink", kws: ["pink", "gulabi", "rose"] },
  { label: "Wine", kws: ["wine", "burgundy"] },
  { label: "Maroon", kws: ["maroon", "oxblood"] },
  { label: "Red", kws: ["red", "sindoori", "crimson", "lal"] },
  { label: "Rust", kws: ["rust", "rustic"] },
  { label: "Peach", kws: ["peach", "coral", "apricot"] },
  { label: "Orange", kws: ["orange", "kesarika", "kesariya"] },
  { label: "Yellow", kws: ["yellow", "haldi", "mustard", "rangbahar"] },
  { label: "Gold", kws: ["gold", "sunehri"] },
  { label: "Green", kws: ["green", "mehendi", "pista"] },
  { label: "Purple", kws: ["purple", "violet", "jamuni"] },
  { label: "Lavender", kws: ["lavender", "lilac", "mauve"] },
  { label: "Grey", kws: ["grey", "gray", "silver", "ash", "charcoal"] },
  { label: "Black", kws: ["black", "shyamali", "ebony"] },
  { label: "White", kws: ["white", "ivory"] },
  { label: "Beige", kws: ["beige", "cream", "chikoo", "khaki", "sand", "ecru"] },
  { label: "Brown", kws: ["brown", "copper", "tan", "bronze", "chocolate", "coffee"] },
  { label: "Multicolor", kws: ["multicolor", "multi-color", "rainbow"] },
];

/**
 * Extracts all authentic colors for a product based on its Shopify variants,
 * options, metafields, or garment title and weave (for single-variant products).
 * Accurately detects dual-color / contrast drape combinations in authentic title order.
 */
export function getProductColors(p: Product): string[] {
  const colors: string[] = [];

  // 1. Explicit multi-variant products from Shopify
  if (p.variants && Array.isArray(p.variants) && p.variants.length > 1) {
    for (const v of p.variants) {
      if (v.color && v.color.trim().toLowerCase() !== "default title") {
        colors.push(v.color.trim());
      } else if (v.selectedOptions && Array.isArray(v.selectedOptions)) {
        for (const opt of v.selectedOptions) {
          if (/colou?r/i.test(opt.name) && opt.value && opt.value.trim().toLowerCase() !== "default title") {
            colors.push(opt.value.trim());
          }
        }
      } else if (v.title && v.title.trim().toLowerCase() !== "default title") {
        colors.push(v.title.split("/")[0].trim());
      }
    }
  }

  // 2. Product options from Shopify with multiple values
  if (colors.length === 0 && p.options && Array.isArray(p.options)) {
    for (const opt of p.options) {
      if (/colou?r/i.test(opt.name) && Array.isArray(opt.values)) {
        for (const val of opt.values) {
          if (val && val.trim().toLowerCase() !== "default title") {
            colors.push(val.trim());
          }
        }
      }
    }
  }

  // 3. For single-variant products: extract authentic constituent saree colors from title, metafields, or garment text
  if (colors.length === 0) {
    const title = p.name || "";
    const matched: Array<{ label: string; index: number }> = [];

    // Scan title first (preserves authentic drape ordering e.g. "Dark Red & Black")
    for (const rule of DETAILED_COLOR_RULES) {
      for (const kw of rule.kws) {
        const regex = new RegExp(`\\b${kw}\\b`, "i");
        const m = regex.exec(title);
        if (m) {
          const alreadySubsumed = matched.some(
            (x) =>
              x.label.toLowerCase().includes(rule.label.toLowerCase()) ||
              rule.label.toLowerCase().includes(x.label.toLowerCase()),
          );
          if (!alreadySubsumed) {
            matched.push({ label: rule.label, index: m.index });
          }
          break;
        }
      }
    }

    // Sort by appearance in title
    matched.sort((a, b) => a.index - b.index);
    for (const m of matched) {
      colors.push(m.label);
    }

    // Also include Shopify category metafield colors if present on product
    if (p.colors && Array.isArray(p.colors)) {
      for (const mc of p.colors) {
        if (
          !colors.some(
            (c) =>
              c.toLowerCase().includes(mc.toLowerCase()) ||
              mc.toLowerCase().includes(c.toLowerCase()),
          )
        ) {
          colors.push(mc);
        }
      }
    }

    // Fallback: check weave, description, or id if still no colors found
    if (colors.length === 0) {
      const fullText = `${p.name} ${p.id} ${p.weave || ""} ${p.details?.description || ""}`.toLowerCase();
      for (const rule of DETAILED_COLOR_RULES) {
        for (const kw of rule.kws) {
          const regex = new RegExp(`\\b${kw}\\b`, "i");
          if (regex.test(fullText)) {
            colors.push(rule.label);
            break;
          }
        }
        if (colors.length > 0) break;
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
