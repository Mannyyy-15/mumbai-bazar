import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Search, User, ShoppingBag, Menu, X, Phone, Heart } from "lucide-react";
import { NAV } from "@/lib/site-data";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useFocusTrap } from "@/hooks/use-focus-trap";

const PRIMARY_LEFT = [
  { label: "Shop", to: "/shop" },
  { label: "Collections", to: "/collections" },
  { label: "Our Story", to: "/our-story" },
  { label: "Contact", to: "/contact" },
] as const;

const CATEGORY_ROW = NAV.filter((n) =>
  ["/new-arrivals", "/wedding-sarees", "/silk-sarees", "/festive-edit", "/everyday-sarees"].includes(n.to)
);

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count: cartCount, openCart } = useCart();
  const { wishlist, openWishlist } = useWishlist();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const drawerRef = useFocusTrap<HTMLDivElement>(open);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
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
      className={`sticky top-0 z-40 border-b border-gold/50 bg-ivory/85 backdrop-blur-md transition-[box-shadow,background-color,padding] duration-300 ease-out ${
        scrolled
          ? "shadow-[0_8px_24px_-14px_rgba(100,31,42,0.22)]"
          : "shadow-none"
      }`}
    >
      {/* Main navigation row */}
      <div
        className={`mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 transition-[padding] duration-300 ease-out md:px-8 lg:px-10 ${
          scrolled ? "py-2.5" : "py-3.5"
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

        {/* Mobile menu toggle + Logo area */}
        <div className="flex items-center gap-3 lg:hidden">
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

        {/* Center: logo */}
        <Link
          to="/"
          aria-label="Mumbai Bazar â€” home"
          className="group flex flex-col items-center justify-center"
        >
          <img src="/logo.png" alt="Mumbai Bazar Logo" className={`transition-all duration-300 ease-out object-contain ${scrolled ? "h-12 md:h-14" : "h-16 md:h-20 -my-2"}`} />
          <span
            className={`text-[9px] font-medium uppercase tracking-[0.35em] text-taupe/70 transition-all duration-300 group-hover:text-taupe ${
              scrolled ? "mt-0.5 opacity-0 max-h-0" : "mt-2 opacity-100 max-h-4"
            }`}
          >
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
                placeholder="Search sarees, weaves, occasionsâ€¦"
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

      {/* Category row (desktop only) */}
      <div className="hidden border-t border-gold/50 lg:block">
        <nav
          className="mx-auto flex max-w-[1400px] items-center justify-center gap-10 overflow-x-auto px-4 py-2.5"
          aria-label="Categories"
        >
          {CATEGORY_ROW.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: false }}
              className={`whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.16em] text-ink/70 transition-colors hover:text-maroon ${
                pathname === item.to || pathname.startsWith(item.to)
                  ? "text-maroon"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Search overlay (mobile) */}
      {searchOpen && (
        <div className="border-t border-gold/50 bg-ivory/95 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-taupe" />
            <input
              autoFocus
              ref={searchInputRef}
              type="search"
              placeholder="Search sarees, weaves, occasionsâ€¦"
              className="flex-1 bg-transparent text-sm text-ink placeholder:text-taupe/70 focus:outline-none"
            />
            <button
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="text-taupe hover:text-maroon"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      <div
        id="mobile-drawer"
        className={`fixed inset-0 z-50 lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-drawer-title"
          tabIndex={-1}
          className={`absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-ivory shadow-2xl transition-transform duration-300 ease-out focus:outline-none ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-gold/50 px-5 py-4">
            <Link
              to="/"
              id="mobile-drawer-title"
              className="flex items-center"
              aria-label="Mumbai Bazar â€” home"
            >
              <img src="/logo.png" alt="Mumbai Bazar Logo" className="h-16 object-contain -my-2" />
            </Link>
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="grid h-9 w-9 place-items-center text-ink hover:text-maroon"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto" aria-label="Mobile primary">
            <ul className="flex flex-col">
              <li>
                <Link
                  to="/"
                  activeOptions={{ exact: true }}
                  className={`flex items-center justify-between border-b border-gold/50 px-5 py-3.5 font-serif text-base text-ink transition-colors hover:bg-beige/30 ${
                    pathname === "/" ? "text-maroon" : ""
                  }`}
                >
                  Home
                  <span className="text-gold-deep text-xs">â†’</span>
                </Link>
              </li>
              {PRIMARY_LEFT.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    activeOptions={{ exact: item.to === "/shop" ? false : true }}
                    className={`flex items-center justify-between border-b border-gold/50 px-5 py-3.5 font-serif text-base transition-colors hover:bg-beige/30 ${
                      pathname === item.to || pathname.startsWith(item.to)
                        ? "text-maroon"
                        : "text-ink"
                    }`}
                  >
                    {item.label}
                    <span className="text-gold-deep text-xs">â†’</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="border-b border-gold/50 px-5 py-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-taupe">
                Shop by Category
              </p>
              <ul className="flex flex-col gap-2">
                {CATEGORY_ROW.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      activeOptions={{ exact: false }}
                      className={`text-sm uppercase tracking-wider transition-colors hover:text-maroon ${
                        pathname === item.to || pathname.startsWith(item.to)
                          ? "text-maroon"
                          : "text-ink/80"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-5 py-6 space-y-4 text-sm text-ink">
              <button className="flex w-full items-center gap-3 hover:text-maroon">
                <User className="h-4 w-4" /> Sign in
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  openCart();
                }}
                className="flex w-full items-center gap-3 hover:text-maroon"
              >
                <ShoppingBag className="h-4 w-4" /> Shopping Bag
                {cartCount > 0 && (
                  <span className="ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-maroon px-1.5 text-[10px] text-ivory">
                    {cartCount}
                  </span>
                )}
              </button>
              <a
                href="https://wa.me/919999999999?text=Hi%20Mumbai%20Bazar"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 hover:text-maroon"
              >
                <Phone className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
