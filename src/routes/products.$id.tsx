import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Heart,
  Minus,
  Plus,
  MessageCircle,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  Check,
  Scissors,
} from "lucide-react";
import { PRODUCTS } from "@/lib/site-data";
import { seo, jsonLd, SITE, productAltText } from "@/lib/seo";
import { productSchema, breadcrumbSchema, priceToSchema } from "@/lib/structured-data";
import { ProductCard } from "@/components/site/ProductCard";
import { useCart, parsePriceToNumber } from "@/lib/cart-context";
import { fetchShopifyProduct } from "@/lib/shopify";
import { useCatalog } from "@/lib/catalog-context";
import { BlouseCustomizationModal } from "@/components/site/BlouseCustomizationModal";

export const Route = createFileRoute("/products/$id")({
  loader: async ({ params }) => {
    const remote = await fetchShopifyProduct(params.id).catch(() => null);
    const product = remote ?? PRODUCTS.find((p) => p.id === params.id) ?? PRODUCTS[0];
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return seo({
        title: "Saree Not Found — Mumbai Bazar",
        description:
          "This saree is no longer available. Browse the current collection at Mumbai Bazar.",
        path: "/shop",
        noindex: true,
      });
    }
    const p = loaderData.product;
    const desc =
      p.details?.description ??
      `${p.name} in ${p.weave}. Available to see and drape at our stores, with delivery across India.`;
    const { meta, links } = seo({
      // Google Shopping title formula: Brand + Colour/Name + Fabric + Product + Occasion.
      title: `${p.name} | ${p.weave} — Mumbai Bazar`,
      description: desc.slice(0, 160),
      path: `/products/${p.id}`,
      image: p.img,
      type: "product",
      keywords: [p.name, p.weave, "buy saree online", "saree shop near me"],
    });
    return {
      meta: [
        ...meta,
        // Open Graph product extensions — read by Facebook/Instagram Shopping.
        { property: "product:price:amount", content: priceToSchema(p.price) },
        { property: "product:price:currency", content: SITE.currency },
        { property: "product:availability", content: "in stock" },
        { property: "product:condition", content: "new" },
        { property: "product:brand", content: SITE.name },
      ],
      links,
      scripts: [
        jsonLd(productSchema(p)),
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            { name: p.name, path: `/products/${p.id}` },
          ]),
        ),
      ],
    };
  },
  component: ProductDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <span className="text-[11px] uppercase tracking-[0.3em] text-maroon/60">404</span>
      <h1 className="mt-3 font-serif text-4xl text-ink">Saree not found</h1>
      <p className="mt-3 text-taupe">The piece you were looking for may have found a new home.</p>
      <Link to="/shop" className="btn-primary mt-8 inline-flex">
        Browse the Boutique
      </Link>
    </div>
  ),
});

const SWATCHES = [
  { name: "Wine", hex: "#641F2A" },
  { name: "Midnight", hex: "#2D1F3F" },
  { name: "Emerald", hex: "#1A3E35" },
  { name: "Antique", hex: "#B69054" },
];

/** Cycled across gallery thumbnails so each image gets distinct alt text. */
const GALLERY_VIEWS = ["front drape", "palla detail", "border detail", "blouse piece"] as const;

const DRAPE_OPTIONS = ["Standard 5.5 m", "Pre-stitched", "With Fall & Pico"];

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const { products: catalogProducts } = useCatalog();
  const d = product.details!;
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [swatch, setSwatch] = useState(0);
  const [drape, setDrape] = useState(0);
  const [added, setAdded] = useState(false);
  const [showBlouseModal, setShowBlouseModal] = useState(false);
  const { addItem, openCart } = useCart();

  const priceNum = parsePriceToNumber(product.price);
  const origNum = product.original ? parsePriceToNumber(product.original) : 0;
  const savePct = origNum > 0 ? Math.round(((origNum - priceNum) / origNum) * 100) : 0;

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: priceNum,
        priceLabel: product.price,
        image: product.img,
        weave: product.weave,
        shopifyVariantId: product.shopifyVariantId,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
    openCart();
  };

  const related = useMemo(
    () =>
      catalogProducts
        .filter((p) => p.id !== product.id && p.category.some((c) => product.category.includes(c)))
        .slice(0, 5),
    [catalogProducts, product],
  );

  const waMsg = encodeURIComponent(
    `Hello Mumbai Bazar, I'd like to enquire about "${product.name}" (${product.price}). Could you share availability and drape details?`,
  );
  const waHref = `https://wa.me/919999999999?text=${waMsg}`;

  return (
    <div className="bg-ivory text-ink">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 pt-5 md:pt-6 border-b border-maroon/40 pb-4">
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-maroon/60">
          <Link to="/" className="hover:text-maroon">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/shop" className="hover:text-maroon">
            Boutique
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-maroon truncate max-w-[60vw]">{product.name}</span>
        </nav>
      </div>

      {/* Gallery + Commerce panel */}
      <section className="mx-auto max-w-[1600px] px-4 md:px-8 pb-16 pt-6 md:pt-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
          {/* LEFT — Thumbnail rail + Main image (sticky) */}
          <div className="md:col-span-7">
            <div className="md:sticky md:top-24 flex gap-3 md:gap-4">
              {/* Vertical thumbnail rail */}
              <div className="hidden md:flex flex-col gap-3 w-20 shrink-0 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide">
                {d.gallery.map((g: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`aspect-[4/5] overflow-hidden bg-[#F0E9DC] border transition-all ${
                      active === i
                        ? "border-maroon"
                        : "border-transparent hover:border-maroon/40 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={g}
                      alt={productAltText(
                        product.name,
                        product.weave,
                        GALLERY_VIEWS[i % GALLERY_VIEWS.length],
                      )}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main image */}
              <div className="flex-1 relative overflow-hidden bg-[#F0E9DC]">
                <div className="aspect-[4/5] w-full max-h-[calc(100vh-8rem)]">
                  <img
                    src={d.gallery[active]}
                    alt={productAltText(product.name, product.weave, "front drape")}
                    // The PDP hero is the LCP element — never lazy-load it.
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                {product.tag && (
                  <span className="absolute left-4 top-4 bg-maroon text-ivory px-3 py-1.5 text-[9px] tracking-[0.25em] uppercase">
                    {product.tag === "New" ? "Limited Edition" : product.tag}
                  </span>
                )}
                <button
                  aria-label="Add to wishlist"
                  className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-ivory/95 text-maroon hover:bg-ivory transition-colors"
                >
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile thumbnail strip */}
          <div className="md:hidden grid grid-cols-4 gap-2 -mt-4">
            {d.gallery.map((g: string, i: number) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`aspect-[4/5] overflow-hidden bg-[#F0E9DC] border ${
                  active === i ? "border-maroon" : "border-transparent"
                }`}
              >
                <img
                  src={g}
                  alt={productAltText(
                    product.name,
                    product.weave,
                    GALLERY_VIEWS[i % GALLERY_VIEWS.length],
                  )}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* RIGHT — Commerce panel */}
          <div className="md:col-span-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-maroon/60">
                Collection / {product.weave}
              </p>
              <h1 className="mt-3 font-serif text-4xl md:text-5xl font-semibold leading-[1.05] text-maroon">
                {product.name}
              </h1>

              {/* Price row */}
              <div className="mt-6 flex items-baseline gap-4">
                <span className="font-sans text-3xl md:text-4xl font-extrabold text-maroon tracking-tight">
                  {product.price}
                </span>
                {product.original && (
                  <>
                    <span className="text-sm font-sans text-taupe font-medium line-through">
                      {product.original}
                    </span>
                    <span className="text-[10px] tracking-[0.22em] uppercase bg-maroon text-ivory px-2.5 py-1 font-semibold rounded-md shadow-sm">
                      Save {savePct}%
                    </span>
                  </>
                )}
              </div>
              <p className="mt-2 text-xs text-taupe">
                Inclusive of all taxes · Complimentary shipping across India
              </p>

              <div className="my-7 h-px bg-maroon/15" />

              {/* Colour swatches — like the hero */}
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-maroon">
                    Select Weave Colour
                  </p>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-maroon/60">
                    {SWATCHES[swatch].name}
                  </span>
                </div>
                <div className="mt-4 flex gap-3">
                  {SWATCHES.map((s, i) => (
                    <button
                      key={s.name}
                      onClick={() => setSwatch(i)}
                      aria-label={s.name}
                      className={`relative h-11 w-11 rounded-full border transition-all ${
                        swatch === i
                          ? "border-maroon ring-1 ring-maroon ring-offset-2 ring-offset-ivory"
                          : "border-maroon/40 hover:border-maroon/50"
                      }`}
                      style={{ backgroundColor: s.hex }}
                    >
                      {swatch === i && (
                        <Check className="absolute inset-0 m-auto h-4 w-4 text-ivory drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drape / stitching options */}
              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-maroon font-semibold">
                    Drape & Stitching
                  </p>
                  <button
                    onClick={() => setShowBlouseModal(true)}
                    className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.22em] text-maroon font-bold border-b border-maroon hover:text-gold-deep"
                  >
                    <Scissors className="h-3 w-3" /> Customize Blouse Fit →
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {DRAPE_OPTIONS.map((opt, i) => (
                    <button
                      key={opt}
                      onClick={() => setDrape(i)}
                      className={`px-2 py-3 text-[10px] uppercase tracking-[0.18em] border transition-colors ${
                        drape === i
                          ? "border-maroon bg-maroon text-ivory"
                          : "border-maroon/40 text-maroon hover:border-maroon"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowBlouseModal(true)}
                  className="mt-3 w-full py-2.5 rounded-xl border border-gold/60 bg-beige/30 text-maroon text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-maroon hover:text-ivory transition-all flex items-center justify-center gap-2"
                >
                  <Scissors className="h-4 w-4" /> Add Custom Blouse & Fall Edging (+ ₹1,200)
                </button>
              </div>

              {/* Quantity + Add */}
              <div className="mt-8 flex items-stretch gap-3">
                <div className="inline-flex items-center border border-maroon/30">
                  <button
                    aria-label="Decrease"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="grid h-14 w-12 place-items-center text-maroon hover:bg-maroon/5"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm tabular-nums text-maroon">{qty}</span>
                  <button
                    aria-label="Increase"
                    onClick={() => setQty((q) => q + 1)}
                    className="grid h-14 w-12 place-items-center text-maroon hover:bg-maroon/5"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-14 bg-maroon text-ivory text-[11px] tracking-[0.28em] uppercase flex items-center justify-center gap-2 hover:bg-maroon/90 transition-colors"
                >
                  {added ? (
                    <>
                      <Check className="h-4 w-4" /> Added
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" /> Add to Shopping Bag
                    </>
                  )}
                </button>
              </div>

              {/* WhatsApp */}
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 h-14 border border-maroon/30 text-maroon text-[11px] tracking-[0.28em] uppercase flex items-center justify-center gap-2 hover:bg-maroon hover:text-ivory transition-colors"
              >
                <MessageCircle className="h-4 w-4" /> Enquire on WhatsApp
              </a>
              <p className="mt-3 text-center text-[10px] uppercase tracking-[0.2em] text-maroon/60">
                Speak to a saree expert · Video call · Custom blouse stitching
              </p>

              {/* Highlights grid — like hero WEAVE TYPE / ZARI */}
              <div className="mt-8 border-t border-maroon/40 pt-8 grid grid-cols-2 gap-x-6 gap-y-6">
                <Detail label="Fabric" value={d.fabric} />
                <Detail label="Weave" value={product.weave} />
                <Detail label="Drape" value={d.drape} />
                <Detail label="Border" value={d.border} />
                <Detail label="Palla" value={d.palla} />
                <Detail label="Length" value={d.length} />
                <Detail label="Blouse" value={d.blousePiece} />
                <Detail label="Delivery" value="7–10 business days" />
              </div>

              {/* Trust row */}
              <ul className="mt-8 grid grid-cols-3 gap-3 border-t border-maroon/40 pt-6">
                <TrustItem
                  icon={<Truck className="h-4 w-4" />}
                  label="Free Shipping"
                  sub="Across India"
                />
                <TrustItem
                  icon={<RotateCcw className="h-4 w-4" />}
                  label="Easy Returns"
                  sub="Within 7 days"
                />
                <TrustItem
                  icon={<ShieldCheck className="h-4 w-4" />}
                  label="In Store"
                  sub="See before you buy"
                />
              </ul>

              {/* Story + Care collapsibles */}
              <details className="mt-8 border-t border-maroon/40 pt-6 group" open>
                <summary className="flex cursor-pointer items-center justify-between text-[10px] uppercase tracking-[0.28em] text-maroon">
                  The Craft
                  <Plus className="h-4 w-4 group-open:hidden" />
                  <Minus className="h-4 w-4 hidden group-open:block" />
                </summary>
                <p className="mt-4 text-sm text-taupe leading-relaxed">{d.description}</p>
              </details>

              <details className="mt-2 border-t border-maroon/40 pt-6 group">
                <summary className="flex cursor-pointer items-center justify-between text-[10px] uppercase tracking-[0.28em] text-maroon">
                  Care Instructions
                  <Plus className="h-4 w-4 group-open:hidden" />
                  <Minus className="h-4 w-4 hidden group-open:block" />
                </summary>
                <ul className="mt-4 space-y-2 text-sm text-taupe">
                  {d.care.map((c: string) => (
                    <li key={c} className="flex gap-3">
                      <span className="mt-2 h-1 w-1 rounded-full bg-maroon shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* Related Sarees */}
      {related.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-4 md:px-8 py-16 border-t border-maroon/20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-maroon/60">
                You may also love
              </p>
              <h2 className="mt-2 font-serif text-3xl md:text-4xl text-maroon">
                Curated with this piece
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-[10px] uppercase tracking-[0.25em] text-maroon border-b border-maroon/40 pb-1 hover:opacity-60 hidden md:inline-block"
            >
              Browse all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-3 md:gap-x-4 gap-y-10">
            {related.map((r) => (
              <ProductCard key={r.id} p={r} />
            ))}
          </div>
        </section>
      )}

      <BlouseCustomizationModal
        product={product}
        isOpen={showBlouseModal}
        onClose={() => setShowBlouseModal(false)}
      />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[9px] uppercase tracking-[0.28em] text-maroon/60">{label}</dt>
      <dd className="mt-1.5 text-sm text-maroon leading-snug">{value}</dd>
    </div>
  );
}

function TrustItem({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <li className="flex flex-col items-center gap-1.5 text-center">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-maroon/5 text-maroon">
        {icon}
      </span>
      <span className="text-[10px] uppercase tracking-[0.22em] text-maroon">{label}</span>
      <span className="text-[9px] uppercase tracking-[0.18em] text-maroon/50">{sub}</span>
    </li>
  );
}
