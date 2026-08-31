import { createFileRoute, Link } from "@tanstack/react-router";
import { seo, jsonLd } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { PolicyLayout } from "@/components/site/PolicyLayout";
import { CheckCircle2, AlertCircle, RotateCcw, PackageCheck, HelpCircle } from "lucide-react";
import { SITE } from "@/lib/seo";

export const Route = createFileRoute("/refund-policy")({
  head: () => {
    const { meta, links } = seo({
      title: "Return & Refund Policy | Mumbai Bazar",
      description:
        "Transparent 7-day return and exchange policy for sarees and ethnic wear. Hassle-free reverse pick-ups, simple refund process, and prompt customer support.",
      path: "/refund-policy",
      keywords: [
        "saree return policy",
        "mumbai bazar refund policy",
        "saree exchange policy",
        "order cancellation",
        "ethnic wear return",
      ],
    });
    return {
      meta,
      links,
      scripts: [
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Policies", path: "/refund-policy" },
            { name: "Return & Refund Policy", path: "/refund-policy" },
          ]),
        ),
      ],
    };
  },
  component: RefundPolicyPage,
});

export function RefundPolicyContent() {
  return (
    <>
      {/* Policy Highlights Card */}
      <div className="rounded-2xl bg-beige/25 border border-gold/40 p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-start gap-3">
          <RotateCcw className="h-5 w-5 text-maroon shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-maroon text-sm">7-Day Return Window</h4>
            <p className="text-xs text-ink/75 mt-0.5">
              Initiate return or exchange within 7 days from delivery.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <PackageCheck className="h-5 w-5 text-maroon shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-maroon text-sm">Free Reverse Pickup</h4>
            <p className="text-xs text-ink/75 mt-0.5">
              Complimentary courier collection from your doorstep across India.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-maroon shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-maroon text-sm">5–7 Day Fast Refund</h4>
            <p className="text-xs text-ink/75 mt-0.5">
              Direct to original payment method or UPI / Bank transfer for COD.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1 */}
      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          1. Overview & Commitment to Quality
        </h2>
        <p>
          At <strong>{SITE.name}</strong>, each handloom saree, bridal lehenga, and festive drape is
          subject to strict multi-point quality inspections prior to dispatch. However, we
          understand that sometimes a color may appear slightly different in person or you may wish
          to exchange for another weave. We offer a transparent, customer-first{" "}
          <strong>7-Day Return &amp; Exchange Policy</strong>.
        </p>
      </section>

      {/* Section 2 */}
      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          2. Return Eligibility Criteria
        </h2>
        <p>To qualify for a valid return or exchange, items must satisfy the following conditions:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-ink/85">
          <li>
            The return request must be raised within <strong>7 calendar days</strong> of parcel
            delivery.
          </li>
          <li>
            The saree must be <strong>unworn, unwashed, undamaged</strong>, and free of any perfume,
            deodorant, makeup marks, or personal scents.
          </li>
          <li>
            All original brand tags, security ribbons, any card or tag supplied with the piece,
            and the original protective packaging must remain intact.
          </li>
          <li>
            The unstitched blouse piece attached to the saree must <strong>not be cut or detached</strong>.
            Sarees where the blouse fabric has been altered or severed cannot be accepted.
          </li>
        </ul>
      </section>

      {/* Section 3 */}
      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          3. Non-Returnable / Non-Exchangeable Items
        </h2>
        <div className="rounded-xl border border-amber-300 bg-amber-50/60 p-4 text-xs sm:text-sm text-amber-950">
          <p className="font-semibold flex items-center gap-1.5 text-amber-900 mb-1">
            <AlertCircle className="h-4 w-4" /> Please Note Before Ordering:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Custom-tailored blouses, fall-pico alterations, or personalized tasseling.</li>
            <li>Items purchased during clearance liquidation sales marked as "Final Sale".</li>
            <li>Products damaged due to improper hand-washing or failure to dry clean.</li>
          </ul>
        </div>
      </section>

      {/* Section 4 */}
      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          4. Damage or Wrong Item Received (Unboxing Guideline)
        </h2>
        <p>
          In the rare event that you receive a damaged, defective, or incorrect piece, please notify
          our support desk within <strong>48 hours of delivery</strong>.
        </p>
        <p>
          <strong>Recommended Best Practice:</strong> As with our industry peers, we kindly recommend
          recording a brief 360-degree unboxing video while opening the outer courier parcel. This
          allows our logistics and quality team to swiftly process immediate replacements or instant
          claims with courier handlers.
        </p>
        <p>
          Contact us via email at{" "}
          <a href={`mailto:${SITE.email}`} className="text-maroon font-semibold underline">
            {SITE.email}
          </a>{" "}
          or WhatsApp at{" "}
          <a href={`https://wa.me/${SITE.whatsapp}`} className="text-maroon font-semibold underline">
            {SITE.phone}
          </a>{" "}
          with your Order ID and photos/video.
        </p>
      </section>

      {/* Section 5 */}
      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          5. How to Initiate a Return or Exchange
        </h2>
        <ol className="list-decimal pl-5 space-y-2 text-ink/85">
          <li>
            <strong>Step 1:</strong> Send an email to{" "}
            <span className="font-semibold text-maroon">{SITE.email}</span> or message us on WhatsApp
            at <span className="font-semibold text-maroon">{SITE.phone}</span> with your Order Number
            and reason for return.
          </li>
          <li>
            <strong>Step 2:</strong> Our support team will confirm eligibility and arrange a{" "}
            <strong>free doorstep reverse pickup</strong> via our logistics partners (Delhivery /
            BlueDart / Xpressbees).
          </li>
          <li>
            <strong>Step 3:</strong> Hand over the securely packed parcel with original tags intact
            to the courier executive. You will receive an acknowledgment SMS/tracking receipt.
          </li>
          <li>
            <em>Note for Non-Serviceable Pin Codes:</em> In rare remote locations where reverse
            pickup is unavailable, you may ship the item via India Post Speed Post; we will reimburse
            your shipping expenses up to ₹150 upon sharing the courier receipt.
          </li>
        </ol>
      </section>

      {/* Section 6 */}
      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          6. Refund Timelines &amp; Methods
        </h2>
        <p>
          Once your returned saree is received at our central logistics facility, our team will
          inspect it within 24–48 business hours. Upon approval:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-ink/85">
          <li>
            <strong>Prepaid Orders (Card / Netbanking / UPI / Wallet):</strong> Refund is initiated
            immediately back to the original source account. It takes{" "}
            <strong>5 to 7 business days</strong> to reflect depending on your issuing bank.
          </li>
          <li>
            <strong>Cash on Delivery (COD) Orders:</strong> You will be requested to provide your UPI
            ID or Bank Account details (Account Number, Holder Name, IFSC code). The refund will be
            transferred via NEFT / UPI within <strong>3 to 5 business days</strong>.
          </li>
          <li>
            <strong>Store Credit / Gift Voucher:</strong> Customers opting for Mumbai Bazar store
            credits receive an instant digital voucher with 1-year validity for future purchases.
          </li>
        </ul>
      </section>

      {/* Section 7 */}
      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          7. Order Cancellation Policy
        </h2>
        <p>
          You can request to cancel your order at any time <strong>before dispatch</strong> (i.e.,
          before a courier AWB tracking code has been generated). Once dispatched, the shipment is
          in transit with the courier and cannot be stopped; you may refuse delivery upon arrival or
          initiate a standard return following delivery.
        </p>
      </section>
    </>
  );
}

function RefundPolicyPage() {
  return (
    <PolicyLayout
      currentPolicy="refund-policy"
      title="Return and Refund Policy"
      subtitle="Complete guidelines on returns, exchanges, reverse pickups, and refund processing for orders placed with Mumbai Bazar."
    >
      <RefundPolicyContent />
    </PolicyLayout>
  );
}
