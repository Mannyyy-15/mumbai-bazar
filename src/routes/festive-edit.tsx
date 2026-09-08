import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";
import { IMG } from "@/lib/site-data";
import { fetchShopifyProducts } from "@/lib/shopify";
import { seo, jsonLd } from "@/lib/seo";
import { breadcrumbSchema, itemListSchema } from "@/lib/structured-data";

export const Route = createFileRoute("/festive-edit")({
  loader: async () => ({ products: await fetchShopifyProducts(50).catch(() => []) }),
  head: ({ loaderData }) => {
    const categoryProducts = (loaderData?.products ?? []).filter((p) =>
      p.category.includes("festive-edit"),
    );
    const { meta, links } = seo({
      title: "Festive Sarees for Diwali & Navratri | Mumbai Bazar",
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
            categoryProducts,
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
        contentKey="festive-edit"
      />
    </div>
  );
}
