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
        "New saree, lehenga and dress material arrivals, added weekly across our 8 stores. Latest Banarasi, Kanjivaram and party wear styles.",
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
      <CategoryPage
        eyebrow="Weekly Drop"
        title="New Arrivals — Fresh From Loom"
        crumb="New Arrivals"
        copy="New stock arrives weekly across all eight stores."
        heroImg={IMG.colKanjivaram}
        category="new-arrivals"
        showHero={false}
      />
    </div>
  );
}
