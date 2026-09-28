import { Link } from "react-router";
import type { Route } from "./+types/shipping-returns";
import { Truck, RotateCcw, ShieldCheck, ArrowRight } from "lucide-react";
import { SITE, getSeoMeta, jsonLdScript } from "~/lib/seo";
import { breadcrumbSchema } from "~/lib/structured-data";

export const meta: Route.MetaFunction = () => {
  return getSeoMeta({
    title: "Shipping & Returns Overview | Mumbai Bazar",
    description:
      "Summary of delivery speeds, free transit insurance, and our 7-day exchange window across all Mumbai Bazar orders.",
    path: "/shipping-returns",
    keywords: ["shipping and returns", "mumbai bazar delivery", "exchange process"],
  });
};

export default function ShippingReturnsPage() {
  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Shipping & Returns", path: "/shipping-returns" },
    ]),
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
            Customer Guarantee
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
            Shipping &amp; Returns Overview
          </h1>
          <p className="mt-4 text-sm text-taupe max-w-2xl mx-auto leading-relaxed">
            Quick reference guide to our delivery commitments, exchange windows, and transit protection.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-14 space-y-8 text-sm text-taupe leading-relaxed">
        <div className="rounded-3xl border border-gold/40 bg-white p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <Truck className="h-6 w-6 text-maroon" />
            <h2 className="font-serif text-xl font-bold text-ink">Free Insured Shipping</h2>
          </div>
          <p>
            Complimentary doorstep shipping across India on every saree order. Dispatched in 24-48 hours via express air couriers. Full transit insurance included.
          </p>
          <Link to="/shipping-policy" className="text-xs font-bold text-maroon hover:underline inline-flex items-center gap-1">
            Read complete shipping terms &rarr;
          </Link>
        </div>

        <div className="rounded-3xl border border-gold/40 bg-white p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <RotateCcw className="h-6 w-6 text-maroon" />
            <h2 className="font-serif text-xl font-bold text-ink">7-Day Easy Exchange</h2>
          </div>
          <p>
            Exchange your drape within 7 days of delivery for any other color, design, or saree in our catalog, online or at any of our 8 retail stores.
          </p>
          <Link to="/refund-policy" className="text-xs font-bold text-maroon hover:underline inline-flex items-center gap-1">
            Read complete refund &amp; exchange terms &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
