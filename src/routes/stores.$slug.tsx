import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MapPin, MessageCircle, Clock, Store, Phone, Instagram } from "lucide-react";

import { getOutlet, PUBLISHED_OUTLETS, OUTLET_COUNT, type Outlet } from "@/lib/locations";
import { PRODUCTS } from "@/lib/site-data";
import { seo, jsonLd, SITE } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, outletSchema } from "@/lib/structured-data";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/stores/$slug")({
  loader: ({ params }) => {
    const outlet = getOutlet(params.slug);
    if (!outlet) throw notFound();
    return { outlet };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return seo({
        title: "Store not found — Mumbai Bazar",
        description: "Find your nearest Mumbai Bazar store.",
        path: "/stores",
        noindex: true,
      });
    }
    const o = loaderData.outlet;
    const title = `Saree Shop in ${o.area} | Lehengas & Bridal Wear — Mumbai Bazar`;
    const description =
      `Mumbai Bazar ${o.area} — sarees, dress material, designer lehengas and dulhan wear. ` +
      `${o.landmark}. Open daily 10 AM–9 PM, serving ${o.nearby.slice(0, 3).join(", ")}.`;

    const { meta, links } = seo({
      title,
      description,
      path: `/stores/${o.slug}`,
      keywords: [
        `saree shop in ${o.city}`,
        `saree shop near me ${o.city}`,
        `lehenga shop ${o.city}`,
        `bridal saree ${o.city}`,
        `dress material ${o.city}`,
        `party wear saree ${o.area}`,
      ],
    });

    return {
      meta,
      links,
      scripts: [
        jsonLd(outletSchema(o)),
        jsonLd(faqSchema(outletFaqs(o))),
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Stores", path: "/stores" },
            { name: o.area, path: `/stores/${o.slug}` },
          ]),
        ),
      ],
    };
  },
  component: StorePage,
});

/**
 * Store-specific FAQs. Answers are rendered on the page as well as marked up —
 * Google discounts FAQ schema that has no visible on-page counterpart.
 */
function outletFaqs(o: Outlet) {
  const phone = o.phone ?? SITE.phone;
  return [
    {
      q: `Where is the Mumbai Bazar store in ${o.area}?`,
      a: `We are at ${o.street}, ${o.landmark}, ${o.area} ${o.postalCode}. The store is open every day from 10 AM to 9 PM. Call ${phone} if you would like us to keep something aside before you arrive.`,
    },
    {
      q: `What does the ${o.area} store sell?`,
      a: `${o.specialities.join(", ")}. Our ${o.area} customers most often shop with us for ${o.occasions.slice(0, 2).join(" and ")}.`,
    },
    {
      q: `Do you have other stores near ${o.city}?`,
      a: `Yes — Mumbai Bazar runs ${OUTLET_COUNT} stores across Nalasopara, Virar, Vasai, Bhayandar and Goregaon. Our largest range is at the Nalasopara East store on Tulinj Road, near the flyover bridge.`,
    },
    {
      q: `Can I see a saree before buying?`,
      a: `Yes. Every piece can be seen and draped in store before you buy. You can also message us on WhatsApp at ${phone} and we will send photos or a video of anything you are considering.`,
    },
  ];
}

function StorePage() {
  const { outlet: o } = Route.useLoaderData();
  const featured = PRODUCTS.slice(0, 4);
  const faqs = outletFaqs(o);
  const phone = o.phone ?? SITE.phone;
  const waNumber = (o.phone ?? SITE.phone).replace(/[^0-9]/g, "");
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hello Mumbai Bazar ${o.area}, I would like help choosing a saree.`,
  )}`;
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Mumbai Bazar ${o.street} ${o.area} ${o.postalCode}`,
  )}`;
  const others = PUBLISHED_OUTLETS.filter((x) => x.slug !== o.slug);

  return (
    <div className="w-full bg-ivory">
      <section className="border-b border-gold/30 bg-beige/25">
        <div className="w-full px-4 py-12 md:px-8 md:py-16 lg:px-12 xl:px-16">
          <nav className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-taupe">
            <Link to="/" className="transition-colors hover:text-maroon">
              Home
            </Link>
            <span className="text-gold/60">/</span>
            <Link to="/stores" className="transition-colors hover:text-maroon">
              Stores
            </Link>
            <span className="text-gold/60">/</span>
            <span className="text-maroon">{o.area}</span>
          </nav>

          <div className="max-w-3xl">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-maroon/20 bg-maroon/5 px-3.5 py-1 text-[10px] font-medium uppercase tracking-[0.3em] text-maroon md:text-[11px]">
              <MapPin className="h-3 w-3" />
              {o.flagship ? "Flagship Store" : o.region}
            </span>
            <h1 className="font-serif text-4xl leading-tight text-maroon md:text-6xl">
              Saree Shop in {o.area}
            </h1>
            <p className="answer-first mt-4 text-sm leading-relaxed text-ink/80 md:text-base">
              {o.intro}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-maroon px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-ivory transition-colors hover:bg-wine"
              >
                WhatsApp this store
              </a>
              <a
                href={mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-maroon px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-maroon transition-colors hover:bg-maroon hover:text-ivory"
              >
                Get directions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* NAP block — the address here must match this store's Google Business
          Profile exactly, so it is rendered as plain text, not an image. */}
      <section className="bg-ivory py-12 md:py-16">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gold/50 bg-beige/20 p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-maroon/10 text-maroon">
                <Store className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-serif text-xl text-maroon">Address</h2>
              <address className="mt-2 text-sm not-italic leading-relaxed text-ink/80">
                {o.street}
                <br />
                {o.landmark}
                <br />
                {o.area}, {o.region} {o.postalCode}
              </address>
            </div>

            <div className="rounded-2xl border border-gold/50 bg-beige/20 p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-maroon/10 text-maroon">
                <Clock className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-serif text-xl text-maroon">Open daily</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">
                {SITE.hours.label.replace("Open daily: ", "")}, all{" "}
                {SITE.hours.days.length === 7 ? "seven" : SITE.hours.days.length} days.
                <br />
                Walk in any time, or call ahead during festival weeks.
              </p>
            </div>

            <div className="rounded-2xl border border-gold/50 bg-beige/20 p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-maroon/10 text-maroon">
                <Phone className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-serif text-xl text-maroon">Contact</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-maroon">
                  {phone}
                </a>
                {o.instagram && (
                  <>
                    <br />
                    <a
                      href={o.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-maroon"
                    >
                      <Instagram className="h-3.5 w-3.5" /> Follow this store
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gold/30 bg-beige/30 py-12 md:py-16">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16">
          <h2 className="font-serif text-3xl text-maroon md:text-4xl">What we stock in {o.area}</h2>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {o.specialities.map((item) => (
              <li
                key={item}
                className="rounded-full border border-gold/50 bg-ivory px-4 py-1.5 text-sm text-ink/85"
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gold/30 bg-ivory py-12 md:py-16">
        <div className="w-full max-w-4xl px-4 md:px-8 lg:px-12 xl:px-16">
          <h2 className="font-serif text-3xl text-maroon md:text-4xl">
            Visiting our {o.area} store
          </h2>
          <dl className="mt-8 space-y-6">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-gold/40 bg-beige/15 p-6">
                <dt className="font-serif text-lg text-maroon">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink/80">{f.a}</dd>
              </div>
            ))}
          </dl>

          {/* Sibling links keep the branch cluster internally connected. */}
          {others.length > 0 && (
            <p className="mt-10 text-sm text-ink/70">
              Our other stores:{" "}
              {others.map((x, i) => (
                <span key={x.slug}>
                  <Link
                    to="/stores/$slug"
                    params={{ slug: x.slug }}
                    className="text-maroon underline decoration-gold underline-offset-4 hover:text-gold"
                  >
                    {x.area}
                  </Link>
                  {i < others.length - 1 ? ", " : "."}
                </span>
              ))}
            </p>
          )}
        </div>
      </section>

      <section className="border-t border-gold/30 bg-maroon/5 py-10">
        <div className="flex w-full flex-wrap items-center gap-4 px-4 md:px-8 lg:px-12 xl:px-16">
          <MessageCircle className="h-5 w-5 shrink-0 text-maroon" />
          <p className="min-w-[16rem] flex-1 text-sm text-ink/80">
            Want us to hold something for you? Message the {o.area} store on WhatsApp before you
            visit.
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase tracking-widest text-maroon hover:text-gold"
          >
            Message store →
          </a>
        </div>
      </section>
    </div>
  );
}
