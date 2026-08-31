import { createFileRoute, notFound } from "@tanstack/react-router";
import { seo, jsonLd } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { PolicyLayout } from "@/components/site/PolicyLayout";
import { PrivacyPolicyContent } from "@/routes/privacy-policy";
import { TermsOfServiceContent } from "@/routes/terms-of-service";
import { RefundPolicyContent } from "@/routes/refund-policy";
import { ShippingPolicyContent } from "@/routes/shipping-policy";
import { ContactInformationContent } from "@/routes/contact-information";
import { LegalNoticeContent } from "@/routes/legal-notice";

const POLICY_MAP: Record<
  string,
  {
    id: string;
    title: string;
    subtitle: string;
    component: React.ComponentType;
  }
> = {
  "privacy-policy": {
    id: "privacy-policy",
    title: "Privacy Policy",
    subtitle:
      "How Mumbai Bazar collects, secures, and protects your personal and transactional information.",
    component: PrivacyPolicyContent,
  },
  "terms-of-service": {
    id: "terms-of-service",
    title: "Terms of Service",
    subtitle:
      "The rules, terms, and conditions governing your purchases, browsing, and rights on Mumbai Bazar.",
    component: TermsOfServiceContent,
  },
  "refund-policy": {
    id: "refund-policy",
    title: "Return and Refund Policy",
    subtitle:
      "Complete guidelines on returns, exchanges, reverse pickups, and refund processing for orders placed with Mumbai Bazar.",
    component: RefundPolicyContent,
  },
  "shipping-policy": {
    id: "shipping-policy",
    title: "Shipping & Delivery Policy",
    subtitle:
      "Details on dispatch timelines, free delivery across India, live order tracking, and delivery procedures.",
    component: ShippingPolicyContent,
  },
  "contact-information": {
    id: "contact-information",
    title: "Contact Information",
    subtitle:
      "Official merchant contact coordinates, customer support helpline, registered flagship address, and retail store directory.",
    component: ContactInformationContent,
  },
  "legal-notice": {
    id: "legal-notice",
    title: "Legal Notice & Imprint",
    subtitle:
      "Statutory disclosures under the Consumer Protection (E-Commerce) Rules, 2020 and Information Technology Act.",
    component: LegalNoticeContent,
  },
};

export const Route = createFileRoute("/policies/$policy")({
  head: ({ params }) => {
    const config = POLICY_MAP[params.policy] || {
      title: "Store Policy — Mumbai Bazar",
      subtitle: "Official Mumbai Bazar store policies.",
    };

    const { meta, links } = seo({
      title: `${config.title} — Mumbai Bazar`,
      description: config.subtitle,
      path: `/policies/${params.policy}`,
    });

    return {
      meta,
      links,
      scripts: [
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Policies", path: `/policies/${params.policy}` },
            { name: config.title, path: `/policies/${params.policy}` },
          ]),
        ),
      ],
    };
  },
  component: DynamicPolicyPage,
});

function DynamicPolicyPage() {
  const { policy } = Route.useParams();
  const config = POLICY_MAP[policy];

  if (!config) {
    return (
      <div className="w-full bg-ivory py-24 text-center">
        <h1 className="font-serif text-3xl text-maroon font-semibold">Policy Not Found</h1>
        <p className="mt-2 text-sm text-taupe">The requested store policy page does not exist.</p>
      </div>
    );
  }

  const ContentComponent = config.component;

  return (
    <PolicyLayout currentPolicy={config.id} title={config.title} subtitle={config.subtitle}>
      <ContentComponent />
    </PolicyLayout>
  );
}
