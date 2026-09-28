import { useState } from "react";
import { useLoaderData, Link } from "react-router";
import type { Route } from "./+types/trousseau-builder";
import { Gift, Check, ShoppingBag, ArrowRight } from "lucide-react";
import { SITE, getSeoMeta, jsonLdScript } from "~/lib/seo";
import { breadcrumbSchema } from "~/lib/structured-data";
import { fetchLiveProducts } from "~/lib/shopify.server";
import { formatINR, type ShopifyProduct } from "~/lib/types";
import { AddToCartButton } from "~/components/AddToCartButton";
import { useAside } from "~/components/Aside";

export const meta: Route.MetaFunction = () => {
  return getSeoMeta({
    title: "Bridal Trousseau Builder: 3-Saree Set | Mumbai Bazar",
    description:
      "Build a custom three-saree bridal trousseau and receive a gold-embossed keepsake chest plus 15% bundle savings. Personal styling for Mumbai brides.",
    path: "/trousseau-builder",
    keywords: [
      "bridal trousseau builder",
      "custom trousseau box",
      "3 saree bridal set",
      "wedding saree package mumbai",
    ],
  });
};

export async function loader({ context }: Route.LoaderArgs) {
  const products = await fetchLiveProducts(context, 50);
  return { products };
}

export default function TrousseauBuilderPage() {
  const { products } = useLoaderData<typeof loader>();
  const { open } = useAside();
  const [selected, setSelected] = useState<ShopifyProduct[]>([]);

  const toggleSelect = (p: ShopifyProduct) => {
    if (selected.some((item) => item.id === p.id)) {
      setSelected((prev) => prev.filter((item) => item.id !== p.id));
    } else {
      if (selected.length >= 3) return;
      setSelected((prev) => [...prev, p]);
    }
  };

  const rawTotal = selected.reduce((sum, p) => sum + p.rawPrice, 0);
  const bundleDiscount = Math.round(rawTotal * 0.15);
  const finalTotal = rawTotal - bundleDiscount;

  const linesToAdd = selected
    .filter((p) => p.shopifyVariantId)
    .map((p) => ({
      merchandiseId: p.shopifyVariantId!,
      quantity: 1,
    }));

  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Trousseau Builder", path: "/trousseau-builder" },
    ]),
  ];

  return (
    <div className="bg-ivory text-ink min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }}
      />

      <section className="bg-beige/35 border-b border-[#A27633]/30 py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-maroon block mb-2">
            Bridal Curation
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
            Interactive Trousseau Box Builder
          </h1>
          <p className="mt-4 text-sm text-taupe max-w-2xl mx-auto leading-relaxed">
            Select 3 heirloom sarees across Bridal, Silk, and Festive drapes to receive an exclusive 15% bundle savings and our gold-embossed velvet storage chest.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-6 py-12">
        {/* Floating / Sticky Progress Box */}
        <div className="sticky top-20 z-30 mb-12 p-6 rounded-3xl bg-white border border-[#A27633]/60 shadow-xl max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[0, 1, 2].map((idx) => {
                const item = selected[idx];
                return (
                  <div
                    key={idx}
                    className={`h-14 w-12 rounded-xl border-2 overflow-hidden flex items-center justify-center shadow-sm ${
                      item
                        ? "border-maroon bg-white ring-2 ring-maroon"
                        : "border-dashed border-[#A27633]/70 bg-beige/30 text-taupe"
                    }`}
                  >
                    {item ? (
                      <img
                        src={item.img}
                        alt={item.name}
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <span className="text-sm font-bold">{idx + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>
            <div>
              <p className="text-xs font-bold text-maroon uppercase tracking-wider">
                {selected.length} of 3 Sarees Selected
              </p>
              <p className="text-xs text-taupe mt-0.5 font-medium">
                {selected.length === 3
                  ? "Trousseau complete! 15% discount applied."
                  : `Select ${3 - selected.length} more piece${3 - selected.length > 1 ? "s" : ""} to unlock.`}
              </p>
            </div>
          </div>

          <div>
            {selected.length === 3 ? (
              <div className="flex flex-col items-end">
                <span className="text-sm font-serif font-bold text-maroon">
                  Total: {formatINR(finalTotal)}
                </span>
                <span className="text-[11px] text-taupe line-through">
                  Regular: {formatINR(rawTotal)}
                </span>
                <AddToCartButton
                  lines={linesToAdd}
                  onClick={() => open('cart')}
                >
                  <div className="mt-2 btn-primary rounded-full text-xs py-2 px-6">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Add Box To Bag</span>
                  </div>
                </AddToCartButton>
              </div>
            ) : (
              <span className="text-xs text-taupe font-semibold italic">
                Choose 3 drapes below
              </span>
            )}
          </div>
        </div>

        {/* Sarees Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => {
            const isSelected = selected.some((item) => item.id === p.id);
            return (
              <div
                key={p.id}
                onClick={() => toggleSelect(p)}
                className={`cursor-pointer rounded-2xl border-2 transition-all p-3 bg-white flex flex-col justify-between ${
                  isSelected
                    ? "border-maroon ring-2 ring-maroon shadow-lg scale-98"
                    : "border-gold/30 hover:border-maroon/60 shadow-sm"
                }`}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-beige/30">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="h-full w-full object-cover object-top"
                  />
                  {isSelected && (
                    <div className="absolute top-2 right-2 h-7 w-7 rounded-full bg-maroon text-white flex items-center justify-center shadow-md">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <span className="text-[10px] uppercase font-bold text-taupe">
                    {p.weave}
                  </span>
                  <h3 className="font-serif text-sm font-bold text-ink line-clamp-1">
                    {p.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-maroon font-serif">
                      {p.price}
                    </span>
                    <button
                      type="button"
                      className={`text-xs px-3 py-1 rounded-full font-bold ${
                        isSelected
                          ? "bg-maroon text-white"
                          : "bg-beige/40 text-maroon hover:bg-maroon hover:text-white"
                      }`}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
