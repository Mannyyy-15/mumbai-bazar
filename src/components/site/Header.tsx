import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  Phone,
  Heart,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useFocusTrap } from "@/hooks/use-focus-trap";

const PRIMARY_LEFT = [
  { label: "Shop", to: "/shop" },
  { label: "Collections", to: "/collections" },
  { label: "Our Story", to: "/our-story" },
  { label: "Contact", to: "/contact" },
] as const;

type SubItem = { label: string; to: string };
type SubGroup = { title: string; items: SubItem[] };
type MegaMenu = {
  label: string;
  to: string;
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
    groups: [
      {
        title: "Trending Drops",
        items: [
          { label: "1-Minute Ready-to-Wear", to: "/everyday-sarees" },
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
    groups: [
      {
        title: "1-Minute Sarees",
        items: [
          { label: "Pre-Stitched with Pocket", to: "/everyday-sarees" },
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
          { label: "Silk & Silk-Blend Sarees", to: "/silk-sarees" },
          { label: "Our Story", to: "/our-story" },
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
          { label: "Diwali & Karwa Chauth Special", to: "/festive-edit" },
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

type MobileNavItem = {
  label: string;
  to?: string;
  subItems?: { label: string; to: string }[];
};

const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  { label: "Saree", to: "/shop" },
  { label: "Ready to Wear Sarees", to: "/everyday-sarees" },
  {
    label: "Wedding & Bridal",
    subItems: [
      { label: "Bridal Pheras", to: "/wedding-sarees" },
      { label: "Reception Sarees", to: "/wedding-sarees" },
      { label: "Sangeet & Cocktail Silks", to: "/festive-edit" },
      { label: "Haldi & Mehendi Yellows", to: "/wedding-sarees" },
      { label: "Custom Bridal Trousseau", to: "/wedding-sarees" },
      { label: "View All Wedding Sarees", to: "/wedding-sarees" },
    ],
  },
  {
    label: "Heritage Weaves",
    subItems: [
      { label: "Pure Katan Banarasi", to: "/silk-sarees" },
      { label: "Kanjivaram Temple Borders", to: "/silk-sarees" },
      { label: "Paithani & Maharashtra Weaves", to: "/silk-sarees" },
      { label: "Chanderi & Handloom Tissue", to: "/silk-sarees" },
      { label: "Silk & Silk-Blend Collection", to: "/silk-sarees" },
      { label: "View All Heritage Silks", to: "/silk-sarees" },
    ],
  },
  {
    label: "New Arrivals",
    subItems: [
      { label: "1-Minute Ready-to-Wear", to: "/everyday-sarees" },
      { label: "Latest Banarasi Silk Drops", to: "/silk-sarees" },
      { label: "Fresh Kanjivaram Bridal", to: "/wedding-sarees" },
      { label: "Under ₹2,999 Best Buys", to: "/shop" },
      { label: "Festive Luxury (₹3k - ₹10k)", to: "/shop" },
      { label: "Royal Heirloom (₹10k+)", to: "/shop" },
      { label: "View All New Arrivals", to: "/new-arrivals" },
    ],
  },
  {
    label: "Festive Edit",
    subItems: [
      { label: "Diwali & Karwa Chauth Special", to: "/festive-edit" },
      { label: "Temple & Puja Silks", to: "/festive-edit" },
      { label: "Metallic Tissue & Organza", to: "/festive-edit" },
      { label: "Evening Gala & Cocktail Drapes", to: "/festive-edit" },
      { label: "Luxury Saree Gift Sets", to: "/festive-edit" },
      { label: "Browse All Festive Sarees", to: "/festive-edit" },
    ],
  },
  { label: "Collections", to: "/collections" },
  { label: "Our Story", to: "/our-story" },
  { label: "Contact Us", to: "/contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<MobileNavItem | null>(null);
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
    setActiveSubMenu(null);
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
        scrolled ? "shadow-[0_8px_24px_-14px_rgba(100,31,42,0.22)]" : "shadow-none"
      }`}
    >
      {/* Main navigation row */}
      <div
        className={`mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 transition-[padding] duration-300 ease-out md:px-8 lg:px-10 ${
          scrolled ? "py-1.5" : "py-2 sm:py-2.5"
        }`}
      >
        {/* Left: primary links (desktop) */}
        <nav className="hidden lg:flex flex-1 items-center gap-4 xl:gap-8" aria-label="Primary">
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
          <span className="hidden md:inline-block mt-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-maroon transition-colors duration-300 group-hover:text-gold-deep">
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
                  ? "w-44 lg:w-52 xl:w-64 border-gold/50 bg-white/90 shadow-sm"
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
          className="mx-auto flex max-w-[1400px] items-center justify-center gap-4 lg:gap-6 xl:gap-9 px-4 py-1.5"
          aria-label="Categories"
        >
          {MEGA_CATEGORIES.map((cat, catIdx) => {
            const isDropdownOpen = activeDropdown === cat.label;
            const isCurrentPage = pathname === cat.to || pathname.startsWith(cat.to);

            // Smart alignment to ensure dropdown never goes out of frame:
            // - First item (New Arrivals) aligns to its left edge and opens inwards towards the right
            // - Second item (Ready to Wear) aligns left with gentle offset
            // - Last item (Festive Edit) aligns to its right edge and opens inwards towards the left
            // - Second to last (Heritage Silks) aligns right with gentle offset
            // - Center item (Wedding & Bridal) centers cleanly
            const total = MEGA_CATEGORIES.length;
            const alignmentCls =
              catIdx === 0
                ? "left-0 translate-x-0"
                : catIdx === 1
                  ? "left-0 xl:-left-6 translate-x-0"
                  : catIdx === total - 1
                    ? "right-0 left-auto translate-x-0"
                    : catIdx === total - 2
                      ? "right-0 xl:-right-6 left-auto translate-x-0"
                      : "left-1/2 -translate-x-1/2";

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
                    isCurrentPage
                      ? "text-maroon font-bold"
                      : "text-ink/80 group-hover:text-maroon hover:text-maroon"
                  }`}
                >
                  <span>{cat.label}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-taupe/80 transition-transform duration-200 group-hover:rotate-180 group-hover:text-maroon ${
                      isDropdownOpen ? "rotate-180 text-maroon" : ""
                    }`}
                  />
                </Link>

                {/* Mega Dropdown Menu (Smart-aligned, clamped to viewport, never overflows frame) */}
                <div
                  className={`absolute ${alignmentCls} top-full pt-2 z-50 w-[92vw] sm:w-[480px] lg:w-[500px] xl:w-[520px] max-w-[calc(100vw-2rem)] transition-all duration-200 ${
                    isDropdownOpen
                      ? "opacity-100 pointer-events-auto translate-y-0"
                      : "opacity-0 pointer-events-none -translate-y-1 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0"
                  }`}
                  onMouseEnter={() => handleMouseEnter(cat.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="rounded-2xl border border-gold/50 bg-ivory/98 p-6 shadow-[0_20px_50px_rgba(66,23,30,0.18)] backdrop-blur-2xl">
                    <div className="grid grid-cols-2 gap-8">
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
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
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

      {/* Mobile Drawer (Clean, Minimalist Sidebar matching user's exact specification) */}
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
              className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
                open ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => {
                setOpen(false);
                setActiveSubMenu(null);
              }}
            />

            {/* Slide-over Content Drawer */}
            <div
              ref={drawerRef}
              className={`absolute inset-y-0 left-0 w-[84vw] max-w-[340px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out border-r border-[#EAE6DF] ${
                open ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              {/* Drawer Top Bar */}
              <div className="flex items-center justify-between border-b border-[#EAE6DF] px-5 py-4 bg-white">
                {activeSubMenu ? (
                  <button
                    onClick={() => setActiveSubMenu(null)}
                    className="flex items-center gap-2.5 text-[#1A1A1A] hover:text-maroon text-[13.5px] font-medium"
                    aria-label="Back to main categories"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-[#CCC]">|</span>
                    <span>{activeSubMenu.label}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Mumbai Bazar" className="h-7 w-auto object-contain" />
                    <span className="text-xs font-serif font-bold uppercase tracking-[0.18em] text-[#1A1A1A]">
                      Mumbai Bazar
                    </span>
                  </div>
                )}
                <button
                  aria-label="Close menu"
                  onClick={() => {
                    setOpen(false);
                    setActiveSubMenu(null);
                  }}
                  className="grid h-8 w-8 place-items-center text-[#555] hover:text-maroon transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation List */}
              <div className="flex-1 overflow-y-auto bg-white">
                {activeSubMenu ? (
                  /* Sub-menu Category Items View */
                  <div className="divide-y divide-[#EAE6DF]">
                    {activeSubMenu.subItems?.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.to}
                        onClick={() => {
                          setOpen(false);
                          setActiveSubMenu(null);
                        }}
                        className="block px-5 py-4 text-[13.5px] text-[#222] hover:text-maroon hover:bg-[#FAF7F2] transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  /* Main Categories View */
                  <div className="divide-y divide-[#EAE6DF]">
                    {MOBILE_NAV_ITEMS.map((item) => {
                      if (item.subItems && item.subItems.length > 0) {
                        return (
                          <button
                            key={item.label}
                            onClick={() => setActiveSubMenu(item)}
                            className="w-full flex items-center justify-between px-5 py-4 text-left text-[13px] font-normal tracking-[0.06em] uppercase text-[#1A1A1A] hover:bg-[#FAF7F2] hover:text-maroon transition-colors"
                          >
                            <span>{item.label}</span>
                            <ArrowRight className="h-4 w-4 text-[#888]" />
                          </button>
                        );
                      }

                      return (
                        <Link
                          key={item.label}
                          to={item.to || "/"}
                          onClick={() => {
                            setOpen(false);
                            setActiveSubMenu(null);
                          }}
                          className="block px-5 py-4 text-[13px] font-normal tracking-[0.06em] uppercase text-[#1A1A1A] hover:bg-[#FAF7F2] hover:text-maroon transition-colors"
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Minimalist Bottom Assistance Link */}
              <div className="border-t border-[#EAE6DF] p-4 bg-[#FAF7F2]">
                <a
                  href="https://wa.me/919999999999?text=Hi%20Mumbai%20Bazar"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-maroon hover:underline py-1"
                >
                  <Phone className="h-3.5 w-3.5" /> Need Assistance? Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}
