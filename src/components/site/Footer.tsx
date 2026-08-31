import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Phone, Mail } from "lucide-react";
import { NAV } from "@/lib/site-data";
import { PUBLISHED_OUTLETS } from "@/lib/locations";
import { SITE } from "@/lib/seo";

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <h4 className="font-serif text-lg text-gold font-normal tracking-wide">{title}</h4>
      <ul className="mt-4 space-y-3 text-sm text-ivory/95 break-words">{children}</ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-maroon text-ivory border-t border-gold/50 relative">
      <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5 md:gap-8">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="Mumbai Bazar Logo"
                className="h-16 md:h-20 object-contain -ml-2 brightness-0 invert"
              />
            </div>
            <p className="mt-1 text-[10px] tracking-[0.35em] uppercase text-gold font-medium">
              Sarees · Since Tradition
            </p>
            <p className="mt-5 max-w-sm text-sm text-ivory/90 leading-relaxed">
              Sarees, lehengas and dress material across eight stores — chosen with care, delivered
              with warmth, across India and beyond.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="h-9 w-9 rounded-full border border-gold/40 flex items-center justify-center text-ivory hover:text-gold hover:border-gold hover:bg-gold/10 transition-all"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="h-9 w-9 rounded-full border border-gold/40 flex items-center justify-center text-ivory hover:text-gold hover:border-gold hover:bg-gold/10 transition-all"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="h-9 w-9 rounded-full border border-gold/40 flex items-center justify-center text-ivory hover:text-gold hover:border-gold hover:bg-gold/10 transition-all"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          <Col title="Shop">
            {NAV.slice(0, 5).map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-gold transition-colors">
                  {n.label}
                </Link>
              </li>
            ))}
          </Col>

          <Col title="Customer Care">
            <li>
              <Link to="/contact-information" className="hover:text-gold transition-colors">
                Contact &amp; Stores
              </Link>
            </li>
            <li>
              <Link to="/shipping-policy" className="hover:text-gold transition-colors">
                Shipping &amp; Delivery
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" className="hover:text-gold transition-colors">
                Returns &amp; Refunds
              </Link>
            </li>
            <li>
              <Link to="/guides" className="hover:text-gold transition-colors">
                Saree Guides
              </Link>
            </li>
            <li>
              <Link to="/care-guide" className="hover:text-gold transition-colors">
                Saree Care Guide
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-gold transition-colors">
                FAQ
              </Link>
            </li>
          </Col>

          <Col title="Contact Us">
            <li className="flex items-center gap-2 text-ivory/95">
              <Phone className="h-3.5 w-3.5 text-gold shrink-0" />
              <span>{SITE.phone}</span>
            </li>
            <li className="flex items-center gap-2 text-ivory/95">
              <Mail className="h-3.5 w-3.5 text-gold shrink-0" />
              <span>{SITE.email}</span>
            </li>
            <li className="text-xs text-ivory/85 mt-2">
              {SITE.address.street}
              <br />
              {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}
              <br />
              Mon – Sat: 10:00 AM – 8:00 PM
            </li>
          </Col>
        </div>

        {/* Store network — keeps every branch page internally linked rather than
            reachable only from the sitemap. */}
        <div className="mt-12 border-t border-gold/30 pt-6">
          <h4 className="font-serif text-sm text-gold font-normal tracking-wide">Our Stores</h4>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ivory/85">
            {PUBLISHED_OUTLETS.map((o) => (
              <li key={o.slug}>
                <Link
                  to="/stores/$slug"
                  params={{ slug: o.slug }}
                  className="hover:text-gold transition-colors"
                >
                  Saree Shop in {o.area}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/stores" className="hover:text-gold transition-colors">
                All stores →
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-gold/50 pt-6 text-xs text-ivory/85 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} Mumbai Bazar. All rights reserved.
            {" · "}
            {/* Studio credit. A real followed link — the agency's own domain
                authority benefits from it, and it is an honest attribution. */}
            <span className="text-ivory/70">
              Design &amp; SEO by{" "}
              <a
                href={SITE.agency.url}
                target="_blank"
                rel="noopener"
                className="underline decoration-gold/50 underline-offset-2 transition-colors hover:text-gold"
              >
                {SITE.agency.name}
              </a>
            </span>
          </p>
          <div className="flex flex-wrap gap-4 sm:gap-6 text-[11px] sm:text-xs">
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
