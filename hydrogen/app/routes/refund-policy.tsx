import { Link } from "react-router";
import type { Route } from "./+types/refund-policy";
import { RotateCcw, CheckCircle2 } from "lucide-react";
import { SITE, getSeoMeta, jsonLdScript } from "~/lib/seo";
import { breadcrumbSchema } from "~/lib/structured-data";

export const meta: Route.MetaFunction = () => {
  return getSeoMeta({
    title: "Refund & Exchange Policy | Mumbai Bazar Sarees",
    description:
      "7-day easy exchange and return guidelines for sarees, lehengas, and dress material purchased online or at Mumbai Bazar stores.",
    path: "/refund-policy",
    keywords: ["refund policy", "exchange policy", "saree return window", "mumbai bazar returns"],
  });
};

export default function RefundPolicyPage() {
  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Refund & Exchange Policy", path: "/refund-policy" },
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
            Returns &amp; Peace of Mind
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
            Refund &amp; Exchange Policy
          </h1>
          <p className="mt-4 text-sm text-taupe max-w-2xl mx-auto leading-relaxed">
            Honest, straightforward guidelines to ensure complete satisfaction with your saree purchase.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-14 space-y-8 text-sm text-taupe leading-relaxed">
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-ink">1. 7-Day Exchange Window</h2>
          <p>
            We offer a hassle-free 7-day exchange window from the date your saree is delivered or purchased in store. You may exchange for a different color, design, or another weave of equal or higher value.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-ink">2. Conditions for Return / Exchange</h2>
          <ul className="space-y-2 list-disc pl-4">
            <li>The saree must be unworn, unwashed, and in its original pristine condition.</li>
            <li>Original tags, barcodes, and intact unstitched blouse piece must remain attached.</li>
            <li>Custom stitched blouses or sarees with custom fall-and-pico altered at client request are non-returnable.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-ink">3. Initiating an Exchange</h2>
          <p>
            To initiate an exchange, simply message our concierge on WhatsApp at{" "}
            <a
              href="https://wa.me/918956664631?text=Hi%20Mumbai%20Bazar%2C%20I%20want%20to%20request%20an%20exchange"
              target="_blank"
              rel="noreferrer"
              className="text-maroon underline font-medium"
            >
              +91 89566 64631
            </a>{" "}
            or visit any of our 8 retail stores in Mumbai.
          </p>
        </div>
      </div>
    </div>
  );
}
