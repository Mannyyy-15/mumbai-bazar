import { useLoaderData } from "react-router";
import type { Route } from "./+types/new-arrivals";
import { SITE, getSeoMeta, jsonLdScript } from "~/lib/seo";
import { breadcrumbSchema, collectionSchema } from "~/lib/structured-data";
import { fetchLiveProducts } from "~/lib/shopify.server";
import { CategoryPage } from "~/components/CategoryPage";
import { IMG } from "~/lib/site-data";

export const meta: Route.MetaFunction = () => {
  return getSeoMeta({
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
};

export async function loader({ context }: Route.LoaderArgs) {
  const products = await fetchLiveProducts(context, 100);
  return { products };
}

export default function NewArrivalsRoute() {
  const { products } = useLoaderData<typeof loader>();

  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "New Arrivals", path: "/new-arrivals" },
    ]),
    collectionSchema(
      "New Arrival Sarees",
      "New saree, lehenga and dress material arrivals, added weekly.",
      "/new-arrivals",
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
        eyebrow="Weekly Drop"
        title="New Arrivals — Fresh From Loom"
        crumb="New Arrivals"
        copy="New stock arrives weekly across all eight stores."
        heroImg={IMG.colKanjivaram}
        category="new-arrivals"
        showHero={false}
        contentKey="new-arrivals"
        products={products}
      />
    </div>
  );
}
