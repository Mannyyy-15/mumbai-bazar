import { Link } from "react-router";
import type { Route } from "./+types/legal-notice";
import { SITE, getSeoMeta, jsonLdScript } from "~/lib/seo";
import { breadcrumbSchema } from "~/lib/structured-data";

export const meta: Route.MetaFunction = () => {
  return getSeoMeta({
    title: "Legal Notice & Ownership | Mumbai Bazar",
    description:
      "Legal disclaimers, trademark notices, and registered business details for Mumbai Bazar retail operations.",
    path: "/legal-notice",
    keywords: ["legal notice", "mumbai bazar ownership", "registered business details"],
  });
};

export default function LegalNoticePage() {
  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Legal Notice", path: "/legal-notice" },
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
            Statutory Disclosure
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
            Legal Notice
          </h1>
          <p className="mt-4 text-sm text-taupe max-w-2xl mx-auto leading-relaxed">
            Statutory details, intellectual property rights, and ownership disclaimers.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-14 space-y-8 text-sm text-taupe leading-relaxed">
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-ink">1. Brand Ownership</h2>
          <p>
            The trade name, brand marks, and logo &ldquo;Mumbai Bazar&rdquo; are protected intellectual property. All visual media, photographs, and editorial text published on mumbaibazar.com are copyrighted assets of Mumbai Bazar.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-ink">2. Commercial Operations</h2>
          <p>
            Mumbai Bazar operates retail storefronts across Nalasopara, Virar, Vasai, Bhayandar, and Goregaon, with its flagship boutique situated at Shop 1, Tiwari Nagar, Tulinj Road, Nalasopara East, Maharashtra 401209.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-ink">3. Agency &amp; Technical Credits</h2>
          <p>
            Digital commerce infrastructure, search optimization, and web architecture developed and maintained in collaboration with{" "}
            <a
              href={SITE.agency.url}
              target="_blank"
              rel="noreferrer"
              className="text-maroon underline font-medium"
            >
              {SITE.agency.name}
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
