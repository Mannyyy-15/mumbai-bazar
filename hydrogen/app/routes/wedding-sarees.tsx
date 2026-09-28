import { useLoaderData } from "react-router";
import type { Route } from "./+types/wedding-sarees";
import { SITE, getSeoMeta, jsonLdScript } from "~/lib/seo";
import { breadcrumbSchema, collectionSchema } from "~/lib/structured-data";
import { fetchLiveProducts } from "~/lib/shopify.server";
import { CategoryPage } from "~/components/CategoryPage";
import { IMG } from "~/lib/site-data";

export const meta: Route.MetaFunction = () => {
  return getSeoMeta({
    title: "Dulhan Sarees & Bridal Lehengas | Mumbai Bazar",
    description:
      "Dulhan sarees, designer lehengas and bridal wear for weddings, sangeet and reception. Visit our Nalasopara East store for the widest bridal range, or shop online.",
    path: "/wedding-sarees",
    keywords: [
      "dulhan sarees",
      "bridal sarees mumbai",
      "wedding sarees online",
      "bridal lehenga nalasopara",
      "sangeet sarees",
      "reception sarees",
      "zari butti wedding saree",
    ],
  });
};

export async function loader({ context }: Route.LoaderArgs) {
  const products = await fetchLiveProducts(context, 100);
  return { products };
}

export default function WeddingSareesRoute() {
  const { products } = useLoaderData<typeof loader>();

  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Wedding Sarees", path: "/wedding-sarees" },
    ]),
    collectionSchema(
      "Wedding & Bridal Sarees",
      "Dulhan sarees and designer bridal lehengas.",
      "/wedding-sarees",
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
        eyebrow="Trousseau Curation"
        title="Wedding & Bridal Sarees"
        crumb="Wedding Sarees"
        copy="Rich wedding sarees for the bride, and for every function around it."
        heroImg={IMG.colFestive}
        category="wedding-sarees"
        showHero={false}
        contentKey="wedding-sarees"
        products={products}
      />
    </div>
  );
}
