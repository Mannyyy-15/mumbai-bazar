import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";

import { GUIDES } from "@/lib/guides";
import { seo, jsonLd, SITE, absoluteUrl } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { PreferredSourceButton } from "@/components/site/PreferredSourceButton";

export const Route = createFileRoute("/guides/")({
  head: () => {
    const { meta, links } = seo({
      title: "Saree Guides | Weaves, Care, Draping & Bridal Advice — Mumbai Bazar",
      description:
        "Expert guides to Indian sarees — how to identify a real Banarasi, what korvai means, Paithani motifs, Nauvari draping, silk care and bridal trousseau planning.",
      path: "/guides",
      keywords: [
        "saree guide",
        "how to identify real banarasi",
        "saree draping guide",
        "silk saree care",
        "bridal trousseau checklist",
      ],
    });

    return {
      meta,
      links,
      scripts: [
        jsonLd({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Saree Guides",
          url: absoluteUrl("/guides"),
          isPartOf: { "@id": `${SITE.url}/#website` },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: GUIDES.length,
            itemListElement: GUIDES.map((g, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: absoluteUrl(`/guides/${g.slug}`),
              name: g.h1,
            })),
          },
        }),
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
          ]),
        ),
      ],
    };
  },
  component: GuidesIndex,
});

function GuidesIndex() {
  return (
    <div className="w-full bg-ivory">
      <section className="border-b border-gold/30 bg-beige/25">
        <div className="w-full px-4 py-12 md:px-8 md:py-16 lg:px-12 xl:px-16">
          <nav className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-taupe">
            <Link to="/" className="transition-colors hover:text-maroon">
              Home
            </Link>
            <span className="text-gold/60">/</span>
            <span className="text-maroon">Guides</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl leading-tight text-maroon md:text-6xl">
              Saree Guides
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-ink/80 md:text-base">
              What we have learned from two decades of sourcing handloom directly from weaving
              clusters — how to tell a real weave from a copy, what things should actually cost, and
              how to keep a silk saree for the next generation.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-12 md:px-8 md:py-16 lg:px-12 xl:px-16">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g) => (
            <li key={g.slug}>
              <Link
                to="/guides/$slug"
                params={{ slug: g.slug }}
                className="flex h-full flex-col justify-between rounded-2xl border border-gold/45 bg-beige/15 p-6 transition-all hover:-translate-y-1 hover:border-maroon hover:shadow-lg"
              >
                <div>
                  <h2 className="font-serif text-2xl leading-snug text-maroon">{g.h1}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink/80">{g.description}</p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs text-taupe">
                  <Clock className="h-3.5 w-3.5" /> {g.readMinutes} min read
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <PreferredSourceButton className="mt-10 max-w-2xl" />
      </section>
    </div>
  );
}
