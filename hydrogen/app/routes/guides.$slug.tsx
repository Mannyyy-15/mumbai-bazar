import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/guides.$slug";
import { ArrowRight, Clock, User, Calendar, BookOpen } from "lucide-react";
import { getGuide, GUIDES } from "~/lib/guides";
import { SITE, getSeoMeta, jsonLdScript } from "~/lib/seo";
import { articleSchema, faqSchema, breadcrumbSchema, howToSchema } from "~/lib/structured-data";

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
    // HowTo for the three procedural guides. Google retired the HowTo rich
    // result in 2023, so this wins no SERP feature -- it is here because AI
    // answer engines read cleanly enumerated steps, and it now matches steps
    // that are actually visible on the page (they were not, before).
    ...(g.howTo
      ? [
          howToSchema({
            name: g.howTo.name,
            description: g.howTo.description,
            path: `/guides/${g.slug}`,
            totalTime: g.howTo.totalTime,
            supplies: g.howTo.supplies,
            steps: g.howTo.steps,
          }),
        ]
      : []),
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

          {/*
            Sections.

            This rendered `{sec.h2}` -- a field that does not exist -- so every
            H2 on every guide shipped empty, and the answer paragraph, table and
            links were never output at all. Each part matters for a different
            reason: the heading is the question people search, the answer is
            the passage Google and AI engines quote, and the table is the thing
            they lift near-verbatim.
          */}
          {g.sections.map((sec) => (
            <section key={sec.heading} className="mt-10 space-y-4">
              <h2 className="font-serif text-2xl font-bold text-ink border-b border-[#A27633]/20 pb-2">
                {sec.heading}
              </h2>

              {/* Answer-first: the direct answer leads, so it is the passage
                  extracted for a featured snippet or an AI answer. */}
              <p className="answer-first rounded-xl border-l-[3px] border-gold bg-beige/30 p-5 text-sm md:text-base font-medium leading-relaxed text-ink">
                {sec.answer}
              </p>

              {sec.body.map((para) => (
                <p key={para.slice(0, 48)} className="text-sm md:text-base leading-relaxed text-taupe">
                  {para}
                </p>
              ))}

              {sec.table && (
                <figure className="not-prose mt-6">
                  <figcaption className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                    {sec.table.caption}
                  </figcaption>
                  <div className="overflow-x-auto rounded-xl border border-gold/40">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-beige/40">
                          {sec.table.headers.map((h) => (
                            <th
                              key={h}
                              scope="col"
                              className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-maroon"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sec.table.rows.map((row) => (
                          <tr key={row.join("|")} className="border-t border-gold/25">
                            {row.map((cell, ci) => (
                              <td key={ci} className="px-4 py-2.5 align-top text-ink/85">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </figure>
              )}

              {sec.links && sec.links.length > 0 && (
                <div className="not-prose flex flex-wrap gap-2 pt-1">
                  {sec.links.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="inline-flex items-center gap-1.5 rounded-full border border-maroon/30 bg-white px-4 py-2 text-xs font-semibold text-maroon transition-colors hover:border-maroon hover:bg-maroon hover:text-ivory"
                    >
                      {l.label} <ArrowRight className="h-3 w-3" />
                    </Link>
                  ))}
                </div>
              )}
            </section>
          ))}

          {/* Step-by-step procedure. Three guides carry one; none were ever
              rendered. */}
          {g.howTo && (
            <section className="mt-12 space-y-4">
              <h2 className="font-serif text-2xl font-bold text-ink border-b border-[#A27633]/20 pb-2">
                {g.howTo.name}
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-taupe">{g.howTo.description}</p>
              {g.howTo.supplies.length > 0 && (
                <p className="text-sm text-taupe">
                  <strong className="text-ink">You will need:</strong> {g.howTo.supplies.join(", ")}
                </p>
              )}
              <ol className="not-prose mt-4 space-y-3">
                {g.howTo.steps.map((step, i) => (
                  <li
                    key={step.name}
                    id={`step-${i + 1}`}
                    className="flex gap-4 rounded-xl border border-gold/40 bg-white p-5"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-maroon text-sm font-bold text-ivory">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-serif text-base font-bold text-ink">{step.name}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-taupe">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

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
