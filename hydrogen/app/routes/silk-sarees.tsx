import { useLoaderData } from "react-router";
import type { Route } from "./+types/silk-sarees";
import { SITE, getSeoMeta, jsonLdScript } from "~/lib/seo";
import { breadcrumbSchema, collectionSchema } from "~/lib/structured-data";
import { fetchLiveProducts } from "~/lib/shopify.server";
import { CategoryPage } from "~/components/CategoryPage";
import { IMG } from "~/lib/site-data";

export const meta: Route.MetaFunction = () => {
  return getSeoMeta({
    title: "Pure Silk & Silk-Blend Sarees | Mumbai Bazar",
    description:
      "Banarasi, Kanjivaram, Paithani and tissue silk sarees. Shop heirloom wedding drapes and festive silks across 8 Mumbai Bazar stores and online with pan-India delivery.",
    path: "/silk-sarees",
    keywords: [
      "pure silk sarees",
      "banarasi silk saree",
      "kanjivaram saree mumbai",
      "paithani saree shop",
      "silk saree vasai virar",
      "bridal silk saree",
    ],
  });
};

export async function loader({ context }: Route.LoaderArgs) {
  const products = await fetchLiveProducts(context, 100);
  return { products };
}

export default function SilkSareesRoute() {
  const { products } = useLoaderData<typeof loader>();

  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Silk Sarees", path: "/silk-sarees" },
    ]),
    collectionSchema(
      "Silk & Silk-Blend Sarees",
      "Timeless silk weaves designed to be treasured for lifetime celebrations.",
      "/silk-sarees",
      products.slice(0, 12),
    ),
  ];

  return (
    <div className="w-full bg-ivory">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }}
      />
      <CategoryPage
        eyebrow="Heirloom Collection"
        title="Silk & Silk-Blend Sarees"
        crumb="Silk Sarees"
        copy="Timeless silk weaves designed to be treasured for lifetime celebrations."
        heroImg={IMG.colBanarasi}
        category="silk-sarees"
        showHero={false}
        contentKey="silk-sarees"
        products={products}
      />
    </div>
  );
}
