import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/guides.$slug";
import { ArrowRight, Clock, User, Calendar, BookOpen } from "lucide-react";
import { getGuide, GUIDES } from "~/lib/guides";
import { SITE, getSeoMeta, jsonLdScript } from "~/lib/seo";
import { articleSchema, faqSchema, breadcrumbSchema } from "~/lib/structured-data";

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data?.guide) {
    return getSeoMeta({
      title: "Guide Not Found — Mumbai Bazar",
      description: "Browse the saree guides at Mumbai Bazar.",
      path: "/guides",
      noindex: true,
    });
  }

  const g = data.guide;
  return getSeoMeta({
    title: g.title,
    description: g.description,
    path: `/guides/${g.slug}`,
    type: "article",
    keywords: g.keywords,
  });
};

export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;
  const guide = getGuide(slug || "");
  if (!guide) {
    throw new Response("Guide Not Found", { status: 404 });
  }
  return { guide };
}

export default function GuideDetailPage() {
  const { guide: g } = useLoaderData<typeof loader>();

  const schemas = [
    articleSchema({
      title: g.h1,
      description: g.description,
      path: `/guides/${g.slug}`,
      datePublished: g.published,
      dateModified: g.modified,
      authorName: g.author.name,
      authorTitle: g.author.title,
    }),
    faqSchema(g.faqs),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: g.h1, path: `/guides/${g.slug}` },
    ]),
  ];

  const otherGuides = GUIDES.filter((item) => item.slug !== g.slug).slice(0, 3);

  return (
    <div className="bg-ivory text-ink min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }}
      />

      <section className="bg-beige/35 border-b border-[#A27633]/30 py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-maroon block mb-2">
            Handloom Masterclass
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
            {g.h1}
          </h1>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-taupe">
            <span className="flex items-center gap-1 font-semibold text-ink">
              <User className="h-3.5 w-3.5 text-maroon" /> {g.author.name} ({g.author.title})
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Updated {g.modified}
            </span>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        {/* Intro */}
        <div className="prose prose-stone max-w-none text-base text-taupe leading-relaxed space-y-6">
          <p className="text-lg font-serif text-ink leading-relaxed font-normal bg-beige/30 p-6 rounded-2xl border-l-4 border-maroon">
            {g.description}
          </p>

          {/* Sections */}
          {g.sections.map((sec, idx) => (
            <div key={idx} className="mt-8 space-y-4">
              <h2 className="font-serif text-2xl font-bold text-ink border-b border-[#A27633]/20 pb-2">
                {sec.h2}
              </h2>
              {sec.body.map((p, pIdx) => (
                <p key={pIdx} className="text-sm md:text-base leading-relaxed text-taupe">
                  {p}
                </p>
              ))}
            </div>
          ))}

          {/* FAQs */}
          {g.faqs.length > 0 && (
            <div className="mt-14 pt-8 border-t border-[#A27633]/30">
              <h2 className="font-serif text-2xl font-bold text-ink mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {g.faqs.map((faq) => (
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
          )}
        </div>

        {/* Read Next Section */}
        <div className="mt-16 pt-10 border-t border-[#A27633]/20">
          <h3 className="font-serif text-xl font-bold text-ink mb-6">
            Continue Reading
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherGuides.map((item) => (
              <Link
                key={item.slug}
                to={`/guides/${item.slug}`}
                className="block p-4 rounded-2xl border border-gold/30 bg-white hover:border-maroon transition-all text-xs"
              >
                <h4 className="font-serif text-sm font-bold text-ink line-clamp-2">
                  {item.h1}
                </h4>
                <p className="text-taupe line-clamp-2 mt-1">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
