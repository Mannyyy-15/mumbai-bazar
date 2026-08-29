import { useState, useEffect, useRef } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Sparkles, LayoutGrid, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function MobileBottomNav() {
  const { count: cartCount, openCart } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;

      // Always show when near the top of the page
      if (currentScrollY < 40) {
        setVisible(true);
      } else if (Math.abs(diff) > 6) {
        // Scrolling from top to bottom (down): show
        if (diff > 0) {
          setVisible(true);
        } else {
          // Scrolling from bottom to top (up): hide
          setVisible(false);
        }
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";
  const isShop = pathname === "/shop";
  const isCollections = pathname === "/collections";

  return (
    <div
      aria-label="Mobile navigation"
      className={`fixed bottom-0 left-0 right-0 z-40 block lg:hidden border-t border-gold/40 bg-ivory/95 backdrop-blur-xl shadow-[0_-6px_25px_rgba(100,31,42,0.12)] transition-transform duration-300 ease-in-out pb-[env(safe-area-inset-bottom,0px)] ${
        visible ? "translate-y-0" : "translate-y-full pointer-events-none"
      }`}
    >
      <nav className="mx-auto grid grid-cols-4 max-w-md items-center px-1 py-1.5">
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isHome ? "text-maroon font-bold" : "text-ink/65 hover:text-maroon"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="mt-1 text-[10px] font-semibold tracking-wider uppercase">Home</span>
        </Link>

        {/* 2. Shop */}
        <Link
          to="/shop"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isShop ? "text-maroon font-bold" : "text-ink/65 hover:text-maroon"
          }`}
        >
          <Sparkles className="h-5 w-5" />
          <span className="mt-1 text-[10px] font-semibold tracking-wider uppercase">Shop</span>
        </Link>

        {/* 3. Categories (Directly opens collections page) */}
        <Link
          to="/collections"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isCollections ? "text-maroon font-bold" : "text-ink/65 hover:text-maroon"
          }`}
        >
          <LayoutGrid className="h-5 w-5" />
          <span className="mt-1 text-[10px] font-semibold tracking-wider uppercase">Categories</span>
        </Link>

        {/* 4. Cart */}
        <button
          onClick={openCart}
          className="relative flex flex-col items-center justify-center py-1 text-ink/65 hover:text-maroon transition-colors"
          aria-label={`Shopping bag with ${cartCount} items`}
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 grid h-4 min-w-4 place-items-center rounded-full bg-maroon px-1 text-[8px] font-bold text-ivory shadow-sm">
                {cartCount}
              </span>
            )}
          </div>
          <span className="mt-1 text-[10px] font-semibold tracking-wider uppercase">Cart</span>
        </button>
      </nav>
    </div>
  );
}
