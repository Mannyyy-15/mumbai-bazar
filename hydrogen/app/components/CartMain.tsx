import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem, type CartLine} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {ShoppingBag, Truck} from 'lucide-react';

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
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  return (
    <section
      className="flex-1 flex flex-col justify-between overflow-hidden"
      aria-label={layout === 'page' ? 'Cart page' : 'Cart drawer'}
    >
      {/* Free Shipping Assurance Banner */}
      <div className="border-b border-gold/30 bg-gold/10 px-5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-maroon">
          <Truck className="h-4 w-4 text-gold-deep shrink-0" />
          <span>Free express insured delivery on prepaid orders</span>
        </div>
      </div>

      {!cartHasItems ? (
        <CartEmpty layout={layout} />
      ) : (
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          <ul
            aria-label="Line items"
            className="flex-1 divide-y divide-gold/25 overflow-y-auto px-4 py-3 space-y-3"
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
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-3xl border border-gold/40 bg-white shadow-sm">
        <ShoppingBag className="h-9 w-9 text-maroon/70" />
      </div>
      <h3 className="mt-5 font-serif text-2xl font-bold text-maroon">Your bag is empty</h3>
      <p className="mt-2 max-w-xs text-xs sm:text-sm text-ink/75 font-medium leading-relaxed">
        Explore our bridal heirlooms, Banarasi katan silks, and festive drapes.
      </p>
      <div className="mt-6 flex flex-col gap-2.5 w-full max-w-xs">
        <Link
          to="/shop"
          onClick={close}
          className="w-full py-3.5 rounded-full bg-maroon text-white text-xs font-bold uppercase tracking-wider hover:bg-wine transition-all shadow-md text-center"
        >
          Browse All Sarees
        </Link>
        <Link
          to="/collections"
          onClick={close}
          className="w-full py-3 rounded-full border border-maroon/30 text-maroon text-xs font-bold uppercase tracking-wider hover:bg-maroon/5 transition-all text-center"
        >
          Explore Collections
        </Link>
      </div>
    </div>
  );
}
