import { MessageCircle } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-maroon text-ivory">
      <div className="mx-auto flex max-w-[1360px] items-center justify-center gap-4 px-4 py-2 text-[11px] font-medium tracking-[0.22em] uppercase sm:justify-between">
        <span className="hidden sm:block text-ivory/95 font-semibold">Assured Authenticity</span>
        <span className="text-center text-ivory font-semibold">
          Festive Edit Now Live · Complimentary Shipping Across India
        </span>
        <a
          href="https://wa.me/919999999999?text=Hi%20Mumbai%20Bazar"
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-2 text-ivory font-semibold hover:underline sm:inline-flex"
        >
          <MessageCircle className="h-3.5 w-3.5 text-gold" />
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
