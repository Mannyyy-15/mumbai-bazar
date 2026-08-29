import { useState } from "react";
import { Camera, Heart, Sparkles, X, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/site-data";
import { useCart, parsePriceToNumber } from "@/lib/cart-context";
import { useCatalog } from "@/lib/catalog-context";

type BridePost = {
  id: string;
  brideName: string;
  location: string;
  occasion: string;
  sareeId: string;
  image: string;
  quote: string;
};

const REAL_BRIDES: BridePost[] = [
  {
    id: "b1",
    brideName: "Radhika & Anish",
    location: "Udaipur Palace Wedding",
    occasion: "Bridal Pheras",
    sareeId: "1",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
    quote: "My Banarasi silk saree from Mumbai Bazar made me feel like royalty on my Pheras. The gold zari work glistened under the mandap lights!",
  },
  {
    id: "b2",
    brideName: "Dr. Priyamvada R.",
    location: "Chennai Temple Wedding",
    occasion: "Kalyanam Ceremony",
    sareeId: "2",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800",
    quote: "The pure Kanjivaram silk weight and authentic Silk Mark tag gave me complete peace of mind. Truly heirloom quality.",
  },
  {
    id: "b3",
    brideName: "Meera & Siddharth",
    location: "Goa Beach Sunset Sangeet",
    occasion: "Sangeet Gala",
    sareeId: "3",
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800",
    quote: "Custom blouse fitting was 100% spot on! I didn't need a single alter before my sangeet performance.",
  },
  {
    id: "b4",
    brideName: "Ananya Deshmukh",
    location: "Mumbai Heritage Club",
    occasion: "Reception Party",
    sareeId: "4",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800",
    quote: "Received endless compliments on my Paithani saree. The peacock motif border is a work of art.",
  },
];

export function RealBridesGallery() {
  const { addItem, openCart } = useCart();
  const { products } = useCatalog();
  const [selectedPost, setSelectedPost] = useState<BridePost | null>(null);

  const handleQuickAdd = (p: Product) => {
    addItem({
      id: p.id,
      name: p.name,
      price: parsePriceToNumber(p.price),
      priceLabel: p.price,
      image: p.img,
      weave: p.weave,
      shopifyVariantId: p.shopifyVariantId,
    });
    setSelectedPost(null);
    openCart();
  };

  return (
    <section className="bg-ivory py-16 md:py-24 border-b border-gold/40">
      <div className="mx-auto max-w-[1360px] px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold/40 bg-gold/10 text-[10px] uppercase tracking-[0.3em] text-gold-deep font-semibold mb-3">
            <Camera className="h-3.5 w-3.5 text-gold-deep" /> Real Bride Portraits
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-maroon font-medium leading-tight">
            As Seen On Our Brides
          </h2>
          <p className="mt-3 text-sm md:text-base text-taupe leading-relaxed">
            Real celebrations, real heirloom drapes. Discover how women across the world celebrate their special moments in Mumbai Bazar sarees.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REAL_BRIDES.map((b) => {
            const saree = products.find((p) => p.id === b.sareeId) || products[0];
            return (
              <div
                key={b.id}
                onClick={() => setSelectedPost(b)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gold/40 bg-white shadow-sm hover:shadow-xl hover:border-gold transition-all duration-500"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-beige/30">
                  <img
                    src={b.image}
                    alt={b.brideName}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  <div className="absolute top-3 left-3 rounded-full bg-maroon/90 text-ivory px-3 py-0.5 text-[9px] font-semibold uppercase tracking-widest backdrop-blur-sm">
                    {b.occasion}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-ivory">
                    <h4 className="font-serif text-lg text-ivory font-medium leading-tight">{b.brideName}</h4>
                    <p className="text-[11px] text-ivory/80">{b.location}</p>
                    <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-2 text-[10px] uppercase tracking-wider font-semibold text-gold">
                      <span>Wearing {saree.name}</span>
                      <span>Shop Look →</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Preview */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setSelectedPost(null)} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl rounded-3xl border border-gold/50 bg-ivory p-6 md:p-8 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-10 rounded-full p-2 text-taupe hover:text-maroon bg-white/80"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-gold/30">
                <img src={selectedPost.image} alt={selectedPost.brideName} className="h-full w-full object-cover" />
              </div>

              <div className="flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-gold-deep font-semibold">{selectedPost.occasion}</span>
                  <h3 className="font-serif text-2xl text-maroon font-medium mt-1">{selectedPost.brideName}</h3>
                  <p className="text-xs text-taupe">{selectedPost.location}</p>

                  <blockquote className="mt-4 text-sm font-serif italic text-ink/85 border-l-2 border-gold pl-3 py-1">
                    "{selectedPost.quote}"
                  </blockquote>
                </div>

                {(() => {
                  const saree = products.find((p) => p.id === selectedPost.sareeId) || products[0];
                  return (
                    <div className="rounded-2xl bg-beige/30 p-4 border border-gold/40 space-y-3">
                      <span className="text-[9px] uppercase tracking-widest text-gold-deep font-semibold">Featured Saree</span>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-serif text-base text-maroon font-medium">{saree.name}</h4>
                          <p className="font-sans text-base font-bold text-ink">{saree.price}</p>
                        </div>
                        <button
                          onClick={() => handleQuickAdd(saree)}
                          className="px-4 py-2 rounded-full bg-maroon text-ivory text-xs uppercase tracking-wider font-semibold hover:bg-wine transition-all flex items-center gap-1.5 shadow-md"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" /> Buy Saree
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
