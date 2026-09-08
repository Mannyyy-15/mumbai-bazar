import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";
import { IMG } from "@/lib/site-data";
import { fetchShopifyProducts } from "@/lib/shopify";
import { seo, jsonLd } from "@/lib/seo";
import { breadcrumbSchema, itemListSchema } from "@/lib/structured-data";

export const Route = createFileRoute("/everyday-sarees")({
  loader: async () => ({ products: await fetchShopifyProducts(50).catch(() => []) }),
  head: ({ loaderData }) => {
    const categoryProducts = (loaderData?.products ?? []).filter((p) =>
      p.category.includes("everyday-sarees"),
    );
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
            categoryProducts,
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
