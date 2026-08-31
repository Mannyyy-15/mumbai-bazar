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
  RotateCcw,
  Sparkles,
  Lock,
  ArrowRight,
} from "lucide-react";
import { useCart, formatINR, type CartItem } from "@/lib/cart-context";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { useCountUp } from "@/hooks/use-count-up";
import { SITE } from "@/lib/seo";

export function CartDrawer() {
  const { items, isOpen, closeCart, setQty, removeItem, subtotal, count, checkoutUrl } = useCart();
  const panelRef = useFocusTrap<HTMLElement>(isOpen);

  const waMsg = encodeURIComponent(
    `Hello Mumbai Bazar, I would like to place an order from my shopping bag:\n\n${items
      .map((i) => `• ${i.name} × ${i.qty} — ${i.priceLabel}`)
      .join("\n")}\n\nTotal Subtotal: ${formatINR(subtotal)}\n\nPlease share payment link or delivery confirmation.`,
  );
  const waHref = `https://wa.me/${SITE.whatsapp}?text=${waMsg}`;

  return (
    <div
      className={`fixed inset-0 z-[70] overflow-hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      {/* Dark backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
      />

      {/* Drawer Panel */}
      <aside
        ref={panelRef}
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        tabIndex={-1}
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#FAF7F2] shadow-2xl transition-transform duration-300 ease-out focus:outline-none ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gold/40 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-maroon/10 text-maroon">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 id="cart-drawer-title" className="font-serif text-xl font-bold text-maroon">
                Your Shopping Bag
              </h2>
              <p className="text-xs font-semibold text-ink/70">
                {count} {count === 1 ? "handwoven drape" : "handwoven drapes"}
              </p>
            </div>
          </div>

          <button
            aria-label="Close bag"
            onClick={closeCart}
            className="grid h-9 w-9 place-items-center rounded-full border border-gold/40 text-ink/80 hover:bg-maroon hover:text-white hover:border-maroon transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Shipping Assurance Banner */}
        <div className="border-b border-gold/30 bg-gold/10 px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-maroon">
            <Truck className="h-4 w-4 text-gold-deep shrink-0" />
            <span>100% Free Express Insured Shipping Across India</span>
          </div>
          <Sparkles className="h-3.5 w-3.5 text-gold-deep shrink-0" />
        </div>

        {/* Items Container */}
        {items.length === 0 ? (
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
                onClick={closeCart}
                className="w-full py-3.5 rounded-full bg-maroon text-white text-xs font-bold uppercase tracking-wider hover:bg-wine transition-all shadow-md text-center"
              >
                Browse All Sarees
              </Link>
              <Link
                to="/collections"
                onClick={closeCart}
                className="w-full py-3 rounded-full border border-maroon/30 text-maroon text-xs font-bold uppercase tracking-wider hover:bg-maroon/5 transition-all text-center"
              >
                Explore Collections
              </Link>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-gold/25 overflow-y-auto px-4 py-3 space-y-3">
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

            {/* Bottom Checkout Section */}
            <div className="border-t border-gold/40 bg-white px-5 pb-6 pt-4 shadow-lg">
              <SubtotalRow subtotal={subtotal} />

              <p className="mt-1.5 text-xs text-ink/70 font-medium">
                Inclusive of all taxes. Free insured doorstep delivery.
              </p>

              {/* Action Buttons */}
              <div className="mt-4 grid gap-2.5">
                {checkoutUrl ? (
                  <a
                    href={checkoutUrl}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-maroon py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-wine transition-all shadow-md"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                ) : (
                  <button
                    disabled
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-maroon/60 py-3.5 text-xs font-bold uppercase tracking-wider text-white cursor-not-allowed"
                  >
                    <span>Preparing Secure Checkout...</span>
                  </button>
                )}

                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#25D366] bg-[#25D366]/10 py-3 text-xs font-bold uppercase tracking-wider text-[#128C7E] hover:bg-[#25D366] hover:text-white transition-all shadow-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Order Directly on WhatsApp</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gold/30 pt-3.5 text-center text-[10px] uppercase font-bold tracking-wider text-ink/75">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="h-4 w-4 text-gold-deep" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-gold-deep" />
                  <span>Silk Mark Pure</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="h-4 w-4 text-gold-deep" />
                  <span>7-Day Returns</span>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

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
    window.setTimeout(() => setPulse(false), 220);
    commit(next);
  };

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
    <li className="flex gap-3.5 rounded-2xl border border-gold/35 bg-white p-3.5 shadow-sm">
      <Link
        to="/products/$id"
        params={{ id: item.id }}
        onClick={onCloseCart}
        className="block h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F0E9DC] border border-gold/30"
      >
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
      </Link>

      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              to="/products/$id"
              params={{ id: item.id }}
              onClick={onCloseCart}
              className="font-serif text-sm sm:text-base font-bold text-ink hover:text-maroon transition-colors line-clamp-2 leading-snug"
            >
              {item.name}
            </Link>

            <button
              aria-label={`Remove ${item.name}`}
              onClick={onRemove}
              className="p-1 text-ink/40 hover:text-maroon transition-colors shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {item.weave && (
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-gold/15 text-[10px] font-bold uppercase tracking-wider text-maroon">
              {item.weave}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gold/20 mt-2">
          {/* Quantity Controls */}
          <div className="inline-flex items-center rounded-full border border-maroon/30 bg-[#FAF7F2] p-0.5">
            <button
              aria-label="Decrease quantity"
              onClick={() => step(-1)}
              className="grid h-6 w-6 place-items-center rounded-full text-maroon hover:bg-maroon hover:text-white transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span key={qty} className="inline-block w-7 text-center text-xs font-bold text-ink">
              {qty}
            </span>
            <button
              aria-label="Increase quantity"
              onClick={() => step(1)}
              className="grid h-6 w-6 place-items-center rounded-full text-maroon hover:bg-maroon hover:text-white transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Price */}
          <p
            className={`font-serif text-base font-bold text-maroon tabular-nums transition-transform duration-200 ${
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
      <span className="text-xs uppercase tracking-wider font-bold text-ink/70">Subtotal</span>
      <span
        className={`font-serif text-2xl font-bold text-maroon tabular-nums transition-all duration-300 ${
          flash ? "scale-105" : "scale-100"
        }`}
      >
        {formatINR(display)}
      </span>
    </div>
  );
}
