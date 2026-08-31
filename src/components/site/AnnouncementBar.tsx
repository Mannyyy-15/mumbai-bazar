import { MessageCircle } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-maroon text-ivory">
      <div className="mx-auto flex max-w-[1360px] items-center justify-center gap-4 px-4 py-2 text-[11px] font-medium tracking-[0.22em] uppercase sm:justify-between">
        {/*
          Was "Assured Authenticity" — a guarantee the business has no
          certification process behind. "8 stores since 2009" is a fact, and a
          better one: it is the thing competitors on the western line cannot say.
        */}
        <span className="hidden sm:block text-ivory/95 font-semibold">8 Stores Since 2009</span>
        <span className="text-center text-ivory font-semibold">
          Festive Edit Now Live · Complimentary Shipping Across India
        </span>
        <a
          href="https://wa.me/918956664631?text=Hi%20Mumbai%20Bazar"
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
