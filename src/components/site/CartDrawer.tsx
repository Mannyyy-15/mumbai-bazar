import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useCart, formatINR, type CartItem } from "@/lib/cart-context";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { useCountUp } from "@/hooks/use-count-up";

const WHATSAPP_NUMBER = "919999999999";

export function CartDrawer() {
  const { items, isOpen, closeCart, setQty, removeItem, subtotal, count, checkoutUrl } = useCart();
  const panelRef = useFocusTrap<HTMLElement>(isOpen);

  const waMsg = encodeURIComponent(
    `Hello Mumbai Bazar, I'd like to place an order:\n\n${items
      .map((i) => `• ${i.name} × ${i.qty} — ${i.priceLabel}`)
      .join("\n")}\n\nSubtotal: ${formatINR(subtotal)}`,
  );
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`;

  return (
    <div
      className={`fixed inset-0 z-[60] overflow-hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      {/* Scrim */}
      <div
        className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
      />

      {/* Panel */}
      <aside
        ref={panelRef}
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        tabIndex={-1}
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl transition-transform duration-300 ease-out focus:outline-none ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gold/50 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-maroon" />
            <h2 id="cart-drawer-title" className="font-serif text-xl text-maroon">
              Your Bag
              <span className="ml-2 text-sm text-taupe">
                ({count} {count === 1 ? "item" : "items"})
              </span>
            </h2>
          </div>

          <button
            aria-label="Close bag"
            onClick={closeCart}
            className="grid h-9 w-9 place-items-center text-ink hover:text-maroon transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-beige/60">
              <ShoppingBag className="h-7 w-7 text-maroon" />
            </div>
            <h3 className="mt-5 font-serif text-2xl text-ink">Your bag is empty</h3>
            <p className="mt-2 max-w-xs text-sm text-taupe">
              Discover heirloom weaves and festive edits curated for you.
            </p>
            <Link to="/new-arrivals" onClick={closeCart} className="btn-primary mt-6 inline-flex">
              Shop New Arrivals
            </Link>
            <Link
              to="/collections"
              onClick={closeCart}
              className="mt-3 text-xs uppercase tracking-[0.22em] text-gold-deep hover:text-maroon"
            >
              Browse Collections
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-gold/15 overflow-y-auto">
              {items.map((item) => (
                <CartRow
                  key={item.id}
                  item={item}
                  onChange={(qty) => setQty(item.id, qty)}
                  onRemove={() => removeItem(item.id)}
                  onCloseCart={closeCart}
                />
              ))}
            </ul>

            {/* Footer */}
            <div className="border-t border-gold/50 bg-ivory px-5 pb-5 pt-4">
              <SubtotalRow subtotal={subtotal} />
              <p className="mt-1 text-[11px] text-taupe">
                Shipping & taxes calculated at checkout.
              </p>

              <div className="mt-4 grid gap-2">
                {checkoutUrl ? (
                  <a
                    href={checkoutUrl}
                    className="btn-primary inline-flex w-full items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                  </a>
                ) : (
                  <button
                    disabled
                    className="btn-primary inline-flex w-full items-center justify-center gap-2 opacity-50"
                  >
                    Preparing Checkout
                  </button>
                )}
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 border border-maroon/40 bg-[#25D366]/10 px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-maroon hover:bg-[#25D366]/20 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Order on WhatsApp
                </a>
              </div>

              <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-taupe">
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5" /> Free Shipping
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> Authentic
                </span>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

/**
 * Cart row with optimistic, debounced qty edits.
 * Local `qty` state updates instantly for snappy +/- clicks; the cart context
 * is updated 350ms after the last click to avoid thrashing storage/subtotal.
 */
function CartRow({
  item,
  onChange,
  onRemove,
  onCloseCart,
}: {
  item: CartItem;
  onChange: (qty: number) => void;
  onRemove: () => void;
  onCloseCart: () => void;
}) {
  const [qty, setLocalQty] = useState(item.qty);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pulse, setPulse] = useState(false);

  // Sync when the source of truth changes from elsewhere (add-to-cart, etc.)
  useEffect(() => {
    setLocalQty(item.qty);
  }, [item.qty]);

  const commit = (next: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(next), 350);
  };

  const step = (delta: number) => {
    const next = Math.max(0, qty + delta);
    setLocalQty(next);
    setPulse(true);
    // reset pulse quickly so consecutive clicks re-trigger it
    window.setTimeout(() => setPulse(false), 220);
    commit(next);
  };

  // Flush on unmount so pending edits don't get lost
  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        if (qty !== item.qty) onChange(qty);
      }
    },
    [],
  );

  const lineTotal = useCountUp(item.price * qty, 300);

  return (
    <li className="flex gap-4 px-5 py-4">
      <Link
        to="/products/$id"
        params={{ id: item.id }}
        onClick={onCloseCart}
        className="block h-24 w-20 flex-shrink-0 overflow-hidden bg-beige/40"
      >
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              to="/products/$id"
              params={{ id: item.id }}
              onClick={onCloseCart}
              className="font-serif text-base leading-snug text-ink hover:text-maroon"
            >
              {item.name}
            </Link>
            {item.weave && (
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-gold-deep">
                {item.weave}
              </p>
            )}
          </div>
          <button
            aria-label={`Remove ${item.name}`}
            onClick={onRemove}
            className="grid h-8 w-8 place-items-center text-taupe hover:text-maroon"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="inline-flex items-center border border-gold/50">
            <button
              aria-label="Decrease"
              onClick={() => step(-1)}
              className="grid h-8 w-8 place-items-center text-ink transition-colors hover:bg-beige/60 active:bg-beige"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span key={qty} className="inline-block w-8 text-center text-sm animate-scale-in">
              {qty}
            </span>
            <button
              aria-label="Increase"
              onClick={() => step(1)}
              className="grid h-8 w-8 place-items-center text-ink transition-colors hover:bg-beige/60 active:bg-beige"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <p
            className={`font-serif text-base text-maroon transition-transform duration-200 tabular-nums ${
              pulse ? "scale-110" : "scale-100"
            }`}
          >
            {formatINR(lineTotal)}
          </p>
        </div>
      </div>
    </li>
  );
}

/** Animated subtotal with count-up and a subtle flash on change. */
function SubtotalRow({ subtotal }: { subtotal: number }) {
  const display = useCountUp(subtotal, 450);
  const [flash, setFlash] = useState(false);
  const prevRef = useRef(subtotal);
  useEffect(() => {
    if (prevRef.current !== subtotal) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 350);
      prevRef.current = subtotal;
      return () => clearTimeout(t);
    }
  }, [subtotal]);

  return (
    <div className="flex items-center justify-between">
      <span className="text-xs uppercase tracking-[0.22em] text-taupe">Subtotal</span>
      <span
        className={`font-serif text-2xl text-maroon tabular-nums transition-all duration-300 ${
          flash ? "scale-[1.06] drop-shadow-[0_0_12px_rgba(100,31,42,0.35)]" : "scale-100"
        }`}
      >
        {formatINR(display)}
      </span>
    </div>
  );
}
