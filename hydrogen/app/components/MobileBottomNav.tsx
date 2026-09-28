import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import { Store, Home, LayoutGrid, ShoppingBag } from "lucide-react";
import { useAside } from "~/components/Aside";

export function MobileBottomNav({ cartCount = 0 }: { cartCount?: number }) {
  const { open } = useAside();
  const location = useLocation();
  const pathname = location.pathname;

  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;

      if (currentScrollY < 40) {
        setVisible(true);
      } else if (Math.abs(diff) > 6) {
        if (diff > 0) {
          setVisible(true);
        } else {
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

  if (pathname.startsWith("/products/")) {
    return null;
  }

  return (
    <div
      aria-label="Mobile navigation"
      className={`fixed bottom-0 left-0 right-0 z-40 block lg:hidden border-t border-gold/40 bg-ivory/95 backdrop-blur-xl shadow-[0_-6px_25px_rgba(100,31,42,0.12)] transition-transform duration-300 ease-in-out pb-[env(safe-area-inset-bottom,0px)] ${
        visible ? "translate-y-0" : "translate-y-full pointer-events-none"
      }`}
    >
      <nav className="mx-auto grid grid-cols-4 max-w-md items-center px-1 py-1.5">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isHome ? "text-maroon font-bold" : "text-ink/65 hover:text-maroon"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="mt-1 text-[10px] font-semibold tracking-wider uppercase">Home</span>
        </Link>

        <Link
          to="/shop"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isShop ? "text-maroon font-bold" : "text-ink/65 hover:text-maroon"
          }`}
        >
          <Store className="h-5 w-5" />
          <span className="mt-1 text-[10px] font-semibold tracking-wider uppercase">Shop</span>
        </Link>

        <Link
          to="/collections"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isCollections ? "text-maroon font-bold" : "text-ink/65 hover:text-maroon"
          }`}
        >
          <LayoutGrid className="h-5 w-5" />
          <span className="mt-1 text-[10px] font-semibold tracking-wider uppercase">
            Categories
          </span>
        </Link>

        <button
          onClick={() => open("cart")}
          className="relative flex flex-col items-center justify-center py-1 text-ink/65 hover:text-maroon transition-colors"
          aria-label={`Shopping bag with ${cartCount} items`}
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            {mounted && cartCount > 0 && (
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
