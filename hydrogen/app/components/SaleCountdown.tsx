import { useState, useEffect } from "react";
import { Clock, ShieldCheck, Flame } from "lucide-react";

export function SaleCountdown() {
  const [timeLeft, setTimeLeft] = useState({ hours: "03", minutes: "45", seconds: "00" });

  useEffect(() => {
    // 4-hour auto-refreshing countdown
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
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-5 rounded-2xl border border-maroon/20 bg-[#FBF7F2] p-4 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-maroon flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-red-600 fill-red-600/20" />
            <span>Festive Offer Ends In</span>
          </span>
        </div>

        {/* Countdown Digits */}
        <div className="flex items-center gap-1 font-mono font-bold text-xs text-maroon">
          <span className="bg-maroon text-white px-2 py-1 rounded-md shadow-xs">{timeLeft.hours}h</span>
          <span>:</span>
          <span className="bg-maroon text-white px-2 py-1 rounded-md shadow-xs">{timeLeft.minutes}m</span>
          <span>:</span>
          <span className="bg-maroon text-white px-2 py-1 rounded-md shadow-xs">{timeLeft.seconds}s</span>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px] text-ink/75 pt-2.5 border-t border-maroon/10">
        <span className="font-medium">
          High Demand: <strong className="text-maroon font-bold">Only 2 pieces left</strong> in stock
        </span>
        <span className="text-emerald-700 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
          <span>Guaranteed Authentic</span>
        </span>
      </div>
    </div>
  );
}
