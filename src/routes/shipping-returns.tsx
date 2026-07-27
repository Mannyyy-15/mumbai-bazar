import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, RotateCcw, ShieldCheck, Globe2, Clock, CheckCircle, HelpCircle } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { GoldRule } from "@/components/site/Motif";
import { IMG } from "@/lib/site-data";

export const Route = createFileRoute("/shipping-returns")({
  head: () => ({
    meta: [
      { title: "Shipping & Returns — Mumbai Bazar" },
      { name: "description", content: "Complimentary India shipping, worldwide delivery, and easy 7-day returns on every saree." },
      { property: "og:title", content: "Shipping & Returns — Mumbai Bazar" },
      { property: "og:description", content: "Delivered with care. Exchanged with ease." },
    ],
  }),
  component: ShippingReturns,
});

const HIGHLIGHTS = [
  { icon: Truck, title: "Free India Shipping", copy: "100% complimentary tracked express delivery across all pin codes in India." },
  { icon: Globe2, title: "Worldwide Express", copy: "Delivering to 40+ countries via DHL Express & FedEx with duty-inclusive checkout." },
  { icon: RotateCcw, title: "7-Day Easy Returns", copy: "Not completely in love? Return or exchange unused sarees within 7 days of delivery." },
  { icon: ShieldCheck, title: "Fully Transit-Insured", copy: "Every shipment is 100% insured against loss or damage until it arrives safely in your hands." },
];

const STEPS = [
  { step: "01", title: "Hand Quality Check", time: "Day 1", copy: "Every weave undergoes a 12-point inspection for fabric strength, fall, and zari purity." },
  { step: "02", title: "Signature Muslin Wrap", time: "Day 1", copy: "Your saree is folded in organic breathable muslin with natural dried neem & fragrant cloves." },
  { step: "03", title: "Tracked Express Dispatch", time: "Day 2", copy: "Dispatched from Mumbai with instant SMS, Email, and WhatsApp tracking updates." },
  { step: "04", title: "Doorstep Delivery", time: "Days 3–5", copy: "Hand-delivered directly to your doorstep in robust weather-sealed packaging." },
];

function ShippingReturns() {
  return (
    <div className="w-full overflow-x-hidden bg-ivory">
      <PageHero
        eyebrow="Delivered with care"
        title="Shipping & Returns Policy"
        crumb="Shipping & Returns"
        copy="From our boutique in Mumbai to your doorstep — with full insurance, express tracking, and styling assistance every step of the way."
        img={IMG.p2}
      />

      {/* Highlights Grid */}
      <section className="border-b border-gold/50 py-14 md:py-20">
        <div className="mx-auto max-w-[1360px] px-4 md:px-8">
          <div className="grid gap-6 md:grid-cols-4">
            {HIGHLIGHTS.map(({ icon: Icon, title, copy }) => (
              <div key={title} className="border border-gold/50 bg-beige/20 p-6 shadow-sm">
                <span className="grid h-12 w-12 place-items-center bg-maroon text-ivory">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-serif text-xl text-ink">{title}</h3>
                <p className="mt-2 text-sm text-taupe leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Timeline */}
      <section className="bg-beige/30 py-16 md:py-24 border-b border-gold/50">
        <div className="mx-auto max-w-[1360px] px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow text-gold-deep">The Journey</span>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl text-ink">From Loft to Doorstep</h2>
            <p className="mt-4 text-taupe leading-relaxed">
              We handle every drape with extreme care so it arrives in pristine, ready-to-wear condition.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-4">
            {STEPS.map(({ step, title, time, copy }) => (
              <div key={step} className="relative border border-gold/50 bg-ivory p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-gold/30 pb-4">
                  <span className="font-serif text-2xl font-bold text-maroon">{step}</span>
                  <span className="inline-flex items-center gap-1.5 bg-beige/60 px-2.5 py-1 text-[11px] font-medium text-ink">
                    <Clock className="h-3.5 w-3.5 text-gold-deep" />
                    {time}
                  </span>
                </div>
                <h3 className="mt-4 font-serif text-xl text-ink">{title}</h3>
                <p className="mt-2 text-xs text-taupe leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Details */}
      <section className="py-16 md:py-24 border-b border-gold/50">
        <div className="mx-auto max-w-[900px] px-4 md:px-8 space-y-12">
          <Block title="Domestic India Shipping">
            <p>
              All orders across India receive complimentary tracked express shipping. Ready-to-ship sarees are dispatched within 24 hours.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="border border-gold/40 bg-beige/10 p-4">
                <span className="text-xs uppercase tracking-wider text-maroon font-semibold">Metro Cities</span>
                <p className="mt-1 font-serif text-lg text-ink">2 to 4 Business Days</p>
              </div>
              <div className="border border-gold/40 bg-beige/10 p-4">
                <span className="text-xs uppercase tracking-wider text-maroon font-semibold">Rest of India</span>
                <p className="mt-1 font-serif text-lg text-ink">4 to 6 Business Days</p>
              </div>
            </div>
          </Block>

          <Block title="International Worldwide Shipping">
            <p>
              We ship to over 40 countries via DHL Express and FedEx. Duties and taxes are pre-calculated at checkout where available, ensuring no unexpected customs charges upon arrival. International delivery typically takes 5–8 business days.
            </p>
          </Block>

          <Block title="7-Day Return & Exchange Guarantee">
            <p>
              If your saree isn't perfect for your event, you can return or exchange it within 7 days of delivery:
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <CheckItem>Item must be unworn, unwashed, and returned in its original muslin pouch with tags intact.</CheckItem>
              <CheckItem>Complimentary reverse pickup is available for domestic India orders.</CheckItem>
              <CheckItem>Custom blouse-stitched or tailored items are non-returnable.</CheckItem>
              <CheckItem>Refunds are processed within 3 business days of return receipt.</CheckItem>
            </ul>
          </Block>

          <div className="border-t border-gold/50 pt-10 text-center">
            <GoldRule className="mb-6" />
            <h3 className="font-serif text-2xl text-ink">Need assistance with your delivery?</h3>
            <p className="mt-2 text-taupe text-sm">Our support team is standing by to assist with tracking or returns.</p>
            <Link to="/contact" className="btn-primary mt-6 inline-flex">
              Contact Order Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-2xl md:text-3xl text-maroon">{title}</h2>
      <div className="mt-3 text-taupe leading-relaxed text-[15px]">{children}</div>
    </div>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-maroon" />
      <span>{children}</span>
    </li>
  );
}

