import type { Product } from "./site-data";

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
  variants: { nodes: Array<{ id: string }> };
};

type ShopifyResponse<T> = { data?: T; errors?: Array<{ message: string }> };

const PRODUCT_FIELDS = `
  id handle title vendor productType description tags
  featuredImage { url altText }
  images(first: 8) { nodes { url altText } }
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount } }
  variants(first: 1) { nodes { id } }
`;

const commonCare = [
  "Dry clean only for the first wash",
  "Store folded in a soft muslin cloth",
  "Avoid direct sunlight and perfume contact",
  "Iron on low heat with a cotton cloth",
];

export const FLIPKART_PRODUCTS: ShopifyProduct[] = [
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
];

export async function fetchShopifyProducts(first = 50): Promise<ShopifyProduct[]> {
  try {
    const payload = await storefrontRequest<{ products: { nodes: ProductNode[] } }>(
      `query Products($first: Int!) { products(first: $first, sortKey: BEST_SELLING) { nodes { ${PRODUCT_FIELDS} } } }`,
      { first },
    );
    const remoteProducts = payload.products.nodes.map(toProduct).filter(Boolean) as ShopifyProduct[];
    
    // Combine with Flipkart brand items not already present
    const existingHandles = new Set(remoteProducts.map((p) => p.handle));
    const extraFlipkart = FLIPKART_PRODUCTS.filter((p) => !existingHandles.has(p.handle));
    
    return [...remoteProducts, ...extraFlipkart];
  } catch {
    return FLIPKART_PRODUCTS;
  }
}

export async function fetchShopifyProduct(handle: string): Promise<ShopifyProduct | null> {
  const fkMatch = FLIPKART_PRODUCTS.find((p) => p.handle === handle || p.id === handle);

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

  return fkMatch || null;
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
      gallery,
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
