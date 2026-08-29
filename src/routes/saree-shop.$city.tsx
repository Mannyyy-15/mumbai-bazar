import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MapPin, MessageCircle, Truck, Clock, ShieldCheck } from "lucide-react";

import { getLocation, PUBLISHED_LOCATIONS } from "@/lib/locations";
import { PRODUCTS } from "@/lib/site-data";
import { seo, jsonLd, SITE } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, localAreaSchema } from "@/lib/structured-data";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/saree-shop/$city")({
  loader: ({ params }) => {
    const location = getLocation(params.city);
    if (!location) throw notFound();
    return { location };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return seo({
        title: "Location not found — Mumbai Bazar",
        description: "Browse saree collections at Mumbai Bazar.",
        path: "/shop",
        noindex: true,
      });
    }
    const l = loaderData.location;
    const title = `Saree Shop in ${l.city} | Silk & Bridal Sarees — Mumbai Bazar`;
    const description =
      `Buy handwoven silk, Paithani and bridal sarees in ${l.city}. Free delivery across ` +
      `${l.nearby.slice(0, 3).join(", ")}. Visit our boutique or book a free WhatsApp styling call.`;

    const { meta, links } = seo({
      title,
      description,
      path: `/saree-shop/${l.slug}`,
      keywords: [
        `saree shop in ${l.city}`,
        `saree store ${l.city}`,
        `bridal saree ${l.city}`,
        `silk saree ${l.city}`,
        `paithani saree ${l.city}`,
      ],
    });

    return {
      meta,
      links,
      scripts: [
        jsonLd(localAreaSchema(l.city, l.nearby, l.postalCode)),
        jsonLd(faqSchema(localFaqs(l.city, l.nearby))),
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: l.city, path: `/saree-shop/${l.slug}` },
          ]),
        ),
      ],
    };
  },
  component: LocationPage,
});

/**
 * Locality-specific FAQs. These are what win the local "People Also Ask" box,
 * and they are rendered on the page as well as marked up, so the answer text is
 * genuinely present rather than schema-only.
 */
function localFaqs(city: string, nearby: string[]) {
  return [
    {
      q: `Do you deliver sarees in ${city}?`,
      a: `Yes. We deliver free across ${city} and nearby areas including ${nearby.slice(0, 3).join(", ")}. Orders placed before 4 PM are usually delivered the same day within the Vasai-Virar belt, and next day across the wider Mumbai metro.`,
    },
    {
      q: `Where is your saree shop near ${city}?`,
      a: `Our boutique studio is at ${SITE.address.street}, ${SITE.address.city} ${SITE.address.postalCode}, open Monday to Saturday, 10 AM to 8 PM. You are welcome to walk in and drape any saree before buying, or call ${SITE.phone} to reserve a styling slot.`,
    },
    {
      q: `Can I see the saree before buying in ${city}?`,
      a: `Yes, in two ways. Visit the boutique and drape it in daylight, or book a free WhatsApp video call and we will show you the saree live — palla, border and blouse piece — before you decide.`,
    },
    {
      q: `Do you stock Paithani and bridal sarees in ${city}?`,
      a: `We do. Our ${city} customers most often buy Paithani for Gudi Padwa and Ganesh Chaturthi, and Kanjivaram or Banarasi bridal silks through the wedding season. Every silk saree is Silk Mark certified and includes a matching unstitched blouse piece.`,
    },
  ];
}

function LocationPage() {
  const { location: l } = Route.useLoaderData();
  const featured = PRODUCTS.slice(0, 4);
  const faqs = localFaqs(l.city, l.nearby);
  const waHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    `Hello Mumbai Bazar, I am in ${l.city} and would like help choosing a saree.`,
  )}`;

  const assurances = [
    {
      icon: Truck,
      title: `Free delivery in ${l.city}`,
      copy: `Same-day dispatch to ${l.nearby.slice(0, 3).join(", ")} on orders placed before 4 PM.`,
    },
    {
      icon: Clock,
      title: "Open Mon–Sat, 10 AM – 8 PM",
      copy: `Walk in at ${SITE.address.street}, or reserve a private styling slot in advance.`,
    },
    {
      icon: ShieldCheck,
      title: "Silk Mark certified",
      copy: "Every silk saree is lab-verified for pure silk and real zari before it is listed.",
    },
  ];

  return (
    <div className="w-full bg-ivory">
      <section className="border-b border-gold/30 bg-beige/25">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 py-12 md:py-16">
          <nav className="mb-4 flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-taupe font-medium">
            <Link to="/" className="hover:text-maroon transition-colors">
              Home
            </Link>
            <span className="text-gold/60">/</span>
            <span className="text-maroon">Saree Shop in {l.city}</span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-maroon/20 bg-maroon/5 text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-maroon font-medium mb-3">
              <MapPin className="h-3 w-3" /> {l.region}
            </span>
            <h1 className="font-serif text-4xl leading-tight text-maroon md:text-6xl">
              Saree Shop in {l.city}
            </h1>
            {/* Answer-first: the intro leads with what a local searcher needs. */}
            <p className="mt-4 text-sm md:text-base text-ink/80 leading-relaxed">{l.intro}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-full bg-maroon text-ivory text-xs font-bold uppercase tracking-widest hover:bg-wine transition-colors"
              >
                Book a styling call
              </a>
              <Link
                to="/shop"
                className="px-6 py-2.5 rounded-full border border-maroon text-maroon text-xs font-bold uppercase tracking-widest hover:bg-maroon hover:text-ivory transition-colors"
              >
                Browse sarees
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ivory py-12 md:py-16">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="grid gap-6 md:grid-cols-3">
            {assurances.map(({ icon: Icon, title, copy }) => (
              <div key={title} className="rounded-2xl border border-gold/50 bg-beige/20 p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-maroon/10 text-maroon">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-serif text-xl text-maroon">{title}</h2>
                <p className="mt-2 text-sm text-ink/80 leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-beige/30 py-12 md:py-16 border-t border-gold/30">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16">
          <h2 className="font-serif text-3xl md:text-4xl text-maroon">
            Popular with our {l.city} customers
          </h2>
          <p className="mt-2 text-sm text-ink/75">
            Chosen locally for {l.occasions.slice(0, 3).join(", ")}.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory py-12 md:py-16 border-t border-gold/30">
        <div className="w-full max-w-4xl px-4 md:px-8 lg:px-12 xl:px-16">
          <h2 className="font-serif text-3xl md:text-4xl text-maroon">
            Sarees in {l.city} — your questions
          </h2>
          <dl className="mt-8 space-y-6">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-gold/40 bg-beige/15 p-6">
                <dt className="font-serif text-lg text-maroon">{f.q}</dt>
                <dd className="mt-2 text-sm text-ink/80 leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>

          {/* Sibling links keep the local cluster internally connected. */}
          <p className="mt-10 text-sm text-ink/70">
            We also serve{" "}
            {PUBLISHED_LOCATIONS.filter((o) => o.slug !== l.slug).map((o, i, arr) => (
              <span key={o.slug}>
                <Link
                  to="/saree-shop/$city"
                  params={{ city: o.slug }}
                  className="text-maroon underline underline-offset-4 hover:text-gold"
                >
                  {o.city}
                </Link>
                {i < arr.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>
        </div>
      </section>

      <section className="bg-maroon/5 py-10 border-t border-gold/30">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 flex flex-wrap items-center gap-4">
          <MessageCircle className="h-5 w-5 text-maroon shrink-0" />
          <p className="flex-1 min-w-[16rem] text-sm text-ink/80">
            Prefer to talk it through? Message our {l.city} concierge on WhatsApp — replies in under
            an hour.
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase tracking-widest text-maroon hover:text-gold"
          >
            Chat now →
          </a>
        </div>
      </section>
    </div>
  );
}
