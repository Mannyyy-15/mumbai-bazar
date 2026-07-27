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
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist to localStorage", e);
    }
  }, [wishlist]);

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
