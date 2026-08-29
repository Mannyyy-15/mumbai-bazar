import { createFileRoute, Link } from "@tanstack/react-router";
import { seo, jsonLd } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import {
  Droplets,
  Sun,
  Wind,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { GoldRule } from "@/components/site/Motif";
import { IMG } from "@/lib/site-data";

export const Route = createFileRoute("/care-guide")({
  head: () => {
    const { meta, links } = seo({
      title: "How to Care for Silk Sarees | Washing & Storage Guide — Mumbai Bazar",
      description:
        "How to wash, store, iron and protect silk sarees — practical care advice for zari, natural dyes and Mumbai humidity.",
      path: "/care-guide",
      keywords: [
        "how to wash silk saree",
        "silk saree care",
        "how to store sarees",
        "zari saree care",
        "saree maintenance guide",
      ],
    });
    return {
      meta,
      links,
      scripts: [
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Saree Care Guide", path: "/care-guide" },
          ]),
        ),
      ],
    };
  },
  component: CareGuide,
});

const RITUALS = [
  {
    step: "01",
    icon: Droplets,
    title: "Washing & Cleansing",
    subtitle: "Protecting Natural Dyes & Zari",
    copy: "Strictly dry clean for the first three washes. For later washes, gentle hand-wash in cold water using organic baby shampoo or mild liquid detergent.",
  },
  {
    step: "02",
    icon: Sun,
    title: "Air Drying",
    subtitle: "Preserving Fibres & Luster",
    copy: "Never wring, twist, or tumble dry. Roll the saree gently in a plush cotton towel to absorb moisture, then dry flat in a shaded, airy room.",
  },
  {
    step: "03",
    icon: Wind,
    title: "Pressing & Ironing",
    subtitle: "Zero Direct Heat on Embroidery",
    copy: "Iron on low heat setting on the reverse side. Always layer a thin cotton press-cloth between the iron and delicate gold zari or threadwork.",
  },
  {
    step: "04",
    icon: Sparkles,
    title: "Stain & Fragrance Care",
    subtitle: "Safeguarding Pure Silk",
    copy: "Apply perfume, body oil, and hairspray before draping. Never spray directly onto zari. Blot liquid spills immediately—never rub.",
  },
];

const PRESERVATION_STEPS = [
  {
    title: "Quarterly Crease Rotations",
    desc: "Refold your pure silk sarees every 3 months. Altering fold lines prevents permanent creasing and guards against zari stress.",
  },
  {
    title: "Breathable Muslin Wrap",
    desc: "Encase pure handlooms in breathable organic cotton or muslin covers. Avoid plastic or cardboard bags which trap moisture.",
  },
  {
    title: "Natural Pest Prevention",
    desc: "Place dried neem leaves or cloves in the cabinet corners. Avoid naphthalene mothballs directly touching gold and silver zari.",
  },
  {
    title: "Seasonal Sun Airing",
    desc: "Take sarees out once every season to air in a shaded breeze for one hour. This refreshes pure silk threads naturally.",
  },
];

function CareGuide() {
  return (
    <div className="w-full overflow-x-hidden bg-ivory">
      <PageHero
        eyebrow="Preserving Heritage"
        title="Pure Silk Care Guide"
        crumb="Care Guide"
        copy="Handwoven sarees are timeless treasures. With thoughtful care, your pure silks and zari weaves will remain vibrant across generations."
        img={IMG.look2}
      />

      {/* The Four Rituals Section */}
      <section className="border-b border-gold/50 py-16 md:py-24">
        <div className="mx-auto max-w-[1360px] px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow text-gold-deep">Gentle Preservation</span>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl text-ink">The 4 Care Rituals</h2>
            <p className="mt-4 text-taupe leading-relaxed">
              Follow these simple guidelines to safeguard the natural luster, zari strength, and
              silk longevity of your drapes.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {RITUALS.map(({ step, icon: Icon, title, subtitle, copy }) => (
              <div
                key={title}
                className="relative border border-gold/50 bg-beige/20 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-maroon hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center bg-maroon text-ivory">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-serif text-3xl font-bold text-gold/60">{step}</span>
                </div>
                <h3 className="mt-6 font-serif text-2xl text-ink">{title}</h3>
                <span className="mt-1 block text-[11px] uppercase tracking-wider text-maroon font-medium">
                  {subtitle}
                </span>
                <p className="mt-4 text-sm leading-relaxed text-taupe">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Storage & Preservation */}
      <section className="bg-beige/30 py-16 md:py-24 border-b border-gold/50">
        <div className="mx-auto grid max-w-[1360px] grid-cols-1 items-center gap-12 px-4 md:grid-cols-2 md:gap-16 md:px-8">
          <div className="space-y-6">
            <div>
              <span className="eyebrow text-gold-deep">Wardrobe Management</span>
              <h2 className="mt-2 font-serif text-3xl md:text-5xl text-ink">
                Storing Handwoven Silks
              </h2>
              <p className="mt-3 text-taupe">
                Proper storage guarantees that zari threadwork retains its regal sparkle without
                tarnishing.
              </p>
            </div>

            <div className="space-y-5 pt-2">
              {PRESERVATION_STEPS.map((step, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 items-start p-4 border border-gold/40 bg-ivory"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold/20 text-maroon font-bold text-xs">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-serif text-lg text-ink font-medium">{step.title}</h4>
                    <p className="mt-1 text-sm text-taupe leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 border border-gold/50 pointer-events-none" />
            <img
              src={IMG.craft}
              alt="Folded silk saree in cotton muslin"
              className="aspect-[4/5] w-full object-cover shadow-lg"
            />
            <div className="absolute bottom-6 left-6 right-6 border border-gold/50 bg-ivory/95 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-maroon shrink-0" />
                <div>
                  <h4 className="font-serif text-base text-ink">Ask About Your Fabric</h4>
                  <p className="text-xs text-taupe mt-0.5">
                    Our staff will tell you what any piece is made of.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complimentary Care Concierge CTA */}
      <section className="bg-wine text-ivory py-16 md:py-24 relative overflow-hidden">
        <div className="mx-auto max-w-[900px] px-4 md:px-8 text-center relative z-10">
          <span className="text-[11px] tracking-[0.28em] uppercase text-gold font-semibold">
            Complimentary Heritage Service
          </span>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl">The Mumbai Bazar Saree Spa</h2>
          <GoldRule className="my-6" />
          <p className="mt-5 max-w-xl mx-auto text-ivory/85 leading-relaxed text-base">
            Bring any saree bought from us back to your nearest store for a press and refresh —
            steaming, crease restoration and fresh wrapping, so it is ready for the next occasion.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              <HeartHandshake className="h-4 w-4" />
              Request Spa Service
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
