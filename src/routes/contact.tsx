import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { seo, jsonLd } from "@/lib/seo";
import { localBusinessSchema, faqSchema, breadcrumbSchema } from "@/lib/structured-data";

export const Route = createFileRoute("/contact")({
  head: () => {
    const { meta, links } = seo({
      title: "Contact Us | Saree Concierge & Vasai-Virar Boutique — Mumbai Bazar",
      description:
        "Talk to a saree expert on WhatsApp, email or phone, or visit our Vasai-Virar boutique studio. Free styling consultations for bridal and festive drapes.",
      path: "/contact",
      keywords: [
        "saree shop near me",
        "saree boutique Vasai Virar",
        "saree store Mumbai contact",
        "bridal saree consultation",
      ],
    });
    return {
      meta,
      links,
      // LocalBusiness on the contact page is the strongest signal for the
      // Google Maps 3-pack, since this is the page that carries the NAP.
      scripts: [
        jsonLd(localBusinessSchema()),
        jsonLd(faqSchema(FAQS)),
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ),
      ],
    };
  },
  component: ContactPage,
});

const WA_HREF =
  "https://wa.me/919999999999?text=" +
  encodeURIComponent("Hello Mumbai Bazar, I'd like to speak to a saree expert.");

const FAQS = [
  {
    q: "Can I get custom blouse stitching or color matching?",
    a: "Yes! Our concierge team offers custom unstitched blouse material pairing, lining advice, and direct weaver color customization for bridal orders.",
  },
  {
    q: "How long does shipping take across India?",
    a: "Orders are dispatched within 24–48 hours via insured express courier. Standard delivery takes 3–5 business days across major Indian cities.",
  },
  {
    q: "Do you offer international shipping?",
    a: "Yes, we ship globally via DHL Express with complete customs documentation and gift packaging.",
  },
];

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "Bridal Inquiry",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", phone: "", topic: "Bridal Inquiry", message: "" });
  };

  return (
    <>
      {/* Hero Header */}
      <section className="relative border-b border-gold/30 bg-beige/25">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 py-12 md:py-16">
          <nav className="mb-4 flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-taupe font-medium">
            <Link to="/" className="hover:text-maroon transition-colors">
              Home
            </Link>
            <span className="text-gold/60">/</span>
            <span className="text-maroon">Contact Us</span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-maroon/20 bg-maroon/5 text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-maroon font-medium mb-3">
              Atelier Concierge
            </span>
            <h1 className="font-serif text-4xl leading-tight text-maroon md:text-6xl">
              We're Here for You
            </h1>
            <p className="mt-3 text-sm md:text-base text-maroon/80 leading-relaxed">
              Whether you need help selecting a bridal heirloom, custom color dyeing, or order
              updates — our saree consultants are at your service.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="bg-ivory py-12 md:py-16">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="grid gap-6 md:grid-cols-3">
            <a
              href={WA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-gold/50 bg-beige/20 p-8 shadow-sm hover:shadow-xl hover:border-maroon transition-all flex flex-col justify-between"
            >
              <div>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#25D366]/15 text-[#128C7E]">
                  <MessageCircle className="h-6 w-6" />
                </span>
                <h3 className="mt-6 font-serif text-2xl text-maroon">WhatsApp Concierge</h3>
                <p className="mt-2 text-sm text-ink/80 leading-relaxed">
                  Fastest way to reach our stylists for live saree drape photos & videos. Replies in
                  &lt;1 hour.
                </p>
              </div>
              <p className="mt-6 text-xs uppercase tracking-[0.25em] text-maroon font-semibold group-hover:text-gold transition-colors">
                Chat on WhatsApp →
              </p>
            </a>

            <a
              href="mailto:care@mumbaiBazar.in"
              className="group rounded-2xl border border-gold/50 bg-beige/20 p-8 shadow-sm hover:shadow-xl hover:border-maroon transition-all flex flex-col justify-between"
            >
              <div>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-maroon/10 text-maroon">
                  <Mail className="h-6 w-6" />
                </span>
                <h3 className="mt-6 font-serif text-2xl text-maroon">Email Atelier</h3>
                <p className="mt-2 text-sm text-ink/80 leading-relaxed">
                  care@mumbaiBazar.in · For order inquiries, custom weaving requests & press.
                </p>
              </div>
              <p className="mt-6 text-xs uppercase tracking-[0.25em] text-maroon font-semibold group-hover:text-gold transition-colors">
                Send an Email →
              </p>
            </a>

            <a
              href="tel:+919820000000"
              className="group rounded-2xl border border-gold/50 bg-beige/20 p-8 shadow-sm hover:shadow-xl hover:border-maroon transition-all flex flex-col justify-between"
            >
              <div>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-maroon/10 text-maroon">
                  <Phone className="h-6 w-6" />
                </span>
                <h3 className="mt-6 font-serif text-2xl text-maroon">Call Boutique</h3>
                <p className="mt-2 text-sm text-ink/80 leading-relaxed">
                  +91 98200 00000 · Mon–Sat · 10:00 AM – 8:00 PM IST.
                </p>
              </div>
              <p className="mt-6 text-xs uppercase tracking-[0.25em] text-maroon font-semibold group-hover:text-gold transition-colors">
                Call Boutique Direct →
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Main Split Section: Form & Studio Info */}
      <section className="bg-beige/30 py-16 md:py-24 border-t border-gold/30">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left: Form */}
            <div className="lg:col-span-7 bg-ivory rounded-3xl p-8 md:p-12 border border-gold/50 shadow-xl">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium">
                Send a Message
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-maroon mt-2">
                Write to Our Saree Stylists
              </h2>

              {sent ? (
                <div className="mt-8 rounded-2xl border border-maroon/40 bg-maroon/5 p-6 text-maroon flex items-center gap-4">
                  <CheckCircle2 className="h-8 w-8 shrink-0 text-maroon" />
                  <div>
                    <h4 className="font-serif text-lg font-medium">Message Received!</h4>
                    <p className="text-xs text-maroon/80 mt-1">
                      Thank you. A senior saree consultant will respond within 2–4 hours.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-maroon font-medium mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Radhika Sharma"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-gold/50 bg-ivory text-sm text-ink focus:border-maroon focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-maroon font-medium mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. radhika@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-gold/50 bg-ivory text-sm text-ink focus:border-maroon focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-maroon font-medium mb-2">
                      Inquiry Type
                    </label>
                    <select
                      value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-gold/50 bg-ivory text-sm text-ink focus:border-maroon focus:outline-none transition-colors"
                    >
                      <option value="Bridal Inquiry">Bridal Saree Inquiry</option>
                      <option value="Order Status">Order Status & Tracking</option>
                      <option value="Custom Stitching">Custom Blouse Pairing</option>
                      <option value="General">General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-maroon font-medium mb-2">
                      How can we help?
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about your occasion, saree preferences, or questions..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-gold/50 bg-ivory text-sm text-ink focus:border-maroon focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-maroon text-ivory text-xs uppercase tracking-[0.25em] font-medium hover:bg-wine transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" /> Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Right: Studio Location & FAQs */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
              {/* Studio Info */}
              <div className="bg-ivory rounded-3xl p-8 border border-gold/50 shadow-md">
                <h3 className="font-serif text-2xl text-maroon mb-4">Visit Our Studio</h3>
                <div className="space-y-4 text-sm text-ink/80">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                    <p>
                      Mumbai Bazar Boutique Studio
                      <br />
                      Marine Drive & Churchgate Promenade, Mumbai, India
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                    <p>
                      Monday – Saturday: 10:00 AM – 8:00 PM IST
                      <br />
                      Sunday: By Private Appointment
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQs */}
              <div className="bg-ivory rounded-3xl p-8 border border-gold/50 shadow-md">
                <h3 className="font-serif text-2xl text-maroon mb-4">Frequently Asked</h3>
                <div className="space-y-3">
                  {FAQS.map((faq, idx) => (
                    <div key={idx} className="border-b border-gold/30 pb-3">
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="flex w-full items-center justify-between text-left text-xs uppercase tracking-wider text-maroon font-medium"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${openFaq === idx ? "rotate-180" : ""}`}
                        />
                      </button>
                      {openFaq === idx && (
                        <p className="mt-2 text-xs text-ink/75 leading-relaxed">{faq.a}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
