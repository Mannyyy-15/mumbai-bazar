import { createFileRoute, Link } from "@tanstack/react-router";
import { seo, jsonLd } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { ArrowRight, Heart, Award, MapPin } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { GoldRule } from "@/components/site/Motif";
import { IMG } from "@/lib/site-data";

export const Route = createFileRoute("/about")({
  head: () => {
    const { meta, links } = seo({
      title: "About Mumbai Bazar | 8 Saree & Lehenga Stores Across Mumbai",
      description:
        "Mumbai Bazar runs 8 saree and ethnic wear stores across Nalasopara, Virar, Vasai, Bhayandar and Goregaon, serving the western line since 2009.",
      path: "/about",
      keywords: [
        "about Mumbai Bazar",
        "saree shop nalasopara",
        "ethnic wear store mumbai",
        "saree shop Mumbai",
      ],
    });
    return {
      meta,
      links,
      scripts: [
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ),
      ],
    };
  },
  component: About,
});

const MILESTONES: [string, string][] = [
  ["2014", "Founded as a small studio in South Mumbai with a single Banarasi loom partner."],
  ["2017", "Grew our weaver network across Varanasi, Kanchipuram and Chanderi."],
  ["2020", "Launched personal WhatsApp styling — a saree expert for every customer."],
  ["2023", "Opened the flagship boutique. 400+ artisans in the extended family."],
];

const VALUES = [
  {
    icon: Heart,
    title: "Human hands",
    copy: "Every piece is handwoven — no power looms, no shortcuts.",
  },
  {
    icon: Award,
    title: "Silk Mark verified",
    copy: "Independently tested silks and real zari, always disclosed.",
  },
  {
    icon: MapPin,
    title: "Rooted in India",
    copy: "Direct-from-cluster sourcing across seven weaving regions.",
  },
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="Since 2014"
        title="A modern boutique for heirloom sarees"
        crumb="About Us"
        copy="Mumbai Bazar is a family-run studio that partners with master weavers across India. We curate sarees the way our mothers did — feeling every fabric, checking every zari."
        img={IMG.craft}
      />

      {/* Values */}
      <section className="bg-ivory py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4 md:px-8">
          <div className="text-center">
            <span className="eyebrow">What guides us</span>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl text-ink">Craft, honestly done.</h2>
            <div className="mt-4 flex justify-center">
              <GoldRule />
            </div>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, copy }) => (
              <div key={title} className="text-center px-4">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-beige/60 text-maroon">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-serif text-2xl text-ink">{title}</h3>
                <p className="mt-3 text-sm text-taupe leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial */}
      <section className="bg-beige/40 py-20 md:py-28">
        <div className="mx-auto grid max-w-[1360px] grid-cols-1 items-center gap-12 px-4 md:grid-cols-12 md:gap-16 md:px-8">
          <div className="md:col-span-6">
            <img
              src={IMG.look3}
              alt="Draping session at the boutique"
              className="w-full object-cover aspect-[4/5]"
            />
          </div>
          <div className="md:col-span-6">
            <span className="eyebrow">The Founders</span>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl leading-tight text-ink">
              Two sisters, one obsession.
            </h2>
            <p className="mt-5 text-taupe leading-relaxed">
              Aditi and Meher grew up between their grandmother's Banarasi trunks and their mother's
              Kanjivarams. Mumbai Bazar began as a project to bring the same care they saw at home
              to a modern audience — with photography that actually shows the weave, and expert
              styling one WhatsApp message away.
            </p>
            <p className="mt-4 text-taupe leading-relaxed">
              Today, we work directly with more than 400 artisans and their families, paying fair
              wages, funding tools and looms, and never pushing a design deadline that would
              compromise the weave.
            </p>
            <Link to="/our-story" className="link-gold mt-8 inline-flex">
              Read the craft story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-ivory py-20 md:py-28">
        <div className="mx-auto max-w-[1000px] px-4 md:px-8">
          <div className="text-center">
            <span className="eyebrow">Our journey</span>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl text-ink">
              Ten years, one loom at a time.
            </h2>
          </div>
          <ol className="mt-14 space-y-8">
            {MILESTONES.map(([year, note]) => (
              <li
                key={year}
                className="grid grid-cols-[80px_1fr] items-start gap-6 border-b border-gold/50 pb-6 md:grid-cols-[120px_1fr]"
              >
                <span className="font-serif text-3xl text-maroon md:text-4xl">{year}</span>
                <p className="text-taupe leading-relaxed md:text-lg">{note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-wine text-ivory py-20 md:py-24">
        <div className="mx-auto max-w-[900px] px-4 md:px-8 text-center">
          <span className="text-[11px] tracking-[0.28em] uppercase text-gold">
            Visit the boutique
          </span>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl">Come drape a saree with us.</h2>
          <p className="mt-5 max-w-xl mx-auto text-ivory/80 leading-relaxed">
            Book a private appointment at our Mumbai flagship, or start a conversation with a saree
            expert from anywhere in the world.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/contact" className="btn-primary">
              Book a Visit
            </Link>
            <Link to="/collections" className="link-gold">
              Explore Collections <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
