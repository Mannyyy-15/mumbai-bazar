import { useLoaderData } from "react-router";
import type { Route } from "./+types/festive-edit";
import { SITE, getSeoMeta, jsonLdScript } from "~/lib/seo";
import { breadcrumbSchema, collectionSchema } from "~/lib/structured-data";
import { fetchLiveProducts } from "~/lib/shopify.server";
import { CategoryPage } from "~/components/CategoryPage";
import { IMG } from "~/lib/site-data";

export const meta: Route.MetaFunction = () => {
  return getSeoMeta({
    title: "Festive Sarees for Diwali, Puja & Parties | Mumbai Bazar",
    description:
      "Cocktail sarees, party-wear tissue, organza drapes and festive silks. Shop colourful festival drapes at 8 Mumbai Bazar stores across Vasai Virar and online.",
    path: "/festive-edit",
    keywords: [
      "festive sarees",
      "diwali sarees",
      "party wear sarees",
      "cocktail sarees",
      "organza festive saree",
      "tissue saree online",
    ],
  });
};

export async function loader({ context }: Route.LoaderArgs) {
  const products = await fetchLiveProducts(context, 100);
  return { products };
}

export default function FestiveEditRoute() {
  const { products } = useLoaderData<typeof loader>();

  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Festive Edit", path: "/festive-edit" },
    ]),
    collectionSchema(
      "Festive & Celebration Sarees",
      "Shiny zari and bright colours for Diwali, pujas and evening parties.",
      "/festive-edit",
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
        eyebrow="Festive & Occasion"
        title="Festive & Celebration Sarees"
        crumb="Festive Edit"
        copy="Shiny zari and bright colours for Diwali, pujas and evening parties."
        heroImg={IMG.colFestive}
        category="festive-edit"
        showHero={false}
        contentKey="festive-edit"
        products={products}
      />
    </div>
  );
}
