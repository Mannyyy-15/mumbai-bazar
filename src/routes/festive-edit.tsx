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
      <CategoryPage
        eyebrow="Festive & Occasion"
        title="Festive & Celebration Sarees"
        crumb="Festive Edit"
        copy="Sparkling zari and festive colors curated for Diwali, pujas, and evening galas."
        heroImg={IMG.colFestive}
        category="festive-edit"
        showHero={false}
      />
    </div>
  );
}
