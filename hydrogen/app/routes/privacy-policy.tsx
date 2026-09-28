import { Link } from "react-router";
import type { Route } from "./+types/privacy-policy";
import { SITE, getSeoMeta, jsonLdScript } from "~/lib/seo";
import { breadcrumbSchema } from "~/lib/structured-data";

export const meta: Route.MetaFunction = () => {
  return getSeoMeta({
    title: "Privacy Policy | Mumbai Bazar Sarees",
    description:
      "How Mumbai Bazar collects, protects, and uses customer data across our website and 8 retail saree stores.",
    path: "/privacy-policy",
    keywords: ["privacy policy", "mumbai bazar privacy", "customer data protection"],
  });
};

export default function PrivacyPolicyPage() {
  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Privacy Policy", path: "/privacy-policy" },
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
            Legal &amp; Trust
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-taupe max-w-2xl mx-auto leading-relaxed">
            Effective from January 2026. Your privacy and personal trust are fundamental to our business.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-14 space-y-8 text-sm text-taupe leading-relaxed">
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-ink">1. Information We Collect</h2>
          <p>
            When you purchase from our stores or website, we collect your name, shipping address, contact phone number, email address, and order transaction records. We never store raw credit card numbers or UPI PINs; all payments are processed securely via RBI-compliant, PCI-DSS certified payment gateways.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-ink">2. How We Use Your Information</h2>
          <p>
            We use customer data strictly to fulfill orders, arrange express courier delivery, communicate delivery tracking updates, coordinate matching blouse stitching, and provide responsive customer service.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-ink">3. Data Sharing &amp; Third Parties</h2>
          <p>
            We do not sell, rent, or trade customer information to any external marketing agencies. Information is shared only with verified logistics partners (such as Delhivery, Blue Dart) strictly for order fulfillment.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-ink">4. Customer Rights &amp; Contact</h2>
          <p>
            You may request an update or deletion of your contact records at any time by writing to{" "}
            <a href={`mailto:${SITE.email}`} className="text-maroon underline font-medium">
              {SITE.email}
            </a>{" "}
            or contacting our Nalasopara East flagship desk.
          </p>
        </div>
      </div>
    </div>
  );
}
