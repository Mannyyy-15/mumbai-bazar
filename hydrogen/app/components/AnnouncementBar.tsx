import { Link } from 'react-router';

interface AnnouncementItem {
  text: string;
  href?: string;
  highlight?: boolean;
}

const ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    text: 'FESTIVE MEGA SALE LIVE — UP TO 60% OFF SITEWIDE',
    href: '/collections/all-products',
    highlight: true,
  },
  {
    text: 'COMPLIMENTARY EXPRESS SHIPPING ACROSS ALL ORDERS IN INDIA',
    highlight: false,
  },
  {
    text: 'CASH ON DELIVERY (COD) AVAILABLE NATIONWIDE',
    highlight: false,
  },
  {
    text: 'AUTHENTIC HANDCRAFTED PURE SILK & BRIDAL SAREES',
    href: '/collections/banarasi-silk',
    highlight: false,
  },
  {
    text: '8 LUXURY STORES ACROSS MUMBAI · SHOPPING ONLINE & IN-STORE',
    href: '/stores',
    highlight: false,
  },
  {
    text: 'EASY 7-DAY REPLACEMENTS & 100% QUALITY ASSURED',
    highlight: false,
  },
];

export function AnnouncementBar() {
  return (
    <div
      role="region"
      aria-label="Announcements"
      className="web-only w-full bg-maroon text-ivory py-2 overflow-hidden border-b border-gold/30 marquee-pause select-none"
    >
      <div className="flex animate-infinite-marquee">
        {/* Track 1 */}
        <div className="flex items-center shrink-0">
          {ANNOUNCEMENTS.map((item, idx) => (
            <div key={`ann-1-${idx}`} className="flex items-center shrink-0 px-6 sm:px-9">
              {item.highlight && (
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse mr-2.5 shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              )}
              {item.href ? (
                <Link
                  to={item.href}
                  className={`text-[10px] sm:text-[11px] font-semibold tracking-[0.20em] uppercase transition-colors whitespace-nowrap ${
                    item.highlight ? 'text-amber-200 hover:text-white' : 'text-ivory/95 hover:text-gold'
                  }`}
                >
                  {item.text}
                </Link>
              ) : (
                <span
                  className={`text-[10px] sm:text-[11px] font-semibold tracking-[0.20em] uppercase whitespace-nowrap ${
                    item.highlight ? 'text-amber-200' : 'text-ivory/95'
                  }`}
                >
                  {item.text}
                </span>
              )}
              <span className="ml-6 sm:ml-9 text-gold/70 text-xs select-none">✦</span>
            </div>
          ))}
        </div>

        {/* Track 2 (Exact duplicate for zero-stutter seamless loop) */}
        <div className="flex items-center shrink-0" aria-hidden="true">
          {ANNOUNCEMENTS.map((item, idx) => (
            <div key={`ann-2-${idx}`} className="flex items-center shrink-0 px-6 sm:px-9">
              {item.highlight && (
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse mr-2.5 shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              )}
              {item.href ? (
                <Link
                  to={item.href}
                  tabIndex={-1}
                  className={`text-[10px] sm:text-[11px] font-semibold tracking-[0.20em] uppercase transition-colors whitespace-nowrap ${
                    item.highlight ? 'text-amber-200 hover:text-white' : 'text-ivory/95 hover:text-gold'
                  }`}
                >
                  {item.text}
                </Link>
              ) : (
                <span
                  className={`text-[10px] sm:text-[11px] font-semibold tracking-[0.20em] uppercase whitespace-nowrap ${
                    item.highlight ? 'text-amber-200' : 'text-ivory/95'
                  }`}
                >
                  {item.text}
                </span>
              )}
              <span className="ml-6 sm:ml-9 text-gold/70 text-xs select-none">✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
