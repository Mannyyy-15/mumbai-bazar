import { MessageCircle } from "lucide-react";

export function WhatsAppFab() {
  return (
    <a
      id="whatsapp"
      href="#"
      aria-label="Chat with a saree expert on WhatsApp"
      className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full bg-maroon px-4 py-3 text-ivory shadow-[0_10px_30px_-10px_rgba(66,23,30,0.6)] hover:bg-wine transition-colors md:px-5"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden md:inline text-[11px] tracking-[0.22em] uppercase">Saree Expert</span>
    </a>
  );
}
