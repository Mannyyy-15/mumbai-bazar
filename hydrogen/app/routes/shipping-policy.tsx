import { Link } from "react-router";
import type { Route } from "./+types/shipping-policy";
import { Truck, ShieldCheck, Clock } from "lucide-react";
import { SITE, getSeoMeta, jsonLdScript } from "~/lib/seo";
import { breadcrumbSchema } from "~/lib/structured-data";

export const meta: Route.MetaFunction = () => {
  return getSeoMeta({
    title: "Shipping & Delivery Policy | Mumbai Bazar",
    description:
      "Free shipping timelines, insured transit, and order tracking across India for Mumbai Bazar sarees and bridal wear.",
    path: "/shipping-policy",
    keywords: ["shipping policy", "saree delivery times", "free shipping sarees india", "transit insurance"],
  });
};

export default function ShippingPolicyPage() {
  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Shipping Policy", path: "/shipping-policy" },
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
            Transit &amp; Delivery
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="mt-4 text-sm text-taupe max-w-2xl mx-auto leading-relaxed">
            Free insured delivery on every prepaid order, to every pincode in India. Cash on Delivery is available and carries a handling fee.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-14 space-y-8 text-sm text-taupe leading-relaxed">
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-ink">1. Complimentary Shipping</h2>
          <p>
            We provide free standard shipping across all serviceable postal codes in India on all saree and bridal orders.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-ink">2. Dispatch &amp; Transit Timelines</h2>
          <ul className="space-y-2 list-disc pl-4">
            <li><strong>Order Dispatch:</strong> All in-stock sarees are inspected, hand-packed, and dispatched within 24 to 48 hours of order confirmation.</li>
            <li><strong>Mumbai &amp; Thane:</strong> Delivered within 1 to 2 business days.</li>
            <li><strong>Rest of India:</strong> Delivered within 3 to 5 business days via express air couriers (Blue Dart, Delhivery, DTDC).</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-ink">3. Transit Insurance &amp; Tracking</h2>
          <p>
            Every parcel is 100% insured against loss or transit damage. Once your order is dispatched, a live tracking link is sent directly via SMS and WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
