import { createFileRoute } from "@tanstack/react-router";
import { seo, jsonLd } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { PolicyLayout } from "@/components/site/PolicyLayout";
import { ShieldCheck, Lock, EyeOff, UserCheck } from "lucide-react";
import { SITE } from "@/lib/seo";

export const Route = createFileRoute("/privacy-policy")({
  head: () => {
    const { meta, links } = seo({
      title: "Privacy Policy | Data Protection & Security — Mumbai Bazar",
      description:
        "Learn how Mumbai Bazar safeguards your personal data, transaction security, and cookie preferences in compliance with Indian DPDP Act and IT Act guidelines.",
      path: "/privacy-policy",
      keywords: [
        "privacy policy",
        "mumbai bazar privacy",
        "data protection",
        "cookie policy",
        "secure shopping",
      ],
    });
    return {
      meta,
      links,
      scripts: [
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Policies", path: "/privacy-policy" },
            { name: "Privacy Policy", path: "/privacy-policy" },
          ]),
        ),
      ],
    };
  },
  component: PrivacyPolicyPage,
});

export function PrivacyPolicyContent() {
  return (
    <>
      {/* Privacy Highlights */}
      <div className="rounded-2xl bg-beige/25 border border-gold/40 p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-start gap-3">
          <Lock className="h-5 w-5 text-maroon shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-maroon text-sm">256-Bit SSL Security</h4>
            <p className="text-xs text-ink/75 mt-0.5">
              PCI-DSS Tier-1 compliant bank-grade encrypted checkout.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <EyeOff className="h-5 w-5 text-maroon shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-maroon text-sm">Zero Data Selling</h4>
            <p className="text-xs text-ink/75 mt-0.5">
              We never sell, rent, or trade your personal information.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <UserCheck className="h-5 w-5 text-maroon shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-maroon text-sm">DPDP Act Compliant</h4>
            <p className="text-xs text-ink/75 mt-0.5">
              Full transparency on data rights, access, and deletion.
            </p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">1. Introduction</h2>
        <p>
          Welcome to <strong>{SITE.name}</strong> ("we," "our," or "us"). We respect your privacy
          and are firmly committed to protecting your personal information. This Privacy Policy
          describes how we collect, process, store, and safeguard your data when you visit our
          website <strong>{SITE.url}</strong>, interact with our customer care representatives, or
          place an order for delivery across India.
        </p>
        <p>
          This policy is formulated in compliance with the{" "}
          <em>Information Technology Act, 2000</em>, the{" "}
          <em>Information Technology (Reasonable Security Practices and Procedures and Sensitive
          Personal Data or Information) Rules, 2011</em>, and the{" "}
          <em>Digital Personal Data Protection Act (DPDP), 2023</em>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          2. Information We Collect
        </h2>
        <p>When you browse or purchase from Mumbai Bazar, we may collect the following categories of information:</p>
        <ul className="list-disc pl-5 space-y-2 text-ink/85">
          <li>
            <strong>Contact &amp; Identity Details:</strong> Full name, phone/mobile number, email
            address, billing address, and physical shipping address (including state, city, and pin
            code).
          </li>
          <li>
            <strong>Transactional Data:</strong> Items purchased, order history, invoice details,
            payment status, and preferred payment mode. <em>Note:</em> We do <strong>not</strong>{" "}
            store credit card numbers, debit card PINs, or CVVs on our servers. All financial
            transactions are processed through certified, PCI-DSS compliant third-party payment
            gateways (Razorpay / Shopify Payments).
          </li>
          <li>
            <strong>Device &amp; Usage Data:</strong> IP address, browser type, operating system,
            referring URLs, pages viewed, time spent on pages, and interaction telemetry to optimize
            site responsiveness.
          </li>
          <li>
            <strong>Customer Care Inquiries:</strong> Transcripts of conversations via WhatsApp,
            email, or phone to address sizing, styling, shipment tracking, and return requests.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          3. How We Use Your Personal Information
        </h2>
        <p>We utilize your data solely for legitimate commercial purposes, including:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-ink/85">
          <li>Processing, fulfilling, and dispatching your saree and bridal wear orders.</li>
          <li>
            Sending automated order confirmations, AWB tracking numbers, and delivery updates via
            SMS, WhatsApp, and email.
          </li>
          <li>Facilitating doorstep reverse pickups for returns or exchanges.</li>
          <li>Processing authorized refunds directly to your bank account or payment card.</li>
          <li>Preventing fraudulent orders and enhancing site security.</li>
          <li>
            Providing tailored weave suggestions, festive edits, and invitations to private styling
            events (which you may opt out of at any time).
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          4. Sharing Information With Trusted Third Parties
        </h2>
        <p>
          We do not sell, rent, or monetize your personal information to advertisers or data brokers.
          We share limited data strictly with trusted service partners required to deliver our
          services:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-ink/85">
          <li>
            <strong>Logistics &amp; Courier Partners:</strong> Delhivery, BlueDart, Xpressbees,
            Ekart, and India Post to physically deliver packages to your doorstep.
          </li>
          <li>
            <strong>Payment Processors:</strong> RBI-licensed payment aggregators (Razorpay,
            Cashfree, Shopify Payments) to securely handle payment authorization.
          </li>
          <li>
            <strong>Communication Platforms:</strong> Verified WhatsApp Business API and transactional
            SMS gateways to deliver real-time dispatch alerts.
          </li>
          <li>
            <strong>Legal Authorities:</strong> When required by lawful court orders, statutory
            regulations, or law enforcement inquiries.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          5. Cookies and Web Analytics
        </h2>
        <p>
          Our website uses standard session and persistent cookies. Cookies assist us in keeping
          track of items placed in your shopping bag, maintaining your session, and understanding
          which saree categories (e.g., Banarasi, Kanjivaram) resonate most with our shoppers. You
          can disable cookies through your browser settings, though some interactive features (such
          as the cart drawer) may experience limited functionality.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          6. Data Retention &amp; Security Standards
        </h2>
        <p>
          We retain your personal order records only for as long as necessary to fulfill statutory tax,
          accounting, and warranty compliance obligations under Indian commercial law. We employ
          robust technical safeguards including firewalls, TLS/SSL cryptographic protocols, and
          restricted internal data access to prevent unauthorized disclosure.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          7. Your Rights Under DPDP Act 2023
        </h2>
        <p>You are entitled to the following rights regarding your personal information:</p>
        <ul className="list-disc pl-5 space-y-1 text-ink/85">
          <li>The right to access and review personal data held by us.</li>
          <li>The right to request correction or updating of incomplete or inaccurate records.</li>
          <li>The right to withdraw consent for marketing SMS/WhatsApp communications.</li>
          <li>The right to request erasure/deletion of your account and personal history.</li>
        </ul>
        <p className="pt-1">
          To exercise any of these rights, simply email us at{" "}
          <a href={`mailto:${SITE.email}`} className="text-maroon font-semibold underline">
            {SITE.email}
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl sm:text-2xl text-maroon font-semibold">
          8. Grievance Redressal Officer
        </h2>
        <p>
          In accordance with Rule 3(2) of the <em>Information Technology Rules, 2011</em>, the name
          and contact details of our Grievance Officer are set out below:
        </p>
        <div className="rounded-2xl border border-gold/45 bg-beige/15 p-4 text-xs sm:text-sm space-y-1 text-ink">
          <p>
            <strong>Name:</strong> Grievance Redressal Officer
          </p>
          <p>
            <strong>Entity:</strong> {SITE.legalName}
          </p>
          <p>
            <strong>Address:</strong> {SITE.address.street}, {SITE.address.city},{" "}
            {SITE.address.region} {SITE.address.postalCode}, India
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a href={`mailto:${SITE.email}`} className="text-maroon font-medium underline">
              {SITE.email}
            </a>
          </p>
          <p>
            <strong>Response Time:</strong> Acknowledgment within 48 business hours; resolution
            within 30 days.
          </p>
        </div>
      </section>
    </>
  );
}

function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      currentPolicy="privacy-policy"
      title="Privacy Policy"
      subtitle="How Mumbai Bazar collects, secures, and protects your personal and transactional information."
    >
      <PrivacyPolicyContent />
    </PolicyLayout>
  );
}
