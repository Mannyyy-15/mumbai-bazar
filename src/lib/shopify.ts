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

export async function fetchShopifyProducts(first = 50): Promise<ShopifyProduct[]> {
  const payload = await storefrontRequest<{ products: { nodes: ProductNode[] } }>(
    `query Products($first: Int!) { products(first: $first, sortKey: BEST_SELLING) { nodes { ${PRODUCT_FIELDS} } } }`,
    { first },
  );
  return payload.products.nodes.map(toProduct).filter(Boolean) as ShopifyProduct[];
}

export async function fetchShopifyProduct(handle: string): Promise<ShopifyProduct | null> {
  const payload = await storefrontRequest<{ product: ProductNode | null }>(
    `query Product($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} } }`,
    { handle },
  );
  return payload.product ? toProduct(payload.product) : null;
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
  return {
    id: node.handle,
    handle: node.handle,
    shopifyProductId: node.id,
    shopifyVariantId: variant.id,
    img: image.url,
    name: node.title,
    weave: node.productType || node.vendor || "Mumbai Bazar",
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
      fabric: node.productType || "Handwoven textile",
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
