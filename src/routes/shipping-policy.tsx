import { createFileRoute } from "@tanstack/react-router";
import { seo, jsonLd } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { PolicyLayout } from "@/components/site/PolicyLayout";
import { Truck, Clock, ShieldCheck, Globe, AlertTriangle } from "lucide-react";
import { SITE } from "@/lib/seo";

export const Route = createFileRoute("/shipping-policy")({
  head: () => {
    const { meta, links } = seo({
      title: "Shipping & Delivery Policy | Mumbai Bazar",
      description:
        "Free insured delivery across all Indian pin codes, express dispatch within 24-48 hours, tracked courier updates, and international shipping guidelines.",
      path: "/shipping-policy",
      keywords: [
        "shipping policy",
        "mumbai bazar delivery time",
        "free saree shipping",
        "cash on delivery saree",
        "courier tracking",
      ],
    });
    return {
      meta,
      links,
      scripts: [
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Policies", path: "/shipping-policy" },
            { name: "Shipping & Delivery Policy", path: "/shipping-policy" },
          ]),
        ),
      ],
    };
  },
  component: ShippingPolicyPage,
});

export function ShippingPolicyContent() {
  return (
    <>
      {/* Shipping Highlights */}
      <div className="rounded-2xl bg-beige/25 border border-gold/40 p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-start gap-3">
          <Truck className="h-5 w-5 text-maroon shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-maroon text-sm">Free India Delivery</h4>
            <p className="text-xs text-ink/75 mt-0.5">
              100% complimentary shipping on all orders across India.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-maroon shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-maroon text-sm">24–48h Dispatch</h4>
            <p className="text-xs text-ink/75 mt-0.5">
              Rapid handling and inspection from our Mumbai logistics hub.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-maroon shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-maroon text-sm">Insured Transit</h4>
            <p className="text-xs text-ink/75 mt-0.5">
              Every parcel is insured against loss or damage in transit.
            </p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          1. Free Domestic Shipping Across India
        </h2>
        <p>
          We believe in complete transparency. <strong>{SITE.name}</strong> provides{" "}
          <strong>Free Standard Shipping</strong> on all orders—both prepaid and Cash on Delivery
          (COD)—across all serviceable pin codes in India. There are no hidden packaging charges or
          convenience fees added at checkout.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          2. Order Processing &amp; Dispatch Timeline
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-ink/85">
          <li>
            <strong>Standard Sarees &amp; Ready-to-Wear:</strong> Dispatched within{" "}
            <strong>24 to 48 business hours</strong> following payment confirmation.
          </li>
          <li>
            <strong>Bridal &amp; Heavy Brocade Heirlooms:</strong> Inspected under high-magnification
            lighting for zari purity and silk integrity prior to custom luxury boxing, dispatched
            within 48 hours.
          </li>
          <li>
            <strong>Customized Blouses or Fall/Pico Additions (if requested):</strong> Requires 3 to
            5 additional business days for master tailoring.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          3. Estimated Delivery Times
        </h2>
        <p>Once your order has been dispatched from our central Mumbai warehouse:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm border-collapse border border-gold/30">
            <thead>
              <tr className="bg-beige/40 text-maroon">
                <th className="border border-gold/30 p-3 text-left">Destination Region</th>
                <th className="border border-gold/30 p-3 text-left">Estimated Transit Window</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gold/30 p-3 font-medium">
                  Mumbai Metro, Thane, Navi Mumbai, Vasai-Virar
                </td>
                <td className="border border-gold/30 p-3">1 to 2 Business Days</td>
              </tr>
              <tr className="bg-ivory">
                <td className="border border-gold/30 p-3 font-medium">
                  Tier 1 Metro Hubs (Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune)
                </td>
                <td className="border border-gold/30 p-3">2 to 4 Business Days</td>
              </tr>
              <tr>
                <td className="border border-gold/30 p-3 font-medium">
                  Tier 2 &amp; Tier 3 Cities (Rest of India)
                </td>
                <td className="border border-gold/30 p-3">4 to 7 Business Days</td>
              </tr>
              <tr className="bg-ivory">
                <td className="border border-gold/30 p-3 font-medium">
                  North East &amp; Special Postal Zones (J&amp;K, Islands)
                </td>
                <td className="border border-gold/30 p-3">6 to 9 Business Days</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          4. Courier Partners &amp; Tracking
        </h2>
        <p>
          We partner exclusively with India’s leading express logistics providers, including{" "}
          <strong>Delhivery, BlueDart, Xpressbees, Ekart, and DTDC</strong>.
        </p>
        <p>
          As soon as your parcel is scanned into the courier hub, you will receive an automatic SMS
          and WhatsApp notification containing your direct <strong>AWB Tracking URL</strong>. You can
          monitor your package in real time from dispatch to delivery.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          5. Cash on Delivery (COD) Guidelines
        </h2>
        <p>
          Cash on Delivery is available for eligible pin codes across India for orders up to ₹25,000.
          Please ensure that you or an authorized representative is available at the provided delivery
          address with the exact cash amount or UPI ready when the delivery executive arrives.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          6. Damaged, Opened, or Tampered Parcels
        </h2>
        <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-4 text-xs sm:text-sm text-amber-950 space-y-1.5">
          <p className="font-semibold flex items-center gap-1.5 text-amber-900">
            <AlertTriangle className="h-4 w-4" /> Important Delivery Instruction:
          </p>
          <p>
            If the external shipping bag is visibly torn, tampered with, or retaped, please{" "}
            <strong>do not accept delivery</strong> and immediately ask the delivery agent to record
            the parcel as damaged/tampered.
          </p>
          <p>
            If you accept the parcel, we kindly request you to film an unboxing video before cutting
            open the outer seal. This helps us ensure an expedited replacement or insurance claim on
            your behalf.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          7. Worldwide International Shipping
        </h2>
        <p>
          Mumbai Bazar ships worldwide to over 40 countries (USA, UK, Canada, UAE, Australia,
          Singapore, etc.) via <strong>DHL Express and FedEx</strong>. International shipping rates
          are calculated dynamically at checkout based on package weight and destination country.
          Estimated international transit time is <strong>5 to 9 business days</strong>. Any custom
          import duties or local taxes levied by destination authorities are the responsibility of the
          recipient.
        </p>
      </section>
    </>
  );
}

function ShippingPolicyPage() {
  return (
    <PolicyLayout
      currentPolicy="shipping-policy"
      title="Shipping & Delivery Policy"
      subtitle="Details on dispatch timelines, free delivery across India, live order tracking, and delivery procedures."
    >
      <ShippingPolicyContent />
    </PolicyLayout>
  );
}
