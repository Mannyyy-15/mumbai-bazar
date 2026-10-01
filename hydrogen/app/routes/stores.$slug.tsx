import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/stores.$slug";
import {
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { InstagramIcon } from "~/components/InstagramIcon";
import { SITE, getSeoMeta, jsonLdScript } from "~/lib/seo";
import { breadcrumbSchema, outletSchema } from "~/lib/structured-data";
import { getOutlet, PUBLISHED_OUTLETS, type Outlet } from "~/lib/locations";
import { fetchLiveProducts } from "~/lib/shopify.server";
import { ProductCard } from "~/components/ProductCard";

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data?.outlet) {
    return getSeoMeta({
      title: "Store Not Found — Mumbai Bazar",
      description: "Find your nearest Mumbai Bazar store.",
      path: "/stores",
      noindex: true,
    });
  }

  const o = data.outlet;
  // Exact searched phrase first ("saree shop in nalasopara east" is what
  // autocomplete returns), then the categories people pair with it, then the
  // brand -- Search Console shows people searching "mumbai bazar virar west".
  // Longest outlet name lands at 62 characters.
  const title = `Saree Shop in ${o.area} | Bridal & Lehenga | Mumbai Bazar`;
  const description =
    `Mumbai Bazar ${o.area} — sarees, dress material, designer lehengas and dulhan wear. ` +
    `${o.landmark}. ${SITE.hours.shortDaily}, serving ${o.nearby.slice(0, 3).join(", ")}.`;

  return getSeoMeta({
    title,
    description,
    path: `/stores/${o.slug}`,
    keywords: [
      `saree shop in ${o.area.toLowerCase()}`,
      `best saree shop in ${o.area.toLowerCase()}`,
      `saree shop in ${o.city}`,
      `saree shop near me ${o.city}`,
      `lehenga shop ${o.city}`,
      `bridal saree ${o.city}`,
      `dress material ${o.city}`,
      `party wear saree ${o.area}`,
    ],
  });
};

export async function loader({ context, params }: Route.LoaderArgs) {
  const { slug } = params;
  const outlet = getOutlet(slug || "");
  if (!outlet) {
    throw new Response("Store Not Found", { status: 404 });
  }

  const products = await fetchLiveProducts(context, 8);
  return { outlet, products };
}

export default function StoreDetailPage() {
  const { outlet: o, products } = useLoaderData<typeof loader>();

  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Stores", path: "/stores" },
      { name: o.area, path: `/stores/${o.slug}` },
    ]),
    outletSchema(o),
  ];

  const whatsappMsg = encodeURIComponent(
    `Hi Mumbai Bazar ${o.area}, I want to enquire about current sarees in stock before visiting.`,
  );

  return (
    <div className="bg-ivory text-ink min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }}
      />

      <section className="bg-beige/35 border-b border-[#A27633]/30 py-12 md:py-16">
        <div className="mx-auto max-w-[1400px] px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-maroon block mb-2">
            {o.flagship ? "Flagship Boutique" : `${o.city} Outlet`}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink">
            Saree Shop in {o.area}
          </h1>
          <p className="mt-3 text-sm text-taupe max-w-2xl mx-auto leading-relaxed">
            {o.intro}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-3xl border border-gold/40 bg-white p-8 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-ink mb-4">
                Store Location &amp; Directions
              </h2>

              <div className="space-y-4 text-sm text-ink/90">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-maroon shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-ink">Street Address:</strong>
                    <span>{o.street}</span>
                    <span className="block text-taupe text-xs mt-0.5">
                      Landmark: {o.landmark}
                    </span>
                    <span className="block text-taupe text-xs">
                      Pin Code: {o.postalCode} ({o.region})
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-maroon shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-ink">Operating Hours:</strong>
                    <span>{SITE.hours.sentence}</span>
                  </div>
                </div>

                {o.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-maroon shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-ink">Phone Enquiries:</strong>
                      <a href={`tel:${o.phone}`} className="hover:text-maroon underline font-medium">
                        {o.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={`https://wa.me/918956664631?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#20ba5a]"
                >
                  <MessageCircle className="h-4 w-4 fill-white" />
                  <span>Enquire On WhatsApp</span>
                </a>

                {o.instagram && (
                  <a
                    href={o.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3 text-xs font-bold uppercase tracking-wider text-maroon hover:bg-beige/30"
                  >
                    <InstagramIcon className="h-4 w-4" />
                    <span>Store Instagram</span>
                  </a>
                )}
              </div>
            </div>

            {/* Specialities and Landmarks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-gold/30 bg-beige/25 p-6">
                <h3 className="font-serif text-lg font-bold text-ink mb-3">
                  Local Specialities
                </h3>
                <ul className="space-y-2 text-xs text-taupe">
                  {o.specialities.map((s) => (
                    <li key={s} className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-maroon shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-gold/30 bg-beige/25 p-6">
                <h3 className="font-serif text-lg font-bold text-ink mb-3">
                  Nearby Landmarks
                </h3>
                <ul className="space-y-2 text-xs text-taupe">
                  {o.landmarks.map((l) => (
                    <li key={l} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar: Other Stores */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-gold/40 bg-white p-6 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-ink mb-4">
                Other Outlets
              </h3>
              <div className="space-y-3">
                {PUBLISHED_OUTLETS.filter((item) => item.slug !== o.slug).map((other) => (
                  <Link
                    key={other.slug}
                    to={`/stores/${other.slug}`}
                    className="block p-3 rounded-xl border border-gold/30 hover:border-maroon hover:bg-beige/20 transition-all text-xs"
                  >
                    <span className="font-bold text-ink block text-sm font-serif">
                      {other.area}
                    </span>
                    <span className="text-taupe block line-clamp-1 mt-0.5">
                      {other.street}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Sarees at this outlet */}
        <div className="mt-16 border-t border-[#A27633]/20 pt-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-maroon block mb-1">
                Available In Store
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink">
                Popular Sarees In {o.area}
              </h2>
            </div>
            <Link to="/shop" className="link-gold">
              <span>View Full Catalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
