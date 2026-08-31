import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Clock, Phone } from "lucide-react";

import { PUBLISHED_OUTLETS, OUTLET_COUNT } from "@/lib/locations";
import { seo, jsonLd, SITE } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, storeListSchema } from "@/lib/structured-data";

const LOCATOR_FAQS = [
  {
    q: "How many Mumbai Bazar stores are there?",
    a: `Mumbai Bazar runs ${OUTLET_COUNT} stores across the western line — Nalasopara, Virar, Vasai, Bhayandar and Goregaon. The Nalasopara East store on Tulinj Road, near the flyover bridge, carries the widest range.`,
  },
  {
    q: "Which Mumbai Bazar store is nearest to me?",
    a: "If you are on the Vasai-Virar line, the Nalasopara East store on Tulinj Road is the largest. From Mira Road or Kashimira, the Bhayandar East store on Talao Road is closest. From Malad or Jogeshwari, use the Goregaon West store near Station Road.",
  },
  {
    q: "What are your store timings?",
    a: `${SITE.hours.sentence}, including Sundays. During Diwali and the wedding season we often stay open later — call the store to check.`,
  },
  {
    q: "Do all stores stock the same range?",
    a: "The core range of sarees, dress material, lehengas and dulhan wear is common to every store, but stock varies by branch. Nalasopara East holds the largest bridal selection. Message a store on WhatsApp and we will tell you whether a piece is available before you travel.",
  },
];

export const Route = createFileRoute("/stores/")({
  head: () => {
    const { meta, links } = seo({
      title: "Saree Shops in Nalasopara, Virar & Mumbai | Mumbai Bazar",
      description: `Find your nearest Mumbai Bazar store. ${OUTLET_COUNT} saree and lehenga shops across Nalasopara, Virar, Vasai, Bhayandar and Goregaon. ${SITE.hours.shortDaily}.`,
      path: "/stores",
      keywords: [
        "saree shop near me",
        "saree shop nalasopara",
        "saree shop virar",
        "lehenga shop bhayandar",
        "saree shop goregaon",
        "mumbai bazar store locator",
      ],
    });

    return {
      meta,
      links,
      scripts: [
        jsonLd(storeListSchema(PUBLISHED_OUTLETS)),
        jsonLd(faqSchema(LOCATOR_FAQS)),
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Stores", path: "/stores" },
          ]),
        ),
      ],
    };
  },
  component: StoreLocator,
});

function StoreLocator() {
  return (
    <div className="w-full bg-ivory">
      <section className="border-b border-gold/30 bg-beige/25">
        <div className="w-full px-4 py-12 md:px-8 md:py-16 lg:px-12 xl:px-16">
          <nav className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-taupe">
            <Link to="/" className="transition-colors hover:text-maroon">
              Home
            </Link>
            <span className="text-gold/60">/</span>
            <span className="text-maroon">Stores</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl leading-tight text-maroon md:text-6xl">
              Find Your Nearest Store
            </h1>
            <p className="answer-first mt-4 text-sm leading-relaxed text-ink/80 md:text-base">
              Mumbai Bazar has {OUTLET_COUNT} stores across Nalasopara, Virar, Vasai, Bhayandar and
              Goregaon, {SITE.hours.shortDaily.toLowerCase()}. Every saree, lehenga and dress material
              can be seen and draped in store before you buy.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-12 md:px-8 md:py-16 lg:px-12 xl:px-16">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PUBLISHED_OUTLETS.map((o) => (
            <li key={o.slug}>
              <Link
                to="/stores/$slug"
                params={{ slug: o.slug }}
                className="flex h-full flex-col justify-between rounded-2xl border border-gold/45 bg-beige/15 p-6 transition-all hover:-translate-y-1 hover:border-maroon hover:shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-serif text-2xl leading-snug text-maroon">{o.area}</h2>
                    {o.flagship && (
                      <span className="shrink-0 rounded-full border border-gold bg-gold/15 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-gold-deep">
                        Flagship
                      </span>
                    )}
                  </div>

                  <address className="mt-3 flex gap-2 text-sm not-italic leading-relaxed text-ink/80">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span>
                      {o.street}
                      <br />
                      {o.landmark}
                      <br />
                      {o.area} {o.postalCode}
                    </span>
                  </address>

                  <p className="mt-3 flex items-center gap-2 text-sm text-ink/75">
                    <Clock className="h-4 w-4 shrink-0 text-gold" /> {SITE.hours.short}, daily
                  </p>
                  {o.phone && (
                    <p className="mt-1.5 flex items-center gap-2 text-sm text-ink/75">
                      <Phone className="h-4 w-4 shrink-0 text-gold" /> {o.phone}
                    </p>
                  )}
                </div>

                <span className="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-maroon">
                  View store →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-16 max-w-4xl">
          <h2 className="font-serif text-3xl text-maroon md:text-4xl">Common questions</h2>
          <dl className="mt-8 space-y-5">
            {LOCATOR_FAQS.map((f) => (
              <div key={f.q} className="rounded-2xl border border-gold/40 bg-beige/15 p-6">
                <dt className="font-serif text-lg text-maroon">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink/80">{f.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-sm text-ink/70">
            Prefer to ask first? Message us on WhatsApp at{" "}
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-maroon underline decoration-gold underline-offset-4 hover:text-gold"
            >
              {SITE.phone}
            </a>{" "}
            and we will check stock before you travel.
          </p>
        </section>
      </section>
    </div>
  );
}
