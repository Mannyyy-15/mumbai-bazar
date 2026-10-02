import { useState, useEffect } from "react";
import { Link } from "react-router";
import { X, Sparkles, Clock, ArrowRight } from "lucide-react";

export function SaleAlertPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: "03", minutes: "45", seconds: "00" });

  useEffect(() => {
    // 4-hour auto-refreshing countdown timer
    const updateTimer = () => {
      const now = new Date();
      const period = 4 * 60 * 60 * 1000;
      const msLeft = period - (now.getTime() % period);
      const totalSeconds = Math.floor(msLeft / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      setTimeLeft({
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    // Show popup after 1.5s delay if not dismissed in current session
    const seen = typeof window !== "undefined" ? sessionStorage.getItem("mb_festive_sale_seen") : "true";
    if (!seen) {
      const timeout = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("mb_festive_sale_seen", "true");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md bg-[#FFFDF9] rounded-2xl border-2 border-[#A27633]/50 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)] text-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative gold top bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-gold via-maroon to-gold" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close sale notification"
          className="absolute top-3.5 right-3.5 grid h-9 w-9 place-items-center rounded-full text-maroon/70 hover:text-maroon hover:bg-maroon/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-maroon/10 border border-maroon/30 text-maroon text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
          <Sparkles className="h-3.5 w-3.5 text-gold-deep" />
          <span>Festive Sale Live</span>
        </div>

        {/* Heading */}
        <h2 className="font-serif text-3xl sm:text-4xl text-maroon font-normal leading-tight">
          Flat 50% – 60% Off
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-ink/80 font-medium leading-relaxed">
          Exclusive discounts on Pure Silk Sarees, Banarasi, Kanjivaram, and Bridal Collections across all 8 Mumbai stores & online.
        </p>

        {/* Auto-refreshing 4-Hour Countdown Box */}
        <div className="my-5 rounded-xl border border-maroon/20 bg-[#FBF7F2] p-3">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-maroon mb-2">
            <Clock className="h-3.5 w-3.5 text-red-600" />
            <span>Offer Resets In:</span>
          </div>
          <div className="flex items-center justify-center gap-2 font-mono text-sm font-bold text-maroon">
            <div className="flex flex-col items-center">
              <span className="bg-maroon text-white px-2.5 py-1 rounded-md shadow-xs">{timeLeft.hours}</span>
              <span className="text-[9px] uppercase tracking-wider text-taupe mt-0.5">Hours</span>
            </div>
            <span className="text-base text-maroon font-bold -mt-3">:</span>
            <div className="flex flex-col items-center">
              <span className="bg-maroon text-white px-2.5 py-1 rounded-md shadow-xs">{timeLeft.minutes}</span>
              <span className="text-[9px] uppercase tracking-wider text-taupe mt-0.5">Mins</span>
            </div>
            <span className="text-base text-maroon font-bold -mt-3">:</span>
            <div className="flex flex-col items-center">
              <span className="bg-maroon text-white px-2.5 py-1 rounded-md shadow-xs">{timeLeft.seconds}</span>
              <span className="text-[9px] uppercase tracking-wider text-taupe mt-0.5">Secs</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to="/shop"
          onClick={handleClose}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-maroon py-3.5 px-6 text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-wine active:scale-98 transition-all shadow-md"
        >
          <span>Claim Offer & Shop Now</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        {/* Reassurance Subtext */}
        <p className="mt-3 text-[10px] text-ink/65 uppercase tracking-wider font-semibold">
          100% Free Express Delivery Across India · Cash on Delivery Available
        </p>
      </div>
    </div>
  );
}
