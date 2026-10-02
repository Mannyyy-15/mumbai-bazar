import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem, type CartLine} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {ShoppingBag} from 'lucide-react';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export type LineItemChildrenMap = {[parentId: string]: CartLine[]};

function getLineItemChildrenMap(lines: CartLine[]): LineItemChildrenMap {
  const children: LineItemChildrenMap = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const lineChildren = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(lineChildren)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childIds);
      }
    }
  }
  return children;
}

export function CartMain({layout, cart: originalCart}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  return (
    <section
      className="flex-1 flex flex-col justify-between overflow-hidden"
      aria-label={layout === 'page' ? 'Cart page' : 'Cart drawer'}
    >
      {!cartHasItems ? (
        <CartEmpty layout={layout} />
      ) : (
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          <ul
            aria-label="Line items"
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
          >
            {(cart?.lines?.nodes ?? []).map((line) => {
              if (
                'parentRelationship' in line &&
                line.parentRelationship?.parent
              ) {
                return null;
              }
              return (
                <CartLineItem
                  key={line.id}
                  line={line}
                  layout={layout}
                  childrenMap={childrenMap}
                />
              );
            })}
          </ul>
          <CartSummary cart={cart} layout={layout} />
        </div>
      )}
    </section>
  );
}

function CartEmpty({layout}: {layout?: CartMainProps['layout']}) {
  const {close} = useAside();
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-14 text-center">
      <div className="relative mb-5 grid h-20 w-20 place-items-center rounded-full bg-maroon/5 border border-gold/30 shadow-inner">
        <ShoppingBag className="h-9 w-9 text-maroon/80" />
        <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-white text-xs">
          ✦
        </span>
      </div>
      <h3 className="font-serif text-2xl font-bold text-ink">Your bag is empty</h3>
      <p className="mt-2 max-w-xs text-xs sm:text-sm text-ink/70 font-medium leading-relaxed">
        Discover our heirloom Banarasi silks, Kanjivaram weaves, and bridal drapes.
      </p>
      <div className="mt-6 flex flex-col gap-2.5 w-full max-w-xs">
        <Link
          to="/shop"
          onClick={close}
          className="w-full py-3.5 rounded-xl bg-maroon text-white text-xs font-bold uppercase tracking-[0.14em] hover:bg-[#4a020c] transition-all shadow-md text-center"
        >
          Explore All Sarees
        </Link>
        <Link
          to="/collections"
          onClick={close}
          className="w-full py-3 rounded-xl border border-gold/40 text-maroon text-xs font-bold uppercase tracking-[0.12em] hover:bg-maroon/5 transition-all text-center bg-white"
        >
          Browse Collections
        </Link>
      </div>
    </div>
  );
}
