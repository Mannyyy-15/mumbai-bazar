import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useEffect, useId, useRef, useState} from 'react';
import {useFetcher} from 'react-router';
import {Lock, ArrowRight, MessageCircle, Truck, ShieldCheck, RotateCcw} from 'lucide-react';
import {COD_FEE_LABEL} from '~/lib/commerce';
import {SITE} from '~/lib/seo';
import {trackInitiateCheckout} from '~/lib/meta-pixel';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const summaryId = useId();
  const discountsHeadingId = useId();
  const discountCodeInputId = useId();
  const giftCardHeadingId = useId();
  const giftCardInputId = useId();

  return (
    <div
      aria-labelledby={summaryId}
      className="border-t border-gold/40 bg-white px-5 pb-6 pt-4 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider font-semibold text-taupe">
          Subtotal
        </span>
        <span className="font-serif text-xl font-bold text-maroon">
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart?.cost?.subtotalAmount} />
          ) : (
            '—'
          )}
        </span>
      </div>

      <p className="mt-1.5 text-xs text-ink/70 font-medium">
        Inclusive of all taxes.
      </p>

      {/*
        Payment-method pricing, stated before checkout.

        Shopify cannot vary a discount by payment method from a headless
        storefront: discounts are computed when the cart is built, and the
        customer chooses COD vs prepaid later, inside Shopify's own checkout.
        So the COD fee is configured as a shipping rate in Shopify admin, and
        this block exists so the number is never a surprise at the payment step
        — which is where an unexpected charge turns into an abandoned cart.
      */}
      <div className="mt-3 rounded-lg border border-gold/40 bg-beige/25 p-3">
        <div className="flex items-start gap-2">
          <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-deep" />
          <p className="text-[11px] leading-snug text-ink/80">
            <strong className="font-semibold text-maroon">
              Free delivery on online payment
            </strong>{' '}
            — UPI, card or netbanking.{' '}
            <span className="text-ink/65">
              Cash on Delivery adds a {COD_FEE_LABEL} handling fee, shown at checkout.
            </span>
          </p>
        </div>
      </div>

      <CartDiscounts
        discountCodes={cart?.discountCodes}
        discountsHeadingId={discountsHeadingId}
        discountCodeInputId={discountCodeInputId}
      />
      <CartGiftCard
        giftCardCodes={cart?.appliedGiftCards}
        giftCardHeadingId={giftCardHeadingId}
        giftCardInputId={giftCardInputId}
      />

      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} cart={cart} />

      {/* Trust Badges */}
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gold/30 pt-3.5 text-center text-[10px] uppercase font-bold tracking-wider text-ink/75">
        <div className="flex flex-col items-center gap-1">
          <Truck className="h-4 w-4 text-gold-deep" />
          <span>Free on prepaid</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ShieldCheck className="h-4 w-4 text-gold-deep" />
          <span>See in store</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <RotateCcw className="h-4 w-4 text-gold-deep" />
          <span>7-Day Returns</span>
        </div>
      </div>
    </div>
  );
}

function CartCheckoutActions({checkoutUrl, cart}: {checkoutUrl?: string; cart?: OptimisticCart<CartApiQueryFragment | null>}) {
  const waMsg = encodeURIComponent(
    `Hello Mumbai Bazar, I would like to place an order from my online cart. Please assist me with payment and delivery confirmation.`,
  );
  const waHref = `https://wa.me/${SITE.whatsapp}?text=${waMsg}`;

  const handleCheckoutClick = () => {
    if (cart?.lines?.nodes) {
      const contentIds = cart.lines.nodes.map((line: any) => line.merchandise?.id || '');
      const totalAmount = Number(cart.cost?.subtotalAmount?.amount || 0);
      const numItems = cart.totalQuantity || 0;
      trackInitiateCheckout({totalAmount, numItems, contentIds});
    }
  };

  return (
    <div className="mt-4 grid gap-2.5">
      {checkoutUrl && (
        <a
          href={checkoutUrl}
          target="_self"
          onClick={handleCheckoutClick}
          className="flex flex-col items-center justify-center gap-1 w-full rounded-xl bg-maroon py-3.5 px-4 text-white hover:bg-wine active:scale-98 transition-all shadow-md group"
        >
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <Lock className="h-4 w-4 text-gold" />
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
          <span className="text-[10px] text-white/80 font-medium tracking-normal">
            UPI • Cards • Cash on Delivery (COD)
          </span>
        </a>
      )}

      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#25D366] bg-[#25D366]/10 py-3 text-xs font-bold uppercase tracking-wider text-[#128C7E] hover:bg-[#25D366] hover:text-white active:scale-98 transition-all shadow-sm"
      >
        <MessageCircle className="h-4 w-4" />
        <span>Order Directly on WhatsApp</span>
      </a>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
  discountsHeadingId,
  discountCodeInputId,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
  discountsHeadingId: string;
  discountCodeInputId: string;
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <section aria-label="Discounts">
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt id={discountsHeadingId}>Discounts</dt>
          <UpdateDiscountForm>
            <div
              className="cart-discount"
              role="group"
              aria-labelledby={discountsHeadingId}
            >
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button type="submit" aria-label="Remove discount">
                Remove
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div>
          <label htmlFor={discountCodeInputId} className="sr-only">
            Discount code
          </label>
          <input
            id={discountCodeInputId}
            type="text"
            name="discountCode"
            placeholder="Discount code"
          />
          &nbsp;
          <button type="submit" aria-label="Apply discount code">
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </section>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
  giftCardHeadingId,
  giftCardInputId,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
  giftCardHeadingId: string;
  giftCardInputId: string;
}) {
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const removeButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const previousCardIdsRef = useRef<string[]>([]);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});
  const [removedCardIndex, setRemovedCardIndex] = useState<number | null>(null);

  useEffect(() => {
    if (giftCardAddFetcher.data) {
      if (giftCardCodeInput.current !== null) {
        giftCardCodeInput.current.value = '';
      }
    }
  }, [giftCardAddFetcher.data]);

  useEffect(() => {
    const currentCardIds = giftCardCodes?.map((card) => card.id) || [];

    if (removedCardIndex !== null && giftCardCodes) {
      const focusTargetIndex = Math.min(
        removedCardIndex,
        giftCardCodes.length - 1,
      );
      const focusTargetCard = giftCardCodes[focusTargetIndex];
      const focusButton = focusTargetCard
        ? removeButtonRefs.current.get(focusTargetCard.id)
        : null;

      if (focusButton) {
        focusButton.focus();
      } else if (giftCardCodeInput.current) {
        giftCardCodeInput.current.focus();
      }

      setRemovedCardIndex(null);
    }

    previousCardIdsRef.current = currentCardIds;
  }, [giftCardCodes, removedCardIndex]);

  const handleRemoveClick = (cardId: string) => {
    const index = previousCardIdsRef.current.indexOf(cardId);
    if (index !== -1) {
      setRemovedCardIndex(index);
    }
  };

  return (
    <section aria-label="Gift cards">
      {giftCardCodes && giftCardCodes.length > 0 && (
        <dl>
          <dt id={giftCardHeadingId}>Applied Gift Card(s)</dt>
          {giftCardCodes.map((giftCard) => (
            <dd key={giftCard.id} className="cart-discount">
              <RemoveGiftCardForm
                giftCardId={giftCard.id}
                lastCharacters={giftCard.lastCharacters}
                onRemoveClick={() => handleRemoveClick(giftCard.id)}
                buttonRef={(el: HTMLButtonElement | null) => {
                  if (el) {
                    removeButtonRefs.current.set(giftCard.id, el);
                  } else {
                    removeButtonRefs.current.delete(giftCard.id);
                  }
                }}
              >
                <code>***{giftCard.lastCharacters}</code>
                &nbsp;
                <Money data={giftCard.amountUsed} />
              </RemoveGiftCardForm>
            </dd>
          ))}
        </dl>
      )}

      <AddGiftCardForm fetcherKey="gift-card-add">
        <div>
          <label htmlFor={giftCardInputId} className="sr-only">
            Gift card code
          </label>
          <input
            id={giftCardInputId}
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
          />
          &nbsp;
          <button
            type="submit"
            disabled={giftCardAddFetcher.state !== 'idle'}
            aria-label="Apply gift card code"
          >
            Apply
          </button>
        </div>
      </AddGiftCardForm>
    </section>
  );
}

function AddGiftCardForm({
  fetcherKey,
  children,
}: {
  fetcherKey?: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesAdd}
    >
      {children}
    </CartForm>
  );
}

function RemoveGiftCardForm({
  giftCardId,
  lastCharacters,
  children,
  onRemoveClick,
  buttonRef,
}: {
  giftCardId: string;
  lastCharacters: string;
  children: React.ReactNode;
  onRemoveClick?: () => void;
  buttonRef?: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
      &nbsp;
      <button
        type="submit"
        aria-label={`Remove gift card ending in ${lastCharacters}`}
        onClick={onRemoveClick}
        ref={buttonRef}
      >
        Remove
      </button>
    </CartForm>
  );
}
