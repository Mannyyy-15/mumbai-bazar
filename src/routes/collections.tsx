import { useState, useMemo } from "react";
import { seo, jsonLd } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { createFileRoute, Link } from "@tanstack/react-router";
import { COLLECTIONS, PRODUCTS, type Product } from "@/lib/site-data";
import { Sparkles, MapPin, ChevronRight, Filter } from "lucide-react";

export const Route = createFileRoute("/collections")({
  head: () => {
    const { meta, links } = seo({
      title: "Saree Collections | Banarasi, Kanjivaram & Wedding Weaves — Mumbai Bazar",
      description:
        "Browse saree collections by style and occasion — Banarasi, Kanjivaram, party wear, bridal and festive edits, available across our 8 stores.",
      path: "/collections",
      keywords: [
        "saree collections",
        "banarasi collection",
        "kanjivaram collection",
        "indian handloom weaves",
        "saree by occasion",
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
  { key: "festive", label: "Festive & Everyday" },
];

function CollectionsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredCollections = useMemo(() => {
    if (activeTab === "wedding") {
      return COLLECTIONS.filter((c) => c.slug.includes("wedding") || c.slug.includes("kanjivaram"));
    }
    if (activeTab === "artisan") {
      return COLLECTIONS.filter(
        (c) =>
          c.slug.includes("banarasi") || c.slug.includes("silk") || c.slug.includes("kanjivaram"),
      );
    }
    if (activeTab === "festive") {
      return COLLECTIONS.filter((c) => c.slug.includes("festive") || c.slug.includes("everyday"));
    }
    return COLLECTIONS;
  }, [activeTab]);

  return (
    <>
      {/* Hero Banner */}
      <section className="relative border-b border-gold/20 bg-beige/25">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 py-12 md:py-18">
          <nav className="mb-4 flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-taupe font-medium">
            <Link to="/" className="hover:text-maroon transition-colors">
              Home
            </Link>
            <span className="text-gold/60">/</span>
            <span className="text-maroon">Collections</span>
          </nav>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-maroon/20 bg-maroon/5 text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-maroon font-medium mb-3">
                Authentic Heritage Looms
              </span>
              <h1 className="font-serif text-4xl leading-tight text-maroon md:text-6xl">
                The Collections
              </h1>
              <p className="mt-3 max-w-2xl text-sm md:text-base text-maroon/80 leading-relaxed">
                Explore our edits — each grouped by weave style, occasion technique, and the
                occasion it was born to celebrate.
              </p>
            </div>

            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-ivory/80 border border-gold/45 shadow-sm shrink-0">
              <Sparkles className="h-5 w-5 text-gold" />
              <span className="uppercase tracking-[0.22em] text-[10px] md:text-[11px] text-maroon font-medium leading-tight">
                6 Curated Edits
                <br />
                100% Handloom Guaranteed
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-ivory py-6 border-b border-gold/25 sticky top-20 z-20 backdrop-blur-md bg-ivory/95">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 md:gap-3">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2 rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-maroon text-ivory shadow-md"
                    : "border border-gold/40 text-maroon hover:border-maroon hover:bg-beige/30"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Link
            to="/shop"
            className="hidden md:inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-maroon font-medium border-b border-maroon/40 hover:text-gold hover:border-gold transition-colors whitespace-nowrap"
          >
            Browse All Products →
          </Link>
        </div>
      </section>

      {/* Interactive Collection Showcases */}
      <section className="bg-ivory py-12 md:py-20">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 space-y-16 md:space-y-24">
          {filteredCollections.map((c, index) => {
            const isEven = index % 2 === 0;
            const count = PRODUCTS.filter((p) =>
              p.category.some((cat) => c.slug.includes(cat) || cat.includes(c.slug)),
            ).length;

            return (
              <div
                key={c.slug}
                className="group relative overflow-hidden rounded-3xl border border-gold/50 bg-beige/15 p-6 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                    isEven ? "" : "lg:grid-flow-dense"
                  }`}
                >
                  {/* Image Column */}
                  <div
                    className={`lg:col-span-6 relative overflow-hidden rounded-2xl border border-gold/40 shadow-md ${
                      isEven ? "" : "lg:col-start-7"
                    }`}
                  >
                    <div className="aspect-[4/3] md:aspect-[16/10] w-full overflow-hidden">
                      <img
                        src={c.img}
                        alt={c.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Region Tag */}
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory/90 backdrop-blur-md text-[10px] uppercase tracking-widest text-maroon font-medium shadow-md">
                      <MapPin className="h-3 w-3 text-gold" />
                      <span>Artisan Cluster Edit</span>
                    </div>
                  </div>

                  {/* Copy & Details Column */}
                  <div
                    className={`lg:col-span-6 flex flex-col justify-center ${
                      isEven ? "" : "lg:col-start-1"
                    }`}
                  >
                    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3">
                      <span className="h-px w-8 bg-gold" />
                      <span>Collection 0{index + 1}</span>
                    </div>

                    <h2 className="font-serif text-3xl md:text-5xl text-maroon font-normal leading-tight">
                      {c.name}
                    </h2>

                    <p className="mt-4 text-sm md:text-base text-ink/80 leading-relaxed">
                      {c.tagline}. Each saree in this collection is hand-selected directly from
                      master weavers, preserving museum-grade artistry, natural silk purity, and
                      authentic Zari embellishment.
                    </p>

                    {/* Features Tags */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-lg border border-gold/40 bg-ivory text-[10px] uppercase tracking-widest text-maroon font-medium">
                        100% Pure Silk
                      </span>
                      <span className="px-3.5 py-1 rounded-lg border border-gold/40 bg-ivory text-[10px] uppercase tracking-widest text-maroon font-medium">
                        Handloom Certified
                      </span>
                      <span className="px-3 py-1 rounded-lg border border-gold/40 bg-ivory text-[10px] uppercase tracking-widest text-maroon font-medium">
                        Real Zari Work
                      </span>
                    </div>

                    {/* CTA Row */}
                    <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-gold/30 pt-6">
                      <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-maroon text-ivory text-[11px] tracking-[0.25em] uppercase hover:bg-wine transition-all shadow-md group/btn"
                      >
                        <span>Explore Collection</span>
                        <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                      <span className="text-xs text-taupe font-serif italic">
                        {count > 0
                          ? `${count}+ curated sarees available`
                          : "Exclusive limited edition"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Guide Banner */}
      <section className="bg-beige/30 py-16 border-t border-gold/30">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 text-center max-w-3xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.3em] text-maroon font-medium">
            Private Assistance
          </span>
          <h3 className="font-serif text-3xl md:text-4xl text-maroon mt-2">
            Not sure which weave suits your event?
          </h3>
          <p className="text-sm text-maroon/80 mt-3 leading-relaxed">
            Our saree stylists are available on WhatsApp to guide you through fabric feel, drape
            weight, and blouse customisations.
          </p>
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gold text-maroon font-bold text-[11px] tracking-[0.25em] uppercase hover:bg-maroon hover:text-ivory transition-all shadow-md"
          >
            Chat with a Saree Stylist →
          </a>
        </div>
      </section>
    </>
  );
}
