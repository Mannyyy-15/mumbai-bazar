import { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/lib/site-data";

type WishlistContextType = {
  wishlist: Product[];
  toggleWishlist: (p: Product) => void;
  isInWishlist: (id: string) => boolean;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  openWishlist: () => void;
  closeWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

const STORAGE_KEY = "mumbai_bazar_wishlist_v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch {
      // Storage unavailable
    }
    setHydrated(true);
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist to localStorage", e);
    }
  }, [wishlist, hydrated]);

  const toggleWishlist = (p: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === p.id);
      if (exists) {
        return prev.filter((item) => item.id !== p.id);
      }
      return [...prev, p];
    });
  };

  const isInWishlist = (id: string) => wishlist.some((item) => item.id === id);
  const openWishlist = () => setIsOpen(true);
  const closeWishlist = () => setIsOpen(false);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        isOpen,
        setIsOpen,
        openWishlist,
        closeWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
