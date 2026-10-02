import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {Money, type OptimisticCart} from '@shopify/hydrogen';
import {useEffect, useId} from 'react';
import {Lock, ArrowRight, Truck, ShieldCheck, RotateCcw, CheckCircle2} from 'lucide-react';
import {COD_FEE_LABEL} from '~/lib/commerce';
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
   * Warm the connection to the checkout domain while the customer is still
   * looking at their bag for instantaneous transition to checkout.
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
      className={`border-t border-gold/30 bg-white ${
        isAside
          ? 'p-5 sm:p-6 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] shrink-0 mt-auto'
          : 'p-6 rounded-2xl border border-gold/40 max-w-lg mx-auto shadow-sm my-6'
      }`}
    >
      {/* Price breakdown */}
      <div className="space-y-2.5">
        <div className="flex items-baseline justify-between">
          <span
            id={summaryId}
            className="text-xs uppercase tracking-widest font-semibold text-ink/70"
          >
            Subtotal
          </span>
          <span className="font-sans text-2xl font-extrabold text-black tabular-nums tracking-tight">
            {cart?.cost?.subtotalAmount?.amount ? (
              <Money data={cart?.cost?.subtotalAmount} />
            ) : (
              '—'
            )}
          </span>
        </div>

        {hasDiscount && (
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 bg-emerald-50/80 px-2.5 py-1.5 rounded-lg border border-emerald-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>Promotional Savings</span>
            </span>
            <span>-<Money data={discountAmount} /></span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-ink/75 pt-1">
          <span className="font-medium">Estimated Delivery</span>
          <span className="font-semibold text-emerald-800">
            Free on Prepaid <span className="font-normal text-ink/60">(COD available)</span>
          </span>
        </div>

        <p className="text-[11px] text-ink/60 font-medium leading-relaxed">
          Taxes included. Standard shipping and COD options confirmed at checkout.
        </p>
      </div>

      {/* Value Reassurance Strip */}
      <div className="mt-3.5 rounded-xl border border-gold/30 bg-[#FAF7F2] p-3">
        <div className="flex items-start gap-2.5">
          <Truck className="h-4 w-4 shrink-0 text-maroon mt-0.5" />
          <p className="text-[11px] leading-snug text-ink/85">
            <strong className="font-semibold text-maroon">
              Free Express Delivery
            </strong>{' '}
            on prepaid orders via UPI, Cards & NetBanking. COD available across India.
          </p>
        </div>
      </div>

      {/* Checkout Action Button */}
      <div className="mt-4">
        {checkoutUrl ? (
          <a
            href={checkoutUrl}
            target="_self"
            onClick={handleCheckoutClick}
            className="group relative flex w-full flex-col items-center justify-center rounded-xl bg-maroon py-3.5 px-4 text-white shadow-md transition-all duration-200 hover:bg-[#4a020c] active:scale-[0.99]"
          >
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.14em]">
              <Lock className="h-4 w-4 text-gold shrink-0" />
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4 text-gold transition-transform group-hover:translate-x-1" />
            </div>
            <span className="mt-0.5 text-[10px] font-normal tracking-wide text-white/85">
              UPI • Cards • NetBanking • Cash on Delivery (COD)
            </span>
          </a>
        ) : (
          <button
            disabled
            className="flex w-full items-center justify-center rounded-xl bg-maroon/50 py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-white cursor-not-allowed"
          >
            Checkout Unavailable
          </button>
        )}
      </div>

      {/* Trust Pillars */}
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gold/25 pt-3.5 text-center text-[10px] font-bold uppercase tracking-wider text-ink/75">
        <div className="flex flex-col items-center gap-1">
          <Truck className="h-3.5 w-3.5 text-gold-deep" />
          <span>Insured Transit</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-gold-deep" />
          <span>100% Authentic</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <RotateCcw className="h-3.5 w-3.5 text-gold-deep" />
          <span>7-Day Returns</span>
        </div>
      </div>
    </div>
  );
}
