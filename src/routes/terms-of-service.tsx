import { createFileRoute } from "@tanstack/react-router";
import { seo, jsonLd } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { PolicyLayout } from "@/components/site/PolicyLayout";
import { FileText, ShieldAlert, Check, HelpCircle } from "lucide-react";
import { SITE } from "@/lib/seo";

export const Route = createFileRoute("/terms-of-service")({
  head: () => {
    const { meta, links } = seo({
      title: "Terms of Service | Store Rules & Conditions — Mumbai Bazar",
      description:
        "Official terms of service governing purchases, website usage, handloom color variations, and customer rights with Mumbai Bazar.",
      path: "/terms-of-service",
      keywords: [
        "terms of service",
        "terms and conditions",
        "mumbai bazar terms",
        "online shopping terms",
        "handloom policy",
      ],
    });
    return {
      meta,
      links,
      scripts: [
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Policies", path: "/terms-of-service" },
            { name: "Terms of Service", path: "/terms-of-service" },
          ]),
        ),
      ],
    };
  },
  component: TermsOfServicePage,
});

export function TermsOfServiceContent() {
  return (
    <>
      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          1. Agreement to Terms
        </h2>
        <p>
          These Terms of Service ("Terms") constitute a legally binding agreement between you
          ("Customer," "User," or "you") and <strong>{SITE.legalName}</strong> ("Company," "we,"
          "us," or "our"), governing your access to and use of our website{" "}
          <strong>{SITE.url}</strong>, our offline boutique stores, and all associated services.
        </p>
        <p>
          By accessing the website, registering an account, or placing an order, you agree to be bound
          by these Terms and our related Privacy Policy, Return &amp; Refund Policy, and Shipping
          Policy. If you do not agree to all terms and conditions, you must not use our website.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          2. User Eligibility
        </h2>
        <p>
          You must be at least 18 years of age to enter into a legally binding contract under the{" "}
          <em>Indian Contract Act, 1872</em>. If you are under the age of 18, you may use this
          website only under the supervision and consent of a parent or legal guardian who agrees to
          be bound by these Terms.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          3. Handloom Authenticity &amp; Organic Variation Notice
        </h2>
        <div className="rounded-xl border border-gold/50 bg-beige/25 p-4 text-xs sm:text-sm text-ink space-y-2">
          <p className="font-semibold text-maroon flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-gold-deep" /> The Beauty of Authentic Handcraft
          </p>
          <p>
            The majority of our sarees—including Banarasi katan, pure Kanjivaram, and Paithani
            weaves—are handwoven by hereditary artisans. As with all genuine handlooms:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-ink/85">
            <li>
              Minor irregularities in the weave, zari density, or selvedge edge are natural hallmarks
              of hand-spun authenticity, not factory defects.
            </li>
            <li>
              Due to digital studio photography, screen calibrations, and natural silk luster, slight
              color shade variations (approx. 5–10%) may occur between digital photographs and the
              physical drape in daylight.
            </li>
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          4. Pricing, Taxes &amp; Currency
        </h2>
        <p>
          All product prices listed on <strong>{SITE.url}</strong> are quoted in Indian Rupees (INR,
          ₹) and are inclusive of applicable Goods and Services Tax (GST). Delivery within India is
          free of charge.
        </p>
        <p>
          We strive to ensure all pricing information is accurate. In the rare instance of an
          inadvertent typographical error or technical glitch where a product is listed at an
          incorrect price, Mumbai Bazar reserves the right to cancel the order and provide an immediate
          full refund before dispatch.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          5. Orders, Acceptance &amp; Payment
        </h2>
        <p>
          An order confirmation email or SMS signifies receipt of your order request; it does not
          constitute final legal acceptance. The contract of sale is finalized when the ordered
          products are inspected, packed, and assigned an AWB tracking number with the courier.
        </p>
        <p>We accept payment via:</p>
        <ul className="list-disc pl-5 space-y-1 text-ink/85">
          <li>UPI (Google Pay, PhonePe, Paytm, BHIM)</li>
          <li>Credit &amp; Debit Cards (Visa, MasterCard, RuPay, American Express)</li>
          <li>Net Banking across major Indian scheduled banks</li>
          <li>Cash on Delivery (COD) on eligible domestic postal pin codes</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          6. Intellectual Property Rights
        </h2>
        <p>
          All content on this website—including but not limited to brand logos, trademarks ("Mumbai
          Bazar"), graphic designs, product photography, editorial copy, video showcases, and
          source code—is the proprietary intellectual property of Mumbai Bazar and is protected by
          Indian and international copyright and trademark laws. Unauthorized reproduction or
          commercial exploitation is strictly prohibited.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          7. Limitation of Liability
        </h2>
        <p>
          To the maximum extent permitted by Indian law, Mumbai Bazar shall not be liable for any
          indirect, incidental, or consequential damages resulting from the use or inability to use
          our website or services. In any event, our total liability for any claim arising out of an
          order shall be strictly limited to the actual amount paid by you for the specific product.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          8. Governing Law &amp; Jurisdiction
        </h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the Republic
          of India. Any dispute, claim, or controversy arising under or relating to these Terms or your
          purchase shall be subject to the exclusive jurisdiction of the competent courts in{" "}
          <strong>Palghar / Mumbai, Maharashtra</strong>.
        </p>
      </section>
    </>
  );
}

function TermsOfServicePage() {
  return (
    <PolicyLayout
      currentPolicy="terms-of-service"
      title="Terms of Service"
      subtitle="The rules, terms, and conditions governing your purchases, browsing, and rights on Mumbai Bazar."
    >
      <TermsOfServiceContent />
    </PolicyLayout>
  );
}
