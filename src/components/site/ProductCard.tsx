import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { productAltText } from "@/lib/seo";
import type { Product } from "@/lib/site-data";
import { useCart, parsePriceToNumber } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";

export function ProductCard({ p }: { p: Product }) {
  const { addItem, openCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isSaved = isInWishlist(p.id);

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
      shopifyVariantId: p.shopifyVariantId,
    });
    openCart();
  };

  return (
    <Link
      to="/products/$id"
      params={{ id: p.id }}
      className="group block relative overflow-hidden rounded-2xl border border-gold/45 bg-ivory shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(100,31,42,0.25)] hover:border-gold/70"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-beige/30">
        {/* Primary Image */}
        <img
          src={p.img}
          alt={productAltText(p.name, p.weave)}
          loading="lazy"
          decoding="async"
          className={`h-full w-full object-cover transition-all duration-700 ease-out ${
            p.secondaryImg ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-108"
          }`}
        />

        {/* Secondary Hover Image */}
        {p.secondaryImg && (
          <img
            src={p.secondaryImg}
            alt={`${p.name} alternate view`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-0 scale-100 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105 pointer-events-none"
          />
        )}

        {/* Tag Badge */}
        {p.tag && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-maroon text-ivory px-3 py-1 text-[9px] font-medium tracking-[0.2em] uppercase shadow-md border border-gold/50">
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

        {/* Hover Add to Bag Action */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-100 md:opacity-0 translate-y-0 md:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={quickAdd}
            className="w-full py-2.5 rounded-xl bg-maroon text-ivory text-[10px] font-medium tracking-[0.2em] uppercase hover:bg-wine transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Add to Bag
          </button>
        </div>
      </div>

      {/* Card Details — Tight Spacing Between Name & Price */}
      <div className="p-4 md:p-5 flex flex-col space-y-1.5">
        <p className="text-[10px] uppercase tracking-[0.22em] text-gold-deep font-semibold">
          {p.weave}
        </p>
        <h3 className="font-sans text-base md:text-lg font-bold leading-snug text-maroon group-hover:text-gold-deep transition-colors line-clamp-1">
          {p.name}
        </h3>
        <div className="flex items-baseline gap-2 pt-2 border-t border-gold/45 mt-1">
          <span className="font-sans text-base md:text-lg font-bold text-ink tracking-tight">
            {p.price}
          </span>
          {p.original && (
            <span className="text-xs text-taupe font-medium line-through font-sans">
              {p.original}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
