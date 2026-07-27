import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Phone, Mail } from "lucide-react";
import { NAV } from "@/lib/site-data";

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
              <img src="/logo.png" alt="Mumbai Bazar Logo" className="h-16 md:h-20 object-contain -ml-2 brightness-0 invert" />
            </div>
            <p className="mt-1 text-[10px] tracking-[0.35em] uppercase text-gold font-medium">
              Sarees · Since Tradition
            </p>
            <p className="mt-5 max-w-sm text-sm text-ivory/90 leading-relaxed">
              A modern boutique for heirloom and everyday sarees — handwoven with care, delivered with warmth, across India and beyond.
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
                <Link to={n.to} className="hover:text-gold transition-colors">{n.label}</Link>
              </li>
            ))}
          </Col>

          <Col title="Customer Care">
            <li><Link to="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
            <li><Link to="/shipping-returns" className="hover:text-gold transition-colors">Shipping Information</Link></li>
            <li><Link to="/shipping-returns" className="hover:text-gold transition-colors">Returns & Exchanges</Link></li>
            <li><Link to="/care-guide" className="hover:text-gold transition-colors">Saree Care Guide</Link></li>
            <li><Link to="/faq" className="hover:text-gold transition-colors">FAQ</Link></li>
          </Col>

          <Col title="Contact Us">
            <li className="flex items-center gap-2 text-ivory/95">
              <Phone className="h-3.5 w-3.5 text-gold shrink-0" />
              <span>+91 98200 00000</span>
            </li>
            <li className="flex items-center gap-2 text-ivory/95">
              <Mail className="h-3.5 w-3.5 text-gold shrink-0" />
              <span>care@mumbaiBazar.in</span>
            </li>
            <li className="text-xs text-ivory/85 mt-2">
              Boutique Studio: Mumbai, India<br />Mon – Sat: 10:00 AM – 8:00 PM
            </li>
          </Col>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-gold/50 pt-6 text-xs text-ivory/85 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Mumbai Bazar. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <Link to="/shipping-returns" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link to="/shipping-returns" className="hover:text-gold transition-colors">Terms & Conditions</Link>
            <Link to="/faq" className="hover:text-gold transition-colors">Secure Payments</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
