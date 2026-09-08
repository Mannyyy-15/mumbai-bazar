import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Clock,
  Phone,
  Store,
  Navigation,
  MessageCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import { PUBLISHED_OUTLETS, OUTLET_COUNT, FLAGSHIP } from "@/lib/locations";
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
    <div className="w-full bg-[#FAF7F2] text-ink min-h-screen">
      {/* 1. Hero Header */}
      <section className="relative overflow-hidden border-b border-gold/30 bg-gradient-to-b from-[#F5EFEB] to-[#FAF7F2] py-12 md:py-16">
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-1/2 h-80 w-80 rounded-full bg-maroon/10 blur-3xl" />

        <div className="relative mx-auto w-full max-w-[1500px] px-4 md:px-8 lg:px-12 xl:px-16">
          <nav className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-maroon/80">
            <Link to="/" className="transition-colors hover:text-gold-deep">
              Home
            </Link>
            <span className="text-gold-deep font-normal">/</span>
            <span className="text-ink">Store Locator</span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-maroon/25 bg-maroon/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-maroon mb-3">
              <Store className="h-3.5 w-3.5 text-maroon" /> {OUTLET_COUNT} Retail Boutiques in Mumbai &amp; Palghar
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] text-maroon">
              Find Your Nearest Mumbai Bazar Store
            </h1>
            <p className="mt-4 text-sm md:text-base leading-relaxed text-ink/80 font-medium">
              Mumbai Bazar operates {OUTLET_COUNT} stores across Nalasopara, Virar, Vasai, Bhayandar, and Goregaon, {SITE.hours.shortDaily.toLowerCase()}. Every saree, lehenga, and dress material can be draped and inspected in person with our bridal stylists.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Flagship Store Spotlight */}
      <section className="py-12 md:py-16 border-b border-gold/30 bg-white">
        <div className="mx-auto w-full max-w-[1500px] px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="rounded-3xl border-2 border-gold/50 bg-[#FAF7F2] p-6 md:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-maroon shadow-xs">
                  Flagship Boutique
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-taupe">
                  Largest Bridal Collection
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon">
                Nalasopara East (Tulinj Road)
              </h2>

              <p className="text-sm text-ink/85 font-medium leading-relaxed">
                {FLAGSHIP.intro}
              </p>

              <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs font-medium text-ink/85">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-maroon shrink-0 mt-0.5" />
                  <span>{FLAGSHIP.street}, {FLAGSHIP.landmark}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-maroon shrink-0" />
                  <span>{SITE.hours.short}, Open all 7 Days</span>
                </div>
                {FLAGSHIP.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-maroon shrink-0" />
                    <span>{FLAGSHIP.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-gold-deep shrink-0" />
                  <span>10,000+ Saree Designs</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <Link
                  to="/stores/$slug"
                  params={{ slug: "nalasopara" }}
                  className="inline-flex items-center gap-2 rounded-full bg-maroon px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-md hover:bg-wine transition-all"
                >
                  <span>Explore Nalasopara Store</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <a
                  href={`https://wa.me/${(FLAGSHIP.phone ?? SITE.phone).replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hello Mumbai Bazar Nalasopara, I would like to enquire about visiting the store.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-maroon bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-maroon hover:bg-maroon hover:text-white transition-all shadow-2xs"
                >
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                  <span>WhatsApp Store</span>
                </a>
              </div>
            </div>

            {/* Right Photo */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gold/60 shadow-md">
                <img
                  src="/storefront.webp"
                  alt="Mumbai Bazar Nalasopara Flagship Storefront"
                  className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. All Outlets Grid */}
      <section className="py-14 md:py-20 border-b border-gold/30">
        <div className="mx-auto w-full max-w-[1500px] px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-gold-deep font-bold block mb-2">
              Browse Locations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-maroon">
              All Mumbai Bazar Stores
            </h2>
            <p className="mt-2 text-sm text-ink/75 font-medium">
              Choose your nearest branch for store directions, phone contacts, and collection details.
            </p>
          </div>

          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PUBLISHED_OUTLETS.map((o) => (
              <li key={o.slug} className="flex">
                <div className="flex h-full w-full flex-col justify-between rounded-3xl border border-gold/50 bg-white p-7 shadow-xs hover:border-maroon hover:shadow-lg transition-all duration-300">
                  <div>
                    <div className="flex items-start justify-between gap-3 border-b border-gold/30 pb-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-taupe block mb-0.5">
                          {o.region}
                        </span>
                        <h3 className="font-serif text-2xl font-bold text-maroon">{o.area}</h3>
                      </div>
                      {o.flagship && (
                        <span className="shrink-0 rounded-full border border-gold bg-gold/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-deep">
                          Flagship
                        </span>
                      )}
                    </div>

                    <address className="mt-4 flex gap-2.5 text-sm not-italic leading-relaxed text-ink/85 font-medium">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-maroon" />
                      <span>
                        {o.street}
                        <br />
                        <span className="text-taupe text-xs">{o.landmark}</span>
                        <br />
                        {o.area} {o.postalCode}
                      </span>
                    </address>

                    <div className="mt-4 space-y-2 border-t border-gold/20 pt-3 text-xs text-ink/80 font-medium">
                      <p className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-gold-deep" /> {SITE.hours.short}, daily
                      </p>
                      {o.phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-gold-deep" /> {o.phone}
                        </p>
                      )}
                    </div>

                    {/* Specialities pills */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {o.specialities.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-[#FAF7F2] border border-gold/40 px-2.5 py-0.5 text-[10px] font-semibold text-maroon"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gold/30 flex items-center justify-between">
                    <Link
                      to="/stores/$slug"
                      params={{ slug: o.slug }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-maroon hover:text-gold-deep transition-colors"
                    >
                      <span>View Store Page</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <a
                      href={`https://wa.me/${(o.phone ?? SITE.phone).replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello Mumbai Bazar ${o.area}, I would like help choosing a saree.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#25D366] hover:underline"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Common FAQs */}
      <section className="py-14 md:py-20 bg-white border-b border-gold/30">
        <div className="mx-auto w-full max-w-4xl px-4 md:px-8">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-[0.2em] text-gold-deep font-bold block mb-2">
              Helpful Information
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-maroon">
              Frequently Asked Questions
            </h2>
          </div>

          <dl className="space-y-4">
            {LOCATOR_FAQS.map((f) => (
              <div key={f.q} className="rounded-2xl border border-gold/50 bg-[#FAF7F2] p-6 shadow-xs">
                <dt className="font-serif text-xl font-bold text-maroon">{f.q}</dt>
                <dd className="mt-2.5 text-sm leading-relaxed text-ink/85 font-medium">{f.a}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 text-center text-sm text-ink/75 font-medium">
            Prefer to speak directly? Message our styling team on WhatsApp at{" "}
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-maroon font-bold underline decoration-gold underline-offset-4 hover:text-gold-deep"
            >
              {SITE.phone}
            </a>{" "}
            and we will check stock before you travel.
          </p>
        </div>
      </section>
    </div>
  );
}
