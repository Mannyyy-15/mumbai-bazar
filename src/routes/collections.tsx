import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, MessageCircle } from "lucide-react";
import { seo, jsonLd } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { IMG } from "@/lib/site-data";
import { useCatalog } from "@/lib/catalog-context";

export const Route = createFileRoute("/collections")({
  head: () => {
    const { meta, links } = seo({
      title: "Saree Collections | Banarasi, Kanjivaram & Bridal — Mumbai Bazar",
      description:
        "Explore curated Indian saree collections — Bridal heirlooms, Banarasi katan silks, Kanjivaram classics, festive edits, and effortless everyday drapes.",
      path: "/collections",
      keywords: [
        "saree collections",
        "banarasi collection",
        "kanjivaram collection",
        "bridal saree collection",
        "festive saree",
        "ethnic wear collection",
      ],
    });
    return {
      meta,
      links,
      scripts: [
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Collections", path: "/collections" },
          ]),
        ),
      ],
    };
  },
  component: CollectionsPage,
});

const FILTER_TABS = [
  { key: "all", label: "All Collections" },
  { key: "wedding", label: "Bridal & Wedding" },
  { key: "artisan", label: "Heritage Weaves" },
  { key: "festive", label: "Festive & Party" },
  { key: "everyday", label: "Daily & Ready to Wear" },
];

const CURATED_CARDS = [
  {
    id: "bridal",
    category: "wedding",
    tag: "Bridal",
    title: "Bridal",
    script: "Collection",
    desc: "Heirloom crimson Banarasis and gold brocade Kanjivarams woven for wedding vows.",
    to: "/wedding-sarees",
    img: IMG.colWedding,
    badge: "Bridal Trousseau",
    bgClass: "bg-[#E8C5B0]/30 hover:bg-[#E8C5B0]/45 border-[#D4A38B]/60",
    textClass: "text-[#641F2A]",
  },
  {
    id: "banarasi",
    category: "artisan",
    tag: "Banarasi",
    title: "Banarasi",
    script: "Collection",
    desc: "Handcrafted in Varanasi with tested gold zari and pure mulberry katan silk.",
    to: "/silk-sarees",
    img: IMG.colBanarasi,
    badge: "100% Pure Silk",
    bgClass: "bg-[#D5D2BE]/35 hover:bg-[#D5D2BE]/50 border-[#B8B49B]/60",
    textClass: "text-[#4A3E25]",
  },
  {
    id: "festive",
    category: "festive",
    tag: "Festive",
    title: "Festive",
    script: "Collection",
    desc: "Celebration-ready jewel tones and shimmering zari tissue drapes for pujas & soirées.",
    to: "/festive-edit",
    img: IMG.colFestive,
    badge: "Evening Shimmer",
    bgClass: "bg-[#E5BFC6]/35 hover:bg-[#E5BFC6]/50 border-[#CFA1AB]/60",
    textClass: "text-[#680910]",
  },
  {
    id: "ready-to-wear",
    category: "everyday",
    tag: "Everyday",
    title: "Ready to Wear",
    script: "Collection",
    desc: "Featherlight breathable silks and fluid drapes crafted for effortless elegance.",
    to: "/everyday-sarees",
    img: IMG.colPuresilk,
    badge: "Lightweight Drapes",
    bgClass: "bg-[#EAD4AC]/35 hover:bg-[#EAD4AC]/50 border-[#D5BA8D]/60",
    textClass: "text-[#5C3E1B]",
  },
  {
    id: "new-arrivals",
    category: "all",
    tag: "Fresh Drop",
    title: "New Arrivals",
    script: "Collection",
    desc: "Limited edition pieces fresh from the loom corridors with zero repeat weaves.",
    to: "/new-arrivals",
    img: IMG.colKanjivaram,
    badge: "Fresh From Loom",
    bgClass: "bg-[#F0E6D2]/45 hover:bg-[#F0E6D2]/65 border-[#DAC9A8]/60",
    textClass: "text-[#4F3C28]",
  },
  {
    id: "all-shop",
    category: "all",
    tag: "Full Catalog",
    title: "The Boutique",
    script: "Collection",
    desc: "Explore every curated drape in the house — filter by weave, occasion, and color.",
    to: "/shop",
    img: IMG.craft,
    badge: "All Sarees",
    bgClass: "bg-maroon text-ivory border-gold/60 shadow-xl",
    textClass: "text-ivory",
    isDark: true,
  },
];

function CollectionsPage() {
  const { products } = useCatalog();
  const [activeTab, setActiveTab] = useState("all");

  const filteredCards = useMemo(() => {
    if (activeTab === "all") return CURATED_CARDS;
    return CURATED_CARDS.filter((c) => c.category === activeTab || c.id === "all-shop");
  }, [activeTab]);

  return (
    <div className="w-full bg-ivory text-ink min-h-screen">
      {/* 1. Minimal Breadcrumb Navigation Bar */}
      <div className="border-b border-gold/30 bg-beige/15 py-3 md:py-4">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 flex items-center justify-between">
          <nav className="text-xs tracking-[0.14em] uppercase text-maroon font-bold">
            <Link to="/" className="hover:text-gold-deep transition-colors">
              Home
            </Link>
            <span className="mx-2 text-gold-deep">/</span>
            <span className="text-ink">Collections</span>
          </nav>
          <span className="text-xs text-taupe font-medium hidden sm:inline-block">
            {products.length} Curated Drapes Across India
          </span>
        </div>
      </div>

      {/* 2. Top Editorial Showcase Banner (Inspired by Pinterest top section) */}
      <section className="py-8 md:py-12 px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="relative rounded-3xl overflow-hidden border border-gold/45 bg-gradient-to-br from-[#F5DEB3]/35 via-[#FDF8F2] to-ivory shadow-sm">
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-gold/15 to-transparent blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-maroon/5 blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-10 md:p-14 relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <div>
                <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-gold-deep">
                  Whisper of
                </p>
                <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-maroon font-semibold leading-[1.08] mt-1">
                  Heirloom Drapes
                </h1>
              </div>

              <p className="text-sm md:text-base text-ink/80 leading-relaxed max-w-xl font-normal">
                Mumbai Bazar brings you authentic ethnic-wear collections inspired by the timeless
                splendor of India’s artisanal weaving clusters. Each drape embodies centuries of
                sacred craftsmanship, pure mulberry silk, and intricate tested zari.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#shop-by-collection"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-maroon text-ivory text-xs font-bold uppercase tracking-[0.16em] hover:bg-wine transition-all shadow-md group"
                >
                  <span>Explore Collections</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full border border-maroon/30 text-maroon text-xs font-bold uppercase tracking-[0.16em] hover:bg-maroon/5 transition-colors"
                >
                  View All Products
                </Link>
              </div>
            </div>

            {/* Right Visual Composition */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden border border-gold/50 shadow-lg bg-beige/40">
                <img
                  src="/hero/slide-1-horizonal.png"
                  alt="Heirloom Saree Showcase"
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                />
                {/* Delicate internal border overlay */}
                <div className="absolute inset-2 sm:inset-3 rounded-xl border border-white/60 pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 bg-ivory/95 backdrop-blur-md p-3.5 rounded-xl border border-gold/40 shadow-md">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-deep block">
                    Spotlight Series
                  </span>
                  <p className="font-serif text-sm sm:text-base font-semibold text-maroon truncate">
                    Royal Crimson & Gold Brocade Kanjivaram
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Centerpiece: Staggered Editorial Showcase with Giant Vertical Watermark `C O L L E C T I O N` */}
      <section className="py-12 md:py-20 px-4 md:px-8 lg:px-12 xl:px-16 border-t border-gold/30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center relative">
          {/* Left Staggered Card */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <Link to="/silk-sarees" className="group block">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gold/50 bg-beige/30 shadow-md">
                <img
                  src={IMG.colBanarasi}
                  alt="Pure Banarasi Katan Silk"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Delicate inner hairline frame (from Pinterest ref) */}
                <div className="absolute inset-3 sm:inset-4 rounded-xl border border-white/70 pointer-events-none" />
                <span className="absolute top-6 left-6 px-3 py-1 rounded-full bg-ivory/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.16em] text-maroon shadow-sm">
                  Varanasi Handloom
                </span>
              </div>

              <div className="mt-5 space-y-2">
                <h3 className="font-serif text-2xl md:text-3xl font-semibold text-maroon group-hover:text-gold-deep transition-colors">
                  Pure Banarasi Katan Silk
                </h3>
                <p className="text-sm text-ink/80 leading-relaxed max-w-md font-normal">
                  Intricate kadwa floral jaal woven with pure tested gold zari on natural katan
                  mulberry silk for sacred vows and timeless heirloom wardrobes.
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-maroon group-hover:text-gold-deep transition-colors">
                    <span>Shop now</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Center Column: Giant Vertical Luxury Watermark `COLLECTION` */}
          <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-center h-full select-none pointer-events-none">
            <span className="text-[70px] xl:text-[92px] font-serif font-black tracking-[0.32em] text-maroon/10 uppercase [writing-mode:vertical-lr] rotate-180">
              COLLECTION
            </span>
          </div>

          {/* Right Staggered Card (Offset vertically) */}
          <div className="lg:col-span-5 flex flex-col justify-center lg:mt-16">
            <Link to="/wedding-sarees" className="group block">
              <div className="mb-5 space-y-2">
                <h3 className="font-serif text-2xl md:text-3xl font-semibold text-maroon group-hover:text-gold-deep transition-colors">
                  Kanjivaram Gold Brocade
                </h3>
                <p className="text-sm text-ink/80 leading-relaxed max-w-md font-normal">
                  Woven with heavy three-ply silk and authentic temple korvai borders from the master
                  looms of Tamil Nadu. Handcrafted for brides and grand occasions.
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-maroon group-hover:text-gold-deep transition-colors">
                    <span>Shop now</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>

              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gold/50 bg-beige/30 shadow-md">
                <img
                  src={IMG.colWedding}
                  alt="Kanjivaram Gold Brocade Saree"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Delicate inner hairline frame */}
                <div className="absolute inset-3 sm:inset-4 rounded-xl border border-white/70 pointer-events-none" />
                <span className="absolute top-6 left-6 px-3 py-1 rounded-full bg-ivory/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.16em] text-maroon shadow-sm">
                  Kanchipuram Heritage
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. "SHOP BY COLLECTION" Section (The Exact Pinterest Visual Cards with Script Accent & Circle Arrow Buttons) */}
      <section
        id="shop-by-collection"
        className="py-16 md:py-24 px-4 md:px-8 lg:px-12 xl:px-16 border-t border-gold/30 bg-beige/10"
      >
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-maroon">SHOP BY</p>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-maroon font-semibold tracking-tight mt-1">
              COLLECTION
            </h2>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.14em] font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-maroon text-ivory shadow-md"
                    : "border border-gold/45 text-maroon hover:bg-beige/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* The Curated Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredCards.map((card) => (
            <Link
              key={card.id}
              to={card.to}
              className={`group block relative rounded-3xl p-6 sm:p-7 border shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden ${card.bgClass}`}
            >
              {/* Inner delicate decorative framing line (Direct from Pinterest inspiration!) */}
              <div
                className={`absolute inset-3 rounded-2xl border pointer-events-none transition-opacity ${
                  card.isDark ? "border-gold/40" : "border-white/60"
                }`}
              />

              <div className="relative z-10 flex flex-col justify-between h-full min-h-[380px]">
                {/* Top Row: Category Title + Cursive Accent */}
                <div className="space-y-1">
                  <span
                    className={`text-[11px] uppercase tracking-[0.18em] font-bold block ${
                      card.isDark ? "text-gold" : "text-maroon"
                    }`}
                  >
                    {card.title}
                  </span>
                  <h3
                    className={`font-serif italic text-3xl sm:text-4xl font-normal leading-tight ${card.textClass}`}
                  >
                    {card.script}
                  </h3>
                </div>

                {/* Center Image Container */}
                <div className="my-4 relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/50 shadow-inner bg-black/5">
                  <img
                    src={card.img}
                    alt={`${card.title} ${card.script}`}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-ivory/90 text-[9.5px] font-bold uppercase tracking-[0.14em] text-maroon shadow-sm">
                    {card.badge}
                  </div>
                </div>

                {/* Bottom Row: Description + Circular Arrow Button */}
                <div className="flex items-end justify-between gap-4 pt-2">
                  <p
                    className={`text-xs leading-relaxed max-w-[200px] line-clamp-2 ${
                      card.isDark ? "text-ivory/80" : "text-ink/80"
                    } font-normal`}
                  >
                    {card.desc}
                  </p>

                  {/* Circular Arrow Button (matching Pinterest reference) */}
                  <div
                    className={`h-11 w-11 shrink-0 rounded-full flex items-center justify-center shadow-md transition-all duration-300 transform group-hover:scale-110 ${
                      card.isDark
                        ? "bg-gold text-maroon group-hover:bg-ivory"
                        : "bg-white text-maroon group-hover:bg-maroon group-hover:text-white"
                    }`}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. High-Converting VIP Styling Assistance Strip */}
      <section className="py-14 md:py-20 px-4 md:px-8 border-t border-gold/30 bg-ivory">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-maroon/30 bg-maroon/5 text-xs uppercase tracking-[0.16em] text-maroon font-bold">
            <Sparkles className="h-3.5 w-3.5 text-gold-deep" /> Bespoke Styling Concierge
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-maroon font-semibold">
            Can’t Decide on the Perfect Drape?
          </h2>
          <p className="text-sm md:text-base text-ink/80 leading-relaxed font-normal">
            Whether preparing your wedding trousseau or looking for an authentic festival drape, our
            saree curators are available directly on WhatsApp for video consultations and fabric
            guidance.
          </p>
          <div className="pt-4">
            <a
              href="https://wa.me/919999999999?text=Hello%20Mumbai%20Bazar%20Stylist%2C%20I%20would%20like%20guidance%20on%20choosing%20a%20saree%20collection."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gold text-maroon font-bold text-xs uppercase tracking-[0.18em] hover:bg-maroon hover:text-ivory transition-all shadow-md"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chat with a Saree Stylist on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
