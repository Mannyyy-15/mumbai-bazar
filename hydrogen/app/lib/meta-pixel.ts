/**
 * Meta Pixel (Facebook Pixel) conversion tracking helpers.
 *
 * Fires standard Meta events required for:
 * - Dynamic Product Ads (DPA / Advantage+ catalog)
 * - Custom Audiences (retargeting viewers, cart abandoners)
 * - Conversion optimization (purchase, add-to-cart based bidding)
 *
 * Pixel ID: 1663032738861857
 * Installed in: root.tsx <head>
 */

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

function fbq(...args: any[]) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq(...args);
  }
}

/** Extract clean numeric value from formatted price like "₹ 1,999" → 1999 */
function cleanPrice(price?: string): number {
  if (!price) return 0;
  const n = Number(String(price).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/**
 * ViewContent — fires on Product Detail Page load.
 * Required for Dynamic Product Ads retargeting.
 */
export function trackViewContent(product: {
  id: string;
  name: string;
  price: string;
  weave?: string;
  handle?: string;
}) {
  fbq("track", "ViewContent", {
    content_name: product.name,
    content_ids: [product.id],
    content_type: "product",
    value: cleanPrice(product.price),
    currency: "INR",
    content_category: product.weave || "Saree",
  });
}

/**
 * AddToCart — fires when user clicks "Shop Now" to add to bag.
 * Critical for cart-abandonment retargeting and ATC optimization.
 */
export function trackAddToCart(product: {
  id: string;
  name: string;
  price: string;
  quantity: number;
  variantId?: string;
}) {
  fbq("track", "AddToCart", {
    content_name: product.name,
    content_ids: [product.variantId || product.id],
    content_type: "product",
    value: cleanPrice(product.price) * product.quantity,
    currency: "INR",
    num_items: product.quantity,
  });
}

/**
 * InitiateCheckout — fires when user proceeds to Shopify checkout.
 */
export function trackInitiateCheckout(cart: {
  totalAmount: number;
  numItems: number;
  contentIds: string[];
}) {
  fbq("track", "InitiateCheckout", {
    content_ids: cart.contentIds,
    content_type: "product",
    value: cart.totalAmount,
    currency: "INR",
    num_items: cart.numItems,
  });
}

/**
 * Search — fires on the search results page.
 * Helps Meta understand product interest signals.
 */
export function trackSearch(query: string) {
  fbq("track", "Search", {
    search_string: query,
    content_category: "Saree",
  });
}

/**
 * AddToWishlist — fires when user saves to wishlist.
 */
export function trackAddToWishlist(product: {
  id: string;
  name: string;
  price: string;
}) {
  fbq("track", "AddToWishlist", {
    content_name: product.name,
    content_ids: [product.id],
    content_type: "product",
    value: cleanPrice(product.price),
    currency: "INR",
  });
}
