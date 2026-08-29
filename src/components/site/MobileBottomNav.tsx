import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, Heart, ShoppingBag, MessageCircle, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";

export function MobileBottomNav() {
  const { count: cartCount, openCart } = useCart();
  const { wishlist, openWishlist } = useWishlist();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";

  const handleOpenCategories = () => {
    window.dispatchEvent(new CustomEvent("mb:open-drawer"));
  };

  const handleOpenChatbot = () => {
    // Open the Saree Stylist AI chatbot
    window.dispatchEvent(new CustomEvent("mb:open-chatbot"));
  };

  return (
    <div
      aria-label="Mobile app navigation"
      className="fixed bottom-0 left-0 right-0 z-40 block lg:hidden border-t border-gold/40 bg-ivory/95 backdrop-blur-xl shadow-[0_-6px_25px_rgba(100,31,42,0.09)] transition-all duration-300 pb-[env(safe-area-inset-bottom,0px)]"
    >
      <nav className="mx-auto flex max-w-md items-center justify-around px-2 py-1.5">
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors ${
            isHome ? "text-maroon" : "text-ink/65 hover:text-maroon"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="mt-1 text-[10px] font-bold tracking-wider uppercase">Home</span>
        </Link>

        {/* 2. Categories Drawer */}
        <button
          onClick={handleOpenCategories}
          className="flex flex-1 flex-col items-center justify-center py-1 text-ink/65 hover:text-maroon transition-colors"
          aria-label="Open categories menu"
        >
          <LayoutGrid className="h-5 w-5" />
          <span className="mt-1 text-[10px] font-bold tracking-wider uppercase">Categories</span>
        </button>

        {/* 3. Wishlist */}
        <button
          onClick={openWishlist}
          className="relative flex flex-1 flex-col items-center justify-center py-1 text-ink/65 hover:text-maroon transition-colors"
          aria-label={`Wishlist with ${wishlist.length} saved items`}
        >
          <div className="relative">
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-2 grid h-4 min-w-4 place-items-center rounded-full bg-gold-deep px-1 text-[8px] font-bold text-ivory shadow-sm">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="mt-1 text-[10px] font-bold tracking-wider uppercase">Wishlist</span>
        </button>

        {/* 4. Bag / Cart */}
        <button
          onClick={openCart}
          className="relative flex flex-1 flex-col items-center justify-center py-1 text-ink/65 hover:text-maroon transition-colors"
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
          <span className="mt-1 text-[10px] font-bold tracking-wider uppercase">Bag</span>
        </button>

        {/* 5. Personal Stylist / WhatsApp */}
        <button
          onClick={handleOpenChatbot}
          className="flex flex-1 flex-col items-center justify-center py-1 text-maroon hover:text-wine transition-colors"
          aria-label="Ask Saree Stylist"
        >
          <div className="relative">
            <Sparkles className="h-5 w-5 animate-pulse text-gold-deep" />
          </div>
          <span className="mt-1 text-[10px] font-bold tracking-wider uppercase text-maroon">
            Stylist
          </span>
        </button>
      </nav>
    </div>
  );
}
