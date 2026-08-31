import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";
import { IMG, PRODUCTS } from "@/lib/site-data";
import { seo, jsonLd } from "@/lib/seo";
import { breadcrumbSchema, itemListSchema } from "@/lib/structured-data";

export const Route = createFileRoute("/silk-sarees")({
  head: () => {
    const { meta, links } = seo({
      title: "Silk Sarees: Banarasi & Kanjivaram | Mumbai Bazar",
      description:
        "Silk and silk-blend sarees in Banarasi, Kanjivaram and Paithani styles. See and drape every piece in store across Nalasopara, Virar, Bhayandar and Goregaon.",
      path: "/silk-sarees",
      keywords: [
        "pure silk saree",
        "banarasi silk saree",
        "kanjivaram silk saree",
        "paithani saree",
        "silk saree shop nalasopara",
        "silk saree virar",
      ],
    });
    return {
      meta,
      links,
      scripts: [
        jsonLd(
          itemListSchema(
            PRODUCTS.filter((p) => p.category.includes("silk-sarees")),
            "Pure Silk Sarees",
            "/silk-sarees",
          ),
        ),
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Silk Sarees", path: "/silk-sarees" },
          ]),
        ),
      ],
    };
  },
  component: SilkSareesPage,
});

function SilkSareesPage() {
  return (
    <div className="w-full bg-ivory">
      <CategoryPage
        eyebrow="Heirloom Collection"
        title="Silk & Silk-Blend Sarees"
        crumb="Silk Sarees"
        copy="Timeless silk weaves designed to be treasured for lifetime celebrations."
        heroImg={IMG.colBanarasi}
        category="silk-sarees"
        showHero={false}
        contentKey="silk-sarees"
      />
    </div>
  );
}
