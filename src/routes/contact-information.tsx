import { createFileRoute, Link } from "@tanstack/react-router";
import { seo, jsonLd } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { PolicyLayout } from "@/components/site/PolicyLayout";
import { Phone, Mail, MapPin, Clock, MessageCircle, Store } from "lucide-react";
import { SITE } from "@/lib/seo";
import { PUBLISHED_OUTLETS } from "@/lib/locations";

export const Route = createFileRoute("/contact-information")({
  head: () => {
    const { meta, links } = seo({
      title: "Contact Information | Customer Support & Stores — Mumbai Bazar",
      description:
        "Official contact information for Mumbai Bazar. Reach our customer care team via phone, WhatsApp, or email, or visit any of our 8 retail stores in Mumbai.",
      path: "/contact-information",
      keywords: [
        "mumbai bazar contact",
        "mumbai bazar customer care",
        "mumbai bazar phone number",
        "mumbai bazar address",
        "saree shop nalasopara contact",
      ],
    });
    return {
      meta,
      links,
      scripts: [
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Policies", path: "/contact-information" },
            { name: "Contact Information", path: "/contact-information" },
          ]),
        ),
      ],
    };
  },
  component: ContactInformationPage,
});

export function ContactInformationContent() {
  return (
    <>
      <section className="space-y-4">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          Official Merchant &amp; Support Details
        </h2>
        <p>
          We are here to assist you with order status, bridal consultations, saree weave inquiries,
          returns, and store visits. Please use any of our official communication channels below:
        </p>

        {/* Primary Contact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Card 1: Phone */}
          <div className="rounded-2xl border border-gold/40 bg-beige/15 p-5 space-y-2">
            <div className="flex items-center gap-2 text-maroon font-bold text-xs uppercase tracking-wider">
              <Phone className="h-4 w-4 text-gold-deep" />
              <span>Customer Helpline</span>
            </div>
            <p className="text-lg font-semibold text-ink">{SITE.phone}</p>
            <p className="text-xs text-taupe">Mon – Sat, 10:00 AM – 8:00 PM IST</p>
          </div>

          {/* Card 2: WhatsApp */}
          <div className="rounded-2xl border border-gold/40 bg-beige/15 p-5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Support</span>
            </div>
            <p className="text-lg font-semibold text-ink">{SITE.phone}</p>
            <p className="text-xs text-taupe">Instant messaging for drape &amp; order queries</p>
            <a
              href={`https://wa.me/${SITE.whatsapp}?text=Hello%20Mumbai%20Bazar%20Support`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-emerald-700 font-bold underline hover:text-emerald-800"
            >
              Start WhatsApp Chat →
            </a>
          </div>

          {/* Card 3: Email */}
          <div className="rounded-2xl border border-gold/40 bg-beige/15 p-5 space-y-2">
            <div className="flex items-center gap-2 text-maroon font-bold text-xs uppercase tracking-wider">
              <Mail className="h-4 w-4 text-gold-deep" />
              <span>Support Email</span>
            </div>
            <p className="text-lg font-semibold text-ink">
              <a href={`mailto:${SITE.email}`} className="hover:text-maroon underline">
                {SITE.email}
              </a>
            </p>
            <p className="text-xs text-taupe">Responses guaranteed within 24 business hours</p>
          </div>

          {/* Card 4: Flagship Address */}
          <div className="rounded-2xl border border-gold/40 bg-beige/15 p-5 space-y-2">
            <div className="flex items-center gap-2 text-maroon font-bold text-xs uppercase tracking-wider">
              <MapPin className="h-4 w-4 text-gold-deep" />
              <span>Registered Flagship Office</span>
            </div>
            <p className="text-sm font-medium text-ink leading-relaxed">
              {SITE.address.street},<br />
              {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}, India
            </p>
          </div>
        </div>
      </section>

      {/* Trade & Legal Entity Details */}
      <section className="space-y-3 pt-4 border-t border-gold/30">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          Trade Entity Information
        </h2>
        <div className="rounded-2xl border border-gold/40 bg-ivory p-5 space-y-2 text-xs sm:text-sm">
          <p>
            <strong>Trade Name:</strong> {SITE.name}
          </p>
          <p>
            <strong>Legal Entity Name:</strong> {SITE.legalName}
          </p>
          <p>
            <strong>Official Website:</strong>{" "}
            <a href={SITE.url} className="text-maroon font-semibold underline">
              {SITE.url}
            </a>
          </p>
          <p>
            <strong>Operational Jurisdiction:</strong> Maharashtra, India
          </p>
          <p>
            <strong>Category:</strong> Retail &amp; E-Commerce Trade in Sarees, Lehengas &amp; Ethnic
            Wear
          </p>
        </div>
      </section>

      {/* Retail Store Network */}
      <section className="space-y-4 pt-4 border-t border-gold/30">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
            Our Retail Stores Across Mumbai
          </h2>
          <Link
            to="/stores"
            className="text-xs text-maroon font-bold uppercase tracking-wider hover:text-gold-deep underline"
          >
            View All Store Locations →
          </Link>
        </div>
        <p className="text-xs sm:text-sm text-ink/80">
          In addition to our nationwide online boutique, you can visit any of our physical outlets to
          feel the silk fabric weight, view bridal sets, and meet our master drapers:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {PUBLISHED_OUTLETS.map((store) => (
            <div
              key={store.slug}
              className="p-3.5 rounded-xl border border-gold/30 bg-beige/10 flex items-start gap-3"
            >
              <Store className="h-4 w-4 text-maroon shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-xs text-maroon">{store.name}</h4>
                <p className="text-[11px] text-taupe mt-0.5 line-clamp-1">{store.address}</p>
                <Link
                  to="/stores/$slug"
                  params={{ slug: store.slug }}
                  className="text-[10.5px] font-bold text-gold-deep uppercase tracking-wider hover:text-maroon mt-1 inline-block"
                >
                  Store Details &amp; Directions →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function ContactInformationPage() {
  return (
    <PolicyLayout
      currentPolicy="contact-information"
      title="Contact Information"
      subtitle="Official merchant contact coordinates, customer support helpline, registered flagship address, and retail store directory."
    >
      <ContactInformationContent />
    </PolicyLayout>
  );
}
