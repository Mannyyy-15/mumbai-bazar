import { useLoaderData } from "react-router";
import type { Route } from "./+types/wedding-sarees";
import { SITE, getSeoMeta, jsonLdScript } from "~/lib/seo";
import { lowestPriceLabel } from "~/lib/commerce";
import { breadcrumbSchema, collectionSchema } from "~/lib/structured-data";
import { fetchLiveProducts } from "~/lib/shopify.server";
import { CategoryPage } from "~/components/CategoryPage";
import { IMG } from "~/lib/site-data";

/*
  Targets what the online stock actually is.

  The page used to be titled "Dulhan Sarees & Bridal Lehengas" while listing
  the Rs 649-1,699 printed and zari sarees that make up the whole online
  catalogue -- there is no bridal or lehenga product online. A "bridal
  lehenga" searcher landed, saw an Rs 899 printed saree and bounced, which
  is a ranking signal against the page as well as a broken promise.

  Autocomplete shows strong demand this stock genuinely fits: "saree for
  wedding function", "wedding saree for bride sister", "haldi saree",
  "mehendi saree". The dulhan range is real -- it is in store -- so the
  description sends that intent to Nalasopara East rather than dropping it.

  The "from" price is computed from the products this page renders, so it
  cannot drift from the catalogue.
*/
export const meta: Route.MetaFunction = ({ data }) => {
  const from = lowestPriceLabel(data?.products ?? []);
  return getSeoMeta({
    title: from
      ? `Sarees for Wedding Functions from ${from} | Mumbai Bazar`
      : "Sarees for Wedding Functions | Mumbai Bazar",
    description: `Zari and printed sarees for wedding functions, haldi and mehendi${
      from ? `, from ${from} online` : " online"
    }. Dulhan sarees and bridal lehengas are in store at Nalasopara East.`,
    path: "/wedding-sarees",
    keywords: [
      "saree for wedding function",
      "wedding saree for bride sister",
      "wedding guest saree",
      "haldi saree",
      "mehendi saree",
      "dulhan saree nalasopara",
      "bridal saree shop vasai virar",
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
        eyebrow="Wedding Season"
        title="Sarees for Wedding Functions"
        crumb="Wedding Sarees"
        copy="Sarees for haldi, mehendi, sangeet and the bride's family. The dulhan and bridal lehenga range is in store at Nalasopara East."
        heroImg={IMG.colFestive}
        category="wedding-sarees"
        showHero={false}
        contentKey="wedding-sarees"
        products={products}
      />
    </div>
  );
}
