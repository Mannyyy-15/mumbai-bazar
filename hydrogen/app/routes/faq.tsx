import { useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/faq";
import { ChevronDown, MessageCircle } from "lucide-react";
import { SITE, getSeoMeta, jsonLdScript } from "~/lib/seo";
import { breadcrumbSchema, faqSchema } from "~/lib/structured-data";

export const meta: Route.MetaFunction = () => {
  return getSeoMeta({
    title: "Frequently Asked Questions | Mumbai Bazar Sarees",
    description:
      "Answers to common questions about saree fabrics, bridal orders, blouse stitching, returns, and store timings across our 8 Mumbai branches.",
    path: "/faq",
    keywords: [
      "saree shopping faq",
      "mumbai bazar returns",
      "saree delivery time",
      "blouse stitching vasai virar",
      "store hours mumbai bazar",
    ],
  });
};

const FAQS = [
  {
    q: "How do you ensure the authenticity and quality of your sarees?",
    a: "We partner directly with traditional weaving clusters across Varanasi, Kanchipuram, and Paithan. Every piece is hand-inspected for yarn strength, zari finish, and drape before reaching our stores.",
  },
  {
    q: "Can I try and drape sarees in store before buying?",
    a: `Absolutely. We welcome you to visit any of our 8 stores across Nalasopara East, Virar West, Bhayandar East, and Goregaon West. ${SITE.hours.sentence}. Our stylists will gladly drape pieces so you can see the fall and color against your skin.`,
  },
  {
    q: "How does the 7-day exchange policy work?",
    a: "If you order online or buy in store and wish to exchange for another color, weave, or design, you may do so within 7 days of delivery, provided the saree remains unused with tags and unstitched blouse intact.",
  },
  {
    q: "Do you offer matching blouse stitching and fall-pico?",
    a: "Yes! In store, our master tailors provide customized blouse stitching with custom necklines, padding, and traditional piping, alongside same-day fall-and-pico service.",
  },
  {
    q: "How long does delivery take across India?",
    a: "Orders are processed and dispatched within 24 to 48 hours. Mumbai metropolitan deliveries arrive within 1-2 business days; deliveries to other parts of India take 3-5 business days via insured express couriers.",
  },
  {
    q: "Can I inspect the saree on a live WhatsApp video call?",
    a: "Yes! Our Nalasopara flagship stylists regularly host video calls. We display the pallu, border, and weave under natural lighting so you know precisely what you are ordering.",
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
            Everything you need to know about our handlooms, store locations, shipping, and customization.
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
