import { useState, useMemo, useEffect, useRef } from "react";
import { useLoaderData, Link } from "react-router";
import type { Route } from "./+types/products.$handle";
import {
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  MessageCircle,
  Check,
  ArrowRight,
} from "lucide-react";
import { SITE, getSeoMeta, jsonLdScript, productAltText } from "~/lib/seo";
import { productSchema, breadcrumbSchema, priceToSchema } from "~/lib/structured-data";
import { resolveColorSwatch, getProductColors, type SwatchResolution } from "~/lib/filters";
import { fetchLiveProduct, fetchLiveProducts, type ShopifyProduct } from "~/lib/shopify.server";
import { shopifyImage, shopifyImageSrcSet, getDirectCheckoutUrl } from "~/lib/shopify";
import { useWishlist } from "~/lib/wishlist-context";
import { useAside } from "~/components/Aside";
import { ProductCard } from "~/components/ProductCard";
import { hapticImpact, hapticSuccess } from "~/lib/native-bridge";
import { CartForm } from "@shopify/hydrogen";
import { trackViewContent, trackAddToCart } from "~/lib/meta-pixel";

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data?.product) {
    return getSeoMeta({
      title: "Saree Not Found — Mumbai Bazar",
      description: "This saree is currently unavailable. Browse our collection at Mumbai Bazar.",
      path: "/shop",
      noindex: true,
    });
  }

  const p = data.product;
  const desc =
    p.details?.description ??
    `${p.name} in ${p.weave}. See it and drape it at our stores or order online across India.`;

  const BRAND_SUFFIX = " | Mumbai Bazar";
  const nameBudget = 60 - BRAND_SUFFIX.length;
  const shortName =
    p.name.length <= nameBudget
      ? p.name
      : p.name.slice(0, p.name.lastIndexOf(" ", nameBudget)).replace(/[\s,–—-]+$/, "");

  const metaList = getSeoMeta({
    title: `${shortName}${BRAND_SUFFIX}`,
    description: desc.slice(0, 160),
    path: `/products/${p.handle}`,
    image: p.img,
    type: "product",
    keywords: [
      p.name,
      p.weave,
      `${p.weave} online`,
      "buy saree online",
      "saree online shopping",
      "mumbai bazar saree",
      "pure silk saree mumbai",
    ],
  });

  metaList.push(
    { property: "product:price:amount", content: priceToSchema(p.price) },
    { property: "product:price:currency", content: SITE.currency },
    { property: "product:availability", content: "in stock" },
    { property: "product:condition", content: "new" },
    { property: "product:brand", content: SITE.name },
  );

  return metaList;
};

export async function loader({ context, params }: Route.LoaderArgs) {
  const { handle } = params;
  if (!handle) {
    throw new Response("Product Not Found", { status: 404 });
  }

  const product = await fetchLiveProduct(context, handle);
  if (!product) {
    throw new Response("Product Not Found", { status: 404 });
  }

  const all = await fetchLiveProducts(context, 16);
  const related = all.filter((p) => p.handle !== handle).slice(0, 8);

  return { product, related };
}

export default function ProductDetailPage() {
  const { product, related } = useLoaderData<typeof loader>();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { open } = useAside();
  const isSaved = isInWishlist(product.id);

  const d = product.details || {
    fabric: "Pure Silk",
    drape: "Fluid, structured pleats",
    blousePiece: "0.8 m unstitched running blouse",
    length: "5.5 m saree + 0.8 m blouse piece",
    border: "Woven zari border",
    palla: "Rich zari pallu",
    care: ["Dry clean only", "Store in muslin cloth", "Avoid moisture and perfumes"],
    description: `${product.name} is meticulously handcrafted in ${product.weave}. Authentic pure zari artistry woven for weddings, celebrations, and festive gatherings.`,
    gallery: [product.img],
  };

  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [swatch, setSwatch] = useState(0);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const gallery = useMemo(() => {
    const list = [...(d.gallery && d.gallery.length > 0 ? d.gallery : [product.img])];
    if (product.variants) {
      for (const v of product.variants) {
        if (v.img && !list.includes(v.img)) {
          list.push(v.img);
        }
      }
    }
    return list;
  }, [d.gallery, product.variants, product.img]);

  useEffect(() => {
    if (typeof window === "undefined" || !gallery.length) return;
    gallery.forEach((url) => {
      const img = new Image();
      img.src = shopifyImage(url, 1000);
    });
  }, [gallery]);

  // Meta Pixel: ViewContent event
  useEffect(() => {
    trackViewContent({
      id: product.id,
      name: product.name,
      price: product.price,
      weave: product.weave,
      handle: product.handle,
    });
  }, [product.id]);

  const productColors = useMemo(() => {
    const explicitVariants = product.variants;
    if (Array.isArray(explicitVariants) && explicitVariants.length > 1) {
      const list: Array<{
        variantId: string;
        name: string;
        hex: string;
        secondaryHex?: string;
        isDual?: boolean;
        border?: string;
        img?: string;
        price?: string;
        original?: string;
        available: boolean;
      }> = [];
      const seen = new Set<string>();

      for (const v of explicitVariants) {
        const colorName =
          v.color ||
          v.selectedOptions?.find((o) => /colou?r/i.test(o.name))?.value ||
          (v.title && v.title !== "Default Title" ? v.title.split("/")[0].trim() : null);

        if (colorName) {
          const key = colorName.toLowerCase();
          if (!seen.has(key)) {
            seen.add(key);
            const resolved = resolveColorSwatch(colorName);
            list.push({
              variantId: v.id,
              name: colorName,
              hex: resolved.hex,
              secondaryHex: resolved.secondaryHex,
              isDual: resolved.isDual,
              border: resolved.border,
              img: v.img,
              price: v.price,
              original: v.original,
              available: v.available ?? true,
            });
          }
        }
      }

      if (list.length > 1) return list;
    }

    const detectedColors = getProductColors(product);
    if (detectedColors.length > 0) {
      const primaryColor =
        detectedColors.length >= 2
          ? `${detectedColors[0]} & ${detectedColors[1]}`
          : detectedColors[0];
      const resolved = resolveColorSwatch(primaryColor);
      return [
        {
          variantId: product.shopifyVariantId,
          name: primaryColor,
          hex: resolved.hex,
          secondaryHex: resolved.secondaryHex,
          isDual: resolved.isDual,
          border: resolved.border,
          price: product.price,
          original: product.original,
          img: product.img,
          available: true,
        },
      ];
    }

    return [];
  }, [product]);

  const currentSwatch = productColors[swatch] || productColors[0];
  const activeVariantId = currentSwatch?.variantId || product.shopifyVariantId;
  const activePrice = currentSwatch?.price || product.price;
  const activeOriginal = currentSwatch?.original || product.original;

  const savePct = useMemo(() => {
    if (!activeOriginal || !activePrice) return 0;
    const orig = Number(activeOriginal.replace(/[^0-9.]/g, "")) || 0;
    const curr = Number(activePrice.replace(/[^0-9.]/g, "")) || 0;
    if (orig <= curr || orig === 0) return 0;
    return Math.round(((orig - curr) / orig) * 100);
  }, [activeOriginal, activePrice]);

  const handleSelectSwatch = (i: number) => {
    setSwatch(i);
    hapticImpact("light");
    const chosen = productColors[i];
    if (chosen?.img) {
      const idx = gallery.findIndex((g) => g === chosen.img);
      if (idx !== -1) setActive(idx);
    }
  };

  const handleBuyNow = () => {
    const directUrl = getDirectCheckoutUrl(activeVariantId, qty);
    window.location.href = directUrl;
  };

  const waMsg = encodeURIComponent(
    `Hello Mumbai Bazar, I'd like to enquire about "${product.name}" (${product.price}). Could you share availability and drape details?`,
  );
  const waHref = `https://wa.me/${SITE.whatsapp}?text=${waMsg}`;
  const thumbRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const desktopRailRef = useRef<HTMLDivElement>(null);

  const scrollRail = (direction: "up" | "down") => {
    if (desktopRailRef.current) {
      const scrollAmount = 180;
      desktopRailRef.current.scrollBy({
        top: direction === "up" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const activeEl = thumbRefs.current.get(active);
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  }, [active]);

  const schemas = [
    productSchema(product),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Boutique", path: "/shop" },
      { name: product.name, path: `/products/${product.handle}` },
    ]),
  ];

  return (
    <div className="bg-ivory text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }}
      />

      {/* Breadcrumbs */}
      <div className="border-b border-gold/30 bg-[#FAF7F2] px-4 md:px-8 py-3">
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
            <div className="md:sticky md:top-[120px] flex flex-col md:flex-row gap-3 md:gap-4">
              {/* Vertical thumbnail rail for Desktop */}
              <div className="hidden md:flex flex-col relative w-24 lg:w-28 shrink-0">
                {gallery.length > 4 && (
                  <button
                    type="button"
                    onClick={() => scrollRail("up")}
                    aria-label="Scroll thumbnails up"
                    className="w-full py-1 mb-1 text-maroon/70 hover:text-maroon flex justify-center items-center rounded-lg bg-gold/15 hover:bg-gold/30 transition-colors"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                )}
                <div
                  ref={desktopRailRef}
                  onWheel={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex flex-col gap-3 max-h-[calc(100vh-8.5rem)] overflow-y-auto overflow-x-hidden pr-1.5 overscroll-contain scroll-smooth ghost-scrollbar"
                >
                  {gallery.map((g: string, i: number) => (
                    <button
                      key={i}
                      ref={(el) => {
                        if (el) thumbRefs.current.set(i, el);
                        else thumbRefs.current.delete(i);
                      }}
                      onClick={() => {
                        setActive(i);
                        hapticImpact("light");
                      }}
                      aria-label={`View image ${i + 1}`}
                      className={`aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#F0E9DC] border-2 transition-all duration-200 shrink-0 ${
                        active === i
                          ? "border-maroon shadow-md scale-[1.02] ring-2 ring-maroon/20"
                          : "border-gold/30 hover:border-maroon/50 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={shopifyImage(g, 160)}
                        alt={`${product.name} view ${i + 1}`}
                        width={160}
                        height={200}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-top"
                      />
                    </button>
                  ))}
                </div>
                {gallery.length > 4 && (
                  <button
                    type="button"
                    onClick={() => scrollRail("down")}
                    aria-label="Scroll thumbnails down"
                    className="w-full py-1 mt-1 text-maroon/70 hover:text-maroon flex justify-center items-center rounded-lg bg-gold/15 hover:bg-gold/30 transition-colors"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Main image — instant 0ms stacked crossfade gallery */}
              <div className="flex-1 relative overflow-hidden rounded-2xl md:rounded-none bg-[#F0E9DC] shadow-sm md:shadow-none">
                <div className="aspect-[4/5] w-full max-h-[calc(100vh-8rem)] relative">
                  {gallery.map((gUrl: string, idx: number) => (
                    <img
                      key={gUrl + idx}
                      src={shopifyImage(gUrl, 1000)}
                      srcSet={shopifyImageSrcSet(gUrl, [600, 800, 1000, 1400])}
                      sizes="(max-width: 768px) 100vw, 55vw"
                      alt={`${product.name} view ${idx + 1}`}
                      width={1000}
                      height={1250}
                      loading={idx <= 1 ? "eager" : "lazy"}
                      fetchPriority={idx === 0 ? "high" : "auto"}
                      decoding="async"
                      className={`absolute inset-0 h-full w-full object-cover object-top transition-all duration-300 ease-in-out will-change-transform,opacity ${
                        active === idx
                          ? "opacity-100 z-10 scale-100"
                          : "opacity-0 z-0 scale-[1.01] pointer-events-none"
                      }`}
                    />
                  ))}
                </div>
                {product.tag && (
                  <span className="absolute left-4 top-4 bg-maroon text-ivory px-3 py-1.5 text-[9px] tracking-[0.25em] uppercase rounded-sm shadow-sm z-20">
                    {product.tag === "New" ? "Limited Edition" : product.tag}
                  </span>
                )}
                <button
                  aria-label="Add to wishlist"
                  onClick={() => toggleWishlist(product)}
                  className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full transition-all shadow-sm z-20 ${
                    isSaved
                      ? "bg-maroon text-ivory scale-105"
                      : "bg-ivory/95 text-maroon hover:bg-ivory"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isSaved ? "fill-ivory text-ivory" : ""}`} />
                </button>
              </div>

              {/* Mobile thumbnail strip */}
              <div
                onWheel={(e) => e.stopPropagation()}
                className="md:hidden flex items-center gap-2.5 overflow-x-auto scroll-smooth py-2 px-1 overscroll-contain no-scrollbar"
              >
                {gallery.map((g: string, i: number) => (
                  <button
                    key={i}
                    ref={(el) => {
                      if (el) thumbRefs.current.set(i, el);
                      else thumbRefs.current.delete(i);
                    }}
                    onClick={() => {
                      setActive(i);
                      hapticImpact("light");
                    }}
                    aria-label={`Select photo ${i + 1}`}
                    className={`w-16 h-20 sm:w-20 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-[#F0E9DC] border-2 transition-all duration-200 ${
                      active === i
                        ? "border-maroon shadow-md scale-105 ring-2 ring-maroon/20"
                        : "border-gold/40 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={shopifyImage(g, 160)}
                      alt={`${product.name} view ${i + 1}`}
                      width={160}
                      height={200}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top"
                    />
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
              <h1 className="mt-3 font-serif text-4xl md:text-5xl font-normal leading-[1.05] text-maroon">
                {product.name}
              </h1>

              {/* Price row */}
              <div className="mt-6 flex items-baseline gap-4">
                <span className="font-sans text-3xl md:text-4xl font-extrabold text-maroon tracking-tight">
                  {activePrice}
                </span>
                {activeOriginal && (
                  <>
                    <span className="text-sm font-sans text-taupe font-medium line-through">
                      {activeOriginal}
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

              <div className="my-7 h-px bg-maroon/15" />

              {/* Colour swatches */}
              {productColors.length > 1 ? (
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.16em] text-maroon font-bold">
                      Select Variant Colour
                    </p>
                    <span className="text-xs uppercase tracking-[0.14em] text-maroon font-semibold">
                      {currentSwatch?.name}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {productColors.map((s, i) => (
                      <button
                        key={s.name + i}
                        onClick={() => handleSelectSwatch(i)}
                        aria-label={`Select ${s.name}`}
                        title={s.name}
                        className={`relative h-11 w-11 rounded-full border transition-all duration-200 ${
                          swatch === i
                            ? "border-maroon ring-2 ring-maroon ring-offset-2 ring-offset-ivory scale-105 shadow-sm"
                            : "border-maroon/30 hover:border-maroon/60"
                        }`}
                        style={{
                          background: s.secondaryHex
                            ? `linear-gradient(135deg, ${s.hex} 50%, ${s.secondaryHex} 50%)`
                            : s.hex,
                          borderColor: s.border || undefined,
                        }}
                      >
                        {swatch === i && (
                          <Check
                            className={`absolute inset-0 m-auto h-4 w-4 ${
                              s.hex.toLowerCase() === "#f5efeb" || s.hex.toLowerCase() === "#ffffff"
                                ? "text-maroon"
                                : "text-ivory"
                            } drop-shadow-sm`}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : productColors.length === 1 && productColors[0].name ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-[0.16em] text-maroon font-bold">
                    Saree Colour:
                  </span>
                  <span
                    className="w-5 h-5 rounded-full border border-maroon/30 inline-block shadow-sm shrink-0"
                    style={{
                      background: productColors[0].secondaryHex
                        ? `linear-gradient(135deg, ${productColors[0].hex} 50%, ${productColors[0].secondaryHex} 50%)`
                        : productColors[0].hex,
                      borderColor: productColors[0].border || undefined,
                    }}
                    title={productColors[0].name}
                  />
                  <span className="text-xs uppercase tracking-[0.14em] text-maroon font-semibold">
                    {productColors[0].name}
                  </span>
                </div>
              ) : null}

              {/* Shop Now CTA and Quantity Stepper */}
              <div className="mt-8">
                {added ? (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center justify-between border border-maroon h-14 px-4 bg-[#FAF7F2]">
                      <button
                        onClick={() => {
                          setQty((q) => Math.max(1, q - 1));
                          open("cart");
                        }}
                        className="text-maroon p-2 hover:bg-maroon/5 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-[11px] uppercase font-bold text-maroon tracking-[0.15em]">
                        In Your Bag <span className="normal-case">Quantity:</span> {qty}
                      </span>
                      <button
                        onClick={() => {
                          setQty((q) => q + 1);
                          open("cart");
                        }}
                        className="text-maroon p-2 hover:bg-maroon/5 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => open("cart")}
                      className="h-14 px-8 bg-[#641F2A] text-ivory text-[11px] font-bold uppercase tracking-[0.15em] transition-colors hover:bg-wine active:scale-95 shrink-0"
                    >
                      View Bag
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center border border-maroon/30 h-14 bg-white shrink-0">
                      <button
                        aria-label="Decrease"
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="grid h-14 w-12 place-items-center text-maroon hover:bg-maroon/5 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-maroon tabular-nums">
                        {qty}
                      </span>
                      <button
                        aria-label="Increase"
                        onClick={() => setQty((q) => q + 1)}
                        className="grid h-14 w-12 place-items-center text-maroon hover:bg-maroon/5 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <CartForm
                      route="/cart"
                      action={CartForm.ACTIONS.LinesAdd}
                      inputs={{
                        lines: [
                          {
                            merchandiseId: activeVariantId,
                            quantity: qty,
                          },
                        ],
                      }}
                    >
                      {(fetcher) => (
                        <button
                          type="submit"
                          disabled={fetcher.state !== "idle"}
                          onClick={() => {
                            hapticSuccess();
                            setAdded(true);
                            trackAddToCart({
                              id: product.id,
                              name: product.name,
                              price: activePrice,
                              quantity: qty,
                              variantId: activeVariantId,
                            });
                            setTimeout(() => open("cart"), 600);
                          }}
                          className="h-14 px-10 bg-[#641F2A] text-ivory hover:bg-wine inline-flex items-center justify-center gap-2.5 text-[12px] font-bold tracking-[0.2em] uppercase transition-all duration-200 active:scale-[0.98] whitespace-nowrap"
                        >
                          <ShoppingBag className="h-4.5 w-4.5" /> Shop Now
                        </button>
                      )}
                    </CartForm>
                  </div>
                )}
              </div>

              {/* WhatsApp */}
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 h-[52px] w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[11px] tracking-[0.2em] uppercase font-bold flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.99] shadow-sm"
              >
                <MessageCircle className="h-5 w-5 fill-white/20" /> Enquire on WhatsApp
              </a>
              <p className="mt-3 text-center text-[9px] uppercase tracking-[0.16em] font-semibold text-ink/80">
                Speak to a saree expert · Video call · Custom blouse stitching
              </p>

              {/* Highlights grid */}
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
                <summary className="flex cursor-pointer items-center justify-between text-[10px] uppercase tracking-[0.28em] text-maroon font-bold">
                  The Craft
                  <Plus className="h-4 w-4 group-open:hidden" />
                  <Minus className="h-4 w-4 hidden group-open:block" />
                </summary>
                <p className="mt-4 text-sm text-taupe leading-relaxed">{d.description}</p>
              </details>

              <details className="mt-2 border-t border-maroon/40 pt-6 group">
                <summary className="flex cursor-pointer items-center justify-between text-[10px] uppercase tracking-[0.28em] text-maroon font-bold">
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
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8">
            {related.map((r) => (
              <ProductCard key={r.id} p={r} />
            ))}
          </div>
        </section>
      )}

      {/* Mobile Floating Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-ivory/95 backdrop-blur-xl border-t border-gold/50 px-3 py-2.5 shadow-[0_-8px_30px_rgba(100,31,42,0.15)] pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
        <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
          <div className="flex flex-col min-w-0 pr-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans text-lg font-black text-maroon tracking-tight">
                {activePrice}
              </span>
              {activeOriginal && (
                <span className="text-[11px] text-taupe font-medium line-through font-sans">
                  {activeOriginal}
                </span>
              )}
            </div>
            <span className="text-[9px] text-ink/75 font-semibold tracking-wide truncate">
              Free Express Shipping
            </span>
          </div>

          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesAdd}
            inputs={{
              lines: [
                {
                  merchandiseId: activeVariantId,
                  quantity: qty,
                },
              ],
            }}
            className="flex-1 max-w-[200px]"
          >
            {(fetcher) => (
              <button
                type="submit"
                disabled={fetcher.state !== "idle"}
                onClick={() => {
                  hapticSuccess();
                  setAdded(true);
                  if (addedTimer.current) clearTimeout(addedTimer.current);
                  addedTimer.current = setTimeout(() => setAdded(false), 2000);
                  setTimeout(() => open("cart"), 600);
                }}
                className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold tracking-[0.14em] uppercase transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95 shadow-md ${
                  added ? "bg-green-700 text-white" : "bg-maroon text-white hover:bg-wine active:bg-wine"
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" /> Shop Now
                  </>
                )}
              </button>
            )}
          </CartForm>
        </div>
      </div>
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
