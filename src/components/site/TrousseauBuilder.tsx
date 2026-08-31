import { useState } from "react";
import type { Product } from "@/lib/site-data";
import { Check, Sparkles, ShoppingBag, Gift, ArrowRight } from "lucide-react";
import { useCart, parsePriceToNumber } from "@/lib/cart-context";
import { useCatalog } from "@/lib/catalog-context";

export function TrousseauBuilder() {
  const { addItem, openCart } = useCart();
  const { products } = useCatalog();
  const [selected, setSelected] = useState<Product[]>([]);

  const toggleSelect = (p: Product) => {
    if (selected.some((item) => item.id === p.id)) {
      setSelected((prev) => prev.filter((item) => item.id !== p.id));
    } else {
      if (selected.length >= 3) return;
      setSelected((prev) => [...prev, p]);
    }
  };

  const rawTotal = selected.reduce((sum, p) => sum + parsePriceToNumber(p.price), 0);
  const bundleDiscount = Math.round(rawTotal * 0.15); // 15% discount for 3 sarees bundle
  const finalTotal = rawTotal - bundleDiscount;

  const handleAddTrousseauToCart = () => {
    if (selected.length < 3) return;
    selected.forEach((p) => {
      addItem({
        id: `${p.id}-trousseau`,
        name: `${p.name} (Bridal Trousseau Bundle -15%)`,
        price: Math.round(parsePriceToNumber(p.price) * 0.85),
        priceLabel: `₹ ${Math.round(parsePriceToNumber(p.price) * 0.85).toLocaleString("en-IN")}`,
        image: p.img,
        weave: p.weave,
        shopifyVariantId: p.shopifyVariantId,
      });
    });
    openCart();
  };

  return (
    <section className="bg-[#FAF7F2] py-16 md:py-24 border-y border-[#A27633]/40">
      <div className="mx-auto max-w-[1360px] px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-maroon/20 bg-white text-xs uppercase tracking-[0.16em] text-maroon font-bold mb-3 shadow-sm">
            <Gift className="h-3.5 w-3.5 text-maroon" /> Luxury Bridal Offer
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-maroon font-semibold leading-tight">
            Build Your 3-Piece Trousseau Box
          </h2>
          <p className="mt-3 text-sm md:text-base text-ink/80 font-normal leading-relaxed">
            Select 3 sarees for your wedding functions to receive our complimentary gold-embossed
            Velvet Trousseau Chest + 15% bundle savings.
          </p>
        </div>

        {/* Selected Progress Bar */}
        <div className="max-w-xl mx-auto mb-10 p-5 rounded-2xl bg-white border border-[#A27633]/60 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex -space-x-2">
              {[0, 1, 2].map((idx) => {
                const item = selected[idx];
                return (
                  <div
                    key={idx}
                    className={`h-12 w-11 rounded-lg border-2 overflow-hidden flex items-center justify-center shadow-sm ${
                      item
                        ? "border-maroon bg-white ring-1 ring-maroon"
                        : "border-dashed border-[#A27633]/70 bg-[#FAF7F2] text-[#744D1E]"
                    }`}
                  >
                    {item ? (
                      <img
                        src={item.img}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-sans font-bold text-[#744D1E]">{idx + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>
            <div>
              <p className="text-xs font-bold text-maroon uppercase tracking-wider">
                {selected.length} of 3 Sarees Selected
              </p>
              <p className="text-xs text-ink/80 font-medium mt-0.5">
                {selected.length === 3
                  ? "Trousseau unlocked! 15% discount applied."
                  : `Add ${3 - selected.length} more piece${3 - selected.length > 1 ? "s" : ""} to unlock.`}
              </p>
            </div>
          </div>

          {selected.length === 3 && (
            <div className="text-right">
              <span className="text-xs uppercase tracking-wider text-taupe block line-through font-medium">
                ₹ {rawTotal.toLocaleString("en-IN")}
              </span>
              <span className="font-sans text-xl font-bold text-maroon">
                ₹ {finalTotal.toLocaleString("en-IN")}
              </span>
            </div>
          )}
        </div>

        {/* Saree Picker Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 8).map((p) => {
            const isSelected = selected.some((item) => item.id === p.id);
            return (
              <div
                key={p.id}
                onClick={() => toggleSelect(p)}
                className={`relative group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 ${
                  isSelected
                    ? "border-maroon ring-2 ring-maroon shadow-lg"
                    : "border-[#A27633]/60 bg-white hover:border-[#A27633] shadow-sm hover:shadow-md hover:-translate-y-1"
                }`}
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-beige/30">
                  {/* Primary Image */}
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    className={`h-full w-full object-cover transition-all duration-700 ease-out ${
                      p.secondaryImg
                        ? "group-hover:opacity-0 group-hover:scale-105"
                        : "group-hover:scale-105"
                    }`}
                  />

                  {/* Secondary Hover Image */}
                  {p.secondaryImg && (
                    <img
                      src={p.secondaryImg}
                      alt={`${p.name} alternate view`}
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      className="absolute inset-0 h-full w-full object-cover opacity-0 scale-100 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105 pointer-events-none"
                    />
                  )}

                  {isSelected && (
                    <div className="absolute inset-0 z-10 bg-maroon/30 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="h-10 w-10 rounded-full bg-maroon text-ivory flex items-center justify-center shadow-lg border border-ivory">
                        <Check className="h-6 w-6" />
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3.5 sm:p-4 bg-white flex flex-col space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#744D1E] font-bold truncate block">
                    {p.weave}
                  </span>
                  <h4 className="font-sans text-sm sm:text-base text-maroon font-bold truncate group-hover:text-[#744D1E] transition-colors">
                    {p.name}
                  </h4>
                  <div className="flex items-baseline gap-2 pt-1 border-t border-[#A27633]/30 mt-0.5">
                    <span className="font-sans text-base sm:text-lg text-ink font-bold tracking-tight">
                      {p.price}
                    </span>
                    {p.original && (
                      <span className="text-xs text-taupe font-medium line-through font-sans">
                        {p.original}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <button
            disabled={selected.length < 3}
            onClick={handleAddTrousseauToCart}
            className={`px-10 py-4 rounded-full text-xs uppercase tracking-[0.25em] font-bold transition-all shadow-xl inline-flex items-center gap-3 ${
              selected.length === 3
                ? "bg-maroon text-ivory hover:bg-wine cursor-pointer scale-105"
                : "bg-maroon/20 text-maroon/60 cursor-not-allowed border border-maroon/20"
            }`}
          >
            <ShoppingBag className="h-4 w-4" /> Add 3-Piece Trousseau Chest to Bag
          </button>
        </div>
      </div>
    </section>
  );
}
