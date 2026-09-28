import { Link } from "react-router";
import type { Route } from "./+types/stores._index";
import { MapPin, Phone, Clock, ArrowRight } from "lucide-react";
import { InstagramIcon } from "~/components/InstagramIcon";
import { SITE, getSeoMeta, jsonLdScript } from "~/lib/seo";
import { breadcrumbSchema, storeLocatorSchema } from "~/lib/structured-data";
import { PUBLISHED_OUTLETS, OUTLET_COUNT } from "~/lib/locations";

export const meta: Route.MetaFunction = () => {
  return getSeoMeta({
    title: "Saree Shops in Vasai Virar, Nalasopara & Mumbai | Mumbai Bazar",
    description: `Find your nearest Mumbai Bazar store. 8 saree and lehenga shops across Nalasopara, Virar, Vasai, Bhayandar and Goregaon. ${SITE.hours.shortDaily}.`,
    path: "/stores",
    keywords: [
      "saree shop near me",
      "saree shops vasai virar",
      "saree store nalasopara east",
      "saree shop virar west",
      "saree shop bhayandar",
      "saree shop goregaon west",
      "mumbai bazar store locations",
    ],
  });
};

export default function StoresIndexPage() {
  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Stores", path: "/stores" },
    ]),
    storeLocatorSchema(PUBLISHED_OUTLETS),
  ];

  return (
    <div className="bg-ivory text-ink min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }}
      />

      <section className="bg-beige/35 border-b border-[#A27633]/30 py-12 md:py-16">
        <div className="mx-auto max-w-[1400px] px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-maroon block mb-2">
            Retail Network
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink">
            Find Your Nearest Mumbai Bazar Store
          </h1>
          <p className="mt-3 text-sm text-taupe max-w-2xl mx-auto leading-relaxed">
            {OUTLET_COUNT} stores serving Mumbai's western line since 2009. Visit any branch to experience real handloom zari, drape bridal heirlooms, and get matching blouse stitching.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PUBLISHED_OUTLETS.map((o) => (
            <div
              key={o.slug}
              className="rounded-3xl border border-gold/40 bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-maroon bg-maroon/10 px-3 py-1 rounded-full">
                    {o.flagship ? "Flagship Store" : o.city}
                  </span>
                  <span className="text-xs text-taupe flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-gold" />
                    {SITE.hours.short}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-ink mt-4">
                  Mumbai Bazar — {o.area}
                </h3>
                <p className="mt-2 text-sm text-taupe leading-relaxed font-normal">
                  {o.intro}
                </p>

                <div className="mt-6 space-y-2.5 text-xs text-ink/80 border-t border-black/5 pt-4">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-maroon shrink-0 mt-0.5" />
                    <span>
                      <strong>Address:</strong> {o.street}, {o.landmark}, {o.postalCode}
                    </span>
                  </div>
                  {o.phone && (
                    <div className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 text-maroon shrink-0" />
                      <span>
                        <strong>Phone:</strong>{" "}
                        <a href={`tel:${o.phone}`} className="hover:text-maroon underline">
                          {o.phone}
                        </a>
                      </span>
                    </div>
                  )}
                </div>

                {/* Specialties */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {o.specialities.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-beige/40 px-2.5 py-1 text-[11px] font-medium text-taupe"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-black/5 flex items-center justify-between">
                <Link
                  to={`/stores/${o.slug}`}
                  className="btn-primary rounded-full text-xs py-2 px-5"
                >
                  <span>Branch Details &amp; Directions</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                {o.instagram && (
                  <a
                    href={o.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-taupe hover:text-maroon transition-colors"
                    aria-label={`${o.area} Instagram`}
                  >
                    <InstagramIcon className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
