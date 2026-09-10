import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Check,
  Clock,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Instagram,
  Star,
  Quote,
  Heart,
  Play,
  MapPin,
  RotateCcw,
  Headphones,
} from "lucide-react";

import { IMG, COLLECTIONS, LOOKS, TESTIMONIAL_IMGS, type Product } from "@/lib/site-data";
import { seo, jsonLd, SITE } from "@/lib/seo";
import { shopifyImage, shopifyImageSrcSet } from "@/lib/shopify";
import { breadcrumbSchema, outletSchema } from "@/lib/structured-data";
import { FLAGSHIP } from "@/lib/locations";
import { useCart, parsePriceToNumber } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useCatalog } from "@/lib/catalog-context";
import { ProductCard } from "@/components/site/ProductCard";

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
      // The brand leads, deliberately.
      //
      // Search Console (30 Aug - 6 Sep 2026): the homepage took 726 of 799
      // impressions at position 2.73, but only a 2.07% CTR. Roughly 442 of
      // those impressions were people typing the brand name -- they already
      // know who we are and are looking for the official site, so the previous
      // title ("Saree & Bridal Wear Shops in Nalasopara | Mumbai Bazar") made
      // them scan to the end of the line to confirm they had found us, and many
      // clicked a directory listing instead. Brand first, then the belt name
      // people actually search ("Vasai Virar"), then the proof of scale.
      title: "Mumbai Bazar — Saree Shops in Vasai Virar, Nalasopara & Mumbai",
      description: `Sarees from ₹800, designer lehengas, dulhan wear and dress material at 8 Mumbai Bazar stores across Nalasopara, Virar, Vasai, Bhayandar and Goregaon. ${SITE.hours.shortDaily}.`,
      path: "/",
      keywords: [
        "mumbai bazar",
        "saree shop near me",
        "saree shop in vasai virar",
        "best saree shop in vasai virar",
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
      scripts: [
        jsonLd(breadcrumbSchema([{ name: "Home", path: "/" }])),
        // The flagship storefront entity lives here rather than sitewide, so
        // there is exactly one ClothingStore node per physical shop.
        jsonLd(outletSchema(FLAGSHIP)),
      ],
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
    copy: "Dulhan sarees, designer lehengas and party wear for the bride and her family.",
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
        Mumbai Bazar — Sarees, Lehengas &amp; Bridal Wear across 8 stores in Nalasopara, Virar,
        Vasai, Bhayandar and Goregaon
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
  return <ProductCard p={p} />;
}

/* ---------------- Shop By Category (First Section) ---------------- */
const CATEGORIES = [
  {
    label: "BRIDAL SAREES",
    to: "/wedding-sarees",
    img: IMG.colWedding,
  },
  {
    label: "LEHENGAS",
    to: "/wedding-sarees",
    img: IMG.colFestive,
  },
  {
    label: "DRESSES",
    to: "/festive-edit",
    img: IMG.look3,
  },
  {
    label: "SAREES",
    to: "/silk-sarees",
    img: IMG.colBanarasi,
  },
];

function ShopByCategory() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 md:px-8 py-10 md:py-16">
      <div className="text-center mb-8 md:mb-12">
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          <div className="h-px bg-gold/60 flex-1 max-w-[60px] sm:max-w-[120px] md:max-w-[180px]" />
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.18em] uppercase text-maroon text-center whitespace-nowrap">
            Shop By Category
          </h2>
          <div className="h-px bg-gold/60 flex-1 max-w-[60px] sm:max-w-[120px] md:max-w-[180px]" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5 md:gap-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.label}
            to={cat.to}
            className="group flex flex-col rounded-2xl overflow-hidden border border-[#D4AF37]/50 bg-[#FAF7F2] shadow-sm hover:shadow-xl hover:border-maroon transition-all duration-300"
          >
            <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden bg-[#F0E9DC]">
              <img
                src={cat.img}
                alt={cat.label}
                width={600}
                height={800}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
              />
            </div>
            <div className="py-3 sm:py-3.5 px-3 sm:px-4 bg-[#FAF7F2] border-t border-[#D4AF37]/30 flex items-center justify-center text-center">
              <span className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.16em] text-maroon group-hover:text-gold-deep transition-colors inline-flex items-center gap-1.5">
                {cat.label}{" "}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ImmediateProductShelf() {
  const { products, loading } = useCatalog();
  const items = products.slice(0, 4);

  return (
    <section className="bg-ivory px-4 py-10 md:px-8 md:py-16" aria-labelledby="shop-new-arrivals">
      <div className="mx-auto max-w-[1600px]">
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            <div className="h-px bg-gold/60 flex-1 max-w-[60px] sm:max-w-[120px] md:max-w-[180px]" />
            <h2
              id="shop-new-arrivals"
              className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.18em] uppercase text-maroon text-center whitespace-nowrap"
            >
              New Arrivals
            </h2>
            <div className="h-px bg-gold/60 flex-1 max-w-[60px] sm:max-w-[120px] md:max-w-[180px]" />
          </div>
          <p className="mt-2 text-xs sm:text-sm md:text-base text-ink/75 font-medium max-w-xl mx-auto">
            Fresh designs. Just for you.
          </p>
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

        <div className="mt-10 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-maroon/40 text-[11px] font-bold uppercase tracking-[0.2em] text-maroon hover:bg-maroon hover:text-ivory transition-all shadow-sm"
          >
            Explore All New Arrivals →
          </Link>
        </div>
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
      <div className="text-center mb-8 md:mb-12">
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          <div className="h-px bg-gold/60 flex-1 max-w-[60px] sm:max-w-[120px] md:max-w-[180px]" />
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.18em] uppercase text-maroon text-center whitespace-nowrap">
            Ready to Ship
          </h2>
          <div className="h-px bg-gold/60 flex-1 max-w-[60px] sm:max-w-[120px] md:max-w-[180px]" />
        </div>
        <p className="mt-2 text-xs sm:text-sm md:text-base text-ink/75 font-medium max-w-xl mx-auto">
          In stock and ready to ship across India ({pool.length} pieces)
        </p>
      </div>

      <div className="flex justify-center items-center gap-6 md:gap-8 text-[11px] uppercase tracking-widest text-maroon mb-8 md:mb-12 border-y border-maroon/20 py-3.5">
        <Link to="/shop" className="flex items-center gap-2 hover:opacity-60 font-bold">
          <SlidersHorizontal className="h-3.5 w-3.5" /> Filter Collection
        </Link>
        <span className="text-maroon/30">|</span>
        <div className="relative">
          <button
            onClick={() => setSortOpen((v) => !v)}
            className="flex items-center gap-2 hover:opacity-60 font-bold"
          >
            Sort: {sortLabel[sort]} <ChevronDown className="h-3 w-3" />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-full mt-2 z-20 bg-ivory border border-maroon/40 shadow-lg min-w-[200px] max-w-[240px] rounded-xl overflow-hidden">
              {(Object.keys(sortLabel) as SortKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => {
                    setSort(k);
                    setSortOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-[10px] tracking-widest uppercase hover:bg-maroon/5 ${sort === k ? "text-maroon font-bold bg-maroon/5" : "text-maroon/70"}`}
                >
                  {sortLabel[k]}
                </button>
              ))}
            </div>
          )}
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
            className="px-12 md:px-16 py-4 rounded-full border border-maroon text-[11px] font-bold tracking-widest uppercase text-maroon hover:bg-maroon hover:text-ivory transition-all shadow-sm"
          >
            Load More Products
          </button>
        ) : (
          <Link
            to="/shop"
            className="inline-block px-12 md:px-16 py-4 rounded-full border border-maroon text-[11px] font-bold tracking-widest uppercase text-maroon hover:bg-maroon hover:text-ivory transition-all shadow-sm"
          >
            View Full Boutique
          </Link>
        )}
      </div>
    </section>
  );
}

/* ---------------- Store Visit Banner (Flagship Boutique) ---------------- */
function StoreVisitBanner() {
  return (
    <section
      className="mx-auto max-w-[1600px] px-4 md:px-8 py-8 md:py-14"
      aria-label="Visit Our Flagship Boutique"
    >
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-[#D4AF37]/50 bg-[#FAF7F2] shadow-sm flex flex-col md:flex-row items-stretch">
        {/* Left: Real Storefront Facade */}
        <div className="w-full md:w-[42%] lg:w-[38%] min-h-[200px] sm:min-h-[240px] md:min-h-[280px] relative overflow-hidden bg-[#2A080C] shrink-0">
          <img
            src="/storefront.webp"
            alt="Mumbai Bazar Sarees, Lehengas and Dresses Storefront in Nalasopara East"
            width={800}
            height={500}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
          />
        </div>

        {/* Center: Boutique Details & Directions */}
        <div className="flex-1 px-6 sm:px-8 lg:px-10 py-6 md:py-8 flex flex-col justify-center bg-[#FAF7F2]">
          <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase font-bold text-ink/60">
            VISIT OUR STORE
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black tracking-[0.06em] uppercase text-[#A6192E] mt-1">
            MUMBAI BAZAR
          </h2>
          <p className="mt-1 text-xs sm:text-sm font-semibold text-ink/85">
            Nalasopara East's destination for Sarees &amp; Lehengas
          </p>

          <div className="mt-3.5 flex items-start gap-2 text-ink/75">
            <MapPin className="h-4 w-4 text-[#A6192E] shrink-0 mt-0.5" />
            <span className="text-xs sm:text-sm font-medium leading-relaxed">
              Tiwari Nagar, Shop No. 1, Near Flyover Bridge, Nalasopara East
            </span>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <Link
              to="/stores/$slug"
              params={{ slug: "nalasopara" }}
              className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-[#A6192E] hover:bg-[#851424] text-ivory text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] rounded shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              VISIT STORE →
            </Link>
          </div>
        </div>

        {/* Right: Style Tradition Elegance + Bride Model */}
        <div className="hidden lg:flex items-stretch shrink-0 relative bg-[#FAF7F2] border-l border-[#D4AF37]/35 pl-6 pr-4">
          <div className="flex items-center gap-4">
            <div className="text-center flex flex-col items-center justify-center pr-2">
              <p className="font-serif italic text-xl lg:text-2xl text-[#B8860B] font-medium leading-relaxed">
                Style
                <br />
                <span className="text-[10px] not-italic text-[#B8860B]/60">·</span>
                <br />
                Tradition
                <br />
                <span className="text-[10px] not-italic text-[#B8860B]/60">·</span>
                <br />
                Elegance
              </p>
              <div className="mt-2 flex items-center justify-center gap-1 text-[#B8860B]/70">
                <span className="h-px w-4 bg-[#B8860B]/40" />
                <span className="text-[10px]">❧</span>
                <span className="h-px w-4 bg-[#B8860B]/40" />
              </div>
            </div>

            <div className="w-24 xl:w-28 h-full relative overflow-hidden shrink-0 flex items-end">
              <img
                src="/bridal-banner-model.webp"
                alt="Bridal Saree and Lehenga Collection at Mumbai Bazar"
                width={300}
                height={450}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Shop by Collection strip (Shop by Weave Auto Carousel) ---------------- */
function CollectionStrip() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getCardMetrics = () => {
    if (!scrollRef.current) return { cardWidth: 340, gap: 16 };
    const container = scrollRef.current;
    const firstCard = container.querySelector("a");
    const gap = typeof window !== "undefined" && window.innerWidth >= 768 ? 24 : 16;
    const cardWidth = firstCard ? firstCard.clientWidth + gap : 340;
    return { cardWidth, gap };
  };

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      const { cardWidth } = getCardMetrics();
      scrollRef.current.scrollTo({ left: index * cardWidth, behavior: "smooth" });
      setActiveIndex(index);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const { cardWidth } = getCardMetrics();
      const amount = direction === "left" ? -cardWidth : cardWidth;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (direction === "right" && container.scrollLeft >= maxScroll - 15) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else if (direction === "left" && container.scrollLeft <= 15) {
        container.scrollTo({ left: maxScroll, behavior: "smooth" });
      } else {
        container.scrollBy({ left: amount, behavior: "smooth" });
      }
    }
  };

  const handleUserInteractionStart = () => {
    setPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const handleUserInteractionEnd = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setPaused(false);
    }, 5000);
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { cardWidth } = getCardMetrics();
      const newIndex = Math.min(
        COLLECTIONS.length - 1,
        Math.max(0, Math.round(scrollRef.current.scrollLeft / cardWidth)),
      );
      setActiveIndex(newIndex);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scroll("left");
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scroll("right");
    }
  };

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScroll - 15) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          const { cardWidth } = getCardMetrics();
          container.scrollBy({ left: cardWidth, behavior: "smooth" });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [paused]);

  return (
    <section
      className="mx-auto max-w-[1600px] px-4 md:px-8 py-16 md:py-24"
      onMouseEnter={handleUserInteractionStart}
      onMouseLeave={handleUserInteractionEnd}
      onTouchStart={handleUserInteractionStart}
      onTouchEnd={handleUserInteractionEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Shop by Weave"
    >
      <div className="text-center mb-8 md:mb-12">
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          <div className="h-px bg-gold/60 flex-1 max-w-[60px] sm:max-w-[120px] md:max-w-[180px]" />
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.18em] uppercase text-maroon text-center whitespace-nowrap">
            Shop by Weave
          </h2>
          <div className="h-px bg-gold/60 flex-1 max-w-[60px] sm:max-w-[120px] md:max-w-[180px]" />
        </div>
        <p className="mt-2 text-xs sm:text-sm md:text-base text-ink/75 font-medium max-w-xl mx-auto">
          Handpicked weaves from India's legendary artisan clusters — Banarasi, Kanjivaram, Paithani
          &amp; Pure Silks.
        </p>

        {/* Carousel controls */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={() => {
              handleUserInteractionStart();
              scroll("left");
              handleUserInteractionEnd();
            }}
            className="min-h-[44px] min-w-[44px] h-11 w-11 rounded-full border border-maroon/30 text-maroon hover:bg-maroon hover:text-ivory transition-colors flex items-center justify-center shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon"
            aria-label="Previous weave"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              handleUserInteractionStart();
              scroll("right");
              handleUserInteractionEnd();
            }}
            className="min-h-[44px] min-w-[44px] h-11 w-11 rounded-full border border-maroon/30 text-maroon hover:bg-maroon hover:text-ivory transition-colors flex items-center justify-center shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon"
            aria-label="Next weave"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <Link
            to="/collections"
            className="inline-flex items-center gap-1.5 min-h-[44px] px-5 py-2.5 rounded-full border border-maroon/40 text-[11px] font-bold tracking-[0.2em] uppercase text-maroon hover:bg-maroon hover:text-ivory transition-all duration-300 ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon"
          >
            All Weaves →
          </Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-live="polite"
        className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-pl-4 md:scroll-pl-8 scrollbar-hide overscroll-x-contain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/20 rounded-2xl"
      >
        {COLLECTIONS.map((c, idx) => (
          <Link
            key={c.slug}
            to="/collections"
            role="group"
            aria-roledescription="slide"
            aria-label={`${idx + 1} of ${COLLECTIONS.length}: ${c.name}`}
            className="group snap-center sm:snap-start shrink-0 w-[78vw] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] block relative aspect-[4/5] overflow-hidden rounded-2xl border border-gold/50 shadow-lg transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_25px_50px_-15px_rgba(100,31,42,0.3)] bg-beige/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon"
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
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 md:p-8 text-ivory flex flex-col justify-end">
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.16em] text-amber-300 font-bold mb-1 drop-shadow-sm">
                Shop the weave
              </span>
              <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal drop-shadow-md leading-tight">
                {c.name}
              </p>
              <p className="text-[11px] sm:text-xs uppercase tracking-widest text-ivory/85 mt-1.5 sm:mt-2 line-clamp-1 font-medium">
                {c.tagline}
              </p>

              <div className="mt-3.5 sm:mt-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 transform sm:translate-y-2 sm:group-hover:translate-y-0">
                <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-ivory/20 backdrop-blur-md text-[9px] sm:text-[10px] tracking-widest uppercase text-ivory border border-ivory/30">
                  Explore Weave →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Interactive Mobile & Desktop Pagination Dots */}
      <div className="mt-6 flex items-center justify-center gap-2" aria-label="Carousel pagination">
        {COLLECTIONS.map((c, idx) => (
          <button
            key={c.slug}
            onClick={() => {
              handleUserInteractionStart();
              scrollToSlide(idx);
              handleUserInteractionEnd();
            }}
            className={`min-h-[24px] min-w-[24px] flex items-center justify-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon`}
            aria-label={`Go to slide ${idx + 1}: ${c.name}`}
            aria-current={activeIndex === idx ? "true" : undefined}
          >
            <span
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? "w-7 bg-maroon shadow-sm"
                  : "w-2 bg-maroon/25 hover:bg-maroon/50"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Shop by Occasion (Auto Carousel) ---------------- */
const OCCASIONS: { label: string; sub: string; to: string; img: string }[] = [
  { label: "Bridal", sub: "The Sacred Day", to: "/wedding-sarees", img: IMG.colWedding },
  { label: "Festive", sub: "Diwali & Beyond", to: "/festive-edit", img: IMG.colFestive },
  { label: "Reception", sub: "Statement Silks", to: "/silk-sarees", img: IMG.colBanarasi },
  { label: "Everyday", sub: "Effortless Grace", to: "/everyday-sarees", img: IMG.colPuresilk },
  { label: "Office", sub: "Refined Drapes", to: "/everyday-sarees", img: IMG.look2 },
  { label: "Party", sub: "Evening Shimmer", to: "/festive-edit", img: IMG.colKanjivaram },
];

function ShopByOccasion() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getCardMetrics = () => {
    if (!scrollRef.current) return { cardWidth: 300, gap: 16 };
    const container = scrollRef.current;
    const firstCard = container.querySelector("a");
    const gap = typeof window !== "undefined" && window.innerWidth >= 768 ? 24 : 16;
    const cardWidth = firstCard ? firstCard.clientWidth + gap : 300;
    return { cardWidth, gap };
  };

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      const { cardWidth } = getCardMetrics();
      scrollRef.current.scrollTo({ left: index * cardWidth, behavior: "smooth" });
      setActiveIndex(index);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const { cardWidth } = getCardMetrics();
      const amount = direction === "left" ? -cardWidth : cardWidth;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (direction === "right" && container.scrollLeft >= maxScroll - 15) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else if (direction === "left" && container.scrollLeft <= 15) {
        container.scrollTo({ left: maxScroll, behavior: "smooth" });
      } else {
        container.scrollBy({ left: amount, behavior: "smooth" });
      }
    }
  };

  const handleUserInteractionStart = () => {
    setPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const handleUserInteractionEnd = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setPaused(false);
    }, 5000);
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { cardWidth } = getCardMetrics();
      const newIndex = Math.min(
        OCCASIONS.length - 1,
        Math.max(0, Math.round(scrollRef.current.scrollLeft / cardWidth)),
      );
      setActiveIndex(newIndex);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scroll("left");
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scroll("right");
    }
  };

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScroll - 15) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          const { cardWidth } = getCardMetrics();
          container.scrollBy({ left: cardWidth, behavior: "smooth" });
        }
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [paused]);

  return (
    <section
      className="mx-auto max-w-[1600px] px-4 md:px-8 py-16 md:py-24"
      onMouseEnter={handleUserInteractionStart}
      onMouseLeave={handleUserInteractionEnd}
      onTouchStart={handleUserInteractionStart}
      onTouchEnd={handleUserInteractionEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Shop by Occasion"
    >
      <div className="text-center mb-8 md:mb-12">
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          <div className="h-px bg-gold/60 flex-1 max-w-[60px] sm:max-w-[120px] md:max-w-[180px]" />
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.18em] uppercase text-maroon text-center whitespace-nowrap">
            Shop by Occasion
          </h2>
          <div className="h-px bg-gold/60 flex-1 max-w-[60px] sm:max-w-[120px] md:max-w-[180px]" />
        </div>
        <p className="mt-2 text-xs sm:text-sm md:text-base text-ink/75 font-medium max-w-xl mx-auto">
          A drape for every moment — from sacred bridal vows to everyday grace.
        </p>

        {/* Carousel controls */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={() => {
              handleUserInteractionStart();
              scroll("left");
              handleUserInteractionEnd();
            }}
            className="min-h-[44px] min-w-[44px] h-11 w-11 rounded-full border border-maroon/30 text-maroon hover:bg-maroon hover:text-ivory transition-colors flex items-center justify-center shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon"
            aria-label="Previous occasion"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              handleUserInteractionStart();
              scroll("right");
              handleUserInteractionEnd();
            }}
            className="min-h-[44px] min-w-[44px] h-11 w-11 rounded-full border border-maroon/30 text-maroon hover:bg-maroon hover:text-ivory transition-colors flex items-center justify-center shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon"
            aria-label="Next occasion"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 min-h-[44px] px-5 py-2.5 rounded-full border border-maroon/40 text-[11px] font-bold tracking-[0.2em] uppercase text-maroon hover:bg-maroon hover:text-ivory transition-all duration-300 ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon"
          >
            View All →
          </Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-live="polite"
        className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-pl-4 md:scroll-pl-8 scrollbar-hide overscroll-x-contain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/20 rounded-2xl"
      >
        {OCCASIONS.map((o, idx) => (
          <Link
            key={o.label}
            to={o.to}
            role="group"
            aria-roledescription="slide"
            aria-label={`${idx + 1} of ${OCCASIONS.length}: ${o.label} - ${o.sub}`}
            className="group snap-center sm:snap-start shrink-0 w-[72vw] sm:w-[calc((100%-1.5rem)/2)] md:w-[calc((100%-3rem)/3)] lg:w-[calc((100%-4.5rem)/4)] block relative aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl border border-gold/50 shadow-lg transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_25px_50px_-15px_rgba(100,31,42,0.3)] bg-beige/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon"
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

            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6 text-ivory flex flex-col justify-end">
              <p className="text-[11px] sm:text-xs tracking-[0.16em] uppercase text-amber-300 font-bold drop-shadow-sm">
                {o.sub}
              </p>
              <p className="font-serif text-xl sm:text-2xl md:text-3xl mt-0.5 sm:mt-1 font-normal drop-shadow-md leading-tight">
                {o.label}
              </p>
              <div className="mt-2.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 transform sm:translate-y-2 sm:group-hover:translate-y-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ivory/20 backdrop-blur-md text-[9px] tracking-widest uppercase text-ivory border border-ivory/30">
                  Explore Collection →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Interactive Mobile & Desktop Pagination Dots */}
      <div className="mt-6 flex items-center justify-center gap-2" aria-label="Carousel pagination">
        {OCCASIONS.map((o, idx) => (
          <button
            key={o.label}
            onClick={() => {
              handleUserInteractionStart();
              scrollToSlide(idx);
              handleUserInteractionEnd();
            }}
            className={`min-h-[24px] min-w-[24px] flex items-center justify-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon`}
            aria-label={`Go to slide ${idx + 1}: ${o.label}`}
            aria-current={activeIndex === idx ? "true" : undefined}
          >
            <span
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? "w-7 bg-maroon shadow-sm"
                  : "w-2 bg-maroon/25 hover:bg-maroon/50"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Trending Now (auto-advancing carousel) ---------------- */
function TrendingNow() {
  const { products } = useCatalog();
  const items = products.slice(0, 8);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  /**
   * Scroll position -> active dot.
   *
   * Read from the scroll container rather than tracked in state, so the dots
   * stay correct however the strip moved: arrows, autoplay, a finger swipe or
   * a trackpad. rAF-throttled because scroll fires per frame on touch.
   */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const card = el.querySelector<HTMLElement>("[data-card]");
        if (!card) return;
        const gap = window.innerWidth >= 768 ? 24 : 16;
        const step = card.clientWidth + gap;
        if (step <= 0) return;
        const index = Math.round(el.scrollLeft / step);
        setActive(Math.max(0, Math.min(items.length - 1, index)));
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items.length]);

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    if (!card) return;
    const gap = window.innerWidth >= 768 ? 24 : 16;
    el.scrollTo({ left: index * (card.clientWidth + gap), behavior: "smooth" });
  };

  const scroll = (direction: "left" | "right") => {
    const next = direction === "left" ? active - 1 : active + 1;
    scrollToIndex((next + items.length) % items.length);
  };

  /**
   * Autoplay.
   *
   * Paused on hover, on touch, and whenever the tab is hidden or the section is
   * scrolled out of view — an off-screen carousel advancing in the background
   * just burns battery. Skipped entirely under prefers-reduced-motion, where
   * unrequested movement is the thing the user asked not to have.
   */
  useEffect(() => {
    if (paused || items.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = scrollRef.current;
    if (!el) return;

    let visible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.35 },
    );
    observer.observe(el);

    const timer = setInterval(() => {
      if (!visible || document.hidden) return;
      setActive((current) => {
        const next = (current + 1) % items.length;
        scrollToIndex(next);
        return next;
      });
    }, 4000);

    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, [paused, items.length]);

  return (
    <section className="w-full bg-beige/25 border-y border-maroon/40 py-16 md:py-24">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            <div className="h-px bg-gold/60 flex-1 max-w-[60px] sm:max-w-[120px] md:max-w-[180px]" />
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.18em] uppercase text-maroon text-center whitespace-nowrap">
              Trending Now
            </h2>
            <div className="h-px bg-gold/60 flex-1 max-w-[60px] sm:max-w-[120px] md:max-w-[180px]" />
          </div>
          <p className="mt-2 text-xs sm:text-sm md:text-base text-ink/75 font-medium max-w-xl mx-auto">
            Loved this week by our patrons across Mumbai
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
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
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-maroon/40 text-[11px] font-bold tracking-[0.2em] uppercase text-maroon hover:bg-maroon hover:text-ivory transition-all duration-300 ml-2"
            >
              View All →
            </Link>
          </div>
        </div>

        {/*
          touchAction MUST list both axes. Do not "simplify" this to one.

          touch-action names every gesture the browser may handle itself;
          anything omitted is withheld from it. Both single-axis values are
          wrong here, and this element has now shipped with each of them:

            "pan-x"  browser handles horizontal only. A vertical swipe that
                     began on a card was swallowed, so on a phone the page
                     froze at this section and you had to find a gap beside
                     the carousel to scroll past it.
            "pan-y"  browser handles vertical only. Page scrolling worked,
                     but dragging the cards sideways did nothing — the fix
                     for the first bug, which caused the second.

          "pan-x pan-y" gives both axes back. The browser picks the axis from
          the direction of the gesture, which is what a horizontally-scrolling
          strip inside a vertically-scrolling page needs. Only pinch-zoom is
          withheld, which is what we want on a product strip.

          Note that overflow-x alone does NOT restore horizontal swiping on
          touch: touch-action gates the gesture before overflow ever sees it.
        */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide scroll-smooth"
          style={{ touchAction: "pan-x pan-y" }}
        >
          {items.map((p, i) => (
            <div
              key={p.id}
              data-card
              className="relative snap-center sm:snap-start shrink-0 w-[78%] sm:w-[calc((100%-1.5rem)/2)] md:w-[calc((100%-3rem)/3)] lg:w-[calc((100%-4.5rem)/4)] flex"
            >
              {/* Rank badge sits over the shared card rather than inside it —
                  ranking is a property of this list, not of the product. */}
              <span className="pointer-events-none absolute top-3 left-3 z-20 h-7 w-7 rounded-full flex items-center justify-center bg-maroon text-ivory text-[10px] font-bold shadow-md border border-gold/40">
                {i + 1}
              </span>
              {/* The shared card, so Trending gets the same Shop Now button,
                  wishlist and in-cart quantity selector as every other grid.
                  This section used to hand-roll its own markup and shipped
                  without any of them. */}
              <div className="w-full [&>a]:w-full">
                <ProductCard p={p} />
              </div>
            </div>
          ))}
        </div>

        {/* Dots. Without these a phone shows one card and nothing signals that
            the strip moves at all. */}
        {items.length > 1 && (
          <div className="mt-5 flex items-center justify-center gap-2">
            {items.map((p, i) => (
              <button
                key={p.id}
                onClick={() => {
                  setPaused(true);
                  setActive(i);
                  scrollToIndex(i);
                }}
                aria-label={`Go to product ${i + 1} of ${items.length}`}
                aria-current={i === active}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === active ? "w-6 bg-maroon" : "w-2 bg-maroon/25 hover:bg-maroon/50"
                }`}
              />
            ))}
          </div>
        )}
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
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
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
            Kanjivaram, Paithani &amp; Tissue heirlooms for the most sacred day.
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
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
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
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/30 via-55% to-transparent" />
          <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-6 md:p-10 text-ivory max-w-xs">
            <span className="text-[10px] tracking-[0.4em] uppercase text-gold/90 font-medium">
              Silk &amp; Gold
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
      <div className="text-center mb-10 md:mb-14">
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          <div className="h-px bg-gold/60 flex-1 max-w-[60px] sm:max-w-[120px] md:max-w-[180px]" />
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.18em] uppercase text-maroon text-center whitespace-nowrap">
            Bestsellers
          </h2>
          <div className="h-px bg-gold/60 flex-1 max-w-[60px] sm:max-w-[120px] md:max-w-[180px]" />
        </div>
        <p className="mt-2 text-xs sm:text-sm md:text-base text-ink/75 font-medium max-w-xl mx-auto">
          Signature handcrafted silks &amp; bridal favorites
        </p>
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
        "The tissue silk falls beautifully. Mumbai Bazar is now my first stop for every festival.",
    },
  ];

  return (
    <section className="w-full bg-beige/25 py-16 md:py-24 border-y border-gold/50">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            <div className="h-px bg-gold/60 flex-1 max-w-[60px] sm:max-w-[120px] md:max-w-[180px]" />
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.18em] uppercase text-maroon text-center whitespace-nowrap">
              Words from Our Women
            </h2>
            <div className="h-px bg-gold/60 flex-1 max-w-[60px] sm:max-w-[120px] md:max-w-[180px]" />
          </div>
          <p className="mt-2 text-xs sm:text-sm md:text-base text-ink/75 font-medium max-w-xl mx-auto">
            Loved by brides &amp; saree patrons across India
          </p>
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

/* ---------------- Instagram Banner Section ---------------- */
function InstagramBanner() {
  const reels = [
    {
      img: "/instagram/reel_1_viral_saree.jpg",
      title: "Viral Dual-Tone Shimmer Saree",
      views: "148K",
      tag: "Trending",
    },
    {
      img: "/instagram/reel_2_trending_nalasopara.jpg",
      title: "Handcrafted Bridal Box Unboxing",
      views: "92K",
      tag: "Bridal",
    },
    {
      img: "/instagram/reel_3_trending_shop.jpg",
      title: "Live Saree Collection Walkthrough",
      views: "215K",
      tag: "Live In Store",
    },
    {
      img: "/instagram/reel_4_rakhi_special.jpg",
      title: "Festive Silk & Party Wear",
      views: "110K",
      tag: "Festive Drop",
    },
    {
      img: "/instagram/reel_5_viral_saree_shop.jpg",
      title: "Dulhan Red Banarasi Showcase",
      views: "185K",
      tag: "Dulhan Special",
    },
  ];

  const igReelsUrl = "https://www.instagram.com/mumbai__bazar__nalasopara/reels/";

  return (
    <section
      className="mx-auto max-w-[1600px] px-4 md:px-8 py-8 md:py-14"
      aria-label="Watch Mumbai Bazar Trending Reels on Instagram"
    >
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-[#F2D7D5] bg-[#FDF5F5] shadow-xs flex flex-col lg:flex-row items-stretch">
        {/* Left: 5 Real Instagram Reels Cards */}
        <div className="w-full lg:w-[50%] xl:w-[52%] p-2.5 sm:p-3.5 shrink-0">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5 h-full">
            {reels.map((reel, i) => (
              <a
                key={i}
                href={igReelsUrl}
                target="_blank"
                rel="noreferrer"
                className="group relative block aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden bg-black/90 shadow-sm border border-gold/30 hover:border-maroon transition-all"
                aria-label={`Watch Reel: ${reel.title}`}
              >
                <img
                  src={reel.img}
                  alt={reel.title}
                  width={360}
                  height={640}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />

                {/* Dark gradient for text & badges */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

                {/* Top Badge: Reel Tag / Play Indicator */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-gold">
                    <Play className="h-2 w-2 fill-gold text-gold" />
                    <span className="hidden sm:inline">Reel</span>
                  </span>
                </div>

                {/* Center Hover Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/90 backdrop-blur-md text-maroon flex items-center justify-center shadow-lg transition-all duration-300 scale-90 opacity-0 group-hover:scale-105 group-hover:opacity-100">
                    <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-maroon text-maroon ml-0.5" />
                  </span>
                </div>

                {/* Bottom Overlay: Views & Title */}
                <div className="absolute inset-x-0 bottom-0 p-1.5 sm:p-2.5 text-white pointer-events-none">
                  <span className="inline-flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-md px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold text-white/90">
                    <Play className="h-2 w-2 fill-white" />
                    <span>{reel.views}</span>
                  </span>
                  <p className="mt-1 text-[9px] sm:text-[10px] font-semibold text-white/95 leading-tight line-clamp-1 hidden sm:block">
                    {reel.title}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Center & Right: Instagram Follow Callout + Stay Connected */}
        <div className="flex-1 px-6 sm:px-10 py-6 md:py-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-[#FDF5F5] via-[#FCEDEA] to-[#FDF5F5]">
          {/* Middle Follow Callout */}
          <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Instagram className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs tracking-[0.2em] uppercase font-bold text-[#A6192E]">
                WATCH REELS @MUMBAIBAZAR
              </p>
              <p className="text-xs sm:text-sm text-ink/75 font-medium mt-0.5">
                Watch viral saree draping videos, customer looks &amp; daily new drops.
              </p>
              <a
                href={igReelsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2.5 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 text-white hover:opacity-95 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] transition-all shadow-md active:scale-95"
              >
                <Play className="h-3 w-3 fill-white" />
                <span>WATCH REELS ON INSTAGRAM →</span>
              </a>
            </div>
          </div>

          {/* Right: Stay Connected Script Calligraphy */}
          <div className="text-center sm:text-right shrink-0 pt-2 sm:pt-0">
            <p className="font-serif italic text-2xl sm:text-3xl text-[#A6192E] font-medium leading-none tracking-tight">
              Stay
              <br className="hidden sm:inline" /> Connected
            </p>
            <div className="mt-1 flex items-center justify-center sm:justify-end text-[#A6192E]">
              <span className="text-lg">♡</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Bottom Trust / Guarantee Bar ---------------- */
function BottomTrustBar() {
  const items = [
    {
      icon: Truck,
      title: "Free Shipping",
      subtitle: "Across India",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      subtitle: "Within 7 Days",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      subtitle: "100% Safe",
    },
    {
      icon: Headphones,
      title: "Customer Support",
      subtitle: "+91 89566 64631",
      href: "tel:+918956664631",
    },
  ];

  return (
    <section
      className="w-full bg-[#FAF8F5] border-y border-maroon/20 py-8 md:py-12"
      aria-label="Customer Guarantees & Support"
    >
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {items.map((item, idx) => {
            const Icon = item.icon;
            const Content = (
              <div className="flex items-center gap-3.5 sm:gap-4 group">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-maroon/5 flex items-center justify-center text-maroon shrink-0 transition-transform group-hover:scale-110">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.5]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.14em] text-maroon leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-ink/70 font-medium mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );

            return item.href ? (
              <a
                key={idx}
                href={item.href}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon rounded-lg"
              >
                {Content}
              </a>
            ) : (
              <div key={idx}>{Content}</div>
            );
          })}
        </div>
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
        <div className="flex items-center justify-center gap-3 sm:gap-6 mb-4">
          <div className="h-px bg-gold/50 flex-1 max-w-[60px] sm:max-w-[100px]" />
          <span className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-gold font-bold">
            The Atelier Letter
          </span>
          <div className="h-px bg-gold/50 flex-1 max-w-[60px] sm:max-w-[100px]" />
        </div>
        <h3 className="font-serif text-3xl md:text-5xl leading-tight">
          Be the first to <span className="italic">know</span>
        </h3>
        <p className="mt-4 text-sm md:text-base text-ivory/75 max-w-xl mx-auto">
          Early access to new arrivals, bridal previews and private boutique events. Plus a
          heartfelt ₹1,000 off your first heirloom.
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
            className="flex-1 bg-transparent border border-ivory/40 px-5 py-3.5 text-sm text-ivory placeholder:text-ivory/50 focus:outline-none focus:border-ivory transition-colors rounded-xl sm:rounded-l-full sm:rounded-r-none"
          />
          <button
            type="submit"
            className="px-8 py-3.5 bg-ivory text-maroon text-[10px] md:text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-gold hover:text-ivory transition-colors rounded-xl sm:rounded-r-full sm:rounded-l-none"
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
      <ShopByCategory />
      <ImmediateProductShelf />
      <TrendingNow />
      <ProductFeed />
      <StoreVisitBanner />
      <Bestsellers />
      <ShopByOccasion />
      <CollectionStrip />
      <Testimonials />
      <InstagramBanner />
      <BottomTrustBar />
      <Newsletter />
    </div>
  );
}
