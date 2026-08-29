import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Sparkles, Scissors, MessageCircle, Crown } from "lucide-react";
import { CategoryPage } from "@/components/site/CategoryPage";
import { IMG, PRODUCTS } from "@/lib/site-data";
import { seo, jsonLd } from "@/lib/seo";
import { breadcrumbSchema, itemListSchema } from "@/lib/structured-data";

export const Route = createFileRoute("/wedding-sarees")({
  head: () => {
    const { meta, links } = seo({
      title: "Bridal & Wedding Sarees Online | Kanjivaram & Banarasi — Mumbai Bazar",
      description:
        "Shop handwoven bridal sarees for weddings, sangeet and reception. Silk Mark certified Kanjivaram and Banarasi trousseau silks with free India shipping and expert styling.",
      path: "/wedding-sarees",
      keywords: [
        "bridal saree online",
        "wedding saree",
        "kanjivaram bridal saree",
        "banarasi wedding saree",
        "trousseau saree",
        "bridal saree Mumbai",
        "wedding saree Vasai Virar",
      ],
    });
    return {
      meta,
      links,
      scripts: [
        jsonLd(
          itemListSchema(
            PRODUCTS.filter((p) => p.category.includes("wedding-sarees")),
            "Wedding & Bridal Sarees",
            "/wedding-sarees",
          ),
        ),
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Wedding Sarees", path: "/wedding-sarees" },
          ]),
        ),
      ],
    };
  },
  component: WeddingSareesPage,
});

const ROLES = [
  {
    role: "The Bride",
    desc: "Heavy gold brocade Kanjivarams & royal crimson Banarasis",
    icon: Crown,
  },
  {
    role: "Mother of the Bride",
    desc: "Regal Paithani & subtle antique gold tissue drapes",
    icon: Heart,
  },
  {
    role: "Sangeet & Cocktail",
    desc: "Lightweight metallic tissue & fluid organza silk",
    icon: Sparkles,
  },
  { role: "Bridesmaids", desc: "Coordinated pastel silks & modern zari borders", icon: Scissors },
];

function WeddingSareesPage() {
  const waMsg = encodeURIComponent(
    "Hello Mumbai Bazar Bridal Concierge, I would like to schedule a private trousseau styling session.",
  );

  return (
    <div className="w-full bg-ivory">
      {/* Bridal Trousseau Hero */}
      <section className="relative border-b border-gold/50 bg-wine text-ivory py-16 md:py-24">
        <div className="mx-auto max-w-[1360px] px-4 md:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 bg-gold/20 text-gold px-3.5 py-1 text-xs font-semibold uppercase tracking-widest border border-gold/40">
              <Crown className="h-4 w-4 text-gold" /> The Bridal Edit
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight">
              Regal Wedding Silks
            </h1>
            <p className="text-base md:text-lg text-ivory/85 leading-relaxed max-w-xl">
              Handwoven with pure silver and gold zari to commemorate your grandest celebrations.
              Curated for brides, trousseau collections, and wedding galas.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href={`https://wa.me/919999999999?text=${waMsg}`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary bg-gold hover:bg-gold-deep text-ink font-semibold inline-flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" /> Book Trousseau Stylist
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {ROLES.map(({ role, desc, icon: Icon }) => (
              <div key={role} className="border border-gold/40 bg-ivory/10 p-5 backdrop-blur-sm">
                <span className="grid h-10 w-10 place-items-center bg-gold/20 text-gold rounded-full">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-serif text-xl text-ivory font-medium">{role}</h3>
                <p className="mt-1 text-xs text-ivory/70 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Filterable Catalog Grid */}
      <CategoryPage
        eyebrow="Trousseau Curation"
        title="Explore Wedding Sarees"
        crumb="Wedding Sarees"
        copy="Handloomed royal drapes designed for bridal ceremonies and grand celebrations."
        heroImg={IMG.colFestive}
        category="wedding-sarees"
        showHero={false}
      />
    </div>
  );
}
