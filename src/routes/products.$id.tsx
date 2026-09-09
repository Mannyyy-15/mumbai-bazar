import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
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
  ChevronUp,
  ChevronDown,
  Check,
  Lock,
} from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { useCart, parsePriceToNumber } from "@/lib/cart-context";
import { fetchShopifyProduct, getDirectCheckoutUrl } from "@/lib/shopify";
import { useWishlist } from "@/lib/wishlist-context";
import { useCatalog } from "@/lib/catalog-context";
import { seo, jsonLd, SITE } from "@/lib/seo";
import { productSchema, breadcrumbSchema, priceToSchema } from "@/lib/structured-data";
import { resolveColorSwatch, getProductColors } from "@/lib/filters";

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

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const { products: catalogProducts } = useCatalog();
  const d = product.details!;
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [swatch, setSwatch] = useState(0);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Merge any variant images that exist into the gallery list so user can see every color in thumbnails
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

  // Dynamically determine color swatches:
  // - If the product has multiple variants with distinct colors (e.g. Red, White, Black), extracts and displays all variant swatches.
  // Dynamically determine color swatches from Shopify variants and options
  const productColors = useMemo(() => {
    // 1. Check for explicit variants on product (from Shopify)
    const explicitVariants = product.variants;
    if (Array.isArray(explicitVariants) && explicitVariants.length > 1) {
      const list: Array<{
        variantId: string;
        name: string;
        hex: string;
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

    // 2. Check options for Color with multiple values
    const colorOpt = product.options?.find((o) => /colou?r/i.test(o.name));
    if (colorOpt && colorOpt.values.length > 1) {
      return colorOpt.values.map((val) => {
        const resolved = resolveColorSwatch(val);
        const matchingVariant = product.variants?.find(
          (v) =>
            v.color?.toLowerCase() === val.toLowerCase() ||
            v.title.toLowerCase().includes(val.toLowerCase()),
        );
        return {
          variantId: matchingVariant?.id || product.shopifyVariantId,
          name: val,
          hex: resolved.hex,
          border: resolved.border,
          img: matchingVariant?.img,
          price: matchingVariant?.price,
          original: matchingVariant?.original,
          available: matchingVariant?.available ?? true,
        };
      });
    }

    // 3. For single-variant products: identify authentic saree color from Shopify garment data
    const detectedColors = getProductColors(product);
    if (detectedColors.length > 0) {
      const primaryColor = detectedColors[0];
      const resolved = resolveColorSwatch(primaryColor);
      return [
        {
          variantId: product.shopifyVariantId,
          name: primaryColor,
          hex: resolved.hex,
          border: resolved.border,
          available: true,
        },
      ];
    }

    return [];
  }, [product]);

  // Sync selected swatch with the product's primary featured image
  useEffect(() => {
    if (product.variants && product.variants.length > 1) {
      const matchIdx = productColors.findIndex(
        (c) => c.img && (c.img === product.img || product.img.includes(c.img)),
      );
      const targetIdx = matchIdx >= 0 ? matchIdx : 0;
      setSwatch(targetIdx);
      const targetImg = productColors[targetIdx]?.img;
      if (targetImg) {
        const gIndex = gallery.indexOf(targetImg);
        if (gIndex >= 0) setActive(gIndex);
      }
    } else {
      setSwatch(0);
      setActive(0);
    }
  }, [product.id, productColors, gallery, product.img]);

  const currentSwatch = productColors[swatch] || productColors[0];
  const activePrice = currentSwatch.price || product.price;
  const activeOriginal = currentSwatch.original || product.original;
  const activeVariantId = currentSwatch.variantId || product.shopifyVariantId;

  const priceNum = parsePriceToNumber(activePrice);
  const origNum = activeOriginal ? parsePriceToNumber(activeOriginal) : 0;
  const savePct = origNum > 0 ? Math.round(((origNum - priceNum) / origNum) * 100) : 0;

  const handleSelectSwatch = (index: number) => {
    setSwatch(index);
    const selected = productColors[index];
    if (selected && selected.img) {
      const gIndex = gallery.indexOf(selected.img);
      if (gIndex >= 0) {
        setActive(gIndex);
      }
    }
  };

  useEffect(
    () => () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    },
    [],
  );
  const { addItem, openCart, items, setQty: setCartItemQty } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isSaved = isInWishlist(product.id);

  const inCartItem = items.find(
    (i) =>
      (activeVariantId && i.shopifyVariantId === activeVariantId) ||
      i.id === product.id,
  );
  const inCartQty = inCartItem?.qty || 0;

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: priceNum,
        priceLabel: activePrice,
        image: currentSwatch.img || gallery[active] || product.img,
        weave: product.weave,
        color: currentSwatch.name,
        shopifyVariantId: activeVariantId,
      },
      qty,
    );
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 1800);
    openCart();
  };

  const handleBuyNow = () => {
    const directUrl = getDirectCheckoutUrl(activeVariantId, qty);
    window.location.href = directUrl;
  };

  const related = useMemo(() => {
    const pool = catalogProducts.filter((p) => p.id !== product.id);
    if (pool.length === 0) return [];

    // 1. Prioritize pieces matching category
    const sameCategory = pool.filter((p) =>
      p.category && p.category.some((c) => product.category && product.category.includes(c)),
    );

    // 2. Secondary: pieces matching weave or fabric
    const sameWeave = pool.filter(
      (p) =>
        p.weave &&
        product.weave &&
        p.weave.toLowerCase() === product.weave.toLowerCase() &&
        !sameCategory.some((item) => item.id === p.id),
    );

    // 3. Fallback: all other pieces in the catalog
    const others = pool.filter(
      (p) =>
        !sameCategory.some((item) => item.id === p.id) &&
        !sameWeave.some((item) => item.id === p.id),
    );

    // Combined unique list with up to 8 curated items
    return [...sameCategory, ...sameWeave, ...others].slice(0, 8);
  }, [catalogProducts, product]);

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

  // Auto-scroll active thumbnail into view when active changes
  useEffect(() => {
    const activeEl = thumbRefs.current.get(active);
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  }, [active]);

  return (
    <div className="bg-ivory text-ink">
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
            <div className="md:sticky md:top-24 flex flex-col md:flex-row gap-3 md:gap-4">
              {/* Vertical thumbnail rail for Desktop — generous size, scrollable */}
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
                  data-lenis-prevent
                  onWheel={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex flex-col gap-3 max-h-[calc(100vh-8rem)] overflow-y-auto overflow-x-hidden pr-1.5 overscroll-contain scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(88,17,26,0.35)_rgba(88,17,26,0.05)]"
                >
                  {gallery.map((g: string, i: number) => (
                    <button
                      key={i}
                      ref={(el) => {
                        if (el) thumbRefs.current.set(i, el);
                        else thumbRefs.current.delete(i);
                      }}
                      onClick={() => setActive(i)}
                      aria-label={`View image ${i + 1}`}
                      className={`aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#F0E9DC] border-2 transition-all duration-200 shrink-0 ${
                        active === i
                          ? "border-maroon shadow-md scale-[1.02] ring-2 ring-maroon/20"
                          : "border-gold/30 hover:border-maroon/50 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img src={g} alt="" className="h-full w-full object-cover object-top" />
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

              {/* Main image */}
              <div className="flex-1 relative overflow-hidden rounded-2xl md:rounded-none bg-[#F0E9DC] shadow-sm md:shadow-none">
                <div className="aspect-[4/5] w-full max-h-[calc(100vh-8rem)]">
                  <img
                    src={gallery[active] || product.img}
                    alt={product.name}
                    loading="eager"
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-opacity duration-200"
                  />
                </div>
                {product.tag && (
                  <span className="absolute left-4 top-4 bg-maroon text-ivory px-3 py-1.5 text-[9px] tracking-[0.25em] uppercase rounded-sm shadow-sm">
                    {product.tag === "New" ? "Limited Edition" : product.tag}
                  </span>
                )}
                <button
                  aria-label="Add to wishlist"
                  onClick={() => toggleWishlist(product)}
                  className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full transition-all shadow-sm ${
                    isSaved
                      ? "bg-maroon text-ivory scale-105"
                      : "bg-ivory/95 text-maroon hover:bg-ivory"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isSaved ? "fill-ivory text-ivory" : ""}`} />
                </button>
              </div>

              {/* Mobile thumbnail strip: horizontal scrollable rail with generous size */}
              <div
                data-lenis-prevent
                onWheel={(e) => e.stopPropagation()}
                className="md:hidden flex items-center gap-2.5 overflow-x-auto scroll-smooth py-2 px-1 overscroll-contain [scrollbar-width:none]"
              >
                {gallery.map((g: string, i: number) => (
                  <button
                    key={i}
                    ref={(el) => {
                      if (el) thumbRefs.current.set(i, el);
                      else thumbRefs.current.delete(i);
                    }}
                    onClick={() => setActive(i)}
                    aria-label={`Select photo ${i + 1}`}
                    className={`w-16 h-20 sm:w-20 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-[#F0E9DC] border-2 transition-all duration-200 ${
                      active === i
                        ? "border-maroon shadow-md scale-105 ring-2 ring-maroon/20"
                        : "border-gold/40 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <img src={g} alt="" className="h-full w-full object-cover object-top" />
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

              {/* Colour swatches — dynamic according to Shopify product variants */}
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
                          backgroundColor: s.hex,
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
                <div className="flex items-center gap-2.5">
                  <span className="text-xs uppercase tracking-[0.16em] text-maroon font-bold">
                    Saree Colour:
                  </span>
                  <span
                    className="w-4 h-4 rounded-full border border-maroon/30 inline-block shadow-inner"
                    style={{
                      backgroundColor: productColors[0].hex,
                      borderColor: productColors[0].border || undefined,
                    }}
                  />
                  <span className="text-xs uppercase tracking-[0.14em] text-maroon font-semibold">
                    {productColors[0].name}
                  </span>
                </div>
              ) : null}

              {/* Shop Now CTA or In-Cart Quantity Selector */}
              {inCartQty > 0 ? (
                <div className="mt-8 flex items-stretch gap-3">
                  <div className="flex-1 flex items-center justify-between border-2 border-maroon bg-[#FAF7F2] h-14 px-3 shadow-sm">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() => inCartItem && setCartItemQty(inCartItem.id, inCartQty - 1)}
                      className="grid h-10 w-10 place-items-center text-maroon hover:bg-maroon hover:text-ivory transition-colors active:scale-95"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <button
                      onClick={openCart}
                      className="flex flex-col items-center leading-tight hover:opacity-80 transition-opacity"
                    >
                      {added ? (
                        <div className="flex items-center gap-1.5 text-green-700 font-bold text-xs uppercase tracking-wider">
                          <Check className="h-4 w-4 text-green-700" />
                          <span>Added to Cart</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] uppercase font-bold text-maroon/70 tracking-widest">
                            In Your Bag
                          </span>
                          <span className="font-sans text-sm font-black text-maroon">
                            Quantity: {inCartQty}
                          </span>
                        </div>
                      )}
                    </button>

                    <button
                      aria-label="Increase quantity"
                      onClick={() => inCartItem && setCartItemQty(inCartItem.id, inCartQty + 1)}
                      className="grid h-10 w-10 place-items-center bg-maroon text-ivory hover:bg-wine transition-colors active:scale-95 shadow-xs"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={openCart}
                    className="h-14 px-6 bg-maroon text-ivory text-[11px] tracking-[0.24em] uppercase font-bold flex items-center justify-center gap-2 hover:bg-wine transition-colors active:scale-98 shadow-md"
                  >
                    View Bag
                  </button>
                </div>
              ) : (
                <div className="mt-8 flex items-stretch gap-3">
                  <div className="inline-flex items-center border border-maroon/30 h-14">
                    <button
                      aria-label="Decrease"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="grid h-14 w-12 place-items-center text-maroon hover:bg-maroon/5 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-sm tabular-nums text-maroon font-bold">{qty}</span>
                    <button
                      aria-label="Increase"
                      onClick={() => setQty((q) => q + 1)}
                      className="grid h-14 w-12 place-items-center text-maroon hover:bg-maroon/5 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 h-14 text-[11px] tracking-[0.28em] uppercase font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-98 shadow-md ${
                      added
                        ? "bg-green-700 text-white"
                        : "bg-maroon text-ivory hover:bg-wine"
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
                </div>
              )}

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
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8">
            {related.map((r) => (
              <ProductCard key={r.id} p={r} />
            ))}
          </div>
        </section>
      )}

      {/* Mobile Floating Bottom Bar: Price, Compare Price, and CTAs */}
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

          {inCartQty > 0 ? (
            <div className="flex-1 max-w-[200px] flex items-center justify-between border-2 border-maroon bg-[#FAF7F2] py-2 px-2 rounded-xl shadow-sm">
              <button
                onClick={() => inCartItem && setCartItemQty(inCartItem.id, inCartQty - 1)}
                aria-label="Decrease quantity"
                className="grid h-8 w-8 place-items-center rounded-lg text-maroon hover:bg-maroon hover:text-ivory transition-colors active:scale-95"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={openCart}
                className="flex flex-col items-center px-1"
              >
                <span className="text-[8px] uppercase font-bold text-maroon/70">In Bag</span>
                <span className="font-sans text-xs font-black text-maroon">Qty: {inCartQty}</span>
              </button>
              <button
                onClick={() => inCartItem && setCartItemQty(inCartItem.id, inCartQty + 1)}
                aria-label="Increase quantity"
                className="grid h-8 w-8 place-items-center rounded-lg bg-maroon text-ivory hover:bg-wine transition-colors active:scale-95 shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              aria-live="polite"
              className={`flex-1 max-w-[200px] py-3.5 px-4 rounded-xl text-xs font-bold tracking-[0.14em] uppercase transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95 shadow-md ${
                added
                  ? "bg-green-700 text-white"
                  : "bg-maroon text-white hover:bg-wine active:bg-wine"
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
