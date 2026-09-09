import { Check, Heart, ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { productAltText } from "@/lib/seo";
import type { Product } from "@/lib/site-data";
import { useCart, parsePriceToNumber } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { resolveColorSwatch } from "@/lib/filters";

export function ProductCard({ p }: { p: Product }) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isSaved = isInWishlist(p.id);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    },
    [],
  );

  const variantColors = useMemo(() => {
    if (!p.variants || p.variants.length <= 1) return [];
    const seen = new Set<string>();
    const list: Array<{ name: string; hex: string; border?: string }> = [];
    for (const v of p.variants) {
      const c = v.color || (v.title !== "Default Title" ? v.title.split("/")[0].trim() : null);
      if (c && !seen.has(c.toLowerCase())) {
        seen.add(c.toLowerCase());
        list.push(resolveColorSwatch(c));
      }
    }
    return list;
  }, [p.variants]);

  const quickAdd = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    addItem({
      id: p.id,
      name: p.name,
      price: parsePriceToNumber(p.price),
      priceLabel: p.price,
      image: p.img,
      weave: p.weave,
      color: variantColors[0]?.name,
      shopifyVariantId: p.shopifyVariantId,
    });

    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Link
      to="/products/$id"
      params={{ id: p.id }}
      className="group flex flex-col justify-between relative overflow-hidden rounded-2xl border border-[#A27633]/60 bg-ivory shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(100,31,42,0.25)] hover:border-[#A27633]"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-beige/30">
        {/* Primary Image */}
        <img
          src={p.img}
          alt={productAltText(p.name, p.weave)}
          loading="lazy"
          decoding="async"
          className={`h-full w-full object-cover object-top transition-all duration-700 ease-out ${
            p.secondaryImg ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-108"
          }`}
        />

        {/* Secondary Hover Image */}
        {p.secondaryImg && (
          <img
            src={p.secondaryImg}
            alt={productAltText(p.name, p.weave, "palla detail")}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top opacity-0 scale-100 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105 pointer-events-none"
          />
        )}

        {/* Tag Badge */}
        {p.tag && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-maroon text-ivory px-3 py-1 text-[9px] font-medium tracking-[0.2em] uppercase shadow-md border border-[#A27633]/60">
            {p.tag}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(p);
          }}
          className={`absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full transition-all shadow-sm ${
            isSaved
              ? "bg-maroon text-ivory scale-110"
              : "bg-ivory/90 text-maroon hover:bg-maroon hover:text-ivory"
          }`}
        >
          <Heart className={`h-4 w-4 ${isSaved ? "fill-ivory text-ivory" : ""}`} />
        </button>
      </div>

      {/* Card Details & Always-Visible Shop Now Button */}
      <div className="p-3 sm:p-4 flex flex-col justify-between flex-1 space-y-1">
        <div>
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-gold-deep font-bold truncate">
            {p.weave}
          </p>
          <h3 className="font-sans text-xs sm:text-sm md:text-base font-bold leading-snug text-maroon group-hover:text-gold-deep transition-colors line-clamp-1">
            {p.name}
          </h3>

          {/* Variant Colours Indicator if product has multiple colors */}
          {variantColors.length > 1 && (
            <div className="flex items-center gap-1.5 pt-1">
              <div className="flex items-center -space-x-1">
                {variantColors.slice(0, 4).map((c, idx) => (
                  <span
                    key={idx}
                    className="inline-block h-3 w-3 rounded-full border border-white shadow-xs"
                    style={{ backgroundColor: c.hex, borderColor: c.border || "#C5A880" }}
                    title={c.name}
                  />
                ))}
              </div>
              <span className="text-[10px] font-semibold text-ink/75">
                {variantColors.length} Colours
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-2 pt-1.5 border-t border-[#A27633]/30 mt-1">
            <span className="font-sans text-sm sm:text-base md:text-lg font-bold text-maroon tracking-tight">
              {p.price}
            </span>
            {p.original && (
              <span className="text-[11px] sm:text-xs text-taupe font-medium line-through font-sans">
                {p.original}
              </span>
            )}
          </div>
        </div>

        {/* Dedicated Always-Visible Shop Now Button */}
        <button
          onClick={quickAdd}
          aria-live="polite"
          className={`mt-2.5 w-full py-2 sm:py-2.5 px-3 rounded-xl text-[10px] sm:text-xs font-bold tracking-[0.14em] uppercase transition-all duration-300 flex items-center justify-center gap-1.5 shadow-xs ${
            added
              ? "bg-green-700 text-white shadow-sm"
              : "bg-maroon text-white hover:bg-wine active:scale-98 shadow-sm group-hover:bg-wine"
          }`}
        >
          {added ? (
            <>
              <Check className="h-3.5 w-3.5" /> Added
            </>
          ) : (
            <>
              <ShoppingBag className="h-3.5 w-3.5" /> Shop Now
            </>
          )}
        </button>
      </div>
    </Link>
  );
}
