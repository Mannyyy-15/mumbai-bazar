import { useLoaderData } from "react-router";
import type { Route } from "./+types/silk-sarees";
import { SITE, getSeoMeta, jsonLdScript } from "~/lib/seo";
import { lowestPriceLabel } from "~/lib/commerce";
import { breadcrumbSchema, collectionSchema } from "~/lib/structured-data";
import { fetchLiveProducts } from "~/lib/shopify.server";
import { CategoryPage } from "~/components/CategoryPage";
import { IMG } from "~/lib/site-data";

/*
  Previously promised "Banarasi, Kanjivaram, Paithani and tissue silk ...
  heirloom wedding drapes" and "pure silk" -- none of which the online
  catalogue sells (it is art silk and silk-blend, Rs 649-1,699), and
  "heirloom" is a banned word in this project's copy rules.

  Retargeted at "silk saree under 1000" / "art silk saree", which is high
  in autocomplete and exactly what is in stock.
*/
export const meta: Route.MetaFunction = ({ data }) => {
  const from = lowestPriceLabel(data?.products ?? []);
  return getSeoMeta({
    title: "Art Silk & Silk-Blend Sarees Online | Mumbai Bazar",
    description: `Art silk and silk-blend sarees with zari borders${
      from ? `, from ${from}` : ""
    }. Free delivery on prepaid orders, or see and handle any piece in our stores before you buy.`,
    path: "/silk-sarees",
    keywords: [
      "silk saree under 1000",
      "art silk saree",
      "silk blend saree",
      "soft silk saree online",
      "zari border silk saree",
      "silk saree vasai virar",
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
        eyebrow="Silk & Silk-Blend"
        title="Silk & Silk-Blend Sarees"
        crumb="Silk Sarees"
        copy="Art silk and silk-blend sarees with zari borders — lighter to wear, and far easier on the budget than pure silk."
        heroImg={IMG.colBanarasi}
        category="silk-sarees"
        showHero={false}
        contentKey="silk-sarees"
        products={products}
      />
    </div>
  );
}
