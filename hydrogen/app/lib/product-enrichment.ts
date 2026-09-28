/**
 * Product Enrichment for Mumbai Bazar Hydrogen storefront.
 *
 * This provides:
 * 1. High-resolution local studio galleries for flagship sarees (FLIPKART_GALLERIES).
 * 2. Automatic category inference based on Shopify tags and title keywords.
 * 3. Weave & fabric derivation.
 * 4. Dual-color detection and swatch naming (e.g., "Dark Red & Black").
 *
 * NO HARDCODED CATALOG OR STALE SNAPSHOTS. All products originate live from Shopify Storefront API.
 */

export const FLIPKART_GALLERIES: Record<
  string,
  {
    name?: string;
    weave?: string;
    fabric?: string;
    description?: string;
    gallery: string[];
  }
> = {
  "meher-wine-banarasi-silk-saree": {
    name: "Champagne Beige Woven Saree with Embroidered Blouse",
    weave: "Bollywood Woven Satin",
    fabric: "Woven satin with metallic embroidery",
    description:
      "An elegant Champagne Beige woven saree crafted from lustrous satin-finish fabric, accompanied by a beautifully embroidered blouse piece. Perfect for wedding receptions, sangeet, and festive celebrations. Try and drape across our 8 Mumbai stores or order online with 7-day easy exchange.",
    gallery: [
      "/products/meher-wine-1.jpeg",
      "/products/meher-wine-2.jpeg",
      "/products/meher-wine-3.jpeg",
      "/products/meher-wine-4.jpeg",
      "/products/meher-wine-5.jpeg",
    ],
  },
  "gulabi-shringar-saree": {
    name: "Gulabi Shringar Striped Embroidered Saree",
    weave: "Bollywood Silk Blend",
    fabric: "Silk blend with contrast striped weaving",
    gallery: [
      "/products/gulabi-shringar-1.jpeg",
      "/products/gulabi-shringar-2.jpeg",
      "/products/gulabi-shringar-3.jpeg",
      "/products/gulabi-shringar-4.jpeg",
      "/products/gulabi-shringar-5.jpeg",
    ],
  },
  "rangrez-royale-saree": {
    name: "Rangrez Royale Crimson Paisley Jacquard Saree",
    weave: "Jacquard Woven Silk",
    fabric: "Jacquard woven silk blend",
    gallery: [
      "/products/rangrez-royale-1.jpeg",
      "/products/rangrez-royale-2.jpeg",
      "/products/rangrez-royale-3.jpeg",
      "/products/rangrez-royale-4.jpeg",
      "/products/rangrez-royale-5.jpeg",
    ],
  },
  "neelam-rangoli-saree": {
    name: "Neelam Rangoli Peacock Diamond Jacquard Saree",
    weave: "Jacquard Woven Silk",
    fabric: "Jacquard woven silk blend",
    gallery: [
      "/products/neelam-rangoli-1.jpeg",
      "/products/neelam-rangoli-2.jpeg",
      "/products/neelam-rangoli-3.jpeg",
      "/products/neelam-rangoli-4.jpeg",
      "/products/neelam-rangoli-5.jpeg",
    ],
  },
  "rangrez-heritage-saree": {
    name: "Rangrez Heritage Floral Jacquard Saree",
    weave: "Jacquard Woven Silk",
    fabric: "Jacquard woven silk blend",
    gallery: [
      "/products/rangrez-heritage-1.jpeg",
      "/products/rangrez-heritage-2.jpeg",
      "/products/rangrez-heritage-3.jpeg",
      "/products/rangrez-heritage-4.jpeg",
      "/products/rangrez-heritage-5.jpeg",
    ],
  },
  "heritage-canvas-saree": {
    name: "Heritage Canvas Pichwai Block Mosaic Saree",
    weave: "Jacquard Cotton Silk",
    fabric: "Cotton silk with Pichwai heritage print motifs",
    gallery: [
      "/products/heritage-canvas-1.jpeg",
      "/products/heritage-canvas-2.jpeg",
      "/products/heritage-canvas-3.jpeg",
      "/products/heritage-canvas-4.jpeg",
      "/products/heritage-canvas-5.jpeg",
    ],
  },
};

export type CategorySlug =
  | "wedding-sarees"
  | "silk-sarees"
  | "festive-edit"
  | "everyday-sarees"
  | "new-arrivals";

export function inferCategories(
  title: string,
  productType?: string | null,
  vendor?: string | null,
  rawTags?: string[] | null,
): CategorySlug[] {
  const text = `${title || ""} ${productType || ""} ${vendor || ""}`.toLowerCase();
  const tags = new Set((rawTags ?? []).map((t) => t.trim().toLowerCase()));

  const inCat = (slug: string, ...textHints: string[]) =>
    tags.has(slug) || textHints.some((h) => text.includes(h));

  const result: CategorySlug[] = [];

  if (inCat("new-arrivals") || tags.size === 0) {
    result.push("new-arrivals");
  }

  if (
    inCat(
      "wedding-sarees",
      "wedding",
      "bridal",
      "dulhan",
      "zari butti",
      "temple border",
      "shringar",
      "banarasi",
      "kanjivaram",
      "paithani",
      "embroidered border",
      "royal silk",
      "sindoori",
      "rajrang",
      "ornate gold zari",
    )
  ) {
    result.push("wedding-sarees");
  }

  if (
    inCat(
      "silk-sarees",
      "silk",
      "katan",
      "banarasi",
      "kanjivaram",
      "paithani",
      "maheshwari",
      "art silk",
      "zari butti",
      "temple border",
      "jhumar",
      "shringar",
      "brocade",
    )
  ) {
    result.push("silk-sarees");
  }

  if (
    inCat(
      "festive-edit",
      "festive",
      "party",
      "zari butti",
      "temple border",
      "bandhani",
      "mandala",
      "patchwork",
      "shringar",
      "embroidered",
      "kalamkari",
      "embellished",
      "kesariya",
      "rangbahar",
      "rangvalli",
    )
  ) {
    result.push("festive-edit");
  }

  if (
    inCat(
      "everyday-sarees",
      "ready-to-wear",
      "everyday",
      "daily",
      "office",
      "cotton",
      "linen",
      "gadwal",
      "kerala",
      "printed",
      "print",
      "stripe",
      "floral",
      "kalamkari",
      "mosaic",
      "lightweight",
      "casual",
      "chikoo",
      "rangrekha",
    )
  ) {
    result.push("everyday-sarees");
  }

  return result.length > 0 ? result : ["new-arrivals", "silk-sarees"];
}

export function getWeaveFromProduct(
  title: string,
  productType?: string | null,
  vendor?: string | null,
): string {
  if (productType && productType.trim() && productType.toLowerCase() !== "default") {
    return productType.trim();
  }
  if (
    vendor &&
    vendor.trim() &&
    !["my store", "mumbai-baazar-store", "mumbai bazar", "default"].includes(
      vendor.trim().toLowerCase(),
    )
  ) {
    return vendor.trim();
  }
  const t = (title || "").toLowerCase();
  if (t.includes("banarasi")) return "Banarasi Silk";
  if (t.includes("kanjivaram")) return "Kanjivaram Silk";
  if (t.includes("paithani")) return "Paithani Weave";
  if (t.includes("chanderi")) return "Chanderi Weave";
  if (t.includes("kalamkari")) return "Kalamkari Print";
  if (t.includes("tissue")) return "Tissue Weave";
  if (t.includes("organza")) return "Organza";
  if (t.includes("tussar")) return "Tussar";
  if (t.includes("georgette")) return "Georgette";
  if (t.includes("chiffon")) return "Chiffon";
  if (t.includes("cotton")) return "Cotton Silk";
  if (t.includes("saree") || t.includes("silk")) return "Silk-Blend Saree";
  return "Handloom Saree";
}

/**
 * Derives color name from options, tags or title.
 * Detects dual-color combinations such as "Dark Red & Black" or "Teal & Red".
 */
export function extractColorFromProduct(
  title: string,
  options?: Array<{ name: string; values: string[] }> | null,
  tags?: string[] | null,
): string {
  // 1. Check for Color option first
  if (options) {
    const colorOpt = options.find((o) =>
      /colou?r|shade/i.test(o.name),
    );
    if (colorOpt && colorOpt.values.length > 0) {
      return colorOpt.values[0];
    }
  }

  const t = (title || "").toLowerCase();

  // Known dual-color patterns
  if (t.includes("dark red") && t.includes("black")) return "Dark Red & Black";
  if (t.includes("teal") && t.includes("red")) return "Teal & Red";
  if (t.includes("rani pink") && t.includes("teal")) return "Rani Pink & Teal";
  if (t.includes("emerald green") && t.includes("royal purple")) return "Emerald Green & Royal Purple";
  if (t.includes("emerald green") && t.includes("red")) return "Emerald Green & Red";
  if (t.includes("bottle green") && t.includes("red")) return "Bottle Green & Red";
  if (t.includes("peacock blue") && t.includes("rani pink")) return "Peacock Blue & Rani Pink";
  if (t.includes("teal green") && t.includes("red")) return "Teal Green & Red";
  if (t.includes("royal blue") && (t.includes("cream") || t.includes("gold"))) return "Royal Blue & Cream Gold";
  if (t.includes("plum purple") && (t.includes("golden") || t.includes("yellow"))) return "Plum Purple & Golden Yellow";
  if (t.includes("olive green") && t.includes("rani pink")) return "Olive Green & Rani Pink";
  if (t.includes("white") && t.includes("red")) return "White & Red";
  if (t.includes("ivory") && (t.includes("gold") || t.includes("zari"))) return "Ivory & Gold";
  if (t.includes("ivory") && t.includes("rani pink")) return "Ivory & Rani Pink";

  // Single shades
  if (t.includes("dark red")) return "Dark Red";
  if (t.includes("peacock blue")) return "Peacock Blue";
  if (t.includes("royal blue")) return "Royal Blue";
  if (t.includes("bottle green")) return "Bottle Green";
  if (t.includes("teal green") || t.includes("teal")) return "Teal Green";
  if (t.includes("rani pink")) return "Rani Pink";
  if (t.includes("emerald green")) return "Emerald Green";
  if (t.includes("rama green") || t.includes("rama")) return "Rama Green";
  if (t.includes("chikoo brown") || t.includes("chikoo")) return "Chikoo Brown";
  if (t.includes("lavender")) return "Lavender";
  if (t.includes("kesariya") || t.includes("orange")) return "Kesariya Orange";
  if (t.includes("wine")) return "Wine";
  if (t.includes("maroon")) return "Maroon";
  if (t.includes("red")) return "Red";
  if (t.includes("pink")) return "Pink";
  if (t.includes("gold") || t.includes("yellow")) return "Gold";
  if (t.includes("blue")) return "Blue";
  if (t.includes("green")) return "Green";
  if (t.includes("ivory") || t.includes("cream") || t.includes("off-white")) return "Ivory";
  if (t.includes("black")) return "Black";

  return "Multicolour";
}
