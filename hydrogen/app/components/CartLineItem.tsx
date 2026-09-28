import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout, LineItemChildrenMap} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import {Trash2, Minus, Plus} from 'lucide-react';
import type {
  CartApiQueryFragment,
  CartLineFragment,
} from 'storefrontapi.generated';

export type CartLine = OptimisticCartLine<CartApiQueryFragment>;

export function CartLineItem({
  layout,
  line,
  childrenMap,
}: {
  layout: CartLayout;
  line: CartLine;
  childrenMap: LineItemChildrenMap;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const lineItemChildren = childrenMap[id];
  const childrenLabelId = `cart-line-children-${id}`;

  return (
    <li key={id} className="flex gap-3.5 rounded-2xl border border-gold/35 bg-white p-3.5 shadow-sm">
      {image && (
        <Link
          to={lineItemUrl}
          onClick={() => {
            if (layout === 'aside') close();
          }}
          className="block h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F0E9DC] border border-gold/30"
        >
          <Image
            alt={title}
            aspectRatio="4/5"
            data={image}
            height={120}
            loading="lazy"
            width={96}
            className="h-full w-full object-cover object-top"
          />
        </Link>
      )}

      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              prefetch="intent"
              to={lineItemUrl}
              onClick={() => {
                if (layout === 'aside') {
                  close();
                }
              }}
              className="font-sans text-sm sm:text-base font-bold text-ink hover:text-maroon transition-colors line-clamp-2 leading-snug"
            >
              {product.title}
            </Link>

            <CartLineRemoveButton lineIds={[id]}>
              <button
                type="submit"
                aria-label={`Remove ${product.title}`}
                className="p-1 text-ink/40 hover:text-maroon transition-colors shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </CartLineRemoveButton>
          </div>

          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {selectedOptions
              .filter((opt) => opt.value !== 'Default Title')
              .map((option) => (
                <span
                  key={option.name}
                  className="px-2 py-0.5 rounded-full bg-maroon/10 text-[10px] font-bold uppercase tracking-wider text-maroon"
                >
                  {option.name}: {option.value}
                </span>
              ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gold/20 mt-2">
          {/* Quantity Controls */}
          <CartLineQuantity line={line} />

          {/* Price */}
          <div className="font-sans text-base font-bold text-maroon tabular-nums tracking-tight">
            <ProductPrice price={line?.cost?.totalAmount} />
          </div>
        </div>

        {lineItemChildren ? (
          <div className="mt-2 pl-3 border-l border-gold/30">
            <p id={childrenLabelId} className="sr-only">
              Line items with {product.title}
            </p>
            <ul aria-labelledby={childrenLabelId} className="space-y-2">
              {lineItemChildren.map((childLine) => (
                <CartLineItem
                  childrenMap={childrenMap}
                  key={childLine.id}
                  line={childLine}
                  layout={layout}
                />
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </li>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="inline-flex items-center rounded-full border border-maroon/30 bg-[#FAF7F2] p-0.5">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          value={prevQuantity}
          className="grid h-6 w-6 place-items-center rounded-full text-maroon hover:bg-maroon hover:text-white transition-colors disabled:opacity-30"
        >
          <Minus className="h-3 w-3" />
        </button>
      </CartLineUpdateButton>
      <span className="inline-block w-7 text-center text-xs font-bold text-ink">
        {quantity}
      </span>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
          disabled={!!isOptimistic}
          className="grid h-6 w-6 place-items-center rounded-full text-maroon hover:bg-maroon hover:text-white transition-colors disabled:opacity-30"
        >
          <Plus className="h-3 w-3" />
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

function CartLineRemoveButton({
  children,
  lineIds,
  disabled,
}: {
  children: React.ReactNode;
  lineIds: string[];
  disabled?: boolean;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      {children}
    </CartForm>
  );
}
