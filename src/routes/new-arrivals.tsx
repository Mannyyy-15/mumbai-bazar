import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Clock, ArrowUpRight, Flame, ShieldCheck } from "lucide-react";
import { CategoryPage } from "@/components/site/CategoryPage";
import { GoldRule } from "@/components/site/Motif";
import { IMG, PRODUCTS } from "@/lib/site-data";
import { seo, jsonLd } from "@/lib/seo";
import { breadcrumbSchema, itemListSchema } from "@/lib/structured-data";

export const Route = createFileRoute("/new-arrivals")({
  head: () => {
    const { meta, links } = seo({
      title: "New Arrival Sarees | Latest Handwoven Silks — Mumbai Bazar",
      description:
        "The newest handwoven sarees fresh from Varanasi and Kanchipuram looms. Latest Banarasi, Kanjivaram and tissue silk designs added weekly at Mumbai Bazar.",
      path: "/new-arrivals",
      keywords: [
        "new saree designs",
        "latest saree collection",
        "new arrival sarees",
        "new banarasi saree",
        "2026 saree trends",
      ],
    });
    return {
      meta,
      links,
      scripts: [
        jsonLd(
          itemListSchema(
            PRODUCTS.filter((p) => p.category.includes("new-arrivals")),
            "New Arrival Sarees",
            "/new-arrivals",
          ),
        ),
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "New Arrivals", path: "/new-arrivals" },
          ]),
        ),
      ],
    };
  },
  component: NewArrivalsPage,
});

function NewArrivalsPage() {
  return (
    <div className="w-full bg-ivory">
      {/* Bespoke New Arrivals Hero */}
      <section className="relative border-b border-gold/50 bg-beige/30 py-16 md:py-24">
        <div className="mx-auto max-w-[1360px] px-4 md:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 bg-maroon text-ivory px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                <Flame className="h-3.5 w-3.5 text-gold" /> Just Unboxed
              </span>
              <span className="inline-flex items-center gap-1.5 border border-gold/50 bg-ivory px-3 py-1 text-xs text-ink">
                <Clock className="h-3.5 w-3.5 text-gold-deep" /> Updated 2 Hours Ago
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink leading-tight">
              Fresh From The Looms
            </h1>

            <p className="text-base md:text-lg text-taupe leading-relaxed max-w-xl">
              Be the first to drape our newest batch of handwoven silks—freshly off the looms of
              Varanasi, Kanchipuram, and Chanderi. Limited edition pieces with zero repeat weaves.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-ink">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-maroon" />
                <span>100% Pure Silk Mark</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold-deep" />
                <span>Single-Piece Exclusives</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 border border-gold/50 pointer-events-none" />
            <div className="relative aspect-[4/5] overflow-hidden shadow-xl">
              <img
                src={IMG.colKanjivaram}
                alt="New Arrival Kanjivaram Silk Saree"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute bottom-4 left-4 right-4 border border-gold/50 bg-ivory/95 p-4 backdrop-blur-md">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold-deep">
                  Spotlight Weave
                </span>
                <h3 className="font-serif text-lg text-ink">Royal Crimson Kanjivaram Brocade</h3>
                <p className="text-xs text-taupe mt-0.5">
                  Hand-loomed in Kanchipuram · Pure Gold Zari
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Category Grid Component */}
      <CategoryPage
        eyebrow="Weekly Drop"
        title="Explore The Latest Additions"
        crumb="New Arrivals"
        copy="Each piece is handcrafted over 120+ hours by master artisans."
        heroImg={IMG.colKanjivaram}
        category="new-arrivals"
        showHero={false}
      />
    </div>
  );
}
