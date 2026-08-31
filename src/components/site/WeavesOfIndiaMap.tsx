import { useState } from "react";
import { Compass, Award, Clock, Sparkles } from "lucide-react";

type Region = {
  id: string;
  name: string;
  location: string;
  weaveType: string;
  hoursToWeave: string;
  silkGrade: string;
  zariDetail: string;
  description: string;
  image: string;
};

const REGIONS: Region[] = [
  {
    id: "banaras",
    name: "Varanasi (Banaras)",
    location: "Uttar Pradesh",
    weaveType: "Kadhwa & Tanchoi Silk",
    hoursToWeave: "180 – 350 Hours",
    silkGrade: "100% Pure Mulberry Silk",
    zariDetail: "Real Tested Gold & Silver Zari",
    description:
      "Crafted along the ancient banks of the Ganges, Banarasi sarees feature intricate brocade weaving, floral jaals, and Mughal-inspired motifs woven by master Muslim and Hindu weavers passed down through 5 generations.",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "kanchipuram",
    name: "Kanchipuram",
    location: "Tamil Nadu",
    weaveType: "Korvai Triple-Warp Silk",
    hoursToWeave: "220 – 400 Hours",
    silkGrade: "Grade 6A Mulberry Silk",
    zariDetail: "Pure Silver Threaded Gold Zari",
    description:
      "Renowned as the Temple Town Weave, Kanjivaram sarees use three ply silk yarn twisted with silver zari. The body and border are woven separately and interlocking in a seamless 'Korvai' joint that lasts for generations.",
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "paithan",
    name: "Paithan",
    location: "Maharashtra",
    weaveType: "Paithani Tapestry Silk",
    hoursToWeave: "300 – 600 Hours",
    silkGrade: "Handspun Pure Raw Silk",
    zariDetail: "Solid Gold Thread Borders",
    description:
      "Famous for its peacock (Mor) and lotus motifs, Paithani sarees feature hand-tapestry weaves where identical patterns appear on both front and back without any floats.",
    image:
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "chanderi",
    name: "Chanderi",
    location: "Madhya Pradesh",
    weaveType: "Chanderi Tissue & Tissue Silk",
    hoursToWeave: "120 – 200 Hours",
    silkGrade: "Mulberry & Cotton Blend",
    zariDetail: "Antique Gold Thread",
    description:
      "Favored by Scindia royalty, Chanderi sarees are celebrated for their shimmering sheer texture, featherlight weight, and delicate coin (Ashrafi) motifs.",
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800",
  },
];

export function WeavesOfIndiaMap() {
  const [activeRegion, setActiveRegion] = useState<Region>(REGIONS[0]);

  return (
    <section className="bg-ivory py-16 md:py-24 border-y border-gold/40">
      <div className="mx-auto max-w-[1360px] px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold/40 bg-gold/10 text-xs uppercase tracking-[0.16em] text-gold-deep font-bold mb-3">
            <Compass className="h-3.5 w-3.5 text-gold-deep" /> Geographical Heritage
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-maroon font-medium leading-tight">
            Craftsmanship & Weaves of India
          </h2>
          <p className="mt-3 text-sm md:text-base text-ink/80 font-medium leading-relaxed">
            Every thread in Mumbai Bazar originates from India's most prestigious handloom clusters.
            Select a cluster below to explore its weaving heritage.
          </p>
        </div>

        {/* Region Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-12">
          {REGIONS.map((r) => {
            const active = activeRegion.id === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setActiveRegion(r)}
                className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.2em] font-semibold transition-all ${
                  active
                    ? "bg-maroon text-ivory shadow-lg scale-105"
                    : "bg-beige/30 text-ink border border-gold/40 hover:border-maroon"
                }`}
              >
                {r.name}
              </button>
            );
          })}
        </div>

        {/* Active Region Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center rounded-3xl border border-gold/50 bg-beige/10 p-6 md:p-10 shadow-sm">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gold/40 shadow-md">
            <img
              src={activeRegion.image}
              alt={activeRegion.name}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute top-4 left-4 rounded-full bg-maroon/90 text-ivory px-3.5 py-1 text-[10px] font-semibold uppercase tracking-widest backdrop-blur-sm">
              {activeRegion.location}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-deep">
                {activeRegion.weaveType}
              </span>
              <h3 className="font-serif text-3xl md:text-4xl text-maroon font-medium mt-1">
                {activeRegion.name}
              </h3>
              <p className="mt-3 text-sm md:text-base text-ink/80 leading-relaxed font-sans">
                {activeRegion.description}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gold/40">
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-taupe">
                  <Clock className="h-3 w-3 text-gold-deep" /> Weave Time
                </span>
                <p className="font-serif text-base text-maroon font-semibold">
                  {activeRegion.hoursToWeave}
                </p>
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-taupe">
                  <Award className="h-3 w-3 text-gold-deep" /> Silk Purity
                </span>
                <p className="font-serif text-base text-maroon font-semibold">
                  {activeRegion.silkGrade}
                </p>
              </div>

              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-taupe">
                  <Sparkles className="h-3 w-3 text-gold-deep" /> Zari Purity
                </span>
                <p className="font-serif text-base text-maroon font-semibold">
                  {activeRegion.zariDetail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
