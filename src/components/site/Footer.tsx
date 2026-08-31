import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { NAV } from "@/lib/site-data";
import { PUBLISHED_OUTLETS } from "@/lib/locations";
import { SITE } from "@/lib/seo";

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 flex flex-col items-center md:items-start text-center md:text-left">
      <h4 className="font-serif text-lg text-gold font-bold tracking-wide">{title}</h4>
      <ul className="mt-4 space-y-3 text-sm text-ivory/95 break-words flex flex-col items-center md:items-start w-full">
        {children}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-maroon text-ivory border-t border-gold/50 relative">
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
            <p className="mt-1 text-[10px] tracking-[0.35em] uppercase text-gold font-bold">
              Sarees · Since 2009
            </p>
            <p className="mt-4 max-w-sm text-sm text-ivory/90 leading-relaxed font-medium">
              Handcrafted Banarasi, Kanjivaram, and bridal sarees across 8 retail boutiques in Mumbai
              — chosen with care, delivered with warmth.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex items-center justify-center md:justify-start gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="h-9 w-9 rounded-full border border-gold/40 flex items-center justify-center text-ivory hover:text-gold hover:border-gold hover:bg-gold/10 transition-all shadow-sm"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="h-9 w-9 rounded-full border border-gold/40 flex items-center justify-center text-ivory hover:text-gold hover:border-gold hover:bg-gold/10 transition-all shadow-sm"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="h-9 w-9 rounded-full border border-gold/40 flex items-center justify-center text-ivory hover:text-gold hover:border-gold hover:bg-gold/10 transition-all shadow-sm"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Shop */}
          <Col title="Shop Collections">
            {NAV.slice(0, 5).map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-gold transition-colors font-medium">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/collections" className="hover:text-gold transition-colors font-medium">
                All Collections
              </Link>
            </li>
          </Col>

          {/* Column 2: Customer Care */}
          <Col title="Customer Care">
            <li>
              <Link to="/contact-information" className="hover:text-gold transition-colors font-medium">
                Contact &amp; Help Desk
              </Link>
            </li>
            <li>
              <Link to="/shipping-policy" className="hover:text-gold transition-colors font-medium">
                Shipping &amp; Delivery
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" className="hover:text-gold transition-colors font-medium">
                7-Day Returns &amp; Exchange
              </Link>
            </li>
            <li>
              <Link to="/guides" className="hover:text-gold transition-colors font-medium">
                Saree Guides &amp; Care
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-gold transition-colors font-medium">
                Frequently Asked Questions
              </Link>
            </li>
          </Col>

          {/* Column 3: Contact Details */}
          <Col title="Flagship Boutique">
            <li className="flex items-center justify-center md:justify-start gap-2 text-ivory/95 font-medium">
              <Phone className="h-3.5 w-3.5 text-gold shrink-0" />
              <a href={`tel:${SITE.phone}`} className="hover:text-gold transition-colors">
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-center justify-center md:justify-start gap-2 text-ivory/95 font-medium">
              <Mail className="h-3.5 w-3.5 text-gold shrink-0" />
              <a href={`mailto:${SITE.email}`} className="hover:text-gold transition-colors">
                {SITE.email}
              </a>
            </li>
            <li className="text-xs text-ivory/85 mt-2 leading-relaxed text-center md:text-left">
              <span className="font-bold text-gold flex items-center justify-center md:justify-start gap-1">
                <MapPin className="h-3 w-3" /> Nalasopara East (Flagship)
              </span>
              {SITE.address.street}, {SITE.address.city}, MH {SITE.address.postalCode}
              <br />
              Mon – Sat: 10:00 AM – 8:00 PM
            </li>
          </Col>
        </div>

        {/* Store network — Centered on mobile */}
        <div className="mt-12 border-t border-gold/30 pt-6 text-center md:text-left">
          <h4 className="font-serif text-sm text-gold font-bold tracking-wide">
            Our 8 Stores Across Western Mumbai
          </h4>
          <ul className="mt-3 flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 text-xs text-ivory/85 font-medium">
            {PUBLISHED_OUTLETS.map((o) => (
              <li key={o.slug}>
                <Link
                  to="/stores/$slug"
                  params={{ slug: o.slug }}
                  className="hover:text-gold transition-colors underline-offset-4 hover:underline"
                >
                  Saree Shop in {o.area}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/stores" className="hover:text-gold transition-colors font-bold">
                View all 8 store locations →
              </Link>
            </li>
          </ul>
        </div>

        {/* Bottom copyright & legal — Centered on mobile */}
        <div className="mt-10 flex flex-col items-center text-center md:flex-row md:items-center md:justify-between gap-4 border-t border-gold/50 pt-6 text-xs text-ivory/85">
          <p>
            © {new Date().getFullYear()} Mumbai Bazar. All rights reserved.
            {" · "}
            <span className="text-ivory/70">
              Crafted with authentic handlooms across India.
            </span>
          </p>

          <div className="flex flex-wrap justify-center md:justify-end gap-3 sm:gap-6 text-[11px] sm:text-xs">
            <Link to="/privacy-policy" className="hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-gold transition-colors">
              Terms of Service
            </Link>
            <Link to="/refund-policy" className="hover:text-gold transition-colors">
              Refund Policy
            </Link>
            <Link to="/shipping-policy" className="hover:text-gold transition-colors">
              Shipping Policy
            </Link>
            <Link to="/legal-notice" className="hover:text-gold transition-colors">
              Legal Notice
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
