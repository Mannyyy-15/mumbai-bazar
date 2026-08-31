import React from "react";
import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  FileText,
  RotateCcw,
  Truck,
  Phone,
  Scale,
  MessageCircle,
  ChevronRight,
  Clock,
} from "lucide-react";
import { SITE } from "@/lib/seo";

export const POLICY_NAV = [
  {
    id: "refund-policy",
    label: "Return & Refund Policy",
    to: "/refund-policy",
    icon: RotateCcw,
    desc: "7-day easy returns & reverse pickup",
  },
  {
    id: "privacy-policy",
    label: "Privacy Policy",
    to: "/privacy-policy",
    icon: ShieldCheck,
    desc: "DPDP & IT Act data protection",
  },
  {
    id: "terms-of-service",
    label: "Terms of Service",
    to: "/terms-of-service",
    icon: FileText,
    desc: "Store rules & purchase terms",
  },
  {
    id: "shipping-policy",
    label: "Shipping & Delivery",
    to: "/shipping-policy",
    icon: Truck,
    desc: "Free India delivery & tracking",
  },
  {
    id: "contact-information",
    label: "Contact Information",
    to: "/contact-information",
    icon: Phone,
    desc: "Helpline, WhatsApp & stores",
  },
  {
    id: "legal-notice",
    label: "Legal Notice & Imprint",
    to: "/legal-notice",
    icon: Scale,
    desc: "Statutory e-commerce disclosures",
  },
];

interface PolicyLayoutProps {
  currentPolicy: string;
  title: string;
  subtitle: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export function PolicyLayout({
  currentPolicy,
  title,
  subtitle,
  lastUpdated = "August 31, 2026",
  children,
}: PolicyLayoutProps) {
  return (
    <div className="w-full bg-ivory text-ink min-h-screen">
      {/* 1. Top Breadcrumb & Header Bar */}
      <div className="border-b border-gold/30 bg-beige/15 py-4 md:py-6">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16">
          <nav className="text-xs tracking-[0.14em] uppercase text-maroon font-bold flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-gold-deep transition-colors">
              Home
            </Link>
            <span className="text-gold-deep">/</span>
            <span className="text-taupe">Policies</span>
            <span className="text-gold-deep">/</span>
            <span className="text-ink">{title}</span>
          </nav>
          <div className="mt-3 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-maroon font-semibold leading-tight">
                {title}
              </h1>
              <p className="mt-1 text-xs md:text-sm text-ink/75 max-w-2xl">{subtitle}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-taupe shrink-0 font-medium">
              <Clock className="h-3.5 w-3.5 text-gold-deep" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Container with Sticky Sidebar */}
      <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 py-8 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] gap-8 lg:gap-12 items-start">
          {/* Left Navigation Sidebar */}
          <aside className="w-full space-y-6">
            <div className="rounded-2xl border border-gold/40 bg-beige/20 p-4 sm:p-5 shadow-sm">
              <h2 className="text-xs uppercase tracking-[0.16em] font-bold text-maroon mb-3 px-1">
                Store Policies
              </h2>
              <nav className="space-y-1">
                {POLICY_NAV.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPolicy === item.id;
                  return (
                    <Link
                      key={item.id}
                      to={item.to}
                      className={`group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-maroon text-ivory shadow-md font-semibold"
                          : "hover:bg-ivory/80 text-ink/85 hover:text-maroon border border-transparent hover:border-gold/30"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 mt-0.5 shrink-0 transition-colors ${
                          isActive ? "text-gold" : "text-maroon group-hover:text-gold-deep"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-[13px] leading-tight font-medium">
                          {item.label}
                        </div>
                        <div
                          className={`text-[11px] mt-0.5 truncate ${
                            isActive ? "text-ivory/75" : "text-taupe"
                          }`}
                        >
                          {item.desc}
                        </div>
                      </div>
                      <ChevronRight
                        className={`h-3.5 w-3.5 mt-1 shrink-0 transition-transform ${
                          isActive ? "text-gold" : "text-taupe group-hover:translate-x-0.5"
                        }`}
                      />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Quick WhatsApp Concierge Help Card */}
            <div className="rounded-2xl border border-gold/45 bg-ivory p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-maroon font-bold text-xs uppercase tracking-wider">
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                <span>Need Assistance?</span>
              </div>
              <p className="text-xs text-ink/80 leading-relaxed">
                Have a question regarding your order, refund status, or delivery timeline? Our saree
                care desk is here to help.
              </p>
              <div className="space-y-1.5 text-xs text-ink/90 pt-1">
                <p>
                  <strong>Call:</strong> {SITE.phone}
                </p>
                <p>
                  <strong>Email:</strong> {SITE.email}
                </p>
                <p>
                  <strong>Hours:</strong> {SITE.hours.label.replace("Open daily: ", "Daily, ")}
                </p>
              </div>
              <a
                href={`https://wa.me/${SITE.whatsapp}?text=Hello%20Mumbai%20Bazar%20Support%2C%20I%20have%20an%20inquiry%20regarding%20a%20store%20policy.`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-full bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-800 transition-colors shadow-sm"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </aside>

          {/* Right Policy Document Prose */}
          <main className="rounded-3xl border border-gold/35 bg-ivory p-6 sm:p-10 md:p-12 shadow-sm">
            <div className="policy-prose max-w-none text-ink text-sm sm:text-base leading-relaxed space-y-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
