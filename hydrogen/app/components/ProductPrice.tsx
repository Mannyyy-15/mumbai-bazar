import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  return (
    <div aria-label="Price" className="product-price" role="group">
      {compareAtPrice ? (
        <div className="product-price-on-sale flex items-baseline gap-2">
          {price ? <span className="text-black font-extrabold"><Money data={price} /></span> : null}
          <s className="text-red-600 font-semibold line-through text-xs">
            <Money data={compareAtPrice} />
          </s>
        </div>
      ) : price ? (
        <span className="text-black font-extrabold"><Money data={price} /></span>
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}
