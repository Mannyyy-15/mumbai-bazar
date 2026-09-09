import { PRODUCTS, type Product, type ProductVariant } from "./site-data";

const domain =
  (import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string | undefined) ||
  "mumbai-baazar-store.myshopify.com";
const token =
  (import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN as string | undefined) ||
  "ecd6dae011aac9106c8c42c5085d516e";
const apiVersion = (import.meta.env.VITE_SHOPIFY_API_VERSION as string | undefined) ?? "2024-10";

export const shopifyConfigured = Boolean(domain && token);

export type ShopifyProduct = Product & {
  shopifyProductId: string;
  shopifyVariantId: string;
  handle: string;
};

type ProductNode = {
  id: string;
  handle: string;
  title: string;
  vendor?: string;
  productType?: string;
  description?: string;
  tags?: string[];
  featuredImage?: { url: string; altText?: string | null };
  images?: { nodes: Array<{ url: string; altText?: string | null }> };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  compareAtPriceRange: { minVariantPrice: { amount: string } };
  options?: Array<{ id: string; name: string; values: string[] }>;
  variants: {
    nodes: Array<{
      id: string;
      title: string;
      availableForSale?: boolean;
      price: { amount: string; currencyCode: string };
      compareAtPrice?: { amount: string; currencyCode: string } | null;
      selectedOptions?: Array<{ name: string; value: string }>;
      image?: { url: string; altText?: string | null } | null;
    }>;
  };
};

type ShopifyResponse<T> = { data?: T; errors?: Array<{ message: string }> };

const PRODUCT_FIELDS = `
  id handle title vendor productType description tags
  featuredImage { url altText }
  images(first: 15) { nodes { url altText } }
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount } }
  options { id name values }
  variants(first: 30) {
    nodes {
      id
      title
      availableForSale
      price { amount currencyCode }
      compareAtPrice { amount currencyCode }
      selectedOptions { name value }
      image { url altText }
    }
  }
`;

const commonCare = [
  "Dry clean only for the first wash",
  "Store folded in a soft muslin cloth",
  "Avoid direct sunlight and perfume contact",
  "Iron on low heat with a cotton cloth",
];

export const FLIPKART_PRODUCTS: ShopifyProduct[] = [
  {
    id: "womens-silk-blend-saree-embroidered-border",
    handle: "womens-silk-blend-saree-embroidered-border",
    shopifyProductId: "mb-silk-blend-saree-emb-border",
    shopifyVariantId: "mb-var-red-gulab-box",
    name: "Women's Silk Blend Saree with Embroidered Border & Unstitched Blouse Piece",
    weave: "Silk Blend Embroidery",
    price: "₹ 1,199",
    original: "₹ 2,999",
    tag: "Bestseller",
    category: ["new-arrivals", "wedding-sarees", "silk-sarees", "festive-edit"],
    img: "/products/gulab-box-red-1.jpg",
    secondaryImg: "/products/gulab-box-red-2.jpg",
    variants: [
      {
        id: "mb-var-black-gulab-box",
        title: "Black",
        color: "Black",
        price: "₹ 1,199",
        original: "₹ 2,999",
        available: true,
        img: "/products/gulab-box-black-1.jpg",
        selectedOptions: [{ name: "Colour", value: "Black" }],
      },
      {
        id: "mb-var-red-gulab-box",
        title: "Red",
        color: "Red",
        price: "₹ 1,199",
        original: "₹ 2,999",
        available: true,
        img: "/products/gulab-box-red-1.jpg",
        selectedOptions: [{ name: "Colour", value: "Red" }],
      },
      {
        id: "mb-var-white-gulab-box",
        title: "White",
        color: "White",
        price: "₹ 1,199",
        original: "₹ 2,999",
        available: true,
        img: "/products/gulab-box-white-1.jpg",
        selectedOptions: [{ name: "Colour", value: "White" }],
      },
    ],
    options: [
      {
        name: "Colour",
        values: ["Black", "Red", "White"],
      },
    ],
    details: {
      fabric: "Silk Blend with Resham & Zari Floral Embroidery",
      drape: "Fluid, graceful drape with rich embroidered fall",
      blousePiece: "0.80 m unstitched matching embroidered blouse piece",
      length: "5.5 m saree + 0.8 m blouse",
      border: "Heavy floral and scalloped embroidered border",
      palla: "Rich embroidered pallu with intricate buta motifs",
      care: commonCare,
      description:
        "Designed for timeless grace, this Women's Silk Blend Saree features an exquisite embroidered border with fine zari detailing and a matching unstitched blouse piece. Available in regal Black (BLACK-GULAB-BOX), vibrant Red (RED-GULAB-BOX), and elegant White (WHITE-GULAB-BOX), perfect for weddings, receptions, and celebratory soirées.",
      gallery: [
        "/products/gulab-box-red-1.jpg",
        "/products/gulab-box-red-2.jpg",
        "/products/gulab-box-red-3.jpg",
        "/products/gulab-box-white-1.jpg",
        "/products/gulab-box-white-2.jpg",
        "/products/gulab-box-white-3.jpg",
        "/products/gulab-box-black-1.jpg",
      ],
    },
  },
  {
    id: "woven-banarasi-cotton-silk-saree-magenta",
    handle: "woven-banarasi-cotton-silk-saree-magenta",
    shopifyProductId: "mb-flipkart-SARHQNQZUFTXMKP6",
    shopifyVariantId: "mb-var-SARHQNQZUFTXMKP6",
    name: "Woven Banarasi Cotton Silk Saree (Vibrant Magenta)",
    weave: "Banarasi Cotton Silk",
    price: "₹ 1,250",
    original: "₹ 1,799",
    tag: "New",
    category: ["new-arrivals", "silk-sarees", "festive-edit"],
    img: "/products/woven-magenta-1.jpeg",
    secondaryImg: "/products/woven-magenta-2.jpeg",
    details: {
      fabric: "Cotton silk blend with woven zari",
      drape: "Crisp, neat, structured pleats that hold form effortlessly",
      blousePiece: "0.80 m unstitched matching magenta cotton silk piece",
      length: "5.5 m saree + 0.8 m blouse",
      border: "Traditional Banarasi woven floral zari border",
      palla: "Dense gold zari brocade pallu with paisley ambi motifs",
      care: commonCare,
      description:
        "Crafted for comfort without compromising grandeur, this Vibrant Magenta Banarasi Cotton Silk Saree combines the regal luster of Banaras with breathable cotton silk. Perfect for morning pujas, temple visits, and family celebrations in Mumbai's tropical climate.",
      gallery: [
        "/products/woven-magenta-1.jpeg",
        "/products/woven-magenta-2.jpeg",
      ],
    },
  },
  {
    id: "meher-wine-banarasi-silk-saree",
    handle: "meher-wine-banarasi-silk-saree",
    shopifyProductId: "mb-meher-wine-banarasi",
    shopifyVariantId: "mb-var-meher-wine",
    name: "Champagne Beige Woven Saree with Embroidered Blouse",
    weave: "Bollywood Woven Satin",
    price: "₹ 1,499",
    original: "₹ 2,499",
    tag: "Bestseller",
    category: ["wedding-sarees", "silk-sarees", "festive-edit"],
    img: "/products/meher-wine-1.jpeg",
    secondaryImg: "/products/meher-wine-2.jpeg",
    details: {
      fabric: "Woven satin with metallic embroidery",
      drape: "Fluid, graceful drape with sleek satin luster",
      blousePiece: "0.80 m unstitched designer embroidered blouse piece",
      length: "5.5 m saree + 0.8 m blouse",
      border: "Fine embroidered border",
      palla: "Minimalist satin pallu with woven edges",
      care: commonCare,
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
  },
  {
    id: "gulabi-shringar-saree",
    handle: "gulabi-shringar-saree",
    shopifyProductId: "mb-gulabi-shringar",
    shopifyVariantId: "mb-var-gulabi-shringar",
    name: "Gulabi Shringar Striped Embroidered Saree",
    weave: "Bollywood Silk Blend",
    price: "₹ 1,399",
    original: "₹ 2,299",
    tag: "New",
    category: ["new-arrivals", "festive-edit", "wedding-sarees"],
    img: "/products/gulabi-shringar-1.jpeg",
    secondaryImg: "/products/gulabi-shringar-2.jpeg",
    details: {
      fabric: "Silk blend with contrast striped weaving",
      drape: "Flowing silhouette with crisp pleating",
      blousePiece: "0.80 m matching unstitched blouse piece",
      length: "5.5 m saree + 0.8 m blouse",
      border: "Rich zari striped border",
      palla: "Elaborate striped festive pallu",
      care: commonCare,
      description:
        "Vibrant Rani pink saree adorned with fine metallic striped weaving and delicate embroidery. Designed for wedding guests, sangeet nights, and festive moments that call for joyful elegance.",
      gallery: [
        "/products/gulabi-shringar-1.jpeg",
        "/products/gulabi-shringar-2.jpeg",
        "/products/gulabi-shringar-3.jpeg",
        "/products/gulabi-shringar-4.jpeg",
        "/products/gulabi-shringar-5.jpeg",
      ],
    },
  },
  {
    id: "rangrez-royale-saree",
    handle: "rangrez-royale-saree",
    shopifyProductId: "mb-rangrez-royale",
    shopifyVariantId: "mb-var-rangrez-royale",
    name: "Rangrez Royale Crimson Paisley Jacquard Saree",
    weave: "Jacquard Woven Silk",
    price: "₹ 1,199",
    original: "₹ 1,999",
    tag: "Bestseller",
    category: ["festive-edit", "silk-sarees", "wedding-sarees"],
    img: "/products/rangrez-royale-1.jpeg",
    secondaryImg: "/products/rangrez-royale-2.jpeg",
    details: {
      fabric: "Jacquard woven silk blend",
      drape: "Structured regal pleats that stay in place",
      blousePiece: "0.80 m contrast brocade unstitched blouse",
      length: "5.5 m saree + 0.8 m blouse",
      border: "Paisley motifs with antique gold zari border",
      palla: "Dense floral jaal and paisley brocade pallu",
      care: commonCare,
      description:
        "A festive crimson red jacquard saree woven with intricate paisley buttis and a grand gold-accented pallu. A timeless wardrobe centerpiece for Diwali, Karwa Chauth, and family wedding celebrations.",
      gallery: [
        "/products/rangrez-royale-1.jpeg",
        "/products/rangrez-royale-2.jpeg",
        "/products/rangrez-royale-3.jpeg",
        "/products/rangrez-royale-4.jpeg",
        "/products/rangrez-royale-5.jpeg",
      ],
    },
  },
  {
    id: "neelam-rangoli-saree",
    handle: "neelam-rangoli-saree",
    shopifyProductId: "mb-neelam-rangoli",
    shopifyVariantId: "mb-var-neelam-rangoli",
    name: "Neelam Rangoli Peacock Diamond Jacquard Saree",
    weave: "Jacquard Woven Silk",
    price: "₹ 1,199",
    original: "₹ 1,999",
    tag: "New",
    category: ["new-arrivals", "festive-edit", "everyday-sarees"],
    img: "/products/neelam-rangoli-1.jpeg",
    secondaryImg: "/products/neelam-rangoli-2.jpeg",
    details: {
      fabric: "Jacquard woven silk blend",
      drape: "Lightweight, effortless drape with lustrous jewel tone",
      blousePiece: "0.80 m matching peacock blue unstitched blouse",
      length: "5.5 m saree + 0.8 m blouse",
      border: "Geometric diamond jacquard border",
      palla: "Royal peacock motifs across palla",
      care: commonCare,
      description:
        "Draped in midnight peacock blue, this jacquard saree features geometric diamond butas and fine zari accents. Ideal for formal functions, evening dinner celebrations, and auspicious ceremonies.",
      gallery: [
        "/products/neelam-rangoli-1.jpeg",
        "/products/neelam-rangoli-2.jpeg",
        "/products/neelam-rangoli-3.jpeg",
        "/products/neelam-rangoli-4.jpeg",
        "/products/neelam-rangoli-5.jpeg",
      ],
    },
  },
  {
    id: "rangrez-heritage-saree",
    handle: "rangrez-heritage-saree",
    shopifyProductId: "mb-rangrez-heritage",
    shopifyVariantId: "mb-var-rangrez-heritage",
    name: "Rangrez Heritage Floral Jacquard Saree",
    weave: "Jacquard Woven Silk",
    price: "₹ 1,149",
    original: "₹ 1,899",
    tag: "Bestseller",
    category: ["everyday-sarees", "silk-sarees", "festive-edit"],
    img: "/products/rangrez-heritage-1.jpeg",
    secondaryImg: "/products/rangrez-heritage-2.jpeg",
    details: {
      fabric: "Jacquard woven silk blend",
      drape: "Featherlight, soft-touch fabric with graceful pleating",
      blousePiece: "0.80 m matching jacquard piece",
      length: "5.5 m saree + 0.8 m blouse",
      border: "Dual-tone woven botanical border",
      palla: "Heritage floral motifs on pearl white base",
      care: commonCare,
      description:
        "Serene Pearl White Jacquard Saree engineered with soft-finish yarn. Features botanical floral motifs and subtle self-textured jacquard weaves, ideal for daylight ceremonies, poojas, and office elegance.",
      gallery: [
        "/products/rangrez-heritage-1.jpeg",
        "/products/rangrez-heritage-2.jpeg",
        "/products/rangrez-heritage-3.jpeg",
        "/products/rangrez-heritage-4.jpeg",
        "/products/rangrez-heritage-5.jpeg",
      ],
    },
  },
  {
    id: "heritage-canvas-saree",
    handle: "heritage-canvas-saree",
    shopifyProductId: "mb-heritage-canvas",
    shopifyVariantId: "mb-var-heritage-canvas",
    name: "Heritage Canvas Pichwai Block Mosaic Saree",
    weave: "Jacquard Cotton Silk",
    price: "₹ 1,149",
    original: "₹ 1,899",
    tag: "New",
    category: ["everyday-sarees", "silk-sarees"],
    img: "/products/heritage-canvas-1.jpeg",
    secondaryImg: "/products/heritage-canvas-2.jpeg",
    details: {
      fabric: "Cotton silk with Pichwai heritage print motifs",
      drape: "Crisp, breathable, all-day comfortable pleats",
      blousePiece: "0.80 m unstitched cream printed blouse",
      length: "5.5 m saree + 0.8 m blouse",
      border: "Pichwai lotus block motif border",
      palla: "Traditional cow and floral garden palla art",
      care: commonCare,
      description:
        "Inspired by Nathdwara's ancient Pichwai temple art, this cream jacquard cotton-silk saree displays devotional lotus and peacock motifs in soft earth tones. Sophisticated, breathable, and deeply rooted in tradition.",
      gallery: [
        "/products/heritage-canvas-1.jpeg",
        "/products/heritage-canvas-2.jpeg",
        "/products/heritage-canvas-3.jpeg",
        "/products/heritage-canvas-4.jpeg",
        "/products/heritage-canvas-5.jpeg",
      ],
    },
  },
];

export const ALL_STORE_PRODUCTS: ShopifyProduct[] = [
  ...FLIPKART_PRODUCTS,
  ...PRODUCTS.map((p) => ({
    ...p,
    handle: p.id,
    shopifyProductId: p.shopifyProductId || `boutique-${p.id}`,
    shopifyVariantId: p.shopifyVariantId || `boutique-var-${p.id}`,
  })),
];

export async function fetchShopifyProducts(first = 50): Promise<ShopifyProduct[]> {
  try {
    const payload = await storefrontRequest<{ products: { nodes: ProductNode[] } }>(
      `query Products($first: Int!) { products(first: $first, sortKey: BEST_SELLING) { nodes { ${PRODUCT_FIELDS} } } }`,
      { first },
    );
    const remoteProducts = payload.products.nodes.map(toProduct).filter(Boolean) as ShopifyProduct[];
    
    // Combine with local store items not already present in remote
    const existingHandles = new Set(remoteProducts.map((p) => p.handle));
    const extraLocal = ALL_STORE_PRODUCTS.filter((p) => !existingHandles.has(p.handle));
    
    return [...remoteProducts, ...extraLocal];
  } catch {
    return ALL_STORE_PRODUCTS;
  }
}

export async function fetchShopifyProduct(handle: string): Promise<ShopifyProduct | null> {
  const localMatch = ALL_STORE_PRODUCTS.find((p) => p.handle === handle || p.id === handle);

  try {
    const payload = await storefrontRequest<{ product: ProductNode | null }>(
      `query Product($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} } }`,
      { handle },
    );
    if (payload.product) {
      return toProduct(payload.product);
    }
  } catch {
    // fallback to local match
  }

  return localMatch || null;
}

function getWeaveFromProduct(node: ProductNode): string {
  if (node.productType && node.productType.trim() && node.productType.toLowerCase() !== "default") {
    return node.productType.trim();
  }
  if (
    node.vendor &&
    node.vendor.trim() &&
    !["my store", "mumbai-baazar-store", "mumbai bazar", "default"].includes(
      node.vendor.trim().toLowerCase(),
    )
  ) {
    return node.vendor.trim();
  }
  const title = node.title.toLowerCase();
  if (title.includes("banarasi")) return "Banarasi Silk";
  if (title.includes("kanjivaram")) return "Kanjivaram Silk";
  if (title.includes("paithani")) return "Paithani Weave";
  if (title.includes("chanderi")) return "Chanderi Weave";
  if (title.includes("kalamkari")) return "Kalamkari Print";
  if (title.includes("tissue")) return "Tissue Weave";
  if (title.includes("organza")) return "Organza";
  if (title.includes("tussar")) return "Tussar";
  if (title.includes("georgette")) return "Georgette";
  if (title.includes("chiffon")) return "Chiffon";
  // Final fallbacks describe the garment, not its provenance or purity. These
  // are applied to ANY untitled-match product, so "Handwoven Heritage Silk" and
  // "Heritage Pure Silk" were asserting fibre content and loom type about stock
  // nobody had inspected.
  if (title.includes("saree") || title.includes("silk")) return "Silk-Blend Saree";
  return "Saree";
}

const FLIPKART_GALLERIES: Record<string, { gallery: string[]; name?: string; weave?: string; fabric?: string; description?: string }> = {
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

function toProduct(node: ProductNode): ShopifyProduct | null {
  const image = node.featuredImage ?? node.images?.nodes[0];
  const variant = node.variants.nodes[0];
  if (!image || !variant) return null;
  const price = Number(node.priceRange.minVariantPrice.amount);
  const text = `${node.title} ${node.productType || ""} ${node.vendor || ""}`.toLowerCase();
  const tags = new Set((node.tags ?? []).map((t) => t.trim().toLowerCase()));

  /*
   * Category assignment reads Shopify TAGS first, falling back to title text.
   *
   * The tags are already maintained as exact category slugs ("wedding-sarees",
   * "everyday-sarees", "festive-edit", "silk-sarees"), but they were not even
   * being fetched — categories were inferred purely from the title, product type
   * and vendor. That guessed wrong in both directions: /wedding-sarees and
   * /everyday-sarees rendered EMPTY despite four and three tagged products
   * respectively, because no title happens to contain the word "wedding" or
   * "everyday". Meanwhile every product was force-added to "new-arrivals".
   *
   * Tags are the merchandiser's explicit intent, so they win. Text matching is
   * kept only as a fallback for products that have not been tagged yet.
   */
  const inCat = (slug: string, ...textHints: string[]) =>
    tags.has(slug) || textHints.some((h) => text.includes(h));

  // Each spread is annotated so TypeScript keeps the literal union rather than
  // widening the branches to string[].
  const category: Product["category"] = [
    ...(inCat("new-arrivals") || tags.size === 0 ? (["new-arrivals"] as const) : []),
    ...(inCat("wedding-sarees", "wedding", "bridal", "dulhan")
      ? (["wedding-sarees"] as const)
      : []),
    ...(inCat("silk-sarees", "silk", "banarasi", "kanjivaram", "paithani")
      ? (["silk-sarees"] as const)
      : []),
    ...(inCat("festive-edit", "festive") ? (["festive-edit"] as const) : []),
    ...(inCat("everyday-sarees", "everyday", "daily wear", "office")
      ? (["everyday-sarees"] as const)
      : []),
  ];
  const fkData = FLIPKART_GALLERIES[node.handle];
  const gallery = fkData?.gallery && fkData.gallery.length > 0
    ? fkData.gallery
    : (node.images?.nodes ?? [image]).map((item) => item.url);
  const primaryImg = fkData?.gallery?.[0] || image.url;
  const secondaryImage = gallery.length > 1 ? gallery[1] : undefined;
  const weave = fkData?.weave || getWeaveFromProduct(node);
  const name = fkData?.name || node.title;
  const rawDesc = fkData?.description || node.description || "";
  const isPlaceholder = rawDesc.includes("add saree details") || rawDesc.trim().length < 40;
  const description = isPlaceholder
    ? `${name}, handcrafted and curated by Mumbai Bazar. Elegant border detailing with matching unstitched blouse piece. Try and drape in person across any of our 8 Mumbai stores or order online with 7-day easy returns.`
    : rawDesc;
  const variants: ProductVariant[] = (node.variants?.nodes ?? []).map((v) => {
    const colorOpt = v.selectedOptions?.find((opt) => /colou?r/i.test(opt.name));
    const colorVal = colorOpt ? colorOpt.value : (v.title !== "Default Title" ? v.title.split("/")[0].trim() : undefined);
    const hasDiscount = Boolean(
      v.compareAtPrice?.amount && Number(v.compareAtPrice.amount) > Number(v.price.amount)
    );

    return {
      id: v.id,
      title: v.title,
      color: colorVal,
      available: v.availableForSale ?? true,
      price: formatShopifyPrice(v.price.amount, v.price.currencyCode),
      original: hasDiscount && v.compareAtPrice
        ? formatShopifyPrice(v.compareAtPrice.amount, v.price.currencyCode)
        : undefined,
      img: v.image?.url,
      selectedOptions: v.selectedOptions,
    };
  });

  const variantImages = variants.map((v) => v.img).filter(Boolean) as string[];
  const finalGallery = Array.from(new Set([...gallery, ...variantImages]));

  return {
    id: node.handle,
    handle: node.handle,
    shopifyProductId: node.id,
    shopifyVariantId: variant.id,
    img: primaryImg,
    secondaryImg: secondaryImage,
    name,
    weave,
    price: formatShopifyPrice(
      node.priceRange.minVariantPrice.amount,
      node.priceRange.minVariantPrice.currencyCode,
    ),
    original:
      Number(node.compareAtPriceRange.minVariantPrice.amount) > price
        ? formatShopifyPrice(
            node.compareAtPriceRange.minVariantPrice.amount,
            node.priceRange.minVariantPrice.currencyCode,
          )
        : undefined,
    category,
    variants,
    options: node.options,
    details: {
      fabric: fkData?.fabric || node.productType || weave,
      drape: "Refined, easy drape",
      blousePiece: "Matching unstitched blouse piece",
      length: "5.5 m saree + blouse piece",
      border: "Woven statement border",
      palla: "Signature Mumbai Bazar motifs",
      care: [
        "Dry clean only for the first wash",
        "Store folded in soft muslin",
        "Avoid direct sunlight and perfume contact",
      ],
      description,
      gallery: finalGallery,
    },
  };
}

async function storefrontRequest<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  if (!domain) throw new Error("Shopify store domain is not configured");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["X-Shopify-Storefront-Access-Token"] = token;
  const response = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) throw new Error(`Shopify Storefront API returned ${response.status}`);
  const payload = (await response.json()) as ShopifyResponse<T>;
  if (payload.errors?.length || !payload.data)
    throw new Error(payload.errors?.[0]?.message ?? "Shopify response was empty");
  return payload.data;
}

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  lines: Array<{ id: string; merchandiseId: string; quantity: number }>;
};

export async function createShopifyCart(
  merchandiseId: string,
  quantity: number,
): Promise<ShopifyCart> {
  const data = await storefrontRequest<{
    cartCreate: {
      cart: {
        id: string;
        checkoutUrl: string;
        lines: { nodes: Array<{ id: string; quantity: number; merchandise: { id: string } }> };
      };
    };
  }>(
    `mutation CartCreate($input: CartInput!) { cartCreate(input: $input) { cart { id checkoutUrl lines(first: 100) { nodes { id quantity merchandise { ... on ProductVariant { id } } } } } } }`,
    { input: { lines: [{ merchandiseId, quantity }] } },
  );
  return normalizeCart(data.cartCreate.cart);
}

export async function addToShopifyCart(
  cartId: string,
  merchandiseId: string,
  quantity: number,
): Promise<ShopifyCart> {
  const data = await storefrontRequest<{
    cartLinesAdd: {
      cart: {
        id: string;
        checkoutUrl: string;
        lines: { nodes: Array<{ id: string; quantity: number; merchandise: { id: string } }> };
      };
    };
  }>(
    `mutation CartAdd($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { id checkoutUrl lines(first: 100) { nodes { id quantity merchandise { ... on ProductVariant { id } } } } } } }`,
    { cartId, lines: [{ merchandiseId, quantity }] },
  );
  return normalizeCart(data.cartLinesAdd.cart);
}

export async function updateShopifyCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<ShopifyCart> {
  const data = await storefrontRequest<{
    cartLinesUpdate: {
      cart: {
        id: string;
        checkoutUrl: string;
        lines: { nodes: Array<{ id: string; quantity: number; merchandise: { id: string } }> };
      };
    };
  }>(
    `mutation CartUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { id checkoutUrl lines(first: 100) { nodes { id quantity merchandise { ... on ProductVariant { id } } } } } } }`,
    { cartId, lines: [{ id: lineId, quantity }] },
  );
  return normalizeCart(data.cartLinesUpdate.cart);
}

export async function removeFromShopifyCart(cartId: string, lineId: string): Promise<ShopifyCart> {
  const data = await storefrontRequest<{
    cartLinesRemove: {
      cart: {
        id: string;
        checkoutUrl: string;
        lines: { nodes: Array<{ id: string; quantity: number; merchandise: { id: string } }> };
      };
    };
  }>(
    `mutation CartRemove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { id checkoutUrl lines(first: 100) { nodes { id quantity merchandise { ... on ProductVariant { id } } } } } } }`,
    { cartId, lineIds: [lineId] },
  );
  return normalizeCart(data.cartLinesRemove.cart);
}

function normalizeCart(cart: {
  id: string;
  checkoutUrl: string;
  lines: { nodes: Array<{ id: string; quantity: number; merchandise: { id: string } }> };
}): ShopifyCart {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    lines: cart.lines.nodes.map((line) => ({
      id: line.id,
      quantity: line.quantity,
      merchandiseId: line.merchandise.id,
    })),
  };
}

function formatShopifyPrice(amount: string, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}
