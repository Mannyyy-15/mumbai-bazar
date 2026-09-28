import { useLoaderData } from "react-router";
import type { Route } from "./+types/everyday-sarees";
import { SITE, getSeoMeta, jsonLdScript } from "~/lib/seo";
import { breadcrumbSchema, collectionSchema } from "~/lib/structured-data";
import { fetchLiveProducts } from "~/lib/shopify.server";
import { CategoryPage } from "~/components/CategoryPage";
import { IMG } from "~/lib/site-data";

export const meta: Route.MetaFunction = () => {
  return getSeoMeta({
    title: "Daily Wear & Soft Silk Sarees from ₹800 | Mumbai Bazar",
    description:
      "Comfortable daily-wear sarees, soft silks, cotton blends and printed drapes starting from ₹800. Available across 8 Mumbai Bazar stores in Mumbai and online.",
    path: "/everyday-sarees",
    keywords: [
      "daily wear sarees",
      "sarees from 800",
      "soft silk sarees",
      "cotton silk sarees online",
      "office wear sarees",
      "budget sarees mumbai",
    ],
  });
};

export async function loader({ context }: Route.LoaderArgs) {
  const products = await fetchLiveProducts(context, 100);
  return { products };
}

export default function EverydaySareesRoute() {
  const { products } = useLoaderData<typeof loader>();

  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Everyday Sarees", path: "/everyday-sarees" },
    ]),
    collectionSchema(
      "Everyday & Ready-to-Wear Sarees",
      "Soft, comfortable sarees you can wear every day and to office.",
      "/everyday-sarees",
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
        eyebrow="Daily Soft Silks"
        title="Everyday & Ready-to-Wear Sarees"
        crumb="Everyday Sarees"
        copy="Soft, comfortable sarees you can wear every day and to office."
        heroImg={IMG.colPuresilk}
        category="everyday-sarees"
        showHero={false}
        contentKey="everyday-sarees"
        products={products}
      />
    </div>
  );
}
