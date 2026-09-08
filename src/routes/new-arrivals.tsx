import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";
import { IMG } from "@/lib/site-data";
import { fetchShopifyProducts } from "@/lib/shopify";
import { seo, jsonLd } from "@/lib/seo";
import { breadcrumbSchema, itemListSchema } from "@/lib/structured-data";

export const Route = createFileRoute("/new-arrivals")({
  loader: async () => ({ products: await fetchShopifyProducts(50).catch(() => []) }),
  head: ({ loaderData }) => {
    const categoryProducts = (loaderData?.products ?? []).filter((p) =>
      p.category.includes("new-arrivals"),
    );
    const { meta, links } = seo({
      title: "New Arrival Sarees | Latest Drops | Mumbai Bazar",
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
            categoryProducts,
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
        contentKey="new-arrivals"
      />
    </div>
  );
}
