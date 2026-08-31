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
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Store,
  Navigation,
} from "lucide-react";
import { seo, jsonLd, SITE } from "@/lib/seo";
import { outletSchema, faqSchema, breadcrumbSchema } from "@/lib/structured-data";
import { FLAGSHIP } from "@/lib/locations";
import { PUBLISHED_OUTLETS } from "@/lib/locations";

export const Route = createFileRoute("/contact")({
  head: () => {
    const { meta, links } = seo({
      title: "Contact Us | WhatsApp & Store Network | Mumbai Bazar",
      description:
        `Call or WhatsApp Mumbai Bazar at +91 89566 64631, or visit our flagship boutique in Nalasopara East and outlets in Virar, Bhayandar and Goregaon. ${SITE.hours.shortDaily}.`,
      path: "/contact",
      keywords: [
        "mumbai bazar contact number",
        "saree shop nalasopara contact",
        "saree shop whatsapp number",
        "bridal saree consultation mumbai",
        "mumbai bazar store phone number",
      ],
    });
    return {
      meta,
      links,
      scripts: [
        // Same flagship entity as the homepage and /stores/nalasopara — one
        // @id per shop rather than a second, competing node.
        jsonLd(outletSchema(FLAGSHIP)),
        jsonLd(faqSchema(CONTACT_FAQS)),
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

const WA_NUMBER = SITE.whatsapp || "918956664631";
const PHONE_DISPLAY = SITE.phone || "+91 89566 64631";
const EMAIL_DISPLAY = SITE.email || "care@mumbaibazar.com";

const CONTACT_FAQS = [
  {
    q: "Can I request live photos or video calls before purchasing?",
    a: "Absolutely! Our WhatsApp Stylist Concierge (+91 89566 64631) can send you high-resolution real-lighting drape videos, pleat closeups, and zari sheen comparisons before you place your order.",
  },
  {
    q: "Can I get custom unstitched blouse pairing or fall-pico done?",
    a: "Yes. Our boutique master tailors offer complimentary fall-pico and can pair custom unstitched designer blouse fabrics, contrast borders, and lining for your bridal or festive drapes.",
  },
  {
    q: "How fast is delivery across Mumbai and India?",
    a: "Orders are dispatched within 24–48 hours from our central Mumbai facility. Delivery takes 1–2 business days across Mumbai Metro / MMR, and 2–4 business days across other major Indian cities with full live tracking via SMS and WhatsApp.",
  },
  {
    q: "Can I visit your physical stores to try sarees in person?",
    a: `Yes! You are warmly invited to visit our flagship boutique at Tiwari Nagar, Tulinj Road, Nalasopara East, or any of our sister stores in Virar, Bhayandar, and Goregaon. ${SITE.hours.label}.`,
  },
  {
    q: "What is your return or exchange policy?",
    a: "We provide a 7-day doorstep return and exchange window with complimentary reverse pickup across India. Saree tags and attached unstitched blouse piece must remain uncut and intact.",
  },
];

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "Bridal Trousseau Consultation",
    message: "",
  });

  const generateWhatsAppLink = () => {
    const text =
      `*New Inquiry from Mumbai Bazar Website*\n\n` +
      `*Name:* ${form.name || "Customer"}\n` +
      `*Phone:* ${form.phone || "Not provided"}\n` +
      `*Email:* ${form.email || "Not provided"}\n` +
      `*Inquiry:* ${form.topic}\n` +
      `*Message:* ${form.message || "Hi, I would like to consult regarding sarees."}`;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="w-full bg-[#FAF7F2] text-ink min-h-screen">
      {/* 1. High-Contrast Breadcrumb Header */}
      <div className="border-b border-gold/30 bg-white/70 backdrop-blur-sm py-3.5 px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between">
          <nav className="text-xs tracking-[0.14em] uppercase text-maroon font-bold flex items-center gap-2">
            <Link to="/" className="hover:text-gold-deep transition-colors">
              Home
            </Link>
            <span className="text-gold-deep font-normal">/</span>
            <span className="text-ink">Contact Concierge</span>
          </nav>
          <span className="text-xs text-maroon font-semibold hidden sm:inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-gold-deep" />
            {SITE.hours.label} IST
          </span>
        </div>
      </div>

      {/* 2. Hero Section with Bold Typography and Crisp Subtitles */}
      <section className="py-10 md:py-16 px-4 md:px-8 lg:px-12 xl:px-16 border-b border-gold/25 bg-gradient-to-b from-[#FDFBF7] to-[#FAF7F2]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-deep/30 bg-gold-deep/10 text-xs font-bold uppercase tracking-[0.2em] text-maroon mb-4">
            <Sparkles className="h-3.5 w-3.5 text-gold-deep" />
            Atelier & Customer Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-maroon leading-[1.12]">
            Connect With Our Saree Stylists
          </h1>
          <p className="mt-4 text-base sm:text-lg text-ink font-normal leading-relaxed max-w-2xl mx-auto">
            Whether you need assistance choosing an heirloom bridal drape, custom blouse styling, or
            visiting one of our 8 Mumbai stores — our concierge team is at your service.
          </p>
        </div>

        {/* 3. Three Direct Action Channel Cards (WhatsApp, Phone, Email) */}
        <div className="mt-10 md:mt-14 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* WhatsApp Concierge Card */}
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello Mumbai Bazar, I would like to speak to a saree stylist.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-2xl border-2 border-[#25D366]/40 bg-white p-7 shadow-sm hover:shadow-xl hover:border-[#25D366] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#25D366]/15 text-[#128C7E]">
                  <MessageCircle className="h-6 w-6" />
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#25D366]/15 text-[#128C7E] text-[10px] font-bold uppercase tracking-wider">
                  Fastest Reply
                </span>
              </div>
              <h3 className="mt-5 font-serif text-xl font-bold text-maroon">
                WhatsApp Stylist Chat
              </h3>
              <p className="mt-2 text-sm text-ink leading-relaxed">
                Live video calls, real-light drape photos, and weave consultations. Direct stylist
                replies in &lt; 15 minutes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#25D366]/20 flex items-center justify-between">
              <span className="text-sm font-bold text-maroon font-mono">{PHONE_DISPLAY}</span>
              <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-[#128C7E] font-bold group-hover:translate-x-1 transition-transform">
                Chat Live <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </a>

          {/* Call Boutique Card */}
          <a
            href={`tel:${PHONE_DISPLAY.replace(/\s+/g, "")}`}
            className="group relative rounded-2xl border-2 border-gold-deep/35 bg-white p-7 shadow-sm hover:shadow-xl hover:border-maroon transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-maroon/10 text-maroon">
                  <Phone className="h-6 w-6" />
                </span>
                <span className="px-2.5 py-1 rounded-full bg-gold-deep/15 text-maroon text-[10px] font-bold uppercase tracking-wider">
                  Direct Line
                </span>
              </div>
              <h3 className="mt-5 font-serif text-xl font-bold text-maroon">
                Call Flagship Boutique
              </h3>
              <p className="mt-2 text-sm text-ink leading-relaxed">
                Direct phone helpline for in-store appointment booking, stock inquiries, and wedding
                trousseau reservations.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gold/30 flex items-center justify-between">
              <span className="text-sm font-bold text-maroon font-mono">{PHONE_DISPLAY}</span>
              <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-maroon font-bold group-hover:translate-x-1 transition-transform">
                Call Now <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </a>

          {/* Email Support Card */}
          <a
            href={`mailto:${EMAIL_DISPLAY}`}
            className="group relative rounded-2xl border-2 border-gold-deep/35 bg-white p-7 shadow-sm hover:shadow-xl hover:border-maroon transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-maroon/10 text-maroon">
                  <Mail className="h-6 w-6" />
                </span>
                <span className="px-2.5 py-1 rounded-full bg-gold-deep/15 text-maroon text-[10px] font-bold uppercase tracking-wider">
                  24h Response
                </span>
              </div>
              <h3 className="mt-5 font-serif text-xl font-bold text-maroon">
                Atelier Email Desk
              </h3>
              <p className="mt-2 text-sm text-ink leading-relaxed">
                For order status updates, corporate gifting, wholesale inquiries, or press
                collaboration requests.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gold/30 flex items-center justify-between">
              <span className="text-sm font-bold text-maroon truncate max-w-[150px]">
                {EMAIL_DISPLAY}
              </span>
              <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-maroon font-bold group-hover:translate-x-1 transition-transform">
                Email Us <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* 4. Main Section: Interactive Form + Flagship Studio Details */}
      <section className="py-12 md:py-20 px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Stylist Consultation Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-gold-deep/40 shadow-xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-deep block">
              Personal Saree Stylist
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-maroon mt-2">
              Send a Styling Inquiry
            </h2>
            <p className="text-sm text-ink mt-2 leading-relaxed">
              Fill out your details below and a senior drape consultant will review your preferences.
            </p>

            {sent ? (
              <div className="mt-8 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50 p-6 sm:p-8 text-emerald-950 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif text-xl font-bold text-emerald-900">
                      Inquiry Received!
                    </h4>
                    <p className="text-sm text-emerald-800 mt-1 leading-relaxed">
                      Thank you. A senior saree stylist has received your request and will contact you
                      within 2–4 hours.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={generateWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#128C7E] transition-colors shadow-md"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Open Instant Chat on WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-maroon font-bold mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gold/60 bg-[#FAF8F5] text-sm text-ink placeholder:text-ink/40 font-medium focus:border-maroon focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-maroon font-bold mb-2">
                      Phone / WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98200 12345"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gold/60 bg-[#FAF8F5] text-sm text-ink placeholder:text-ink/40 font-medium focus:border-maroon focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-maroon font-bold mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. ananya@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gold/60 bg-[#FAF8F5] text-sm text-ink placeholder:text-ink/40 font-medium focus:border-maroon focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-maroon font-bold mb-2">
                      Inquiry Category
                    </label>
                    <select
                      value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gold/60 bg-[#FAF8F5] text-sm text-ink font-medium focus:border-maroon focus:bg-white focus:outline-none transition-colors"
                    >
                      <option value="Bridal Trousseau Consultation">
                        Bridal Trousseau Consultation
                      </option>
                      <option value="Banarasi / Kanjivaram Weave Inquiries">
                        Banarasi / Kanjivaram Weave Details
                      </option>
                      <option value="Order Status & Dispatch Tracking">
                        Order Status & Dispatch Tracking
                      </option>
                      <option value="Custom Blouse Pairing & Stitching">
                        Custom Blouse Pairing & Fall-Pico
                      </option>
                      <option value="Bulk Family Wedding Shopping">
                        Bulk Family Wedding Shopping
                      </option>
                      <option value="General Store Visit Inquiry">General Store Visit Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-maroon font-bold mb-2">
                    How Can We Assist You?
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your occasion date, color preference, budget, or question..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gold/60 bg-[#FAF8F5] text-sm text-ink placeholder:text-ink/40 font-medium focus:border-maroon focus:bg-white focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-maroon text-ivory text-xs font-bold uppercase tracking-[0.2em] hover:bg-wine transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" /> Send Inquiry
                  </button>

                  <a
                    href={generateWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-6 rounded-xl border-2 border-[#25D366] bg-[#25D366]/10 text-[#128C7E] text-xs font-bold uppercase tracking-[0.16em] hover:bg-[#25D366] hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat on WhatsApp
                  </a>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Flagship Store Details & Direct Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Flagship Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-deep/40 shadow-lg">
              <div className="flex items-center justify-between pb-4 border-b border-gold/30">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-deep block">
                    Main Showroom
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-maroon">
                    Nalasopara Flagship
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-maroon text-ivory text-[10px] font-bold uppercase tracking-wider">
                  Flagship Store
                </span>
              </div>

              <div className="mt-5 space-y-4 text-sm text-ink">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-maroon shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-maroon">Shop 1, Tiwari Nagar, Tulinj Road</p>
                    <p className="text-xs text-ink/80 mt-0.5">
                      Near Flyover Bridge, Opposite Seema Complex
                    </p>
                    <p className="text-xs text-ink/80">
                      Nalasopara East, Maharashtra 401209, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-maroon shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-maroon">{SITE.hours.label}</p>
                    <p className="text-xs text-ink/80 mt-0.5">
                      Sunday: Open for Walk-ins & Bridal Consultations
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-maroon shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-maroon font-mono">{PHONE_DISPLAY}</p>
                    <p className="text-xs text-ink/80">Calling & WhatsApp Support</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-gold/30 flex items-center gap-3">
                <a
                  href={`tel:${PHONE_DISPLAY.replace(/\s+/g, "")}`}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-maroon text-ivory text-xs font-bold uppercase tracking-wider text-center hover:bg-wine transition-colors"
                >
                  Call Store
                </a>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi Mumbai Bazar Flagship, I am planning a visit to your store.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl border border-[#25D366] text-[#128C7E] bg-[#25D366]/10 text-xs font-bold uppercase tracking-wider text-center hover:bg-[#25D366] hover:text-white transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Guarantees Box */}
            <div className="bg-gradient-to-br from-[#FDF8F2] to-[#FAF3E7] rounded-3xl p-6 sm:p-8 border border-gold-deep/40 shadow-sm">
              <h4 className="font-serif text-lg font-bold text-maroon mb-4">
                The Mumbai Bazar Promise
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-2xl bg-white/80 border border-gold/30">
                  <ShieldCheck className="h-6 w-6 text-maroon mx-auto mb-1.5" />
                  <span className="text-[11px] font-bold text-maroon uppercase tracking-wider block">
                    See Before You Buy
                  </span>
                  <span className="text-[10px] text-ink block mt-0.5">Drape it in store</span>
                </div>
                <div className="text-center p-3 rounded-2xl bg-white/80 border border-gold/30">
                  <Truck className="h-6 w-6 text-maroon mx-auto mb-1.5" />
                  <span className="text-[11px] font-bold text-maroon uppercase tracking-wider block">
                    Free Shipping
                  </span>
                  <span className="text-[10px] text-ink block mt-0.5">Across All India</span>
                </div>
                <div className="text-center p-3 rounded-2xl bg-white/80 border border-gold/30">
                  <RotateCcw className="h-6 w-6 text-maroon mx-auto mb-1.5" />
                  <span className="text-[11px] font-bold text-maroon uppercase tracking-wider block">
                    7-Day Returns
                  </span>
                  <span className="text-[10px] text-ink block mt-0.5">Easy Reverse Pickup</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Retail Stores Network Across Mumbai */}
      <section className="py-12 md:py-20 px-4 md:px-8 lg:px-12 xl:px-16 border-t border-gold/30 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-deep block mb-2">
              Retail Presence
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon">
              Visit Our 8 Boutique Locations
            </h2>
            <p className="text-sm text-ink mt-3 leading-relaxed">
              Step into any of our boutiques across Mumbai and the Western Suburbs to feel the rich
              textures of Banarasi katan, Kanjivaram brocade, and festive silks in person.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PUBLISHED_OUTLETS.map((outlet) => (
              <div
                key={outlet.slug}
                className="rounded-2xl border border-gold/40 bg-[#FAF8F5] p-6 shadow-sm hover:shadow-md hover:border-maroon transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gold-deep/15 text-maroon">
                      {outlet.city}
                    </span>
                    {outlet.flagship && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-maroon text-ivory">
                        Flagship
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-serif text-lg font-bold text-maroon">
                    {outlet.area}
                  </h3>
                  <p className="mt-2 text-xs text-ink/90 leading-relaxed">
                    <strong>{outlet.street}</strong>
                    <br />
                    {outlet.landmark}
                    <br />
                    {outlet.region} – {outlet.postalCode}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-gold/30 flex items-center justify-between">
                  <a
                    href={`tel:${(outlet.phone || PHONE_DISPLAY).replace(/\s+/g, "")}`}
                    className="text-xs font-bold text-maroon hover:text-gold-deep transition-colors flex items-center gap-1"
                  >
                    <Phone className="h-3.5 w-3.5" /> Call
                  </a>
                  <Link
                    to="/stores/$slug"
                    params={{ slug: outlet.slug }}
                    className="text-xs font-bold text-maroon hover:text-gold-deep transition-colors inline-flex items-center gap-1"
                  >
                    View Store <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Network Notice */}
          <div className="mt-8 p-4 rounded-2xl border border-gold/30 bg-[#FDFBF7] text-center text-xs text-ink max-w-xl mx-auto">
            <span className="font-semibold text-maroon">Additional Locations:</span> We also operate
            stores in Nalasopara West, Virar East, Bhayandar West, and Vasai West. Call our central
            helpline at <strong className="font-mono text-maroon">{PHONE_DISPLAY}</strong> for
            directions to your nearest outlet.
          </div>
        </div>
      </section>

      {/* 6. Frequently Asked Questions Accordion */}
      <section className="py-12 md:py-20 px-4 md:px-8 lg:px-12 xl:px-16 border-t border-gold/30 bg-[#FAF7F2]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-deep block mb-2">
              Help & Assistance
            </span>
            <h2 className="font-serif text-3xl font-bold text-maroon">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {CONTACT_FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-gold/40 bg-white overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between text-left p-5 text-sm font-bold text-maroon hover:text-wine transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-gold-deep shrink-0 transition-transform duration-300 ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-sm text-ink leading-relaxed border-t border-gold/20 bg-[#FAF8F5]/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-xs text-ink font-medium">
              Have another question not listed here?
            </p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello Mumbai Bazar team, I have a question.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-maroon hover:text-gold-deep transition-colors"
            >
              Ask on WhatsApp Concierge <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
