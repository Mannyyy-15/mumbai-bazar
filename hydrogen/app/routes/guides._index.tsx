import { Link } from "react-router";
import type { Route } from "./+types/guides._index";
import { BookOpen, ArrowRight, Clock } from "lucide-react";
import { SITE, getSeoMeta, jsonLdScript } from "~/lib/seo";
import { breadcrumbSchema } from "~/lib/structured-data";
import { GUIDES } from "~/lib/guides";

export const meta: Route.MetaFunction = () => {
  return getSeoMeta({
    title: "Saree Guides: Weaves, Care & Draping | Mumbai Bazar",
    description:
      "Expert guides to Indian saree weaves, fabric purity tests, wedding trousseau planning, and silk care. Written by our head of curation.",
    path: "/guides",
    keywords: [
      "saree guides",
      "how to drape saree",
      "silk saree care",
      "banarasi saree guide",
      "kanjivaram saree guide",
      "pure silk vs art silk",
      "bridal trousseau guide",
    ],
  });
};

export default function GuidesIndexPage() {
  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
    ]),
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
            Curator Journal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink">
            Saree Guides: Weaves, Care &amp; Draping
          </h1>
          <p className="mt-3 text-sm text-taupe max-w-2xl mx-auto leading-relaxed">
            Written by master handloom experts. In-depth knowledge on identifying pure silk, preservation in humid climates, and traditional bridal styling.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {GUIDES.map((g) => (
            <Link
              key={g.slug}
              to={`/guides/${g.slug}`}
              className="group rounded-3xl border border-gold/40 bg-white p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-maroon bg-maroon/10 px-2.5 py-1 rounded-full">
                  Expert Guide
                </span>
                <h3 className="font-serif text-xl font-bold text-ink mt-3 group-hover:text-maroon transition-colors line-clamp-2">
                  {g.h1}
                </h3>
                <p className="mt-2 text-xs text-taupe leading-relaxed line-clamp-3">
                  {g.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between text-xs text-maroon font-bold">
                <span>Read Full Article</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
