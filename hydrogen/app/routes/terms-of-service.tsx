import { Link } from "react-router";
import type { Route } from "./+types/terms-of-service";
import { SITE, getSeoMeta, jsonLdScript } from "~/lib/seo";
import { breadcrumbSchema } from "~/lib/structured-data";

export const meta: Route.MetaFunction = () => {
  return getSeoMeta({
    title: "Terms of Service | Mumbai Bazar Sarees",
    description:
      "Terms and conditions governing purchases, store policies, custom stitching, and website usage at Mumbai Bazar.",
    path: "/terms-of-service",
    keywords: ["terms of service", "terms and conditions", "mumbai bazar policy"],
  });
};

export default function TermsOfServicePage() {
  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Terms of Service", path: "/terms-of-service" },
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
            Terms &amp; Conditions
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
            Terms of Service
          </h1>
          <p className="mt-4 text-sm text-taupe max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before placing orders online or at our Mumbai boutiques.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-14 space-y-8 text-sm text-taupe leading-relaxed">
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-ink">1. General Overview</h2>
          <p>
            By accessing or purchasing from Mumbai Bazar (operated under registered brand name Mumbai Bazar across Maharashtra, India), you agree to be bound by these terms, our Privacy Policy, and our Return Guidelines.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-ink">2. Handloom Characteristic &amp; Color Accuracy</h2>
          <p>
            Authentic handloom sarees are woven on traditional pit looms. Subtle variations in zari thread density or minor loom slubs are hallmarks of genuine handcraftsmanship, not manufacturing defects. While we photograph all sarees under balanced daylight calibrated monitors, digital screen settings may result in minor perceptible shade variations.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-ink">3. Pricing &amp; Taxes</h2>
          <p>
            All prices displayed on mumbaibazar.com and in store tags are listed in Indian Rupees (INR) and are inclusive of applicable Goods and Services Tax (GST).
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-ink">4. Governing Law</h2>
          <p>
            Any disputes arising out of purchases or service agreements shall be governed by the laws of India and subject to the exclusive jurisdiction of courts in Palghar / Mumbai, Maharashtra.
          </p>
        </div>
      </div>
    </div>
  );
}
