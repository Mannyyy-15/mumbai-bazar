/**
 * Commercial terms shown to customers.
 *
 * Single source of truth for anything the storefront states about money that
 * is not a product price — currently the Cash on Delivery handling fee. The
 * number appears in the cart, on product pages, in the shipping policy and in
 * the FAQ; a second hardcoded copy is a copy that drifts, and a fee quoted
 * differently in two places is the kind of thing customers screenshot.
 *
 * IMPORTANT: changing COD_FEE here changes what the site SAYS, not what
 * Shopify CHARGES.
 *
 * Shopify computes shipping and discounts when the cart is built. The customer
 * picks COD vs prepaid afterwards, inside Shopify's own checkout, which a
 * headless Hydrogen storefront has no access to. So the fee is configured as a
 * shipping rate in Shopify admin (Settings → Shipping and delivery), and these
 * constants exist to state it accurately beforehand.
 *
 * If you change the rate in Shopify admin, change it here in the same sitting.
 */

/** COD handling fee in rupees. Must match the Shopify shipping rate exactly. */
export const COD_FEE = 50;

/** Display form, e.g. "₹50". Use this rather than formatting inline. */
export const COD_FEE_LABEL = `₹${COD_FEE}`;

/**
 * One-line summary of the delivery terms, for compact spaces.
 *
 * Deliberately leads with the free option: the point of the fee is to make
 * prepaid the obvious choice, not to make delivery sound expensive.
 */
export const DELIVERY_SUMMARY = `Free delivery on prepaid orders · ${COD_FEE_LABEL} for Cash on Delivery`;
