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
} from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { useCart, parsePriceToNumber } from "@/lib/cart-context";
import { fetchShopifyProduct } from "@/lib/shopify";
import { useCatalog } from "@/lib/catalog-context";
import { seo, jsonLd, SITE } from "@/lib/seo";
import { productSchema, breadcrumbSchema, priceToSchema } from "@/lib/structured-data";

export const Route = createFileRoute("/products/$id")({
  loader: async ({ params }) => {
    const product = await fetchShopifyProduct(params.id).catch(() => null);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return seo({
        title: "Saree Not Found — Mumbai Bazar",
        description: "This piece is no longer available. Browse the current range at Mumbai Bazar.",
        path: "/shop",
        noindex: true,
      });
    }
    const p = loaderData.product;
    const desc =
      p.details?.description ??
      `${p.name} in ${p.weave}. Available to see and drape at our stores, with delivery across India.`;
    // Titles are truncated by Google at roughly 60 characters. The old template
    // — `${name} — Buy ${weave} Online at Best Price | Mumbai Bazar` — ran
    // 82-115 characters on every product, so the brand and half the value
    // proposition never rendered in a result. "Buy ... Online at Best Price"
    // added no ranking value and consumed the entire visible budget.
    // Long product names are trimmed on a word boundary rather than mid-word.
    const BRAND_SUFFIX = " | Mumbai Bazar";
    const nameBudget = 60 - BRAND_SUFFIX.length;
    const shortName =
      p.name.length <= nameBudget
        ? p.name
        : p.name.slice(0, p.name.lastIndexOf(" ", nameBudget)).replace(/[\s,–—-]+$/, "");

    const { meta, links } = seo({
      title: `${shortName}${BRAND_SUFFIX}`,
      description: desc.slice(0, 160),
      path: `/products/${p.id}`,
      image: p.img,
      type: "product",
      keywords: [
        p.name,
        p.weave,
        `${p.weave} online`,
        "buy saree online",
        "saree online shopping",
        "mumbai bazar saree",
        "flipkart saree online",
        "pure silk saree mumbai",
        "designer festive saree",
        "saree shop near me",
      ],
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

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const { products: catalogProducts } = useCatalog();
  const d = product.details!;
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [swatch, setSwatch] = useState(0);
  const [added, setAdded] = useState(false);
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
  const waHref = `https://wa.me/${SITE.whatsapp}?text=${waMsg}`;

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
            <div className="md:sticky md:top-24 flex flex-col md:flex-row gap-3 md:gap-4">
              {/* Vertical thumbnail rail for Desktop */}
              <div className="hidden md:flex flex-col gap-3 w-20 shrink-0 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide">
                {d.gallery.map((g: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`aspect-[4/5] overflow-hidden rounded-lg bg-[#F0E9DC] border transition-all ${
                      active === i
                        ? "border-maroon shadow-sm"
                        : "border-transparent hover:border-maroon/40 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={g} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Main image */}
              <div className="flex-1 relative overflow-hidden rounded-2xl md:rounded-none bg-[#F0E9DC] shadow-sm md:shadow-none">
                <div className="aspect-[4/5] w-full max-h-[calc(100vh-8rem)]">
                  <img
                    src={d.gallery[active]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                {product.tag && (
                  <span className="absolute left-4 top-4 bg-maroon text-ivory px-3 py-1.5 text-[9px] tracking-[0.25em] uppercase rounded-sm shadow-sm">
                    {product.tag === "New" ? "Limited Edition" : product.tag}
                  </span>
                )}
                <button
                  aria-label="Add to wishlist"
                  className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-ivory/95 text-maroon hover:bg-ivory transition-colors shadow-sm"
                >
                  <Heart className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile thumbnail strip: clean 1-line horizontal scrollable rail */}
              <div className="md:hidden flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5">
                {d.gallery.map((g: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Select photo ${i + 1}`}
                    className={`w-14 h-16 sm:w-16 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-[#F0E9DC] border-2 transition-all ${
                      active === i
                        ? "border-maroon shadow-sm scale-105"
                        : "border-gold/40 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={g} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Commerce panel */}
          <div className="md:col-span-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-maroon">
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
              <p className="mt-2 text-xs text-ink/80 font-medium">
                Inclusive of all taxes · Complimentary shipping across India
              </p>

              {/*
                Trust badge. This used to read "100% Authentic Handloom · Also
                Verified on Flipkart Brand Store" on every product, including
                ₹820 pieces whose own spec table says the weave is "Bollywood
                Woven Satin" — a power-loom finish, not handloom. An
                unsubstantiated "100% Authentic" claim about goods being sold is
                a misleading-advertisement exposure under the Consumer
                Protection Act, and it fails the price sanity check that Google's
                quality raters are told to apply.

                What replaces it is stronger because every word is verifiable:
                the stores are real, the returns window is real, and seeing the
                piece before you buy is the actual differentiator.
              */}
              <div className="mt-3.5 inline-flex items-center gap-2 rounded-xl bg-gold/10 border border-gold/40 px-3.5 py-1.5 text-xs text-maroon font-semibold">
                <ShieldCheck className="h-4 w-4 text-gold-deep shrink-0" />
                <span>See it in store before you buy · 7-day returns</span>
              </div>

              <div className="my-7 h-px bg-maroon/15" />

              {/* Colour swatches — like the hero */}
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.16em] text-maroon font-bold">
                    Select Weave Colour
                  </p>
                  <span className="text-xs uppercase tracking-[0.14em] text-maroon font-semibold">
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
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-maroon">
                You may also love
              </p>
              <h2 className="mt-2 font-serif text-3xl md:text-4xl text-maroon">
                Curated with this piece
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-bold uppercase tracking-[0.16em] text-maroon border-b border-maroon/40 pb-0.5 hover:text-gold-deep hidden md:inline-block"
            >
              Browse all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-3 md:gap-x-4 gap-y-10">
            {related.map((r) => (
              <ProductCard key={r.id} p={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-maroon">{label}</dt>
      <dd className="mt-1 text-sm text-ink font-medium leading-snug">{value}</dd>
    </div>
  );
}

function TrustItem({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <li className="flex flex-col items-center gap-1.5 text-center">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-maroon/10 text-maroon">
        {icon}
      </span>
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-maroon">{label}</span>
      <span className="text-[10px] uppercase tracking-[0.12em] text-ink/80 font-medium">{sub}</span>
    </li>
  );
}
