import { createFileRoute } from "@tanstack/react-router";
import { Feather, Sun, ShieldCheck, Sparkles, Heart } from "lucide-react";
import { CategoryPage } from "@/components/site/CategoryPage";
import { IMG } from "@/lib/site-data";

export const Route = createFileRoute("/everyday-sarees")({
  head: () => ({
    meta: [
      { title: "Everyday Sarees — Soft Silks & Daily Drapes | Mumbai Bazar" },
      { name: "description", content: "Lightweight soft silks, linen blends, and effortless daily drapes for office wear and family gatherings." },
      { property: "og:title", content: "Everyday Sarees — Mumbai Bazar" },
      { property: "og:description", content: "Elegance for every single day." },
    ],
  }),
  component: EverydaySareesPage,
});

const FEATURES = [
  { icon: Feather, title: "Featherlight Weight", desc: "Under 450 grams for zero shoulder fatigue during long working hours." },
  { icon: Sun, title: "Breathable Weave", desc: "Natural silk-cotton and soft mulberry weaves that stay cool all day." },
  { icon: ShieldCheck, title: "Wrinkle Resistant", desc: "Formulated for minimal creasing, ideal for travel and daily drapes." },
];

function EverydaySareesPage() {
  return (
    <div className="w-full bg-ivory">
      {/* Everyday Hero */}
      <section className="relative border-b border-gold/50 bg-beige/30 py-16 md:py-24">
        <div className="mx-auto max-w-[1360px] px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 bg-beige/80 text-maroon px-3.5 py-1 text-xs font-semibold uppercase tracking-wider border border-gold/50">
                <Heart className="h-3.5 w-3.5 text-gold-deep" /> Daily Elegance
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink leading-tight">
                Effortless Everyday Drapes
              </h1>
              <p className="text-base md:text-lg text-taupe leading-relaxed">
                Who says silk is reserved only for grand weddings? Discover soft silks, chanderi tissue, and fluid drapes designed for office meetings, brunch with friends, and quiet family evenings.
              </p>

              <div className="grid gap-4 sm:grid-cols-3 pt-4">
                {FEATURES.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="border border-gold/40 bg-ivory p-4 shadow-sm">
                    <Icon className="h-5 w-5 text-maroon" />
                    <h4 className="font-serif text-base text-ink font-medium mt-2">{title}</h4>
                    <p className="text-xs text-taupe mt-1 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-3 border border-gold/50 pointer-events-none" />
              <img
                src={IMG.colPuresilk}
                alt="Everyday Soft Silk Saree"
                className="aspect-[4/5] w-full object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Filterable Catalog Grid */}
      <CategoryPage
        eyebrow="Daily Soft Silks"
        title="Explore Everyday Sarees"
        crumb="Everyday Sarees"
        copy="Soft, breathable drapes crafted for everyday luxury and effortless style."
        heroImg={IMG.colPuresilk}
        category="everyday-sarees"
        showHero={false}
      />
    </div>
  );
}


