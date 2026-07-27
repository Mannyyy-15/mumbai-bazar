import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart, parsePriceToNumber } from "@/lib/cart-context";

export function WishlistDrawer() {
  const { wishlist, isOpen, closeWishlist, toggleWishlist } = useWishlist();
  const { addItem, openCart } = useCart();

  if (!isOpen) return null;

  const handleMoveToBag = (p: (typeof wishlist)[number]) => {
    addItem({
      id: p.id,
      name: p.name,
      price: parsePriceToNumber(p.price),
      priceLabel: p.price,
      image: p.img,
      weave: p.weave,
      shopifyVariantId: p.shopifyVariantId,
    });
    toggleWishlist(p);
    closeWishlist();
    openCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeWishlist}
      />

      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="pointer-events-auto w-screen max-w-md bg-ivory shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gold/50 px-6 py-5">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-maroon fill-maroon" />
              <h2 className="font-serif text-xl text-maroon font-medium">Saved Sarees</h2>
              <span className="ml-2 rounded-full bg-maroon/10 px-2.5 py-0.5 text-xs text-maroon font-bold">
                {wishlist.length}
              </span>
            </div>
            <button
              onClick={closeWishlist}
              className="rounded-full p-2 text-taupe hover:bg-beige/40 hover:text-maroon transition-colors"
              aria-label="Close Wishlist"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="h-16 w-16 rounded-full bg-beige/30 border border-gold/40 flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-gold-deep" />
                </div>
                <h3 className="font-serif text-2xl text-maroon font-medium">Your Wishlist is Empty</h3>
                <p className="mt-2 text-sm text-maroon/70 max-w-xs leading-relaxed">
                  Save your favorite heirloom and everyday sarees to view or move them to bag anytime.
                </p>
                <button
                  onClick={closeWishlist}
                  className="mt-6 px-6 py-3 rounded-full bg-maroon text-ivory text-xs uppercase tracking-[0.2em] font-medium hover:bg-wine transition-all shadow-md"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              wishlist.map((p) => (
                <div
                  key={p.id}
                  className="flex gap-4 rounded-xl border border-gold/40 bg-white p-3.5 shadow-sm hover:border-gold transition-all"
                >
                  <Link
                    to="/products/$id"
                    params={{ id: p.id }}
                    onClick={closeWishlist}
                    className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-beige/30"
                  >
                    <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.22em] text-gold-deep font-semibold">
                        {p.weave}
                      </span>
                      <Link
                        to="/products/$id"
                        params={{ id: p.id }}
                        onClick={closeWishlist}
                        className="font-serif text-base text-maroon font-medium hover:text-gold-deep transition-colors line-clamp-1 block"
                      >
                        {p.name}
                      </Link>
                      <p className="mt-1 font-sans text-base font-bold text-ink">{p.price}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gold/30 mt-2">
                      <button
                        onClick={() => handleMoveToBag(p)}
                        className="inline-flex items-center gap-1.5 text-xs text-maroon font-semibold uppercase tracking-wider hover:text-gold-deep"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" /> Move to Bag
                      </button>

                      <button
                        onClick={() => toggleWishlist(p)}
                        className="text-taupe hover:text-maroon p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlist.length > 0 && (
            <div className="border-t border-gold/50 p-6 bg-beige/10">
              <button
                onClick={closeWishlist}
                className="w-full py-3.5 rounded-full bg-maroon text-ivory text-xs uppercase tracking-[0.2em] font-medium hover:bg-wine transition-all shadow-md text-center block"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
