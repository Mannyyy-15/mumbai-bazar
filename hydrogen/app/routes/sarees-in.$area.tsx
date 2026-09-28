import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/sarees-in.$area";
import { MapPin, Phone, Clock, ArrowRight } from "lucide-react";
import { getLocalArea, areaOutlets } from "~/lib/local-areas";
import { SITE, getSeoMeta, jsonLdScript } from "~/lib/seo";
import { breadcrumbSchema, faqSchema, outletSchema } from "~/lib/structured-data";

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data?.area) {
    return getSeoMeta({
      title: "Area Not Found — Mumbai Bazar",
      description: "Find a Mumbai Bazar saree store near you.",
      path: "/stores",
      noindex: true,
    });
  }

  const a = data.area;
  return getSeoMeta({
    title: a.title,
    description: a.description,
    path: `/sarees-in/${a.slug}`,
    keywords: a.keywords,
  });
};

export async function loader({ params }: Route.LoaderArgs) {
  const { area: areaSlug } = params;
  const area = getLocalArea(areaSlug || "");
  if (!area) {
    throw new Response("Area Not Found", { status: 404 });
  }
  return { area };
}

export default function SareesInAreaPage() {
  const { area: a } = useLoaderData<typeof loader>();
  const outlets = areaOutlets(a);

  const schemas = [
    faqSchema(a.faqs),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Stores", path: "/stores" },
      { name: `Sarees in ${a.name}`, path: `/sarees-in/${a.slug}` },
    ]),
    ...outlets.map((o) => outletSchema(o)),
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
            Local Saree Guide
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink">
            Saree Shops in {a.name}
          </h1>
          <p className="mt-4 text-sm text-taupe max-w-3xl mx-auto leading-relaxed font-normal">
            {a.answer}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-6 py-14 space-y-16">
        {/* Intro Paragraphs */}
        <div className="max-w-4xl mx-auto space-y-4 text-sm text-taupe leading-relaxed">
          {a.intro.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {/* Serving Outlets Grid */}
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink mb-6 text-center">
            Mumbai Bazar Stores Serving {a.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {outlets.map((o) => (
              <div
                key={o.slug}
                className="rounded-3xl border border-gold/40 bg-white p-8 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-maroon bg-maroon/10 px-3 py-1 rounded-full">
                    {o.flagship ? "Flagship Store" : o.city}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-ink mt-4">
                    {o.area} Store
                  </h3>
                  <p className="text-xs text-taupe mt-2 leading-relaxed">
                    {o.intro}
                  </p>
                  <div className="mt-4 space-y-1 text-xs text-ink/90">
                    <p><strong>Address:</strong> {o.street}, {o.landmark}</p>
                    {o.phone && <p><strong>Phone:</strong> {o.phone}</p>}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-black/5">
                  <Link
                    to={`/stores/${o.slug}`}
                    className="btn-primary rounded-full text-xs py-2 px-5"
                  >
                    <span>Store Directions</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Local Market Price Bands */}
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink mb-6 text-center">
            Typical Price Bands in {a.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {a.priceBands.map((b) => (
              <div key={b.label} className="rounded-2xl border border-gold/30 bg-white p-6 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-maroon block">
                  {b.label}
                </span>
                <span className="font-serif text-2xl font-bold text-ink block mt-1">
                  {b.range}
                </span>
                <p className="text-xs text-taupe mt-2 leading-relaxed">
                  {b.what}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Market Comparison Table */}
        <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-gold/40 bg-white shadow-sm">
          <div className="p-6 bg-beige/30 border-b border-gold/20">
            <h3 className="font-serif text-xl font-bold text-ink">
              {a.comparison.caption}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-taupe">
              <thead className="bg-beige/10 border-b border-gold/20 text-ink uppercase tracking-wider font-semibold">
                <tr>
                  {a.comparison.headers.map((h) => (
                    <th key={h} className="p-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {a.comparison.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-beige/10">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className={`p-4 ${cIdx === 0 ? "font-bold text-ink" : ""}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Local FAQs */}
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {a.faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-gold/30 bg-white p-6 shadow-sm">
                <h3 className="font-serif text-base font-bold text-ink mb-2">
                  {faq.q}
                </h3>
                <p className="text-xs text-taupe leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
