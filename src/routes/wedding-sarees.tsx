import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Sparkles, Scissors, MessageCircle, Crown } from "lucide-react";
import { CategoryPage } from "@/components/site/CategoryPage";
import { IMG, PRODUCTS } from "@/lib/site-data";
import { seo, jsonLd } from "@/lib/seo";
import { breadcrumbSchema, itemListSchema } from "@/lib/structured-data";

export const Route = createFileRoute("/wedding-sarees")({
  head: () => {
    const { meta, links } = seo({
      title: "Dulhan Sarees & Bridal Lehengas | Mumbai Bazar",
      description:
        "Dulhan sarees, designer lehengas and bridal wear for weddings, sangeet and reception. Visit our Nalasopara East store for the widest bridal range, or shop online.",
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
  return (
    <div className="w-full bg-ivory">
      <CategoryPage
        eyebrow="Trousseau Curation"
        title="Wedding & Bridal Sarees"
        crumb="Wedding Sarees"
        copy="Handloomed royal drapes designed for bridal ceremonies and grand celebrations."
        heroImg={IMG.colFestive}
        category="wedding-sarees"
        showHero={false}
        contentKey="wedding-sarees"
      />
    </div>
  );
}
