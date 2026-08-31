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
  featuredImage?: { url: string; altText?: string | null };
  images?: { nodes: Array<{ url: string; altText?: string | null }> };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  compareAtPriceRange: { minVariantPrice: { amount: string } };
  variants: { nodes: Array<{ id: string }> };
};

type ShopifyResponse<T> = { data?: T; errors?: Array<{ message: string }> };

const PRODUCT_FIELDS = `
  id handle title vendor productType description
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
    id: "bollywood-striped-embroidered-silk-saree",
    handle: "bollywood-striped-embroidered-silk-saree",
    shopifyProductId: "mb-flipkart-SARHQZXQXYRG6CZY",
    shopifyVariantId: "mb-var-SARHQZXQXYRG6CZY",
    name: "Striped Embroidered Bollywood Silk Blend Saree (Crimson Red)",
    weave: "Bollywood Silk Blend",
    price: "₹ 1,999",
    original: "₹ 3,999",
    tag: "Bestseller",
    category: ["new-arrivals", "festive-edit", "wedding-sarees"],
    img: "https://rukminim2.flixcart.com/image/832/832/xif0q/sari/f/l/z/free-fendi-rani-mumbaibazar-unstitched-original-imahqzxqf95asq9w.jpeg?q=80",
    details: {
      fabric: "Premium Silk Blend with Detailed Zari & Sequin Embroidery",
      drape: "Celebrity-style fluid drape with sculpted pallu pleats",
      blousePiece: "0.80 m unstitched designer matching blouse piece",
      length: "5.5 m saree + 0.8 m blouse",
      border: "Intricate embroidered zari border with scalloped edges",
      palla: "Rich striped sequin embroidered pallu",
      care: commonCare,
      description:
        "Turn heads with this Crimson Red Striped Embroidered Bollywood Silk Blend Saree by Mumbai Bazar. Featuring contemporary vertical stripe embellishments and delicate threadwork embroidery, this piece effortlessly blends high-fashion celebrity glam with traditional artisanal elegance. Ideal for wedding receptions, sangeet nights, and festive soirées.",
      gallery: [
        "https://rukminim2.flixcart.com/image/832/832/xif0q/sari/f/l/z/free-fendi-rani-mumbaibazar-unstitched-original-imahqzxqf95asq9w.jpeg?q=80",
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
    img: "https://rukminim2.flixcart.com/image/832/832/xif0q/sari/m/t/z/free-saree-mumbaibazar-unstitched-original-imahqnqzjdynhab6.jpeg?q=80",
    details: {
      fabric: "Breathable Handloom Cotton Silk with Gold Tested Zari",
      drape: "Crisp, neat, structured pleats that hold form effortlessly",
      blousePiece: "0.80 m unstitched matching magenta cotton silk piece",
      length: "5.5 m saree + 0.8 m blouse",
      border: "Traditional Banarasi woven floral zari border",
      palla: "Dense gold zari brocade pallu with paisley ambi motifs",
      care: commonCare,
      description:
        "Crafted for comfort without compromising grandeur, this Vibrant Magenta Banarasi Cotton Silk Saree combines the regal luster of Banaras with breathable cotton silk. Perfect for morning pujas, temple visits, and family celebrations in Mumbai's tropical climate.",
      gallery: [
        "https://rukminim2.flixcart.com/image/832/832/xif0q/sari/m/t/z/free-saree-mumbaibazar-unstitched-original-imahqnqzjdynhab6.jpeg?q=80",
      ],
    },
  },
  {
    id: "woven-bollywood-satin-saree-beige",
    handle: "woven-bollywood-satin-saree-beige",
    shopifyProductId: "mb-flipkart-SARHQG2FPHHGDQTV",
    shopifyVariantId: "mb-var-SARHQG2FPHHGDQTV",
    name: "Woven Bollywood Satin Silk Saree (Champagne Beige)",
    weave: "Bollywood Satin Weave",
    price: "₹ 820",
    original: "₹ 1,499",
    tag: "Bestseller",
    category: ["new-arrivals", "festive-edit", "everyday-sarees"],
    img: "https://rukminim2.flixcart.com/image/832/832/xif0q/sari/l/u/j/free-saare002-mumbai-bazar-unstitched-original-imahqg2feysfeyex.jpeg?q=80",
    details: {
      fabric: "Ultra-Smooth Glossy Satin Silk Blend",
      drape: "Ultra-fluid liquid silk drape that hugs curves elegantly",
      blousePiece: "0.80 m unstitched contrast designer blouse piece",
      length: "5.5 m saree + 0.8 m blouse",
      border: "Woven contrast dual-tone border",
      palla: "Clean minimalist glossy satin pallu with woven edging",
      care: commonCare,
      description:
        "Sleek, fluid, and effortlessly chic, this Champagne Beige Bollywood Satin Saree captures red-carpet minimalism. The satin finish reflects ambient lighting with a liquid sheen, making it an essential pick for cocktail hours, farewells, and evening dinner gatherings.",
      gallery: [
        "https://rukminim2.flixcart.com/image/832/832/xif0q/sari/l/u/j/free-saare002-mumbai-bazar-unstitched-original-imahqg2feysfeyex.jpeg?q=80",
      ],
    },
  },
  {
    id: "cream-floral-paisley-jacquard-saree",
    handle: "cream-floral-paisley-jacquard-saree",
    shopifyProductId: "mb-flipkart-SARHQNM3HEKU9AKU",
    shopifyVariantId: "mb-var-SARHQNM3HEKU9AKU",
    name: "Cream Jacquard Woven Daily Wear Saree (Floral Paisley)",
    weave: "Jacquard Woven Silk",
    price: "₹ 898",
    original: "₹ 1,899",
    tag: "Bestseller",
    category: ["new-arrivals", "everyday-sarees", "silk-sarees"],
    img: "https://rukminim2.flixcart.com/image/832/832/xif0q/sari/f/u/j/free-saree-mumbaibazar-unstitched-original-imahqnm372fe3mhk.jpeg?q=80",
    details: {
      fabric: "Soft Jacquard Weave Cotton Silk",
      drape: "Lightweight, breathable, and zero-fuss daily drape",
      blousePiece: "0.80 m unstitched matching jacquard blouse",
      length: "5.5 m saree + 0.8 m blouse",
      border: "Geometric jacquard border",
      palla: "Traditional paisley floral printed jacquard pallu",
      care: commonCare,
      description:
        "An everyday luxury essential: Cream Jacquard Woven Saree adorned with delicate geometric and paisley motifs. Woven with soft touch threads for pleasant all-day wear at the office, festive get-togethers, or casual social outings.",
      gallery: [
        "https://rukminim2.flixcart.com/image/832/832/xif0q/sari/f/u/j/free-saree-mumbaibazar-unstitched-original-imahqnm372fe3mhk.jpeg?q=80",
      ],
    },
  },
  {
    id: "pearl-white-floral-jacquard-saree",
    handle: "pearl-white-floral-jacquard-saree",
    shopifyProductId: "mb-flipkart-SARHQNM3NGNVF5DZ",
    shopifyVariantId: "mb-var-SARHQNM3NGNVF5DZ",
    name: "Pearl White Floral Jacquard Daily Wear Saree",
    weave: "Jacquard Woven Silk",
    price: "₹ 898",
    original: "₹ 1,899",
    tag: "New",
    category: ["new-arrivals", "everyday-sarees", "silk-sarees"],
    img: "https://rukminim2.flixcart.com/image/832/832/xif0q/sari/a/6/b/free-saree-mumbaibazar-unstitched-original-imahqnm3rpfehfcj.jpeg?q=80",
    details: {
      fabric: "Premium Jacquard Cotton Silk Blend",
      drape: "Crisp, graceful fall with easy pin-up pleating",
      blousePiece: "0.80 m unstitched matching white jacquard piece",
      length: "5.5 m saree + 0.8 m blouse",
      border: "Woven dual-tone jacquard border",
      palla: "Heritage floral motifs on pearl white base",
      care: commonCare,
      description:
        "Serene Pearl White Jacquard Saree engineered with soft-finish yarn. Features botanical floral motifs and subtle self-textured jacquard weaves, ideal for daylight ceremonies, poojas, and office elegance.",
      gallery: [
        "https://rukminim2.flixcart.com/image/832/832/xif0q/sari/a/6/b/free-saree-mumbaibazar-unstitched-original-imahqnm3rpfehfcj.jpeg?q=80",
      ],
    },
  },
  {
    id: "crimson-red-paisley-jacquard-saree",
    handle: "crimson-red-paisley-jacquard-saree",
    shopifyProductId: "mb-flipkart-SARHQNM3EBNEA22W",
    shopifyVariantId: "mb-var-SARHQNM3EBNEA22W",
    name: "Crimson Red Paisley Jacquard Festive Saree",
    weave: "Jacquard Woven Silk",
    price: "₹ 898",
    original: "₹ 1,899",
    tag: "Bestseller",
    category: ["new-arrivals", "festive-edit", "wedding-sarees"],
    img: "https://rukminim2.flixcart.com/image/832/832/xif0q/sari/f/g/o/free-saree-mumbaibazar-unstitched-original-imahqnm3y5zmhhfc.jpeg?q=80",
    details: {
      fabric: "Festive Jacquard Art Silk with Zari Accents",
      drape: "Rich, structured pleats with radiant festive sheen",
      blousePiece: "0.80 m unstitched matching crimson blouse piece",
      length: "5.5 m saree + 0.8 m blouse",
      border: "Traditional gold-touched jacquard border",
      palla: "Elaborate paisley and mandala motifs",
      care: commonCare,
      description:
        "Celebration-ready Crimson Red Jacquard Saree with vibrant festive paisley motifs. Blends festive warmth with lightweight comfort, making it a standout choice for Karwa Chauth, Diwali, and family gatherings.",
      gallery: [
        "https://rukminim2.flixcart.com/image/832/832/xif0q/sari/f/g/o/free-saree-mumbaibazar-unstitched-original-imahqnm3y5zmhhfc.jpeg?q=80",
      ],
    },
  },
  {
    id: "peacock-blue-floral-jacquard-saree",
    handle: "peacock-blue-floral-jacquard-saree",
    shopifyProductId: "mb-flipkart-SARHQNM3YTA2HT4S",
    shopifyVariantId: "mb-var-SARHQNM3YTA2HT4S",
    name: "Royal Peacock Blue Floral Jacquard Celebration Saree",
    weave: "Jacquard Woven Silk",
    price: "₹ 898",
    original: "₹ 1,899",
    tag: "New",
    category: ["new-arrivals", "festive-edit", "everyday-sarees"],
    img: "https://rukminim2.flixcart.com/image/832/832/xif0q/sari/n/d/q/free-saree-mumbaibazar-unstitched-original-imahqnm3yg9tbb8y.jpeg?q=80",
    details: {
      fabric: "Lustrous Jacquard Cotton Silk",
      drape: "Fluid, featherlight, stays in place all day",
      blousePiece: "0.80 m unstitched matching peacock blue blouse",
      length: "5.5 m saree + 0.8 m blouse",
      border: "Contrasting geometric jacquard weave border",
      palla: "Intricate peacock and floral jaal pallu",
      care: commonCare,
      description:
        "Royal Peacock Blue Jacquard Saree radiating deep jewel-toned sophistication. Designed with intricate all-over floral weaving, ideal for evening receptions, festival dinners, and celebratory events.",
      gallery: [
        "https://rukminim2.flixcart.com/image/832/832/xif0q/sari/n/d/q/free-saree-mumbaibazar-unstitched-original-imahqnm3yg9tbb8y.jpeg?q=80",
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
  if (title.includes("chanderi")) return "Chanderi Handloom";
  if (title.includes("kalamkari")) return "Kalamkari Handloom";
  if (title.includes("tissue")) return "Metallic Tissue Silk";
  if (title.includes("organza")) return "Pure Silk Organza";
  if (title.includes("tussar")) return "Tussar Silk";
  if (title.includes("georgette")) return "Pure Silk Georgette";
  if (title.includes("chiffon")) return "Pure Silk Chiffon";
  if (title.includes("saree") || title.includes("silk")) return "Heritage Pure Silk";
  return "Handwoven Heritage Silk";
}

function toProduct(node: ProductNode): ShopifyProduct | null {
  const image = node.featuredImage ?? node.images?.nodes[0];
  const variant = node.variants.nodes[0];
  if (!image || !variant) return null;
  const price = Number(node.priceRange.minVariantPrice.amount);
  const text = `${node.title} ${node.productType || ""} ${node.vendor || ""}`.toLowerCase();
  // Each spread is annotated so TypeScript keeps the literal union rather than
  // widening the branches to string[].
  const category: Product["category"] = [
    "new-arrivals",
    ...(text.includes("wedding") || text.includes("bridal") ? (["wedding-sarees"] as const) : []),
    ...(text.includes("silk") || text.includes("banarasi") || text.includes("kanjivaram")
      ? (["silk-sarees"] as const)
      : []),
    ...(text.includes("festive") ? (["festive-edit"] as const) : []),
    ...(text.includes("everyday") ? (["everyday-sarees"] as const) : []),
  ];
  const gallery = (node.images?.nodes ?? [image]).map((item) => item.url);
  const secondaryImage = gallery.length > 1 ? gallery[1] : undefined;
  const weave = getWeaveFromProduct(node);
  return {
    id: node.handle,
    handle: node.handle,
    shopifyProductId: node.id,
    shopifyVariantId: variant.id,
    img: image.url,
    secondaryImg: secondaryImage,
    name: node.title,
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
      fabric: node.productType || weave,
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
      description: node.description || `${node.title}, curated by Mumbai Bazar.`,
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
