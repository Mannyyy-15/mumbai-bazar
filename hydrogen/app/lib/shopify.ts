const domain = "checkout.mumbaibazar.com";

/**
 * Rewrites a Shopify CDN image URL to request a resized, modern-format copy.
 */
export function shopifyImage(url: string | null | undefined, width: number): string {
  if (!url) return "";
  if (!url.includes("cdn.shopify.com")) return url;
  try {
    const u = new URL(url);
    u.searchParams.set("width", String(width));
    u.searchParams.set("format", "webp");
    return u.toString();
  } catch {
    return url;
  }
}

/** Builds a srcSet so the browser picks the right width for the device. */
export function shopifyImageSrcSet(url: string | null | undefined, widths: number[]): string {
  if (!url || !url.includes("cdn.shopify.com")) return "";
  return widths.map((w) => `${shopifyImage(url, w)} ${w}w`).join(", ");
}

export function getDirectCheckoutUrl(variantId: string, quantity = 1): string {
  const numericId = variantId.includes("ProductVariant/")
    ? variantId.split("ProductVariant/")[1]
    : variantId;
  return `https://${domain}/cart/${numericId}:${quantity}`;
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
