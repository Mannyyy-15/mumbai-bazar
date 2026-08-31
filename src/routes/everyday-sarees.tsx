import { createFileRoute } from "@tanstack/react-router";
import { Feather, Sun, ShieldCheck, Sparkles, Heart } from "lucide-react";
import { CategoryPage } from "@/components/site/CategoryPage";
import { IMG, PRODUCTS } from "@/lib/site-data";
import { seo, jsonLd } from "@/lib/seo";
import { breadcrumbSchema, itemListSchema } from "@/lib/structured-data";

export const Route = createFileRoute("/everyday-sarees")({
  head: () => {
    const { meta, links } = seo({
      title: "Everyday & Office Wear Sarees | Mumbai Bazar",
      description:
        "Lightweight everyday sarees for office wear, family functions and daily drapes. Soft silks, cotton blends and easy-care fabrics with free shipping across India.",
      path: "/everyday-sarees",
      keywords: [
        "everyday saree",
        "office wear saree",
        "daily wear saree",
        "cotton saree online",
        "soft silk saree",
        "lightweight saree",
      ],
    });
    return {
      meta,
      links,
      scripts: [
        jsonLd(
          itemListSchema(
            PRODUCTS.filter((p) => p.category.includes("everyday-sarees")),
            "Everyday Sarees",
            "/everyday-sarees",
          ),
        ),
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Everyday Sarees", path: "/everyday-sarees" },
          ]),
        ),
      ],
    };
  },
  component: EverydaySareesPage,
});

const FEATURES = [
  {
    icon: Feather,
    title: "Featherlight Weight",
    desc: "Under 450 grams for zero shoulder fatigue during long working hours.",
  },
  {
    icon: Sun,
    title: "Breathable Weave",
    desc: "Natural silk-cotton and soft mulberry weaves that stay cool all day.",
  },
  {
    icon: ShieldCheck,
    title: "Wrinkle Resistant",
    desc: "Formulated for minimal creasing, ideal for travel and daily drapes.",
  },
];

function EverydaySareesPage() {
  return (
    <div className="w-full bg-ivory">
      <CategoryPage
        eyebrow="Daily Soft Silks"
        title="Everyday & Ready-to-Wear Sarees"
        crumb="Everyday Sarees"
        copy="Soft, breathable drapes crafted for everyday luxury and effortless style."
        heroImg={IMG.colPuresilk}
        category="everyday-sarees"
        showHero={false}
        contentKey="everyday-sarees"
      />
    </div>
  );
}
