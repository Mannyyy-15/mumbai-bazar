import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Gift, Flame, PartyPopper } from "lucide-react";
import { CategoryPage } from "@/components/site/CategoryPage";
import { IMG, PRODUCTS } from "@/lib/site-data";
import { seo, jsonLd } from "@/lib/seo";
import { breadcrumbSchema, itemListSchema } from "@/lib/structured-data";

export const Route = createFileRoute("/festive-edit")({
  head: () => {
    const { meta, links } = seo({
      title: "Festive Sarees Online | Diwali, Ganesh Chaturthi & Navratri — Mumbai Bazar",
      description:
        "Shop festive sarees for Diwali, Ganesh Chaturthi, Navratri and Karwa Chauth. Tissue, organza and silk drapes in celebration-ready colours, delivered across India.",
      path: "/festive-edit",
      keywords: [
        "festive saree",
        "diwali saree",
        "ganesh chaturthi saree",
        "navratri saree",
        "karwa chauth saree",
        "festival saree online",
      ],
    });
    return {
      meta,
      links,
      scripts: [
        jsonLd(
          itemListSchema(
            PRODUCTS.filter((p) => p.category.includes("festive-edit")),
            "Festive Sarees",
            "/festive-edit",
          ),
        ),
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Festive Edit", path: "/festive-edit" },
          ]),
        ),
      ],
    };
  },
  component: FestiveEditPage,
});

const PALETTE = [
  { name: "Royal Crimson", hex: "#641F2A", desc: "Classic auspicious red & zari" },
  { name: "Peacock Emerald", hex: "#1A3E35", desc: "Rich jewel-toned brocades" },
  { name: "Midnight Violet", hex: "#2D1F3F", desc: "Deep evening ceremony hues" },
  { name: "Antique Gold", hex: "#B69054", desc: "Shimmering tissue zari weaves" },
];

function FestiveEditPage() {
  return (
    <div className="w-full bg-ivory">
      {/* Festive Hero */}
      <section className="relative border-b border-gold/50 bg-beige/30 py-16 md:py-24">
        <div className="mx-auto max-w-[1360px] px-4 md:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-maroon text-ivory px-3.5 py-1 text-xs font-semibold uppercase tracking-widest">
              <PartyPopper className="h-4 w-4 text-gold" /> Celebration Specials
            </span>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl text-ink leading-tight">
              The Festive Curation
            </h1>
            <p className="mt-4 text-base md:text-lg text-taupe leading-relaxed">
              Step into the light of celebrations with rich jewel-toned Banarasis, golden Tissue
              drapes, and intricate kadwa zari motifs. Handloomed to make every puja and evening
              gathering unforgettable.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PALETTE.map((p) => (
                <div key={p.name} className="border border-gold/40 bg-ivory p-3">
                  <div className="h-6 w-full rounded-sm" style={{ backgroundColor: p.hex }} />
                  <h4 className="font-serif text-sm font-medium text-ink mt-2">{p.name}</h4>
                  <p className="text-[10px] text-taupe mt-0.5">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Filterable Catalog Grid */}
      <CategoryPage
        eyebrow="Festive & Occasion"
        title="Explore Festive Sarees"
        crumb="Festive Edit"
        copy="Sparkling zari and festive colors curated for Diwali, pujas, and evening galas."
        heroImg={IMG.colFestive}
        category="festive-edit"
        showHero={false}
      />
    </div>
  );
}
