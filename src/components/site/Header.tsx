import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useRouterState } from "@tanstack/react-router";
import { Search, User, ShoppingBag, Menu, X, Phone, Heart, ChevronDown, Sparkles, ChevronRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useFocusTrap } from "@/hooks/use-focus-trap";

const PRIMARY_LEFT = [
  { label: "Shop", to: "/shop" },
  { label: "Collections", to: "/collections" },
  { label: "Our Story", to: "/our-story" },
  { label: "Contact", to: "/contact" },
] as const;

type SubItem = { label: string; to: string; badge?: string };
type SubGroup = { title: string; items: SubItem[] };
type MegaMenu = {
  label: string;
  to: string;
  badge?: string;
  groups: SubGroup[];
  featured?: {
    tag: string;
    title: string;
    desc: string;
    to: string;
  };
};

const MEGA_CATEGORIES: MegaMenu[] = [
  {
    label: "New Arrivals",
    to: "/new-arrivals",
    badge: "Fresh",
    groups: [
      {
        title: "Trending Drops",
        items: [
          { label: "1-Minute Ready-to-Wear", to: "/everyday-sarees", badge: "Viral" },
          { label: "Latest Banarasi Silk Drops", to: "/silk-sarees" },
          { label: "Fresh Kanjivaram Bridal", to: "/wedding-sarees" },
          { label: "Celebrity & Reel Trends", to: "/festive-edit" },
        ],
      },
      {
        title: "Shop By Price",
        items: [
          { label: "Under ₹2,999 Best Buys", to: "/shop" },
          { label: "Festive Luxury (₹3k - ₹10k)", to: "/shop" },
          { label: "Royal Heirloom (₹10k+)", to: "/shop" },
          { label: "View All New In", to: "/new-arrivals" },
        ],
      },
    ],
    featured: {
      tag: "Fresh From Loom",
      title: "Royal Festive Drop",
      desc: "Pure Banarasi & Kanjivaram drapes freshly woven for celebrations.",
      to: "/new-arrivals",
    },
  },
  {
    label: "Ready to Wear",
    to: "/everyday-sarees",
    badge: "1-Min",
    groups: [
      {
        title: "1-Minute Sarees",
        items: [
          { label: "Pre-Stitched with Pocket", to: "/everyday-sarees", badge: "Trending" },
          { label: "1-Minute Silk Drapes", to: "/everyday-sarees" },
          { label: "Party & Cocktail Pre-Drapes", to: "/festive-edit" },
          { label: "Farewell & Event Specials", to: "/everyday-sarees" },
        ],
      },
      {
        title: "Why Ready-to-Wear?",
        items: [
          { label: "Zero Pleating Required", to: "/everyday-sarees" },
          { label: "Custom Waist Sizing", to: "/everyday-sarees" },
          { label: "Bespoke Blouse Stitching", to: "/everyday-sarees" },
          { label: "Explore All Ready-to-Wear", to: "/everyday-sarees" },
        ],
      },
    ],
    featured: {
      tag: "No Draping Stress",
      title: "1-Minute Saree with Pocket",
      desc: "Slip on, clip the pallu, and step out in 60 seconds flat.",
      to: "/everyday-sarees",
    },
  },
  {
    label: "Wedding & Bridal",
    to: "/wedding-sarees",
    groups: [
      {
        title: "The Wedding Edit",
        items: [
          { label: "Bridal Pheras (Crimson & Gold)", to: "/wedding-sarees" },
          { label: "Royal Reception Statements", to: "/wedding-sarees" },
          { label: "Sangeet & Cocktail Silks", to: "/festive-edit" },
          { label: "Haldi & Mehendi Yellows", to: "/wedding-sarees" },
        ],
      },
      {
        title: "Trousseau Curation",
        items: [
          { label: "Custom Bridal Trousseau Box", to: "/wedding-sarees" },
          { label: "Mother of the Bride Edits", to: "/wedding-sarees" },
          { label: "Bridesmaid Silk Coordinates", to: "/wedding-sarees" },
          { label: "Book Personal Stylist Call", to: "/contact" },
        ],
      },
    ],
    featured: {
      tag: "Couture Bridal",
      title: "Handwoven Royal Trousseau",
      desc: "Pure zari brocades made to be cherished across generations.",
      to: "/wedding-sarees",
    },
  },
  {
    label: "Heritage Silks",
    to: "/silk-sarees",
    groups: [
      {
        title: "Iconic Weaves",
        items: [
          { label: "Pure Katan Banarasi", to: "/silk-sarees" },
          { label: "Kanjivaram Temple Borders", to: "/silk-sarees" },
          { label: "Paithani & Maharashtra Weaves", to: "/silk-sarees" },
          { label: "Chanderi & Handloom Tissue", to: "/silk-sarees" },
        ],
      },
      {
        title: "Purity & Craft",
        items: [
          { label: "100% Silk Mark Certified", to: "/silk-sarees" },
          { label: "Handloom Master Weavers", to: "/our-story" },
          { label: "Care & Preservation Guide", to: "/care-guide" },
          { label: "View Complete Silk Archive", to: "/silk-sarees" },
        ],
      },
    ],
    featured: {
      tag: "Varanasi & Kanchipuram",
      title: "Master Artisan Weaves",
      desc: "Each authentic drape takes up to 40 days on wooden pit looms.",
      to: "/silk-sarees",
    },
  },
  {
    label: "Festive Edit",
    to: "/festive-edit",
    groups: [
      {
        title: "Occasions",
        items: [
          { label: "Diwali & Karwa Chauth Special", to: "/festive-edit", badge: "Festive" },
          { label: "Temple & Puja Silks", to: "/festive-edit" },
          { label: "Metallic Tissue & Organza", to: "/festive-edit" },
          { label: "Evening Gala & Cocktail Drapes", to: "/festive-edit" },
        ],
      },
      {
        title: "Gifting & Heirlooms",
        items: [
          { label: "Luxury Saree Gift Sets", to: "/festive-edit" },
          { label: "Complimentary Festive Packaging", to: "/festive-edit" },
          { label: "Express 48-Hour Dispatch", to: "/shipping-returns" },
          { label: "Browse All Festive Drapes", to: "/festive-edit" },
        ],
      },
    ],
    featured: {
      tag: "Celebration Ready",
      title: "Jewel Toned Silks",
      desc: "Radiant rubies, emeralds, and liquid gold metallic drapes.",
      to: "/festive-edit",
    },
  },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>("New Arrivals");
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { count: cartCount, openCart } = useCart();
  const { wishlist, openWishlist } = useWishlist();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const drawerRef = useFocusTrap<HTMLDivElement>(open);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  useEffect(() => {
    setMounted(true);
    const handleOpenDrawer = () => setOpen(true);
    window.addEventListener("mb:open-drawer", handleOpenDrawer);
    return () => window.removeEventListener("mb:open-drawer", handleOpenDrawer);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 12);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const linkBase =
    "relative text-[11px] font-medium uppercase tracking-[0.18em] text-ink/80 transition-colors hover:text-maroon";
  const activeLink =
    "text-maroon after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-maroon";

  return (
    <header
      data-scrolled={scrolled ? "true" : "false"}
      className={`sticky top-0 z-40 border-b border-gold/50 bg-ivory/95 backdrop-blur-md transition-[box-shadow,background-color] duration-300 ease-out ${
        scrolled
          ? "shadow-[0_8px_24px_-14px_rgba(100,31,42,0.22)]"
          : "shadow-none"
      }`}
    >
      {/* Main navigation row */}
      <div
        className={`mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 transition-[padding] duration-300 ease-out md:px-8 lg:px-10 ${
          scrolled ? "py-1.5" : "py-2 sm:py-2.5"
        }`}
      >
        {/* Left: primary links (desktop) */}
        <nav className="hidden lg:flex flex-1 items-center gap-8" aria-label="Primary">
          {PRIMARY_LEFT.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/shop" ? false : true }}
              className={`${linkBase} ${pathname === item.to || pathname.startsWith(item.to) ? activeLink : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            className="-ml-1 grid h-9 w-9 place-items-center text-ink transition-colors hover:text-maroon"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Center: logo with brand subtitle */}
        <Link
          to="/"
          aria-label="Mumbai Bazar — home"
          className="group flex flex-col items-center justify-center py-0.5"
        >
          <img
            src="/logo.png"
            alt="Mumbai Bazar"
            className={`transition-all duration-300 ease-out object-contain ${
              scrolled ? "h-9 md:h-10" : "h-11 sm:h-12 md:h-12"
            }`}
          />
          <span className="mt-0.5 text-[8.5px] sm:text-[9px] font-medium uppercase tracking-[0.32em] text-taupe/90 transition-colors duration-300 group-hover:text-maroon">
            Mumbai Bazar
          </span>
        </Link>

        {/* Right: search + actions */}
        <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
          {/* Desktop expanding search */}
          <div className="relative hidden md:block">
            <div
              className={`flex items-center overflow-hidden rounded-full border transition-all duration-300 ease-out ${
                searchOpen
                  ? "w-64 border-gold/50 bg-white/90 shadow-sm"
                  : "w-11 border-transparent bg-transparent"
              }`}
            >
              <button
                onClick={() => setSearchOpen(true)}
                className="grid h-9 w-11 shrink-0 place-items-center text-ink/70 hover:text-maroon"
                aria-label="Search"
              >
                <Search className="h-[18px] w-[18px]" />
              </button>
              <input
                ref={searchInputRef}
                type="search"
                placeholder="Search sarees, weaves, occasions…"
                className={`h-9 flex-1 bg-transparent text-sm text-ink placeholder:text-taupe/60 focus:outline-none ${
                  searchOpen ? "w-full pr-3 opacity-100" : "w-0 opacity-0"
                }`}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearchOpen(false);
                }}
              />
              {searchOpen && (
                <button
                  onClick={() => setSearchOpen(false)}
                  className="mr-2 text-taupe hover:text-maroon"
                  aria-label="Close search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile search toggle */}
          <button
            onClick={() => setSearchOpen((s) => !s)}
            className="grid h-9 w-9 place-items-center text-ink/80 hover:text-maroon md:hidden"
            aria-label="Search"
            aria-expanded={searchOpen}
          >
            <Search className="h-[18px] w-[18px]" />
          </button>

          <button
            className="hidden md:grid h-9 w-9 place-items-center text-ink/80 hover:text-maroon"
            aria-label="Account"
          >
            <User className="h-[18px] w-[18px]" />
          </button>

          <button
            onClick={openWishlist}
            className="relative grid h-9 w-9 place-items-center text-ink/80 hover:text-maroon"
            aria-label={`Wishlist, ${wishlist.length} saved`}
          >
            <Heart className="h-[18px] w-[18px]" />
            {wishlist.length > 0 && (
              <span className="absolute right-0.5 top-0.5 grid h-4 w-4 place-items-center rounded-full bg-gold-deep text-[9px] font-bold text-ivory">
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            onClick={openCart}
            className="relative grid h-9 w-9 place-items-center text-ink/80 hover:text-maroon"
            aria-label={`Shopping bag, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {cartCount > 0 && (
              <span className="absolute right-0.5 top-0.5 grid h-4 w-4 place-items-center rounded-full bg-maroon text-[9px] font-medium text-ivory">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Row with Interactive Mega Dropdowns (Desktop) */}
      <div className="hidden border-t border-gold/40 lg:block relative">
        <nav
          className="mx-auto flex max-w-[1400px] items-center justify-center gap-9 px-4 py-1.5"
          aria-label="Categories"
        >
          {MEGA_CATEGORIES.map((cat) => {
            const isDropdownOpen = activeDropdown === cat.label;
            const isCurrentPage = pathname === cat.to || pathname.startsWith(cat.to);

            return (
              <div
                key={cat.label}
                className="group relative py-1"
                onMouseEnter={() => handleMouseEnter(cat.label)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={cat.to}
                  className={`inline-flex items-center gap-2 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.16em] transition-colors py-1.5 ${
                    isCurrentPage ? "text-maroon font-bold" : "text-ink/80 group-hover:text-maroon hover:text-maroon"
                  }`}
                >
                  <span>{cat.label}</span>
                  {cat.badge && (
                    <span className="rounded-full bg-maroon px-2 py-0.5 text-[8.5px] font-bold tracking-wider text-ivory">
                      {cat.badge}
                    </span>
                  )}
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-taupe/80 transition-transform duration-200 group-hover:rotate-180 group-hover:text-maroon ${
                      isDropdownOpen ? "rotate-180 text-maroon" : ""
                    }`}
                  />
                </Link>

                {/* Mega Dropdown Menu (Wide 820px, large readable text, instant CSS group-hover & state) */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 w-[820px] transition-all duration-200 ${
                    isDropdownOpen
                      ? "opacity-100 pointer-events-auto translate-y-0"
                      : "opacity-0 pointer-events-none -translate-y-1 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0"
                  }`}
                  onMouseEnter={() => handleMouseEnter(cat.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="rounded-2xl border border-gold/50 bg-ivory/98 p-7 shadow-[0_20px_50px_rgba(66,23,30,0.18)] backdrop-blur-2xl">
                    <div className="grid grid-cols-3 gap-8">
                      {/* Subcategory Columns */}
                      {cat.groups.map((group) => (
                        <div key={group.title} className="space-y-4">
                          <h4 className="border-b border-gold/40 pb-2 text-xs font-bold uppercase tracking-[0.2em] text-maroon">
                            {group.title}
                          </h4>
                          <ul className="space-y-2.5">
                            {group.items.map((sub) => (
                              <li key={sub.label}>
                                <Link
                                  to={sub.to}
                                  className="group/item flex items-center justify-between text-sm font-medium text-ink/85 transition-colors hover:text-maroon hover:font-semibold"
                                >
                                  <span className="group-hover/item:translate-x-1 transition-transform duration-150">
                                    {sub.label}
                                  </span>
                                  {sub.badge && (
                                    <span className="rounded bg-gold/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-maroon">
                                      {sub.badge}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      {/* Featured Spotlight Card */}
                      {cat.featured && (
                        <div className="rounded-xl border border-gold/40 bg-gradient-to-br from-beige/50 via-ivory to-beige/30 p-5 flex flex-col justify-between shadow-sm">
                          <div>
                            <span className="inline-block rounded-full bg-maroon/10 border border-maroon/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-maroon">
                              {cat.featured.tag}
                            </span>
                            <h5 className="mt-3 font-serif text-base font-bold text-ink leading-snug">
                              {cat.featured.title}
                            </h5>
                            <p className="mt-2 text-xs text-taupe leading-relaxed">
                              {cat.featured.desc}
                            </p>
                          </div>
                          <Link
                            to={cat.featured.to}
                            className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-maroon hover:underline"
                          >
                            Explore Now <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Search overlay (mobile) */}
      {searchOpen && (
        <div className="border-t border-gold/50 bg-ivory/95 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-taupe" />
            <input
              autoFocus
              type="search"
              placeholder="Search sarees, weaves, bridal…"
              className="w-full bg-transparent text-sm text-ink placeholder:text-taupe focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Escape") setSearchOpen(false);
              }}
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="text-xs uppercase tracking-wider text-maroon font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer (App-like layout modeled after top ethnic brands) */}
      {mounted &&
        createPortal(
          <div
            id="mobile-drawer"
            className={`fixed inset-0 z-[999999] lg:hidden transition-all duration-300 ${
              open ? "pointer-events-auto" : "pointer-events-none"
            }`}
            aria-hidden={!open}
          >
            {/* Backdrop */}
            <div
              className={`absolute inset-0 bg-ink/60 backdrop-blur-sm transition-opacity duration-300 ${
                open ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => setOpen(false)}
            />

            {/* Slide-over Content Drawer */}
            <div
              ref={drawerRef}
              className={`absolute inset-y-0 left-0 w-[88vw] max-w-[360px] bg-ivory shadow-2xl flex flex-col transition-transform duration-300 ease-out border-r border-gold/40 ${
                open ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              {/* App Drawer Top Header */}
              <div className="flex items-center justify-between border-b border-gold/40 bg-wine px-5 py-4 text-ivory">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="Mumbai Bazar" className="h-8 w-auto object-contain brightness-0 invert" />
                  <div>
                    <h3 className="font-serif text-sm font-semibold tracking-wide text-ivory">Mumbai Bazar</h3>
                    <p className="text-[9px] uppercase tracking-[0.25em] text-gold/90">Heritage Silk Couture</p>
                  </div>
                </div>
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-ivory hover:bg-white/20 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* In-drawer Search Bar */}
              <div className="border-b border-gold/30 bg-beige/30 p-3">
                <div className="flex items-center gap-2 rounded-xl border border-gold/40 bg-ivory px-3 py-2 shadow-inner">
                  <Search className="h-4 w-4 text-taupe/70" />
                  <input
                    type="search"
                    placeholder="Search 1-minute, Banarasi, bridal..."
                    className="w-full bg-transparent text-xs text-ink placeholder:text-taupe/70 focus:outline-none"
                  />
                </div>
              </div>

              {/* Drawer Scrollable Navigation */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-5 bg-ivory text-ink" aria-label="Mobile primary">
                {/* Categories Accordion Section */}
                <div>
                  <div className="flex items-center justify-between border-b border-gold/40 pb-2 mb-3">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-maroon">
                      Shop Categories
                    </p>
                    <span className="text-[10px] font-semibold text-taupe uppercase tracking-wider">All Weaves</span>
                  </div>

                  <div className="flex flex-col space-y-2.5">
                    {MEGA_CATEGORIES.map((cat) => {
                      const isExpanded = mobileExpandedCat === cat.label;
                      return (
                        <div
                          key={cat.label}
                          className="rounded-xl border border-gold/30 bg-ivory/80 overflow-hidden shadow-sm transition-all"
                        >
                          <button
                            onClick={() => setMobileExpandedCat(isExpanded ? null : cat.label)}
                            className="w-full flex items-center justify-between py-3 px-4 text-xs font-bold uppercase tracking-wider text-ink hover:text-maroon transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-sm font-serif font-semibold">{cat.label}</span>
                              {cat.badge && (
                                <span className="rounded-full bg-maroon px-2 py-0.5 text-[8.5px] font-bold text-ivory">
                                  {cat.badge}
                                </span>
                              )}
                            </div>
                            <ChevronDown
                              className={`h-4 w-4 text-taupe transition-transform duration-200 ${
                                isExpanded ? "rotate-180 text-maroon" : ""
                              }`}
                            />
                          </button>

                          {isExpanded && (
                            <div className="border-t border-gold/25 bg-beige/20 px-4 py-3 space-y-3.5">
                              {cat.groups.map((group) => (
                                <div key={group.title} className="space-y-2">
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-maroon">
                                    {group.title}
                                  </p>
                                  <ul className="space-y-1.5 pl-2 border-l border-gold/30">
                                    {group.items.map((sub) => (
                                      <li key={sub.label}>
                                        <Link
                                          to={sub.to}
                                          onClick={() => setOpen(false)}
                                          className="flex items-center justify-between py-1.5 text-[13px] font-medium text-ink/85 hover:text-maroon transition-colors"
                                        >
                                          <span>{sub.label}</span>
                                          {sub.badge && (
                                            <span className="rounded bg-gold/30 px-1.5 py-0.5 text-[8.5px] font-bold text-maroon">
                                              {sub.badge}
                                            </span>
                                          )}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                              <div className="pt-2 border-t border-gold/30">
                                <Link
                                  to={cat.to}
                                  onClick={() => setOpen(false)}
                                  className="text-xs font-bold uppercase tracking-widest text-maroon hover:underline flex items-center justify-between"
                                >
                                  <span>View All {cat.label}</span>
                                  <ChevronRight className="h-3.5 w-3.5" />
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Primary Site Pages */}
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-maroon border-b border-gold/40 pb-1.5">
                    Explore Mumbai Bazar
                  </p>
                  <ul className="grid grid-cols-2 gap-2 pt-1">
                    <li>
                      <Link
                        to="/"
                        onClick={() => setOpen(false)}
                        className={`flex items-center justify-center py-2.5 px-3 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors text-center border ${
                          pathname === "/"
                            ? "border-maroon bg-maroon text-ivory shadow-sm"
                            : "border-gold/30 bg-ivory text-ink/80 hover:border-maroon hover:text-maroon"
                        }`}
                      >
                        Home
                      </Link>
                    </li>
                    {PRIMARY_LEFT.map((item) => (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          onClick={() => setOpen(false)}
                          className={`flex items-center justify-center py-2.5 px-3 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors text-center border ${
                            pathname === item.to || pathname.startsWith(item.to)
                              ? "border-maroon bg-maroon text-ivory shadow-sm"
                              : "border-gold/30 bg-ivory text-ink/80 hover:border-maroon hover:text-maroon"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick App Actions & Concierge */}
                <div className="border-t border-gold/40 pt-4 space-y-2.5">
                  <a
                    href="https://wa.me/919999999999?text=Hi%20Mumbai%20Bazar"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-700 text-ivory text-xs font-bold uppercase tracking-wider hover:bg-emerald-800 transition-all shadow-sm"
                  >
                    <Phone className="h-4 w-4" /> WhatsApp Personal Stylist
                  </a>
                  <button
                    onClick={() => {
                      setOpen(false);
                      openWishlist();
                    }}
                    className="flex w-full items-center justify-between px-4 py-2.5 rounded-xl border border-gold/40 text-xs font-bold uppercase tracking-wider text-ink hover:bg-maroon hover:text-ivory transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-maroon" /> My Wishlist
                    </span>
                    <span className="rounded-full bg-gold/30 px-2 py-0.5 text-[10px] text-maroon font-bold">
                      {wishlist.length}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setOpen(false);
                      openCart();
                    }}
                    className="flex w-full items-center justify-between px-4 py-2.5 rounded-xl bg-maroon text-ivory text-xs font-bold uppercase tracking-wider hover:bg-wine transition-all shadow-md"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" /> View Bag
                    </span>
                    <span className="rounded-full bg-ivory/20 px-2 py-0.5 text-[10px] text-ivory font-bold">
                      {cartCount}
                    </span>
                  </button>
                </div>
              </nav>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
