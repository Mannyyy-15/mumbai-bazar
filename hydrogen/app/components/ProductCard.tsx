import { Check, Heart, ShoppingBag, Minus, Plus } from "lucide-react";
import { Link, useFetcher } from "react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { productAltText } from "~/lib/seo";
import type { Product } from "~/lib/site-data";
import { useWishlist } from "~/lib/wishlist-context";
import { resolveColorSwatch, getProductColors, type SwatchResolution } from "~/lib/filters";
import { hapticImpact, hapticSuccess } from "~/lib/native-bridge";
import { useAside } from "~/components/Aside";
import { CartForm } from "@shopify/hydrogen";
import { trackAddToCart } from "~/lib/meta-pixel";

export function ProductCard({ p }: { p: Product }) {
  const fetcher = useFetcher();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { open } = useAside();
  const isSaved = isInWishlist(p.id);
  const isAvailable = p.variants && p.variants.length > 0 ? p.variants.some((v) => v.available) : true;
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    },
    [],
  );

  const colorDisplay = useMemo(() => {
    if (p.variants && p.variants.length > 1) {
      const seen = new Set<string>();
      const list: SwatchResolution[] = [];
      for (const v of p.variants) {
        const c = v.color || (v.title !== "Default Title" ? v.title.split("/")[0].trim() : null);
        if (c && !seen.has(c.toLowerCase())) {
          seen.add(c.toLowerCase());
          list.push(resolveColorSwatch(c));
        }
      }
      if (list.length > 1) {
        return { isMulti: true, swatches: list, swatch: null };
      }
    }

    const detected = getProductColors(p);
    if (detected.length >= 2) {
      const dualName = `${detected[0]} & ${detected[1]}`;
      const resolved = resolveColorSwatch(dualName);
      return { isMulti: false, swatches: [], swatch: resolved };
    } else if (detected.length === 1) {
      const resolved = resolveColorSwatch(detected[0]);
      return { isMulti: false, swatches: [], swatch: resolved };
    }

    return null;
  }, [p]);

  const handle = (p as any).handle || p.id;

  return (
    <Link
      to={`/products/${handle}`}
      className="group flex flex-col justify-between relative overflow-hidden rounded-2xl border border-[#A27633]/60 bg-ivory shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(100,31,42,0.25)] hover:border-[#A27633]"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-beige/30">
        {/* Primary Image */}
        <img
          src={p.img}
          alt={productAltText(p.name, p.weave)}
          width={600}
          height={800}
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
            width={600}
            height={800}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top opacity-0 scale-100 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105 pointer-events-none"
          />
        )}

        {/* Tag Badge */}
        {!isAvailable ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-stone-700 text-ivory px-3 py-1 text-[9px] font-semibold tracking-[0.2em] uppercase shadow-md">
            Sold Out
          </span>
        ) : p.tag ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-maroon text-ivory px-3 py-1 text-[9px] font-medium tracking-[0.2em] uppercase shadow-md border border-[#A27633]/60">
            {p.tag}
          </span>
        ) : null}

        {/* Wishlist Button */}
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            hapticImpact("light");
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

          {/* Colours Indicator */}
          {colorDisplay?.isMulti && colorDisplay.swatches.length > 1 ? (
            <div className="flex items-center gap-1.5 pt-1">
              <div className="flex items-center -space-x-1">
                {colorDisplay.swatches.slice(0, 4).map((c, idx) => (
                  <span
                    key={idx}
                    className="inline-block h-3 w-3 rounded-full border border-white shadow-xs"
                    style={{
                      background: c.secondaryHex
                        ? `linear-gradient(135deg, ${c.hex} 50%, ${c.secondaryHex} 50%)`
                        : c.hex,
                      borderColor: c.border || "#C5A880",
                    }}
                    title={c.name}
                  />
                ))}
              </div>
              <span className="text-[10px] font-semibold text-ink/75">
                {colorDisplay.swatches.length} Colours
              </span>
            </div>
          ) : colorDisplay?.swatch ? (
            <div className="flex items-center gap-1.5 pt-1">
              <span
                className="inline-block h-3.5 w-3.5 rounded-full border border-white shadow-xs shrink-0"
                style={{
                  background: colorDisplay.swatch.secondaryHex
                    ? `linear-gradient(135deg, ${colorDisplay.swatch.hex} 50%, ${colorDisplay.swatch.secondaryHex} 50%)`
                    : colorDisplay.swatch.hex,
                  borderColor: colorDisplay.swatch.border || "#C5A880",
                }}
                title={colorDisplay.swatch.name}
              />
              <span className="text-[10px] font-semibold text-ink/75 truncate max-w-[140px]">
                {colorDisplay.swatch.name}
              </span>
            </div>
          ) : null}

          <div className="flex items-baseline gap-2 pt-1.5 border-t border-[#A27633]/30 mt-1">
            <span className="font-sans text-sm sm:text-base md:text-lg font-extrabold text-black tracking-tight">
              {p.price}
            </span>
            {p.original && (
              <span className="text-[11px] sm:text-xs text-red-600 font-semibold line-through font-sans">
                {p.original}
              </span>
            )}
          </div>
        </div>

        {/* Dedicated Always-Visible Shop Now Button */}
        <div className="mt-2.5">
          <button
            type="button"
            disabled={!isAvailable || fetcher.state !== "idle"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isAvailable) return;
              hapticSuccess();
              trackAddToCart({
                id: p.id,
                name: p.name,
                price: p.price,
                quantity: 1,
                variantId: p.shopifyVariantId,
              });
              if (p.shopifyVariantId) {
                fetcher.submit(
                  {
                    [CartForm.INPUT_NAME]: JSON.stringify({
                      action: CartForm.ACTIONS.LinesAdd,
                      inputs: {
                        lines: [{ merchandiseId: p.shopifyVariantId, quantity: 1 }],
                      },
                    }),
                  },
                  { method: "POST", action: "/cart" },
                );
              }
              open("cart");
            }}
            className={`w-full py-2 sm:py-2.5 px-3 rounded-xl text-[10px] sm:text-xs font-bold tracking-[0.14em] uppercase transition-all duration-300 flex items-center justify-center gap-1.5 shadow-xs ${
              !isAvailable
                ? "bg-taupe/30 text-ink/50 cursor-not-allowed"
                : "bg-maroon text-white hover:bg-wine active:scale-98 group-hover:bg-wine"
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>
              {!isAvailable ? "Sold Out" : fetcher.state !== "idle" ? "Adding..." : "Shop Now"}
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
}
