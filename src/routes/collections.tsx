import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, MessageCircle } from "lucide-react";
import { seo, jsonLd, SITE } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { IMG } from "@/lib/site-data";
import { useCatalog } from "@/lib/catalog-context";

export const Route = createFileRoute("/collections")({
  head: () => {
    const { meta, links } = seo({
      title: "Saree Collections: Bridal & Banarasi | Mumbai Bazar",
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
    eyebrow: "Collection",
    title: "Bridal Sarees",
    desc: "Heirloom crimson Banarasis and gold brocade Kanjivarams woven for sacred wedding vows.",
    to: "/wedding-sarees",
    img: IMG.colWedding,
    badge: "Bridal Trousseau",
    bgClass: "bg-[#FAF1EB] hover:bg-[#F5E7DD] border-[#E8D1C5]",
    textClass: "text-[#58111A]",
  },
  {
    id: "banarasi",
    category: "artisan",
    eyebrow: "Collection",
    title: "Banarasi Silk",
    desc: "Handcrafted in Varanasi with tested gold zari and pure mulberry katan silk.",
    to: "/silk-sarees",
    img: IMG.colBanarasi,
    badge: "100% Pure Silk",
    bgClass: "bg-[#F5F2E9] hover:bg-[#EDE8DA] border-[#DED7C5]",
    textClass: "text-[#4A3E25]",
  },
  {
    id: "festive",
    category: "festive",
    eyebrow: "Collection",
    title: "Festive Edit",
    desc: "Celebration-ready jewel tones and shimmering zari tissue drapes for pujas & soirées.",
    to: "/festive-edit",
    img: IMG.colFestive,
    badge: "Evening Shimmer",
    bgClass: "bg-[#F9EFF2] hover:bg-[#F3E3E7] border-[#E8CCD5]",
    textClass: "text-[#680910]",
  },
  {
    id: "ready-to-wear",
    category: "everyday",
    eyebrow: "Collection",
    title: "Ready to Wear",
    desc: "Featherlight breathable silks and fluid drapes crafted for effortless everyday elegance.",
    to: "/everyday-sarees",
    img: IMG.colPuresilk,
    badge: "Lightweight Drapes",
    bgClass: "bg-[#F8F4EA] hover:bg-[#F1EAD8] border-[#E6D9C2]",
    textClass: "text-[#5C3E1B]",
  },
  {
    id: "new-arrivals",
    category: "all",
    eyebrow: "Collection",
    title: "New Arrivals",
    desc: "Limited edition pieces fresh from the loom corridors with zero repeat weaves.",
    to: "/new-arrivals",
    img: IMG.colKanjivaram,
    badge: "Fresh From Loom",
    bgClass: "bg-[#F9F6F0] hover:bg-[#F2ECE0] border-[#E5DDCB]",
    textClass: "text-[#4F3C28]",
  },
  {
    id: "all-shop",
    category: "all",
    eyebrow: "Collection",
    title: "All Products",
    desc: "Explore every curated drape in the house — filter by weave, occasion, price, and color.",
    to: "/shop",
    img: IMG.craft,
    badge: "All Sarees",
    bgClass: "bg-maroon text-white border-gold/60 shadow-xl",
    textClass: "text-white",
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
    <div className="w-full bg-[#FAF7F2] text-ink min-h-screen">
      {/* 1. Minimal Breadcrumb Navigation Bar */}
      <div className="border-b border-gold/30 bg-white/70 backdrop-blur-sm py-4 px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="w-full flex flex-wrap items-center justify-between gap-3">
          <nav className="text-xs tracking-[0.14em] uppercase text-maroon font-bold flex items-center gap-2">
            <Link to="/" className="hover:text-gold-deep transition-colors">
              Home
            </Link>
            <span className="text-gold-deep font-normal">/</span>
            <span className="text-ink">Collections</span>
          </nav>
          <span className="text-xs text-taupe font-medium hidden sm:inline-block">
            {products.length} Curated Drapes Across India
          </span>
        </div>
      </div>

      {/* 2. "SHOP BY COLLECTION" Section */}
      <section id="shop-by-collection" className="py-10 md:py-16 px-4 md:px-8 lg:px-12 xl:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-maroon/10 px-3 py-1 rounded-full text-xs font-bold text-maroon uppercase tracking-wider mb-2">
              <Sparkles className="h-3 w-3 text-gold-deep" /> Handcrafted Heritage
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-maroon font-bold tracking-tight">
              Shop by Collection
            </h1>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 rounded-full text-xs uppercase tracking-[0.14em] font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-maroon text-white shadow-md"
                    : "border border-gold/50 bg-white text-maroon hover:bg-beige/40 shadow-sm"
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
              {/* Inner delicate decorative framing line */}
              <div
                className={`absolute inset-3.5 rounded-2xl border pointer-events-none transition-opacity ${
                  card.isDark ? "border-gold/30" : "border-white/70"
                }`}
              />

              <div className="relative z-10 flex flex-col justify-between h-full min-h-[400px]">
                {/* Top Row: Eyebrow "COLLECTION" in small uppercase + Title in BIG serif font */}
                <div className="space-y-1.5 pt-1">
                  <span
                    className={`text-[11px] uppercase tracking-[0.24em] font-bold block ${
                      card.isDark ? "text-gold" : "text-maroon/70"
                    }`}
                  >
                    {card.eyebrow}
                  </span>
                  <h2
                    className={`font-serif text-3xl sm:text-4xl font-bold leading-tight ${card.textClass}`}
                  >
                    {card.title}
                  </h2>
                </div>

                {/* Center Image Container */}
                <div className="my-5 relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/60 shadow-md bg-black/5">
                  <img
                    src={card.img}
                    alt={`${card.title} Collection`}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.14em] text-maroon shadow-sm">
                    {card.badge}
                  </div>
                </div>

                {/* Bottom Row: Description + Circular Arrow Button */}
                <div className="flex items-end justify-between gap-4 pt-1">
                  <p
                    className={`text-xs leading-relaxed max-w-[220px] line-clamp-2 ${
                      card.isDark ? "text-white/85" : "text-ink/80"
                    } font-medium`}
                  >
                    {card.desc}
                  </p>

                  {/* Circular Arrow Button */}
                  <div
                    className={`h-11 w-11 shrink-0 rounded-full flex items-center justify-center shadow-md transition-all duration-300 transform group-hover:scale-110 ${
                      card.isDark
                        ? "bg-gold text-maroon group-hover:bg-white"
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

      {/* 3. VIP Styling Assistance Strip */}
      <section className="py-14 md:py-20 px-4 md:px-8 border-t border-gold/40 bg-white">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-maroon/30 bg-maroon/5 text-xs uppercase tracking-[0.16em] text-maroon font-bold">
            <Sparkles className="h-3.5 w-3.5 text-gold-deep" /> Bespoke Styling Concierge
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-maroon font-bold">
            Can’t Decide on the Perfect Drape?
          </h2>
          <p className="text-sm md:text-base text-ink/80 leading-relaxed font-medium">
            Whether preparing your wedding trousseau or looking for an authentic festival drape, our
            saree curators are available directly on WhatsApp for video consultations and fabric
            guidance.
          </p>
          <div className="pt-4">
            <a
              href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Hello Mumbai Bazar Stylist, I would like guidance on choosing a saree collection.")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-maroon text-white font-bold text-xs uppercase tracking-[0.18em] hover:bg-wine transition-all shadow-md"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              <span>Chat with a Saree Stylist on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
