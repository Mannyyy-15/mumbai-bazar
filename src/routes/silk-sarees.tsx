import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Award, MapPin, Sparkles } from "lucide-react";
import { CategoryPage } from "@/components/site/CategoryPage";
import { IMG, PRODUCTS } from "@/lib/site-data";
import { seo, jsonLd } from "@/lib/seo";
import { breadcrumbSchema, itemListSchema } from "@/lib/structured-data";

export const Route = createFileRoute("/silk-sarees")({
  head: () => {
    const { meta, links } = seo({
      title: "Silk Sarees | Banarasi, Kanjivaram & Paithani Styles — Mumbai Bazar",
      description:
        "Silk and silk-blend sarees in Banarasi, Kanjivaram and Paithani styles. See and drape every piece in store across Nalasopara, Virar, Bhayandar and Goregaon.",
      path: "/silk-sarees",
      keywords: [
        "pure silk saree",
        "banarasi silk saree",
        "kanjivaram silk saree",
        "paithani saree",
        "silk mark certified saree",
        "handloom silk saree online",
      ],
    });
    return {
      meta,
      links,
      scripts: [
        jsonLd(
          itemListSchema(
            PRODUCTS.filter((p) => p.category.includes("silk-sarees")),
            "Pure Silk Sarees",
            "/silk-sarees",
          ),
        ),
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Silk Sarees", path: "/silk-sarees" },
          ]),
        ),
      ],
    };
  },
  component: SilkSareesPage,
});

const CLUSTERS = [
  { name: "Varanasi", weave: "Banarasi Katantan Silk", img: IMG.colBanarasi },
  { name: "Kanchipuram", weave: "Pure Mulberry Kanjivaram", img: IMG.colKanjivaram },
  { name: "Chanderi", weave: "Tissue & Silk Cotton", img: IMG.colPuresilk },
  { name: "Paithan", weave: "Real Gold Zari Paithani", img: IMG.colFestive },
];

function SilkSareesPage() {
  return (
    <div className="w-full bg-ivory">
      {/* Silk Heritage Hero */}
      <section className="relative border-b border-gold/50 bg-beige/30 py-16 md:py-24">
        <div className="mx-auto max-w-[1360px] px-4 md:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-maroon/10 text-maroon px-3 py-1 text-xs font-semibold uppercase tracking-widest border border-maroon/30">
              <Award className="h-4 w-4 text-gold-deep" /> Available In Store
            </span>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl text-ink leading-tight">
              Silk & Silk-Blend Sarees
            </h1>
            <p className="mt-4 text-base md:text-lg text-taupe leading-relaxed">
              Every drape in our silk collection is crafted from 100% pure mulberry silk and tested
              zari. Sourced directly from hereditary weaving families across India’s legendary silk
              corridors.
            </p>
          </div>

          {/* Cluster Showcase Cards */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {CLUSTERS.map((c) => (
              <div
                key={c.name}
                className="group border border-gold/50 bg-ivory p-3 transition-all hover:border-maroon"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-gold-deep font-semibold">
                  <MapPin className="h-3 w-3" /> {c.name}
                </div>
                <h4 className="font-serif text-sm text-ink font-medium mt-0.5">{c.weave}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Filterable Catalog Grid */}
      <CategoryPage
        eyebrow="Heirloom Collection"
        title="Explore Pure Silk Sarees"
        crumb="Silk Sarees"
        copy="Timeless silk weaves designed to be treasured for lifetime celebrations."
        heroImg={IMG.colBanarasi}
        category="silk-sarees"
        showHero={false}
      />
    </div>
  );
}
