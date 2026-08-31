import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock, ArrowRight } from "lucide-react";

import { getGuide, GUIDES } from "@/lib/guides";
import { seo, jsonLd } from "@/lib/seo";
import { PreferredSourceButton } from "@/components/site/PreferredSourceButton";
import { articleSchema, howToSchema, faqSchema, breadcrumbSchema } from "@/lib/structured-data";

export const Route = createFileRoute("/guides/$slug")({
  loader: ({ params }) => {
    const guide = getGuide(params.slug);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return seo({
        title: "Guide not found — Mumbai Bazar",
        description: "Browse the saree guides at Mumbai Bazar.",
        path: "/guides",
        noindex: true,
      });
    }
    const g = loaderData.guide;
    const { meta, links } = seo({
      title: g.title,
      description: g.description,
      path: `/guides/${g.slug}`,
      type: "article",
      keywords: g.keywords,
    });

    const scripts = [
      jsonLd(
        articleSchema({
          title: g.h1,
          description: g.description,
          path: `/guides/${g.slug}`,
          datePublished: g.published,
          dateModified: g.modified,
          authorName: g.author.name,
          authorTitle: g.author.title,
        }),
      ),
      jsonLd(faqSchema(g.faqs)),
      jsonLd(
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: g.h1, path: `/guides/${g.slug}` },
        ]),
      ),
    ];

    // Procedural guides also emit HowTo.
    //
    // To be clear about what this does and does not buy: Google retired HowTo
    // rich results in September 2023, so this wins no step carousel and no SERP
    // feature. It is kept because it is still valid schema.org and gives AI
    // answer engines cleanly enumerated steps to quote — the same reason the
    // FAQPage markup stays after Google retired FAQ rich results in May 2026.
    // Do not invest further in it expecting a Google SERP feature.
    if (g.howTo) {
      scripts.splice(
        1,
        0,
        jsonLd(
          howToSchema({
            name: g.howTo.name,
            description: g.howTo.description,
            path: `/guides/${g.slug}`,
            totalTime: g.howTo.totalTime,
            supplies: g.howTo.supplies,
            steps: g.howTo.steps,
          }),
        ),
      );
    }

    return {
      meta: [
        ...meta,
        { property: "article:published_time", content: g.published },
        { property: "article:modified_time", content: g.modified },
        { property: "article:author", content: g.author.name },
      ],
      links,
      scripts,
    };
  },
  component: GuidePage,
});

function GuidePage() {
  const { guide: g } = Route.useLoaderData();
  const related = GUIDES.filter((o) => o.slug !== g.slug).slice(0, 3);

  return (
    <article className="w-full bg-ivory">
      <header className="border-b border-gold/30 bg-beige/25">
        <div className="mx-auto w-full max-w-3xl px-4 py-12 md:px-8 md:py-16">
          <nav className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-taupe">
            <Link to="/" className="transition-colors hover:text-maroon">
              Home
            </Link>
            <span className="text-gold/60">/</span>
            <Link to="/guides" className="transition-colors hover:text-maroon">
              Guides
            </Link>
          </nav>

          <h1 className="font-serif text-4xl leading-tight text-maroon md:text-5xl">{g.h1}</h1>

          {/* .answer-first is what the speakable schema points at. */}
          <p className="answer-first mt-5 text-base leading-relaxed text-ink/85">{g.standfirst}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-taupe">
            <span>
              By <strong className="text-ink">{g.author.name}</strong>, {g.author.title}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {g.readMinutes} min read
            </span>
            <span>
              Updated{" "}
              {new Date(g.modified).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl px-4 py-12 md:px-8 md:py-16">
        {g.sections.map((s) => (
          <section key={s.heading} className="mb-12">
            <h2 className="font-serif text-2xl leading-snug text-maroon md:text-3xl">
              {s.heading}
            </h2>

            {/* Answer-first: the direct answer leads, styled to stand out. */}
            <p className="answer-first mt-4 rounded-xl border-l-[3px] border-gold bg-beige/25 p-5 text-[15px] font-medium leading-relaxed text-ink">
              {s.answer}
            </p>

            {s.body.map((para) => (
              <p key={para.slice(0, 40)} className="mt-4 text-[15px] leading-relaxed text-ink/80">
                {para}
              </p>
            ))}

            {s.table && (
              <figure className="mt-6">
                <figcaption className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                  {s.table.caption}
                </figcaption>
                <div className="overflow-x-auto rounded-xl border border-gold/40">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-beige/40">
                        {s.table.headers.map((h) => (
                          <th
                            key={h}
                            className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-maroon"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {s.table.rows.map((row) => (
                        <tr key={row[0]} className="border-t border-gold/25">
                          {row.map((cell) => (
                            <td key={cell} className="px-4 py-2.5 align-top text-ink/85">
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
          </section>
        ))}

        {g.howTo && (
          <section className="mb-12">
            <h2 className="font-serif text-2xl leading-snug text-maroon md:text-3xl">
              {g.howTo.name}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{g.howTo.description}</p>

            <p className="mt-4 text-sm text-taupe">
              <strong className="text-ink">You will need:</strong> {g.howTo.supplies.join(", ")}
            </p>

            <ol className="mt-6 space-y-4">
              {g.howTo.steps.map((step, i) => (
                <li
                  key={step.name}
                  id={`step-${i + 1}`}
                  className="flex gap-4 rounded-xl border border-gold/40 bg-beige/15 p-5"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-maroon text-sm font-bold text-ivory">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg text-maroon">{step.name}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-ink/80">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className="mb-12">
          <h2 className="font-serif text-2xl leading-snug text-maroon md:text-3xl">
            Frequently asked
          </h2>
          <dl className="mt-6 space-y-5">
            {g.faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-gold/40 bg-beige/15 p-5">
                <dt className="font-serif text-lg text-maroon">{f.q}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-ink/80">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Funnel down to the matching commercial page. */}
        <Link
          to={g.relatedPath}
          className="flex items-center justify-between gap-4 rounded-2xl border border-maroon/25 bg-maroon/5 p-6 transition-colors hover:border-maroon"
        >
          <span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">
              Next
            </span>
            <span className="mt-1 block font-serif text-xl text-maroon">{g.relatedLabel}</span>
          </span>
          <ArrowRight className="h-5 w-5 shrink-0 text-maroon" />
        </Link>

        <PreferredSourceButton
          className="mt-8"
          label="Get our guides first on Google"
          hint="Add Mumbai Bazar as a preferred source and our new weave guides and arrivals surface higher in your Google Search and Discover feed."
        />

        <section className="mt-12 border-t border-gold/30 pt-8">
          <h2 className="font-serif text-xl text-maroon">More guides</h2>
          <ul className="mt-4 space-y-2.5">
            {related.map((o) => (
              <li key={o.slug}>
                <Link
                  to="/guides/$slug"
                  params={{ slug: o.slug }}
                  className="text-[15px] text-maroon underline decoration-gold underline-offset-4 hover:text-gold"
                >
                  {o.h1}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
