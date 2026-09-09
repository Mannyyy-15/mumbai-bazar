import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  addToShopifyCart,
  createShopifyCart,
  removeFromShopifyCart,
  shopifyConfigured,
  updateShopifyCartLine,
  type ShopifyCart,
} from "./shopify";

export type CartItem = {
  id: string;
  name: string;
  price: number; // numeric rupees
  priceLabel: string; // display string e.g. "₹ 24,500"
  image: string;
  weave?: string;
  color?: string;
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
  /** Id of the item most recently added, so a card can confirm the click. */
  lastAddedId: string | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "mb_cart_v2";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [shopifyCartId, setShopifyCartId] = useState<string | undefined>();
  const [checkoutUrl, setCheckoutUrl] = useState<string | undefined>();
  /**
   * The cart id as of *now*, not as of the last render. `addItem` is captured in
   * a useMemo, so two clicks in the same tick both see `shopifyCartId === undefined`
   * and each call createShopifyCart — creating two carts and losing the first
   * line. The ref is written synchronously, so the second click sees the first
   * cart. `cartCreation` holds the in-flight promise for the same reason.
   */
  const cartIdRef = useRef<string | undefined>(undefined);
  const cartCreationRef = useRef<Promise<ShopifyCart> | null>(null);
  /** Signals a successful add so the UI can confirm it. */
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Clean up legacy storage key from pre-subdomain migration
      localStorage.removeItem("mb_cart_v1");

      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw);
        if (Array.isArray(stored)) {
          setItems(stored);
        } else {
          setItems(stored.items ?? []);
          // Only keep checkout URL if it doesn't point to old www domain
          if (stored.checkoutUrl && !stored.checkoutUrl.includes("www.mumbaibazar.com")) {
            setShopifyCartId(stored.shopifyCartId);
            cartIdRef.current = stored.shopifyCartId;
            setCheckoutUrl(stored.checkoutUrl);
          }
        }
      }
    } catch {
      // Corrupt or unavailable storage (private mode, quota): start with an
      // empty cart rather than blocking hydration.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, shopifyCartId, checkoutUrl }));
    } catch {
      // Storage full or blocked — the cart still works for this session.
    }
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
      lastAddedId,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((v) => !v),
      addItem: (item, qty = 1) => {
        setItems((prev) => {
          const isMatch = (p: CartItem) =>
            p.shopifyVariantId && item.shopifyVariantId
              ? p.shopifyVariantId === item.shopifyVariantId
              : p.id === item.id && p.color === item.color;

          const found = prev.find(isMatch);
          if (found) return prev.map((p) => (isMatch(p) ? { ...p, qty: p.qty + qty } : p));
          return [...prev, { ...item, qty }];
        });

        // Confirm optimistically. The local cart is the source of truth for the
        // UI; a Shopify failure must not make a successful add look broken.
        setLastAddedId(item.id);

        if (!shopifyConfigured || !item.shopifyVariantId) return;
        const variantId = item.shopifyVariantId;

        const applyCart = (cart: ShopifyCart) => {
          cartIdRef.current = cart.id;
          setShopifyCartId(cart.id);
          setCheckoutUrl(cart.checkoutUrl);
          setItems((prev) =>
            prev.map((line) => {
              const remote = cart.lines.find((r) => r.merchandiseId === line.shopifyVariantId);
              // Only reconcile lines Shopify actually knows about. Rewriting
              // every line from a partial response wiped quantities for items
              // whose sync had not landed yet.
              return remote ? { ...line, lineId: remote.id, qty: remote.quantity } : line;
            }),
          );
        };

        const existingId = cartIdRef.current;
        if (existingId) {
          addToShopifyCart(existingId, variantId, qty)
            .then(applyCart)
            .catch(() => {
              // If the existing cart was invalid or expired, gracefully create a fresh one
              createShopifyCart(variantId, qty)
                .then(applyCart)
                .catch(() => undefined);
            });
          return;
        }

        // No cart yet. Queue behind any creation already in flight so two quick
        // clicks share one cart instead of racing to create two.
        if (cartCreationRef.current) {
          cartCreationRef.current = cartCreationRef.current
            .then((cart) => addToShopifyCart(cart.id, variantId, qty))
            .then((cart) => {
              applyCart(cart);
              return cart;
            })
            .catch(() =>
              createShopifyCart(variantId, qty).then((cart) => {
                applyCart(cart);
                return cart;
              }),
            );
        } else {
          cartCreationRef.current = createShopifyCart(variantId, qty).then((cart) => {
            applyCart(cart);
            return cart;
          });
        }
        cartCreationRef.current.catch(() => {
          cartCreationRef.current = null;
        });
      },
      removeItem: (id) => {
        const existing = items.find((item) => item.id === id);
        const remaining = items.filter((p) => p.id !== id);
        setItems(remaining);
        const cartId = cartIdRef.current ?? shopifyCartId;
        if (remaining.length === 0) {
          cartIdRef.current = undefined;
          cartCreationRef.current = null;
          setShopifyCartId(undefined);
          setCheckoutUrl(undefined);
        } else if (cartId && existing?.lineId) {
          removeFromShopifyCart(cartId, existing.lineId).catch(() => undefined);
        }
      },
      setQty: (id, qty) => {
        const existing = items.find((item) => item.id === id);
        const cartId = cartIdRef.current ?? shopifyCartId;
        if (qty <= 0) {
          const remaining = items.filter((p) => p.id !== id);
          setItems(remaining);
          if (remaining.length === 0) {
            cartIdRef.current = undefined;
            cartCreationRef.current = null;
            setShopifyCartId(undefined);
            setCheckoutUrl(undefined);
          } else if (cartId && existing?.lineId) {
            removeFromShopifyCart(cartId, existing.lineId).catch(() => undefined);
          }
        } else {
          setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));
          if (cartId && existing?.lineId) {
            updateShopifyCartLine(cartId, existing.lineId, qty).catch(() => undefined);
          }
        }
      },
      clear: () => {
        setItems([]);
        cartIdRef.current = undefined;
        cartCreationRef.current = null;
        setShopifyCartId(undefined);
        setCheckoutUrl(undefined);
      },
    };
  }, [items, isOpen, checkoutUrl, shopifyCartId, lastAddedId]);

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
