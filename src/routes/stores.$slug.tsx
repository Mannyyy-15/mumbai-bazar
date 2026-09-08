import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  MapPin,
  MessageCircle,
  Clock,
  Store,
  Phone,
  Instagram,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Navigation,
} from "lucide-react";

import { getOutlet, PUBLISHED_OUTLETS, OUTLET_COUNT, type Outlet } from "@/lib/locations";
import { seo, jsonLd, SITE } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, outletSchema } from "@/lib/structured-data";
import { ProductCard } from "@/components/site/ProductCard";
import { useCatalog } from "@/lib/catalog-context";

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
    const title = `Saree Shop in ${o.area} | Mumbai Bazar`;
    const description =
      `Mumbai Bazar ${o.area} — sarees, dress material, designer lehengas and dulhan wear. ` +
      `${o.landmark}. ${SITE.hours.shortDaily}, serving ${o.nearby.slice(0, 3).join(", ")}.`;

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
      a: `We are at ${o.street}, ${o.landmark}, ${o.area} ${o.postalCode}. ${SITE.hours.shortDaily}. Call ${phone} if you would like us to keep something aside before you arrive.`,
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
  const { products, loading } = useCatalog();
  const faqs = outletFaqs(o);
  const phone = o.phone ?? SITE.phone;
  const waNumber = (o.phone ?? SITE.phone).replace(/[^0-9]/g, "");
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hello Mumbai Bazar ${o.area}, I would like help choosing a saree and checking store stock.`,
  )}`;
  const mapHref = o.geo
    ? `https://www.google.com/maps/search/?api=1&query=${o.geo.lat},${o.geo.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `Mumbai Bazar ${o.street} ${o.area} ${o.postalCode}`,
      )}`;
  const others = PUBLISHED_OUTLETS.filter((x) => x.slug !== o.slug);

  // Live products: Select top dynamic items from Shopify catalog
  const featured = useMemo(() => {
    if (!products || products.length === 0) return [];
    return products.slice(0, 8);
  }, [products]);

  return (
    <div className="w-full bg-[#FAF7F2] text-ink min-h-screen">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden border-b border-gold/30 bg-gradient-to-b from-[#F5EFEB] to-[#FAF7F2] py-12 md:py-16">
        {/* Subtle decorative background glow */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-1/2 h-80 w-80 rounded-full bg-maroon/10 blur-3xl" />

        <div className="relative mx-auto w-full max-w-[1500px] px-4 md:px-8 lg:px-12 xl:px-16">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-maroon/80">
            <Link to="/" className="transition-colors hover:text-gold-deep">
              Home
            </Link>
            <span className="text-gold-deep font-normal">/</span>
            <Link to="/stores" className="transition-colors hover:text-gold-deep">
              Stores
            </Link>
            <span className="text-gold-deep font-normal">/</span>
            <span className="text-ink">{o.area}</span>
          </nav>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-maroon/25 bg-maroon/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-maroon">
                  <MapPin className="h-3.5 w-3.5 text-maroon" />
                  {o.flagship ? "Flagship Boutique" : o.region}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-gold/50 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink/80">
                  <Clock className="h-3 w-3 text-gold-deep" /> {SITE.hours.short}, Open Daily
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] text-maroon">
                Saree Shop in {o.area}
              </h1>

              <p className="mt-4 text-sm md:text-base leading-relaxed text-ink/80 font-medium max-w-2xl">
                {o.intro}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {o.specialities.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-white px-3 py-1 text-xs font-semibold text-maroon shadow-xs"
                  >
                    <Sparkles className="h-3 w-3 text-gold-deep" /> {item}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-maroon px-7 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-wine hover:shadow-lg hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                  <span>WhatsApp This Store</span>
                </a>
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-maroon bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-maroon shadow-xs transition-all hover:bg-maroon hover:text-white"
                >
                  <Navigation className="h-4 w-4" />
                  <span>Get Directions</span>
                </a>
                {phone && (
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 rounded-full border border-gold-deep/50 bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:border-maroon hover:text-maroon"
                  >
                    <Phone className="h-3.5 w-3.5 text-maroon" />
                    <span>{phone}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Storefront Facade Visual */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl border-2 border-gold/40 bg-white p-3 shadow-xl">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-beige/30">
                  <img
                    src="/storefront.webp"
                    alt={`Mumbai Bazar Store in ${o.area}`}
                    className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-black/70 backdrop-blur-md px-4 py-2.5 text-white">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gold">
                      {o.flagship ? "Flagship Storefront" : "Mumbai Bazar Boutique"}
                    </p>
                    <p className="text-xs font-medium text-white/90 truncate">{o.street}, {o.area}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NAP & Hours 3-Card Grid */}
      <section className="bg-white py-12 md:py-16 border-b border-gold/30">
        <div className="mx-auto w-full max-w-[1500px] px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Address */}
            <div className="rounded-2xl border border-gold/50 bg-[#FAF7F2] p-6 sm:p-7 shadow-xs hover:border-maroon transition-all">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-maroon text-white shadow-sm">
                <Store className="h-6 w-6" />
              </span>
              <h2 className="mt-4 font-serif text-2xl font-bold text-maroon">Store Address</h2>
              <address className="mt-2.5 text-sm not-italic leading-relaxed text-ink/85 font-medium">
                {o.street}
                <br />
                <span className="text-taupe">{o.landmark}</span>
                <br />
                {o.area}, {o.region} {o.postalCode}
              </address>
              <a
                href={mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-maroon hover:text-gold-deep transition-colors underline underline-offset-4"
              >
                <Navigation className="h-3.5 w-3.5" /> View on Google Maps
              </a>
            </div>

            {/* Opening Hours */}
            <div className="rounded-2xl border border-gold/50 bg-[#FAF7F2] p-6 sm:p-7 shadow-xs hover:border-maroon transition-all">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-maroon text-white shadow-sm">
                <Clock className="h-6 w-6" />
              </span>
              <h2 className="mt-4 font-serif text-2xl font-bold text-maroon">Opening Hours</h2>
              <p className="mt-2.5 text-sm leading-relaxed text-ink/85 font-medium">
                <strong className="text-maroon font-bold">
                  {SITE.hours.label.replace("Open daily: ", "")}
                </strong>
                <br />
                Open all 7 days a week, including Sundays.
                <br />
                <span className="text-taupe text-xs mt-1 block">
                  Walk in any time, or call ahead during festive & wedding dates.
                </span>
              </p>
            </div>

            {/* Contact & WhatsApp */}
            <div className="rounded-2xl border border-gold/50 bg-[#FAF7F2] p-6 sm:p-7 shadow-xs hover:border-maroon transition-all">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-maroon text-white shadow-sm">
                <Phone className="h-6 w-6" />
              </span>
              <h2 className="mt-4 font-serif text-2xl font-bold text-maroon">Call &amp; WhatsApp</h2>
              <div className="mt-2.5 text-sm leading-relaxed text-ink/85 font-medium space-y-1.5">
                <p>
                  Store Contact:{" "}
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-bold text-maroon hover:underline">
                    {phone}
                  </a>
                </p>
                <p>
                  WhatsApp Support:{" "}
                  <a href={waHref} target="_blank" rel="noopener noreferrer" className="font-bold text-[#25D366] hover:underline">
                    Chat with {o.area} team
                  </a>
                </p>
                {o.instagram && (
                  <p className="pt-1">
                    <a
                      href={o.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-maroon hover:text-gold-deep"
                    >
                      <Instagram className="h-4 w-4" /> Follow @{o.slug === "nalasopara" ? "mumbai__bazar__nalasopara" : "mumbai_bazar"}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Dynamic In-Store Collection Grid */}
      <section className="py-14 md:py-20 border-b border-gold/30 bg-[#FAF7F2]">
        <div className="mx-auto w-full max-w-[1500px] px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-maroon/10 px-3.5 py-1 rounded-full text-xs font-bold text-maroon uppercase tracking-wider mb-2">
                Available In Store &amp; Online
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-maroon">
                Popular Sarees in {o.area}
              </h2>
              <p className="mt-2 text-sm text-ink/80 max-w-xl font-medium">
                Try and drape these handcrafted drapes in person at our {o.area} store, or order directly online with complimentary delivery across India.
              </p>
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-maroon bg-white text-xs font-bold uppercase tracking-widest text-maroon hover:bg-maroon hover:text-white transition-all shadow-xs"
            >
              <span>Explore All {products.length || "30+"} Sarees</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="aspect-[3/4] rounded-2xl bg-beige/40 animate-pulse" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-taupe">Loading latest pieces...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5 sm:gap-6 md:grid-cols-3 xl:grid-cols-4 lg:gap-8">
              {featured.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Why Visit Us In-Store */}
      <section className="bg-white py-14 md:py-20 border-b border-gold/30">
        <div className="mx-auto w-full max-w-[1500px] px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-gold-deep font-bold block mb-2">
              The Mumbai Bazar Boutique Experience
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-maroon">
              Why Visit Us in {o.area}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 rounded-2xl border border-gold/40 bg-[#FAF7F2] text-center space-y-3">
              <span className="grid h-12 w-12 mx-auto place-items-center rounded-full bg-maroon/10 text-maroon">
                <CheckCircle2 className="h-6 w-6" />
              </span>
              <h3 className="font-serif text-xl font-bold text-maroon">Touch &amp; Drape</h3>
              <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
                Feel the authentic zari, inspect the pure silk weave, and try the drape before you take it home.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-gold/40 bg-[#FAF7F2] text-center space-y-3">
              <span className="grid h-12 w-12 mx-auto place-items-center rounded-full bg-maroon/10 text-maroon">
                <Sparkles className="h-6 w-6" />
              </span>
              <h3 className="font-serif text-xl font-bold text-maroon">10,000+ Saree Designs</h3>
              <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
                Extensive fresh inventory across Banarasi, Kanjivaram, Paithani, and designer lehengas.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-gold/40 bg-[#FAF7F2] text-center space-y-3">
              <span className="grid h-12 w-12 mx-auto place-items-center rounded-full bg-maroon/10 text-maroon">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <h3 className="font-serif text-xl font-bold text-maroon">Direct Weaver Pricing</h3>
              <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
                Ethically curated from Indian loom clusters with honest pricing and no middleman markups.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-gold/40 bg-[#FAF7F2] text-center space-y-3">
              <span className="grid h-12 w-12 mx-auto place-items-center rounded-full bg-maroon/10 text-maroon">
                <MessageCircle className="h-6 w-6" />
              </span>
              <h3 className="font-serif text-xl font-bold text-maroon">Personal Stylists</h3>
              <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
                Our in-store bridal consultants help match sarees to your wedding jewelry and skin tones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQs Section */}
      <section className="py-14 md:py-20 bg-[#FAF7F2] border-b border-gold/30">
        <div className="mx-auto w-full max-w-4xl px-4 md:px-8">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-[0.2em] text-gold-deep font-bold block mb-2">
              Helpful Information
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-maroon">
              Visiting Our {o.area} Store
            </h2>
          </div>

          <dl className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-gold/50 bg-white p-6 shadow-xs">
                <dt className="font-serif text-xl font-bold text-maroon">{f.q}</dt>
                <dd className="mt-2.5 text-sm leading-relaxed text-ink/85 font-medium">{f.a}</dd>
              </div>
            ))}
          </dl>

          {/* Sibling Stores */}
          {others.length > 0 && (
            <div className="mt-12 p-6 rounded-2xl border border-gold/40 bg-white text-center">
              <h3 className="font-serif text-lg font-bold text-maroon mb-3">Our Other Stores in Mumbai</h3>
              <div className="flex flex-wrap justify-center gap-2.5">
                {others.map((x) => (
                  <Link
                    key={x.slug}
                    to="/stores/$slug"
                    params={{ slug: x.slug }}
                    className="px-4 py-2 rounded-full border border-gold/50 bg-[#FAF7F2] text-xs font-bold text-maroon hover:bg-maroon hover:text-white transition-all shadow-2xs"
                  >
                    {x.area} Store →
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. VIP WhatsApp Hold Banner */}
      <section className="bg-maroon text-white py-12 px-4 md:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <MessageCircle className="h-8 w-8 text-[#25D366] mx-auto" />
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-ivory">
            Want us to hold a saree for you before you visit?
          </h2>
          <p className="text-sm md:text-base text-white/85 max-w-xl mx-auto font-medium">
            Message the {o.area} store on WhatsApp with the saree style you are looking for, and our team will keep it ready for your trial.
          </p>
          <div className="pt-2">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-maroon shadow-lg transition-all hover:bg-gold hover:text-maroon"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              <span>Message {o.area} on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
