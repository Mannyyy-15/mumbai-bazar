import { Link } from "react-router";
import type { Route } from "./+types/care-guide";
import { Sparkles, Sun, Droplets, Shield, Wind, ArrowRight } from "lucide-react";
import { SITE, getSeoMeta, jsonLdScript } from "~/lib/seo";
import { breadcrumbSchema } from "~/lib/structured-data";

export const meta: Route.MetaFunction = () => {
  return getSeoMeta({
    title: "How to Care for Silk Sarees | Mumbai Bazar",
    description:
      "How to wash, store, iron and protect silk sarees — practical care advice for zari, natural dyes and Mumbai humidity.",
    path: "/care-guide",
    keywords: [
      "how to care for silk sarees",
      "silk saree washing guide",
      "storing zari sarees in mumbai",
      "banarasi saree preservation",
      "muslin cloth storage",
    ],
  });
};

export default function CareGuidePage() {
  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Care Guide", path: "/care-guide" },
    ]),
  ];

  return (
    <div className="bg-ivory text-ink min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }}
      />

      <section className="bg-beige/35 border-b border-[#A27633]/30 py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-maroon block mb-2">
            Preservation Manual
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
            Pure Silk Care Guide
          </h1>
          <p className="mt-4 text-sm text-taupe max-w-2xl mx-auto leading-relaxed">
            Practical, expert advice on washing, folding, and protecting delicate handwoven zari and natural dyes from coastal humidity.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-14 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-3xl border border-gold/40 bg-white p-8 shadow-sm">
            <Droplets className="h-8 w-8 text-maroon mb-4" />
            <h3 className="font-serif text-xl font-bold text-ink mb-2">
              1. Washing &amp; Cleaning
            </h3>
            <ul className="space-y-2 text-xs md:text-sm text-taupe leading-relaxed list-disc pl-4">
              <li>Always dry clean pure Banarasi, Kanjivaram, and Paithani silks for at least the first 2-3 washes.</li>
              <li>Never use harsh chemical detergents, bleach, or chlorine.</li>
              <li>If spot cleaning is essential, use cold water and dab gently with a soft cotton cloth — never scrub zari.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-gold/40 bg-white p-8 shadow-sm">
            <Wind className="h-8 w-8 text-maroon mb-4" />
            <h3 className="font-serif text-xl font-bold text-ink mb-2">
              2. Storage &amp; Muslin Wrapping
            </h3>
            <ul className="space-y-2 text-xs md:text-sm text-taupe leading-relaxed list-disc pl-4">
              <li>Store your silk sarees wrapped loosely in breathable pure muslin or mulmul cloth bags.</li>
              <li>Avoid airtight plastic covers which trap Mumbai's coastal moisture and oxidize metallic zari.</li>
              <li>Unfold, air out in a shaded room, and refold in opposite creases every 4-6 months to prevent permanent fold tearing.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-gold/40 bg-white p-8 shadow-sm">
            <Sun className="h-8 w-8 text-maroon mb-4" />
            <h3 className="font-serif text-xl font-bold text-ink mb-2">
              3. Ironing &amp; Steaming
            </h3>
            <ul className="space-y-2 text-xs md:text-sm text-taupe leading-relaxed list-disc pl-4">
              <li>Always iron on low to medium heat with a clean cotton pressing cloth placed between the iron and silk.</li>
              <li>Never iron directly over real zari borders or stone embellishments.</li>
              <li>Avoid spraying water directly on silk while pressing, as mineral deposits cause watermark rings.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-gold/40 bg-white p-8 shadow-sm">
            <Shield className="h-8 w-8 text-maroon mb-4" />
            <h3 className="font-serif text-xl font-bold text-ink mb-2">
              4. Perfume &amp; Chemical Protection
            </h3>
            <ul className="space-y-2 text-xs md:text-sm text-taupe leading-relaxed list-disc pl-4">
              <li>Apply perfumes, hairsprays, and deodorants well before draping your saree.</li>
              <li>Direct alcohol and perfume mist immediately tarnishes real gold and silver electroplated threads.</li>
              <li>Do not use chemical mothballs directly touching the fabric; use dried neem leaves or cloves instead.</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 text-center">
          <Link to="/shop" className="btn-primary rounded-full">
            <span>Explore Handloom Sarees</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
