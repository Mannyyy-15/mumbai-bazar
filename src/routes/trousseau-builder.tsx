import { createFileRoute } from "@tanstack/react-router";
import { seo, jsonLd } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { TrousseauBuilder } from "@/components/site/TrousseauBuilder";
import { PageHero } from "@/components/site/PageHero";
import { IMG } from "@/lib/site-data";

export const Route = createFileRoute("/trousseau-builder")({
  head: () => {
    const { meta, links } = seo({
      title: "Bridal Trousseau Builder | Custom 3-Saree Wedding Set — Mumbai Bazar",
      description:
        "Build a custom three-saree bridal trousseau and receive a gold-embossed keepsake chest plus 15% bundle savings. Personal styling for Mumbai brides.",
      path: "/trousseau-builder",
      keywords: [
        "bridal trousseau",
        "wedding saree set",
        "trousseau saree package",
        "bridal saree bundle",
        "Mumbai bridal styling",
      ],
    });
    return {
      meta,
      links,
      scripts: [
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Trousseau Builder", path: "/trousseau-builder" },
          ]),
        ),
      ],
    };
  },
  component: TrousseauBuilderPage,
});

function TrousseauBuilderPage() {
  return (
    <div className="w-full bg-ivory">
      <PageHero
        eyebrow="Bridal Curation"
        title="Interactive Trousseau Box Builder"
        crumb="Trousseau Builder"
        copy="Curate 3 heirloom sarees for your wedding functions to unlock custom 15% bundle savings and a luxury velvet chest."
        heroImg={IMG.colWedding}
      />
      <TrousseauBuilder />
    </div>
  );
}
