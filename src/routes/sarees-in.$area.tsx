import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MapPin, Phone, Clock, ArrowRight, Navigation } from "lucide-react";

import { getLocalArea, areaOutlets } from "@/lib/local-areas";
import { seo, jsonLd, SITE } from "@/lib/seo";
import { faqSchema, breadcrumbSchema, outletSchema } from "@/lib/structured-data";

export const Route = createFileRoute("/sarees-in/$area")({
  loader: ({ params }) => {
    const area = getLocalArea(params.area);
    if (!area) throw notFound();
    return { area };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return seo({
        title: "Area not found — Mumbai Bazar",
        description: "Find a Mumbai Bazar saree store near you.",
        path: "/stores",
        noindex: true,
      });
    }
    const a = loaderData.area;
    const { meta, links } = seo({
      title: a.title,
      description: a.description,
      path: `/sarees-in/${a.slug}`,
      keywords: a.keywords,
    });

    return {
      meta,
      links,
      scripts: [
        // FAQPage carries the local questions. Google retired FAQ rich results
        // in May 2026, so this wins no SERP feature — it is here because AI
        // answer engines read it as cleanly paired Q/A, which is exactly the
        // format they cite from.
        jsonLd(faqSchema(a.faqs)),
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Stores", path: "/stores" },
            { name: `Sarees in ${a.name}`, path: `/sarees-in/${a.slug}` },
          ]),
        ),
        // Each serving branch as a full ClothingStore, so this page can satisfy
        // a "saree shop near me" query on its own rather than only pointing at
        // the outlet pages.
        ...areaOutlets(a).map((o) => jsonLd(outletSchema(o))),
      ],
    };
  },
  component: AreaPage,
});

function AreaPage() {
  const { area: a } = Route.useLoaderData();
  const outlets = areaOutlets(a);

  return (
    <div className="w-full bg-ivory">
      <header className="border-b border-gold/30 bg-beige/25">
        <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-8 md:py-16">
          <nav className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-taupe">
            <Link to="/" className="transition-colors hover:text-maroon">
              Home
            </Link>
            <span className="text-gold/60">/</span>
            <Link to="/stores" className="transition-colors hover:text-maroon">
              Stores
            </Link>
          </nav>

          <h1 className="font-serif text-4xl leading-tight text-maroon md:text-5xl">
            Saree Shops in {a.name}
          </h1>

          {/* The extractable passage. Leads with the direct answer, names the
              streets and the price floor — vague copy is never cited. */}
          <p className="answer-first mt-5 rounded-xl border-l-[3px] border-gold bg-beige/30 p-5 text-[15px] font-medium leading-relaxed text-ink">
            {a.answer}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-taupe">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {outlets.length} stores in {a.name}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {SITE.hours.shortDaily}
            </span>
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1.5 text-maroon hover:text-gold"
            >
              <Phone className="h-3.5 w-3.5" /> {SITE.phone}
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-8 md:py-16">
        {/* --- The stores themselves, above the fold of the body. Someone
            searching "saree shop near me" wants an address, not an essay. --- */}
        <section className="mb-14">
          <h2 className="font-serif text-2xl leading-snug text-maroon md:text-3xl">
            Our stores in {a.name}
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {outlets.map((o) => (
              <div
                key={o.slug}
                className="flex flex-col rounded-2xl border border-gold/40 bg-beige/15 p-6"
              >
                <h3 className="font-serif text-xl text-maroon">
                  {SITE.name} — {o.area}
                </h3>
                <address className="mt-3 not-italic text-[15px] leading-relaxed text-ink/80">
                  {o.street}
                  <br />
                  {o.landmark}
                  <br />
                  {o.area}, {o.region} {o.postalCode}
                </address>

                <p className="mt-3 text-sm text-taupe">
                  <strong className="text-ink">Known for:</strong> {o.specialities.join(", ")}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <a
                    href={`tel:${(o.phone ?? SITE.phone).replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-1.5 font-medium text-maroon underline decoration-gold underline-offset-4 hover:text-gold"
                  >
                    <Phone className="h-3.5 w-3.5" /> {o.phone ?? SITE.phone}
                  </a>
                  {o.geo && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${o.geo.lat},${o.geo.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-medium text-maroon underline decoration-gold underline-offset-4 hover:text-gold"
                    >
                      <Navigation className="h-3.5 w-3.5" /> Directions
                    </a>
                  )}
                </div>

                <Link
                  to="/stores/$slug"
                  params={{ slug: o.slug }}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-maroon hover:text-gold"
                >
                  Store details <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="font-serif text-2xl leading-snug text-maroon md:text-3xl">
            Shopping for sarees in {a.name}
          </h2>
          {a.intro.map((para) => (
            <p key={para.slice(0, 40)} className="mt-4 text-[15px] leading-relaxed text-ink/80">
              {para}
            </p>
          ))}
        </section>

        {/* --- Price bands. "What is the price of a saree in Nalasopara" is a
            question nothing on page 1 currently answers with real numbers. --- */}
        <section className="mb-14">
          <h2 className="font-serif text-2xl leading-snug text-maroon md:text-3xl">
            What sarees cost in {a.name}
          </h2>
          <p className="answer-first mt-4 rounded-xl border-l-[3px] border-gold bg-beige/25 p-5 text-[15px] font-medium leading-relaxed text-ink">
            Sarees in {a.name} start at about ₹800 for everyday cotton and printed pieces. Party
            wear with zari or embroidery runs ₹2,000 to ₹6,000, designer lehengas ₹5,000 to ₹15,000,
            and heavy dulhan and bridal pieces from ₹12,000 upwards.
          </p>

          <dl className="mt-6 space-y-4">
            {a.priceBands.map((b) => (
              <div
                key={b.label}
                className="rounded-xl border border-gold/40 bg-beige/15 p-5 md:flex md:gap-6"
              >
                <dt className="md:w-56 md:shrink-0">
                  <span className="block font-serif text-lg text-maroon">{b.label}</span>
                  <span className="mt-0.5 block text-sm font-semibold text-gold-deep">
                    {b.range}
                  </span>
                </dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-ink/80 md:mt-0">{b.what}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* --- The comparison table. Includes markets we do not trade in,
            because a table that only lists our own shops is an advert and gets
            read as one. Honest comparison is what earns the citation. --- */}
        <section className="mb-14">
          <h2 className="font-serif text-2xl leading-snug text-maroon md:text-3xl">
            {a.comparison.caption}
          </h2>
          <div className="mt-6 overflow-x-auto rounded-xl border border-gold/40">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-beige/40">
                  {a.comparison.headers.map((h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-maroon"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {a.comparison.rows.map((row) => (
                  <tr key={row[0]} className="border-t border-gold/25">
                    {row.map((cell) => (
                      <td key={cell} className="px-4 py-2.5 align-top text-ink/85">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="font-serif text-2xl leading-snug text-maroon md:text-3xl">
            Areas we serve
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/80">
            Customers come to our {a.name} stores from across {a.formalName}, including{" "}
            {a.covers.slice(0, -1).join(", ")} and {a.covers[a.covers.length - 1]}. The nearest
            railway stations are {a.stations.slice(0, -1).join(", ")} and{" "}
            {a.stations[a.stations.length - 1]}.
          </p>
        </section>

        <section className="mb-14">
          <h2 className="font-serif text-2xl leading-snug text-maroon md:text-3xl">
            Questions people ask
          </h2>
          <dl className="mt-6 space-y-5">
            {a.faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-gold/40 bg-beige/15 p-5">
                <dt className="font-serif text-lg text-maroon">{f.q}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-ink/80">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <Link
          to="/shop"
          className="flex items-center justify-between gap-4 rounded-2xl border border-maroon/25 bg-maroon/5 p-6 transition-colors hover:border-maroon"
        >
          <span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">
              Next
            </span>
            <span className="mt-1 block font-serif text-xl text-maroon">
              Browse what is in stock now
            </span>
          </span>
          <ArrowRight className="h-5 w-5 shrink-0 text-maroon" />
        </Link>
      </div>
    </div>
  );
}
