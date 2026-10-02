import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useLoaderData, Link, useSearchParams } from "react-router";
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
import { CartForm, Analytics } from "@shopify/hydrogen";
import { trackViewContent, trackAddToCart } from "~/lib/meta-pixel";
import { SaleCountdown } from "~/components/SaleCountdown";

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

  /*
    Only trust the Shopify description if it actually describes something.

    Supplier-imported products arrive with descriptions like "Pink" or "Blue".
    The previous `description ?? fallback` shipped those to Google verbatim,
    because `??` only fires on null -- a one-word colour counts as present.
    Eight words is a low bar that every real description clears and every
    colour-only stub fails.
  */
  const raw = (p.details?.description ?? "").replace(/\s+/g, " ").trim();
  const usable = raw.split(" ").filter(Boolean).length >= 8;
  const fabric = p.details?.fabric && p.details.fabric !== p.weave ? p.details.fabric : p.weave;
  const generated =
    `${p.name} — ${fabric} saree at ${p.price}. ` +
    `See it in person at our Nalasopara, Virar, Bhayandar and Goregaon stores, ` +
    `or order online with free delivery on prepaid orders across India.`;
  const fullDesc = usable ? raw : generated;

  // Trim on a word boundary; a description cut mid-word reads as broken in
  // the search result.
  const desc =
    fullDesc.length <= 158
      ? fullDesc
      : fullDesc.slice(0, fullDesc.lastIndexOf(" ", 155)).replace(/[\s,;:—-]+$/, "") + "…";

  const BRAND_SUFFIX = " | Mumbai Bazar";
  const nameBudget = 60 - BRAND_SUFFIX.length;
  const shortName =
    p.name.length <= nameBudget
      ? p.name
      : p.name.slice(0, p.name.lastIndexOf(" ", nameBudget)).replace(/[\s,–—-]+$/, "");

  const metaList = getSeoMeta({
    title: `${shortName}${BRAND_SUFFIX}`,
    description: desc,
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
      "saree shop vasai virar",
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

/**
 * Watches a CartForm's fetcher and fires side effects when the submission completes.
 * Scoped to that form's fetcher, avoiding lifting cart state or unmounting mid-flight.
 */
function AddToCartEffects({
  state,
  onComplete,
}: {
  state: "idle" | "loading" | "submitting";
  onComplete: () => void;
}) {
  const wasSubmitting = useRef(false);

  useEffect(() => {
    if (state === "submitting") {
      wasSubmitting.current = true;
      return;
    }
    if (state === "idle" && wasSubmitting.current) {
      wasSubmitting.current = false;
      onComplete();
    }
  }, [state, onComplete]);

  return null;
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

  const [searchParams, setSearchParams] = useSearchParams();
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Runs when an add-to-cart submission finishes. Shows the confirmation and
   * opens the drawer, so both reflect a line that genuinely reached Shopify.
   */
  const handleAddComplete = useCallback(() => {
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 2200);
    open("cart");
  }, [open]);

  // Never leave a timer running against an unmounted component.
  useEffect(
    () => () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    },
    [],
  );

  const gallery = useMemo(() => {
    const list = [...(d.gallery && d.gallery.length > 0 ? d.gallery : [product.img])];
    if (product.variants) {
      for (const v of product.variants) {
        if (v.img && !list.some((g) => g.split("?")[0] === v.img?.split("?")[0])) {
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
          available: product.variants?.[0]?.available ?? true,
        },
      ];
    }

    return [];
  }, [product]);

  const isColorOption = useMemo(() => {
    if (product.options && product.options.length > 0) {
      return product.options.some((o) => /colou?r|shade/i.test(o.name));
    }
    return true;
  }, [product.options]);

  const optionHeading = useMemo(() => {
    if (product.options && product.options.length > 0) {
      const customOpt = product.options.find((o) => o.name !== "Title");
      if (customOpt) return customOpt.name;
    }
    return "Colour";
  }, [product.options]);

  // Pre-select variant from ad URL query parameters (?variant=... or ?color=...)
  const initialSwatchIdx = useMemo(() => {
    if (!productColors.length) return 0;
    const variantParam = searchParams.get("variant")?.toLowerCase();
    const colorParam = (
      searchParams.get("color") ||
      searchParams.get("Color") ||
      searchParams.get("shade")
    )?.toLowerCase();

    if (variantParam) {
      const idx = productColors.findIndex((c) => {
        const numId = c.variantId.split("/").pop()?.toLowerCase();
        return c.variantId.toLowerCase() === variantParam || numId === variantParam;
      });
      if (idx !== -1) return idx;
    }

    if (colorParam) {
      const idx = productColors.findIndex(
        (c) =>
          c.name.toLowerCase() === colorParam ||
          c.name.toLowerCase().includes(colorParam),
      );
      if (idx !== -1) return idx;
    }

    return 0;
  }, [productColors, searchParams]);

  const [swatch, setSwatch] = useState(initialSwatchIdx);

  useEffect(() => {
    setSwatch(initialSwatchIdx);
  }, [initialSwatchIdx]);

  // Sync main gallery photo to active variant image
  useEffect(() => {
    const chosen = productColors[swatch];
    if (chosen?.img && gallery.length > 0) {
      const cleanImg = chosen.img.split("?")[0];
      const idx = gallery.findIndex((g) => g.split("?")[0] === cleanImg);
      if (idx !== -1) {
        setActive(idx);
      }
    }
  }, [swatch, productColors, gallery]);

  const currentSwatch = productColors[swatch] || productColors[0];
  const isAvailable = currentSwatch
    ? Boolean(currentSwatch.available)
    : (product.variants?.some((v) => v.available) ?? true);
  const activeVariantId = currentSwatch?.variantId || product.shopifyVariantId;
  const activePrice = currentSwatch?.price || product.price;
  const activeOriginal = currentSwatch?.original || product.original;

  // Meta Pixel: ViewContent event with full multi-ID catalog matching
  useEffect(() => {
    trackViewContent({
      id: product.id,
      name: product.name,
      price: activePrice || product.price,
      weave: product.weave,
      handle: product.handle,
      shopifyProductId: product.shopifyProductId,
      shopifyVariantId: activeVariantId,
    });
  }, [product.id, activeVariantId, activePrice]);

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
      const cleanImg = chosen.img.split("?")[0];
      const idx = gallery.findIndex((g) => g.split("?")[0] === cleanImg);
      if (idx !== -1) setActive(idx);
    }
    // Update URL variant parameter for ad tracking and direct sharing
    if (chosen?.variantId) {
      const numId = chosen.variantId.split("/").pop();
      if (numId) {
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.set("variant", numId);
            return next;
          },
          { replace: true },
        );
      }
    }
  };

  const handleBuyNow = () => {
    const directUrl = getDirectCheckoutUrl(activeVariantId, qty);
    window.location.href = directUrl;
  };

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
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.shopifyProductId || product.id,
              title: product.name,
              price: activePrice ? String(activePrice.replace(/[^0-9.]/g, "")) : "0",
              vendor: "Mumbai Bazar",
              variantId: activeVariantId,
              variantTitle: currentSwatch?.name || "Default Title",
              quantity: 1,
            },
          ],
        }}
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
                <span className="font-sans text-3xl md:text-4xl font-black text-black tracking-tight">
                  {activePrice}
                </span>
                {activeOriginal && (
                  <>
                    <span className="text-sm font-sans text-red-600 font-semibold line-through">
                      {activeOriginal}
                    </span>
                    <span className="text-[10px] tracking-[0.22em] uppercase bg-maroon text-ivory px-2.5 py-1 font-semibold rounded-md shadow-sm">
                      Save {savePct}%
                    </span>
                  </>
                )}
              </div>
              <p className="mt-2 text-xs text-ink/80 font-medium">
                Inclusive of all taxes · Free express delivery across India
              </p>

              {/* 4-Hour Auto-refreshing Festive Sale Timer */}
              <SaleCountdown />

              <div className="my-7 h-px bg-maroon/15" />

              {/* Colour / Option swatches */}
              {productColors.length > 1 ? (
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.16em] text-maroon font-bold">
                      Select {isColorOption ? "Variant Colour" : optionHeading}
                    </p>
                    <span className="text-xs uppercase tracking-[0.14em] text-maroon font-semibold">
                      {currentSwatch?.name}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {productColors.map((s, i) =>
                      isColorOption ? (
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
                      ) : (
                        <button
                          key={s.name + i}
                          onClick={() => handleSelectSwatch(i)}
                          aria-label={`Select ${s.name}`}
                          className={`px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                            swatch === i
                              ? "bg-maroon text-ivory border-maroon shadow-sm scale-102"
                              : "bg-white text-ink/80 border-maroon/20 hover:border-maroon/60"
                          }`}
                        >
                          {s.name}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              ) : productColors.length === 1 && productColors[0].name ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-[0.16em] text-maroon font-bold">
                    {isColorOption ? "Saree Colour:" : `${optionHeading}:`}
                  </span>
                  {isColorOption && (
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
                  )}
                  <span className="text-xs uppercase tracking-[0.14em] text-maroon font-semibold">
                    {productColors[0].name}
                  </span>
                </div>
              ) : null}

              {/* Shop Now CTA and Quantity Stepper */}
              <div className="mt-8">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center h-14 rounded-2xl border border-maroon/30 bg-white shadow-sm shrink-0 px-1">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="grid h-11 w-11 place-items-center rounded-xl text-maroon hover:bg-maroon/10 active:scale-90 transition-all"
                    >
                      <Minus className="h-4 w-4 stroke-[2.5]" />
                    </button>
                    <span className="w-10 text-center font-sans text-base font-extrabold text-maroon tabular-nums">
                      {qty}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQty((q) => q + 1)}
                      className="grid h-11 w-11 place-items-center rounded-xl text-maroon hover:bg-maroon/10 active:scale-90 transition-all"
                    >
                      <Plus className="h-4 w-4 stroke-[2.5]" />
                    </button>
                  </div>

                  <div className="flex-1">
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
                      {(fetcher) => {
                        const isSubmitting = fetcher.state !== "idle";
                        return (
                          <>
                            <AddToCartEffects
                              state={fetcher.state}
                              onComplete={handleAddComplete}
                            />
                            <button
                              type="submit"
                              disabled={!isAvailable || isSubmitting}
                              onClick={() => {
                                if (!isAvailable) return;
                                hapticSuccess();
                                trackAddToCart({
                                  id: product.id,
                                  name: product.name,
                                  price: activePrice,
                                  quantity: qty,
                                  variantId: activeVariantId,
                                });
                              }}
                              className={`relative w-full h-14 rounded-2xl flex items-center justify-center gap-3 px-6 text-sm font-bold tracking-[0.16em] uppercase transition-all duration-300 active:scale-[0.98] ${
                                !isAvailable
                                  ? "bg-taupe/30 text-ink/50 cursor-not-allowed shadow-none"
                                  : added
                                  ? "bg-emerald-700 text-white shadow-md"
                                  : "bg-maroon hover:bg-wine text-white shadow-md"
                              }`}
                            >
                              {!isAvailable ? (
                                <span>Sold Out</span>
                              ) : isSubmitting ? (
                                <span>Adding to Bag...</span>
                              ) : added ? (
                                <>
                                  <Check className="h-5 w-5 stroke-[2.5]" />
                                  <span>Added to Bag</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="h-5 w-5 stroke-[2.2]" />
                                  <span>Shop Now</span>
                                </>
                              )}
                            </button>
                          </>
                        );
                      }}
                    </CartForm>
                  </div>
                </div>
              </div>

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
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-t border-[#A27633]/40 px-3.5 py-2.5 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          {/* Price & Guarantee Column */}
          <div className="flex flex-col min-w-0 shrink-0">
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans text-xl font-black text-black tracking-tight">
                {activePrice}
              </span>
              {activeOriginal && (
                <span className="text-xs text-red-600 font-semibold line-through font-sans">
                  {activeOriginal}
                </span>
              )}
            </div>
            <span className="text-[10px] text-ink/80 font-bold tracking-wide flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Free Express Delivery
            </span>
          </div>

          {/* High-Converting Shop Now CTA */}
          <div className="flex-1">
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
              {(fetcher) => {
                const isSubmitting = fetcher.state !== "idle";
                return (
                  <>
                    <AddToCartEffects
                      state={fetcher.state}
                      onComplete={handleAddComplete}
                    />
                    <button
                      type="submit"
                      disabled={!isAvailable || isSubmitting}
                      onClick={() => {
                        if (!isAvailable) return;
                        hapticSuccess();
                        trackAddToCart({
                          id: product.id,
                          name: product.name,
                          price: activePrice,
                          quantity: qty,
                          variantId: activeVariantId,
                        });
                      }}
                      className={`w-full h-12 rounded-xl text-xs font-bold tracking-[0.14em] uppercase transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.97] ${
                        !isAvailable
                          ? "bg-taupe/30 text-ink/50 cursor-not-allowed shadow-none"
                          : added
                          ? "bg-emerald-700 text-white shadow-md"
                          : "bg-maroon hover:bg-wine text-white shadow-md"
                      }`}
                    >
                      {!isAvailable ? (
                        <span>Sold Out</span>
                      ) : isSubmitting ? (
                        <span>Adding...</span>
                      ) : added ? (
                        <>
                          <Check className="h-4 w-4 stroke-[2.5]" />
                          <span>Added to Bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-4 w-4 stroke-[2.2]" />
                          <span>Shop Now</span>
                        </>
                      )}
                    </button>
                  </>
                );
              }}
            </CartForm>
          </div>
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
