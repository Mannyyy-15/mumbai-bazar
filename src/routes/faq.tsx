import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plus,
  Minus,
  Search,
  MessageCircle,
  HelpCircle,
  ShieldCheck,
  Truck,
  Scissors,
  RefreshCw,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { GoldRule } from "@/components/site/Motif";
import { IMG } from "@/lib/site-data";
import { seo, jsonLd } from "@/lib/seo";
import { faqSchema, breadcrumbSchema } from "@/lib/structured-data";

export const Route = createFileRoute("/faq")({
  head: () => {
    const { meta, links } = seo({
      title: "Saree FAQs | Silk, Blouse Stitching, Shipping & Returns — Mumbai Bazar",
      description:
        "Answers on our saree and lehenga range, store timings and locations, blouse stitching, exchanges and delivery across India.",
      path: "/faq",
      keywords: [
        "saree FAQ",
        "saree shop timings",
        "saree blouse stitching",
        "saree return policy",
        "international saree shipping",
      ],
    });
    return {
      meta,
      links,
      // FAQPage markup is the single biggest structured-data gap among our
      // competitors — it wins People Also Ask slots and AI Overview citations.
      scripts: [
        jsonLd(faqSchema(FAQS)),
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
        ),
      ],
    };
  },
  component: FAQ,
});

const CATEGORIES = [
  { id: "all", label: "All Questions", icon: HelpCircle },
  { id: "weaves", label: "Sarees & Weaves", icon: ShieldCheck },
  { id: "shipping", label: "Shipping & Tracking", icon: Truck },
  { id: "blouse", label: "Blouse & Stitching", icon: Scissors },
  { id: "returns", label: "Returns & Guarantee", icon: RefreshCw },
];

const FAQS = [
  {
    category: "weaves",
    q: "What kinds of sarees do you stock?",
    a: "We carry fancy and party wear sarees, dress material, designer lehengas and dulhan (bridal) wear across all our stores. The range spans everyday budgets through to heavier bridal pieces. Our Nalasopara East store holds the widest bridal selection.",
  },
  {
    category: "weaves",
    q: "Can I check the fabric before buying?",
    a: "Yes. Every piece can be seen, handled and draped in store before you buy, and our staff will tell you exactly what a saree is made of. If you are shopping remotely, message us on WhatsApp and we will send photos or video of the fabric, border and palla.",
  },
  {
    category: "weaves",
    q: "Will the exact shade match what I see on my screen?",
    a: "We photograph every saree under neutral 5500K daylight with minimal color grading to ensure 95%+ color fidelity. If you would like to view a drape live in natural light before ordering, we offer complimentary WhatsApp video consultations.",
  },
  {
    category: "shipping",
    q: "Do you ship internationally?",
    a: "Yes! We ship to over 40+ countries via tracked international courier partners (DHL Express & FedEx). Domestic India shipping is 100% complimentary on all orders.",
  },
  {
    category: "shipping",
    q: "How long will my saree take to arrive?",
    a: "Ready-to-ship orders are dispatched within 24–48 hours. Express delivery within metro cities in India takes 2–4 business days; rest of India takes 4–6 business days. International delivery takes 5–8 business days.",
  },
  {
    category: "blouse",
    q: "Is an unstitched blouse piece included?",
    a: "Yes — every single saree includes a coordinating unstitched blouse fabric piece (typically 0.80 m to 0.90 m) crafted from matching pure silk or tissue.",
  },
  {
    category: "blouse",
    q: "Do you provide custom blouse stitching and fall/pico?",
    a: "Fall and pico edging are complimentary on all our silk sarees! For custom blouse stitching, simply select the stitching add-on during checkout or send your measurements to our WhatsApp concierge after placing your order.",
  },
  {
    category: "returns",
    q: "What is your return & exchange policy?",
    a: "We offer a hassle-free 7-day return policy for unused sarees in their original condition and packaging. Custom-stitched or altered sarees are non-returnable. Full refunds are processed within 3 business days of item inspection.",
  },
  {
    category: "returns",
    q: "What happens if a parcel is damaged in transit?",
    a: "Every parcel sent from Mumbai Bazar is 100% insured against loss or transit damage. If your package arrives damaged, notify us within 48 hours and we will ship an immediate replacement.",
  },
];

function FAQ() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = FAQS.filter((item) => {
    const matchesTab = activeTab === "all" || item.category === activeTab;
    const matchesSearch =
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const waMsg = encodeURIComponent(
    "Hello Mumbai Bazar Concierge, I have a custom question about your sarees.",
  );

  return (
    <div className="w-full overflow-x-hidden bg-ivory">
      <PageHero
        eyebrow="Help & Support"
        title="Frequently Asked Questions"
        crumb="FAQ"
        copy="Everything you need to know about our range, store visits, delivery and blouse tailoring."
        img={IMG.look4}
      />

      <section className="py-14 md:py-20 border-b border-gold/50">
        <div className="mx-auto max-w-[1200px] px-4 md:px-8">
          {/* Search bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-taupe" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by weave, shipping, stitching, returns..."
              className="w-full border border-gold/50 bg-beige/20 py-3.5 pl-12 pr-4 text-sm text-ink placeholder:text-taupe focus:border-maroon focus:outline-none"
            />
          </div>

          {/* Category Tabs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 border-b border-gold/50 pb-6">
            {CATEGORIES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`inline-flex items-center gap-2 border px-4 py-2.5 text-xs uppercase tracking-wider transition-colors ${
                  activeTab === id
                    ? "border-maroon bg-maroon text-ivory font-medium"
                    : "border-gold/40 bg-ivory text-ink hover:border-maroon hover:text-maroon"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="mt-10 max-w-3xl mx-auto space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-gold/50 bg-beige/10">
                <p className="font-serif text-xl text-ink">No matching questions found.</p>
                <p className="mt-2 text-sm text-taupe">
                  Try searching for a different keyword or chat with our team directly.
                </p>
                <button
                  onClick={() => {
                    setActiveTab("all");
                    setSearchQuery("");
                  }}
                  className="btn-outline mt-6 inline-flex"
                >
                  Reset Search & Filters
                </button>
              </div>
            ) : (
              filteredFaqs.map(({ q, a }, idx) => (
                <details
                  key={idx}
                  className="group border border-gold/50 bg-beige/10 transition-all duration-200 open:bg-beige/30 open:border-maroon"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 text-ink">
                    <span className="font-serif text-lg font-medium leading-snug">{q}</span>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold/20 text-maroon group-open:bg-maroon group-open:text-ivory">
                      <Plus className="h-4 w-4 group-open:hidden" />
                      <Minus className="hidden h-4 w-4 group-open:block" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-2 text-sm text-taupe leading-relaxed border-t border-gold/30">
                    {a}
                  </div>
                </details>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Instant Concierge CTA */}
      <section className="bg-beige/30 py-16 md:py-20">
        <div className="mx-auto max-w-[900px] px-4 md:px-8 text-center">
          <GoldRule className="mb-6" />
          <h2 className="font-serif text-3xl md:text-4xl text-ink">Have a unique question?</h2>
          <p className="mt-3 text-taupe text-base">
            Our personal saree stylists are available on WhatsApp to answer questions, share drape
            videos, or assist with custom orders.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={`https://wa.me/919999999999?text=${waMsg}`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Chat with Stylist on WhatsApp
            </a>
            <Link to="/contact" className="btn-outline inline-flex">
              Visit Contact Page
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
