import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Sparkles,
  Instagram,
  Star,
  Quote,
  Heart,
  Play,
} from "lucide-react";

import { IMG, COLLECTIONS, LOOKS, TESTIMONIAL_IMGS, type Product } from "@/lib/site-data";
import { seo, jsonLd } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { useCart, parsePriceToNumber } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useCatalog } from "@/lib/catalog-context";
import { TrousseauBuilder } from "@/components/site/TrousseauBuilder";

/**
 * Hero slide asset base paths — extension omitted so each <picture> can offer
 * AVIF and WebP and let the browser pick. The source PNGs were 2.0-2.5 MB each
 * (12.9 MB across the six); the AVIF set totals 0.56 MB for the same pixels.
 */
const HERO_SLIDE_1 = "/hero/slide-1";
const HERO_SLIDE_2 = "/hero/slide-2";
const HERO_SLIDE_3 = "/hero/slide-3";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => {
    const { meta, links } = seo({
      title: "Mumbai Bazar | Saree, Lehenga & Bridal Wear Shops in Nalasopara & Virar",
      description:
        "Sarees, dress material, designer lehengas and dulhan wear at 8 Mumbai Bazar stores across Nalasopara, Virar, Vasai, Bhayandar and Goregaon. Open daily 10 AM-9 PM.",
      path: "/",
      keywords: [
        "saree shop near me",
        "saree shop nalasopara",
        "saree shop virar",
        "lehenga shop nalasopara",
        "dulhan saree",
        "party wear saree",
        "dress material shop",
      ],
    });
    return {
      meta,
      links: [
        ...links,
        // Preload the actual LCP image — the first hero slide. This previously
        // preloaded a hero JPEG that was not rendered anywhere on the page:
        // 323 KB fetched at high priority and never shown, competing with the
        // real LCP. Scoped by viewport so phones fetch only the portrait crop,
        // and typed so browsers without AVIF skip it and take the WebP from the
        // <picture> below instead of double-downloading.
        {
          rel: "preload",
          as: "image",
          type: "image/avif",
          href: `${HERO_SLIDE_1}-horizontal.avif`,
          media: "(min-width: 768px)",
          fetchPriority: "high",
        },
        {
          rel: "preload",
          as: "image",
          type: "image/avif",
          href: `${HERO_SLIDE_1}-vertical.avif`,
          media: "(max-width: 767px)",
          fetchPriority: "high",
        },
      ],
      scripts: [jsonLd(breadcrumbSchema([{ name: "Home", path: "/" }]))],
    };
  },
});

/* ---------------- Hero Carousel ---------------- */
type Slide = {
  eyebrow: string;
  title: string;
  italic?: string;
  copy: string;
  cta: { label: string; to: string };
  secondary?: { label: string; to: string };
  /** Asset base path without size suffix or extension, e.g. "/hero/slide-1". */
  img: string;
  align: "left" | "right" | "center";
  accent: string; // small tag e.g. "01 / 03"
};

const SLIDES: Slide[] = [
  {
    eyebrow: "Bridal & Trousseau 2026",
    title: "The Royal",
    italic: "Trousseau Edit",
    copy: "Bridal and dulhan sarees, designer lehengas and tissue drapes for the bride and her celebrations.",
    cta: { label: "Shop Bridal Sarees", to: "/wedding-sarees" },
    secondary: { label: "View Collections", to: "/collections" },
    img: HERO_SLIDE_1,
    align: "left",
    accent: "Volume I",
  },
  {
    eyebrow: "Ancestral Master Weaves",
    title: "Silk & Silk-Blend",
    italic: "Silk Archive",
    copy: "Banarasi, Kanjivaram and Paithani styles, in store across Nalasopara, Virar, Bhayandar and Goregaon.",
    cta: { label: "Shop Heritage Silks", to: "/silk-sarees" },
    secondary: { label: "Explore The Craft", to: "/our-story" },
    img: HERO_SLIDE_2,
    align: "left",
    accent: "Volume II",
  },
  {
    eyebrow: "Festive & Cocktail Edit",
    title: "Celebrate in",
    italic: "Pastels & Gold",
    copy: "Featherlight organza, fluid tissue, and modern pastel silks spun for Sangeet, Diwali, and festive soirées.",
    cta: { label: "Shop Festive Edit", to: "/festive-edit" },
    secondary: { label: "New Arrivals", to: "/new-arrivals" },
    img: HERO_SLIDE_3,
    align: "left",
    accent: "Volume III",
  },
];

function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const total = SLIDES.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStart = useRef<{ x: number; y: number; t: number } | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const lockedAxis = useRef<"x" | "y" | null>(null);

  const go = (n: number) => setIndex((n + total) % total);
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  useEffect(() => {
    if (paused || dragging) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, dragging, total]);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, t: Date.now() };
    lockedAxis.current = null;
    setDragging(true);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    if (!lockedAxis.current) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      lockedAxis.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (lockedAxis.current === "x") {
      e.preventDefault?.();
      const w = trackRef.current?.offsetWidth ?? 1;
      // resistance at edges
      let clamped = dx;
      if ((index === 0 && dx > 0) || (index === total - 1 && dx < 0)) {
        clamped = dx * 0.35;
      }
      setDragX(Math.max(-w, Math.min(w, clamped)));
    }
  };
  const onTouchEnd = () => {
    if (!touchStart.current) return;
    const w = trackRef.current?.offsetWidth ?? 1;
    const dt = Math.max(1, Date.now() - touchStart.current.t);
    const velocity = dragX / dt; // px per ms
    const threshold = w * 0.2;
    if (lockedAxis.current === "x" && (Math.abs(dragX) > threshold || Math.abs(velocity) > 0.5)) {
      if (dragX < 0) next();
      else prev();
    }
    setDragX(0);
    setDragging(false);
    touchStart.current = null;
    lockedAxis.current = null;
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-ivory"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      {/*
        The page's single H1. The carousel headings rotate, so they cannot serve
        as the H1 — this states the page subject once, stably, for crawlers and
        screen readers. Visually hidden because the hero is a full-bleed image
        with no room for it; the text is accurate and matches the page content.
      */}
      <h1 className="sr-only">
        Mumbai Bazar — Sarees, Lehengas &amp; Bridal Wear across 8 stores in Nalasopara,
        Virar, Vasai, Bhayandar and Goregaon
      </h1>
      <div
        ref={trackRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        style={{ touchAction: "pan-y" }}
        className="relative h-[calc(100svh-100px)] min-h-[520px] w-full select-none overflow-hidden md:h-[calc(100svh-145px)] md:min-h-[560px]"
      >
        {SLIDES.map((s, i) => {
          const active = i === index;
          const isRight = s.align === "right";
          const isCenter = s.align === "center";
          const positionCls = isCenter
            ? "md:left-1/2 md:-translate-x-1/2 md:items-center md:text-center"
            : isRight
              ? "md:left-auto md:right-8 lg:right-16 xl:right-24 md:items-start md:text-left"
              : "md:left-8 lg:left-16 xl:left-24 md:right-auto md:items-start md:text-left";
          const overlayCls = isRight
            ? "md:bg-gradient-to-l md:from-black/60 md:via-black/25 md:to-transparent"
            : isCenter
              ? "md:bg-gradient-to-t md:from-black/60 md:via-black/30 md:to-black/30"
              : "md:bg-gradient-to-r md:from-black/60 md:via-black/25 md:to-transparent";
          let delta = i - index;
          if (delta > total / 2) delta -= total;
          if (delta < -total / 2) delta += total;
          const isNeighbor = Math.abs(delta) <= 1;
          const showDuringDrag = dragging && isNeighbor;
          return (
            <div
              key={i}
              style={{
                transform: `translate3d(calc(${delta * 100}% + ${dragX}px), 0, 0)`,
                transition: dragging
                  ? "none"
                  : "transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 900ms ease-out",
              }}
              className={`absolute inset-0 will-change-transform ${
                active || showDuringDrag ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!active}
            >
              <picture className="absolute inset-0 h-full w-full">
                {/*
                  Order matters: the browser takes the first <source> it both
                  matches and supports. Portrait crops for phones first, then
                  landscape, each offered as AVIF then WebP. The <img> src is the
                  WebP landscape, which is the universal fallback.
                */}
                <source
                  media="(max-width: 767px)"
                  type="image/avif"
                  srcSet={`${s.img}-vertical.avif`}
                />
                <source
                  media="(max-width: 767px)"
                  type="image/webp"
                  srcSet={`${s.img}-vertical.webp`}
                />
                <source type="image/avif" srcSet={`${s.img}-horizontal.avif`} />
                <source type="image/webp" srcSet={`${s.img}-horizontal.webp`} />
                <img
                  src={`${s.img}-horizontal.webp`}
                  alt={`${s.title} ${s.italic ?? ""}`.trim()}
                  width={1672}
                  height={941}
                  fetchPriority={i === 0 ? "high" : "low"}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className={`h-full w-full object-cover object-top transition-transform duration-[9000ms] ease-out ${
                    active ? "scale-105" : "scale-100"
                  }`}
                />
              </picture>
              {/* gradient overlay for legibility */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/15 ${overlayCls}`}
              />

              {/* Content */}
              <div
                className={`absolute inset-x-5 bottom-20 flex flex-col items-start text-left text-ivory sm:inset-x-8 md:inset-x-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:max-w-[560px] lg:max-w-[620px] ${positionCls}`}
              >
                <span className="flex items-center gap-3 text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-gold">
                  <span className="h-px w-10 bg-gold" />
                  {s.eyebrow}
                </span>
                <h2 className="mt-4 md:mt-6 font-serif text-3xl !text-ivory md:text-6xl lg:text-7xl xl:text-8xl leading-[0.92]">
                  {s.title}
                  {s.italic && (
                    <>
                      <br />
                      <span className="italic font-light">{s.italic}</span>
                    </>
                  )}
                </h2>
                <p className="mt-4 md:mt-6 max-w-md text-sm md:text-base lg:text-lg leading-relaxed text-ivory/85">
                  {s.copy}
                </p>
                <div className="mt-6 md:mt-10 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                  <Link
                    to={s.cta.to}
                    className="inline-flex items-center justify-center w-full sm:w-auto sm:min-w-[190px] px-8 py-3.5 bg-ivory text-maroon text-[10px] md:text-[11px] tracking-[0.25em] uppercase hover:bg-gold hover:text-ivory transition-colors duration-300"
                  >
                    {s.cta.label}
                  </Link>
                  {s.secondary && (
                    <Link
                      to={s.secondary.to}
                      className="inline-flex items-center justify-center w-full sm:w-auto sm:min-w-[190px] px-8 py-3.5 border border-ivory/70 text-ivory text-[10px] md:text-[11px] tracking-[0.25em] uppercase hover:bg-ivory hover:text-maroon transition-colors duration-300"
                    >
                      {s.secondary.label}
                    </Link>
                  )}
                </div>
              </div>

              {/* Volume tag */}
              <div className="absolute top-6 md:top-10 right-6 md:right-10 text-ivory/80">
                <span className="text-[10px] md:text-[11px] tracking-[0.35em] uppercase">
                  {s.accent}
                </span>
              </div>
            </div>
          );
        })}

        {/* Arrows */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute z-20 left-3 md:left-8 top-1/2 -translate-y-1/2 h-9 w-9 md:h-14 md:w-14 flex items-center justify-center border border-ivory/30 bg-black/20 backdrop-blur-sm text-ivory hover:bg-ivory hover:text-maroon transition-colors duration-300"
        >
          <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute z-20 right-3 md:right-8 top-1/2 -translate-y-1/2 h-9 w-9 md:h-14 md:w-14 flex items-center justify-center border border-ivory/30 bg-black/20 backdrop-blur-sm text-ivory hover:bg-ivory hover:text-maroon transition-colors duration-300"
        >
          <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
        </button>

        {/* Dots + counter */}
        <div className="absolute z-20 bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-5">
          <span className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-ivory/90 tabular-nums">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-[3px] transition-all ${
                  i === index ? "w-10 bg-ivory" : "w-5 bg-ivory/50 hover:bg-ivory/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Premium transition divider ---------------- */
function FeedDivider() {
  return (
    <section className="w-full bg-beige/20 border-y border-maroon/5">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="flex items-center gap-6 md:gap-10 py-10 md:py-14">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-maroon/25 to-transparent" />
          <div className="flex flex-col items-center gap-2.5">
            <span className="text-xs font-bold tracking-[0.18em] uppercase text-maroon">
              The Boutique
            </span>
            <div className="w-1.5 h-1.5 rotate-45 bg-gold" />
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-maroon/25 to-transparent" />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Dense Product Feed ---------------- */
type SortKey = "featured" | "newest" | "price-asc" | "price-desc";

function ProductTile({ p }: { p: Product }) {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const isSaved = wishlist.some((w) => w.id === p.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // A Product is not a CartItem — price has to be parsed to a number and the
    // display string kept separately, the same mapping ProductCard uses.
    addItem({
      id: p.id,
      name: p.name,
      price: parsePriceToNumber(p.price),
      priceLabel: p.price,
      image: p.img,
      weave: p.weave,
      shopifyVariantId: p.shopifyVariantId,
    });
  };

  return (
    <Link
      to="/products/$id"
      params={{ id: p.id }}
      className="group relative flex flex-col bg-ivory rounded-2xl border border-[#A27633]/60 shadow-sm hover:shadow-xl hover:border-[#A27633] transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5EFEB]">
        {p.tag && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-maroon/95 text-ivory text-[9px] font-bold tracking-[0.2em] uppercase shadow-md backdrop-blur-sm border border-[#A27633]/50">
            {p.tag}
          </span>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(p);
          }}
          aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
            isSaved
              ? "bg-maroon text-ivory shadow-md"
              : "bg-ivory/80 text-maroon hover:bg-maroon hover:text-ivory shadow-sm"
          }`}
        >
          <Heart className={`h-4 w-4 ${isSaved ? "fill-ivory text-ivory" : ""}`} />
        </button>

        {/* Primary Image */}
        <img
          src={p.img}
          alt={p.name}
          width={600}
          height={800}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            p.secondaryImg ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-108"
          }`}
        />

        {/* Secondary Hover Image */}
        {p.secondaryImg && (
          <img
            src={p.secondaryImg}
            alt={`${p.name} alternate view`}
            width={600}
            height={800}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover opacity-0 scale-100 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105 pointer-events-none"
          />
        )}

        <div className="absolute inset-x-3 bottom-3 z-10 opacity-100 md:opacity-0 translate-y-0 md:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2.5 rounded-xl bg-maroon text-ivory text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-wine transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Add to Bag
          </button>
        </div>
      </div>

      <div className="p-4 md:p-5 flex flex-col space-y-1.5 text-left">
        <p className="text-[10px] uppercase tracking-[0.22em] text-gold-deep font-semibold">
          {p.weave}
        </p>
        <h4 className="font-sans text-base md:text-lg font-bold leading-snug text-maroon group-hover:text-gold-deep transition-colors line-clamp-1">
          {p.name}
        </h4>
        <div className="flex items-baseline gap-2 pt-2 border-t border-[#A27633]/40 mt-1">
          <span className="font-sans text-base md:text-lg font-bold text-ink tracking-tight">
            {p.price}
          </span>
          {p.original && (
            <span className="text-xs text-taupe font-medium line-through font-sans">
              {p.original}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function ImmediateProductShelf() {
  const { products, loading } = useCatalog();
  const items = products.slice(0, 4);

  return (
    <section className="bg-ivory px-4 py-8 md:px-8 md:py-14" aria-labelledby="shop-best-sellers">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-5 flex items-end justify-between gap-4 md:mb-8">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-maroon/70">
              Made to be worn now
            </p>
            <h2 id="shop-best-sellers" className="mt-1 font-serif text-3xl text-maroon md:text-5xl">
              Shop Bestsellers
            </h2>
          </div>
          <Link
            to="/shop"
            className="shrink-0 border-b border-maroon/50 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-maroon"
          >
            View all
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 md:grid-cols-4 md:gap-x-5 md:gap-y-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-beige/60 animate-pulse" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 md:grid-cols-4 md:gap-x-5 md:gap-y-10">
            {items.map((p) => (
              <ProductTile key={p.id} p={p} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ProductFeed() {
  const { products } = useCatalog();
  const [sort, setSort] = useState<SortKey>("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [visible, setVisible] = useState(10);

  const pool = useMemo(() => {
    const indexed = products.map((p, i) => ({ ...p, _k: `${p.id}-${i}` }));
    const sorted = [...indexed];
    if (sort === "price-asc")
      sorted.sort((a, b) => parsePriceToNumber(a.price) - parsePriceToNumber(b.price));
    else if (sort === "price-desc")
      sorted.sort((a, b) => parsePriceToNumber(b.price) - parsePriceToNumber(a.price));
    else if (sort === "newest")
      sorted.sort((a, b) => (a.tag === "New" ? -1 : 1) - (b.tag === "New" ? -1 : 1));
    return sorted;
  }, [sort, products]);

  const sortLabel: Record<SortKey, string> = {
    featured: "Featured",
    newest: "Newest",
    "price-asc": "Price: Low to High",
    "price-desc": "Price: High to Low",
  };

  return (
    <section className="mx-auto max-w-[1600px] px-4 md:px-8 py-16 md:py-20">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8 md:mb-10 border-b border-maroon/40 pb-6">
        <div>
          <h3 className="font-serif text-3xl md:text-4xl text-maroon">Ready to Ship</h3>
          <p className="text-[11px] uppercase tracking-wider text-maroon/60 mt-1">
            {pool.length} pieces available
          </p>
        </div>
        <div className="flex gap-6 md:gap-8 text-[11px] uppercase tracking-widest text-maroon">
          <Link to="/shop" className="flex items-center gap-2 hover:opacity-60">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
          </Link>
          <div className="relative">
            <button
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-2 hover:opacity-60"
            >
              Sort: {sortLabel[sort]} <ChevronDown className="h-3 w-3" />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-2 z-20 bg-ivory border border-maroon/40 shadow-lg min-w-[200px] max-w-[240px]">
                {(Object.keys(sortLabel) as SortKey[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => {
                      setSort(k);
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-[10px] tracking-widest uppercase hover:bg-maroon/5 ${sort === k ? "text-maroon font-medium" : "text-maroon/70"}`}
                  >
                    {sortLabel[k]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-3 md:gap-x-4 gap-y-10 md:gap-y-16">
        {pool.slice(0, visible).map((p) => (
          <ProductTile key={p._k} p={p} />
        ))}
      </div>

      <div className="mt-16 md:mt-20 text-center">
        {visible < pool.length ? (
          <button
            onClick={() => setVisible((v) => v + 10)}
            className="px-12 md:px-16 py-4 border border-maroon text-[11px] tracking-widest uppercase text-maroon hover:bg-maroon hover:text-ivory transition-all"
          >
            Load More Products
          </button>
        ) : (
          <Link
            to="/shop"
            className="inline-block px-12 md:px-16 py-4 border border-maroon text-[11px] tracking-widest uppercase text-maroon hover:bg-maroon hover:text-ivory transition-all"
          >
            View Full Boutique
          </Link>
        )}
      </div>
    </section>
  );
}

/* ---------------- Shop by Collection strip (Shop by Weave) ---------------- */
function CollectionStrip() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 md:px-8 py-16 md:py-24">
      <div className="text-center mb-12 md:mb-16">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-maroon/40 bg-maroon/5 text-xs md:text-[13px] tracking-[0.16em] uppercase text-maroon font-bold mb-3">
          Heritage Loom Clusters
        </span>
        <h3 className="font-serif text-3xl md:text-5xl lg:text-6xl text-maroon">Shop by Weave</h3>
        <div className="w-16 h-0.5 bg-gold/60 mx-auto mt-4 mb-3" />
        <p className="text-sm md:text-base text-ink/85 font-medium max-w-xl mx-auto">
          Handpicked weaves from India's legendary artisan clusters — Banarasi, Kanjivaram, Paithani
          & Pure Silks.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {COLLECTIONS.map((c, i) => (
          <Link
            key={c.slug}
            to="/collections"
            className={`group block relative aspect-[4/5] overflow-hidden rounded-2xl border border-gold/50 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_-15px_rgba(100,31,42,0.3)] bg-beige/30 ${
              i === 0 ? "sm:col-span-2 lg:col-span-1" : ""
            }`}
          >
            <img
              src={c.img}
              alt={c.name}
              width={800}
              height={1000}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />
            {/* Multi-stage dark gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 via-50% to-transparent opacity-85 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Card Content */}
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-ivory flex flex-col justify-end">
              <span className="text-xs uppercase tracking-[0.16em] text-amber-300 font-bold mb-1 drop-shadow-sm">
                Authentic Loom
              </span>
              <p className="font-serif text-3xl md:text-4xl font-normal drop-shadow-md leading-tight">
                {c.name}
              </p>
              <p className="text-xs uppercase tracking-widest text-ivory/85 mt-2 line-clamp-1 font-medium">
                {c.tagline}
              </p>

              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ivory/20 backdrop-blur-md text-[10px] tracking-widest uppercase text-ivory border border-ivory/30">
                  Explore Weave →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}



/* ---------------- Trust / USP bar ---------------- */
function TrustBar() {
  const items = [
    { icon: Truck, title: "Complimentary Shipping", copy: "On all India orders above ₹5,000" },
    { icon: ShieldCheck, title: "See Before You Buy", copy: "Drape any piece in store first" },
    { icon: Sparkles, title: "Open Every Day", copy: "10 AM – 9 PM, all seven days" },
    { icon: ShoppingBag, title: "Easy 7-Day Returns", copy: "No-questions exchange policy" },
  ];
  return (
    <section className="w-full bg-ivory border-y border-maroon/40">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-6 md:py-10 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-5 md:gap-8 divide-maroon/10">
        {items.map(({ icon: Icon, title, copy }) => (
          <div key={title} className="flex items-center gap-3 md:gap-4 md:flex-row">
            <div className="h-9 w-9 md:h-11 md:w-11 flex items-center justify-center border border-maroon/40 text-maroon shrink-0">
              <Icon className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs tracking-[0.18em] md:tracking-[0.2em] uppercase text-maroon leading-tight">
                {title}
              </p>
              <p className="hidden sm:block text-[11px] md:text-xs text-maroon/60 mt-1">{copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Shop by Occasion ---------------- */
const OCCASIONS: { label: string; sub: string; to: string; img: string }[] = [
  { label: "Bridal", sub: "The Sacred Day", to: "/wedding-sarees", img: IMG.colWedding },
  { label: "Festive", sub: "Diwali & Beyond", to: "/festive-edit", img: IMG.colFestive },
  { label: "Reception", sub: "Statement Silks", to: "/silk-sarees", img: IMG.colBanarasi },
  { label: "Everyday", sub: "Effortless Grace", to: "/everyday-sarees", img: IMG.colPuresilk },
  { label: "Office", sub: "Refined Drapes", to: "/everyday-sarees", img: IMG.look2 },
  { label: "Party", sub: "Evening Shimmer", to: "/festive-edit", img: IMG.colKanjivaram },
];

function ShopByOccasion() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 md:px-8 py-16 md:py-24">
      <div className="text-center mb-12 md:mb-16">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-maroon/40 bg-maroon/5 text-xs md:text-[13px] tracking-[0.16em] uppercase text-maroon font-bold mb-3">
          The Boutique Collection
        </span>
        <h3 className="font-serif text-3xl md:text-5xl lg:text-6xl text-maroon">
          Shop by Occasion
        </h3>
        <div className="w-16 h-0.5 bg-gold/60 mx-auto mt-4 mb-3" />
        <p className="text-sm md:text-base text-ink/85 font-medium max-w-xl mx-auto">
          A drape for every moment — from sacred bridal vows to everyday grace.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {OCCASIONS.map((o) => (
          <Link
            key={o.label}
            to={o.to}
            className="group block relative aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl border border-gold/50 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_-15px_rgba(100,31,42,0.3)] bg-beige/40"
          >
            <img
              src={o.img}
              alt={o.label}
              width={600}
              height={750}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />
            {/* Multi-stage dark gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 via-50% to-transparent opacity-85 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5 md:p-8 text-ivory flex flex-col justify-end">
              <p className="text-[11px] sm:text-xs tracking-[0.16em] uppercase text-amber-300 font-bold drop-shadow-sm">
                {o.sub}
              </p>
              <p className="font-serif text-xl sm:text-2xl md:text-4xl mt-0.5 sm:mt-1 font-normal drop-shadow-md leading-tight">
                {o.label}
              </p>
              <div className="hidden md:block mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ivory/20 backdrop-blur-md text-[10px] tracking-widest uppercase text-ivory border border-ivory/30">
                  Explore Collection →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Trending Now (horizontal scroll with navigation buttons) ---------------- */
function TrendingNow() {
  const { products } = useCatalog();
  const items = products.slice(0, 8);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const firstCard = scrollRef.current.querySelector("a");
      const gap = typeof window !== "undefined" && window.innerWidth >= 768 ? 24 : 16;
      const cardWidth = firstCard ? firstCard.clientWidth + gap : 320;
      const amount = direction === "left" ? -cardWidth : cardWidth;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-beige/25 border-y border-maroon/40 py-16 md:py-24">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-maroon/40 bg-maroon/5 text-xs md:text-[13px] tracking-[0.16em] uppercase text-maroon font-bold mb-2">
              Loved This Week
            </span>
            <h3 className="font-serif text-3xl md:text-5xl text-maroon">Trending Now</h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="h-10 w-10 rounded-full border border-maroon/30 text-maroon hover:bg-maroon hover:text-ivory transition-colors flex items-center justify-center shadow-sm"
              aria-label="Previous trending products"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="h-10 w-10 rounded-full border border-maroon/30 text-maroon hover:bg-maroon hover:text-ivory transition-colors flex items-center justify-center shadow-sm"
              aria-label="Next trending products"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <Link
              to="/shop"
              className="hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-maroon/40 text-[11px] tracking-[0.2em] uppercase text-maroon hover:bg-maroon hover:text-ivory transition-all duration-300 ml-2"
            >
              View All →
            </Link>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide scroll-smooth"
          style={{ touchAction: "pan-x" }}
        >
          {items.map((p, i) => (
            <Link
              key={p.id}
              to="/products/$id"
              params={{ id: p.id }}
              className="group snap-center sm:snap-start shrink-0 w-full sm:w-[calc((100%-1.5rem)/2)] md:w-[calc((100%-3rem)/3)] lg:w-[calc((100%-4.5rem)/4)] flex flex-col bg-ivory rounded-2xl border border-gold/45 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-beige/30">
                <div className="absolute top-3 left-3 z-10 h-7 w-7 rounded-full flex items-center justify-center bg-maroon text-ivory text-[10px] font-bold shadow-md border border-gold/40">
                  {i + 1}
                </div>
                {/* Primary Image */}
                <img
                  src={p.img}
                  alt={p.name}
                  width={600}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                    p.secondaryImg
                      ? "group-hover:opacity-0 group-hover:scale-105"
                      : "group-hover:scale-108"
                  }`}
                />

                {/* Secondary Hover Image */}
                {p.secondaryImg && (
                  <img
                    src={p.secondaryImg}
                    alt={`${p.name} alternate view`}
                    width={600}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover opacity-0 scale-100 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105 pointer-events-none"
                  />
                )}
              </div>

              <div className="p-3.5 md:p-4 flex flex-col space-y-1.5 text-left">
                <p className="text-[10px] uppercase tracking-[0.2em] text-maroon font-bold">
                  {p.weave}
                </p>
                <h4 className="font-sans text-sm md:text-base font-bold leading-snug text-maroon group-hover:text-gold-deep transition-colors line-clamp-1">
                  {p.name}
                </h4>
                <div className="flex items-baseline gap-2 pt-2 border-t border-gold/45 mt-1">
                  <span className="font-sans text-lg sm:text-xl md:text-2xl font-bold text-maroon tracking-tight">{p.price}</span>
                  {p.original && (
                    <span className="text-xs sm:text-sm text-taupe font-medium line-through font-sans">{p.original}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Editorial Split ---------------- */
function EditorialSplit() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 md:px-8 py-16 md:py-20 grid md:grid-cols-2 gap-4 md:gap-6">
      <Link
        to="/wedding-sarees"
        className="group relative block aspect-[4/5] md:aspect-[4/5] overflow-hidden rounded-2xl border border-gold/50 shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl"
      >
        <img
          src={IMG.colWedding}
          alt="Bridal Trousseau"
          width={800}
          height={1000}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 via-55% to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 text-ivory">
          <span className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-gold/90 font-medium">
            Bridal Trousseau
          </span>
          <h3 className="mt-3 font-serif text-3xl md:text-5xl leading-tight drop-shadow-sm">
            The <span className="italic">Wedding</span>
            <br />
            Collection
          </h3>
          <p className="mt-3 max-w-sm text-sm text-ivory/85">
            Kanjivaram, Paithani & Tissue heirlooms for the most sacred day.
          </p>
          <span className="mt-5 inline-block text-[10px] md:text-[11px] tracking-[0.3em] uppercase border-b border-ivory/60 pb-1">
            Discover →
          </span>
        </div>
      </Link>
      <div className="grid gap-4 md:gap-6">
        <Link
          to="/new-arrivals"
          className="group relative block aspect-[16/9] md:aspect-auto md:h-full overflow-hidden rounded-2xl border border-gold/50 shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl"
        >
          <img
            src={IMG.look1}
            alt="New Arrivals"
            width={800}
            height={500}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/30 via-55% to-transparent" />
          <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-6 md:p-10 text-ivory max-w-xs">
            <span className="text-[10px] tracking-[0.4em] uppercase text-gold/90 font-medium">
              Just In
            </span>
            <h3 className="mt-2 font-serif text-2xl md:text-4xl leading-tight drop-shadow-sm">
              New <span className="italic">Arrivals</span>
            </h3>
            <span className="mt-3 text-[10px] tracking-[0.3em] uppercase border-b border-ivory/60 pb-1 self-start">
              Shop new →
            </span>
          </div>
        </Link>
        <Link
          to="/festive-edit"
          className="group relative block aspect-[16/9] md:aspect-auto md:h-full overflow-hidden rounded-2xl border border-gold/50 shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl"
        >
          <img
            src={IMG.colFestive}
            alt="Festive Edit"
            width={800}
            height={500}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/30 via-55% to-transparent" />
          <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-6 md:p-10 text-ivory max-w-xs">
            <span className="text-[10px] tracking-[0.4em] uppercase text-gold/90 font-medium">
              Silk & Gold
            </span>
            <h3 className="mt-2 font-serif text-2xl md:text-4xl leading-tight drop-shadow-sm">
              Festive <span className="italic">Edit</span>
            </h3>
            <span className="mt-3 text-[10px] tracking-[0.3em] uppercase border-b border-ivory/60 pb-1 self-start">
              Shop festive →
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

/* ---------------- Bestsellers ---------------- */
function Bestsellers() {
  const { products } = useCatalog();
  const items = products.slice(0, 4);
  return (
    <section className="mx-auto max-w-[1600px] px-4 md:px-8 py-16 md:py-20">
      <div className="flex items-end justify-between mb-8 md:mb-10 border-b border-maroon/40 pb-6">
        <div>
          <span className="text-[10px] tracking-[0.4em] uppercase text-maroon/60">
            Signature Silks
          </span>
          <h3 className="mt-2 font-serif text-3xl md:text-4xl lg:text-5xl text-maroon">
            Bestsellers
          </h3>
        </div>
        <Link
          to="/shop"
          className="text-[10px] tracking-widest uppercase text-maroon border-b border-maroon/40 pb-1 hover:opacity-60"
        >
          Shop all
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 md:gap-x-4 gap-y-10">
        {items.map((p) => (
          <ProductTile key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */
function Testimonials() {
  const reviews = [
    {
      name: "Aanya Kapoor",
      city: "Mumbai",
      img: TESTIMONIAL_IMGS.t1,
      quote:
        "My Meher Wine Banarasi felt like an heirloom the moment I opened the box. The zari work is beyond anything I've seen.",
    },
    {
      name: "Priya Menon",
      city: "Bengaluru",
      img: TESTIMONIAL_IMGS.t2,
      quote:
        "Wore my Kanjivaram for our wedding reception — every guest asked where it was from. Truly museum-grade craftsmanship.",
    },
    {
      name: "Ishita Rao",
      city: "Hyderabad",
      img: TESTIMONIAL_IMGS.t3,
      quote:
        "The tissue silk drapes like a dream. Mumbai Bazar has become my go-to for every festive occasion.",
    },
  ];

  return (
    <section className="w-full bg-beige/25 py-16 md:py-24 border-y border-gold/50">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-maroon/40 bg-maroon/5 text-xs md:text-[13px] tracking-[0.16em] uppercase text-maroon font-bold mb-3">
            Loved By Our Patrons
          </span>
          <h3 className="font-serif text-3xl md:text-5xl text-maroon">Words from Our Women</h3>
          <div className="w-16 h-0.5 bg-gold/60 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="bg-ivory rounded-2xl p-8 md:p-10 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-base md:text-lg leading-relaxed text-ink/90 italic font-serif">
                  "{r.quote}"
                </p>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <img
                  src={r.img}
                  alt={r.name}
                  className="h-12 w-12 rounded-full object-cover shadow-sm border border-gold/50"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm text-maroon font-medium font-serif">{r.name}</p>
                  <p className="text-[10px] tracking-widest uppercase text-maroon/60 font-medium">
                    {r.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Instagram Lookbook ---------------- */
const INSTAGRAM_POSTS = [
  {
    id: "reel-1",
    type: "reel" as const,
    views: "18.4K",
    likes: "231",
    title: "Trending Pastel Striped Saree Draping",
    tag: "Most Viral",
    href: "https://www.instagram.com/mumbai__bazar__nalasopara/reel/DcpqIcIsMzP/",
    img: "/instagram/reel_1_viral_saree.jpg",
  },
  {
    id: "reel-2",
    type: "reel" as const,
    views: "9.2K",
    likes: "91",
    title: "Tested Zari Bridal Saree Unboxing",
    tag: "Bridal Edit",
    href: "https://www.instagram.com/mumbai__bazar__nalasopara/reel/DcsO6clRZYC/",
    img: "/instagram/reel_2_trending_nalasopara.jpg",
  },
  {
    id: "reel-3",
    type: "reel" as const,
    views: "7.8K",
    likes: "61",
    title: "Live from Nalasopara East Boutique",
    tag: "Boutique Tour",
    href: "https://www.instagram.com/mumbai__bazar__nalasopara/reel/DcqiMflsz__/",
    img: "/instagram/reel_3_trending_shop.jpg",
  },
  {
    id: "reel-4",
    type: "reel" as const,
    views: "6.5K",
    likes: "48",
    title: "Festive Drapes & Designer Silks",
    tag: "Festive Edit",
    href: "https://www.instagram.com/mumbai__bazar__nalasopara/reel/Dcb8SQoNeDN/",
    img: "/instagram/reel_4_rakhi_special.jpg",
  },
  {
    id: "reel-5",
    type: "reel" as const,
    views: "5.9K",
    likes: "43",
    title: "Red Zari Dulhan Drape Showcase",
    tag: "Wedding",
    href: "https://www.instagram.com/mumbai__bazar__nalasopara/reel/DcdhObltQ8l/",
    img: "/instagram/reel_5_viral_saree_shop.jpg",
  },
  {
    id: "post-6",
    type: "post" as const,
    views: "4.1K",
    likes: "56",
    title: "Bridal Collection & New Varieties",
    tag: "New Arrivals",
    href: "https://www.instagram.com/mumbai__bazar__nalasopara/",
    img: "/instagram/post_6_collection_look.webp",
  },
];

function InstagramGrid() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 md:px-8 py-16 md:py-24 border-t border-maroon/10">
      <div className="text-center mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 rounded-full bg-maroon/5 border border-maroon/15 px-4 py-1.5 text-xs text-maroon font-semibold tracking-wide mb-3">
          <Instagram className="h-3.5 w-3.5 text-maroon" />
          <span>@mumbai__bazar__nalasopara · 19K+ Community</span>
        </div>
        <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-maroon font-semibold">
          Trending Reels &amp; Boutique Diaries
        </h3>
        <p className="mt-3 text-sm md:text-base text-ink/75 max-w-2xl mx-auto">
          Watch our viral saree draping sessions, bridal unboxings, and fresh stock arrivals straight from our flagship Nalasopara boutique.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {INSTAGRAM_POSTS.map((item) => (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="group relative block aspect-[9/16] sm:aspect-[3/4] lg:aspect-[9/16] overflow-hidden rounded-xl bg-beige/30 border border-maroon/15 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <img
              src={item.img}
              alt={item.title}
              width={400}
              height={700}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Gradient Shadow Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 group-hover:from-black/90 transition-opacity" />

            {/* Top Pill Tag */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
              <span className="bg-maroon/90 backdrop-blur-md text-ivory text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md shadow-sm border border-gold/30">
                {item.tag}
              </span>
              <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md text-ivory text-[10px] font-medium px-2 py-0.5 rounded-full">
                <Heart className="h-3 w-3 text-red-500 fill-red-500" />
                {item.likes}
              </span>
            </div>

            {/* Center Play Icon on Hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all pointer-events-none">
              <div className="w-11 h-11 rounded-full bg-maroon/90 border border-gold/60 flex items-center justify-center shadow-lg text-ivory">
                <Play className="h-5 w-5 fill-ivory ml-0.5" />
              </div>
            </div>

            {/* Bottom Caption & Stats */}
            <div className="absolute bottom-0 inset-x-0 p-3 text-ivory pointer-events-none">
              <p className="text-xs font-semibold leading-snug line-clamp-2 drop-shadow-sm text-white/95">
                {item.title}
              </p>
              <div className="mt-2 flex items-center justify-between text-[10px] text-white/80 font-medium border-t border-white/20 pt-1.5">
                <span className="flex items-center gap-1">
                  <Instagram className="h-3 w-3 text-gold" />
                  Watch Reel
                </span>
                <span>{item.views} views</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a
          href="https://www.instagram.com/mumbai__bazar__nalasopara/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2.5 rounded-full bg-maroon text-ivory px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] shadow-md hover:bg-maroon/90 hover:scale-[1.02] transition-all"
        >
          <Instagram className="h-4 w-4 text-gold" />
          Follow @mumbai__bazar__nalasopara on Instagram
        </a>
      </div>
    </section>
  );
}

/* ---------------- Newsletter ---------------- */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section className="w-full bg-maroon text-ivory py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 md:px-8 text-center">
        <span className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-ivory/60">
          The Atelier Letter
        </span>
        <h3 className="mt-4 font-serif text-3xl md:text-5xl leading-tight">
          Be the first to <span className="italic">know</span>
        </h3>
        <p className="mt-4 text-sm md:text-base text-ivory/75 max-w-xl mx-auto">
          Early access to new arrivals, bridal previews and private atelier events. Plus a heartfelt
          ₹1,000 off your first heirloom.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email) setDone(true);
          }}
          className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 bg-transparent border border-ivory/40 px-5 py-3.5 text-sm text-ivory placeholder:text-ivory/50 focus:outline-none focus:border-ivory transition-colors"
          />
          <button
            type="submit"
            className="px-8 py-3.5 bg-ivory text-maroon text-[10px] md:text-[11px] tracking-[0.3em] uppercase hover:bg-gold hover:text-ivory transition-colors"
          >
            {done ? "Subscribed ✓" : "Subscribe"}
          </button>
        </form>
        <p className="mt-4 text-[10px] tracking-widest uppercase text-ivory/50">
          No spam, only silk stories.
        </p>
      </div>
    </section>
  );
}

/* ---------------- Page ---------------- */
function Home() {
  return (
    <div className="bg-ivory text-ink">
      <HeroCarousel />
      <TrustBar />
      <ImmediateProductShelf />
      <TrendingNow />
      <ProductFeed />
      <TrousseauBuilder />
      <Bestsellers />
      <ShopByOccasion />
      <CollectionStrip />
      <Testimonials />
      <InstagramGrid />
      <Newsletter />
    </div>
  );
}
