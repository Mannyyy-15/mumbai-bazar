import { createFileRoute } from "@tanstack/react-router";
import { TrousseauBuilder } from "@/components/site/TrousseauBuilder";
import { PageHero } from "@/components/site/PageHero";
import { IMG } from "@/lib/site-data";

export const Route = createFileRoute("/trousseau-builder")({
  head: () => ({
    meta: [
      { title: "Bridal Trousseau Box Builder — Mumbai Bazar" },
      { name: "description", content: "Build your custom 3-piece bridal trousseau saree set and receive a luxury gold-embossed chest + 15% bundle savings." },
    ],
  }),
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
