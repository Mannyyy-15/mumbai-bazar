import { createFileRoute, Link } from "@tanstack/react-router";
import { IMG } from "@/lib/site-data";
import { ArrowRight, Sparkles, ShieldCheck, HeartHandshake, Award } from "lucide-react";

export const Route = createFileRoute("/our-story")({
  head: () => ({
    meta: [
      { title: "Our Story — Mumbai Bazar" },
      { name: "description", content: "The story behind Mumbai Bazar — heirloom weaves, personal styling and a modern saree boutique." },
      { property: "og:title", content: "Our Story — Mumbai Bazar" },
      { property: "og:description", content: "Tradition in every thread." },
    ],
  }),
  component: StoryPage,
});

export function StoryPage() {
  return (
    <>
      {/* Hero Header */}
      <section className="relative bg-maroon text-ivory border-b border-gold/30 overflow-hidden py-16 md:py-24">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 grid grid-cols-1 lg:grid-cols-12 items-center gap-10 md:gap-16">
          <div className="lg:col-span-7">
            <nav className="mb-6 flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-ivory/70 font-medium">
              <Link to="/" className="hover:text-gold transition-colors">Home</Link>
              <span className="text-gold">/</span>
              <span className="text-ivory">Our Story</span>
            </nav>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold/40 bg-gold/10 text-[10px] tracking-[0.3em] uppercase text-gold font-medium mb-4">
              <Sparkles className="h-3 w-3" />
              <span>Authentic Heritage</span>
            </span>
            <h1 className="font-serif text-4xl leading-tight text-ivory md:text-6xl lg:text-7xl">
              A boutique built on <em className="not-italic text-gold italic font-serif">weave and warmth.</em>
            </h1>
            <p className="mt-6 max-w-2xl text-base md:text-lg text-ivory/85 leading-relaxed">
              Mumbai Bazar was born from a simple idea — that every woman deserves to find her heirloom saree with the same care, authenticity, and personal warmth she would receive from a trusted family atelier.
            </p>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative overflow-hidden rounded-3xl border border-gold/40 shadow-2xl">
              <img
                src={IMG.craft}
                alt="Weaver at a handloom"
                className="w-full aspect-[4/5] object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Chapters Story Section */}
      <section className="bg-ivory py-16 md:py-24">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 max-w-5xl mx-auto space-y-16">
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium">Our Philosophy</span>
            <h2 className="font-serif text-3xl md:text-5xl text-maroon mt-2">What We Believe</h2>
            <div className="w-16 h-0.5 bg-gold/60 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-gold/50 bg-beige/20 p-8 shadow-sm hover:shadow-lg transition-all">
              <div className="h-10 w-10 rounded-xl bg-maroon text-gold flex items-center justify-center mb-5">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-2xl text-maroon mb-3">Weave First</h3>
              <p className="text-sm text-ink/80 leading-relaxed">
                We choose sarees strictly for the beauty of the weave, purity of the silk thread, and honesty of the craft — never for shortcuts or mass synthetic blends.
              </p>
            </div>

            <div className="rounded-2xl border border-gold/50 bg-beige/20 p-8 shadow-sm hover:shadow-lg transition-all">
              <div className="h-10 w-10 rounded-xl bg-maroon text-gold flex items-center justify-center mb-5">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-2xl text-maroon mb-3">Artisan Direct</h3>
              <p className="text-sm text-ink/80 leading-relaxed">
                By partnering directly with weaver families across Banaras, Kanchipuram, and Paithan, we ensure fair compensation for artisans and fair pricing for you.
              </p>
            </div>

            <div className="rounded-2xl border border-gold/50 bg-beige/20 p-8 shadow-sm hover:shadow-lg transition-all">
              <div className="h-10 w-10 rounded-xl bg-maroon text-gold flex items-center justify-center mb-5">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-2xl text-maroon mb-3">Personal Care</h3>
              <p className="text-sm text-ink/80 leading-relaxed">
                Every order undergoes a multi-point quality inspection, gift-ready packaging, and personal WhatsApp styling assistance whenever you need help.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Quote Section */}
      <section className="bg-beige/30 py-16 md:py-24 border-y border-gold/30">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
            <div className="lg:col-span-6 overflow-hidden rounded-3xl border border-gold/40 shadow-xl">
              <img src={IMG.look2} alt="Woman in an ivory saree in a heritage courtyard" className="w-full aspect-[4/3] md:aspect-[16/10] object-cover" />
            </div>
            <div className="lg:col-span-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium">Made for You</span>
              <h2 className="font-serif text-3xl md:text-5xl leading-tight text-maroon mt-2">
                Curated for women who cherish timeless drapes.
              </h2>
              <p className="mt-5 text-sm md:text-base text-ink/80 leading-relaxed">
                Whether you are choosing your first bridal silk saree, gifting your mother a precious heirloom, or selecting a light festive drape — Mumbai Bazar is your personal boutique for moments that matter.
              </p>
              <div className="mt-8">
                <Link
                  to="/collections"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-maroon text-ivory text-[11px] tracking-[0.25em] uppercase hover:bg-wine transition-all shadow-md"
                >
                  <span>Explore Collections</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
