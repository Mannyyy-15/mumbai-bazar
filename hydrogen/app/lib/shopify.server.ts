import type { AppLoadContext } from 'react-router';
import {
  FLIPKART_GALLERIES,
  inferCategories,
  getWeaveFromProduct,
  extractColorFromProduct,
  type CategorySlug,
} from '~/lib/product-enrichment';
import type { Product, ProductVariant, ProductDetails } from '~/lib/site-data';

import { formatINR, type ShopifyProduct } from '~/lib/types';
export { formatINR, type ShopifyProduct };

const commonCare = [
  'Dry clean only for the first wash',
  'Store folded in a soft muslin cloth',
  'Avoid direct sunlight and perfume contact',
  'Iron on low heat with a cotton cloth',
];

export const PRODUCT_FRAGMENT = `#graphql
  fragment ProductFields on Product {
    id
    handle
    title
    vendor
    productType
    description
    tags
    featuredImage {
      url
      altText
    }
    images(first: 12) {
      nodes {
        url
        altText
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
      }
    }
    options {
      id
      name
      values
    }
    variants(first: 30) {
      nodes {
        id
        title
        availableForSale
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
        image {
          url
          altText
        }
      }
    }
  }
`;

export function mapProductNode(node: any): ShopifyProduct | null {
  if (!node) return null;
  const image = node.featuredImage || node.images?.nodes?.[0];
  const firstVariant = node.variants?.nodes?.find((v: any) => v.availableForSale) || node.variants?.nodes?.[0];
  if (!firstVariant) return null;

  const minPriceNum = parseFloat(node.priceRange?.minVariantPrice?.amount || '0');
  const compPriceNum = parseFloat(node.compareAtPriceRange?.minVariantPrice?.amount || '0');

  const galleryOverride = FLIPKART_GALLERIES[node.handle];
  const title = galleryOverride?.name || node.title;
  const weave = galleryOverride?.weave || getWeaveFromProduct(node.title, node.productType, node.vendor);
  const color = extractColorFromProduct(node.title, node.options, node.tags);

  const imagesList = galleryOverride?.gallery?.length
    ? galleryOverride.gallery
    : (node.images?.nodes?.map((i: any) => i.url) || (image?.url ? [image.url] : []));

  const mainImg = imagesList[0] || image?.url || '/products/meher-wine-1.jpeg';
  const secImg = imagesList[1] || mainImg;

  const variants: ProductVariant[] = (node.variants?.nodes || []).map((v: any) => ({
    id: v.id,
    title: v.title,
    price: formatINR(v.price?.amount || minPriceNum),
    original: v.compareAtPrice?.amount ? formatINR(v.compareAtPrice.amount) : undefined,
    available: Boolean(v.availableForSale),
    img: v.image?.url || mainImg,
    selectedOptions: v.selectedOptions || [],
  }));

  const categories = inferCategories(node.title, node.productType, node.vendor, node.tags);

  const details: ProductDetails = {
    fabric: galleryOverride?.fabric || 'Silk Blend',
    drape: 'Structured, sculpted pleats',
    blousePiece: '0.80 m matching unstitched blouse piece',
    length: '5.5 m saree + 0.8 m blouse piece',
    border: 'Woven zari border with traditional craftsmanship',
    palla: 'Artisanal zari pallu with ornate butti motifs',
    care: commonCare,
    description: galleryOverride?.description || node.description || `${title} hand-curated from regional weaving clusters.`,
    gallery: imagesList,
  };

  const tag: Product['tag'] = node.tags?.some((t: string) => /bestseller/i.test(t))
    ? 'Bestseller'
    : node.tags?.some((t: string) => /new/i.test(t))
    ? 'New'
    : null;

  return {
    id: node.handle,
    handle: node.handle,
    shopifyProductId: node.id,
    shopifyVariantId: firstVariant.id,
    name: title,
    weave,
    rawPrice: minPriceNum,
    price: formatINR(minPriceNum),
    original: compPriceNum > minPriceNum ? formatINR(compPriceNum) : undefined,
    img: mainImg,
    secondaryImg: secImg,
    category: categories,
    tag,
    details,
    variants,
    options: node.options,
    color,
    tags: node.tags || [],
  };
}

export async function fetchLiveProducts(
  context: AppLoadContext,
  first = 100,
): Promise<ShopifyProduct[]> {
  const query = `#graphql
    query GetAllProducts($first: Int!) {
      products(first: $first, sortKey: BEST_SELLING) {
        nodes {
          ...ProductFields
        }
      }
    }
    ${PRODUCT_FRAGMENT}
  `;

  try {
    const data: any = await context.storefront.query(query, {
      variables: { first },
      cache: context.storefront.CacheShort(),
    });

    const products = (data?.products?.nodes || [])
      .map(mapProductNode)
      .filter((p: any): p is ShopifyProduct => Boolean(p));

    return products;
  } catch (error) {
    console.error('Error fetching live products from Shopify storefront:', error);
    return [];
  }
}

export async function fetchLiveProduct(
  context: AppLoadContext,
  handle: string,
): Promise<ShopifyProduct | null> {
  const query = `#graphql
    query GetProductByHandle($handle: String!) {
      product(handle: $handle) {
        ...ProductFields
      }
    }
    ${PRODUCT_FRAGMENT}
  `;

  try {
    const data: any = await context.storefront.query(query, {
      variables: { handle },
      cache: context.storefront.CacheShort(),
    });

    if (!data?.product) return null;
    return mapProductNode(data.product);
  } catch (error) {
    console.error(`Error fetching product ${handle}:`, error);
    return null;
  }
}
