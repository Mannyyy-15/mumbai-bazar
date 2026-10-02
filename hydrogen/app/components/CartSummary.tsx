import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {Money, type OptimisticCart} from '@shopify/hydrogen';
import {useEffect, useId} from 'react';
import {Lock, ArrowRight} from 'lucide-react';
import {trackInitiateCheckout} from '~/lib/meta-pixel';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const summaryId = useId();
  const checkoutUrl = cart?.checkoutUrl;
  const isAside = layout === 'aside';

  const discountAmount = cart?.cost?.totalDiscountAmount;
  const hasDiscount =
    Boolean(discountAmount?.amount) && Number(discountAmount?.amount || 0) > 0;

  /**
   * Warm connection to checkout domain for instant transition.
   */
  useEffect(() => {
    if (!checkoutUrl) return;
    let origin: string;
    try {
      origin = new URL(checkoutUrl).origin;
    } catch {
      return;
    }
    if (document.querySelector(`link[rel="preconnect"][href="${origin}"]`)) return;

    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = origin;
    preconnect.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect);

    const dns = document.createElement('link');
    dns.rel = 'dns-prefetch';
    dns.href = origin;
    document.head.appendChild(dns);
  }, [checkoutUrl]);

  const handleCheckoutClick = () => {
    if (cart?.lines?.nodes) {
      const contentIds = cart.lines.nodes.map((line: any) => line.merchandise?.id || '');
      const totalAmount = Number(cart.cost?.subtotalAmount?.amount || 0);
      const numItems = cart.totalQuantity || 0;
      trackInitiateCheckout({totalAmount, numItems, contentIds});
    }
  };

  return (
    <div
      aria-labelledby={summaryId}
      className={`border-t border-gold/25 bg-white ${
        isAside
          ? 'p-5 shrink-0 mt-auto shadow-[0_-4px_20px_rgba(0,0,0,0.04)]'
          : 'p-6 rounded-2xl border border-gold/30 max-w-md mx-auto my-6 shadow-sm'
      }`}
    >
      {/* Subtotal & Discount */}
      <div className="space-y-1">
        <div className="flex items-baseline justify-between">
          <span
            id={summaryId}
            className="text-xs uppercase tracking-widest font-semibold text-ink/70"
          >
            Subtotal
          </span>
          <span className="font-sans text-xl sm:text-2xl font-extrabold text-black tabular-nums tracking-tight">
            {cart?.cost?.subtotalAmount?.amount ? (
              <Money data={cart?.cost?.subtotalAmount} />
            ) : (
              '—'
            )}
          </span>
        </div>

        {hasDiscount && (
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-700">
            <span>Discount Applied</span>
            <span>-<Money data={discountAmount} /></span>
          </div>
        )}

        <p className="text-[11px] text-ink/50">
          Shipping and taxes calculated at checkout
        </p>
      </div>

      {/* Primary Checkout Button */}
      <div className="mt-4">
        {checkoutUrl ? (
          <a
            href={checkoutUrl}
            target="_self"
            onClick={handleCheckoutClick}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-maroon py-3.5 px-6 text-sm font-semibold tracking-wide text-white transition-all hover:bg-[#4a020c] active:scale-[0.99] shadow-sm"
          >
            <Lock className="h-4 w-4 text-gold shrink-0" />
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-4 w-4 text-gold transition-transform group-hover:translate-x-1" />
          </a>
        ) : (
          <button
            disabled
            className="flex w-full items-center justify-center rounded-xl bg-maroon/50 py-3.5 px-6 text-sm font-semibold text-white cursor-not-allowed"
          >
            Checkout Unavailable
          </button>
        )}
      </div>
    </div>
  );
}
