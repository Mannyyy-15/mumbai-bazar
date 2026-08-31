import { createFileRoute, Link } from "@tanstack/react-router";
import { seo, jsonLd, SITE } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import {
  ArrowRight,
  ShieldCheck,
  Award,
  MapPin,
  Sparkles,
  Users,
  CheckCircle2,
  Phone,
  MessageCircle,
  BookOpen,
  Store,
  Compass,
} from "lucide-react";
import { IMG } from "@/lib/site-data";
import { PUBLISHED_OUTLETS, OUTLET_COUNT } from "@/lib/locations";
import { GUIDES } from "@/lib/guides";

export const Route = createFileRoute("/about")({
  head: () => {
    const { meta, links } = seo({
      title: "About Mumbai Bazar | 8 Saree Stores Since 2009",
      description:
        "Learn about Mumbai Bazar — 8 bridal and ethnic wear boutiques across Nalasopara, Virar, Vasai, Bhayandar, and Goregaon. Direct artisan sourcing, Silk Mark purity, and transparent pricing.",
      path: "/about",
      keywords: [
        "about Mumbai Bazar",
        "saree shop nalasopara",
        "ethnic wear store mumbai",
        "saree shop Mumbai western line",
        "pure silk saree manufacturer",
        "silk mark saree mumbai",
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
        jsonLd({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Mumbai Bazar",
          description:
            "Mumbai Bazar operates 8 physical saree and ethnic wear boutiques across Mumbai, sourcing directly from 400+ master weaver families across India.",
          url: `${SITE.url}/about`,
          publisher: {
            "@type": "ClothingStore",
            name: "Mumbai Bazar",
            url: SITE.url,
            telephone: SITE.phone,
            address: {
              "@type": "PostalAddress",
              streetAddress: SITE.address.street,
              addressLocality: SITE.address.city,
              addressRegion: "Maharashtra",
              postalCode: SITE.address.postalCode,
              addressCountry: "IN",
            },
          },
        }),
      ],
    };
  },
  component: AboutPage,
});

const STATS = [
  { value: `${OUTLET_COUNT}`, label: "Retail Boutiques Across Mumbai" },
  { value: "400+", label: "Master Loom Families Supported" },
  { value: "100%", label: "Silk Mark Certified Pure Silk" },
  { value: "1,20,000+", label: "Happy Brides & Families Dressed" },
];

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Zero Middlemen Markups",
    description:
      "We partner directly with pit loom weavers in Varanasi, Kanchipuram, Paithan, and Chanderi. By eliminating agents and wholesale layers, we offer genuine handlooms at 25% to 35% better value than South Mumbai luxury boutiques.",
  },
  {
    icon: Award,
    title: "Silk Mark Certified Purity",
    description:
      "Every pure silk saree carries an authenticated Silk Mark label issued by the Central Silk Board (Ministry of Textiles, Govt. of India). We provide full chemical and burn-test transparency before you buy.",
  },
  {
    icon: Store,
    title: "In-Person Draping Across 8 Stores",
    description:
      "A saree cannot be truly appreciated through a smartphone screen alone. Feel the filament weight, inspect the reverse zari, and drape pleats under natural and warm light with guidance from our experienced saree drapers.",
  },
  {
    icon: Users,
    title: "Generational Weaver Welfare",
    description:
      "We commit to advance orders and fair remuneration, funding loom upgrades and health provisions for artisan clusters. We never rush deadlines, allowing weavers the time required for flawless heritage motifs.",
  },
];

const CLUSTERS = [
  {
    region: "Varanasi, Uttar Pradesh",
    name: "Banarasi Katan & Kadhwa Silk",
    detail: "Hand-woven on pit looms using tested silver-gold zari and authentic meenakari jaals.",
    bestFor: "North Indian bridal ceremonies, royal receptions",
  },
  {
    region: "Kanchipuram, Tamil Nadu",
    name: "Pure Mulberry Korvai Silk",
    detail: "Three-shuttle interlocked temple borders and heavy 700g+ sculpted pleating.",
    bestFor: "South Indian muhurthams, heirloom trousseaus",
  },
  {
    region: "Yeola & Paithan, Maharashtra",
    name: "Paithani Peacock Heritage",
    detail: "Muniya borders, Asavali floral vines, and radiant kaleidoscope pallu drapes.",
    bestFor: "Gudi Padwa, Ganesh Chaturthi, Maharashtrian weddings",
  },
  {
    region: "Chanderi & Maheshwar, MP",
    name: "Chanderi Silk-Cotton & Zari",
    detail: "Featherlight translucent drapes woven with pure cotton warps and silk wefts.",
    bestFor: "Daytime celebrations, sangeet, summer festivals",
  },
];

const MILESTONES = [
  {
    year: "2009",
    title: "The First Boutique Opens in Nalasopara East",
    description:
      "Founded with a singular mission: to provide authentic, beautifully crafted sarees and bridal lehengas to suburban Mumbai families without the exorbitant markups of traditional town markets.",
  },
  {
    year: "2014",
    title: "Direct Loom Sourcing Established",
    description:
      "We bypassed commercial distributors in Surat and Surat-Bhiwandi to establish direct relationships with weaver cooperatives in Varanasi and Kanchipuram, guaranteeing 100% pure silk traceability.",
  },
  {
    year: "2018",
    title: "Expansion Across the Western Line",
    description:
      "Opened boutique outlets in Virar, Vasai, and Bhayandar, becoming the go-to trousseau destination for brides across the Palghar and Thane districts.",
  },
  {
    year: "2021",
    title: "WhatsApp Video Styling Concierge",
    description:
      "Introduced live virtual showroom appointments via WhatsApp. NRI brides in the US, UK, UAE, and families across India began receiving high-definition drape previews in real-time.",
  },
  {
    year: "2024–2026",
    title: "Omnichannel Flagship & Goregaon Store",
    description:
      "Expanded into Goregaon West and launched our high-speed digital store, offering express delivery, insured transit, and 7-day doorstep reverse pickups across India.",
  },
];

function AboutPage() {
  const featuredGuides = GUIDES.slice(0, 3);

  return (
    <div className="w-full bg-[#FAF7F2] text-ink min-h-screen">
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden border-b border-gold/40 bg-gradient-to-b from-[#FFFDF9] to-[#FAF7F2] py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8 text-center">
          <nav className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-maroon">
            <Link to="/" className="hover:text-gold-deep transition-colors">
              Home
            </Link>
            <span className="text-gold-deep">/</span>
            <span>About Us</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-deep/50 bg-beige/40 text-xs font-bold uppercase tracking-wider text-maroon mb-6 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-gold-deep" /> Established 2009 · Western Mumbai
            Heritage
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold text-maroon leading-tight max-w-4xl mx-auto">
            Fourteen Years of Pure Silk Weaves & Master Handloom Artistry
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-ink/85 font-medium leading-relaxed max-w-3xl mx-auto">
            Mumbai Bazar began with a simple pledge: to bring genuine handwoven sarees directly from
            the artisan’s pit loom to your family’s most sacred celebrations, with complete fabric
            honesty and fair pricing.
          </p>

          {/* Quick CTA */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/stores"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-maroon text-white text-xs font-bold uppercase tracking-widest hover:bg-wine transition-all shadow-md"
            >
              <Store className="h-4 w-4" /> Find A Store Near You
            </Link>
            <a
              href={`https://wa.me/918956664631?text=${encodeURIComponent("Hello Mumbai Bazar team, I would like to know more about your saree collections and store visits.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-maroon bg-white text-maroon text-xs font-bold uppercase tracking-widest hover:bg-maroon hover:text-white transition-all shadow-sm"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" /> Chat With A Saree Stylist
            </a>
          </div>
        </div>
      </section>

      {/* 2. STATS STRIP */}
      <section className="border-b border-gold/40 bg-white py-10">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 text-center">
            {STATS.map((s) => (
              <div key={s.label} className="p-4 rounded-2xl bg-[#FAF7F2] border border-gold/30">
                <p className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-maroon">
                  {s.value}
                </p>
                <p className="mt-2 text-xs sm:text-sm text-ink/80 font-bold uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FOUNDERS' STORY & PURPOSE */}
      <section className="py-16 md:py-24 border-b border-gold/40">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-6 relative">
              <div className="overflow-hidden rounded-3xl border-2 border-gold/50 shadow-xl">
                <img
                  src={IMG.craft}
                  alt="Master weaver handcrafting pure silk saree at loom"
                  className="w-full h-full object-cover aspect-[4/3] sm:aspect-[1/1] hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-4 sm:right-6 bg-wine text-white p-5 rounded-2xl shadow-xl border border-gold/50 max-w-xs">
                <p className="font-serif text-lg font-bold text-gold">The Weaver’s Guild</p>
                <p className="text-xs text-white/90 font-medium mt-1">
                  Over 400 weaver families across India receive dignified livelihoods through your
                  purchases.
                </p>
              </div>
            </div>

            <div className="md:col-span-6">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-maroon">
                Our Purpose
              </span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-maroon leading-tight">
                Draping the Women of Mumbai with Authenticity & Pride
              </h2>
              <p className="mt-5 text-sm sm:text-base text-ink/85 font-medium leading-relaxed">
                For generations, purchasing a bridal Kanjivaram or a tested-zari Banarasi involved
                navigating overcrowded wholesale gullies in South Mumbai or paying quadruple prices
                at luxury designer boutiques.
              </p>
              <p className="mt-4 text-sm sm:text-base text-ink/85 font-medium leading-relaxed">
                We founded <strong>Mumbai Bazar</strong> in 2009 with a conviction that suburban
                families deserve direct access to the finest weaves of India without the inflated
                retail markups. Today, our 8 boutiques across Nalasopara, Virar, Vasai, Bhayandar,
                and Goregaon offer spacious lounges where grandmothers, mothers, and daughters can
                spend hours draping, comparing textures, and celebrating together.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "100% Transparent Fabric Disclosure on every price tag",
                  "Silk Mark certified pure mulberry, katan, and tussar silks",
                  "In-house master tailors for blouse stitching and custom fall-pico",
                  "Dedicated WhatsApp video consultation before you visit",
                ].map((point) => (
                  <div key={point} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-gold-deep shrink-0" />
                    <span className="text-xs sm:text-sm text-ink font-bold">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE 4 PILLARS OF MUMBAI BAZAR */}
      <section className="py-16 md:py-24 bg-white border-b border-gold/40">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-maroon">
              Our Core Standards
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-maroon">
              Why 1,20,000+ Families Choose Mumbai Bazar
            </h2>
            <p className="mt-3 text-sm text-ink/75 font-medium">
              We uphold the sacred relationship between the loom artisan and the family that wears
              the drape.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="p-8 rounded-3xl border border-gold/40 bg-[#FAF7F2] hover:border-maroon transition-all shadow-sm group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-maroon text-white grid place-items-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="h-7 w-7 text-gold" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-maroon">{p.title}</h3>
                  <p className="mt-3 text-sm text-ink/85 font-medium leading-relaxed">
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. ARTISAN WEAVING CLUSTERS */}
      <section className="py-16 md:py-24 border-b border-gold/40">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-maroon">
              Direct From The Source
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-maroon">
              India's Sacred Weaving Clusters
            </h2>
            <p className="mt-3 text-sm text-ink/75 font-medium">
              Every saree in our collection carries the geographic distinction and handloom
              tradition of its native cluster.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CLUSTERS.map((c) => (
              <div
                key={c.name}
                className="p-6 rounded-2xl bg-white border border-gold/40 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gold-deep mb-2">
                    <Compass className="h-3.5 w-3.5" /> {c.region}
                  </span>
                  <h4 className="font-serif text-xl font-bold text-maroon">{c.name}</h4>
                  <p className="mt-2.5 text-xs text-ink/80 font-medium leading-relaxed">
                    {c.detail}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gold/30">
                  <span className="text-[10px] uppercase font-bold text-taupe block">
                    Ideal For:
                  </span>
                  <span className="text-xs text-maroon font-bold">{c.bestFor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. JOURNEY TIMELINE */}
      <section className="py-16 md:py-24 bg-white border-b border-gold/40">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-maroon">
              Our Milestones
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-maroon">
              Fourteen Years of Honest Retail
            </h2>
          </div>

          <div className="space-y-8">
            {MILESTONES.map((m) => (
              <div
                key={m.year}
                className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-4 md:gap-8 items-start border-b border-gold/40 pb-8 last:border-0"
              >
                <span className="font-serif text-3xl sm:text-4xl font-bold text-maroon">
                  {m.year}
                </span>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-maroon">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink/85 font-medium leading-relaxed">
                    {m.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FEATURED GUIDES & BLOGS */}
      <section className="py-16 md:py-24 border-b border-gold/40">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-maroon">
                Knowledge & Care
              </span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-maroon">
                Saree Guides & Expert Advice
              </h2>
            </div>
            <Link
              to="/guides"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-maroon hover:text-gold-deep transition-colors underline underline-offset-4"
            >
              <BookOpen className="h-4 w-4" /> View All {GUIDES.length} Guides
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredGuides.map((g) => (
              <Link
                key={g.slug}
                to="/guides/$slug"
                params={{ slug: g.slug }}
                className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-gold/40 hover:border-maroon transition-all shadow-sm group"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-gold-deep font-bold">
                    {g.readMinutes} Min Read
                  </span>
                  <h3 className="font-serif text-xl font-bold text-maroon mt-2 group-hover:text-gold-deep transition-colors">
                    {g.h1}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm text-ink/80 font-medium line-clamp-3">
                    {g.description}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-gold/30 flex items-center justify-between text-xs font-bold text-maroon">
                  <span>Read Guide</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. VISIT OUR 8 BOUTIQUES / BOTTOM CTA */}
      <section className="py-16 md:py-24 bg-wine text-white">
        <div className="mx-auto max-w-5xl px-4 md:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-gold">
            Visit In Person
          </span>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Experience the Weave at our 8 Mumbai Outlets
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/85 max-w-2xl mx-auto font-medium leading-relaxed">
            Conveniently located within 5 minutes of Western Railway stations in Nalasopara, Virar,
            Vasai, Bhayandar, and Goregaon. {SITE.hours.label}.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/stores"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-maroon text-xs font-bold uppercase tracking-widest hover:bg-gold hover:text-white transition-all shadow-xl"
            >
              <MapPin className="h-4 w-4" /> Browse All 8 Store Locations
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-white/60 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-maroon transition-all"
            >
              <Phone className="h-4 w-4" /> Contact Customer Care
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
