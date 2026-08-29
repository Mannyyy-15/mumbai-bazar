import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { addToShopifyCart, createShopifyCart, removeFromShopifyCart, shopifyConfigured, updateShopifyCartLine } from "./shopify";

export type CartItem = {
  id: string;
  name: string;
  price: number; // numeric rupees
  priceLabel: string; // display string e.g. "₹ 24,500"
  image: string;
  weave?: string;
  qty: number;
  shopifyVariantId?: string;
  lineId?: string;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  count: number;
  subtotal: number;
  checkoutUrl?: string;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "mb_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [shopifyCartId, setShopifyCartId] = useState<string | undefined>();
  const [checkoutUrl, setCheckoutUrl] = useState<string | undefined>();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw);
        if (Array.isArray(stored)) setItems(stored);
        else {
          setItems(stored.items ?? []);
          setShopifyCartId(stored.shopifyCartId);
          setCheckoutUrl(stored.checkoutUrl);
        }
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, shopifyCartId, checkoutUrl }));
    } catch {}
  }, [items, shopifyCartId, checkoutUrl, hydrated]);

  // Lock scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    return {
      items,
      isOpen,
      count,
      subtotal,
      checkoutUrl,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((v) => !v),
      addItem: (item, qty = 1) => {
        setItems((prev) => {
          const found = prev.find((p) => p.id === item.id);
          if (found) return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + qty } : p));
          return [...prev, { ...item, qty }];
        });
        if (shopifyConfigured && item.shopifyVariantId) {
          const sync = shopifyCartId
            ? addToShopifyCart(shopifyCartId, item.shopifyVariantId, qty)
            : createShopifyCart(item.shopifyVariantId, qty);
          sync.then((cart) => {
            setShopifyCartId(cart.id); setCheckoutUrl(cart.checkoutUrl);
            setItems((prev) => prev.map((line) => {
              const remote = cart.lines.find((r) => r.merchandiseId === line.shopifyVariantId);
              return remote ? { ...line, lineId: remote.id, qty: remote.quantity } : line;
            }));
          }).catch(() => undefined);
        }
      },
      removeItem: (id) => {
        const existing = items.find((item) => item.id === id);
        setItems((prev) => prev.filter((p) => p.id !== id));
        if (shopifyCartId && existing?.lineId) removeFromShopifyCart(shopifyCartId, existing.lineId).catch(() => undefined);
      },
      setQty: (id, qty) => {
        const existing = items.find((item) => item.id === id);
        setItems((prev) =>
          qty <= 0 ? prev.filter((p) => p.id !== id) : prev.map((p) => (p.id === id ? { ...p, qty } : p))
        );
        if (shopifyCartId && existing?.lineId) {
          if (qty <= 0) removeFromShopifyCart(shopifyCartId, existing.lineId).catch(() => undefined);
          else updateShopifyCartLine(shopifyCartId, existing.lineId, qty).catch(() => undefined);
        }
      },
      clear: () => setItems([]),
    };
  }, [items, isOpen, checkoutUrl, shopifyCartId]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export function parsePriceToNumber(price?: string | number | null): number {
  if (typeof price === "number") return price;
  if (!price || typeof price !== "string") return 0;
  const digits = price.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

export function formatINR(n: number): string {
  return "₹ " + n.toLocaleString("en-IN");
}
