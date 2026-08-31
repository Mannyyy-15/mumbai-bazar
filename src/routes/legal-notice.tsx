import { createFileRoute, Link } from "@tanstack/react-router";
import { seo, jsonLd } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { PolicyLayout } from "@/components/site/PolicyLayout";
import { Scale, ShieldCheck, FileCheck, Building2 } from "lucide-react";
import { SITE } from "@/lib/seo";

export const Route = createFileRoute("/legal-notice")({
  head: () => {
    const { meta, links } = seo({
      title: "Legal Notice & Imprint | Mumbai Bazar",
      description:
        "Official statutory disclosures and legal imprint of Mumbai Bazar pursuant to the Consumer Protection (E-Commerce) Rules, 2020 and Information Technology Act.",
      path: "/legal-notice",
      keywords: [
        "legal notice",
        "mumbai bazar imprint",
        "statutory disclosures",
        "consumer protection ecommerce",
        "grievance officer",
      ],
    });
    return {
      meta,
      links,
      scripts: [
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Policies", path: "/legal-notice" },
            { name: "Legal Notice", path: "/legal-notice" },
          ]),
        ),
      ],
    };
  },
  component: LegalNoticePage,
});

export function LegalNoticeContent() {
  return (
    <>
      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          1. Statutory E-Commerce Disclosures
        </h2>
        <p>
          This Legal Notice and Imprint is published in compliance with the requirements of the{" "}
          <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>, promulgated under the{" "}
          <em>Consumer Protection Act, 2019</em>, as well as the <em>Information Technology Act, 2000</em>.
        </p>
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-xs sm:text-sm border-collapse border border-gold/30">
            <tbody>
              <tr className="bg-beige/25">
                <td className="border border-gold/30 p-3 font-semibold text-maroon w-1/3">
                  Legal Entity Name
                </td>
                <td className="border border-gold/30 p-3">{SITE.legalName}</td>
              </tr>
              <tr>
                <td className="border border-gold/30 p-3 font-semibold text-maroon">
                  Trade / Brand Name
                </td>
                <td className="border border-gold/30 p-3">{SITE.name}</td>
              </tr>
              <tr className="bg-beige/25">
                <td className="border border-gold/30 p-3 font-semibold text-maroon">
                  Headquarters &amp; Principal Office
                </td>
                <td className="border border-gold/30 p-3">
                  {SITE.address.street}, {SITE.address.city}, {SITE.address.region}{" "}
                  {SITE.address.postalCode}, Maharashtra, India
                </td>
              </tr>
              <tr>
                <td className="border border-gold/30 p-3 font-semibold text-maroon">
                  Official Website
                </td>
                <td className="border border-gold/30 p-3">
                  <a href={SITE.url} className="text-maroon underline font-medium">
                    {SITE.url}
                  </a>
                </td>
              </tr>
              <tr className="bg-beige/25">
                <td className="border border-gold/30 p-3 font-semibold text-maroon">
                  Customer Care Contact
                </td>
                <td className="border border-gold/30 p-3">
                  Phone: {SITE.phone} | Email: {SITE.email}
                </td>
              </tr>
              <tr>
                <td className="border border-gold/30 p-3 font-semibold text-maroon">
                  Nature of Business
                </td>
                <td className="border border-gold/30 p-3">
                  Retail, Wholesale &amp; Direct-to-Consumer Online Sale of Handloom Sarees, Lehengas,
                  and Silk Fabrics
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3 pt-4">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          2. Grievance Redressal Mechanism
        </h2>
        <p>
          In accordance with Rule 5(3)(e) of the Consumer Protection (E-Commerce) Rules, 2020, Mumbai
          Bazar has established a dedicated consumer grievance redressal mechanism. If you have an
          unresolved inquiry or grievance regarding your transaction, product quality, or refund, you
          may escalate it to our designated Grievance Officer:
        </p>

        <div className="rounded-2xl border border-gold/45 bg-ivory p-5 space-y-2 text-xs sm:text-sm">
          <p>
            <strong>Designation:</strong> Grievance Redressal Officer
          </p>
          <p>
            <strong>Entity:</strong> {SITE.legalName}
          </p>
          <p>
            <strong>Mailing Address:</strong> Shop 1, Tiwari Nagar, Tulinj Road, Nalasopara East,
            Palghar, Maharashtra 401209, India
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a href={`mailto:${SITE.email}`} className="text-maroon font-semibold underline">
              {SITE.email}
            </a>
          </p>
          <p>
            <strong>Statutory SLA:</strong> Acknowledgment issued within 48 business hours; complete
            investigation and resolution within 1 month (30 calendar days).
          </p>
        </div>
      </section>

      <section className="space-y-3 pt-4">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          3. Trademark &amp; Intellectual Property Notice
        </h2>
        <p>
          "Mumbai Bazar", the peacock and zari emblem, and related stylistic signatures are protected
          brand marks. All product photography, digital catalog layouts, and editorial text are the
          exclusive property of Mumbai Bazar. Any unauthorized copying, scraping, or commercial
          re-distribution is punishable under the <em>Copyright Act, 1957</em> and the{" "}
          <em>Trade Marks Act, 1999</em>.
        </p>
      </section>

      <section className="space-y-3 pt-4">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          4. Dispute Resolution &amp; Jurisdiction
        </h2>
        <p>
          Any dispute, controversy, or claim arising out of or relating to goods purchased from Mumbai
          Bazar or your use of the website shall be governed by the laws of India. The courts located
          within the territorial limits of <strong>Palghar / Mumbai, Maharashtra</strong> shall have
          exclusive jurisdiction to adjudicate any legal proceedings.
        </p>
      </section>
    </>
  );
}

function LegalNoticePage() {
  return (
    <PolicyLayout
      currentPolicy="legal-notice"
      title="Legal Notice & Imprint"
      subtitle="Statutory disclosures under the Consumer Protection (E-Commerce) Rules, 2020 and Information Technology Act."
    >
      <LegalNoticeContent />
    </PolicyLayout>
  );
}
