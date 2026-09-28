import { Link } from "react-router";
import type { Route } from "./+types/contact-information";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { SITE, getSeoMeta, jsonLdScript } from "~/lib/seo";
import { breadcrumbSchema } from "~/lib/structured-data";

export const meta: Route.MetaFunction = () => {
  return getSeoMeta({
    title: "Contact & Help Desk | Mumbai Bazar Sarees",
    description: `Contact Mumbai Bazar customer care, bridal concierge, and store helpline. Call ${SITE.phone} or WhatsApp our Nalasopara East flagship store.`,
    path: "/contact-information",
    keywords: [
      "contact mumbai bazar",
      "help desk sarees",
      "customer care number mumbai bazar",
      "store assistance",
    ],
  });
};

export default function ContactInformationPage() {
  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Contact & Help Desk", path: "/contact-information" },
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
            Support Desk
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
            Contact &amp; Help Desk
          </h1>
          <p className="mt-4 text-sm text-taupe max-w-2xl mx-auto leading-relaxed">
            Direct communication channels for order inquiries, bespoke blouse stitching tracking, and store visits.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-14 space-y-10">
        <div className="rounded-3xl border border-gold/40 bg-white p-8 shadow-sm space-y-6">
          <h2 className="font-serif text-2xl font-bold text-ink">
            Official Contact Coordinates
          </h2>

          <div className="space-y-4 text-sm text-taupe">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-maroon shrink-0" />
              <span>
                <strong className="text-ink">Helpline:</strong>{" "}
                <a href={`tel:${SITE.phone}`} className="text-maroon underline font-medium">
                  {SITE.phone}
                </a>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-[#25D366] shrink-0" />
              <span>
                <strong className="text-ink">WhatsApp Concierge:</strong>{" "}
                <a
                  href="https://wa.me/918956664631?text=Hi%20Mumbai%20Bazar"
                  target="_blank"
                  rel="noreferrer"
                  className="text-maroon underline font-medium"
                >
                  +91 89566 64631
                </a>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-maroon shrink-0" />
              <span>
                <strong className="text-ink">Support Email:</strong>{" "}
                <a href={`mailto:${SITE.email}`} className="text-maroon underline font-medium">
                  {SITE.email}
                </a>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-maroon shrink-0" />
              <span>
                <strong className="text-ink">Hours:</strong> {SITE.hours.sentence}
              </span>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-maroon shrink-0 mt-0.5" />
              <span>
                <strong className="text-ink">Registered Office &amp; Flagship:</strong>{" "}
                {SITE.address.street}, {SITE.address.city}, {SITE.address.region} - {SITE.address.postalCode}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
