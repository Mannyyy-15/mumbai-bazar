import { useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/faq";
import { ChevronDown, MessageCircle } from "lucide-react";
import { SITE, getSeoMeta, jsonLdScript } from "~/lib/seo";
import { breadcrumbSchema, faqSchema } from "~/lib/structured-data";

export const meta: Route.MetaFunction = () => {
  return getSeoMeta({
    title: "Mumbai Bazar FAQs — Store Locations, Timings, Prices & Stitching",
    description:
      "Where our 8 saree stores are, what timings they keep, what sarees cost, and how blouse stitching, exchanges and delivery work. Answers for Nalasopara, Virar, Vasai, Bhayandar and Goregaon.",
    path: "/faq",
    keywords: [
      "mumbai bazar store timings",
      "saree shop near me",
      "best saree shop in vasai virar",
      "saree price nalasopara",
      "saree shop timings",
      "saree blouse stitching",
      "saree return policy",
    ],
  });
};

const FAQS = [
  // ---------------------------------------------------------------------------
  // Store and location questions come FIRST.
  //
  // Search Console (Aug-Sep 2026): the site ranks 2-3 for its own name and had
  // ZERO impressions for "saree shop in vasai virar", "saree shop near me" and
  // "saree price nalasopara". These answers exist to be eligible for those
  // queries, and they lead because that is the intent that converts for a shop
  // with eight physical branches.
  //
  // Answers name streets, landmarks and real prices deliberately. A vague
  // answer is never the one an AI engine quotes.
  // ---------------------------------------------------------------------------
  {
    q: "Where are your saree shops located?",
    a: "Mumbai Bazar has 8 stores across Nalasopara, Virar, Vasai, Bhayandar and Goregaon. The flagship is at Shop 1, Tiwari Nagar, Tulinj Road, Nalasopara East — near the flyover bridge, opposite Seema Complex (401209). Our other published branches are Virar West (Gaothan Road, next to Corporation Bank), Bhayandar East (Talao Road, opposite Ujwal Book Depot) and Goregaon West (Kakaji Nagar, Jawahar Nagar).",
  },
  {
    q: "Which is the best saree shop in Vasai Virar?",
    a: "It depends what you are buying. For bridal and dulhan sarees, our Nalasopara East store on Tulinj Road carries the widest range across the group — most customers come there to compare pieces side by side before a wedding. For party wear on a quicker trip, our Virar West store on Gaothan Road is easier to get in and out of.",
  },
  {
    q: "How much does a saree cost at Mumbai Bazar?",
    a: "Everyday cotton and printed sarees start around ₹800. Party wear with zari or embroidery runs ₹2,000 to ₹6,000. Designer lehengas sit at ₹5,000 to ₹15,000, and heavy dulhan and bridal pieces start near ₹12,000 and go past ₹40,000 depending on the work.",
  },
  {
    q: "What are your store timings?",
    a: `${SITE.hours.sentence}, including Sunday. Weekday mornings are the calmest; Sundays and the weeks before Diwali, Navratri and the wedding season are busiest.`,
  },
  {
    q: "Which store should I visit for a bridal or dulhan saree?",
    a: "Nalasopara East. It is our flagship and holds the largest bridal and dulhan selection of all eight stores. Call +91 89566 64631 a day ahead with your colour, budget and wedding date and we will keep a selection ready, which saves a lot of time in peak season.",
  },
  {
    q: "Which saree shop is nearest to Nalasopara station?",
    a: "Our Nalasopara East store on Tulinj Road, by the flyover bridge and opposite Seema Complex, is about ten minutes from Nalasopara station on the east side — walkable, or a short auto ride.",
  },
  {
    q: "Do I need an appointment to visit?",
    a: `No, walk in any day — ${SITE.hours.short.toLowerCase()}, seven days a week. Calling ahead only helps for bridal shopping, where telling us your colour and budget in advance means pieces are ready when you arrive rather than being pulled out while you wait.`,
  },

  // --- Range, fabric and buying -------------------------------------------
  {
    q: "What kinds of sarees do you stock?",
    a: "We carry fancy and party wear sarees, dress material, designer lehengas and dulhan (bridal) wear across all our stores. The range spans everyday budgets through to heavier bridal pieces. Our Nalasopara East store holds the widest bridal selection.",
  },
  {
    // Replaces "How do you ensure the authenticity and quality of your
    // sarees?", whose answer claimed direct partnerships with weaving clusters
    // in Varanasi, Kanchipuram and Paithan. Nothing supports that, and it is
    // the same claim family removed from this site twice before. What is
    // written now is true and checkable: you can handle the goods and ask.
    q: "Can I check the fabric before buying?",
    a: "Yes. Every piece can be seen, handled and draped in store before you buy, and our staff will tell you exactly what a saree is made of — including whether it is pure silk or a silk blend. If you are shopping remotely, message us on WhatsApp and we will send photos or video of the fabric, border and palla.",
  },
  {
    q: "Can I try and drape sarees in store before buying?",
    a: `Yes, at any of our 8 stores across Nalasopara East, Virar West, Bhayandar East and Goregaon West. ${SITE.hours.sentence}. Our staff will drape pieces for you so you can see how the fabric falls and how the colour looks on you.`,
  },
  {
    q: "Can I inspect the saree on a WhatsApp video call?",
    a: "Yes. Message our Nalasopara flagship and the staff will show you the palla, border and fabric on a live call, in natural light where possible, so you know what you are ordering before you pay.",
  },

  // --- Stitching, delivery and returns -------------------------------------
  {
    // "master tailors" removed: an unverifiable claim about staff skill.
    q: "Do you offer matching blouse stitching and fall-pico?",
    a: "Yes. Blouse stitching with your choice of neckline, padding and piping is arranged in store, alongside fall-and-pico. Turnaround is usually a few days depending on the work and how busy the wedding season is, so tell us the date you need it for when you buy.",
  },
  {
    q: "Is an unstitched blouse piece included?",
    a: "Most sarees come with a matching unstitched blouse piece, typically 0.80 m to 0.90 m. Where a piece does not include one, the staff will tell you before you buy so you can budget for matching fabric.",
  },
  {
    q: "How long does delivery take across India?",
    a: "Orders are dispatched within 24 to 48 hours. Deliveries within the Mumbai metropolitan area usually arrive in 1-2 business days; the rest of India takes 3-5 business days by courier.",
  },
  {
    q: "How does the 7-day exchange policy work?",
    a: "If you buy online or in store and want to exchange for another colour, fabric or design, you may do so within 7 days of delivery, provided the saree is unused with tags intact and the blouse piece unstitched. Custom-stitched and altered pieces cannot be exchanged.",
  },
  {
    q: "Is it cheaper to buy a saree in Vasai Virar than in Mumbai city?",
    a: "For everyday and party wear, generally yes — overheads on this belt are lower than in Dadar or Borivali, and the same fancy saree usually costs less here. For traditional silks like Kanjivaram and Paithani the specialist houses in Dadar and Girgaon carry more depth, so the trade-off is price against range.",
  },
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "FAQ", path: "/faq" },
    ]),
    faqSchema(FAQS),
  ];

  return (
    <div className="bg-ivory text-ink min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }}
      />

      <section className="bg-beige/35 border-b border-[#A27633]/30 py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-maroon block mb-2">
            Help &amp; Guidance
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-sm text-taupe max-w-2xl mx-auto leading-relaxed">
            Where our stores are, what timings they keep, what sarees cost, and how stitching, exchanges and delivery work.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-14 space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={faq.q}
              className="rounded-2xl border border-gold/40 bg-white overflow-hidden shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left font-serif text-lg font-bold text-ink hover:text-maroon transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-5 w-5 text-gold shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-maroon" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-6 text-sm text-taupe leading-relaxed border-t border-black/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}

        {/* WhatsApp Callout */}
        <div className="mt-12 rounded-3xl bg-beige/40 p-8 text-center border border-gold/30">
          <h3 className="font-serif text-xl font-bold text-ink">Have a specific question?</h3>
          <p className="text-xs text-taupe mt-1 mb-4">
            Our saree specialists are available daily on WhatsApp for instant assistance.
          </p>
          <a
            href="https://wa.me/918956664631?text=Hi%20Mumbai%20Bazar%2C%20I%20have%20a%20question"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#20ba5a]"
          >
            <MessageCircle className="h-4 w-4 fill-white" />
            <span>Chat With Us</span>
          </a>
        </div>
      </div>
    </div>
  );
}
