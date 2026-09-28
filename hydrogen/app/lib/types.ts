import type { Product, ProductVariant, ProductDetails } from '~/lib/site-data';

export type ShopifyProduct = Product & {
  shopifyProductId: string;
  shopifyVariantId: string;
  handle: string;
  rawPrice: number;
};

export function formatINR(amount: string | number): string {
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount));
  if (isNaN(num)) return '₹ 0';
  return `₹ ${Math.round(num).toLocaleString('en-IN')}`;
}
