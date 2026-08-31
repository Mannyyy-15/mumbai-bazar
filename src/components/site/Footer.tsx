import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { NAV } from "@/lib/site-data";
import { PUBLISHED_OUTLETS } from "@/lib/locations";
import { SITE } from "@/lib/seo";

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 flex flex-col items-center md:items-start text-center md:text-left">
      <h4 className="font-serif text-lg text-[#F5CE7A] font-bold tracking-wide">{title}</h4>
      <ul className="mt-4 space-y-3 text-sm text-white/90 break-words flex flex-col items-center md:items-start w-full">
        {children}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-maroon text-white border-t border-[#F5CE7A]/30 relative">
      <div className="mx-auto max-w-[1400px] px-4 py-14 md:px-8 md:py-20">
        {/* Main Grid: On mobile everything is centered */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 md:gap-8 items-start">
          {/* Brand Info */}
          <div className="sm:col-span-2 md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start">
              <img
                src="/logo.png"
                alt="Mumbai Bazar Logo"
                className="h-16 md:h-20 object-contain brightness-0 invert"
              />
            </div>
            <p className="mt-2 text-[11px] tracking-[0.35em] uppercase text-[#F5CE7A] font-bold">
              Sarees · Since 2009
            </p>
            <p className="mt-4 max-w-sm text-sm text-white/90 leading-relaxed font-normal">
              Handcrafted Banarasi, Kanjivaram, and bridal sarees across 8 retail boutiques in Mumbai
              — chosen with care, delivered with warmth.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex items-center justify-center md:justify-start gap-3">
              <a
                href="https://www.instagram.com/mumbai__bazar__nalasopara/"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow Mumbai Bazar on Instagram"
                className="h-9 w-9 rounded-full border border-[#F5CE7A]/60 flex items-center justify-center text-white hover:text-[#F5CE7A] hover:border-[#F5CE7A] hover:bg-white/10 transition-all shadow-sm"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/people/Mumbai-Bazar/100063816405234/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="h-9 w-9 rounded-full border border-[#F5CE7A]/60 flex items-center justify-center text-white hover:text-[#F5CE7A] hover:border-[#F5CE7A] hover:bg-white/10 transition-all shadow-sm"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="h-9 w-9 rounded-full border border-[#F5CE7A]/60 flex items-center justify-center text-white hover:text-[#F5CE7A] hover:border-[#F5CE7A] hover:bg-white/10 transition-all shadow-sm"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Shop */}
          <Col title="Shop Collections">
            {NAV.slice(0, 5).map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-[#F5CE7A] transition-colors font-normal">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/collections" className="hover:text-[#F5CE7A] transition-colors font-normal">
                All Collections
              </Link>
            </li>
          </Col>

          {/* Column 2: Customer Care */}
          <Col title="Customer Care">
            <li>
              <Link to="/contact-information" className="hover:text-[#F5CE7A] transition-colors font-normal">
                Contact &amp; Help Desk
              </Link>
            </li>
            <li>
              <Link to="/shipping-policy" className="hover:text-[#F5CE7A] transition-colors font-normal">
                Shipping &amp; Delivery
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" className="hover:text-[#F5CE7A] transition-colors font-normal">
                7-Day Returns &amp; Exchange
              </Link>
            </li>
            <li>
              <Link to="/guides" className="hover:text-[#F5CE7A] transition-colors font-normal">
                Saree Guides &amp; Care
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-[#F5CE7A] transition-colors font-normal">
                Frequently Asked Questions
              </Link>
            </li>
          </Col>

          {/* Column 3: Contact Details */}
          <Col title="Flagship Boutique">
            <li className="flex items-center justify-center md:justify-start gap-2 text-white/95 font-medium">
              <Phone className="h-4 w-4 text-[#F5CE7A] shrink-0" />
              <a href={`tel:${SITE.phone}`} className="hover:text-[#F5CE7A] transition-colors">
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-center justify-center md:justify-start gap-2 text-white/95 font-medium">
              <Mail className="h-4 w-4 text-[#F5CE7A] shrink-0" />
              <a href={`mailto:${SITE.email}`} className="hover:text-[#F5CE7A] transition-colors">
                {SITE.email}
              </a>
            </li>
            <li className="text-xs text-white/80 mt-2 leading-relaxed text-center md:text-left">
              <span className="font-bold text-[#F5CE7A] flex items-center justify-center md:justify-start gap-1">
                <MapPin className="h-3.5 w-3.5" /> Nalasopara East (Flagship)
              </span>
              {SITE.address.street}, {SITE.address.city}, MH {SITE.address.postalCode}
              <br />
              Mon – Sat: 10:00 AM – 8:00 PM
            </li>
          </Col>
        </div>

        {/* Store network — Centered on mobile */}
        <div className="mt-12 border-t border-white/15 pt-6 text-center md:text-left">
          <h4 className="font-serif text-sm text-[#F5CE7A] font-bold tracking-wide">
            Our 8 Stores Across Western Mumbai
          </h4>
          <ul className="mt-3 flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 text-xs text-white/85 font-normal">
            {PUBLISHED_OUTLETS.map((o) => (
              <li key={o.slug}>
                <Link
                  to="/stores/$slug"
                  params={{ slug: o.slug }}
                  className="hover:text-[#F5CE7A] transition-colors underline-offset-4 hover:underline"
                >
                  Saree Shop in {o.area}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/stores" className="text-[#F5CE7A] hover:underline transition-colors font-bold">
                View all 8 store locations →
              </Link>
            </li>
          </ul>
        </div>

        {/* Bottom copyright & legal — Centered on mobile */}
        <div className="mt-10 flex flex-col items-center text-center md:flex-row md:items-center md:justify-between gap-4 border-t border-white/15 pt-6 text-xs text-white/80">
          <p>
            © {new Date().getFullYear()} Mumbai Bazar. All rights reserved.
            {" · "}
            <span className="text-white/65">
              Handcrafted ethnic wear from India's master weaving clusters.
            </span>
          </p>

          <div className="flex flex-wrap justify-center md:justify-end gap-3 sm:gap-6 text-[11px] sm:text-xs">
            <Link to="/privacy-policy" className="hover:text-[#F5CE7A] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-[#F5CE7A] transition-colors">
              Terms of Service
            </Link>
            <Link to="/refund-policy" className="hover:text-[#F5CE7A] transition-colors">
              Refund Policy
            </Link>
            <Link to="/shipping-policy" className="hover:text-[#F5CE7A] transition-colors">
              Shipping Policy
            </Link>
            <Link to="/legal-notice" className="hover:text-[#F5CE7A] transition-colors">
              Legal Notice
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
