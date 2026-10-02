import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import { X, CheckCircle2, ShoppingBag } from "lucide-react";

type MockPurchase = {
  buyer: string;
  city: string;
  productTitle: string;
  handle: string;
  price: string;
  image: string;
  timeAgo: string;
};

const PURCHASES: MockPurchase[] = [
  {
    buyer: "Pooja S.",
    city: "Pune",
    productTitle: "Meher Banarasi Silk Saree",
    handle: "meher-wine-banarasi-silk-saree",
    price: "₹999",
    image: "/products/meher-wine-1.jpeg",
    timeAgo: "4 minutes ago",
  },
  {
    buyer: "Sneha M.",
    city: "Mumbai",
    productTitle: "Gulabi Shringar Silk Saree",
    handle: "gulabi-shringar-saree",
    price: "₹1,099",
    image: "/products/gulabi-shringar-1.jpeg",
    timeAgo: "9 minutes ago",
  },
  {
    buyer: "Ananya D.",
    city: "Thane",
    productTitle: "Rangrez Royale Crimson Saree",
    handle: "rangrez-royale-saree",
    price: "₹1,299",
    image: "/products/rangrez-royale-1.jpeg",
    timeAgo: "14 minutes ago",
  },
  {
    buyer: "Priya K.",
    city: "Surat",
    productTitle: "Pure Kanjivaram Silk Saree",
    handle: "meher-wine-banarasi-silk-saree",
    price: "₹1,499",
    image: "/products/meher-wine-2.jpeg",
    timeAgo: "21 minutes ago",
  },
  {
    buyer: "Ritu V.",
    city: "Virar",
    productTitle: "Ornate Gold Zari Border Saree",
    handle: "dark-red-butti-saree-with-ornate-gold-zari-border-tassel-pallu",
    price: "₹999",
    image: "/products/gulabi-shringar-2.jpeg",
    timeAgo: "28 minutes ago",
  },
  {
    buyer: "Kavita N.",
    city: "Nalasopara",
    productTitle: "Banarasi Festive Silk Saree",
    handle: "meher-wine-banarasi-silk-saree",
    price: "₹899",
    image: "/products/rangrez-royale-2.jpeg",
    timeAgo: "36 minutes ago",
  },
  {
    buyer: "Sunita P.",
    city: "Vasai",
    productTitle: "Royal Blue Butti Saree",
    handle: "dark-royal-blue-butti-saree-with-ornate-gold-zari-border-tassel-pallu",
    price: "₹1,199",
    image: "/products/meher-wine-3.jpeg",
    timeAgo: "47 minutes ago",
  },
  {
    buyer: "Deepika R.",
    city: "Ahmedabad",
    productTitle: "Gulabi Shringar Embroidered Saree",
    handle: "gulabi-shringar-saree",
    price: "₹1,099",
    image: "/products/gulabi-shringar-3.jpeg",
    timeAgo: "1 hour ago",
  },
];

export function RecentPurchaseToast() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const indexRef = useRef(0);

  const isPdp = location.pathname.startsWith("/products/");
  const isCheckoutOrCart = location.pathname === "/cart";

  useEffect(() => {
    if (dismissed || isCheckoutOrCart) return;

    let active = true;
    let timer: ReturnType<typeof setTimeout>;

    const cycleNext = () => {
      if (!active || dismissed) return;

      setCurrentIndex(indexRef.current % PURCHASES.length);
      indexRef.current += 1;
      setVisible(true);

      // Toast stays visible for 4.5 seconds
      timer = setTimeout(() => {
        setVisible(false);
        // Wait 9–14 seconds before showing the next purchase notification
        timer = setTimeout(cycleNext, 9000 + Math.floor(Math.random() * 5000));
      }, 4500);
    };

    // First appearance after 4 seconds
    timer = setTimeout(cycleNext, 4000);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [dismissed, isCheckoutOrCart]);

  if (isCheckoutOrCart || dismissed) return null;

  const item = PURCHASES[currentIndex];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed z-40 transition-all duration-500 ease-out ${
        isPdp
          ? "bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:bottom-6"
          : "bottom-[calc(4.25rem+env(safe-area-inset-bottom,0px))] md:bottom-6"
      } left-3 right-3 sm:left-auto sm:right-6 sm:w-[350px] ${
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative flex items-center gap-3 rounded-xl border border-[#A27633]/35 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 shadow-[0_12px_32px_rgba(100,31,42,0.18)] hover:shadow-[0_16px_40px_rgba(100,31,42,0.22)] transition-shadow">
        {/* Product Thumbnail */}
        <Link
          to={`/products/${item.handle}`}
          className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-lg border border-gold/30 bg-[#FBF7F2]"
        >
          <img
            src={item.image}
            alt={item.productTitle}
            className="h-full w-full object-cover object-top"
            loading="lazy"
          />
          <span className="absolute bottom-0 inset-x-0 bg-maroon/90 text-[8px] font-bold text-white text-center py-0.5 leading-none">
            {item.price}
          </span>
        </Link>

        {/* Purchase Details */}
        <Link
          to={`/products/${item.handle}`}
          className="flex-1 min-w-0 text-left pr-4"
        >
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-ink">
              {item.buyer}
            </span>
            <span className="text-[11px] text-maroon font-semibold">
              from {item.city}
            </span>
          </div>

          <p className="mt-0.5 text-xs font-bold text-black truncate leading-snug">
            Purchased {item.productTitle}
          </p>

          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="text-[10px] text-taupe font-medium">
              {item.timeAgo}
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 uppercase tracking-wide">
              <CheckCircle2 className="h-3 w-3 stroke-[2.5]" />
              <span>Verified Order</span>
            </span>
          </div>
        </Link>

        {/* Close Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setVisible(false);
            setDismissed(true);
          }}
          aria-label="Dismiss purchase notification"
          className="absolute top-2 right-2 p-1 text-ink/40 hover:text-maroon hover:bg-maroon/10 rounded-full transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
