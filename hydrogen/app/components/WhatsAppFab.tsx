import { MessageCircle } from "lucide-react";

export function WhatsAppFab() {
  return (
    <a
      href="https://wa.me/918956664631?text=Hi%20Mumbai%20Bazar%2C%20I%20want%20to%20enquire%20about%20sarees"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="hidden md:flex fixed bottom-6 right-6 z-40 h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#20ba5a] focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
    >
      <MessageCircle className="h-7 w-7 fill-white" />
    </a>
  );
}
