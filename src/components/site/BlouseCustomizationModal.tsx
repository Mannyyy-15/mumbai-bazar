import { useState } from "react";
import { X, Scissors, Check, Sparkles } from "lucide-react";
import type { Product } from "@/lib/site-data";
import { useCart, parsePriceToNumber } from "@/lib/cart-context";

export function BlouseCustomizationModal({
  product,
  isOpen,
  onClose,
}: {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { addItem, openCart } = useCart();

  const [stitchingType, setStitchingType] = useState<"unstitched" | "standard" | "custom">("unstitched");
  const [size, setSize] = useState("M (38 in)");
  const [neckline, setNeckline] = useState("Sweetheart Neck");
  const [includeFall, setIncludeFall] = useState(true);

  // Custom inputs
  const [bust, setBust] = useState("38");
  const [waist, setWaist] = useState("32");
  const [sleeveLength, setSleeveLength] = useState("10");

  if (!isOpen) return null;

  const stitchingFee = stitchingType === "unstitched" ? 0 : 1200;
  const fallFee = includeFall ? 450 : 0;
  const basePrice = parsePriceToNumber(product.price);
  const totalPrice = basePrice + stitchingFee + fallFee;

  const handleAddCustomizedToCart = () => {
    let optionSummary = "Unstitched Blouse Piece";
    if (stitchingType === "standard") {
      optionSummary = `Stitched (${size}, ${neckline})`;
    } else if (stitchingType === "custom") {
      optionSummary = `Bespoke Custom (Bust:${bust}", Waist:${waist}", Sleeve:${sleeveLength}", ${neckline})`;
    }

    if (includeFall) {
      optionSummary += " + Saree Fall & Picot Edging";
    }

    addItem({
      id: `${product.id}-${Date.now()}`,
      name: `${product.name} (${optionSummary})`,
      price: totalPrice,
      priceLabel: `₹ ${totalPrice.toLocaleString("en-IN")}`,
      image: product.img,
      weave: product.weave,
      shopifyVariantId: product.shopifyVariantId,
    });

    onClose();
    openCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-xl rounded-3xl border border-gold/50 bg-ivory p-6 md:p-8 shadow-2xl overflow-hidden">
          {/* Top Banner */}
          <div className="flex items-center justify-between border-b border-gold/40 pb-4">
            <div className="flex items-center gap-2">
              <Scissors className="h-5 w-5 text-maroon" />
              <h2 className="font-serif text-2xl text-maroon font-medium">Blouse & Finishing Service</h2>
            </div>
            <button onClick={onClose} className="rounded-full p-2 text-taupe hover:text-maroon">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 space-y-6">
            {/* Saree Info */}
            <div className="flex items-center gap-4 rounded-2xl bg-beige/30 p-3 border border-gold/30">
              <img src={product.img} alt={product.name} className="h-16 w-14 object-cover rounded-lg" />
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold-deep font-semibold">{product.weave}</span>
                <h4 className="font-serif text-base text-maroon font-medium line-clamp-1">{product.name}</h4>
                <p className="text-base font-sans font-bold text-ink">{product.price}</p>
              </div>
            </div>

            {/* Stitching Option Tabs */}
            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold text-maroon mb-3">
                1. Select Blouse Option
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setStitchingType("unstitched")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    stitchingType === "unstitched"
                      ? "border-maroon bg-maroon text-ivory shadow-md"
                      : "border-gold/40 bg-white text-ink hover:border-maroon"
                  }`}
                >
                  <p className="font-semibold text-xs uppercase">Unstitched</p>
                  <p className="text-[10px] opacity-80 mt-1">Included Free</p>
                </button>

                <button
                  type="button"
                  onClick={() => setStitchingType("standard")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    stitchingType === "standard"
                      ? "border-maroon bg-maroon text-ivory shadow-md"
                      : "border-gold/40 bg-white text-ink hover:border-maroon"
                  }`}
                >
                  <p className="font-semibold text-xs uppercase">Standard Size</p>
                  <p className="text-[10px] opacity-80 mt-1">+ ₹ 1,200</p>
                </button>

                <button
                  type="button"
                  onClick={() => setStitchingType("custom")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    stitchingType === "custom"
                      ? "border-maroon bg-maroon text-ivory shadow-md"
                      : "border-gold/40 bg-white text-ink hover:border-maroon"
                  }`}
                >
                  <p className="font-semibold text-xs uppercase">Bespoke Fit</p>
                  <p className="text-[10px] opacity-80 mt-1">+ ₹ 1,200</p>
                </button>
              </div>
            </div>

            {/* Standard Size Inputs */}
            {stitchingType === "standard" && (
              <div className="space-y-4 rounded-2xl bg-white p-4 border border-gold/40">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-taupe font-semibold mb-2">Bust Size</label>
                  <div className="flex flex-wrap gap-2">
                    {["XS (34 in)", "S (36 in)", "M (38 in)", "L (40 in)", "XL (42 in)", "2XL (44 in)"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                          size === s ? "border-maroon bg-maroon text-ivory font-semibold" : "border-gold/30 text-ink hover:border-maroon"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-taupe font-semibold mb-2">Neckline Cut</label>
                  <div className="flex flex-wrap gap-2">
                    {["Sweetheart Neck", "Deep V-Neck", "Boat Neck", "Square Neck", "Royal High Neck"].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setNeckline(n)}
                        className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                          neckline === n ? "border-maroon bg-maroon text-ivory font-semibold" : "border-gold/30 text-ink hover:border-maroon"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Custom Measurement Inputs */}
            {stitchingType === "custom" && (
              <div className="space-y-4 rounded-2xl bg-white p-4 border border-gold/40">
                <p className="text-xs text-taupe">Provide your measurements in inches. Our boutique master tailor will craft your perfect silhouette.</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-taupe">Bust (in)</label>
                    <input
                      type="number"
                      value={bust}
                      onChange={(e) => setBust(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gold/40 px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-maroon"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-taupe">Waist (in)</label>
                    <input
                      type="number"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gold/40 px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-maroon"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-taupe">Sleeve (in)</label>
                    <input
                      type="number"
                      value={sleeveLength}
                      onChange={(e) => setSleeveLength(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gold/40 px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-maroon"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Saree Fall & Picot Addon */}
            <div className="flex items-center justify-between rounded-2xl border border-gold/40 bg-white p-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-gold-deep" />
                <div>
                  <p className="text-xs font-semibold text-maroon uppercase tracking-wider">Saree Fall & Picot Edging</p>
                  <p className="text-[11px] text-taupe">Pre-stitched cotton fall hem and pico edge for ready-to-drape wear.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-ink">+ ₹ 450</span>
                <input
                  type="checkbox"
                  checked={includeFall}
                  onChange={(e) => setIncludeFall(e.target.checked)}
                  className="h-5 w-5 rounded border-gold text-maroon focus:ring-maroon cursor-pointer"
                />
              </div>
            </div>

            {/* Summary & Submit Button */}
            <div className="border-t border-gold/40 pt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-taupe font-semibold block">Total Package Price</span>
                <span className="font-serif text-2xl font-bold text-maroon">₹ {totalPrice.toLocaleString("en-IN")}</span>
              </div>

              <button
                type="button"
                onClick={handleAddCustomizedToCart}
                className="px-8 py-3.5 rounded-full bg-maroon text-ivory text-xs uppercase tracking-[0.2em] font-medium hover:bg-wine transition-all shadow-lg flex items-center gap-2"
              >
                <Check className="h-4 w-4" /> Add Customized Saree
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
