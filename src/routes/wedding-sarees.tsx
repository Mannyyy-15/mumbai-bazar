import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";
import { IMG } from "@/lib/site-data";
import { fetchShopifyProducts } from "@/lib/shopify";
import { seo, jsonLd } from "@/lib/seo";
import { breadcrumbSchema, itemListSchema } from "@/lib/structured-data";

export const Route = createFileRoute("/wedding-sarees")({
  loader: async () => ({ products: await fetchShopifyProducts(50).catch(() => []) }),
  head: ({ loaderData }) => {
    const categoryProducts = (loaderData?.products ?? []).filter((p) =>
      p.category.includes("wedding-sarees"),
    );
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
        jsonLd(itemListSchema(categoryProducts, "Wedding & Bridal Sarees", "/wedding-sarees")),
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

function WeddingSareesPage() {
  return (
    <div className="w-full bg-ivory">
      <CategoryPage
        eyebrow="Trousseau Curation"
        title="Wedding & Bridal Sarees"
        crumb="Wedding Sarees"
        copy="Rich wedding sarees for the bride, and for every function around it."
        heroImg={IMG.colFestive}
        category="wedding-sarees"
        showHero={false}
        contentKey="wedding-sarees"
      />
    </div>
  );
}
